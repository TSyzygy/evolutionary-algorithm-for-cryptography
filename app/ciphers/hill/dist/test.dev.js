"use strict";

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";
var g = 3;

var convertMessage = function convertMessage(message) {
  var numbers = message.toUpperCase().split("").flatMap(function (c) {
    var i = alphabet.indexOf(c);
    return i > -1 ? [i] : [];
  }),
      result = []; // Pads message to multiple of g length

  while (numbers.length % g) {
    numbers.push(0);
  }

  ;
  var l = numbers.length;

  for (var i = 0; i < l;) {
    result.push(numbers.slice(i, i += 3));
  }

  ;
  return result;
};

console.log(convertMessage("HELLOWORLD"));

function hill(messages, _ref) {
  var g, n, alphabet, alphabetLength, scores, convertMessage, scoreMessage, fitness, randomCandidate, permuteCandidate, message;
  return regeneratorRuntime.async(function hill$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          g = _ref.g, n = _ref.n;
          alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";
          alphabetLength = 26;
          _context.next = 5;
          return regeneratorRuntime.awrap(getAsset("ngrams/" + n + ".json"));

        case 5:
          scores = _context.sent;

          convertMessage = function convertMessage(message) {
            var numbers = message.toUpperCase().split("").flatMap(function (c) {
              var i = alphabet.indexOf(c);
              return i > -1 ? [i] : [];
            }),
                result = []; // Pads message to multiple of g length

            while (numbers.length % g) {
              numbers.push(0);
            }

            ;
            var l = numbers.length;

            for (var i = 0; i < l; i += 3) {
              result.push(numbers.substr(i, 3));
            }

            ;
            return result;
          };

          scoreMessage = n > 1 // Ngram score
          ? function (message, key) {
            var keylength = key.length;
            var gram = message.slice(0, n),
                p = 0,
                score = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = message[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _char = _step.value;
                gram.shift();
                gram.push(alphabet[_char + key[p]]);
                score += scores[gram.join("")] || 0;

                if (++p == keylength) {
                  p = 0;
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

            return score / message.length;
          } // Letter score
          : function (message, key) {
            return message.reduce(function (t, c, p) {
              return t + scores[c + key[p % keylength]];
            }) / message.length;
          };

          // If multiple messages provided
          if (messages.length > 1) {
            messages = messages.map(convertMessage); // Converts messages to numerical form

            fitness = function fitness(key) {
              return messages.reduce(function (t, message) {
                return t + scoreMessage(message, key);
              });
            }; // If only one message provided

          } else {
            message = convertMessage(messages[0]);

            fitness = function fitness(key) {
              return scoreMessage(message, key);
            };
          }

          randomCandidate = function randomCandidate() {
            var key = [],
                row;

            for (var r = 0; r < g; r++) {
              row = [];

              for (var c = 0; c < g; c++) {
                row.push(Math.round(Math.random() * alphabetLength));
              }
            }
          };

          return _context.abrupt("return", {
            fitness: fitness,
            randomCandidate: randomCandidate,
            permuteCandidate: permuteCandidate,
            candidateString: candidateString
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
}