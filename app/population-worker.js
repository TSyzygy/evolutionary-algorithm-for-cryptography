"use strict";

// Functions which generate the cipher-specific functions (fitness, randomCandidate and permuteCandidate)
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
const { getAsset } = (function () {
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
    allowDuplicates;

  // PRIVATE CONSTANTS
  const localAssets = {};

  // PRIVATE FUNCTIONS
  function evaluateCandidate(candidate) {
    // If the key is a current candidate and duplicates are allowed, adds to same location in array
    const keyString = keyToString(candidate),
      existingLocation = candidates.findIndex(match => keyToString(match) == keyString);

    if (existingLocation > -1) {
      if (allowDuplicates) candidates.splice(existingLocation, 0, candidate);
    }

    // Adds the candidate if it has not been evaluated before
    else if (!knownScores.hasOwnProperty(keyString)) {
      const numCandidates = candidates.length,
        score = (knownScores[keyString] = fitness(candidate));

      // Rounds the score to be sent to control to save space in exports
      newKnownScores[keyString] = Math.round(score);

      // Finds position in ordered list of candidates
      for (
        var i = 0;
        i < numCandidates && score > knownScores[keyToString(candidates[i])];
        i++
      );

      // Adds to candidates list and removes worst candidate if length exceeds maximum
      candidates.splice(i, 0, candidate);
    };

    if (candidates.length > populationSize) candidates.shift();

    // If the candidate is not currently a candidate but had been in the past, it must be worse than all current candidates so is ignored.
  }

  // Evolve the population by one generation
  function nextGeneration() {
    newKnownScores = {};

    for (let parent of candidates)
      for (let n = 0; n < childrenPerParent; n++)
        evaluateCandidate(permuteCandidate(parent));

    for (let n = 0; n < randomPerGeneration; n++)
      evaluateCandidate(randomCandidate());

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
      populationSize,
      childrenPerParent,
      randomPerGeneration,
      allowDuplicates,
    } = evolution);

    // Gets cipher functions
    // if (!cipherFunctionGenerators.hasOwnProperty(name)) throw Error("Unrecognised config.cipher.name: " + name);
    importScripts("ciphers/" + name + "/configure-worker.js");
    ({
      fitness,
      randomCandidate,
      permuteCandidate,
      keyToString,
    } = await configure(messages, options));

    importCandidates.forEach(evaluateCandidate);
    knownScores = importKnownScores;

    while (candidates.length < populationSize)
      evaluateCandidate(randomCandidate());

    // Once config complete, message events toggle the population on/off.
    onmessage = function ({ data: run }) {
      running = run;
      nextGeneration();
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