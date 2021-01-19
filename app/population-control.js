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

// Todo once stable: move some bits to separate thing?
class PopulationWorker {
  constructor() {
    // const worker = (this.worker = new Worker("population-worker.js"));
  }
}

class Population {
  constructor({ name, description, config, history, knownScores }) {
    const thisPopulation = this,
      worker = (this.worker = new Worker("population-worker.js")),
      page = (this.page = document.createElement("population-page")),
      toggleButton = (this.toggleButton = page.querySelector(".toggle-button")),
      stepButton = (this.stepButton = page.querySelector(".step-button")),
      navButtons = page.querySelector("nav").children,
      // tabs = (this.tabs = page.querySelectorAll("#population-page > div")),
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

    const cipherFunctionImport = (this.cipherFunctionImport = ciphers[
      cipherName
    ].module
      .then(({ MessageDecrypter, KeyToString, KeyToText, TextToKey }) => {
        const textToKey = (this.textToKey = TextToKey(cipherOptions));
        this.messageDecypters = config.messages.map((message) =>
          MessageDecrypter(message, cipherOptions)
        );
        this.keyToText = KeyToText(cipherOptions);
        this.keyToString = KeyToString(cipherOptions);

        page.addEventListener("displayedkeychange", function (e) {
          const keyEntered = textToKey(e.detail);
          if (keyEntered) {
            thisPopulation.displayDecryption(keyEntered);
          } else {
            e.preventDefault();
          }
        });
      })
      .catch((err) => {
        console.log("Error importing cipher functions:", err);
      }));

    worker.onmessage = function () {
      worker.onmessage = function ({ data }) {
        if (data.message == "asset-request") {
          thisPopulation.state = "waiting";
          getAsset(data.directoryPath, data.fileName).then((asset) => {
            worker.postMessage(asset);
            thisPopulation.state = "configuring";
          });
        } else if (data == "config-complete") {
          // Checks cipher functions are imported
          cipherFunctionImport.then(() => {
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
          });
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
    this.openTab = page.querySelector("div.config");
    this.openNavButton = page.querySelector("nav button[data-target='config']");

    for (let navButton of navButtons) {
      const targetTab = page.querySelector(
        "div." + navButton.dataset.target
      );
      navButton.addEventListener("click", function () {
        thisPopulation.openTab.classList.remove("open");
        targetTab.classList.add("open");
        thisPopulation.openTab = targetTab;

        thisPopulation.openNavButton.classList.remove("open");
        this.classList.add("open");
        thisPopulation.openNavButton = this;
      });
    }

    // Name, gen num and description
    page.setAttribute("name", name);
    
    var tempSpan = document.createElement("span");
    tempSpan.slot = "description";
    tempSpan.innerText = description;
    page.appendChild(tempSpan);

    // Cipher config
    tempSpan = document.createElement("span");
    tempSpan.slot = "cipher-name";
    tempSpan.innerText = cipherName;
    page.appendChild(tempSpan);

    tempSpan = document.createElement("span");
    tempSpan.slot = "cipher-options";
    for (let optionName in cipherOptions) {
      const row = document.createElement("tr"),
        nameCell = document.createElement("td"),
        valueCell = document.createElement("td");
      nameCell.innerText = optionName + ":";
      valueCell.innerText = cipherOptions[optionName];

      row.appendChild(nameCell);
      row.appendChild(valueCell);
      cipherOptionsSpan.appendChild(row);
    };
    page.appendChild(tempSpan);

    // Evolution config
    for (let p of ["populationSize", "childrenPerParent", "randomPerGeneration"]) {
      tempSpan = document.createElement("span");
      tempSpan.slot = p
      tempSpan.innerText = evolutionConfig[p];
      page.appendChild(tempSpan);
    };
    tempSpan = document.createElement("span");
    tempSpan.slot = "allowDuplicates";
    tempSpan.innerText = evolutionConfig.allowDuplicates ? "YES" : "NO";

    /* page.populationSize = populationSize;
    page.childrenPerParent = childrenPerParent;
    page.randomPerGeneration = randomPerGeneration;
    page.allowDuplicates = allowDuplicates; */

    // Messages
    for (let message of config.messages) {
      const m = document.createElement("code"),
        d = document.createElement("code");

      m.innerText = message;
      messagesDisplay.appendChild(m);

      d.innerText = "run program to see decryptions";
      keyDecryptions.appendChild(d);
    }

    // Sets up exports
    const {
        copyConfig,
        copyPopulation,
        downloadConfig,
        downloadPopulation,
      } = displayPoints,
      displayMessage = (() => {
        let messages = {};
        return function (button, message, timeOut = 3000) {
          if (messages.hasOwnProperty(button))
            button.classList.remove(messages[button]);
          messages[button] = message;
          button.classList.add(message);
          if (timeOut != null)
            setTimeout(function () {
              button.classList.remove(message);
            }, timeOut);
        };
      })();

    function copyJSON(button, data) {
      displayMessage(button, "preparing");
      navigator.clipboard
        .writeText(JSON.stringify(data))
        .then(() => {
          displayMessage(button, "success");
        })
        .catch((err) => {
          console.log(err);
          displayMessage(button, "failure");
        });
    }

    function downloadJSON(button, name, data) {
      displayMessage(button, "preparing");
      const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        }),
        url = URL.createObjectURL(blob),
        element = document.createElement("a");
      element.download = name;
      element.href = url;
      element.click();
      URL.revokeObjectURL(url);
      displayMessage(button, "success");
    }

    copyConfig.addEventListener("click", function () {
      copyJSON(this, config);
    });

    copyPopulation.addEventListener("click", function () {
      copyJSON(this, thisPopulation.populationInfo);
    });

    downloadConfig.addEventListener("click", function () {
      downloadJSON(this, "config.json", config);
    });

    downloadPopulation.addEventListener("click", function () {
      downloadJSON(this, "population.json", thisPopulation.populationInfo);
    });

    // Adds population page
    populationPages.appendChild(page);
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

  get populationInfo() {
    return {
      name: this.name,
      description: this.description,
      config: this.config,
      history: this.history,
      knownScores: this.knownScores,
    };
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
    this.displayDecryption(
      this.history[this.genNum - 1].candidates[
        this.config.evolution.populationSize - 1
      ]
    );
  }

  openPage() {
    this.page.classList.add("open");
    this.open = true;
  }

  closePage() {
    this.page.classList.remove("open");
    this.open = false;
  }

  displayDecryption(key) {
    const displayPoints = this.displayPoints,
      bestDecryptions = displayPoints.keyDecryptions.children,
      messageDecypters = this.messageDecypters,
      knownScores = this.knownScores,
      keyString = this.keyToString(key);

    displayPoints.keyInput.value = this.keyToText(key);
    displayPoints.keyScore.innerText = knownScores.hasOwnProperty(keyString)
      ? knownScores[keyString]
      : "unknown";

    for (let m = 0, l = messageDecypters.length; m < l; m++)
      bestDecryptions[m].innerText = messageDecypters[m](key);
  }
}

const populations = [],
  numTabs = 3;
var numPopulations = 0,
  openPopulationNum = -1,
  openPopulation = null,
  openButton = null,
  openTab = 0; // which of the config, decryptions and populations pages is open

function setupPopulation(populationData) {
  // console.log(JSON.stringify(populationData));
  const thisPopulationNum = numPopulations++,
    thisPopulation = new Population(populationData),
    button = document.createElement("button");
  populations.push(thisPopulation);

  button.setAttribute("type", "button");
  button.innerText = populationData.name;

  // Sets up event listener to open this population on sidebar button click
  button.addEventListener("click", function () {
    changeOpenPopulation(thisPopulationNum);
  });
  populationButtons.appendChild(button);

  changeOpenPopulation(thisPopulationNum);
}

function changeOpenPopulation(newVal) {
  if (newVal != openPopulationNum) {
    if (0 <= newVal && newVal < numPopulations) {
      openPopulation.closePage();
      populationButtonCollection[openPopulationNum].classList.remove("open");
      openPopulationNum = newVal;
      openPopulation = populations[newVal];
      populationButtonCollection[openPopulationNum].classList.add("open");
      openPopulation.openPage();
    } else return false;
  };
  return openPopulation;
}

function changeOpenTab(newVal) {
  if (newVal != openTab) {
    if (0 <= newVal && newVal < numTabs) {
      openTab = newVal;
    }
  }
}

const display = {
  _redrawInterval: null,
  _redrawTimoutID: null,

  get redrawInterval() { return this._redrawInterval },
  set redrawInterval(newVal) {
    if (this._redrawTimeoutID) clearTimeout(this._redrawTimoutID);
    this._redrawInterval = newVal;
    if (newVal != null) this._redrawLoop(); // null stops the display updating
  },

  _scheduleRedraw() {
    this._redrawTimoutID = setTimeout(this._redrawLoop, this._redrawInterval);
  },

  _redrawLoop() {
    this.redraw();
    this._scheduleRedraw()
  },

  redraw() {
    this._openPopulation.redraw();
  },

  _populations: [], // todo
  _openPopulationNum: -1,
  _openPopulation: null,

  _populationButtons: [],
  _openPopulationButton: null,

  get openPopulationNum() { return this._openPopulationNum },
  set openPopulationNum(newVal) {
    // Checks newVal within range
    if (numPopulations <= newVal || newVal < 0) throw new RangeError("Not enough populations");

    this._openPopulation.closePage();
    this._openPopulationButton.classList.remove("open");

    this._openPopulationNum = newVal;
    const newOpenPopulation = this._openPopulation = this._populations[newVal],
      newOpenButton = this._openButton = this._populationButtons[newVal];

    newOpenPopulation.open(this._openTabNum);
    newOpenButton.classList.add("open");
  },

  addPopulationPage() {
    const newPopulationPage = new PopulationPage();

    this._populations.push(newPopulationPage);

    // uhhhhhhh
  },

  _tabButtons: [], // todo!
  _numTabs: 3,
  _openTabNum: -1,
  _openTabButton: null,

  get openTabNum() { return this._openTabNum },
  set openTabNum(newVal) {
    if (this._numTabs <= newVal || newVal < 0) throw new RangeError("Not enough tabs");

    // Removes highlight from old tab button
    this._openTabButton.close();

    this._openTabNum = newVal;

    // Redraws
    this._openPopulation.open(this._openTabNum);

    // Adds highlight to new tab button
  }
}

// sets the display to redraw
display.redrawInterval = 100;
