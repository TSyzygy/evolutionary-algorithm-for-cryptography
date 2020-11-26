"use strict";

async function configure(messages, { m, n }) {
  // m is matrix size, n is n-gram size for scoring
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    scores = n > 1 ? await getAsset("ngrams/" + n + ".json") : await getAsset("ngrams/1-by-letter.json");

  // Gets a random number between min and max-1
  function rand(max) {
    return Math.floor(Math.random() * max);
  }

  // Return an object with fitness, randomCandidate, permuteCandidate, and candidateToString methods
  return {
    // Here is a possible structure for the fitness function, using an IIFE
    fitness: (function () {
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
                  determinant(
                    m.slice(1).map((c) => c.filter((_, j) => i != j))
                  ),
              0
            );

      function convertMessage(message) {
        var i;

        const numbers = message
            .toUpperCase()
            .split("")
            .flatMap((c) => {
              return (i = alphabet.indexOf(c)) > -1 ? [i] : [];
            }),
          result = [];

        // Pads message to multiple of g length
        const l = numbers.length;
        var r = l % m;
        if (r) for (; r < m; r++) numbers.push(0);

        i = 0;
        while (i < l) result.push(numbers.slice(i, (i += m)));
        return result;
      }

      const scoreMessage =
        n > 1
          ? function (message, key) {
              const decrypted = decryptMessage(message, key),
                max = message.length - n;
              var score = 0,
                gram;
              for (let i = 0; i < max; i++)
                if (scores.hasOwnProperty((gram = decrypted.substr(i, n))))
                  score += scores[gram];
              return score / message.length;
            }
          : function (message, key) {
              return decryptMessage(message, key).split("").reduce(
                (t, c) => t + scores[c],
                0
              ) / message.length;
            };

      if (messages.length > 1) {
        // If only one message provided
        messages = messages.map(convertMessage);
        var scoreKey = (key) =>
          messages.reduce((t, message) => t + scoreMessage(message, key));
      } else {
        // If multiple messages provided
        const message = convertMessage(messages[0]);
        var scoreKey = (key) => scoreMessage(message, key);
      }

      return (key) => {
        const det = determinant(key);
        return det && det % 2 && det % 13 ? scoreKey(key) : 0;
      };
    })(),
    randomCandidate() {
      var key = [],
        row;
      for (let r = 0; r < m; r++) {
        row = [];
        for (let c = 0; c < m; c++) row.push(rand(26));
        key.push(row);
      }
      return key;
    },
    permuteCandidate(key) {
      const permutedKey = key.map((row) => [...row]),
        row = permutedKey[rand(m)];
      for (let numChanges = rand(m); numChanges >= 0; numChanges--)
        row[rand(m)] = rand(26);
      return permutedKey;
    },
    candidateToString(key) {
      // TODO: improve
      return key.join(";");
    },
  };

  function decryptMessage(message, key) {
    return message.reduce(
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
}
