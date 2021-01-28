"use strict";

function configure(messages, { keylength, n }) {
  return import("../standard-configure-worker-functions.js")
    .then(({ NgramScore }) => NgramScore(n))
    .then((scorePlaintext) => ({
      fitness: (function () {
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
        ]);

        const filterMessage = (message) =>
          message
            .toUpperCase()
            .split("")
            .filter((c) => alphabet.has(c));

        function scoreMessage(message, key) {
          var decrypted = "";
          for (let l = message.length, i = 0, b = 0, p = 0; i < l; i++, p++) {
            if (p == keylength) {
              p = 0;
              b += keylength;
            }
            decrypted += message[b + key[p]];
          }
          return scorePlaintext(decrypted);
        }

        if (messages.length > 1) {
          // If only one message provided
          messages = messages.map(filterMessage);
          return (key) =>
            messages.reduce((t, message) => t + scoreMessage(message, key));
        } else {
          // If multiple messages provided
          const message = filterMessage(messages[0]);
          return (key) => scoreMessage(message, key);
        }
      })(),
      randomCandidate: (() => {
        const items = [];
        var n = 0;
        while (n < keylength) items.push(n++);

        return () => {
          var j,
            x,
            i,
            a = [...items];
          for (i = keylength - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
          }
          return a;
        };
      })(),
      permuteCandidate: (() => {
        const operations = [
            // The different operations
            swap,
            flip,
            shift,
          ],
          operationWeights = [
            // The different combinations of the operations; each 'column' below is equally weighted
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3],
            [1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0],
          ];

        // Gets a random number between min and max-1
        const rand = (max) => Math.floor(Math.random() * max);

        // Swaps two randomly chosen positions within the key
        function swap(key) {
          const newKey = [...key];
          var posA = rand(keylength),
            temp = newKey[posA],
            posB;
          do {
            posB = rand(keylength);
          } while (posA == posB);
          newKey[posA] = newKey[posB];
          newKey[posB] = temp;
          return newKey;
        }

        // Shifts some positions from the front to the back of the list
        function flip(key) {
          const posA = rand(keylength - 1) + 1;
          return key.slice(posA, keylength).concat(key.slice(0, posA));
        }

        // Shifts a block some distance to the right
        function shift(key) {
          const blockLength = rand(keylength - 2) + 2,
            blockStart = rand(keylength - blockLength),
            blockEnd = blockStart + blockLength,
            distance = rand(keylength - blockLength - blockStart) + 1,
            moveTo = blockEnd + distance;
          return key
            .slice(0, blockStart)
            .concat(
              key.slice(blockEnd, moveTo),
              key.slice(blockStart, blockEnd),
              key.slice(moveTo, keylength)
            );
        }

        return (key) => {
          // Could be made more efficient
          for (let i = rand(operationWeights[0].length), f = 0; f < operations.length; f++)
            for (
              let n = 0,
                repeat = operationWeights[f][i],
                operation = operations[f];
              n < repeat;
              n++
            )
              key = operation(key);

          return key;
        };
      })(),
      keyToString(key) {
        return key.join(",");
      },
    }));
}
