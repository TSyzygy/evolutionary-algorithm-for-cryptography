"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageDecrypter = MessageDecrypter;
exports.KeyToString = KeyToString;
exports.KeyToText = KeyToText;
exports.TextToKey = TextToKey;
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

function MessageDecrypter(_message, _config) {}

;

function KeyToString(_config) {}

;

function KeyToText(_config) {}

;

function TextToKey(_config) {}

;