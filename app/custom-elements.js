const customElementRegistry = window.customElements;

const populationPageTemplate = document.getElementById("population-page-template")
  .content;
customElementRegistry.define(
  "population-page",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["name", "description", /* "cipher-name", */ "population-size", "children-per-parent", "random-per-generation", "allow-duplicates"];
    }

    constructor() {
      super();

      const shadow = this.attachShadow({ mode: "closed" }),
        populationPageElements = populationPageTemplate.cloneNode(true),
        thisPopulationPage = this,
        keyInput = populationPageElements.getElementById("key-input");

      this._openTab = 0;
      this.tabs = this.getElementById("sub-pages").children;
      this.descriptionEntry = this.getElementById("description-entry");
      /*
      this.populationSizeDisplay = this.getElementById("population-size");
      this.childrenPerParent = this.getElementById("children-per-parent");
      this.randomPerGeneration = this.getElementById("random-per-generation");
      this.allowDupliates = this.getElementById("allow-duplicates");
      */

      keyInput.addEventListener("change", function () {
        const cancelled = !thisPopulationPage.dispatchEvent(new CustomEvent("displayedkeychange", { detail: () => this.value }));

        if (cancelled) {
          this.setAttribute("invalid", "");
        } else {
          this.removeAttribute("invalid");
        }
      })

      shadow.appendChild(populationPageElements);
    }

    get openTab() { return this._openTab }
    set openTab(newN) {
      const oldN = this._openTab,
        tabs = this.tabs;
      if (newN != oldN) {
        tabs[oldN].classList.remove("open");
        tabs[newN].classList.add("open");
      }
    }

    /*
    get populationSize() { return this._populationSize }
    set populationSize(newVal) {
      this._populationSize = newVal;
      this.setAttribute("population-size", newVal);
    }

    get childrenPerParent() { return this._childrenPerParent }
    set childrenPerParent(newVal) {
      this._childrenPerParent = newVal;
      this.setAttribute("children-per-parent", newVal);
    }
    */

    // displayDecryption() { }

    attributeChangedCallback(name, _oldValue, newValue) {
      switch (name) {
        case "name":
          // todo
          break;
        case "description":
          this.descriptionEntry.value = newValue;
          break;
        /* case "population-size":
          this.populationSize.innerText = newValue;
          break;
        case "children-per-parent":
          this.childrenPerParent.innerText = newValue;
          break;
        case "random-per-generation":
          this.randomPerGeneration.innerText = newValue;
          break;
        case "allow-duplicates":
          this.allowDupliates.innerText = allowDupliates ? "YES" : "NO";
          break; */
      };
    }
  }
);

const populationButtonTemplate = document.getElementById("population-button-template").content;
customElementRegistry.define(
  "population-button",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["open"];
    }

    constructor() {
      super()

      const shadow = this.attachShadow({ mode: "closed" }),
        populationButtonElements = populationButtonTemplate.cloneNode(true),
        thisPopulationPage = this;

      shadow.appendChild(populationButtonElements);
    }
    
    get open() { return this._open }
    set open(newVal) {
      this._open = newVal; // trust newVal is boolean?
      if (newVal) this.setAttribute("open", "");
      else this.removeAttribute("open")
    }
  }
)

const modalTemplate = document.getElementById("modal-template").content;
customElementRegistry.define(
  "modal-popup",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["name"];
    }

    constructor() {
      super();

      const shadow = this.attachShadow({ mode: "open" }),
        modalElements = modalTemplate.cloneNode(true),
        thisModal = this;

      modalElements
        .querySelector("#close-button")
        .addEventListener("click", function () {
          thisModal.open = false;
        });

      shadow.appendChild(modalElements);
    }

    set open(val) {
      if (val) this.setAttribute("open", "");
      else this.removeAttribute("open");
    }

    get open() {
      return this.hasAttribute("open");
    }

    attributeChangedCallback(name, _oldValue, newValue) {
      switch (name) {
        case "name":
          this.shadowRoot.querySelector("header h4").innerText = newValue;
          break;
      }
    }
  }
);
