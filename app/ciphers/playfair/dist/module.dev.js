"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cipherFunctions = cipherFunctions;
exports.setup = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var sameRowOrColParams = {
  options: [{
    value: "",
    name: "Select..."
  }, {
    value: "u",
    name: "Letter above"
  }, {
    value: "d",
    name: "Letter below"
  }, {
    value: "l",
    name: "Letter to left"
  }, {
    value: "r",
    name: "Letter to right"
  }]
};
var setup = {
  displayName: "Playfair",
  options: [{
    name: "g",
    type: "number",
    label: "Grid size",
    description: "The height and width of the grid used.",
    params: {
      min: 5,
      max: 6,
      "default": 5
    }
  }, {
    name: "alphabet",
    type: "string",
    label: "Alphabet",
    description: "The alphabet used to fill the polybius grid. Must be of lenth g^2.",
    params: {
      minlength: 25,
      maxlength: 36
    }
  }, {
    name: "sameRow",
    label: "When letters in same row:",
    description: "What to do when the letters are in the same row.",
    type: "select",
    params: sameRowOrColParams
  }, {
    name: "sameCol",
    label: "When letters in same column:",
    description: "What to do when the letters are in the same column.",
    type: "select",
    params: sameRowOrColParams
  }, {
    name: "square",
    label: "When letters form a square:",
    description: "What to do when the letters form a square.",
    type: "select",
    params: {
      options: [{
        value: "",
        name: "Select..."
      }, {
        value: "x",
        name: "Keep same x coords, swap y coords."
      }, {
        value: "y",
        name: "Keep same y coords, swap x coords."
      }]
    }
  }]
};
exports.setup = setup;

