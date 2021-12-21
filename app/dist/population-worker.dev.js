"use strict"; // IIFE used to prevent worker config functions from changing evolution variables / running internal functions

var getAsset = function () {
  // PRIVATE VARIABLES
  var candidates = [];
  var running = false,
      knownScores = {},
      newKnownScores = {},
      fitness,
      randomCandidate,
      permuteCandidate,
      keyToString,
      populationSize,
      childrenPerParent,
      randomPerGeneration,
      allowDuplicates; // PRIVATE FUNCTIONS

  function evaluateCandidate(candidate) {
    // If the key is a current candidate and duplicates are allowed, adds to same location in array
    var keyString = keyToString(candidate),
        existingLocation = candidates.findIndex(function (match) {
      return keyToString(match) == keyString;
    });

    if (existingLocation > -1) {
      if (allowDuplicates) candidates.splice(existingLocation, 0, candidate);
    } // Adds the candidate if it has not been evaluated before
    // else if (!knownScores.hasOwnProperty(keyString)) {


    var numCandidates = candidates.length,
        score = knownScores[keyString] = fitness(candidate); // Rounds the score to be sent to control to save space in exports

    newKnownScores[keyString] = Math.round(score); // Finds position in ordered list of candidates

    for (var i = 0; i < numCandidates && score > knownScores[keyToString(candidates[i])]; i++) {
      ;
    } // Adds to candidates list and removes worst candidate if length exceeds maximum


    candidates.splice(i, 0, candidate); // }

    if (candidates.length > populationSize) candidates.shift(); // If the candidate is not currently a candidate but had been in the past, it must be worse than all current candidates so is ignored.
  } // Evolve the population by one generation


  function nextGeneration() {
    newKnownScores = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = candidates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var parent = _step.value;

        for (var _n = 0; _n < childrenPerParent; _n++) {
          var child = permuteCandidate(parent);
          evaluateCandidate(child);
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

    for (var n = 0; n < randomPerGeneration; n++) {
      evaluateCandidate(randomCandidate());
    }

    postStatusUpdate();
    if (running) setTimeout(nextGeneration);
  } // Sends a status update to control


  function postStatusUpdate() {
    postMessage({
      candidates: candidates,
      newKnownScores: newKnownScores
    });
  } // When config recieved


  onmessage = function (_onmessage) {
    function onmessage(_x) {
      return _onmessage.apply(this, arguments);
    }

    onmessage.toString = function () {
      return _onmessage.toString();
    };

    return onmessage;
  }(function _callee(_ref) {
    var _ref$data, _ref$data$config, messages, _ref$data$config$ciph, name, options, evolution, importCandidates, importKnownScores, _ref2;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref$data = _ref.data, _ref$data$config = _ref$data.config, messages = _ref$data$config.messages, _ref$data$config$ciph = _ref$data$config.cipher, name = _ref$data$config$ciph.name, options = _ref$data$config$ciph.options, evolution = _ref$data$config.evolution, importCandidates = _ref$data.candidates, importKnownScores = _ref$data.knownScores;
            populationSize = evolution.populationSize;
            childrenPerParent = evolution.childrenPerParent;
            randomPerGeneration = evolution.randomPerGeneration;
            allowDuplicates = evolution.allowDuplicates;
            // Gets cipher functions
            importScripts("ciphers/" + name + "/configure-worker.js");
            _context.next = 8;
            return regeneratorRuntime.awrap(configure(messages, options));

          case 8:
            _ref2 = _context.sent;
            fitness = _ref2.fitness;
            randomCandidate = _ref2.randomCandidate;
            permuteCandidate = _ref2.permuteCandidate;
            keyToString = _ref2.keyToString;
            importCandidates.forEach(evaluateCandidate);
            knownScores = importKnownScores;

            while (candidates.length < populationSize) {
              evaluateCandidate(randomCandidate());
            } // Once config complete, message events toggle the population on/off.


            onmessage = function onmessage(_ref3) {
              var run = _ref3.data;
              running = run;
              nextGeneration();
            };

            postMessage("config-complete");
            postStatusUpdate();

          case 19:
          case "end":
            return _context.stop();
        }
      }
    });
  }); // IIFE for localAssets


  return function () {
    var localAssets = {}; // PUBLIC GETASSET FUNCTION

    return function _callee2(directoryPath, fileName) {
      var directory;
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Navigates to the correct directory in local data
              directory = directoryPath.reduce(function (t, v) {
                return t.hasOwnProperty(v) ? t[v] : t[v] = {};
              }, localAssets);
              return _context2.abrupt("return", directory.hasOwnProperty(fileName) ? directory[fileName] // If the asset is not already stored locally, requests it from control
              : new Promise(function (resolve, _reject) {
                // Waits for a message returning the data
                onmessage = function onmessage(_ref4) {
                  var asset = _ref4.data;
                  // Once asset is recieved from control, saves it locally in case of future use and resolves the promise
                  resolve(directory[fileName] = asset);
                }; // Posts a message requesting the desired data


                postMessage({
                  message: "asset-request",
                  directoryPath: directoryPath,
                  fileName: fileName
                });
              }));

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      });
    };
  }();
}(); // Once initial setup is complete, tells control that it is ready to receive config


postMessage({
  message: "ready-for-config"
});