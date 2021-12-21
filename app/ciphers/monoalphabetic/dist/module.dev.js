"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cipherFunctions = cipherFunctions;
exports.setup = void 0;
var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    letter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    value = {
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
};
var setup = {
  displayName: "Monoalphabetic",
  options: [{
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
/*
function MessageDecrypter(message, _config) {
  const convertedMessage = message
    .split("")
    .map((c) => (value.hasOwnProperty(c) ? value[c] : c));
  return (key) =>
    convertedMessage.reduce(
      (plaintext, val) =>
        plaintext +
        (typeof val == "number"
          ? val >= 52
            ? key[val - 52].toLowerCase()
            : key[val]
          : val),
      ""
    );
};

function KeyToString(_config) {
  return (key) => key.join("");
};

function KeyToText(_config) {
  return (key) => {
    var encryptionKey = "";
    for (let l of alphabet) {
      encryptionKey += letter[key.indexOf(l)];
    }
    return encryptionKey;
  };
};

function TextToKey(_config) {
  return (text) => {
    const remainingLetters = new Set(alphabet);
    var lastLetterIndex = -1,
      encryptionKey = text
        .toUpperCase()
        .split("")
        .flatMap((char) =>
          (lastLetterIndex = alphabet.indexOf(char)) > -1 &&
          remainingLetters.delete(char)
            ? [char]
            : []
        ),
      lastLetter;

    // Adds all the remaining letters, starting from the last letter given
    while (encryptionKey.length < 26) {
      if (++lastLetterIndex == 26) lastLetterIndex = 0;

      lastLetter = alphabet[lastLetterIndex];

      // If the letter now reached is not already in the encryptionKey, adds it
      if (encryptionKey.indexOf(lastLetter) == -1)
        encryptionKey.push(lastLetter);
    }

    return alphabet.map((char) => letter[encryptionKey.indexOf(char)]);
  };
};
*/

exports.setup = setup;

function cipherFunctions(_config) {
  return {
    MessageDecrypter: function MessageDecrypter(message) {
      var convertedMessage = message.split("").map(function (c) {
        return value.hasOwnProperty(c) ? value[c] : c;
      });
      return function (key) {
        return convertedMessage.reduce(function (plaintext, val) {
          return plaintext + (typeof val == "number" ? val >= 52 ? key[val - 52].toLowerCase() : key[val] : val);
        }, "");
      };
    },
    keyToString: function keyToString(key) {
      return key.join("");
    },
    keyToText: function keyToText(key) {
      var encryptionKey = "";
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = alphabet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var l = _step.value;
          encryptionKey += letter[key.indexOf(l)];
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

      return encryptionKey;
    },
    textToKey: function textToKey(text) {
      var remainingLetters = new Set(alphabet);
      var lastLetterIndex = -1,
          encryptionKey = text.toUpperCase().split("").flatMap(function (_char) {
        return (lastLetterIndex = alphabet.indexOf(_char)) > -1 && remainingLetters["delete"](_char) ? [_char] : [];
      }),
          lastLetter; // Adds all the remaining letters, starting from the last letter given

      while (encryptionKey.length < 26) {
        if (++lastLetterIndex == 26) lastLetterIndex = 0;
        lastLetter = alphabet[lastLetterIndex]; // If the letter now reached is not already in the encryptionKey, adds it

        if (encryptionKey.indexOf(lastLetter) == -1) encryptionKey.push(lastLetter);
      }

      return alphabet.map(function (_char2) {
        return letter[encryptionKey.indexOf(_char2)];
      });
    }
  };
}