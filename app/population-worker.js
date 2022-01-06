"use strict";

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
  // else if (!knownScores.hasOwnProperty(keyString)) {
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
  // }

  if (candidates.length > populationSize) candidates.shift();

  // If the candidate is not currently a candidate but had been in the past, it must be worse than all current candidates so is ignored.
}

// Evolve the population by one generation
function nextGeneration() {
  newKnownScores = {};

  for (let parent of candidates)
    for (let n = 0; n < childrenPerParent; n++) {
      var child = permuteCandidate(parent)
      evaluateCandidate(child);
    }

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
  import("./ciphers/" + name + "/worker-module.js") // THE .js IS NECESSARY HERE or it breaks on Chrome at least.
    .then((CipherModule) => CipherModule.configure(messages, options))
    .then(function (cipherFunctions) {
      ({
        fitness,
        randomCandidate,
        permuteCandidate,
        keyToString,
      } = cipherFunctions);

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
    })
    // .catch((reason) => {console.log(reason)})
};

// Once initial setup is complete, tells control that it is ready to receive config
postMessage({
  message: "ready-for-config",
});
