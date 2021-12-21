"use strict";

const sameRowOrColParams = {
  options: [
    {
      value: "",
      name: "Select...",
    },
    {
      value: "u",
      name: "Letter above",
    },
    {
      value: "d",
      name: "Letter below",
    },
    {
      value: "l",
      name: "Letter to left",
    },
    {
      value: "r",
      name: "Letter to right",
    },
  ],
};

const setup = {
  displayName: "Playfair",
  options: [
    {
      name: "g",
      type: "number",
      label: "Grid size",
      description:
        "The height and width of the grid used.",
      params: {
        min: 5,
        max: 6,
        default: 5,
      },
    },
    {
      name: "alphabet",
      type: "string",
      label: "Alphabet",
      description:
        "The alphabet used to fill the polybius grid. Must be of lenth g^2.",
      params: {
        minlength: 25,
        maxlength: 36,
      }
    },
    {
      name: "sameRow",
      label: "When letters in same row:",
      description:
        "What to do when the letters are in the same row.",
      type: "select",
      params: sameRowOrColParams,
    },
    {
      name: "sameCol",
      label: "When letters in same column:",
      description:
        "What to do when the letters are in the same column.",
      type: "select",
      params: sameRowOrColParams,
    },
    {
      name: "square",
      label: "When letters form a square:",
      description:
        "What to do when the letters form a square.",
      type: "select",
      params: {
        options: [
          {
            value: "",
            name: "Select...",
          },
          {
            value: "x",
            name: "Keep same x coords, swap y coords."
          },
          {
            value: "y",
            name: "Keep same y coords, swap x coords."
          },
        ]
      }
    }
  ],
};

function cipherFunctions({
  g, // grid size
  alphabet, // alphabet
  sameRow, // what to do when letters in same row: u, d, l or r
  sameCol, //  ''                          '' col       ''
  square, // what to do when letters form corners of square: x or y (same x coord; same y coord)
  /* n */ // currently must be 2
}) {

  const lenAlphabet = alphabet.length;
  if (g ** 2 != lenAlphabet) throw Error("Incorrect alphabet length or grid size.")
  const alphabetChar = []; // Array of the alphabet
  const alphabetIndex = {}; // Object of index -> char
  for (let i = 0, c = 0, r = 0; i < lenAlphabet; i++, c++) {
    if (c == g) {
      r += 1;
      c = 0
    }
    alphabetChar.push(alphabet[i]);
    alphabetIndex[alphabet[i]] = i;
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
      squareFunc = ([ax, ay], [bx, by]) => [[ax, by], [bx, ay]];
      break;
    case "y":
      squareFunc = ([ax, ay], [bx, by]) => [[bx, ay], [ax, by]];
      break;
    default:
      throw Error("Invalid square setting.");
  };

  return {
    MessageDecrypter(message) {
      const converted = [];
      let l = message.length;
      if (l % 2) { message += alphabet[0] };
      for (let p = 0, a, b, i, j, char2; p < l; p++) {
        a = message[p];
        b = message[++p];
        i = alphabetIndex[a];
        j = alphabetIndex[b];
        converted.push([i, j]);
      };

      return (key) => {
        var decrypt = "";
        let aCoord, ax, ay, bCoord, bx, by, c, cx, cy, d, dx, dy;
        for (let [a, b] of converted) {
          [ax, ay] = aCoord = key[a];
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
          decrypt += alphabet[c] + alphabet[d];
        }
        return decrypt;
      }
    },
    keyToString: (key) => key.join(";"),
    keyToText: (key) => {
      // TODO: improve
      var text = [];
      for (let i = 0; i < lenAlphabet; i++) {
        text.push(null);
      };

      let char, x, y;
      for (let i = 0; i < lenAlphabet; i++) {
        char = alphabetChar[i];
        [x, y] = key[i];
        text[y*g + x] = char;
      };
      return text.join("");
    },
    textToKey: (text) => {
      var key = [];
      for (let i = 0; i < lenAlphabet; i++) {
        key.push(null);
      };

      let x = 0;
      let y = 0;
      let i;
      for (let char of text) {
        i = alphabetIndex[char];
        key[i] = [x++, y]
        if (x == g) {
          x = 0;
          y++;
        }
      };
      return key;
    },
  }
}

export { setup, cipherFunctions };
