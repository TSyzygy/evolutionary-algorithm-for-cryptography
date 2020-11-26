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
  },
  hill: function hill(message, _ref) {
    var m = _ref.m;
    var i;
    var numbers = message.toUpperCase().split("").flatMap(function (c) {
      return (i = alphabet.indexOf(c)) > -1 ? [i] : [];
    }),
        convertedMessage = []; // Pads message to multiple of g length

    var r = numbers.length % m;
    if (r) for (; r < m; r++) {
      numbers.push(0);
    }
    var l = numbers.length;
    i = 0;

    while (i < l) {
      convertedMessage.push(numbers.slice(i, i += m));
    }

    return function (key) {
      return (// Goes through each row of the message
        convertedMessage.reduce( // Goes through each character
        function (t, cipherRow) {
          return t + key.reduce(function (plainRow, keyRow) {
            return plainRow + // Gets character for that row
            alphabet[keyRow.reduce(function (t, c, i) {
              return t + c * cipherRow[i];
            }, 0) % 26];
          }, "");
        }, "")
      );
    };
  }
},
    candidateStringGenerators = {
  vigenere: function vigenere(_config) {
    return function (key) {
      return key.join(",");
    };
  },
  monoalphabetic: function monoalphabetic(_config) {
    return function (key) {
      return key.join("");
    };
  },
  hill: function hill(_config) {
    return function (key) {
      return key.join(";");
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
  },
  hill: function hill() {
    // from https://stackoverflow.com/questions/44474864/compute-determinant-of-a-matrix
    var determinant = function determinant(m) {
      return m.length == 1 ? m[0][0] : m.length == 2 ? m[0][0] * m[1][1] - m[0][1] * m[1][0] : m[0].reduce(function (r, e, i) {
        return r + Math.pow(-1, i + 2) * e * determinant(m.slice(1).map(function (c) {
          return c.filter(function (_, j) {
            return i != j;
          });
        }));
      }, 0);
    }; // Finds the number x such that ax = 1 (mod n)


    function modularInverse(a, n) {
      var t = 0,
          newT = 1,
          tempT,
          r = n,
          newR = a,
          tempR,
          quot;

      while (newR != 0) {
        quot = Math.floor(r / newR);
        tempT = t;
        t = newT;
        newT = tempT - quot * newT;
        tempR = r;
        r = newR;
        newR = tempR - quot * newR;
      }

      return r > 1 ? false : a < 0 ? t > 0 ? -t + n : -t : t < 0 ? t + n : t;
    }

    function invertMatrix(A) {
      var mod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 26;
      // Checks det != 0 and is coprime with 26
      var detInv = modularInverse(determinant(A), mod); // col, c and r are 'wrong way round', to transpose the matrix

      return detInv ? A.map(function (col, c, mat) {
        return col.map(function (_item, r) {
          return (((r + c) % 2 ? -1 : 1) * determinant( // Gets minor
          mat.flatMap(function (minorRow, minorR) {
            return minorR == r ? [] : [minorRow.flatMap(function (minorItem, minorC) {
              return minorC == c ? [] : [minorItem];
            })];
          })) * // Multiplies each element by detInv
          detInv % mod + mod) % mod;
        });
      }) : false;
    }

    return function (key) {
      var inv = invertMatrix(key);
      return inv ? inv.join(";") : "non-invertible matrix";
    };
  }
},
    textToKeyGenerators = {
  vigenere: function vigenere(_ref2) {
    var keylength = _ref2.keylength;
    return function (text) {
      var key = [];
      var v;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = text.toUpperCase()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _char = _step2.value;
          if (value.hasOwnProperty(_char)) key.push((v = value[_char]) ? 26 - v : 0);
        } // If v == 0, adds 0 to the key rather than 26

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
      var remainingLetters = new Set(alphabet);
      var lastLetterIndex = -1,
          encryptionKey = text.toUpperCase().split("").flatMap(function (_char2) {
        return (lastLetterIndex = alphabet.indexOf(_char2)) > -1 && remainingLetters["delete"](_char2) ? [_char2] : [];
      }),
          lastLetter; // Adds all the remaining letters, starting from the last letter given

      while (encryptionKey.length < 26) {
        if (++lastLetterIndex == 26) lastLetterIndex = 0;
        lastLetter = alphabet[lastLetterIndex]; // If the letter now reached is not already in the encryptionKey, adds it

        if (encryptionKey.indexOf(lastLetter) == -1) encryptionKey.push(lastLetter);
      }

      return alphabet.map(function (_char3) {
        return letter[encryptionKey.indexOf(_char3)];
      });
    };
  },
  hill: function hill(_ref3) {
    var m = _ref3.m;

    // from https://stackoverflow.com/questions/44474864/compute-determinant-of-a-matrix
    var determinant = function determinant(m) {
      return m.length == 1 ? m[0][0] : m.length == 2 ? m[0][0] * m[1][1] - m[0][1] * m[1][0] : m[0].reduce(function (r, e, i) {
        return r + Math.pow(-1, i + 2) * e * determinant(m.slice(1).map(function (c) {
          return c.filter(function (_, j) {
            return i != j;
          });
        }));
      }, 0);
    }; // Finds the number x such that ax = 1 (mod n)


    function modularInverse(a, n) {
      var t = 0,
          newT = 1,
          tempT,
          r = n,
          newR = a,
          tempR,
          quot;

      while (newR != 0) {
        quot = Math.floor(r / newR);
        tempT = t;
        t = newT;
        newT = tempT - quot * newT;
        tempR = r;
        r = newR;
        newR = tempR - quot * newR;
      }

      return r > 1 ? false : a < 0 ? t > 0 ? -t + n : -t : t < 0 ? t + n : t;
    }

    function invertMatrix(A) {
      var mod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 26;
      // Checks det != 0 and is coprime with 26
      var detInv = modularInverse(determinant(A), mod); // col, c and r are 'wrong way round', to transpose the matrix

      return detInv ? A.map(function (col, c, mat) {
        return col.map(function (_item, r) {
          return (((r + c) % 2 ? -1 : 1) * determinant( // Gets minor
          mat.flatMap(function (minorRow, minorR) {
            return minorR == r ? [] : [minorRow.flatMap(function (minorItem, minorC) {
              return minorC == c ? [] : [minorItem];
            })];
          })) * // Multiplies each element by detInv
          detInv % mod + mod) % mod;
        });
      }) : false;
    }

    return function (key) {
      var mat = key.split(";").map(function (row) {
        return row.split(",").map(function (i) {
          return Number(i);
        });
      });
      return mat.length == m && mat.every(function (row) {
        return row.length == m;
      }) ? invertMatrix(mat) : false;
    };
  }
};