"use strict";

// Here is a template for a possible structure of a worker config function for a cipher
async function configure(messages, { /* Cipher options go here, e.g: */ keylength, n }) {
  // Declare constants, e.g:
  const scores = await getAsset(["ngrams"], n + ".json"); // The getAsset function is available to request any asset stored in 

  // Declare functions, e.g:
  function rand(max) {
    return Math.floor(Math.random() * max);
  }

  // Return an object with fitness, randomCandidate, permuteCandidate, and keyToString methods
  return {
    // Here is a possible structure for the fitness function, using an IIFE
    fitness: (function () {
      const convertMessage = (_message) => {
          // Function to convert message from text to standardised format, e.g. an array of numbers
        },
        scoreMessage =
          n > 1
            ? function (_message, _key) {
                // Ngram score function goes here
              }
            : function (_message, _key) {
                // Letter score function goes here
              };
      if (messages.length > 1) {
        // If only one message provided
        messages = messages.map(convertMessage);
        return (key) =>
          messages.reduce((t, message) => t + scoreMessage(message, key));
      } else {
        // If multiple messages provided
        const message = convertMessage(messages[0]);
        return (key) => scoreMessage(message, key);
      }
    })(),
    randomCandidate() {
      // Random candidate function goes here
    },
    permuteCandidate(_key) {
      // Permute candidate function goes here
    },
    keyToString(_key) {
      // Candidate to string function goes here
      // Candidates which are the same should always result in the same string
      // Different candidates should always result in a different string
    },
  };
}
