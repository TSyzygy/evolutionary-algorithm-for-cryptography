"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function configure(messages, _ref) {
  var n, alphabet, scores, rand;
  return regeneratorRuntime.async(function configure$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          rand = function _ref2(max) {
            return Math.floor(Math.random() * max);
          };

          n = _ref.n;
          alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          _context.next = 5;
          return regeneratorRuntime.awrap(getAsset("ngrams/" + n + ".json"));

        case 5:
          scores = _context.sent;
          ;
          return _context.abrupt("return", {
            fitness: function () {
              function convertMessage(message) {
                return message.toUpperCase().split("").flatMap(function (c) {
                  var i = alphabet.indexOf(c);
                  return i > -1 ? [i] : [];
                });
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

              ; // If multiple messages provided

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

              ;
            }(),
            randomCandidate: function randomCandidate() {
              var j,
                  x,
                  i,
                  a = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

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
              var posA,
                  posB,
                  temp,
                  permutedKey = _toConsumableArray(key);

              for (var numSwaps = rand(4) + 1; numSwaps > 0; numSwaps--) {
                posA = rand(26);
                posB = rand(26); // TODO: ensure posA != posB?

                temp = permutedKey[posA];
                permutedKey[posA] = permutedKey[posB];
                permutedKey[posB] = temp;
              }

              ;
              return permutedKey;
            },
            keyToString: function keyToString(key) {
              return key.join("");
            }
          });

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}

;