"use strict";

async function configure(messages, { n }) {
  /* return import("../standard-configure-worker-functions.js")
    .then(({ NgramScore }) => NgramScore(n)) */
  return getAsset(["ngrams"], n + ".json").then((scores) => {
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
      alphabet = [
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

    // Shortens messages to all be same length and converts them to numbersw
    var l = Infinity,
      temp;
    for (let message of messages) {
      temp = message.length;
      if (temp < l) l = temp;
    }

    function rand(max) {
      return Math.floor(Math.random() * max);
    }

    return {
      fitness: (function () {
        const convertedMessages = messages.map((message) =>
          message
            .toUpperCase()
            .split("")
            .slice(0, l)
            .flatMap((c) => ((temp = value[c]) > -1 ? [temp] : []))
        );
        const m = l - n;
        return (key) => {
          const decryptedMessages = convertedMessages.map((message) =>
              message.map((c, i) => alphabet[c + key[i]]).join("")
            ),
            scoreModifier = Math.log;
          var score = 0,
            gram;
          for (let i = 0; i <= m; i++) {
            score += decryptedMessages.reduce((t, message) => {
              gram = message.substr(i, n);
              return scores.hasOwnProperty(gram)
                ? t * scoreModifier(scores[gram])
                : 0;
            }, 1);
          }
          return score;
        };

        // Old version
        return (key) =>
          convertedMessages.reduce(
            (t, message) =>
              t +
              scorePlaintext(
                message.map((c, i) => alphabet[c + key[i]]).join("")
              ),
            0
          );
      })(),
      randomCandidate() {
        const key = [];
        for (let n = 0; n < l; n++) key.push(rand(26));
        return key;
      },
      permuteCandidate(key) {
        const permutedKey = [...key],
          numChanges = l / (rand(l) + 1); // x^-1 distribution
        var changePosition;
        for (let n = 0; n < numChanges; n++) {
          // Replaces a random item of the key with a random number
          changePosition = rand(l);
          permutedKey[changePosition] = rand(26);
        }
        return permutedKey;
      },
      keyToString(key) {
        return key.map((c) => alphabet[c]).join("");
      },
    };
  });
}
