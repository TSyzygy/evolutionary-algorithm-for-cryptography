"use strict";

const value = {
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
  }, alphabet = [
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
  ];

const setup = {
  displayName: "One-time pad",
  options: [
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

function keyspace(_config) {
  return Infinity;
}

function validateConfig(_config) {
  return { valid: true };
}

function MessageDecrypter(message) {
  var temp;
  const convertedMessage = message
    .toUpperCase()
    .split("")
    .flatMap((c) => ((temp = value[c]) > -1 ? [temp] : []));
  
  return key => key.map((c, i) => alphabet[c + convertedMessage[i]]).join("");
}

function KeyToString(_config) {
  return ((key) => key.map((c) => alphabet[c]).join(""));
}

function KeyToText(_config) {
  return ((key) => key.map((c) => alphabet[c]).join(""));
}

function TextToKey(_config) {
  return ((_text) => false);
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
