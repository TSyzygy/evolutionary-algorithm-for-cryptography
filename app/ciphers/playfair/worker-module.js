"use strict";

import { getAsset } from "../../assets.js";

export async function configure(messages, {
  g, // grid size
  alphabet, // alphabet
  sameRow, // what to do when letters in same row: u, d, l or r
  sameCol, //  ''                          '' col       ''
  square, // what to do when letters form corners of square: x or y (same x coord; same y coord)
  /* n */ // currently must be 2 - remember to update in module.js too
}) {
  return import("../standard-worker-module-functions.js").then(async function ({ Shuffle, PermuteOperationsManager }) {
    // Declare constants, e.g:
    const scores = await getAsset(["ngrams", "by-index"], "2.json"); // The getAsset function is available to request any asset stored in the assets folder
    const lenAlphabet = alphabet.length;
    if (g ** 2 != lenAlphabet) throw Error("Incorrect alphabet length or grid size.")
    // if (n != 2) throw Error("Only bigrams analysis currently supported.")
    const alphabetChar = []; // Array of the alphabet
    const alphabetIndex = {}; // Object of char -> index
    const baseKey = [];
    for (let i = 0, c = 0, r = 0; i < lenAlphabet; i++, c++) {
      if (c == g) {
        r += 1;
        c = 0
      }
      alphabetChar.push(alphabet[i]);
      alphabetIndex[alphabet[i]] = i;
      baseKey.push([c, r]);
    };

    // Declare functions, e.g:
    function rand(max) {
      return Math.floor(Math.random() * max);
    }

    const permuteOperations = [
      function swapItems(key) {
        let newKey = [...key];
        let i = rand(lenAlphabet);
        let j = rand(lenAlphabet);
        let a = newKey[i];
        newKey[i] = newKey[j];
        newKey[j] = a;
        return newKey;
        // For debugging - returns correct key:
        // return [[2,0],[0,3],[1,3],[2,3],[1,0],[5,0],[3,3],[0,1],[4,3],[5,3],[3,0],[0,4],[1,4],[2,1],[4,0],[0,0],[3,1],[4,1],[5,1],[0,2],[1,2],[1,1],[2,2],[3,2],[4,2],[5,2],[2,4],[3,4],[4,4],[5,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]]
      },
      function swapLines(key) {
        let l = rand(2); // 0 = swap rows, 1 = swap cols

        // Generates two random distinct column/row numbers to swap
        let i = rand(g);
        let j = rand(g-1);
        if (j >= i) j++;

        return l
          // Swap cols
          ? key.map(([x, y]) =>
                (x==i)
                ? [j, y]
                : (x==j)
                  ? [i, y]
                  : [x, y])
          // Swap rows
          : key.map(([x, y]) =>
                (y==i)
                ? [x, j]
                : (y==j)
                  ? [x, i]
                  : [x, y])
      },
      function flip(key) {
        let l = rand(2); // Determines which diagonal to flip along
        return l
          ? key.map(([x, y]) => [y, x])
          : key.map(([x, y]) => [g-1-y, g-1-x])
      },
    ];

    const permuteWeights = [0.9, 0.99, 1]


    // Return an object with fitness, randomCandidate, permuteCandidate, and keyToString methods
    return {
      // Here is a possible structure for the fitness function, using an IIFE
      fitness: (function () {
        // Checked: bigram counting works with g=5
        const bigrams = {};
        let l;
        for (let message of messages) {
          l = message.length;
          if (l % 2) { throw Error("Messages must have an even number of characters.") }
          for (let p = 0, a, b, i, j, char2; p < l; p++) {
            a = message[p];
            b = message[++p];
            if (a == b) throw Error("Cannot have bigram with both characters the same.");
            if (!alphabetIndex.hasOwnProperty(a) || !alphabetIndex.hasOwnProperty(b)) throw Error("Non-alphabet characters present.");
            i = alphabetIndex[a];
            j = alphabetIndex[b];
            char2 = bigrams.hasOwnProperty(i) ? bigrams[i] : (bigrams[i] = {});
            if (char2.hasOwnProperty(j)) {
              char2[j]++
            } else {
              char2[j] = 1;
            }
          }
        };
        
        // Determines sameCol, sameRow and square functions. Same code as in configure-worker.js

        function sameRowOrColFuncGetter (type) {
          switch (type) {
            case "u":
              return ([ax, ay], [bx, by]) => [[ax, (ay+g-1)%g], [bx, (by+g-1)%g]];
            case "d":
              return ([ax, ay], [bx, by]) => [[ax, (ay+1)%g], [bx, (by+1)%g]]
            case "l":
              return ([ax, ay], [bx, by]) => [[(ax+g-1)%g, ay], [(bx+g-1)%g, by]]
            case "r":
              return ([ax, ay], [bx, by]) => [[(ax+1)%g, ay], [(bx+1)%g, by]]
            default:
              throw Error();
          }
        }

        try { var sameColFunc = sameRowOrColFuncGetter(sameCol) }
        catch (error) { throw Error("Invalid sameCol setting.") };

        try { var sameRowFunc = sameRowOrColFuncGetter(sameRow) }
        catch (error) { throw Error("Invalid sameCol setting.") };

        var squareFunc;
        switch (square) {
          case "x":
            squareFunc = ([ax, ay], [bx, by]) => [[ax, by], [bx, ay]]
            break;
          case "y":
            squareFunc = ([ax, ay], [bx, by]) => [[bx, ay], [ax, by]];
            break;
          default:
            throw Error("Invalid square setting.");
        }

        function scoreBigram(a, b) {
          // What about z? (g=5 means only 25 chars). And when g=6?
          if (scores.hasOwnProperty(a)) {
            var char2 = scores[a];
            if (char2.hasOwnProperty(b)) {
              return char2[b];
            } else return 0
          } else return 0;
        }

        return function (key) {
          let freq, char2, aCoord, ax, ay, bCoord, bx, by, c, cx, cy, d, dx, dy;
          var score = 0;
          for (let a in bigrams) {
            char2 = bigrams[a];
            [ax, ay] = aCoord = key[a];
            for (let b in char2) {
              freq = char2[b];
              [bx, by] = bCoord = key[b];
              [[cx, cy], [dx, dy]] = (ax == bx)
                // Same col
                ? sameColFunc(aCoord, bCoord)
                : (ay == by)
                  // Same row
                  ? sameRowFunc(aCoord, bCoord)
                  // Different col+row (square)
                  : squareFunc(aCoord, bCoord)
              // Todo: improve efficiency?
              c = key.findIndex(([x, y]) => x == cx && y == cy);
              d = key.findIndex(([x, y]) => x == dx && y == dy);
              score += (scoreBigram(c, d) * freq);
            }
          }
          return score;
        }
      })(),
      randomCandidate: Shuffle(baseKey),
      permuteCandidate: PermuteOperationsManager(permuteOperations, permuteWeights), // PermuteOperationsManager(permuteOperations),
      keyToString(key) {
        // Todo: improve? Remember also change keyToString in module.js
        return key.join(";")
      },
    };
  })
}
