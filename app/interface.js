"use strict";

const // sidebar
  openSidebarButton = document.getElementById("open-sidebar"),
  sidebar = document.getElementById("sidebar"),
  closeSidebarButton = sidebar.querySelector("#close-sidebar"),
  // populations
  // populationPageTemplate = document.getElementById("population-page-template"),
  populationPageElements = document.getElementById("population-pages"),
  populationButtonElements = sidebar.querySelector("#population-buttons"),
  populationButtonCollection = populationButtonElements.children,
  // modal
  openAddPopulationModalButton = document.getElementById(
    "open-add-population-modal"
  ),
  // addPopulationModal = document.getElementById("add-population-modal"),
  addPopulationForm = addPopulationModal.querySelector("form"),
  messageEntryContainer = addPopulationForm.querySelector("#messages"),
  addMessageButton = addPopulationForm.querySelector("#add-message"),
  messageEntryTemplate = addPopulationForm.querySelector(
    "#message-input-template"
  ),
  maxMessagesAllowed = 12,
  // cipherName = addPopulationForm.querySelector("#cipher-name"),
  cipherSpecificPages = addPopulationForm.querySelector(
    "#cipher-specific-options"
  ),
  cipherSpecificPagesCollection = cipherSpecificPages.children;

var numMessageInputs = 1,
  currentCipherPage = null;

// sidebar

function openSidebar() {
  sidebar.classList.add("open");
}
openSidebarButton.addEventListener("click", openSidebar);

function closeSidebar() {
  sidebar.classList.remove("open");
}
closeSidebarButton.addEventListener("click", closeSidebar);

// add-population-modal

function openAddPopulationModal() {
  addPopulationModal.open = true;
}
openAddPopulationModalButton.addEventListener("click", openAddPopulationModal);

// Todo: redo this
/* addPopulationForm.addEventListener("reset", function () {
  changeCurrentCipherPage("");
}); */

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
    if (--numMessageInputs < maxMessagesAllowed) addMessageButton.removeAttribute("disabled");
  });

  messageEntryContainer.appendChild(messageEntry);
  if (numMessageInputs >= maxMessagesAllowed) {
    this.setAttribute("disabled", "true");
  }
});

// Sets up the length counter for the first message input (which is always present)
messageEntryContainer.querySelector("input").addEventListener(
  "input",
  (function () {
    // IIFE
    const lengthDisplay = messageEntryContainer.querySelector("span");
    return function () {
      lengthDisplay.innerText = String(this.value.length).padStart(4, "0");
    };
  })()
);

addPopulationForm.addEventListener("submit", function () {
  const elements = this.elements,
    populationInfo = {
      name: elements.name.value,
      description: elements.description.value,
      config: {
        messages: Array.prototype.map.call(
          this.querySelectorAll("#messages input"),
          (e) => e.value
        ),
        cipher: {
          name: currentCipherOptionGroup.cipherName,
          // Collects all the cipher-specific option inputs
          options: currentCipherOptionGroup.collectInputs(),
        },
        evolution: {
          populationSize: elements["population-size"].value,
          childrenPerParent: elements["children-per-parent"].value,
          randomPerGeneration: elements["random-per-generation"].value,
          allowDuplicates: elements["duplicates-allowed"].checked,
        },
      },
      history: [],
      knownScores: {},
    };

  setupPopulation(populationInfo);

  addPopulationModal.open = false;
  this.reset();
});
