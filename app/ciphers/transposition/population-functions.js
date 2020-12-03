"use strict";

const alphabet = new Set([
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
  ]);

function MessageDecrypter(message, { keylength }) {
  const filteredMessage = message
    .split("")
    .filter((c) => alphabet.has(c));
  return (key) => {
    var p = 0,
      b = 0;
    return filteredMessage.reduce((plaintext, val, _i, ciphertext) => {
      if (p == keylength) {
        p = 0;
        b += keylength;
      };
      return plaintext + ciphertext[val + key[p++]];
    }, "");
  };
}

function KeyToString() {
  return key => key.join(",")
}

function KeyToText() {
  return key => key.join(",")
}

function TextToKey() {
  return text => text.split(",").map(Number)
}

export { MessageDecrypter, KeyToString, KeyToText, TextToKey };
