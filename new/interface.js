"use strict";

const // sidebar
  openSidebarButton = document.getElementById("open-sidebar"),
  sidebar = document.getElementById("sidebar"),
  closeSidebarButton = sidebar.querySelector("#close-sidebar"),
  // populations
  populationPageTemplate = document.getElementById("population-page-template"),
  populationPages = document.getElementById("population-pages"),
  populationPagesCollection = populationPages.children,
  populationButtons = sidebar.querySelector("#population-buttons"),
  populationButtonsCollection = populationButtons.children,
  // modal
  openAddPopulationModalButton = document.getElementById(
    "open-add-population-modal"
  ),
  addPopulationModal = document.getElementById("add-population-modal"),
  addPopulationForm = addPopulationModal.querySelector("form"),
  addPopulationMain = addPopulationForm.querySelector("div"),
  closeAddPopulationModalButton = addPopulationForm.querySelector(
    "#close-add-population-modal"
  ),
  addPopulationMenu = addPopulationMain.querySelector("#add-population-menu"),
  newPopulationMenu = addPopulationMain.querySelector("#new-population-menu"),
  openNewPopulationMenuButton = addPopulationMenu.querySelector(
    "#open-new-population-menu"
  ),
  populationModalBackButton = addPopulationForm.querySelector("footer button"),
  messageEntryContainer = newPopulationMenu.querySelector("#messages"),
  addMessageButton = newPopulationMenu.querySelector("#add-message"),
  messageEntryTemplate = newPopulationMenu.querySelector(
    "#message-input-template"
  ),
  maxMessagesAllowed = 12,
  cipherName = newPopulationMenu.querySelector("#cipher-name"),
  cipherSpecificPages = newPopulationMenu.querySelector(
    "#cipher-specific-options"
  ),
  cipherSpecificPagesCollection = cipherSpecificPages.children;
// addPopulationSubmitButton = newPopulationMenu.querySelector("#add-population-submit");

var
  // currentPopulationNum = -1,
  numMessageInputs = 1,
  currentCipherPage = null;

// populations

/*
function closeCurrentPopulation() {
  if (currentPopulationNum > -1) {
    populationPagesCollection[currentPopulationNum].classList.remove("open");
    populationButtonsCollection[currentPopulationNum].classList.remove("open");
    currentPopulationNum = -1;
  }
}

function openPopulationPage(populationNum) {
  // Closes old population
  closeCurrentPopulation();

  currentPopulationNum = populationNum;
  populationPagesCollection[currentPopulationNum].classList.add("open");
  populationButtonsCollection[currentPopulationNum].classList.add("open");
}

function addPopulationPage(population) {
  // TODO: when populations deleted, if none are left then display this message
  document.getElementById("no-populations-message").style.display = "none";

  const page = populationPageTemplate.content.cloneNode(true),
    [
      runButton,
      stopButton,
      stepButton
    ] = page.querySelector(".controls").children;

  // Add name and description
  page.querySelector(".name").innerText = population.name;
  page.querySelector(".description").innerText = population.description;

  // Setup control button event listeners
  runButton.addEventListener("click", function () {
    population.run();
  });

  populationPages.appendChild(page);
}

function updatePopulationPage(n) {
  const
    population = populations[n],
    {
      name,
      config,
      knownScores,
      history,
      current: {
        genNum,
        state
      }
    } = population,
    currentPopulation = history[genNum - 1].candidates,
    bestKey = currentPopulation[0],
    page = populationPagesCollection[n],
    bestCandidateDisplay = page.querySelector(".best-candidate");

  bestCandidateDisplay.querySelector(".best-key").innerHTML = bestKey;
  bestCandidateDisplay.querySelector(".best-score").innerHTML = knownScores[bestKey];
  bestCandidateDisplay.querySelector(".best-decryption").innerHTML = "Decryption not yet implemented for this cipher :|";
}
*/

// sidebar

function openSidebar() {
  sidebar.classList.add("open");
}
openSidebarButton.addEventListener("click", openSidebar);

function closeSidebar() {
  sidebar.classList.remove("open");
}
closeSidebarButton.addEventListener("click", closeSidebar);

/*
function addSidebarButton(populationName) {
  const
    button = document.createElement("button"),
    populationNum = numPopulations;
  button.setAttribute("type", "button");
  button.innerText = populationName;
  button.addEventListener("click", function () {
    openPopulationPage(populationNum);
    closeSidebar();
  });
  populationButtons.appendChild(button);
}
*/

// add-population-modal

function openAddPopulationModal() {
  addPopulationMenu.classList.add("open");
  addPopulationModal.classList.add("open");
}
openAddPopulationModalButton.addEventListener("click", openAddPopulationModal);

function closeAddPopulationModal() {
  addPopulationModal.classList.remove("open");
  // Returns it to the main add population menu
  returnToAddPopulationMenu();
}
closeAddPopulationModalButton.addEventListener(
  "click",
  closeAddPopulationModal
);

