"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function configure(messages, _ref) {
  var keylength, n, alphabet, scores, rand;
  return regeneratorRuntime.async(function configure$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          rand = function _ref2(max) {
            return Math.floor(Math.random() * max);
          };

          keylength = _ref.keylength, n = _ref.n;
          alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";

          if (!(n == 1)) {
            _context.next = 9;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(getAsset(["ngrams", "by-index"], "1.json"));

        case 6:
          _context.t0 = _context.sent;
          _context.next = 12;
          break;

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(getAsset(["ngrams", "by-letter"], n + ".json"));

        case 11:
          _context.t0 = _context.sent;

        case 12:
          scores = _context.t0;
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
              var scoreMessage = n > 1 ? function (message, key) {
                // Ngram score
                var decrypted = message.reduce(function (t, c, p) {
                  return t + alphabet[c + key[p % keylength]];
                }),
                    max = message.length - n;
                var score = 0,
                    gram;

                for (var i = 0; i < max; i++) {
                  if (scores.hasOwnProperty(gram = decrypted.substr(i, n))) score += scores[gram];
                }

                return score / message.length;
              } : function (message, key) {
                // Letter score
                return message.reduce(function (t, c, p) {
                  return t + scores[c + key[p % keylength]];
                }) / message.length;
              };

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
              var key = [];

              for (var i = 0; i < keylength; i++) {
                key.push(rand(26));
              }

              return key;
            },
            permuteCandidate: function permuteCandidate(key) {
              var permutedKey = _toConsumableArray(key);

              permutedKey[rand(keylength)] = rand(26);
              return permutedKey;
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

;