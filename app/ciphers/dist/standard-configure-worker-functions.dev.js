"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NgramScore = NgramScore;

function NgramScore(n) {
  var scores;
  return regeneratorRuntime.async(function NgramScore$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getAsset(["ngrams"], n + ".json"));

        case 2:
          scores = _context.sent;
          return _context.abrupt("return", function (plaintext) {
            var score = 0,
                gram;

            for (var i = 0, max = plaintext.length - n; i < max; i++) {
              if (scores.hasOwnProperty(gram = plaintext.substr(i, n))) score += scores[gram];
            }

            return score / plaintext.length;
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}