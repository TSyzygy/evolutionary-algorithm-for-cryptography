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

function MessageDecrypter(message, config) {
  const convertedMessage = message
    .split("")
    .map((c) => (value.hasOwnProperty(c) ? value[c] : c)),
    lettersOnlyMessage = convertedMessage.filter((c) => alphabet.indexOf(c) >);
  return (key) => {
    var p = 0, b = 0;
    return convertedMessage.reduce((plaintext, val) => {
      if (p == keylength) {
        p = 0;
        b += keylength
      };
      return (
        plaintext + (typeof val == "number" ? letter[val + key[p++]] : val)
      );
    }, "");
  };
  const decrypted = [];

  for (let i = 0, b = 0, p = 0, l = message.length; i < l; (i++, p++)) {
    if (p == keylength) {
      p = 0;
      b += keylength;
    };
    decrypted.push(message[b + key[p]]);
  };
};

function KeyToString(config) {

};

function KeyToText(config) {

};

function TextToKey(config) {
  
};

export { MessageDecrypter, KeyToString, KeyToText, TextToKey };