function returnToAddPopulationMenu() {
  newPopulationMenu.classList.remove("open");
  addPopulationMenu.classList.add("open");
  populationModalBackButton.setAttribute("disabled", "true");
}
populationModalBackButton.addEventListener("click", returnToAddPopulationMenu);

function openNewPopulationMenu() {
  addPopulationMenu.classList.remove("open");
  newPopulationMenu.classList.add("open");
  populationModalBackButton.removeAttribute("disabled");
}
openNewPopulationMenuButton.addEventListener("click", openNewPopulationMenu);

function changeCurrentCipherPage(chosenCipherName) {
  if (currentCipherPage) {
    currentCipherPage.classList.remove("chosen");
    // Removes 'required' attribute from each of the old cipher-specific entry options
    Array.prototype.forEach.call(currentCipherPage.getElementsByClassName("required-for-cipher"), e => e.removeAttribute("required"));
  }

  currentCipherPage = cipherSpecificPages.querySelector("[data-cipher-name='" + chosenCipherName + "']");
  if (currentCipherPage) {
    currentCipherPage.classList.add("chosen");
    // Removes 'required' attribute to each of the new cipher-specific entry options
    Array.prototype.forEach.call(currentCipherPage.getElementsByClassName("required-for-cipher"), e => e.setAttribute("required", ""));
  }

  addPopulationMain.scrollTop = addPopulationMain.scrollHeight;
}

cipherName.addEventListener("change", function () {
  changeCurrentCipherPage(this.value);
});

addPopulationForm.addEventListener("reset", function () {
  changeCurrentCipherPage("");
})

addMessageButton.addEventListener("click", function () {
  const messageNum = ++numMessageInputs,
    messageEntry = messageEntryTemplate.content.firstElementChild.cloneNode(
      true
    ),
    messageInput = messageEntry.querySelector("input"),
    lengthDisplay = messageEntry.querySelector("span");

  messageEntry.dataset.messageNum = messageNum;

  messageInput.addEventListener("input", function () {
    lengthDisplay.innerText = String(this.value.length).padStart(4, "0");
  });

  messageEntry.querySelector("button").addEventListener("click", function () {
    this.parentNode.remove();
    if (--numMessageInputs < maxMessagesAllowed) {
      addMessageButton.removeAttribute("disabled");
    }
  });

  messageEntryContainer.appendChild(messageEntry);
  if (numMessageInputs >= maxMessagesAllowed) {
    this.setAttribute("disabled", "true");
  }
});

// Sets up the length counter for the first message input (which is always present)
messageEntryContainer.querySelector("input").addEventListener(
  "input",
  (function () { // IIFE
    const lengthDisplay = messageEntryContainer.querySelector("span");
    return function () {
      lengthDisplay.innerText = String(this.value.length).padStart(4, "0");
    };
  })()
);

addPopulationForm.addEventListener("submit", function () {
  const
    elements = this.elements,
    populationInfo = {
      name: elements.name.value,
      description: elements.description.value,
      config: {
        messages: Array.prototype.map.call(
          this.querySelectorAll("#messages input"),
          e => e.value
        ),
        cipher: {
          name: cipherName.value,
          // Collects all the cipher-specific option inputs
          options: Array.prototype.reduce.call(
            currentCipherPage.querySelectorAll("input, select"),
            (t, e) => {
              switch (e.type) {
                case "checkbox":
                  t[e.name] = e.checked;
                  break;
                case "number":
                  t[e.name] = e.value;
                  break;
                case "select-one":
                  t[e.name] = e.value;
                  break;
              }
              return t;
            },
            {}
          )
        },
        evolution: {
          populationSize: elements["population-size"].value,
          childrenPerParent: elements["children-per-parent"].value,
          randomPerGeneration: elements["random-per-generation"].value,
          duplicatesAllowed: elements["duplicates-allowed"].checked
        }
      },
      history: [],
      knownScores: {}
    };

  setupPopulation(populationInfo);

  closeAddPopulationModal();
  this.reset();
});




// TEMPORARY

setupPopulation({ "name": "Test 1", "description": "", "config": { "messages": ["Message"], "cipher": { "name": "vigenere", "options": { "keylength": "8", "n": "1" } }, "evolution": { "populationSize": "20", "childrenPerParent": "2", "randomPerGeneration": "5", "duplicatesAllowed": false } }, "history": [], "knownScores": {} })

/* TEMPORARY

addSidebarButton("Population ONE!!!! innit");
addPopulationPage("Population ONE!!!! innit", "Please work");

addSidebarButton("Pop 2");
addPopulationPage("Pop 2", "Please please just work");

addSidebarButton("Pop 3");
addPopulationPage("Pop 3", "It ain't gonna work");

*/
