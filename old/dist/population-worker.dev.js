"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var languageData = {
  "english": {
    "alphabet": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "ngrams": [{
      "byCharacter": {
        "E": 11.2,
        "T": 9.36,
        "A": 8.50,
        "R": 7.59,
        "I": 7.55,
        "O": 7.51,
        "N": 6.75,
        "S": 6.33,
        "H": 6.09,
        "D": 4.25,
        "L": 4.03,
        "U": 2.76,
        "W": 2.56,
        "M": 2.41,
        "F": 2.23,
        "C": 2.20,
        "G": 2.02,
        "Y": 1.99,
        "P": 1.93,
        "B": 1.49,
        "K": 1.29,
        "V": 0.978,
        "J": 0.153,
        "X": 0.150,
        "Q": 0.095,
        "Z": 0.077
      },
      "byIndex": [8.5, 1.49, 2.2, 4.25, 11.2, 2.23, 2.02, 6.09, 7.55, 0.153, 1.29, 4.03, 2.41, 6.75, 7.51, 1.93, 0.095, 7.59, 6.33, 9.36, 2.76, 0.978, 2.56, 0.15, 1.99, 0.077]
    }]
  }
};
var cipherFunctionGenerators = {
  vigenere: function vigenere(_ref) {
    var message = _ref.message,
        keylength = _ref.keylength,
        fitnessMethod = _ref.fitnessMethod;
    var language = "english",
        alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        alphabetLength = 26,
        scores,
        functions = {};
    message = message.split("").reduce(function (t, c) {
      var i = alphabet.indexOf(c);
      if (i > -1) t.push(i);
      return t;
    }, []); // Generates fitness function

    if (fitnessMethod == "letters") {
      scores = languageData[language].letterFrequencies.byIndex;

      functions.fitness = function (key) {
        return message.reduce(function (t, c, i) {
          return t + scores[(c + key[i % keylength]) % 26];
        });
      };
    } else throw Error("Unrecognised cipherConfig.fitnessMethod" + fitnessMethod); // Generates random candidate function


    functions.randomCandidate = function () {
      var key = [];

      for (var i = 0; i < keylength; i++) {
        key.push(randRange(0, alphabetLength));
      }

      return key;
    }; // Generates permute candidate function


    functions.permuteCandidate = function (key) {
      var permutedKey = _toConsumableArray(key);

      var posToChange = randRange(0, keylength);
      permutedKey[posToChange] += randRange(1, alphabetLength);
      permutedKey[posToChange] %= alphabetLength;
      return permutedKey;
    };

    return functions;
  }
}; // Gets a random number between min and max-1

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

; // POPULATION

var candidates, knownScores, fitness, randomCandidate, permuteCandidate, populationSize, childrenPerParent, randomPerGeneration, allowDuplicates;
var instructions = {
  // (Re)Configure the evolution algorithm
  configure: function configure(_ref2) {
    var _ref2$cipher = _ref2.cipher,
        name = _ref2$cipher.name,
        options = _ref2$cipher.options,
        evolution = _ref2.evolution;

    var _cipherFunctionGenera = cipherFunctionGenerators[name](options);

    fitness = _cipherFunctionGenera.fitness;
    randomCandidate = _cipherFunctionGenera.randomCandidate;
    permuteCandidate = _cipherFunctionGenera.permuteCandidate;
    populationSize = evolution.populationSize;
    childrenPerParent = evolution.childrenPerParent;
    randomPerGeneration = evolution.randomPerGeneration;
    allowDuplicates = evolution.allowDuplicates;
  },
  addCandidate: function addCandidate(candidate) {
    var numCandidates = candidates.length,
        score = newKnownScores[candidate] = knownScores[candidate] = fitness(candidate); // Finds position in ordered list of candidates

    for (var i = 0; i < numCandidates && score > knownScores[candidates[i]]; i++) {
      ;
    } // Adds to candidates list and removes worst candidate if length exceeds maximum


    candidates.splice(i, 0, candidate);
    if (candidates.length > populationSize) candidates.shift();
  },
  // Evolve the population by one generation
  step: function () {
    var newKnownScores,
        evaluateCandidate = function evaluateCandidate(candidate) {
      // If the key is a current candidate and duplicates are allowed, adds to same location in array
      if (candidates.indexOf(candidate) > -1) if (evolutionConfig.allowDuplicates) {
        candidates.splice(candidates.indexOf(candidate), 0, candidate);
        if (candidates.length > evolutionConfig.populationSize) candidates.shift();
      } // Adds the candidate if it has not been evaluated before
      else if (!knownScores.hasOwnProperty(candidate)) {
          addCandidate(candidate);
        } // If the candidate is not currently a candidate but had been in the past, it must be worse than all current candidates so is ignored.
    };

    return function () {
      var random = this.randomPerGeneration;
      newKnownScores = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = candidates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var parent = _step.value;

          for (var _n = 0; _n < childrenPerParent; _n++) {
            evaluateCandidate(permuteCandidate(parent));
          }
        }
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

      for (var n = 0; n < random; n++) {
        evaluateCandidate(randomCandidate());
      }

      postMessage({
        candidates: this.candidates,
        newKnownScores: newKnownScores
      });
    };
  }(),
  // Runs the evolution algorithm until "stop" instruction recieved
  run: function (_run) {
    function run() {
      return _run.apply(this, arguments);
    }

    run.toString = function () {
      return _run.toString();
    };

    return run;
  }(function () {
    step();
    nextGenTimeout = setTimeout(run, 0); // Any new instructions from control (such as "stop") will be dealt with before running next generation
  }),
  stop: function stop() {
    clearTimeout(nextGenTimeout);
  }
};

