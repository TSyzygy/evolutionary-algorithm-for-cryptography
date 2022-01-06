function rand(max) {
  return Math.floor(Math.random() * max);
}

async function NgramScore(n) {
  return import("../assets.js")
    .then(
      (Assets) => Assets.getAsset(["ngrams", "by-letter"], n + ".json")
    )
    .then(
      (scores) => 
        (plaintext) => {
          var score = 0,
            gram;
          for (let i = 0, max = plaintext.length - n; i < max; i++)
            if (scores.hasOwnProperty((gram = plaintext.substr(i, n))))
              score += scores[gram];
          return score / plaintext.length;
        }
    );
}

function Shuffle(baseArray) {
  let l = baseArray.length;
  return () => {
    var j,
      x,
      i,
      a = [...baseArray];
    for (i = l; i > 0; ) {
      j = Math.floor(Math.random() * i);
      i--;
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  };
}

function PermuteOperationsManager(permuteOperations, permuteWeights) {
  return (key) => {
    /* for (let {operation, weight, max} of permuteOperations) {
      if (r < weight) {
        for (let i = rand(max) + 1; i > 0; i--) {
          newKey = operation(newKey);
        }
      }
    } */

    var newKey = key;
    for (let i = rand(10) + 1; i > 0; i--) {
      var p = Math.random();
      for (var j = 0; p > permuteWeights[j]; j++) {};
      var operation = permuteOperations[j];
      newKey = operation(newKey);
    };
    return newKey;
  };
}

export { NgramScore, Shuffle, PermuteOperationsManager };
