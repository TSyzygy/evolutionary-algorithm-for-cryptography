"use strict";

import { getAsset } from "../../assets.js"; // THE .js IS ABSOLUTELY NECESSARY HERE. EVERYTHING WILL BREAK WITHOUT IT AND YOU WILL SPEND 3 HOURS TRYING TO WORK OUT WHAT'S GONE WRONG BECAUSE YOU CAN'T LOG THE ERRORS TO THE CONSOLE BECAUSE IT'S INSIDE A MODULE WRAPPED INSIDE A WORKER. SO LEAVE IT BE. Same thing goes for all the other '.js's by the way. Yw.  

async function configure(messages, { keylength, n }) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ",
    scores = (n == 1)
      ? await getAsset(["ngrams", "by-index"], "1.json")
      : await getAsset(["ngrams", "by-letter"], n + ".json");
  // Gets a random number up to and including max-1
  function rand(max) {
    return Math.floor(Math.random() * max);
  };

  return {
    fitness: (function () {
      function convertMessage (message) {
        return message
          .toUpperCase()
          .split("")
          .flatMap((c) => {
            var i = alphabet.indexOf(c);
            return i > -1 ? [i] : [];
          });
      };

      const scoreMessage =
        n > 1
          ? function (message, key) {
              // Ngram score
              const decrypted = message.reduce(
                  (t, c, p) => t + alphabet[c + key[p % keylength]]
                ),
                max = message.length - n;
              var score = 0,
                gram;
              for (let i = 0; i < max; i++)
                if (scores.hasOwnProperty((gram = decrypted.substr(i, n))))
                  score += scores[gram];
              return score / message.length;
            }
          : function (message, key) {
              // Letter score
              return (
                (message.reduce(
                  (t, c, p) => t + scores[c + key[p % keylength]]
                ) /
                  message.length)
              );
            };

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
      var key = [];
      for (let i = 0; i < keylength; i++) key.push(rand(26));
      return key;
    },
    permuteCandidate(key) {
      const permutedKey = [...key];
      permutedKey[rand(keylength)] = rand(26);
      return permutedKey;
    },
    keyToString(key) {
      return key.join(",");
    },
  };
};

export { configure }