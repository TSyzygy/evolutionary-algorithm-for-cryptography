"use strict";

var cipherDecrypters = {
  vigenere: function vigenere(m, k) {
    var decrypt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var resChar;
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var encrypted = "";
    var i = 0;
    var l = k.length;
    var numeric = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = k[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _char = _step.value;
        num = alphabet.indexOf(_char.toUpperCase());

        if (num > -1) {
          numeric.push(num);
        } else {
          return false;
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

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = m[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _char = _step2.value;

        if (alphabet.indexOf(_char.toUpperCase()) > -1) {
          diff = numeric[i];

          if (decrypt) {
            diff *= -1;
          }

          resChar = alphabet.charAt((alphabet.indexOf(_char.toUpperCase()) + diff + 26) % 26);

          if (_char == _char.toLowerCase()) {
            resChar = resChar.toLowerCase();
          }

          encrypted += resChar;
          i++;

          if (i == l) {
            i = 0;
          }
        } else {
          encrypted += _char;
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

    return encrypted;
  }
};