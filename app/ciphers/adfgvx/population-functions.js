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
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];

function MessageDecrypter(message) {
  // Todo: remove non-ADFGVX characters
  const l = message.length,
    convertedMessage = [],
    chars = "ADFGVX",
    map = {};

  // Generates the square for conversion
  var i = 0;
  for (let r of chars) for (let c of chars) map[r + c] = i++;

  if (l % 2) message += "A";

  for (let p = 0; p < l; p += 2) {
    convertedMessage.push(map[message.substr(p, 2)]);
  }

  return (key) =>
    convertedMessage.reduce((plaintext, val) => plaintext + key[val], "");
}

function KeyToString() {
  return (key) => key.join("");
}

function KeyToText() {
  return (key) => {
    return key.join("")
    /*
    var encryptionKey = "";
    for (let l of alphabet) {
      encryptionKey += alphabet[key.indexOf(l)];
    };
    return encryptionKey;
    */
  };
}

function TextToKey() {
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
    while (encryptionKey.length < 36) {
      if (++lastLetterIndex == 36) lastLetterIndex = 0;

      lastLetter = alphabet[lastLetterIndex];

      // If the letter now reached is not already in the encryptionKey, adds it
      if (encryptionKey.indexOf(lastLetter) == -1)
        encryptionKey.push(lastLetter);
    }

    return encryptionKey /* inverts: alphabet.map((char) => alphabet[encryptionKey.indexOf(char)]); */
  };
}

export { MessageDecrypter, KeyToString, KeyToText, TextToKey };
