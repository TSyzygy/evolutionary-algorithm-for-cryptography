"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageDecrypter = MessageDecrypter;
exports.KeyToString = KeyToString;
exports.KeyToText = KeyToText;
exports.TextToKey = TextToKey;
exports.setup = void 0;
var alphabet = new Set(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]); // TODO: allow n = 1 for some ciphers (not this one!)

var setup = {
  displayName: "Transposition",
  options: [{
    name: "keylength",
    type: "number",
    label: "Keylength",
    description: "The length of the key used to encrypt the plaintext with the vigenere cipher.",
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

function MessageDecrypter(message, _ref) {
  var keylength = _ref.keylength;

  while (message.length % keylength) {
    message += "X";
  }

  var filteredMessage = message.split("").filter(function (c) {
    return alphabet.has(c);
  });
  return function (key) {
    var p = 0,
        b = 0;
    return filteredMessage.reduce(function (plaintext, _c, _i, ciphertext) {
      if (p == keylength) {
        p = 0;
        b += keylength;
      }

      ;
      return plaintext + ciphertext[b + key[p++]];
    }, "");
  };
}

function KeyToString() {
  return function (key) {
    return key.join(",");
  };
}

function KeyToText() {
  return function (key) {
    return key.join(",");
  };
}

function TextToKey() {
  return function (text) {
    return text.split(",").map(Number);
  };
}