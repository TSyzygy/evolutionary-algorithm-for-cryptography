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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Population =
/*#__PURE__*/
function () {
  function Population(_ref) {
    var _this = this;

    var name = _ref.name,
        description = _ref.description,
        config = _ref.config,
        history = _ref.history,
        knownScores = _ref.knownScores;

    _classCallCheck(this, Population);

    var thisPopulation = this,
        worker = this.worker = new Worker("population-worker.js"),
        page = this.page = populationPageTemplate.cloneNode(true),
        toggleButton = this.toggleButton = page.querySelector(".toggle-button"),
        stepButton = this.stepButton = page.querySelector(".step-button"),
        navButtons = page.querySelector("nav").children,
        displayPoints = this.displayPoints = Array.prototype.reduce.call(page.querySelectorAll("[data-dp]"), function (t, c) {
      return t[c.dataset.dp] = c, t;
    }, {}),
        messagesDisplay = displayPoints.messages,
        keyDecryptions = displayPoints.keyDecryptions,
        _config$cipher = config.cipher,
        cipherName = _config$cipher.name,
        cipherOptions = _config$cipher.options,
        _config$evolution = config.evolution,
        populationSize = _config$evolution.populationSize,
        childrenPerParent = _config$evolution.childrenPerParent,
        randomPerGeneration = _config$evolution.randomPerGeneration,
        allowDuplicates = _config$evolution.allowDuplicates;
    this.name = name;
    this.config = config;
    this.knownScores = knownScores;
    this.history = history;
    this.open = false;
    this.genNum = history.length;
    this.state = "opening";
    var cipherFunctionImport = this.cipherFunctionImport = ciphers[cipherName].module.then(function (_ref2) {
      var MessageDecrypter = _ref2.MessageDecrypter,
          KeyToString = _ref2.KeyToString,
          KeyToText = _ref2.KeyToText,
          TextToKey = _ref2.TextToKey;
      var textToKey = _this.textToKey = TextToKey(cipherOptions);
      _this.messageDecypters = config.messages.map(function (message) {
        return MessageDecrypter(message, cipherOptions);
      });
      _this.keyToText = KeyToText(cipherOptions);
      _this.keyToString = KeyToString(cipherOptions);
      displayPoints.keyInput.addEventListener("change", function () {
        var keyEntered = textToKey(this.value);

        if (keyEntered) {
          thisPopulation.displayDecryption(keyEntered);
          this.removeAttribute("invalid");
        } else {
          this.setAttribute("invalid", "");
        }
      });
    })["catch"](function (err) {
      console.log("Error importing cipher functions:", err);
    });

    worker.onmessage = function () {
      worker.onmessage = function (_ref3) {
        var data = _ref3.data;

        if (data.message == "asset-request") {
          thisPopulation.state = "waiting";
          getAsset(data.directoryPath, data.fileName).then(function (asset) {
            worker.postMessage(asset);
            thisPopulation.state = "configuring";
          });
        } else if (data == "config-complete") {
          // Checks cipher functions are imported
          cipherFunctionImport.then(function () {
            thisPopulation.state = "idle";

            worker.onmessage = function (_ref4) {
              var _ref4$data = _ref4.data,
                  candidates = _ref4$data.candidates,
                  newKnownScores = _ref4$data.newKnownScores;
              // Adds the newly discovered scores to the knownScores object
              Object.assign(knownScores, newKnownScores);
              history.push({
                candidates: candidates,
                newKnownScores: Object.keys(newKnownScores)
              });
              thisPopulation.genNum++;
              thisPopulation.updatePage();
            };
          });
        }
      };

      var genNum = thisPopulation.genNum;
      worker.postMessage({
        config: config,
        candidates: genNum ? history[genNum - 1].candidates : [],
        // Latest array of candidates, or if new population, an empty list
        knownScores: knownScores
      });
      thisPopulation.state = "configuring";
    };

    worker.onerror = function (e) {
      throw e;
    }; // Control buttons


    toggleButton.addEventListener("click", function () {
      if (thisPopulation.state == "running") {
        thisPopulation.stop();
      } else if (thisPopulation.state == "idle") {
        thisPopulation.run();
      }
    });
    stepButton.addEventListener("click", function () {
      thisPopulation.stop(); // Stop acts as a step
    }); // Nav buttons

    this.openSubPage = page.querySelector("div.config");
    this.openNavButton = page.querySelector("nav button[data-target='config']");
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var navButton = _step.value;
        var targetSubPage = page.querySelector("div." + navButton.dataset.target);
        navButton.addEventListener("click", function () {
          thisPopulation.openSubPage.classList.remove("open");
          targetSubPage.classList.add("open");
          thisPopulation.openSubPage = targetSubPage;
          thisPopulation.openNavButton.classList.remove("open");
          this.classList.add("open");
          thisPopulation.openNavButton = this;
        });
      };

      for (var _iterator = navButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      } // Name, gen num and description

    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    displayPoints.name.innerText = name;
    displayPoints.description.innerText = description; // Cipher config

    displayPoints.cipherName = cipherName;

    for (var optionName in cipherOptions) {
      var row = document.createElement("tr"),
          nameCell = document.createElement("td"),
          valueCell = document.createElement("td");
      nameCell.innerText = optionName + ":";
      valueCell.innerText = cipherOptions[optionName];
      row.appendChild(nameCell);
      row.appendChild(valueCell);
      displayPoints.cipherOptions.appendChild(row);
    } // Evolution config


    displayPoints.populationSize.innerText = populationSize;
    displayPoints.childrenPerParent.innerText = childrenPerParent;
    displayPoints.randomPerGeneration.innerText = randomPerGeneration;
    displayPoints.allowDuplicates.innerText = allowDuplicates ? "YES" : "NO"; // Messages

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = config.messages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var message = _step2.value;
        var m = document.createElement("code"),
            d = document.createElement("code");
        m.innerText = message;
        messagesDisplay.appendChild(m);
        d.innerText = "run program to see decryptions";
        keyDecryptions.appendChild(d);
      } // Sets up exports

    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    var copyConfig = displayPoints.copyConfig,
        copyPopulation = displayPoints.copyPopulation,
        downloadConfig = displayPoints.downloadConfig,
        downloadPopulation = displayPoints.downloadPopulation,
        displayMessage = function () {
      var messages = {};
      return function (button, message) {
        var timeOut = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;
        if (messages.hasOwnProperty(button)) button.classList.remove(messages[button]);
        messages[button] = message;
        button.classList.add(message);
        if (timeOut != null) setTimeout(function () {
          button.classList.remove(message);
        }, timeOut);
      };
    }();

    function copyJSON(button, data) {
      displayMessage(button, "preparing");
      navigator.clipboard.writeText(JSON.stringify(data)).then(function () {
        displayMessage(button, "success");
      })["catch"](function (err) {
        console.log(err);
        displayMessage(button, "failure");
      });
    }

    function downloadJSON(button, name, data) {
      displayMessage(button, "preparing");
      var blob = new Blob([JSON.stringify(data)], {
        type: "application/json"
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
    }); // Adds population page

    populationPages.appendChild(page);
  }
  /**
   * @param {string} newState opening, waiting, configuring, running, or idle
   */


  _createClass(Population, [{
    key: "run",
    value: function run() {
      if (this.state == "idle") {
        this.worker.postMessage(true);
        this.state = "running";
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      this.worker.postMessage(false);
      this.state = "idle";
    }
  }, {
    key: "updatePage",
    value: function updatePage() {
      // TODO
      this.displayDecryption(this.history[this.genNum - 1].candidates[this.config.evolution.populationSize - 1]);
    }
  }, {
    key: "openPage",
    value: function openPage() {
      this.page.classList.add("open");
      this.open = true;
    }
  }, {
    key: "closePage",
    value: function closePage() {
      this.page.classList.remove("open");
      this.open = false;
    }
  }, {
    key: "displayDecryption",
    value: function displayDecryption(key) {
      var displayPoints = this.displayPoints,
          bestDecryptions = displayPoints.keyDecryptions.children,
          messageDecypters = this.messageDecypters,
          knownScores = this.knownScores,
          keyString = this.keyToString(key);
      displayPoints.keyInput.value = this.keyToText(key);
      displayPoints.keyScore.innerText = knownScores.hasOwnProperty(keyString) ? knownScores[keyString] : "unknown";

      for (var m = 0, l = messageDecypters.length; m < l; m++) {
        bestDecryptions[m].innerText = messageDecypters[m](key);
      }
    }
  }, {
    key: "state",
    set: function set(newState) {
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
    },
    get: function get() {
      return this._state;
    }
  }, {
    key: "genNum",
    set: function set(newGenNum) {
      this._genNum = this.displayPoints.genNum.innerText = newGenNum;
    },
    get: function get() {
      return this._genNum;
    }
  }, {
    key: "populationInfo",
    get: function get() {
      return {
        name: this.name,
        description: this.description,
        config: this.config,
        history: this.history,
        knownScores: this.knownScores
      };
    }
  }]);

  return Population;
}();

var populations = [];
var numPopulations = 0,
    openPopulationNum = -1,
    openPopulation = null,
    openButton = null;

function setupPopulation(populationData) {
  // console.log(JSON.stringify(populationData));
  var thisPopulationNum = numPopulations++,
      thisPopulation = new Population(populationData),
      button = document.createElement("button");
  populations.push(thisPopulation);
  button.setAttribute("type", "button");
  button.innerText = populationData.name;

  function openThisPopulation() {
    if (openPopulation) {
      openPopulation.closePage();
      openButton.classList.remove("open");
    }

    ;
    this.classList.add("open");
    openButton = this;
    thisPopulation.openPage();
    openPopulationNum = thisPopulationNum;
    openPopulation = thisPopulation;
    closeSidebar();
  } // Sets up event listener to open this population on sidebar button click


  button.addEventListener("click", openThisPopulation);
  populationButtons.appendChild(button);
  openThisPopulation.call(button);
}