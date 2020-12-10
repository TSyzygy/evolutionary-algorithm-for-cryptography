"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageDecrypter = MessageDecrypter;
exports.KeyToString = KeyToString;
exports.KeyToText = KeyToText;
exports.TextToKey = TextToKey;
exports.setup = void 0;
var value = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
  a: 52,
  b: 53,
  c: 54,
  d: 55,
  e: 56,
  f: 57,
  g: 58,
  h: 59,
  i: 60,
  j: 61,
  k: 62,
  l: 63,
  m: 64,
  n: 65,
  o: 66,
  p: 67,
  q: 68,
  r: 69,
  s: 70,
  t: 71,
  u: 72,
  v: 73,
  w: 74,
  x: 75,
  y: 76,
  z: 77
},
    letter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var setup = {
  displayName: "Vigenere",
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
  var convertedMessage = message.split("").map(function (c) {
    return value.hasOwnProperty(c) ? value[c] : c;
  });
  return function (key) {
    var p = 0;
    return convertedMessage.reduce(function (plaintext, val) {
      if (p == keylength) p = 0;
      return plaintext + (typeof val == "number" ? letter[val + key[p++]] : val);
    }, "");
  };
}

function KeyToString(_config) {
  return function (key) {
    return key.join(",");
  };
}

function KeyToText(_config) {
  return function (key) {
    return key.reduce(function (word, n) {
      return word + letter[26 - n];
    }, "");
  };
}

function TextToKey(_ref2) {
  var keylength = _ref2.keylength;
  return function (text) {
    var key = [];
    var v;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = text.toUpperCase()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _char = _step.value;
        if (value.hasOwnProperty(_char)) key.push((v = value[_char]) ? 26 - v : 0);
      } // If v == 0, adds 0 to the key rather than 26

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

    return key.length == keylength ? key : false;
  };
}