function cipherFunctions(_ref) {
  var g = _ref.g,
      alphabet = _ref.alphabet,
      sameRow = _ref.sameRow,
      sameCol = _ref.sameCol,
      square = _ref.square;
  var lenAlphabet = alphabet.length;
  if (Math.pow(g, 2) != lenAlphabet) throw Error("Incorrect alphabet length or grid size.");
  var alphabetChar = []; // Array of the alphabet

  var alphabetIndex = {}; // Object of index -> char

  for (var i = 0, c = 0, r = 0; i < lenAlphabet; i++, c++) {
    if (c == g) {
      r += 1;
      c = 0;
    }

    alphabetChar.push(alphabet[i]);
    alphabetIndex[alphabet[i]] = i;
  }

  ; // Determines sameCol, sameRow and square functions. Same code as in configure-worker.js

  function sameRowOrColFuncGetter(type) {
    switch (type) {
      case "u":
        return function (_ref2, _ref3) {
          var _ref4 = _slicedToArray(_ref2, 2),
              ax = _ref4[0],
              ay = _ref4[1];

          var _ref5 = _slicedToArray(_ref3, 2),
              bx = _ref5[0],
              by = _ref5[1];

          return [[ax, (ay + g - 1) % g], [bx, (by + g - 1) % g]];
        };

      case "d":
        return function (_ref6, _ref7) {
          var _ref8 = _slicedToArray(_ref6, 2),
              ax = _ref8[0],
              ay = _ref8[1];

          var _ref9 = _slicedToArray(_ref7, 2),
              bx = _ref9[0],
              by = _ref9[1];

          return [[ax, (ay + 1) % g], [bx, (by + 1) % g]];
        };

      case "l":
        return function (_ref10, _ref11) {
          var _ref12 = _slicedToArray(_ref10, 2),
              ax = _ref12[0],
              ay = _ref12[1];

          var _ref13 = _slicedToArray(_ref11, 2),
              bx = _ref13[0],
              by = _ref13[1];

          return [[(ax + g - 1) % g, ay], [(bx + g - 1) % g, by]];
        };

      case "r":
        return function (_ref14, _ref15) {
          var _ref16 = _slicedToArray(_ref14, 2),
              ax = _ref16[0],
              ay = _ref16[1];

          var _ref17 = _slicedToArray(_ref15, 2),
              bx = _ref17[0],
              by = _ref17[1];

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
      squareFunc = function squareFunc(_ref18, _ref19) {
        var _ref20 = _slicedToArray(_ref18, 2),
            ax = _ref20[0],
            ay = _ref20[1];

        var _ref21 = _slicedToArray(_ref19, 2),
            bx = _ref21[0],
            by = _ref21[1];

        return [[ax, by], [bx, ay]];
      };

      break;

    case "y":
      squareFunc = function squareFunc(_ref22, _ref23) {
        var _ref24 = _slicedToArray(_ref22, 2),
            ax = _ref24[0],
            ay = _ref24[1];

        var _ref25 = _slicedToArray(_ref23, 2),
            bx = _ref25[0],
            by = _ref25[1];

        return [[bx, ay], [ax, by]];
      };

      break;

    default:
      throw Error("Invalid square setting.");
  }

  ;
  return {
    MessageDecrypter: function MessageDecrypter(message) {
      var converted = [];
      var l = message.length;

      if (l % 2) {
        message += alphabet[0];
      }

      ;

      for (var p = 0, a, b, _i2, j, char2; p < l; p++) {
        a = message[p];
        b = message[++p];
        _i2 = alphabetIndex[a];
        j = alphabetIndex[b];
        converted.push([_i2, j]);
      }

      ;
      return function (key) {
        var decrypt = "";
        var aCoord, ax, ay, bCoord, bx, by, c, cx, cy, d, dx, dy;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = converted[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                _a = _step$value[0],
                _b = _step$value[1];

            var _aCoord = aCoord = key[_a];

            var _aCoord2 = _slicedToArray(_aCoord, 2);

            ax = _aCoord2[0];
            ay = _aCoord2[1];

            var _bCoord = bCoord = key[_b];

            var _bCoord2 = _slicedToArray(_bCoord, 2);

            bx = _bCoord2[0];
            by = _bCoord2[1];

            var _ref26 = ax == bx ? // Same col
            sameColFunc(aCoord, bCoord) : ay == by ? // Same row
            sameRowFunc(aCoord, bCoord) // Different col+row (square)
            : squareFunc(aCoord, bCoord);

            var _ref27 = _slicedToArray(_ref26, 2);

            var _ref27$ = _slicedToArray(_ref27[0], 2);

            cx = _ref27$[0];
            cy = _ref27$[1];

            var _ref27$2 = _slicedToArray(_ref27[1], 2);

            dx = _ref27$2[0];
            dy = _ref27$2[1];
            // Todo: improve efficiency?
            c = key.findIndex(function (_ref28) {
              var _ref29 = _slicedToArray(_ref28, 2),
                  x = _ref29[0],
                  y = _ref29[1];

              return x == cx && y == cy;
            });
            d = key.findIndex(function (_ref30) {
              var _ref31 = _slicedToArray(_ref30, 2),
                  x = _ref31[0],
                  y = _ref31[1];

              return x == dx && y == dy;
            });
            decrypt += alphabet[c] + alphabet[d];
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

        return decrypt;
      };
    },
    keyToString: function keyToString(key) {
      return key.join(";");
    },
    keyToText: function keyToText(key) {
      // TODO: improve
      var text = [];

      for (var _i3 = 0; _i3 < lenAlphabet; _i3++) {
        text.push(null);
      }

      ;

      var _char, x, y;

      for (var _i4 = 0; _i4 < lenAlphabet; _i4++) {
        _char = alphabetChar[_i4];

        var _key$_i = _slicedToArray(key[_i4], 2);

        x = _key$_i[0];
        y = _key$_i[1];
        text[y * g + x] = _char;
      }

      ;
      return text.join("");
    },
    textToKey: function textToKey(text) {
      var key = [];

      for (var _i5 = 0; _i5 < lenAlphabet; _i5++) {
        key.push(null);
      }

      ;
      var x = 0;
      var y = 0;
      var i;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = text[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _char2 = _step2.value;
          i = alphabetIndex[_char2];
          key[i] = [x++, y];

          if (x == g) {
            x = 0;
            y++;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      ;
      return key;
    }
  };
}