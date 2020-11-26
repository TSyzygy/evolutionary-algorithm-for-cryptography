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
  letter = [
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
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
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
    a: 52,
    b: 53,
    c: 54,
    d: 55,
    e: 56,
    f: 57,
    g: 58,
    h: 59,
    i: 60,
    j: 61,
    k: 62,
    l: 63,
    m: 64,
    n: 65,
    o: 66,
    p: 67,
    q: 68,
    r: 69,
    s: 70,
    t: 71,
    u: 72,
    v: 73,
    w: 74,
    x: 75,
    y: 76,
    z: 77,
  },
  messageDecrypterGenerators = {
    vigenere(message, config) {
      const convertedMessage = message
          .split("")
          .map((c) => (value.hasOwnProperty(c) ? value[c] : c)),
        keylength = config.keylength;
      return (key) => {
        var p = 0;
        return convertedMessage.reduce((plaintext, val) => {
          if (p == keylength) p = 0;
          return (
            plaintext + (typeof val == "number" ? letter[val + key[p++]] : val)
          );
        }, "");
      };
    },
    monoalphabetic(message, _config) {
      const convertedMessage = message
        .split("")
        .map((c) => (value.hasOwnProperty(c) ? value[c] : c));
      return (key) =>
        convertedMessage.reduce(
          (plaintext, val) =>
            plaintext +
            (typeof val == "number"
              ? val >= 52
                ? key[val - 52].toLowerCase()
                : key[val]
              : val),
          ""
        );
    },
    hill(message, { m }) {
      var i;

      const numbers = message
          .toUpperCase()
          .split("")
          .flatMap((c) => {
            return (i = alphabet.indexOf(c)) > -1 ? [i] : [];
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
            t + key.reduce(
              (plainRow, keyRow) =>
                plainRow +
                // Gets character for that row
                alphabet[
                  keyRow.reduce((t, c, i) => t + c * cipherRow[i], 0) % 26
                ],
              ""
            ),
          ""
        );
    },
  },
  candidateStringGenerators = {
    vigenere(_config) {
      return (key) => key.join(",");
    },
    monoalphabetic(_config) {
      return (key) => key.join("");
    },
    hill(_config) {
      return (key) => key.join(";");
    },
  },
  keyToTextGenerators = {
    vigenere(_config) {
      return (key) => key.reduce((word, n) => word + letter[26 - n], "");
    },
    monoalphabetic(_config) {
      return (key) => {
        var encryptionKey = "";
        for (let l of alphabet) {
          encryptionKey += letter[key.indexOf(l)];
        }
        return encryptionKey;
      };
    },
    hill() {
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

        return r > 1
          ? false
          : a < 0
          ? t > 0
            ? -t + n
            : -t
          : t < 0
          ? t + n
          : t;
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

      return (key) => {
        var inv = invertMatrix(key);
        return inv ? inv.join(";") : "non-invertible matrix";
      };
    },
  },
  textToKeyGenerators = {
    vigenere({ keylength }) {
      return (text) => {
        const key = [];
        var v;
        for (let char of text.toUpperCase())
          if (value.hasOwnProperty(char))
            key.push((v = value[char]) ? 26 - v : 0); // If v == 0, adds 0 to the key rather than 26
        return key.length == keylength ? key : false;
      };
    },
    monoalphabetic(_config) {
      return (text) => {
        const remainingLetters = new Set(alphabet);
        var lastLetterIndex = -1,
          encryptionKey = text
            .toUpperCase()
            .split("")
            .flatMap((char) =>
              (lastLetterIndex = alphabet.indexOf(char)) > -1 &&
              remainingLetters.delete(char)
                ? [char]
                : []
            ),
          lastLetter;

        // Adds all the remaining letters, starting from the last letter given
        while (encryptionKey.length < 26) {
          if (++lastLetterIndex == 26) lastLetterIndex = 0;

          lastLetter = alphabet[lastLetterIndex];

          // If the letter now reached is not already in the encryptionKey, adds it
          if (encryptionKey.indexOf(lastLetter) == -1)
            encryptionKey.push(lastLetter);
        }

        return alphabet.map((char) => letter[encryptionKey.indexOf(char)]);
      };
    },
    hill({ m }) {
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

        return r > 1
          ? false
          : a < 0
          ? t > 0
            ? -t + n
            : -t
          : t < 0
          ? t + n
          : t;
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

      return (key) => {
        var mat = key
          .split(";")
          .map((row) => row.split(",").map((i) => Number(i)));
        return mat.length == m && mat.every((row) => row.length == m)
          ? invertMatrix(mat)
          : false;
      };
    },
  };
