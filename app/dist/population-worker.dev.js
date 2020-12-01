"use strict"; // Functions which generate the cipher-specific functions (fitness, randomCandidate and permuteCandidate)
// IIFE

/* const cipherFunctionGenerators = (function () {
  // Prevents cipherFunctionGenerators from changing the worker's onmessage handler
  var onmessage, globalThis;

  return {
    async vigenere(messages, { keylength, n }) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ",
        alphabetLength = 26,
        scores = await getAsset("ngrams/" + n + ".json"),
        convertMessage = (message) =>
          message
            .toUpperCase()
            .split("")
            .flatMap((c) => {
              var i = alphabet.indexOf(c);
              return i > -1 ? [i] : [];
            }),
        scoreMessage =
          n > 1 // Ngram score
            ? function (message, key) {
                const keylength = key.length;
                var gram = [],
                  p = 0,
                  score = 0;
                for (let char of message) {
                  if (gram.length == n) gram.shift();
                  gram.push(alphabet[char + key[p]]);
                  score += scores[gram.join("")] || 0;
                  if (++p == keylength) {
                    p = 0;
                  }
                }
                return score / message.length;
              } // Letter score
            : function (message, key) {
                return 1000 * (
                  message.reduce(
                    (t, c, p) => t + scores[c + key[p % keylength]]
                  ) / message.length
                );
              };

      var fitness, randomCandidate, permuteCandidate, keyToString;

      // If multiple messages provided
      if (messages.length > 1) {
        messages = messages.map(convertMessage);
        // Converts messages to numerical form
        fitness = (key) =>
          messages.reduce((t, message) => t + scoreMessage(message, key));
        // If only one message provided
      } else {
        const message = convertMessage(messages[0]);
        fitness = (key) => scoreMessage(message, key);
      }

      // Generates random candidate function
      randomCandidate = function () {
        var key = [];
        for (let i = 0; i < keylength; i++)
          key.push(Math.floor(Math.random() * alphabetLength));
        return key;
      };

      // Gets a random number between min and max-1
      function randRange(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }

      // Generates permute candidate function
      permuteCandidate = function (key) {
        const permutedKey = [...key];
        permutedKey[randRange(0, keylength)] = randRange(0, alphabetLength);
        return permutedKey;
      };

      keyToString = (key) => key.join(",");

      return {
        fitness,
        randomCandidate,
        permuteCandidate,
        keyToString,
      };
    },

    async monoalphabetic(messages, { n }) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        alphabetLength = 26,
        scores = await getAsset("ngrams/" + n + ".json"),
        convertMessage = (message) =>
          message
            .toUpperCase()
            .split("")
            .flatMap((c) => {
              var i = alphabet.indexOf(c);
              return i > -1 ? [i] : [];
            }),
        scoreMessage = function (message, key) {
          var gram = [],
            score = 0,
            g;
          for (let char of message) {
            if (gram.length == n) gram.shift();
            gram.push(key[char]);
            g = gram.join("");
            if (scores.hasOwnProperty(g)) score += scores[g];
          }
          return score / message.length;
        },
        // Gets a random number between min and max-1
        randRange = function (min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        };

      // Shuffles array in place
      function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
        }
        return a;
      }

      var fitness, randomCandidate, permuteCandidate, keyToString;

      // If multiple messages provided
      if (messages.length > 1) {
        messages = messages.map(convertMessage);
        // Converts messages to numerical form
        fitness = (key) =>
          messages.reduce((t, message) => t + scoreMessage(message, key));
      // If only one message provided
      } else {
        var message = convertMessage(messages[0]);
        fitness = (key) => scoreMessage(message, key);
      }

      // Generates random candidate function
      randomCandidate = () => shuffle(alphabet.split(""));

      // Generates permute candidate function
      permuteCandidate = function (key) {
        const permutedKey = [...key],
          numSwaps = randRange(0, 4);
        for (let n = 0; n < numSwaps; n++) {
          var posA = randRange(0, alphabetLength),
            posB = randRange(0, alphabetLength), // TODO: ensure posA != posB?
            temp = permutedKey[posA];
          permutedKey[posA] = permutedKey[posB];
          permutedKey[posB] = temp;
        }
        return permutedKey;
      };

      keyToString = (key) => key.join("");

      return {
        fitness,
        randomCandidate,
        permuteCandidate,
        keyToString,
      };
    },
  };
})();
*/
// IIFE used to prevent cipherFunctionGenerators from changing evolution variables / running internal functions. The getAsset function is accessible by cipherFunctionGenerators

