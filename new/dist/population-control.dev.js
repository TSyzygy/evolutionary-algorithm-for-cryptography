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
    var name = _ref.name,
        description = _ref.description,
        config = _ref.config,
        history = _ref.history,
        knownScores = _ref.knownScores;

    _classCallCheck(this, Population);

    this.name = name;
    this.config = config;
    this.knownScores = knownScores;
    this.history = history; // Must be object so can be referenced from inside worker.onmessage functions

    var current = this.current = {
      genNum: history.length,
      state: "opening"
    },
        worker = this.worker = new Worker("population-worker.js");

    worker.onmessage = function () {
      worker.onmessage = function (_ref2) {
        var data = _ref2.data;

        if (data.message == "asset-request") {
          current.state = "waiting";
          getAsset(data.path).then(function (asset) {
            worker.postMessage(asset);
            current.state = "configuring";
          });
        } else if (data == "config-complete") {
          current.state = "idle";

          worker.onmessage = function (_ref3) {
            var _ref3$data = _ref3.data,
                candidates = _ref3$data.candidates,
                newKnownScores = _ref3$data.newKnownScores;

            // Adds the newly discovered scores to the knownScores object
            for (var key in newKnownScores) {
              knownScores[key] = newKnownScores[key];
            }

            if (current.state == "finishing") {
              current.state = "idle";
            }

            history.push({
              candidates: candidates,
              newKnownScores: Object.keys(newKnownScores)
            });
            current.genNum++;
          };
        }
      };

      var genNum = current.genNum;
      worker.postMessage({
        config: config,
        candidates: genNum ? history[genNum - 1].candidates : [],
        // Latest array of candidates, or if new population, an empty list
        knownScores: knownScores
      });
      current.state = "configuring";
    };

    worker.onerror = function (e) {
      throw e;
    }; // Adds population page


    this.open = false;
    var page = this.page = populationPageTemplate.content.firstElementChild.cloneNode(true),
        displayPoints = this.displayPoints = Array.prototype.reduce.call(page.querySelectorAll("[data-dp]"), function (t, c) {
      return t[c.dataset.dp] = c, t;
    }, {}),
        _config$cipher = config.cipher,
        cipherName = _config$cipher.name,
        cipherOptions = _config$cipher.options,
        evolutionConfig = config.evolution; // Name and description

    displayPoints.name.innerText = name;
    displayPoints.description.innerText = description; // Cipher config

    displayPoints.cipherName = cipherName;

    for (var optionName in cipherOptions) {
      var p = document.createElement("p"),
          c = document.createElement("code");
      p.innerText = optionName + ": ";
      c.innerText = cipherOptions[optionName];
    } // Evolution config


    displayPoints.populationSize = evolutionConfig.populationSize;
    displayPoints.childrenPerParent = evolutionConfig.childrenPerParent;
    displayPoints.randomPerGeneration = evolutionConfig.randomPerGeneration;
    displayPoints.allowDuplicates = evolutionConfig.allowDuplicates ? "YES" : "NO";
    populationPages.appendChild(page); // Adds sidebar button

    var button = this.button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerText = name; // Sets up event listener to open this population on sidebar button click

    var thisPopulation = this;
    button.addEventListener("click", function () {
      this.classList.add("open");
      thisPopulation.openPage();
    });
    populationButtons.appendChild(button);
  }

  _createClass(Population, [{
    key: "run",
    value: function run() {
      var current = this.current;

      if (current.state == "idle") {
        current.state = "running";
        this.worker.postMessage("run");
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      var current = this.current;

      if (current.state == "running") {
        current.state = "finishing";
        this.worker.postMessage("stop");
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "step",
    value: function step() {
      var current = this.current;

      if (current.state == "idle") {
        current.state = "finishing";
        var worker = this.worker;
        worker.postMessage("run");
        worker.postMessage("stop");
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "updatePage",
    value: function updatePage() {
      // TODO
      var page = this.page,
          displayPoints = this.displayPoints;
    }
  }, {
    key: "openPage",
    value: function openPage() {
      if (openPopulation) {
        openPopulation.closePage();
      }

      ;
      this.page.classList.add("open");
      this.open = true;
      openPopulation = this;
    }
  }, {
    key: "closePage",
    value: function closePage() {
      this.button.classList.remove("open");
      this.page.classList.remove("open");
      this.open = false;
    }
  }]);

  return Population;
}();

var populations = [];
var openPopulation = null;
/* newPopulation = function (populationData) {
  var population = new Population(populationData);
  populations.push(population);
  return population;
}; */

function setupPopulation(populationData) {
  console.log(JSON.stringify(populationData));
  var population = new Population(populationData);
  populations.push(population);
  population.openPage();
}

;
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