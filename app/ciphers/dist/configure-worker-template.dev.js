"use strict"; // Here is a template for a possible structure of a worker config function for a cipher

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
          _context.next = 4;
          return regeneratorRuntime.awrap(getAsset("ngrams/" + n + ".json"));

        case 4:
          scores = _context.sent;
          return _context.abrupt("return", {
            // Here is a possible structure for the fitness function, using an IIFE
            fitness: function () {
              var convertMessage = function convertMessage(_message) {// Function to convert message from text to standardised format, e.g. an array of numbers
              },
                  scoreMessage = n > 1 ? function (_message, _key) {// Ngram score function goes here
              } : function (_message, _key) {// Letter score function goes here
              };

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
            randomCandidate: function randomCandidate() {// Random candidate function goes here
            },
            permuteCandidate: function permuteCandidate(_key) {// Permute candidate function goes here
            },
            keyToString: function keyToString(_key) {// Candidate to string function goes here
              // Candidates which are the same should always result in the same string
              // Different candidates should always result in a different string
            }
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}