"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function configure(messages, _ref) {
  var m, n, alphabet, scores, mMinusOne, shuffleRowsChance, rand, decryptMessage;
  return regeneratorRuntime.async(function configure$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          decryptMessage = function _ref3(message, key) {
            return message.reduce( // Goes through each character
            function (t, cipherRow) {
              return t + key.reduce(function (plainRow, keyRow) {
                return plainRow + // Gets character for that row
                alphabet[keyRow.reduce(function (t, c, i) {
                  return t + c * cipherRow[i];
                }, 0) % 26];
              }, "");
            }, "");
          };

          rand = function _ref2(max) {
            return Math.floor(Math.random() * max);
          };

          m = _ref.m, n = _ref.n;
          alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

          if (!(n > 1)) {
            _context.next = 10;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(getAsset(["ngrams"], n + ".json"));

        case 7:
          _context.t0 = _context.sent;
          _context.next = 13;
          break;

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(getAsset(["ngrams"], "1-by-letter.json"));

        case 12:
          _context.t0 = _context.sent;

        case 13:
          scores = _context.t0;
          mMinusOne = m - 1;
          shuffleRowsChance = Math.round(1000 / mMinusOne);
          return _context.abrupt("return", {
            fitness: function () {
              // from https://stackoverflow.com/questions/44474864/compute-determinant-of-a-matrix
              var determinant = function determinant(m) {
                return m.length == 1 ? m[0][0] : m.length == 2 ? m[0][0] * m[1][1] - m[0][1] * m[1][0] : m[0].reduce(function (r, e, i) {
                  return r + Math.pow(-1, i + 2) * e * determinant(m.slice(1).map(function (c) {
                    return c.filter(function (_, j) {
                      return i != j;
                    });
                  }));
                }, 0);
              };

              function convertMessage(message) {
                var i;
                var numbers = message.toUpperCase().split("").flatMap(function (c) {
                  return (i = alphabet.indexOf(c)) > -1 ? [i] : [];
                }),
                    result = []; // Pads message to multiple of g length

                var l = numbers.length;
                var r = l % m;
                if (r) for (; r < m; r++) {
                  numbers.push(0);
                }
                i = 0;

                while (i < l) {
                  result.push(numbers.slice(i, i += m));
                }

                return result;
              }

              var scoreMessage = n > 1 ? function (message, key) {
                var decrypted = decryptMessage(message, key),
                    max = message.length - n;
                var score = 0,
                    gram;

                for (var i = 0; i < max; i++) {
                  if (scores.hasOwnProperty(gram = decrypted.substr(i, n))) score += scores[gram];
                }

                return score / message.length;
              } : function (message, key) {
                return decryptMessage(message, key).split("").reduce(function (t, c) {
                  return t + scores[c];
                }, 0) / message.length;
              };

              if (messages.length > 1) {
                // If only one message provided
                messages = messages.map(convertMessage);

                var scoreKey = function scoreKey(key) {
                  return messages.reduce(function (t, message) {
                    return t + scoreMessage(message, key);
                  });
                };
              } else {
                // If multiple messages provided
                var message = convertMessage(messages[0]);

                var scoreKey = function scoreKey(key) {
                  return scoreMessage(message, key);
                };
              }

              return function (key) {
                var det = determinant(key);
                return det && det % 2 && det % 13 ? scoreKey(key) : 0;
              };
            }(),
            randomCandidate: function randomCandidate() {
              var key = [],
                  row;

              for (var r = 0; r < m; r++) {
                row = [];

                for (var c = 0; c < m; c++) {
                  row.push(rand(26));
                }

                key.push(row);
              }

              return key;
            },
            permuteCandidate: function permuteCandidate(key) {
              var permutedKey = key.map(function (row) {
                return _toConsumableArray(row);
              });

              if (rand(shuffleRowsChance)) {
                var row = permutedKey[rand(m)];

                for (var numChanges = rand(m); numChanges >= 0; numChanges--) {
                  row[rand(m)] = rand(26);
                }

                return permutedKey;
              } else {
                // 1 in every 100, shuffles columns
                var j, x, i;

                for (i = mMinusOne; i > 0; i--) {
                  j = Math.floor(Math.random() * (i + 1));
                  x = permutedKey[i];
                  permutedKey[i] = permutedKey[j];
                  permutedKey[j] = x;
                }
              }

              return permutedKey;
            },
            keyToString: function keyToString(key) {
              // TODO: improve
              return key.join(";");
            }
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
}