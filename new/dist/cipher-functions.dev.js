"use strict";

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
},
    messageDecrypterGenerators = {
  vigenere: function vigenere(message, config) {
    var convertedMessage = message.split("").map(function (c) {
      return value.hasOwnProperty(c) ? value[c] : c;
    }),
        keylength = config.keylength;
    return function (key) {
      var p = 0;
      return convertedMessage.reduce(function (plaintext, val) {
        if (p == keylength) p = 0;
        return plaintext + (typeof val == "number" ? letter[val + key[p++]] : val);
      }, "");
    };
  },
  monoalphabetic: function monoalphabetic(message, _config) {
    var convertedMessage = message.split("").map(function (c) {
      return value.hasOwnProperty(c) ? value[c] : c;
    });
    return function (key) {
      return convertedMessage.reduce(function (plaintext, val) {
        return plaintext + (typeof val == "number" ? val >= 52 ? key[val - 52].toLowerCase() : key[val] : val);
      }, "");
    };
  }
},
    keyToTextGenerators = {
  vigenere: function vigenere(_config) {
    return function (key) {
      return key.reduce(function (word, n) {
        return word + letter[26 - n];
      }, "");
    };
  },
  monoalphabetic: function monoalphabetic(_config) {
    return function (key) {
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
    };
  }
},
    textToKeyGenerators = {
  vigenere: function vigenere(config) {
    var keylength = config.keylength;
    return function (text) {
      var key = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = text.toUpperCase()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _char = _step2.value;

          if (value.hasOwnProperty(_char)) {
            key.push(26 - value[_char]);
          }
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

      return key.length == keylength ? key : false;
    };
  },
  monoalphabetic: function monoalphabetic(_config) {
    return function (text) {
      var encryptionKey = [],
          decryptionKey = [],
          lastLetterIndex,
          lastLetter;
      /*
      text = text.split("").filter(c => alphabet.indexOf(c) > -1);
       for (let l of alphabet) {
        decryptionkey += letter[text.indexOf(l)];
      }
      return decryptionkey;
      */

      text = text.toUpperCase().split("");
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = text[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _char2 = _step3.value;

          if ((lastLetterIndex = alphabet.indexOf(_char2)) > -1) {
            if (encryptionKey.indexOf(_char2) == -1) {
              encryptionKey.push(_char2);
            } else {
              // If a character appears twice
              return false;
            }

            ;
          }

          ;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      ; // If no valid characters given

      if (!lastLetterIndex) {
        return false;
      }

      ; // Adds all the remaining letters, starting from the last letter given

      while (encryptionKey.length < 26) {
        if (++lastLetterIndex == 26) {
          lastLetterIndex = 0;
        }

        ;
        lastLetter = alphabet[lastLetterIndex]; // If the letter now reached is not already in the encryptionKey, adds it

        if (encryptionKey.indexOf(lastLetter) == -1) {
          encryptionKey.push(lastLetter);
        }

        ;
      }

      ;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = alphabet[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var l = _step4.value;
          decryptionKey.push(letter[encryptionKey.indexOf(l)]);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      ;
      return decryptionKey;
    };
  }
};