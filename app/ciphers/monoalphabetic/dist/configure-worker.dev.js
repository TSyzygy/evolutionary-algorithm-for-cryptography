"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function configure(messages, _ref) {
  var n, value, _ref2, NgramScore, scorePlaintext, rand;

  return regeneratorRuntime.async(function configure$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          n = _ref.n;
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
            Z: 25
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(Promise.resolve().then(function () {
            return _interopRequireWildcard(require("../standard-configure-worker-functions"));
          }));

        case 4:
          _ref2 = _context.sent;
          NgramScore = _ref2.NgramScore;
          _context.next = 8;
          return regeneratorRuntime.awrap(NgramScore(n));

        case 8:
          scorePlaintext = _context.sent;

          // Gets a random number between min and max-1
          rand = function rand(max) {
            return Math.floor(Math.random() * max);
          };

          return _context.abrupt("return", {
            fitness: function () {
              var convertMessage = function convertMessage(message) {
                return message.toUpperCase().split("").flatMap(function (c) {
                  return value.hasOwnProperty(c) ? [value[c]] : [];
                });
              },
                  scoreMessage = function scoreMessage(message, key) {
                return scorePlaintext(message.reduce(function (t, c) {
                  return t + key[c];
                }, ""));
              }; // If multiple messages provided


              if (messages.length > 1) {
                messages = messages.map(convertMessage); // Converts messages to numerical form

                return function (key) {
                  return messages.reduce(function (t, message) {
                    return t + scoreMessage(message, key);
                  });
                }; // If only one message provided
              } else {
                var message = convertMessage(messages[0]);
                return function (key) {
                  return scoreMessage(message, key);
                };
              }
            }(),
            randomCandidate: function randomCandidate() {
              var j, x, i;
              var a = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

              for (i = 25; i > 0; i--) {
                j = rand(i + 1);
                x = a[i];
                a[i] = a[j];
                a[j] = x;
              }

              return a;
            },
            permuteCandidate: function permuteCandidate(key) {
              var posA, posB, temp;

              var permutedKey = _toConsumableArray(key);

              for (var numSwaps = rand(4) + 1; numSwaps > 0; numSwaps--) {
                posA = rand(26);
                posB = rand(26); // TODO: ensure posA != posB?

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

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}