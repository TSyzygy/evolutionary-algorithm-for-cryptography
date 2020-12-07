"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function configure(messages, _ref) {
  var keylength, n, _ref2, NgramScore, scorePlaintext;

  return regeneratorRuntime.async(function configure$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          keylength = _ref.keylength, n = _ref.n;
          _context.next = 3;
          return regeneratorRuntime.awrap(Promise.resolve().then(function () {
            return _interopRequireWildcard(require("../standard-configure-worker-functions"));
          }));

        case 3:
          _ref2 = _context.sent;
          NgramScore = _ref2.NgramScore;
          _context.next = 7;
          return regeneratorRuntime.awrap(NgramScore(n));

        case 7:
          scorePlaintext = _context.sent;
          return _context.abrupt("return", {
            fitness: function () {
              var alphabet = new Set(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]);

              function filterMessage(message) {
                return message.toUpperCase().split("").filter(function (c) {
                  return alphabet.has(c);
                });
              }

              function scoreMessage(message, key) {
                var l = message.length;
                var decrypted = "";

                for (var i = 0, b = 0, p = 0; i < l; i++, p++) {
                  if (p == keylength) {
                    p = 0;
                    b += keylength;
                  }

                  decrypted += message[b + key[p]];
                }

                return scorePlaintext(decrypted);
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
            randomCandidate: function () {
              var items = [];
              var n = 0;

              while (n < keylength) {
                items.push(n++);
              }

              return function () {
                var j,
                    x,
                    i,
                    a = [].concat(items);

                for (i = keylength - 1; i > 0; i--) {
                  j = Math.floor(Math.random() * (i + 1));
                  x = a[i];
                  a[i] = a[j];
                  a[j] = x;
                }

                return a;
              };
            }(),
            permuteCandidate: function () {
              var operations = [// The different operations
              swap, flip, shift],
                  operationWeights = [// The different combinations of the operations; each 'column' below is equally weighted
              [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3], [1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0]]; // Gets a random number between min and max-1

              function rand(max) {
                return Math.floor(Math.random() * max);
              } // Swaps two randomly chosen positions within the key


              function swap(key) {
                var posA = rand(keylength),
                    posB,
                    temp;

                var newKey = _toConsumableArray(key);

                do {
                  posB = rand(keylength);
                } while (posA == posB);

                temp = newKey[posA];
                newKey[posA] = newKey[posB];
                newKey[posB] = temp;
                return newKey;
              } // Shifts some positions from the front to the back of the list


              function flip(key) {
                var posA = rand(keylength - 1) + 1;
                return key.slice(posA, keylength).concat(key.slice(0, posA));
              } // Shifts a block some distance to the right


              function shift(key) {
                var blockLength = rand(keylength - 2) + 2,
                    blockStart = rand(keylength - blockLength),
                    blockEnd = blockStart + blockLength,
                    distance = rand(keylength - blockLength - blockStart) + 1,
                    moveTo = blockEnd + distance;
                /*
                return [
                  ...key.slice(0, blockStart),
                  ...key.slice(blockEnd, moveTo),
                  ...key.slice(blockStart, blockEnd),
                  ...key.slice(moveTo, keylength),
                ];
                */

                return key.slice(0, blockStart).concat(key.slice(blockEnd, moveTo), key.slice(blockStart, blockEnd), key.slice(moveTo, keylength));
              }

              return function (key) {
                // Could be made more efficient
                var i = rand(operationWeights[0].length);

                for (var f = 0; f < operations.length; f++) {
                  for (var _n = 0, repeat = operationWeights[f][i], operation = operations[f]; _n < repeat; _n++) {
                    key = operation(key);
                  }
                }

                return key;
              };
            }(),
            keyToString: function keyToString(key) {
              return key.join(",");
            }
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}