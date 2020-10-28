"use strict"; // Functions which generate the cipher-specific functions (fitness, randomCandidate and permuteCandidate)
// IIFE

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var cipherFunctionGenerators = function () {
  // Prevents cipherFunctionGenerators from changing the worker's onmessage handler
  var onmessage, globalThis;
  return {
    vigenere: function vigenere(messages, _ref) {
      var keylength, n, convertMessage, alphabet, alphabetLength, scores, scoreMessage, fitness, randomCandidate, permuteCandidate, message;
      return regeneratorRuntime.async(function vigenere$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              keylength = _ref.keylength, n = _ref.n;

              convertMessage = function convertMessage(message) {
                return message.toUpperCase().split("").flatMap(function (c) {
                  var i = alphabet.indexOf(c);
                  return i > -1 ? [i] : [];
                });
              };

              if (1 <= n <= 6) {
                _context.next = 4;
                break;
              }

              throw Error("n out of range");

            case 4:
              alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
              alphabetLength = 26;
              _context.next = 8;
              return regeneratorRuntime.awrap(getAsset("ngrams/" + n + ".json"));

            case 8:
              scores = _context.sent;
              scoreMessage = n > 1 // Ngram score
              ? function (message, key) {} // TODO
              // Letter score
              : function (message, key) {
                return message.reduce(function (t, c, i) {
                  return t + scores[c + key[i % keylength]];
                });
              };

              // If multiple messages provided
              if (messages.length > 1) {
                messages = messages.map(convertMessage); // Converts messages to numerical form

                fitness = function fitness(key) {
                  return messages.reduce(function (t, message) {
                    return t + scoreMessage(message, key);
                  });
                }; // If only one message provided

              } else {
                message = convertMessage(messages[0]);

                fitness = function fitness(key) {
                  return scoreMessage(message, key);
                };
              } // Generates random candidate function


              randomCandidate = function randomCandidate() {
                var key = [];

                for (var i = 0; i < keylength; i++) {
                  key.push(Math.floor(Math.random() * alphabetLength));
                }

                return key;
              }; // Generates permute candidate function


              permuteCandidate = function permuteCandidate(key) {
                // Gets a random number between min and max-1
                function randRange(min, max) {
                  return Math.floor(Math.random() * (max - min)) + min;
                }

                var permutedKey = _toConsumableArray(key);

                var posToChange = randRange(0, keylength);
                permutedKey[posToChange] += randRange(1, alphabetLength);
                permutedKey[posToChange] %= alphabetLength;
                return permutedKey;
              };

              return _context.abrupt("return", {
                fitness: fitness,
                randomCandidate: randomCandidate,
                permuteCandidate: permuteCandidate
              });

            case 14:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  };
}(); // IIFE used to prevent cipherFunctionGenerators from changing evolution variables / running internal functions. The getAsset function is accessible by cipherFunctionGenerators


var _ref2 = function () {
  // PRIVATE VARIABLES
  var running = false,
      candidates = [],
      knownScores = {},
      newKnownScores = {},
      fitness,
      randomCandidate,
      permuteCandidate,
      populationSize,
      childrenPerParent,
      randomPerGeneration,
      allowDuplicates,
      nextGenTimeout; // PRIVATE CONSTANTS

  var localAssets = {}; // PRIVATE FUNCTIONS

  function evaluateCandidate(candidate) {
    // If the key is a current candidate and duplicates are allowed, adds to same location in array
    var existingLocation = candidates.indexOf(candidate);

    if (existingLocation > -1) {
      if (allowDuplicates) {
        candidates.splice(existingLocation, 0, candidate);
        if (candidates.length > evolutionConfig.populationSize) candidates.shift();
      }
    } // Adds the candidate if it has not been evaluated before
    else if (!knownScores.hasOwnProperty(candidate)) {
        var numCandidates = candidates.length,
            score = newKnownScores[candidate] = knownScores[candidate] = fitness(candidate); // Finds position in ordered list of candidates

        for (var i = 0; i < numCandidates && score > knownScores[candidates[i]]; i++) {
          ;
        } // Adds to candidates list and removes worst candidate if length exceeds maximum


        candidates.splice(i, 0, candidate);
        if (candidates.length > populationSize) candidates.shift();
      } // If the candidate is not currently a candidate but had been in the past, it must be worse than all current candidates so is ignored.

  }

  ; // Evolve the population by one generation

  function nextGeneration() {
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

    for (var n = 0; n < randomPerGeneration; n++) {
      evaluateCandidate(randomCandidate());
    }

    postStatusUpdate();
  } // Continues evolving the population until "stop" message received.


  function run() {
    nextGeneration();
    nextGenTimeout = setTimeout(run); // Any new instructions from control (such as "stop") will be dealt with before running next generation
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
  }(function _callee(_ref3) {
    var _ref3$data, _ref3$data$config, messages, _ref3$data$config$cip, name, options, evolution, importCandidates, importKnownScores, _ref4;

    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref3$data = _ref3.data, _ref3$data$config = _ref3$data.config, messages = _ref3$data$config.messages, _ref3$data$config$cip = _ref3$data$config.cipher, name = _ref3$data$config$cip.name, options = _ref3$data$config$cip.options, evolution = _ref3$data$config.evolution, importCandidates = _ref3$data.candidates, importKnownScores = _ref3$data.knownScores;
            populationSize = evolution.populationSize;
            childrenPerParent = evolution.childrenPerParent;
            randomPerGeneration = evolution.randomPerGeneration;
            allowDuplicates = evolution.allowDuplicates;
            _context2.next = 7;
            return regeneratorRuntime.awrap(cipherFunctionGenerators[name](messages, options));

          case 7:
            _ref4 = _context2.sent;
            fitness = _ref4.fitness;
            randomCandidate = _ref4.randomCandidate;
            permuteCandidate = _ref4.permuteCandidate;
            importCandidates.forEach(evaluateCandidate);
            knownScores = importKnownScores;

            while (candidates.length < populationSize) {
              evaluateCandidate(randomCandidate());
            } // Once config complete, message events toggle the population on/off.


            onmessage = function onmessage(_ref5) {
              var instruction = _ref5.data;

              if (running && instruction == "stop") {
                clearTimeout(nextGenTimeout);
              } else if (!running && instruction == "run") {
                run();
              } else {
                console.log("Recieved instruction same as current state");
              }

              running = !running;
            };

            postMessage("config-complete");
            postStatusUpdate();

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    });
  }); // PUBLIC FUNCTIONS


  return {
    getAsset: function getAsset(path) {
      var splitPath, directory, fileName;
      return regeneratorRuntime.async(function getAsset$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              // Navigates to the correct directory in local data
              splitPath = path.split("/");
              directory = splitPath.slice(0, -1).reduce(function (t, v) {
                return t.hasOwnProperty(v) ? t[v] : t[v] = {};
              }, localAssets);
              fileName = splitPath[splitPath.length - 1];
              return _context3.abrupt("return", directory.hasOwnProperty(fileName) ? directory[fileName] // If the asset is not already stored locally, requests it from control
              : new Promise(function (resolve) {
                // Waits for a message returning the data
                onmessage = function onmessage(_ref6) {
                  var asset = _ref6.data;
                  // Once asset is recieved from control, saves it locally in case of future use and resolves the promise
                  resolve(directory[fileName] = asset);
                }; // Posts a message requesting the desired data


                postMessage({
                  message: "asset-request",
                  path: path
                });
              }));

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  };
}(),
    getAsset = _ref2.getAsset; // Once initial setup is complete, tells control that it is ready to receive config


postMessage({
  message: "ready-for-config"
});