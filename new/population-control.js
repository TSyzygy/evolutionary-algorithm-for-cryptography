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
    this.convertKey = cipherKeyConverters[cipherName];

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
    var messageDecrypters = (this.messageDecypters = []);
    const messageDecrypterGenerator = cipherDecrypterGenerators[cipherName];
    for (let message of config.messages) {
      messageDecrypters.push(messageDecrypterGenerator(message, cipherOptions));
      const e = document.createElement("code");
      e.innerText = message;
      messagesDisplay.appendChild(e);
    }

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
   * @param {string} newState
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
    const displayPoints = this.displayPoints,
      {candidates} = this.history[this.genNum - 1],
      bestKey = candidates[0];

    displayPoints.bestKey.innerText = this.convertKey(bestKey);
    displayPoints.bestScore.innerText = this.knownScores[bestKey];
    displayPoints.bestDecryption.innerText = this.messageDecypters[0](bestKey);
  }

  openPage() {
    if (openPopulation) {
      openPopulation.closePage();
    }
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
}

const populations = [];
var openPopulation = null;

/* newPopulation = function (populationData) {
  var population = new Population(populationData);
  populations.push(population);
  return population;
}; */

function setupPopulation(populationData) {
  // console.log(JSON.stringify(populationData));
  var population = new Population(populationData);
  populations.push(population);
  population.openPage();
}

/*
function newPopulation (populationData) {
  var n = populations.length,
      // page = newPopulationPage(),
      // button = newPopulationButton(),
      worker = new Worker("population-worker.js"),
      population = {
        data: populationData,
        state: "opening", // "configuring", "waiting", "idle", "running", "finishing"
        worker
      },
      history = populationData.history;

  // Waits for message from worker to confirm config-ready, then sends the config.
  worker.onmessage = function () {

    // Changes the onmessage function to be ready to receive asset-requests
    worker.onmessage = function ({data: {message, path}}) {

      if (message == "asset-request") {

        population.state = "waiting";

        getAsset(path)
        .then(asset => {
          worker.postMessage(asset);
          population.state = "configuring"
        })

      } else if (message == "config-complete") {

        // Changes the onmessage function to recieve status updates
        worker.onmessage = function ({data: status}) {
          history.push(status);
          // TODO
          if (openPopulation == n) {
            viewPopulation(n);
          }
        };

        population.state = "idle";

      }

    }

    worker.postMessage({instruction: "config", data: populationData});
    population.state = "configuring";

  };

  worker.onerror = e => { throw e };

  // Adds the population to the list of populations
  populations.push(population);

  console.log(population)

  // Opens the population
  // viewPopulation(n)
}

function configurePopulation (n, config) {
  var population = populations[n];
  population.configured = false;
  population.worker.postMessage({
    instruction: "config",
    data: config
  });
  population.data.config = config
}

function stopPopulation (n) {
  var population = populations[n];
  if (population.state == "") {
    population.worker.postMessage("stop");
    population.running = false
  }
}

function stepPopulation (n) {
  var population = populations[n];
  if (population.configured && !population.running) {
    population.worker.postMessage("step");
  }
}
*/
