"use strict";

var // sidebar
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
openAddPopulationModalButton = document.getElementById("open-add-population-modal"),
    addPopulationModal = document.getElementById("add-population-modal"),
    addPopulationForm = addPopulationModal.querySelector("form"),
    addPopulationMain = addPopulationForm.querySelector("div"),
    closeAddPopulationModalButton = addPopulationForm.querySelector("#close-add-population-modal"),
    addPopulationMenu = addPopulationMain.querySelector("#add-population-menu"),
    newPopulationMenu = addPopulationMain.querySelector("#new-population-menu"),
    openNewPopulationMenuButton = addPopulationMenu.querySelector("#open-new-population-menu"),
    populationModalBackButton = addPopulationForm.querySelector("footer button"),
    messageEntryContainer = newPopulationMenu.querySelector("#messages"),
    addMessageButton = newPopulationMenu.querySelector("#add-message"),
    messageEntryTemplate = newPopulationMenu.querySelector("#message-input-template"),
    maxMessagesAllowed = 12,
    cipherName = newPopulationMenu.querySelector("#cipher-name"),
    cipherSpecificPages = newPopulationMenu.querySelector("#cipher-specific-options").children;
var currentPopulationNum = -1,
    numMessageInputs = 1; // populations

function closeCurrentPopulation() {
  if (currentPopulationNum > -1) {
    populationPagesCollection[currentPopulationNum].classList.remove("open");
    populationButtonsCollection[currentPopulationNum].classList.remove("open");
    currentPopulationNum = -1;
  }
}

function openPopulation(populationNum) {
  // Closes old population
  closeCurrentPopulation();
  currentPopulationNum = populationNum;
  populationPagesCollection[currentPopulationNum].classList.add("open");
  populationButtonsCollection[currentPopulationNum].classList.add("open");
}

function addPopulationPage(populationName, populationInfo
/* temporary */
) {
  var page = populationPageTemplate.content.cloneNode(true);
  page.querySelector("h2").innerText = populationName;
  page.querySelector("p").innerText = populationInfo;
  populationPages.appendChild(page);
} // sidebar


function openSidebar() {
  sidebar.classList.add("open");
}

openSidebarButton.addEventListener("click", openSidebar);

function closeSidebar() {
  sidebar.classList.remove("open");
}

closeSidebarButton.addEventListener("click", closeSidebar);

function addSidebarButton(populationNum, populationName) {
  var button = document.createElement("button");
  button.setAttribute("type", "button");
  button.innerText = populationName;
  button.addEventListener("click", function () {
    openPopulation(populationNum);
    closeSidebar();
  });
  populationButtons.appendChild(button);
} // add-population-modal


function openAddPopulationModal() {
  addPopulationMenu.classList.add("open");
  addPopulationModal.classList.add("open");
}

openAddPopulationModalButton.addEventListener("click", openAddPopulationModal);

function closeAddPopulationModal() {
  addPopulationModal.classList.remove("open"); // Returns it to the main add population menu

  returnToAddPopulationMenu();
}

closeAddPopulationModalButton.addEventListener("click", closeAddPopulationModal);

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
cipherName.addEventListener("change", function () {
  var chosenCipher = this.value;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = cipherSpecificPages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var cipherPage = _step.value;

      if (cipherPage.dataset.cipherName == chosenCipher) {
        cipherPage.classList.add("chosen");
      } else {
        cipherPage.classList.remove("chosen");
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  addPopulationMain.scrollTop = addPopulationMain.scrollHeight;
});
addMessageButton.addEventListener("click", function () {
  var messageNum = ++numMessageInputs,
      messageEntry = messageEntryTemplate.content.firstElementChild.cloneNode(true),
      messageInput = messageEntry.querySelector("input"),
      lengthDisplay = messageEntry.querySelector("span");
  messageEntry.dataset.messageNum = messageNum;
  /* messageInput.setAttribute("placeholder", "Ciphertext " + messageNum);
  messageInput.setAttribute("name", "message-" + messageNum); */

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
}); // Sets up the length counter for the first message input (which is always present)

messageEntryContainer.querySelector("input").addEventListener("input", function () {
  // IIFE
  var lengthDisplay = messageEntryContainer.querySelector("span");
  return function () {
    lengthDisplay.innerText = String(this.value.length).padStart(4, "0");
  };
}()); // TEMPORARY

addSidebarButton(0, "Population ONE!!!! innit");
addPopulationPage("Pop 1", "Please work");
addSidebarButton(1, "Pop 2");
addPopulationPage("Pop 2", "Please please just work");
addSidebarButton(2, "Pop 3");
addPopulationPage("Pop 3", "It ain't gonna work");