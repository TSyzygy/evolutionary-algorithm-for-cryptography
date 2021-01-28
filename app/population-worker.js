"use strict";

// IIFE used to prevent worker config functions from changing evolution variables / running internal functions
const getAsset = (function () {
  // PRIVATE VARIABLES
  const candidates = [];
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
    allowDuplicates;

  // PRIVATE FUNCTIONS
  function evaluateCandidate(candidate) {
    // If the key is a current candidate and duplicates are allowed, adds to same location in array
    const keyString = keyToString(candidate),
      existingLocation = candidates.findIndex(
        (match) => keyToString(match) == keyString
      );

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
    }

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
    importScripts("ciphers/" + name + "/configure-worker.js");

    configure(messages, options).then((configFunctions) => {
      ({
        fitness,
        randomCandidate,
        permuteCandidate,
        keyToString,
      } = configFunctions);

      importCandidates.forEach(evaluateCandidate);

      knownScores = importKnownScores;

      // Infinite loop when n(keyspace) < populationSize
      while (candidates.length < populationSize)
        evaluateCandidate(randomCandidate());

      // Once config complete, message events toggle the population on/off.
      onmessage = function ({ data: run }) {
        running = run;
        nextGeneration();
      };
  
      postMessage("config-complete");
      postStatusUpdate();

      return configFunctions;
    });
  };

  // IIFE for localAssets
  return (() => {
    const localAssets = {};

    // PUBLIC GETASSET FUNCTION
    return async function (directoryPath, fileName) {
      // Navigates to the correct directory in local data
      const directory = directoryPath.reduce(
        (t, v) => (t.hasOwnProperty(v) ? t[v] : (t[v] = {})),
        localAssets
      );

      return directory.hasOwnProperty(fileName)
        ? directory[fileName] // If the asset is not already stored locally, requests it from control
        : new Promise(function (resolve, reject) {
            // Waits for a message returning the data
            onmessage = function ({ data: asset }) {
              // Once asset is recieved from control, saves it locally in case of future use and resolves the promise
              resolve((directory[fileName] = asset));
            };

            // Posts a message requesting the desired data
            postMessage({
              message: "asset-request",
              directoryPath,
              fileName
            });
          });
    };
  })();
})();

// Once initial setup is complete, tells control that it is ready to receive config
postMessage({
  message: "ready-for-config",
});
