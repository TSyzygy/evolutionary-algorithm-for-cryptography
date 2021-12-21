"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NgramScore = NgramScore;
exports.Shuffle = Shuffle;
exports.PermuteOperationsManager = PermuteOperationsManager;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function rand(max) {
  return Math.floor(Math.random() * max);
}

function NgramScore(n) {
  var scores;
  return regeneratorRuntime.async(function NgramScore$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getAsset(["ngrams", "by-letter"], n + ".json"));

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

function Shuffle(baseArray) {
  var l = baseArray.length;
  return function () {
    var j,
        x,
        i,
        a = _toConsumableArray(baseArray);

    for (i = l; i > 0;) {
      j = Math.floor(Math.random() * i);
      i--;
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }

    return a;
  };
}

function PermuteOperationsManager(permuteOperations, permuteWeights) {
  return function (key) {
    /* for (let {operation, weight, max} of permuteOperations) {
      if (r < weight) {
        for (let i = rand(max) + 1; i > 0; i--) {
          newKey = operation(newKey);
        }
      }
    } */
    var newKey = key;

    for (var i = rand(10) + 1; i > 0; i--) {
      var p = Math.random();

      for (var j = 0; p > permuteWeights[j]; j++) {}

      ;
      var operation = permuteOperations[j];
      newKey = operation(newKey);
    }

    ;
    return newKey;
  };
}