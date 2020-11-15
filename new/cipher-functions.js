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
  },
  textToKeyGenerators = {
    vigenere(config) {
      const keylength = config.keylength;
      return (text) => {
        var key = [];
        for (let char of text.toUpperCase()) {
          if (value.hasOwnProperty(char)) {
            key.push(26 - value[char]);
          }
        }
        return key.length == keylength ? key : false;
      };
    },
    monoalphabetic(_config) {
      return (text) => {
        var encryptionKey = [],
          decryptionKey = [],
          lastLetterIndex,
          lastLetter;

        /*
        text = text.split("").filter(c => alphabet.indexOf(c) > -1);

        for (let l of alphabet) {
          decryptionkey += letter[text.indexOf(l)];
        }
        return decryptionkey;
        */

        text = text.toUpperCase().split("");
        for (let char of text) {
          if ((lastLetterIndex = alphabet.indexOf(char)) > -1) {
            if (encryptionKey.indexOf(char) == -1) {
              encryptionKey.push(char)
            } else {
              // If a character appears twice
              return false
            };
          };
        };

        // If no valid characters given
        if (!lastLetterIndex) {
          return false
        };

        // Adds all the remaining letters, starting from the last letter given
        while (encryptionKey.length < 26) {
          if (++lastLetterIndex == 26) {
            lastLetterIndex = 0;
          };

          lastLetter = alphabet[lastLetterIndex];

          // If the letter now reached is not already in the encryptionKey, adds it
          if (encryptionKey.indexOf(lastLetter) == -1) {
            encryptionKey.push(lastLetter);
          };
        };

        for (let l of alphabet) {
          decryptionKey.push(letter[encryptionKey.indexOf(l)]);
        };

        return decryptionKey;

      };
    },
  };
