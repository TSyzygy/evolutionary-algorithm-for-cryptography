"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function configure(messages, _ref) {
  var keylength, n, scores, rand;
  return regeneratorRuntime.async(function configure$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          rand = function _ref2(max) {
            return Math.floor(Math.random() * max);
          };

          keylength = _ref.keylength, n = _ref.n;

          if (!(n == 1)) {
            _context.next = 4;
            break;
          }

          throw new Error("N = 1");

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(getAsset("ngrams/" + n + ".json"));

        case 6:
          scores = _context.sent;
          return _context.abrupt("return", {
            fitness: function () {
              function convertMessage(message) {
                var i;
                return message.toUpperCase().split("").flatMap(function (c) {
                  return (i = alphabet.indexOf(c) > -1) ? [i] : [];
                });
              }

              ;

              function scoreMessage(message, key) {
                var decrypted = [];

                for (var i = 0, b = 0, p = 0, _l = message.length; i < _l; i++, p++) {
                  if (p == keylength) {
                    p = 0;
                    b += keylength;
                  }

                  ;
                  decrypted.push(message[b + key[p]]);
                }

                ;
                var score = 0,
                    gram;

                for (var _i = 0, max = l - n; _i < max; _i++) {
                  if (scores.hasOwnProperty(gram = decrypted.substr(_i, n))) score += scores[gram];
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
              function shuffle(a) {
                var j, x, i;

                for (i = a.length - 1; i > 0; i--) {
                  j = Math.floor(Math.random() * (i + 1));
                  x = a[i];
                  a[i] = a[j];
                  a[j] = x;
                }

                return a;
              }

              var items = [],
                  i = 0;

              while (i < keylength) {
                items.push(i++);
              }

              return shuffle(items);
            },
            permuteCandidate: function permuteCandidate(key) {
              var operations, operationWeights, i, f, n, repeat, operation;

              var newKey = _toConsumableArray(key); // Swaps two randomly chosen positions within the key


              function swap(key) {
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
              }

              ; // Shifts some positions from the front to the back of the list

              function flip(key) {
                var keylength = key.length;
                var posA = randRange(1, keylength);
                return key.slice(posA, keylength).concat(key.slice(0, posA));
              }

              ; // Shifts a block some distance to the right

              function shift(key) {
                var keylength = key.length;
                var blockStart, blockEnd, distance, moveTo;
                var blockLength = randRange(1, keylength - 1); // 9

                blockStart = randRange(0, keylength - blockLength); // 0

                blockEnd = blockStart + blockLength;
                distance = randRange(1, keylength - blockLength - blockStart + 1); // 1

                moveTo = blockEnd + distance;
                return [].concat(_toConsumableArray(key.slice(0, blockStart)), _toConsumableArray(key.slice(blockEnd, moveTo)), _toConsumableArray(key.slice(blockStart, blockEnd)), _toConsumableArray(key.slice(moveTo, keylength)));
              }

              ;
              operations = [// The different operations
              swap, flip, shift];
              operationWeights = [// The different combinations of the operations; each 'column' below is equally weighted
              [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3], [1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0]];
              i = randRange(0, operationWeights[0].length);

              for (f = 0; f < operations.length; f++) {
                repeat = operationWeights[f][i];
                operation = operations[f];

                for (n = 0; n < repeat; n++) {
                  newKey = operation(_toConsumableArray(newKey));
                }
              }

              ;
              return newKey;
            },
            keyToString: function keyToString(key) {
              return key.join(",");
            }
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}