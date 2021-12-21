"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cipherFunctions = cipherFunctions;
exports.setup = void 0;
var setup = {
  displayName: "Example",
  options: [{
    name: "keylength",
    type: "number",
    label: "Keylength",
    description: // TODO: sort descriptions
    "The length of the key used to encrypt the plaintext with the vigenere cipher.",
    params: {
      min: 2,
      max: 100,
      "default": 8
    }
  }, {
    name: "n",
    label: "Fitness evaluation method",
    description: "The length of n-gram used to compare each decryption to expected English frequencies.",
    type: "select",
    params: {
      options: [{
        value: "",
        name: "Select fitness method..."
      }, {
        value: "2",
        name: "Bigram score"
      }, {
        value: "3",
        name: "Trigram score"
      }, {
        value: "4",
        name: "Quadgram score"
      }, {
        value: "5",
        name: "Quintgram score"
      }]
    }
  }]
};
exports.setup = setup;

function cipherFunctions(_config) {
  return {
    MessageDecrypter: function MessageDecrypter(_message) {
      return function (key) {// Returns the message decrypted with the given key.
      };
    },
    keyToString: function keyToString(_key) {// Candidate to string function goes here
      // Candidates which are the same should always result in the same string
      // Different candidates should always result in a different string
      // Same as keyToString function in configure-worker
    },
    keyToText: function keyToText(_key) {// Returns the key formatted as as string in a way that is readable to the user
    },
    textToKey: function textToKey(_text) {// Takes in a string and returns the key in the format used by the algorithm
      // Returns false if invalid key
    }
  };
}