onmessage = function (_onmessage) {
  function onmessage(_x) {
    return _onmessage.apply(this, arguments);
  }

  onmessage.toString = function () {
    return _onmessage.toString();
  };

  return onmessage;
}(function (_ref3) {
  var _ref3$data = _ref3.data,
      config = _ref3$data.config,
      _ref3$data$candidates = _ref3$data.candidates,
      importCandidates = _ref3$data$candidates === void 0 ? [] : _ref3$data$candidates,
      _ref3$data$knownScore = _ref3$data.knownScores,
      importKnownScores = _ref3$data$knownScore === void 0 ? {} : _ref3$data$knownScore;
  // Initialises population
  configure(config);
  importCandidates.foreach(evaluateCandidate);
  knownScores = importKnownScores;

  while (candidates.length < populationSize) {
    evaluateCandidate(randomCandidate());
  } // In future, all messages are sent as an instruction to be execute, optionally with data.
  // Instruction can be "configure", "step", "run", or "stop".


  onmessage = function onmessage(_ref4) {
    var _ref4$data = _ref4.data,
        instruction = _ref4$data.instruction,
        data = _ref4$data.data;
    instructions[instruction](data);
  };
});
/*
  // If an array is passed as an argument, sets that as the population; if a number is passed, generates that many random keys.
  set candidates (c) {
    if (Array.isArray(c)) {
      for (let candidate of c) {
        this.potentialCandidate(candidate);
      }
    } else if (typeof(c) == "number") {
      this._candidates = [];
      this.genNum = 0;
      for (let n = 0; n < c; n++) {
        this.addRandomCandidate();
      }
    } else {
      throw Error("When setting candidates, provide an array of candidates or a number of candidates to be generated");
    }
  }

  // Returns _candidates property when candidates property is called for
  get candidates () {
    return this._candidates;
  }
  */

/* Inserts a new candidate at the correct position and removes the worst candidate if population size exceeds maximum. Returns the score of that candidate.
  addCandidate (candidate) {
    var candidates = this.candidates,
    numCandidates = candidates.length,
    score = this.knownScores[candidate] = this.fitness(candidate),
    i = 0;

    // Finds position in ordered list of candidates
    while (i < numCandidates && score > this.knownScores[candidates[i]]) i++;

    candidates.splice(i, 0, candidate);
    if (candidates.length > this.populationSize) candidates.shift()

    return score
  }, */

/* Evaluates a potential candidate. Returns the score of the candidate if it had not previously been evaluated, else returns undefined.
function evaluateCandidate (candidate) {

  // If the key is a current candidate and duplicates are allowed, adds to same location in array
  if (candidates.indexOf(candidate) > -1)
    if (evolutionConfig.allowDuplicates) {
      candidates.splice(candidates.indexOf(candidate), 0, candidate);
      if (candidates.length > evolutionConfig.populationSize) candidates.shift()
    }

  // Adds the candidate if it has not been evaluated before
  else if (!knownScores.hasOwnProperty(candidate)) {
    var numCandidates = candidates.length, score = knownScores[candidate] = fitness(candidate), i = 0;

    // Finds position in ordered list of candidates
    while (i < numCandidates && score > knownScores[candidates[i]]) i++;

    // Adds to candidates list and removes worst candidate if length exceeds maximum
    candidates.splice(i, 0, candidate);
    if (candidates.length > populationSize) candidates.shift();

    return score
  }

  // If the candidate is not currently a candidate but had been in the past, it must be worse than all current candidates so is ignored.
}; */

/* Recieves messages from control
onmessage = function (message) {

  var data = message.data, instruction = data.instruction, populationData;

  // Load existing population (config + candidates [+ knownScores])
  if (instruction == "load") {
    populationData = data.populationData;
    population.load(populationData);
  }

  // Evolve the population by one generation
  else if (instruction == "step") step()

  // Start running
  else if (instruction == "run") run()

  // Stop running
  else if (instruction == "stop") stop()

  // Reconfigure the population
  else if (instruction == "config") population.updateConfig(data.config) // only needs to contain the info that is being changed

  // For testing
  else if (instruction == "ping") postMessage(data.pingData)

  else throw Error("Invalid instruction code received")

} */