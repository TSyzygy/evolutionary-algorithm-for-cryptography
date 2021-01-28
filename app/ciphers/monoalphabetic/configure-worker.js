"use strict";

async function configure(messages, { n }) {
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
    },
    { NgramScore } = await import("../standard-configure-worker-functions.js"),
    scorePlaintext = await NgramScore(n);

  // Gets a random number between min and max-1
  const rand = (max) => Math.floor(Math.random() * max);

  return {
    fitness: (function () {
      const convertMessage = (message) => message.toUpperCase().split("").flatMap((c) => (value.hasOwnProperty(c) ? [value[c]] : [])),
        scoreMessage = (message, key) => scorePlaintext(message.reduce((t, c) => t + key[c], ""));

      // If multiple messages provided
      if (messages.length > 1) {
        messages = messages.map(convertMessage);
        // Converts messages to numerical form
        return (key) =>
          messages.reduce((t, message) => t + scoreMessage(message, key));
        // If only one message provided
      } else {
        const message = convertMessage(messages[0]);
        return (key) => scoreMessage(message, key);
      }
    })(),
    randomCandidate() {
      var j, x, i;
      const a = [
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
      for (i = 25; i > 0; i--) {
        j = rand(i + 1)
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      return a;
    },
    permuteCandidate(key) {
      var posA, posB, temp;
      const permutedKey = [...key];
      for (let numSwaps = rand(4) + 1; numSwaps > 0; numSwaps--) {
        posA = rand(26);
        posB = rand(26); // TODO: ensure posA != posB?
        temp = permutedKey[posA];
        permutedKey[posA] = permutedKey[posB];
        permutedKey[posB] = temp;
      }
      return permutedKey;
    },
    keyToString(key) {
      return key.join("");
    },
  };
}
