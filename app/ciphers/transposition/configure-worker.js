"use strict";

async function configure(messages, { keylength, n }) {
  if (n == 1) throw new Error("N = 1");

  const scores = await getAsset("ngrams/" + n + ".json");

  function rand(max) {
    return Math.floor(Math.random() * max);
  }

  return {
    fitness: (function () {
      function convertMessage (message) {
        var i;
        return message
          .toUpperCase()
          .split("")
          .flatMap((c) => (i = alphabet.indexOf(c) > -1) ? [i] : []);
      };

      function scoreMessage (message, key) {
        const decrypted = [];
        
        for (let i = 0, b = 0, p = 0, l = message.length; i < l; (i++, p++)) {
          if (p == keylength) {
            p = 0;
            b += keylength;
          };
          decrypted.push(message[b + key[p]]);
        };

        var score = 0,
          gram;
        for (let i = 0, max = l - n; i < max; i++)
          if (scores.hasOwnProperty((gram = decrypted.substr(i, n)))) score += scores[gram];
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
      function shuffle (a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
        }
        return a;
      }
      var items = [], i = 0;
      while (i < keylength) items.push(i++);
      return shuffle(items);
    },
    permuteCandidate(key) {
      var operations, operationWeights, i, f, n, repeat, operation;
      var newKey = [...key];
    
      // Swaps two randomly chosen positions within the key
      function swap (key) {
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
      };
    
      // Shifts some positions from the front to the back of the list
      function flip (key) {
        var keylength = key.length;
        var posA = randRange(1, keylength);
        return key.slice(posA, keylength).concat(key.slice(0, posA));
      };
    
      // Shifts a block some distance to the right
      function shift (key) {
        var keylength = key.length;
        var blockStart, blockEnd, distance, moveTo;
        var blockLength = randRange(1, keylength - 1); // 9
        blockStart = randRange(0, keylength - blockLength); // 0
        blockEnd = blockStart + blockLength;
        distance = randRange(1, keylength - blockLength - blockStart + 1); // 1
        moveTo = blockEnd + distance;
        return [...key.slice(0, blockStart), ...key.slice(blockEnd, moveTo), ...key.slice(blockStart, blockEnd), ...key.slice(moveTo, keylength)];
      };
    
      operations = [ // The different operations
        swap,
        flip,
        shift
      ];
      operationWeights = [ // The different combinations of the operations; each 'column' below is equally weighted
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3],
        [1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 0, 0]
      ];
    
      i = randRange(0, operationWeights[0].length);
    
      for (f = 0; f < operations.length; f++) {
        repeat = operationWeights[f][i];
        operation = operations[f];
        for (n = 0; n < repeat; n++) newKey = operation([...newKey]);
      };
    
      return newKey;
    },
    keyToString(key) {
      return key.join(",")
    },
  };
}
