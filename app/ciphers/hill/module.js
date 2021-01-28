"use strict";

const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
  value = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8,
    J: 9,
    K: 10,
    L: 11,
    M: 12,
    N: 13,
    O: 14,
    P: 15,
    Q: 16,
    R: 17,
    S: 18,
    T: 19,
    U: 20,
    V: 21,
    W: 22,
    X: 23,
    Y: 24,
    Z: 25,
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
    j: 9,
    k: 10,
    l: 11,
    m: 12,
    n: 13,
    o: 14,
    p: 15,
    q: 16,
    r: 17,
    s: 18,
    t: 19,
    u: 20,
    v: 21,
    w: 22,
    x: 23,
    y: 24,
    z: 25,
  };

const setup = {
  displayName: "Hill",
  options: [
    {
      name: "m",
      type: "number",
      label: "Matrix size",
      description:
        "The size of the matrix used to encrypt the plaintext with the vigenere cipher.",
      params: {
        min: 2,
        max: 5,
        default: 3,
      },
    },
    {
      name: "n",
      label: "Fitness evaluation method",
      description:
        "The length of n-gram used to compare each decryption to expected English frequencies.",
      type: "select",
      params: {
        options: [
          {
            value: "",
            name: "Select fitness method...",
          },
          {
            value: "2",
            name: "Bigram score",
          },
          {
            value: "3",
            name: "Trigram score",
          },
          {
            value: "4",
            name: "Quadgram score",
          },
          {
            value: "5",
            name: "Quintgram score",
          },
        ],
      },
    },
  ],
};

// from https://stackoverflow.com/questions/44474864/compute-determinant-of-a-matrix
const determinant = (m) =>
  m.length == 1
    ? m[0][0]
    : m.length == 2
    ? m[0][0] * m[1][1] - m[0][1] * m[1][0]
    : m[0].reduce(
        (r, e, i) =>
          r +
          (-1) ** (i + 2) *
            e *
            determinant(m.slice(1).map((c) => c.filter((_, j) => i != j))),
        0
      );

// Finds the number x such that ax = 1 (mod n)
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

  return r > 1 ? false : a < 0 ? (t > 0 ? -t + n : -t) : t < 0 ? t + n : t;
}

function invertMatrix(A, mod = 26) {
  // Checks det != 0 and is coprime with 26
  var detInv = modularInverse(determinant(A), mod);
  // col, c and r are 'wrong way round', to transpose the matrix
  return detInv
    ? A.map((col, c, mat) =>
        col.map(
          (_item, r) =>
            (((((r + c) % 2 ? -1 : 1) *
              determinant(
                // Gets minor
                mat.flatMap((minorRow, minorR) =>
                  minorR == r
                    ? []
                    : [
                        minorRow.flatMap((minorItem, minorC) =>
                          minorC == c ? [] : [minorItem]
                        ),
                      ]
                )
              ) *
              // Multiplies each element by detInv
              detInv) %
              mod) +
              mod) %
            mod
        )
      )
    : false;
}

const factorReciprocals = [1 / 2, 1 / 13];
function keyspace({ m }) {
  var keyspace = 26 ** (m ** 2);
  for (let r of factorReciprocals)
    for (let n = m; n > 0; n--) keyspace *= 1 - r ** n;
  return keyspace;
}

function validateConfig(_config) {
  return { valid: true };
}

function MessageDecrypter(message, { m }) {
  var i;

  const numbers = message.split("").flatMap((c) => {
      return (i = value[c]) > -1 ? [i] : [];
    }),
    convertedMessage = [];

  // Pads message to multiple of g length
  var r = numbers.length % m;
  if (r) for (; r < m; r++) numbers.push(0);

  const l = numbers.length;
  i = 0;
  while (i < l) convertedMessage.push(numbers.slice(i, (i += m)));

  return (key) =>
    // Goes through each row of the message
    convertedMessage.reduce(
      // Goes through each character
      (t, cipherRow) =>
        t +
        key.reduce(
          (plainRow, keyRow) =>
            plainRow +
            // Gets character for that row
            alphabet[keyRow.reduce((t, c, i) => t + c * cipherRow[i], 0) % 26],
          ""
        ),
      ""
    );
}

function KeyToString(_config) {
  return (key) => key.join(";");
}

function KeyToText(_config) {
  return (key) => {
    var inv = invertMatrix(key);
    return inv ? inv.join(";") : "non-invertible matrix";
  };
}

function TextToKey({ m }) {
  return (key) => {
    var mat = key.split(";").map((row) => row.split(",").map((i) => Number(i)));
    return mat.length == m && mat.every((row) => row.length == m)
      ? invertMatrix(mat)
      : false;
  };
}

export {
  setup,
  keyspace,
  validateConfig,
  MessageDecrypter,
  KeyToString,
  KeyToText,
  TextToKey,
};
