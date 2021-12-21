"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function configure(messages, _ref) {
  var g, alphabet, sameRow, sameCol, square;
  return regeneratorRuntime.async(function configure$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          g = _ref.g, alphabet = _ref.alphabet, sameRow = _ref.sameRow, sameCol = _ref.sameCol, square = _ref.square;
          return _context2.abrupt("return", Promise.resolve().then(function () {
            return _interopRequireWildcard(require("../standard-configure-worker-functions"));
          }).then(function _callee(_ref2) {
            var Shuffle, PermuteOperationsManager, scores, lenAlphabet, alphabetChar, alphabetIndex, baseKey, i, c, r, rand, permuteOperations, permuteWeights;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    rand = function _ref41(max) {
                      return Math.floor(Math.random() * max);
                    };

                    Shuffle = _ref2.Shuffle, PermuteOperationsManager = _ref2.PermuteOperationsManager;
                    _context.next = 4;
                    return regeneratorRuntime.awrap(getAsset(["ngrams", "by-index"], "2.json"));

                  case 4:
                    scores = _context.sent;
                    // The getAsset function is available to request any asset stored in the assets folder
                    lenAlphabet = alphabet.length;

                    if (!(Math.pow(g, 2) != lenAlphabet)) {
                      _context.next = 8;
                      break;
                    }

                    throw Error("Incorrect alphabet length or grid size.");

                  case 8:
                    // if (n != 2) throw Error("Only bigrams analysis currently supported.")
                    alphabetChar = []; // Array of the alphabet

                    alphabetIndex = {}; // Object of char -> index

                    baseKey = [];

                    for (i = 0, c = 0, r = 0; i < lenAlphabet; i++, c++) {
                      if (c == g) {
                        r += 1;
                        c = 0;
                      }

                      alphabetChar.push(alphabet[i]);
                      alphabetIndex[alphabet[i]] = i;
                      baseKey.push([c, r]);
                    }

                    ; // Declare functions, e.g:

                    permuteOperations = [function swapItems(key) {
                      var newKey = _toConsumableArray(key);

                      var i = rand(lenAlphabet);
                      var j = rand(lenAlphabet);
                      var a = newKey[i];
                      newKey[i] = newKey[j];
                      newKey[j] = a;
                      return newKey; // For debugging - returns correct key:
                      // return [[2,0],[0,3],[1,3],[2,3],[1,0],[5,0],[3,3],[0,1],[4,3],[5,3],[3,0],[0,4],[1,4],[2,1],[4,0],[0,0],[3,1],[4,1],[5,1],[0,2],[1,2],[1,1],[2,2],[3,2],[4,2],[5,2],[2,4],[3,4],[4,4],[5,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]]
                    }, function swapLines(key) {
                      var l = rand(2); // 0 = swap rows, 1 = swap cols
                      // Generates two random distinct column/row numbers to swap

                      var i = rand(g);
                      var j = rand(g - 1);
                      if (j >= i) j++;
                      return l // Swap cols
                      ? key.map(function (_ref3) {
                        var _ref4 = _slicedToArray(_ref3, 2),
                            x = _ref4[0],
                            y = _ref4[1];

                        return x == i ? [j, y] : x == j ? [i, y] : [x, y];
                      }) // Swap rows
                      : key.map(function (_ref5) {
                        var _ref6 = _slicedToArray(_ref5, 2),
                            x = _ref6[0],
                            y = _ref6[1];

                        return y == i ? [x, j] : y == j ? [x, i] : [x, y];
                      });
                    }, function flip(key) {
                      var l = rand(2); // Determines which diagonal to flip along

                      return l ? key.map(function (_ref7) {
                        var _ref8 = _slicedToArray(_ref7, 2),
                            x = _ref8[0],
                            y = _ref8[1];

                        return [y, x];
                      }) : key.map(function (_ref9) {
                        var _ref10 = _slicedToArray(_ref9, 2),
                            x = _ref10[0],
                            y = _ref10[1];

                        return [g - 1 - y, g - 1 - x];
                      });
                    }];
                    permuteWeights = [0.9, 0.99, 1]; // Return an object with fitness, randomCandidate, permuteCandidate, and keyToString methods

                    return _context.abrupt("return", {
                      // Here is a possible structure for the fitness function, using an IIFE
                      fitness: function () {
                        // Checked: bigram counting works with g=5
                        var bigrams = {};
                        var l;
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                          for (var _iterator = messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var message = _step.value;
                            l = message.length;

                            if (l % 2) {
                              throw Error("Messages must have an even number of characters.");
                            }

                            for (var p = 0, a, b, _i2, j, char2; p < l; p++) {
                              a = message[p];
                              b = message[++p];
                              if (a == b) throw Error("Cannot have bigram with both characters the same.");
                              if (!alphabetIndex.hasOwnProperty(a) || !alphabetIndex.hasOwnProperty(b)) throw Error("Non-alphabet characters present.");
                              _i2 = alphabetIndex[a];
                              j = alphabetIndex[b];
                              char2 = bigrams.hasOwnProperty(_i2) ? bigrams[_i2] : bigrams[_i2] = {};

                              if (char2.hasOwnProperty(j)) {
                                char2[j]++;
                              } else {
                                char2[j] = 1;
                              }
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

                        ; // Determines sameCol, sameRow and square functions. Same code as in configure-worker.js

                        function sameRowOrColFuncGetter(type) {
                          switch (type) {
                            case "u":
                              return function (_ref11, _ref12) {
                                var _ref13 = _slicedToArray(_ref11, 2),
                                    ax = _ref13[0],
                                    ay = _ref13[1];

                                var _ref14 = _slicedToArray(_ref12, 2),
                                    bx = _ref14[0],
                                    by = _ref14[1];

                                return [[ax, (ay + g - 1) % g], [bx, (by + g - 1) % g]];
                              };

                            case "d":
                              return function (_ref15, _ref16) {
                                var _ref17 = _slicedToArray(_ref15, 2),
                                    ax = _ref17[0],
                                    ay = _ref17[1];

                                var _ref18 = _slicedToArray(_ref16, 2),
                                    bx = _ref18[0],
                                    by = _ref18[1];

                                return [[ax, (ay + 1) % g], [bx, (by + 1) % g]];
                              };

                            case "l":
                              return function (_ref19, _ref20) {
                                var _ref21 = _slicedToArray(_ref19, 2),
                                    ax = _ref21[0],
                                    ay = _ref21[1];

                                var _ref22 = _slicedToArray(_ref20, 2),
                                    bx = _ref22[0],
                                    by = _ref22[1];

                                return [[(ax + g - 1) % g, ay], [(bx + g - 1) % g, by]];
                              };

                            case "r":
                              return function (_ref23, _ref24) {
                                var _ref25 = _slicedToArray(_ref23, 2),
                                    ax = _ref25[0],
                                    ay = _ref25[1];

                                var _ref26 = _slicedToArray(_ref24, 2),
                                    bx = _ref26[0],
                                    by = _ref26[1];

                                return [[(ax + 1) % g, ay], [(bx + 1) % g, by]];
                              };

                            default:
                              throw Error();
                          }
                        }

                        try {
                          var sameColFunc = sameRowOrColFuncGetter(sameCol);
                        } catch (error) {
                          throw Error("Invalid sameCol setting.");
                        }

                        ;

                        try {
                          var sameRowFunc = sameRowOrColFuncGetter(sameRow);
                        } catch (error) {
                          throw Error("Invalid sameCol setting.");
                        }

                        ;
                        var squareFunc;

                        switch (square) {
                          case "x":
                            squareFunc = function squareFunc(_ref27, _ref28) {
                              var _ref29 = _slicedToArray(_ref27, 2),
                                  ax = _ref29[0],
                                  ay = _ref29[1];

                              var _ref30 = _slicedToArray(_ref28, 2),
                                  bx = _ref30[0],
                                  by = _ref30[1];

                              return [[ax, by], [bx, ay]];
                            };

                            break;

                          case "y":
                            squareFunc = function squareFunc(_ref31, _ref32) {
                              var _ref33 = _slicedToArray(_ref31, 2),
                                  ax = _ref33[0],
                                  ay = _ref33[1];

                              var _ref34 = _slicedToArray(_ref32, 2),
                                  bx = _ref34[0],
                                  by = _ref34[1];

                              return [[bx, ay], [ax, by]];
                            };

                            break;

                          default:
                            throw Error("Invalid square setting.");
                        }

                        function scoreBigram(a, b) {
                          // What about z? (g=5 means only 25 chars). And when g=6?
                          if (scores.hasOwnProperty(a)) {
                            var char2 = scores[a];

                            if (char2.hasOwnProperty(b)) {
                              return char2[b];
                            } else return 0;
                          } else return 0;
                        }

                        return function (key) {
                          var freq, char2, aCoord, ax, ay, bCoord, bx, by, c, cx, cy, d, dx, dy;
                          var score = 0;

                          for (var a in bigrams) {
                            char2 = bigrams[a];

                            var _aCoord = aCoord = key[a];

                            var _aCoord2 = _slicedToArray(_aCoord, 2);

                            ax = _aCoord2[0];
                            ay = _aCoord2[1];

                            for (var b in char2) {
                              freq = char2[b];

                              var _bCoord = bCoord = key[b];

                              var _bCoord2 = _slicedToArray(_bCoord, 2);

                              bx = _bCoord2[0];
                              by = _bCoord2[1];

                              var _ref35 = ax == bx ? // Same col
                              sameColFunc(aCoord, bCoord) : ay == by ? // Same row
                              sameRowFunc(aCoord, bCoord) // Different col+row (square)
                              : squareFunc(aCoord, bCoord);

                              var _ref36 = _slicedToArray(_ref35, 2);

                              var _ref36$ = _slicedToArray(_ref36[0], 2);

                              cx = _ref36$[0];
                              cy = _ref36$[1];

                              var _ref36$2 = _slicedToArray(_ref36[1], 2);

                              dx = _ref36$2[0];
                              dy = _ref36$2[1];
                              // Todo: improve efficiency?
                              c = key.findIndex(function (_ref37) {
                                var _ref38 = _slicedToArray(_ref37, 2),
                                    x = _ref38[0],
                                    y = _ref38[1];

                                return x == cx && y == cy;
                              });
                              d = key.findIndex(function (_ref39) {
                                var _ref40 = _slicedToArray(_ref39, 2),
                                    x = _ref40[0],
                                    y = _ref40[1];

                                return x == dx && y == dy;
                              });
                              score += scoreBigram(c, d) * freq;
                            }
                          }

                          return score;
                        };
                      }(),
                      randomCandidate: Shuffle(baseKey),
                      permuteCandidate: PermuteOperationsManager(permuteOperations, permuteWeights),
                      // PermuteOperationsManager(permuteOperations),
                      keyToString: function keyToString(key) {
                        // Todo: improve? Remember also change keyToString in module.js
                        return key.join(";");
                      }
                    });

                  case 16:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}