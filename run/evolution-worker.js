'use strict'

// Population class
class Population {

  constructor (fitness, randomCandidate, permuteCandidate, maxPopulationSize = 20, childrenPerParent = 2, randomPerGeneration = 5, allowDuplicates = false) {
    this.fitness = fitness;
    this.randomCandidate = randomCandidate;
    this.permuteCandidate = permuteCandidate;
    this.maxPopulationSize = maxPopulationSize;
    this.childrenPerParent = childrenPerParent;
    this.randomPerGeneration = randomPerGeneration;
    this.allowDuplicates = allowDuplicates;

    this._candidates = [];
    this.genNum = 0;
    this.knownScores = {};
  }

  // If an array is passed as an argument, sets that as the population; if a number is passed, generates that many random keys.
  set candidates (c) {
    if (typeof(c) == 'object') {
      for (let candidate of c) {
        this.potentialCandidate(candidate, true);
      }
    } else if (typeof(c) == 'number') {
      this._candidates = [];
      this.genNum = 0;
      for (let n = 0; n < c; n++) {
        this.addRandomCandidate();
      }
    } else {
      throw Error('When setting candidates, provide an array of candidates or a number of candidates to be generated');
    }
  }

  // Returns _candidates property when candidates property is called for
  get candidates () {
    return this._candidates;
  }

  // Inserts a candidate at the correct position and removes the worst candidate if population size exceeds maximum
  addCandidate (candidate) {
    var candidates, score, numCandidates, i;

    candidates = this._candidates;
    numCandidates = candidates.length;
    score = this.knownScores[candidate] = this.fitness(candidate);

    // Finds position in ordered list of candidates
    i = 0;
    while (i < numCandidates && score > this.knownScores[candidates[i]]) { i++ };

    candidates.splice(i, 0, candidate);
    if (candidates.length > this.maxPopulationSize) {
      candidates.shift();
    };
    return candidates;
  }

  // Evaluates a potential candidate. Returns updated array of candidates if candidate was added, returns false if candidate was ignored (either because candidate was a current candidate already and duplicates were not allowed, or because it had previously been a candidate and so must be worse)
  potentialCandidate (candidate) {
    var candidates, i;
    candidates = this._candidates;

    // If the key is a current candidate and duplicates are allowed, adds to same location in array
    if (candidate in candidates) {
      console.log(candidate);
      if (this.allowDuplicates) {
        candidates.splice(candidates.indexOf(candidate), 0, candidate);
        if (candidates.length > this.maxPopulationSize) {
          candidates.shift();
        }
      }
    // Adds the candidate if it has not been evaluated before
    } else if (this.knownScores[candidate] == undefined) {
      return this.addCandidate(candidate, i);
    // If the candidate is not currently a candidate but had been in the past, it must be worse than all current candidates so is ignored.
    } else {
      return false;
    }
  }

  // Adds a random candidate. Returns the candidate if it was fit enough to be added to the candidates array.
  addRandomCandidate () {
    var candidate = this.randomCandidate();
    if (this.potentialCandidate(candidate)) {
      return candidate;
    } else {
      return false;
    }
  }

  // The population evolves by one generation
  nextGeneration () {
    var childrenPerParent, parent, n, random;

    childrenPerParent = this.childrenPerParent;

    for (parent of [...this._candidates]) {
      for (n = 0; n < childrenPerParent; n++) {
        this.potentialCandidate(this.permuteCandidate(parent));
      }
    }

    var random = this.randomPerGeneration;
    for (n = 0; n < random; n++) {
      this.addRandomCandidate();
    }

    this.genNum += 1;

    return this._candidates;
  }

}

var populations = {};

// Recieves messages from control
onmessage = function (message) {
  var type = message.type;

  // New populations to be created
  if (type == 'newPopulations') {
    var populationsData = message.populationsData;
    for (let name in populationsData) {
      populations[name] = populationsData[name];
    }
  }
  
  else if (type == 'newGeneration') {
    var name = message.populationName;
    if (populations.hasOwnProperty(name)) {
      populations[name] // TODO
    }
  }

}


