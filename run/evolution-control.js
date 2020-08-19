'use strict'

/* ----------------- *\
 Function declarations 
\* ----------------- */

// Closure - returns a function which adds a <li> node to the stored population list
var addStoredPopulationToList = function () {
  storedPopulationsList = document.querySelector('#storedPopulations table');
  return function (population) {
    var cell, row = document.createElement('tr');
    for (let item of ['name', 'cipher', 'genNum']) {
      cell = document.createElement('td');
      cell.innerHTML = population[item];
      row.appendChild(cell);
    }
  }
}();

/* ----------------- *\
 Variable declarations 
\* ----------------- */
var storageAvailable, storedPopulations, storedPopulationsList, evolutionWorker;

/* -------- *\
 On page load 
\* -------- */
document.addEventListener('DOMContentLoaded', function () {

  // Checks if local storage is available and retrieves any populations stored there
  storageAvailable = Boolean(localStorage);
  storedPopulations = storageAvailable ? JSON.stringify(localStorage.getItem('populations')) || {} : {};

  // Adds each of the stored populations to the stored populations list
  for (let population of storedPopulations) {
    addStoredPopulationToList(population);
  }

  // Add new population
  document.getElementById('addPopulation').addEventListener('click', function (event) {

  })





  var evolutionWorker = new Worker('evolution-worker.js')

  evolutionWorker.onmessage = function (message) {

  }

})
