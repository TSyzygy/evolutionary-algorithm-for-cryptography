"use strict";

// Here is a template for a possible structure of a worker config function for a cipher
async function configure(messages, { n }) {
  // Declare constants, e.g:
  const scores = await getAsset(["ngrams", "by-letter"], n + ".json"); // The getAsset function is available to request any asset stored in 

  // Declare functions, e.g:
  function rand(max) {
    return Math.floor(Math.random() * max);
  }

  // Return an object with fitness, randomCandidate, permuteCandidate, and keyToString methods
  return {
    // Here is a possible structure for the fitness function, using an IIFE
    fitness: (function () {
      function convertMessage (message) {
        // Todo: remove non-ADFGVX characters
        const l = message.length,
          converted = [],
          chars = "ADFGVX",
          map = {};
        
        // Generates the square for conversion
        var i = 0;
        for (let r of chars) for (let c of chars) map[r + c] = i++;

        if (l % 2) message += "A";

        for (let p = 0; p < l; p += 2)
          converted.push(map[message.substr(p, 2)]);

        return converted;

        /*
          map = {
            A: 0,
            D: 1,
            F: 2,
            G: 3,
            V: 4,
            X: 5
          };
        message = message.toUpperCase().split("").map(c => map[c]);
        // Ensures message length is even
        if (l % 2) message.push(0);
        // Splits into pairs
        for (let p = 0; p < l;) {
          converted.push([message[p++], message[p++]]);
        };
        return converted;
        */
      };

      function scoreMessage(message, key) {
        // This double iteration is the fastest method I have found so far
        const decrypted = message.reduce((t, c) => t + key[c], ""),
          max = message.length - n;
        var score = 0,
          gram;
        for (let i = 0; i < max; i++)
          if (scores.hasOwnProperty((gram = decrypted.substr(i, n))))
            score += scores[gram];
        return score / message.length;
      };

      if (messages.length > 1) {
        // If only one message provided
        messages = messages.map(convertMessage);
        return (key) =>
          messages.reduce((t, message) => t + scoreMessage(message, key));
      } else {
        // If multiple messages provided
        const message = convertMessage(messages[0]);
        return (key) => scoreMessage(message, key);
      }
    })(),
    randomCandidate() {
      var j,
        x,
        i;
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
      for (i = 25; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      };
      return a;
    },
    permuteCandidate(key) {
      var posA, posB, temp;
      const permutedKey = [...key];
      for (let numSwaps = rand(4) + 1; numSwaps > 0; numSwaps--) {
        posA = rand(36);
        posB = rand(36); // TODO: ensure posA != posB?
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
