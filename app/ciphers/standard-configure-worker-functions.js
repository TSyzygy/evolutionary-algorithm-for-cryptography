async function NgramScore(n) {
  const scores = await getAsset(["ngrams"], n + ".json");
  return (plaintext) => {
    var score = 0,
      gram;
    for (let i = 0, max = plaintext.length - n; i < max; i++)
      if (scores.hasOwnProperty((gram = plaintext.substr(i, n))))
        score += scores[gram];
    return score / plaintext.length;
  };
}

export { NgramScore };
