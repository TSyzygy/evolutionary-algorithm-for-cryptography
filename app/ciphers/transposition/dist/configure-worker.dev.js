"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function configure(messages, _ref) {
  var keylength, n, alphabet, scores, operations, operationWeights, rand, swap, flip, shift, shuffle;
  return regeneratorRuntime.async(function configure$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          shuffle = function _ref6(a) {
            var j, x, i;

            for (i = a.length - 1; i > 0; i--) {
              j = Math.floor(Math.random() * (i + 1));
              x = a[i];
              a[i] = a[j];
              a[j] = x;
            }

            return a;
          };

          shift = function _ref5(key) {
            var blockLength = randRange(1, keylength - 1),
                blockStart = randRange(0, keylength - blockLength),
                blockEnd = blockStart + blockLength,
                distance = randRange(1, keylength - blockLength - blockStart + 1),
                moveTo = blockEnd + distance;
            return [].concat(_toConsumableArray(key.slice(0, blockStart)), _toConsumableArray(key.slice(blockEnd, moveTo)), _toConsumableArray(key.slice(blockStart, blockEnd)), _toConsumableArray(key.slice(moveTo, keylength)));
          };

          flip = function _ref4(key) {
            var keylength = key.length;
            var posA = randRange(1, keylength);
            return key.slice(posA, keylength).concat(key.slice(0, posA));
          };

          swap = function _ref3(key) {
            var posB, temp;
            var keylength = key.length;
            var posA = randRange(0, keylength);

            do {
              posB = randRange(0, keylength);
            } while (posA == posB);

            temp = key[posA];
            key[posA] = key[posB];
            key[posB] = temp;
            return key;
          };

          rand = function _ref2(max) {
            return Math.floor(Math.random() * max);
          };

          keylength = _ref.keylength, n = _ref.n;

          if (!(n == 1)) {
            _context.next = 8;
            break;
          }

          throw new Error("n = 1");

        case 8:
          alphabet = new Set(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]);
          _context.next = 11;
          return regeneratorRuntime.awrap(getAsset("ngrams/" + n + ".json"));

        case 11:
          scores = _context.sent;
          operations = [// The different operations
          swap, flip, shift];
          operationWeights = [// The different combinations of the operations; each 'column' below is equally weighted
          [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3], [1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0]];
          return _context.abrupt("return", {
            fitness: function () {
              function filterMessage(message) {
                return message.toUpperCase().split("").filter(function (c) {
                  return alphabet.has(c);
                });
              }

              function scoreMessage(message, key) {
                var decrypted = [],
                    l = message.length;

                for (var i = 0, b = 0, p = 0; i < l; i++, p++) {
                  if (p == keylength) {
                    p = 0;
                    b += keylength;
                  }

                  decrypted.push(message[b + key[p]]);
                }

                var score = 0,
                    gram;

                for (var _i = 0, max = l - n; _i < max; _i++) {
                  if (scores.hasOwnProperty(gram = decrypted.substr(_i, n))) score += scores[gram];
                }

                return score / message.length;
              }

              if (messages.length > 1) {
                // If only one message provided
                messages = messages.map(filterMessage);
                return function (key) {
                  return messages.reduce(function (t, message) {
                    return t + scoreMessage(message, key);
                  });
                };
              } else {
                // If multiple messages provided
                var message = filterMessage(messages[0]);
                return function (key) {
                  return scoreMessage(message, key);
                };
              }
            }(),
            randomCandidate: function randomCandidate() {
              var items = [];
              var i = 0;

              while (i < keylength) {
                items.push(i++);
              }

              return shuffle(items);
            },
            permuteCandidate: function permuteCandidate(key) {
              // Could be made more efficient
              var newKey = _toConsumableArray(key),
                  i = randRange(0, operationWeights[0].length);

              for (var f = 0; f < operations.length; f++) {
                for (var _n = 0, repeat = operationWeights[f][i], operation = operations[f]; _n < repeat; _n++) {
                  newKey = (_readOnlyError("newKey"), operation(_toConsumableArray(newKey)));
                }
              }

              return newKey;
            },
            keyToString: function keyToString(key) {
              return key.join(",");
            }
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
}