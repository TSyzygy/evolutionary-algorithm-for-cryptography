"use strict";

// Functions which generate the cipher-specific functions (fitness, randomCandidate and permuteCandidate)
// IIFE
const cipherFunctionGenerators = (function () {
  // Prevents cipherFunctionGenerators from changing the worker's onmessage handler
  var onmessage, globalThis;

  return {
    async vigenere(messages, { keylength, n }) {
      const convertMessage = message =>
        message
          .toUpperCase()
          .split("")
          .flatMap(c => {
            var i = alphabet.indexOf(c);
            return i > -1 ? [i] : [];
          });

      if (!(1 <= n <= 6)) {
        throw Error("n out of range");
      }

      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        alphabetLength = 26,
        scores = await getAsset("ngrams/" + n + ".json"),
        scoreMessage =
          n > 1 // Ngram score
            ? function (message, key) {
                // TODO
              } // Letter score
            : function (message, key) {
                return message.reduce(
                  (t, c, i) => t + scores[c + key[i % keylength]]
                );
              };

      var fitness,
        randomCandidate,
        permuteCandidate;

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
      randomCandidate = function () {
        var key = [];
        for (let i = 0; i < keylength; i++)
          key.push(Math.floor(Math.random() * alphabetLength));
        return key;
      };

      // Generates permute candidate function
      permuteCandidate = function (key) {
        // Gets a random number between min and max-1
        function randRange(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }

        var permutedKey = [...key];
        var posToChange = randRange(0, keylength);
        permutedKey[posToChange] += randRange(1, alphabetLength);
        permutedKey[posToChange] %= alphabetLength;
        return permutedKey;
      };

      return {
        fitness,
        randomCandidate,
        permuteCandidate,
      };
    },
  };
})();

// IIFE used to prevent cipherFunctionGenerators from changing evolution variables / running internal functions. The getAsset function is accessible by cipherFunctionGenerators
const { getAsset } = (function () {
  // PRIVATE VARIABLES
  var running = false,
    candidates = [],
    knownScores = {},
    newKnownScores = {},
    fitness,
    randomCandidate,
    permuteCandidate,
    maxPopulationSize,
    childrenPerParent,
    randomPerGeneration,
    allowDuplicates,
    nextGenTimeout;

  // PRIVATE CONSTANTS
  const localAssets = {};

  // PRIVATE FUNCTIONS
  function evaluateCandidate(candidate) {
    // If the key is a current candidate and duplicates are allowed, adds to same location in array
    let existingLocation = candidates.indexOf(candidate);
    if (existingLocation > -1) {
      if (allowDuplicates) {
        candidates.splice(existingLocation, 0, candidate);
        if (candidates.length > evolutionConfig.maxPopulationSize)
          candidates.shift();
      }
    }

    // Adds the candidate if it has not been evaluated before
    else if (!knownScores.hasOwnProperty(candidate)) {
      var numCandidates = candidates.length,
        score = (newKnownScores[candidate] = knownScores[candidate] = fitness(
          candidate
        ));

      // Finds position in ordered list of candidates
      for (
        var i = 0;
        i < numCandidates && score > knownScores[candidates[i]];
        i++
      );

      // Adds to candidates list and removes worst candidate if length exceeds maximum
      candidates.splice(i, 0, candidate);

      if (candidates.length > maxPopulationSize) candidates.shift();
    }
    // If the candidate is not currently a candidate but had been in the past, it must be worse than all current candidates so is ignored.
  };

  // Evolve the population by one generation
  function nextGeneration() {
    newKnownScores = {};

    for (let parent of candidates)
      for (let n = 0; n < childrenPerParent; n++)
        evaluateCandidate(permuteCandidate(parent));

    for (let n = 0; n < randomPerGeneration; n++)
      evaluateCandidate(randomCandidate());

    postStatusUpdate();
  }

  // Continues evolving the population until "stop" message received.
  function run() {
    nextGeneration();
    nextGenTimeout = setTimeout(run); // Any new instructions from control (such as "stop") will be dealt with before running next generation
  }

  // Sends a status update to control
  function postStatusUpdate() {
    postMessage({
      candidates,
      newKnownScores,
    });
  }

  // When config recieved
  onmessage = async function ({
    data: {
      config: {
        messages,
        cipher: { name, options },
        evolution,
      },
      candidates: importCandidates,
      knownScores: importKnownScores,
    },
  }) {
    // Evolution options
    ({
      maxPopulationSize,
      childrenPerParent,
      randomPerGeneration,
      allowDuplicates,
    } = evolution);

    // Gets cipher functions
    // if (!cipherFunctionGenerators.hasOwnProperty(name)) throw Error("Unrecognised config.cipher.name: " + name);
    ({
      fitness,
      randomCandidate,
      permuteCandidate,
    } = await cipherFunctionGenerators[name](messages, options));

    importCandidates.forEach(evaluateCandidate);
    knownScores = importKnownScores;

    while (candidates.length < maxPopulationSize)
      evaluateCandidate(randomCandidate());

    // Once config complete, message events toggle the population on/off.
    onmessage = function ({ data: instruction }) {
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
  };

  // PUBLIC FUNCTIONS
  return {
    getAsset: async function (path) {
      // Navigates to the correct directory in local data
      var splitPath = path.split("/");
      var directory = splitPath
        .slice(0, -1)
        .reduce(
          (t, v) => (t.hasOwnProperty(v) ? t[v] : (t[v] = {})),
          localAssets
        );
      var fileName = splitPath[splitPath.length - 1];

      return directory.hasOwnProperty(fileName)
        ? directory[fileName] // If the asset is not already stored locally, requests it from control
        : new Promise(function (resolve) {
            // Waits for a message returning the data
            onmessage = function ({ data: asset }) {
              // Once asset is recieved from control, saves it locally in case of future use and resolves the promise
              resolve((directory[fileName] = asset));
            };

            // Posts a message requesting the desired data
            postMessage({
              message: "asset-request",
              path,
            });
          });
    },
  };
})();

// Once initial setup is complete, tells control that it is ready to receive config
postMessage({
  message: "ready-for-config",
});