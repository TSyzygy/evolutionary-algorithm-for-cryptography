"use strict"; // Here is a template for a possible structure of a worker config function for a cipher

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function configure(messages, _ref) {
  var n, scores, rand;
  return regeneratorRuntime.async(function configure$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          rand = function _ref2(max) {
            return Math.floor(Math.random() * max);
          };

          n = _ref.n;
          _context.next = 4;
          return regeneratorRuntime.awrap(getAsset("ngrams/" + n + ".json"));

        case 4:
          scores = _context.sent;
          return _context.abrupt("return", {
            // Here is a possible structure for the fitness function, using an IIFE
            fitness: function () {
              function convertMessage(message) {
                // Todo: remove non-ADFGVX characters
                var l = message.length,
                    converted = [],
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
                  converted.push(map[message.substr(p, 2)]);
                }

                ;
                return converted;
                /*
                  map = {
                    A: 0,
                    D: 1,
                    F: 2,
                    G: 3,
                    V: 4,
                    X: 5
                  };
                message = message.toUpperCase().split("").map(c => map[c]);
                // Ensures message length is even
                if (l % 2) message.push(0);
                // Splits into pairs
                for (let p = 0; p < l;) {
                  converted.push([message[p++], message[p++]]);
                };
                return converted;
                */
              }

              ;

              function scoreMessage(message, key) {
                // This double iteration is the fastest method I have found so far
                var decrypted = message.reduce(function (t, c) {
                  return t + key[c];
                }, ""),
                    max = message.length - n;
                var score = 0,
                    gram;

                for (var i = 0; i < max; i++) {
                  if (scores.hasOwnProperty(gram = decrypted.substr(i, n))) score += scores[gram];
                }

                return score / message.length;
              }

              ;

              if (messages.length > 1) {
                // If only one message provided
                messages = messages.map(convertMessage);
                return function (key) {
                  return messages.reduce(function (t, message) {
                    return t + scoreMessage(message, key);
                  });
                };
              } else {
                // If multiple messages provided
                var message = convertMessage(messages[0]);
                return function (key) {
                  return scoreMessage(message, key);
                };
              }
            }(),
            randomCandidate: function randomCandidate() {
              var j, x, i;
              var a = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

              for (i = 25; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
              }

              ;
              return a;
            },
            permuteCandidate: function permuteCandidate(key) {
              var posA, posB, temp;

              var permutedKey = _toConsumableArray(key);

              for (var numSwaps = rand(4) + 1; numSwaps > 0; numSwaps--) {
                posA = rand(36);
                posB = rand(36); // TODO: ensure posA != posB?

                temp = permutedKey[posA];
                permutedKey[posA] = permutedKey[posB];
                permutedKey[posB] = temp;
              }

              return permutedKey;
            },
            keyToString: function keyToString(key) {
              return key.join("");
            }
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}