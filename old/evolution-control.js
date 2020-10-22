"use strict";

// NB: functionality checks needed for workers, templates, 


var populations = [], openPopulationIdName = null, storageAvailable = Boolean(localStorage), storedPopulations = storageAvailable ? JSON.parse(localStorage.getItem("populations")) || [] : [];

// Takes a population, creates a worker for it, and adds it to the UI
function newPopulation (populationData) {
  var worker, sidebarButton, population = {};

  population.idName = populationData.idName;
  population.running = false;
  population.waiting = false;
  population.history = [];

  // Opens a new worker
  worker = population.worker = new Worker("population-worker.js");
  worker.onerror = e => { throw e };
  worker.onmessage = function ({data}) {
    population.history.push(data)
    updatePopulationDisplay(population.idName);
  };

  // Initialises the worker population
  worker.postMessage(populationData)

  sidebarButton = window.createElement("button");
  sidebarButton.addEventListener("click", function () {
    openPopulation(population.idName)
  });
  sidebarButton.innerHTML = populationData.displayName;

  populations.push(population)
}

function openPopulation (idName) {
  if (idName != openPopulationIdName) {

    document.querySelector("#sidebar button[data-id-name='" + openPopulationIdName + "']").classList.remove("open");
    document.querySelector("#sidebar button[data-id-name='" + idName + "']").classList.add("open");
    document.querySelector("#main section[data-id-name='" + openPopulationIdName + "']").classList.remove("open");
    document.querySelector("#main section[data-id-name='" + idName + "']").classList.add("open");

    openPopulationIdName = idName;

  }
}

/* -------- *\
 On page load 
\* -------- */

var addPopulationPage;

document.addEventListener("DOMContentLoaded", function () {

  {
    let populationPages = document.getElementById("population-pages");
    let populationPageTemplate = document.getElementById("population-page-template");

    addPopulationPage = function () {
      populationPageTemplate.content.cloneNode(true);
      
    }
  }

  // New population modal
  {
    let modal = document.getElementById("population-modal");

    function openNewPopulationModal () {
      modal.classList.add("open");
    }

    function closeNewPopulationModal () {
      modal.classList.remove("open");
    }

    document.getElementById("add-population").addEventListener("click", openNewPopulationModal);
    modal.querySelector(".close").addEventListener("click", closeNewPopulationModal);

    // TODO: warning when entered id matches existing population's id
    let [populationIdName, populationIdWarning] = modal.querySelectorAll("#population-id-name span")

    modal.querySelector("input#population-name").oninput = function () {
      populationIdName.innerHTML = this.value.toLowerCase().replaceAll(/\W/g, "-") || "name";
    }

  }


});


  //
  // Initial setup of populations lists
  //

  /* Adds each of the stored populations to the stored populations list
  if (storedPopulations) {
    console.log(storedPopulations);
    for (let population of storedPopulations) {
      addStoredPopulationToList(population);
    }
  } else {
    
  }

  // Add new population button
  document.getElementById("addPopulation").addEventListener("click", function (event) {

  })
  

  evolutionWorker = new Worker("evolution-worker.js");

  evolutionWorker.onmessage = function (message) {

  }

})
*/
