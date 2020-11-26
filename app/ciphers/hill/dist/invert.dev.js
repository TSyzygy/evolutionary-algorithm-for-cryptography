"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// from https://stackoverflow.com/questions/44474864/compute-determinant-of-a-matrix
var determinant = function determinant(m) {
  return m.length == 1 ? m[0][0] : m.length == 2 ? m[0][0] * m[1][1] - m[0][1] * m[1][0] : m[0].reduce(function (r, e, i) {
    return r + Math.pow(-1, i + 2) * e * d(m.slice(1).map(function (c) {
      return c.filter(function (_, j) {
        return i != j;
      });
    }));
  }, 0);
}; // Finds the number x such that ax = 1 (mod n)


function modularInverse(a, n) {
  var t = 0,
      newT = 1,
      tempT,
      r = n,
      newR = a,
      tempR,
      quot;

  while (newR != 0) {
    quot = Math.floor(r / newR);
    tempT = t;
    t = newT;
    newT = tempT - quot * newT;
    tempR = r;
    r = newR;
    newR = tempR - quot * newR;
  }

  if (r > 1) {
    return false;
  }

  if (t < 0) {
    return t + n;
  } else {
    return t;
  }
}

function invertMatrixMod26(A) {
  var m = A.length; // Checks det != 0 and is coprime with 26

  var det = d(key);
  var detInv = modularInverse(det, 26);

  if (detInv) {
    // Calculates modular inverse of determinant
    var B = A.map(function (row, r, mat) {
      return row.map(function (item, c, row) {
        return Math.pow(-1, r + c) * det( // Gets minor
        _toConsumableArray(mat).slice(r, 1).map(function (minorRow) {
          return _toConsumableArray(minorRow).slice(c, 1);
        })) * detInv;
      } // Multiplies each element by detInv
      );
    });
  } else {
    return false;
  }
}