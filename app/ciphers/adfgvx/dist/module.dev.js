"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageDecrypter = MessageDecrypter;
exports.KeyToString = KeyToString;
exports.KeyToText = KeyToText;
exports.TextToKey = TextToKey;
exports.setup = void 0;
var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var setup = {
  displayName: "ADFGVX",
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
exports.setup = setup;

function MessageDecrypter(message) {
  // Todo: remove non-ADFGVX characters
  var l = message.length,
      convertedMessage = [],
      chars = "ADFGVX",
      map = {}; // Generates the square for conversion

  var i = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = chars[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var r = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = chars[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var c = _step2.value;
          map[r + c] = i++;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
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

  if (l % 2) message += "A";

  for (var p = 0; p < l; p += 2) {
    convertedMessage.push(map[message.substr(p, 2)]);
  }

  return function (key) {
    return convertedMessage.reduce(function (plaintext, val) {
      return plaintext + key[val];
    }, "");
  };
}

function KeyToString() {
  return function (key) {
    return key.join("");
  };
}

function KeyToText() {
  return function (key) {
    return key.join("");
    /*
    var encryptionKey = "";
    for (let l of alphabet) {
      encryptionKey += alphabet[key.indexOf(l)];
    };
    return encryptionKey;
    */
  };
}

function TextToKey() {
  return function (text) {
    var remainingLetters = new Set(alphabet);
    var lastLetterIndex = -1,
        encryptionKey = text.toUpperCase().split("").flatMap(function (_char) {
      return (lastLetterIndex = alphabet.indexOf(_char)) > -1 && remainingLetters["delete"](_char) ? [_char] : [];
    }),
        lastLetter; // Adds all the remaining letters, starting from the last letter given

    while (encryptionKey.length < 36) {
      if (++lastLetterIndex == 36) lastLetterIndex = 0;
      lastLetter = alphabet[lastLetterIndex]; // If the letter now reached is not already in the encryptionKey, adds it

      if (encryptionKey.indexOf(lastLetter) == -1) encryptionKey.push(lastLetter);
    }

    return encryptionKey;
    /* inverts: alphabet.map((char) => alphabet[encryptionKey.indexOf(char)]); */
  };
}