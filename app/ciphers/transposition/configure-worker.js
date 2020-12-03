"use strict";

async function configure(messages, { keylength, n }) {
  if (n == 1) throw new Error("n = 1");

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
    ]),
    scores = await getAsset("ngrams/" + n + ".json"),
    operations = [
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
  function rand(max) {
    return Math.floor(Math.random() * max);
  }

  // Swaps two randomly chosen positions within the key
  function swap(key) {
    var posB, temp;
    var keylength = key.length;
    var posA = randRange(0, keylength);
    do {
      posB = randRange(0, keylength);
    } while (posA == posB);
    temp = key[posA];
    key[posA] = key[posB];
    key[posB] = temp;
    return key;
  }

  // Shifts some positions from the front to the back of the list
  function flip(key) {
    var keylength = key.length;
    var posA = randRange(1, keylength);
    return key.slice(posA, keylength).concat(key.slice(0, posA));
  }

  // Shifts a block some distance to the right
  function shift(key) {
    var blockLength = randRange(1, keylength - 1),
      blockStart = randRange(0, keylength - blockLength),
      blockEnd = blockStart + blockLength,
      distance = randRange(1, keylength - blockLength - blockStart + 1),
      moveTo = blockEnd + distance;
    return [
      ...key.slice(0, blockStart),
      ...key.slice(blockEnd, moveTo),
      ...key.slice(blockStart, blockEnd),
      ...key.slice(moveTo, keylength),
    ];
  }

  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  return {
    fitness: (function () {
      function filterMessage(message) {
        return message
          .toUpperCase()
          .split("")
          .filter((c) => alphabet.has(c));
      }

      function scoreMessage(message, key) {
        const decrypted = [],
          l = message.length;

        for (let i = 0, b = 0, p = 0; i < l; i++, p++) {
          if (p == keylength) {
            p = 0;
            b += keylength;
          }
          decrypted.push(message[b + key[p]]);
        }

        var score = 0,
          gram;
        for (let i = 0, max = l - n; i < max; i++)
          if (scores.hasOwnProperty((gram = decrypted.substr(i, n))))
            score += scores[gram];
        return score / message.length;
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
    randomCandidate() {
      const items = [];
      var i = 0;
      while (i < keylength) items.push(i++);
      return shuffle(items);
    },
    permuteCandidate(key) {
      // Could be made more efficient
      const newKey = [...key],
        i = randRange(0, operationWeights[0].length);

      for (let f = 0; f < operations.length; f++)
        for (
          let n = 0, repeat = operationWeights[f][i], operation = operations[f];
          n < repeat;
          n++
        )
          newKey = operation([...newKey]);

      return newKey;
    },
    keyToString(key) {
      return key.join(",");
    },
  };
}