var _ref = function () {
  // PRIVATE VARIABLES
  var running = false,
      candidates = [],
      knownScores = {},
      newKnownScores = {},
      fitness,
      randomCandidate,
      permuteCandidate,
      keyToString,
      populationSize,
      childrenPerParent,
      randomPerGeneration,
      allowDuplicates; // PRIVATE CONSTANTS

  var localAssets = {}; // PRIVATE FUNCTIONS

  function evaluateCandidate(candidate) {
    // If the key is a current candidate and duplicates are allowed, adds to same location in array
    var keyString = keyToString(candidate),
        existingLocation = candidates.findIndex(function (match) {
      return keyToString(match) == keyString;
    });

    if (existingLocation > -1) {
      if (allowDuplicates) candidates.splice(existingLocation, 0, candidate);
    } // Adds the candidate if it has not been evaluated before
    else if (!knownScores.hasOwnProperty(keyString)) {
        var numCandidates = candidates.length,
            score = knownScores[keyString] = fitness(candidate); // Rounds the score to be sent to control to save space in exports

        newKnownScores[keyString] = Math.round(score); // Finds position in ordered list of candidates

        for (var i = 0; i < numCandidates && score > knownScores[keyToString(candidates[i])]; i++) {
          ;
        } // Adds to candidates list and removes worst candidate if length exceeds maximum


        candidates.splice(i, 0, candidate);
      }

    ;
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
    if (running) setTimeout(nextGeneration);
  }
  /* Continues evolving the population until "stop" message received.
  function run() {
    nextGeneration();
    nextGenTimeout = setTimeout(run); // Any new instructions from control (such as "stop") will be dealt with before running next generation
  } */
  // Sends a status update to control


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
  }(function _callee(_ref2) {
    var _ref2$data, _ref2$data$config, messages, _ref2$data$config$cip, name, options, evolution, importCandidates, importKnownScores, _ref3;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref2$data = _ref2.data, _ref2$data$config = _ref2$data.config, messages = _ref2$data$config.messages, _ref2$data$config$cip = _ref2$data$config.cipher, name = _ref2$data$config$cip.name, options = _ref2$data$config$cip.options, evolution = _ref2$data$config.evolution, importCandidates = _ref2$data.candidates, importKnownScores = _ref2$data.knownScores;
            populationSize = evolution.populationSize;
            childrenPerParent = evolution.childrenPerParent;
            randomPerGeneration = evolution.randomPerGeneration;
            allowDuplicates = evolution.allowDuplicates;
            // Gets cipher functions
            // if (!cipherFunctionGenerators.hasOwnProperty(name)) throw Error("Unrecognised config.cipher.name: " + name);
            importScripts("ciphers/" + name + "/configure-worker.js");
            _context.next = 8;
            return regeneratorRuntime.awrap(configure(messages, options));

          case 8:
            _ref3 = _context.sent;
            fitness = _ref3.fitness;
            randomCandidate = _ref3.randomCandidate;
            permuteCandidate = _ref3.permuteCandidate;
            keyToString = _ref3.keyToString;
            importCandidates.forEach(evaluateCandidate);
            knownScores = importKnownScores;

            while (candidates.length < populationSize) {
              evaluateCandidate(randomCandidate());
            } // Once config complete, message events toggle the population on/off.


            onmessage = function onmessage(_ref4) {
              var run = _ref4.data;
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
  }); // PUBLIC FUNCTIONS


  return {
    getAsset: function getAsset(path) {
      var splitPath, directory, fileName;
      return regeneratorRuntime.async(function getAsset$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Navigates to the correct directory in local data
              splitPath = path.split("/");
              directory = splitPath.slice(0, -1).reduce(function (t, v) {
                return t.hasOwnProperty(v) ? t[v] : t[v] = {};
              }, localAssets);
              fileName = splitPath[splitPath.length - 1];
              return _context2.abrupt("return", directory.hasOwnProperty(fileName) ? directory[fileName] // If the asset is not already stored locally, requests it from control
              : new Promise(function (resolve) {
                // Waits for a message returning the data
                onmessage = function onmessage(_ref5) {
                  var asset = _ref5.data;
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
              return _context2.stop();
          }
        }
      });
    }
  };
}(),
    getAsset = _ref.getAsset; // Once initial setup is complete, tells control that it is ready to receive config


postMessage({
  message: "ready-for-config"
});