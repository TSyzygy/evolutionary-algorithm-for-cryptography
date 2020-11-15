"use strict";

/* 

{
  data: { // Can be kept when saved/transferred
    name: String,
    description: String,
    config: { // Used by the population-worker
      messages: [
        String, [...]
      ]
      cipher: { // Concerns the cipher score (fitness) function
        name: String,
        options: {
          [any]
        }
      },
      evolution: {
        "populationSize": Number,
        "childrenPerParent": Number,
        "randomPerGeneration": Number,
        "allowDuplicates": Boolean
      }
    },
    history: [
      {
        candidates: Array,
        calculationTime: Number
      },
      [...]
    ],
    knownScores: {key: Number, [...]},
    timeSaved: Number
  },
  configured: false,
  running: false,
  worker: Worker,
}

*/

class Population {
  constructor({ name, description, config, history, knownScores }) {
    const thisPopulation = this,
      worker = (this.worker = new Worker("population-worker.js")),
      page = (this.page = populationPageTemplate.content.firstElementChild.cloneNode(
        true
      )),
      toggleButton = (this.toggleButton = page.querySelector(".toggle-button")),
      stepButton = (this.stepButton = page.querySelector(".step-button")),
      navButtons = page.querySelector("nav").children,
      // subPages = (this.subPages = page.querySelectorAll("#population-page > div")),
      displayPoints = (this.displayPoints = Array.prototype.reduce.call(
        page.querySelectorAll("[data-dp]"),
        (t, c) => ((t[c.dataset.dp] = c), t),
        {}
      )),
      messagesDisplay = displayPoints.messages,
      keyDecryptions = displayPoints.keyDecryptions,
      { name: cipherName, options: cipherOptions } = config.cipher,
      {
        populationSize,
        childrenPerParent,
        randomPerGeneration,
        allowDuplicates,
      } = config.evolution;

    this.name = name;
    this.config = config;
    this.knownScores = knownScores;
    this.history = history;
    this.open = false;
    this.genNum = history.length;
    this.state = "opening";

    worker.onmessage = function () {
      worker.onmessage = function ({ data }) {
        if (data.message == "asset-request") {
          thisPopulation.state = "waiting";
          getAsset(data.path).then((asset) => {
            worker.postMessage(asset);
            thisPopulation.state = "configuring";
          });
        } else if (data == "config-complete") {
          thisPopulation.state = "idle";

          worker.onmessage = function ({
            data: { candidates, newKnownScores },
          }) {
            // Adds the newly discovered scores to the knownScores object
            Object.assign(knownScores, newKnownScores);

            history.push({
              candidates,
              newKnownScores: Object.keys(newKnownScores),
            });

            thisPopulation.genNum++;

            thisPopulation.updatePage();
          };
        }
      };

      var genNum = thisPopulation.genNum;
      worker.postMessage({
        config,
        candidates: genNum ? history[genNum - 1].candidates : [], // Latest array of candidates, or if new population, an empty list
        knownScores,
      });

      thisPopulation.state = "configuring";
    };

    worker.onerror = function (e) {
      throw e;
    };

    // Control buttons
    toggleButton.addEventListener("click", function () {
      if (thisPopulation.state == "running") {
        thisPopulation.stop();
      } else if (thisPopulation.state == "idle") {
        thisPopulation.run();
      }
    });

    stepButton.addEventListener("click", function () {
      thisPopulation.stop(); // Stop acts as a step
    });

    // Nav buttons
    this.openSubPage = page.querySelector("div.config");
    this.openNavButton = page.querySelector("nav button[data-target='config']");

    for (let navButton of navButtons) {
      const targetSubPage = page.querySelector(
        "div." + navButton.dataset.target
      );
      navButton.addEventListener("click", function () {
        thisPopulation.openSubPage.classList.remove("open");
        targetSubPage.classList.add("open");
        thisPopulation.openSubPage = targetSubPage;

        thisPopulation.openNavButton.classList.remove("open");
        this.classList.add("open");
        thisPopulation.openNavButton = this;
      });
    }

    // Name, gen num and description
    displayPoints.name.innerText = name;
    displayPoints.description.innerText = description;

    // Cipher config
    displayPoints.cipherName = cipherName;
    for (let optionName in cipherOptions) {
      const row = document.createElement("tr"),
        nameCell = document.createElement("td"),
        valueCell = document.createElement("td");
      nameCell.innerText = optionName + ":";
      valueCell.innerText = cipherOptions[optionName];

      row.appendChild(nameCell);
      row.appendChild(valueCell);
      displayPoints.cipherOptions.appendChild(row);
    }

    // Evolution config
    displayPoints.populationSize.innerText = populationSize;
    displayPoints.childrenPerParent.innerText = childrenPerParent;
    displayPoints.randomPerGeneration.innerText = randomPerGeneration;
    displayPoints.allowDuplicates.innerText = allowDuplicates ? "YES" : "NO";

    // Messages
    const messageDecrypterGenerator = messageDecrypterGenerators[cipherName],
      messageDecrypters = (this.messageDecypters = []),
      textToKey = (this.textToKey = textToKeyGenerators[cipherName](
        cipherOptions
      ));
    this.keyToText = keyToTextGenerators[cipherName](cipherOptions);

    for (let message of config.messages) {
      const m = document.createElement("code"),
        d = document.createElement("code");

      messageDecrypters.push(messageDecrypterGenerator(message, cipherOptions));

      m.innerText = message;
      messagesDisplay.appendChild(m);

      d.innerText = "run program to see decryptions";
      keyDecryptions.appendChild(d);
    }

    const keyInput = displayPoints.keyInput;
    keyInput.addEventListener("change", function () {
      const keyEntered = textToKey(this.value);
      if (keyEntered) {
        thisPopulation.displayDecryption(keyEntered);
        this.removeAttribute("invalid");
      } else {
        this.setAttribute("invalid", "");
      }
    });

    // Sets up exports
    const {
      copyConfig,
      copyPopulation,
      downloadConfig,
      downloadPopulation,
    } = displayPoints;

    function displayCopyMessage(button, success) {
      const message = success ? "success" : "failure";
      button.classList.add(message);
      setTimeout(function () {
        button.classList.remove(message);
      }, 3000);
    }

    function copyText(button, text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          displayCopyMessage(button, true);
        })
        .catch((err) => {
          console.log(err);
          displayCopyMessage(button, false);
        });
    }

    copyConfig.addEventListener("click", function () {
      copyText(this, JSON.stringify(config));
    });
    copyConfig.removeAttribute("disabled");

    copyPopulation.addEventListener("click", function () {
      copyText(
        this,
        JSON.stringify({
          name: thisPopulation.name, // reference to thisPopulation needed because primitive value, so would be incorrect if changed
          description: thisPopulation.description, // because primitive value
          config,
          history,
          knownScores,
        })
      );
    });
    copyPopulation.removeAttribute("disabled");

    // Adds population page
    populationPages.appendChild(page);

    // Adds sidebar button
    const button = (this.button = document.createElement("button"));
    button.setAttribute("type", "button");
    button.innerText = name;

    // Sets up event listener to open this population on sidebar button click
    button.addEventListener("click", function () {
      thisPopulation.openPage();
    });
    populationButtons.appendChild(button);
  }

  /**
   * @param {string} newState opening, waiting, configuring, running, or idle
   */
  set state(newState) {
    this._state = this.displayPoints.state.innerText = this.page.dataset.state = newState;
    if (newState == "idle") {
      this.toggleButton.removeAttribute("disabled");
      this.stepButton.removeAttribute("disabled");
    } else if (newState == "running") {
      this.toggleButton.removeAttribute("disabled");
      this.stepButton.setAttribute("disabled", "");
    } else {
      this.toggleButton.setAttribute("disabled", "");
      this.stepButton.setAttribute("disabled", "");
    }
  }

  get state() {
    return this._state;
  }

  set genNum(newGenNum) {
    this._genNum = this.displayPoints.genNum.innerText = newGenNum;
  }

  get genNum() {
    return this._genNum;
  }

  run() {
    if (this.state == "idle") {
      this.worker.postMessage(true);
      this.state = "running";
      return true;
    } else {
      return false;
    }
  }

  stop() {
    this.worker.postMessage(false);
    this.state = "idle";
  }

  updatePage() {
    // TODO
    this.displayDecryption(this.history[this.genNum - 1].candidates[0]);
  }

  openPage() {
    if (openPopulation) openPopulation.closePage();
    this.button.classList.add("open");
    this.page.classList.add("open");
    this.open = true;
    openPopulation = this;
    closeSidebar();
  }

  closePage() {
    this.button.classList.remove("open");
    this.page.classList.remove("open");
    this.open = false;
  }

  displayDecryption(key) {
    const displayPoints = this.displayPoints,
      bestDecryptions = displayPoints.keyDecryptions.children,
      messageDecypters = this.messageDecypters;

    displayPoints.keyInput.value = this.keyToText(key);
    displayPoints.keyScore.innerText = this.knownScores[key] || "unknown";

    for (let m = 0; m < messageDecypters.length; m++) {
      bestDecryptions[m].innerText = messageDecypters[m](key);
    }
  }
}

const populations = [];
var openPopulation = null;

function setupPopulation(populationData) {
  // console.log(JSON.stringify(populationData));
  var population = new Population(populationData);
  populations.push(population);
  population.openPage();
}
