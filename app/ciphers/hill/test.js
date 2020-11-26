const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";
const g = 3;

const convertMessage = (message) => {
  const numbers = message
    .toUpperCase()
    .split("")
    .flatMap((c) => {
      var i = alphabet.indexOf(c);
      return i > -1 ? [i] : [];
    }),
    result = [];
  // Pads message to multiple of g length
  while (numbers.length % g) {
    numbers.push(0);
  };
  var l = numbers.length;
  for (let i = 0; i < l; ) {
    result.push(numbers.slice(i, i += 3));
  };
  return result
};

console.log(convertMessage("HELLOWORLD"))

async function hill (messages, {g, n}) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ",
    alphabetLength = 26,
    scores = await getAsset("ngrams/" + n + ".json"),
    convertMessage = (message) => {
      const numbers = message
        .toUpperCase()
        .split("")
        .flatMap((c) => {
          var i = alphabet.indexOf(c);
          return i > -1 ? [i] : [];
        }),
        result = [];
      // Pads message to multiple of g length
      while (numbers.length % g) {
        numbers.push(0);
      };
      var l = numbers.length;
      for (let i = 0; i < l; i += 3) {
        result.push(numbers.substr(i, 3));
      };
      return result
    },
    scoreMessage =
      n > 1 // Ngram score
        ? function (message, key) {
            const keylength = key.length;
            var gram = message.slice(0, n),
              p = 0,
              score = 0;
            for (let char of message) {
              gram.shift();
              gram.push(alphabet[char + key[p]]);
              score += scores[gram.join("")] || 0;
              if (++p == keylength) {
                p = 0;
              }
            }
            return score / message.length;
          } // Letter score
        : function (message, key) {
            return (
              message.reduce(
                (t, c, p) => t + scores[c + key[p % keylength]]
              ) / message.length
            );
          };

  var fitness, randomCandidate, permuteCandidate;

  // If multiple messages provided
  if (messages.length > 1) {
    messages = messages.map(convertMessage);
    // Converts messages to numerical form
    fitness = (key) =>
      messages.reduce((t, message) => t + scoreMessage(message, key));
    // If only one message provided
  } else {
    var message = convertMessage(messages[0]);
    fitness = (key) => scoreMessage(message, key);
  }

  randomCandidate = function () {
    var key = [],
      row;
    for (let r = 0; r < g; r++) {
      row = [];
      for (let c = 0; c < g; c++) {
        row.push(Math.round(Math.random() * alphabetLength));
      }
    }
  }

  return {
    fitness,
    randomCandidate,
    permuteCandidate,
    candidateString
  }
}
