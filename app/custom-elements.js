const customElementRegistry = window.customElements;

const populationPageTemplate = document.getElementById("population-page-template")
  .content;
customElementRegistry.define(
  "population-page",
  class extends HTMLElement {
    constructor() {
      super();

      const shadow = this.attachShadow({ mode: "closed" }),
        populationPageElements = populationPageTemplate.cloneNode(true),
        thisPopulationPage = this,
        keyInput = populationPageElements.getElementById("key-input");
      
      this._openSubPage = 0;
      this.subPages = this.getElementById("sub-pages").children;

      keyInput.addEventListener("change", function () {
        const cancelled = !thisPopulationPage.dispatchEvent(new CustomEvent("displayedkeychange", { detail: () => this.value }));

        if (cancelled) {
          this.setAttribute("invalid", "");
        } else {
          this.removeAttribute("invalid");
        }
      })

      shadow.appendChild(populationPageTemplate.cloneNode(true));
    }

    get openSubPage() {
      return this._openSubPage;
    }

    set openSubPage(newN) {
      const oldN = this._openSubPage,
        subPages = this.subPages;
      if (newN != oldN) {
        subPages[oldN].classList.remove("open");
        subPages[newN].classList.add("open");
      }
    }
  }
);

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

/* customElementRegistry.define(
  "cipher-input-select",
  class extends HTMLElement {
    constructor(options) {
      const shadow = this.attachShadow({ mode: "open" }),
        selectElement = document.createElement("select");

      for (let option in options) {
        let optionElement = document.createElement("option");
        optionElement.innerText = option;
        optionElement.setAttribute("value", options[option]);
        selectElement.append(optionElement);
      };

      shadow.appendChild(selectElement);
    }
    checkValidity() {
      return this.shadow.querySelector("select").checkValidity();
    }
  }
); */

/* customElementRegistry.define(
  "cipher-option-group",
  class extends HTMLElement {
    constructor() {

    }
  }
) */

/*
customElementRegistry.define(
  "cipher-option",
  class extends HTMLElement {
    static get observedAttributes() {
      return []; // todo
    }
    constructor (inputDetails, cipherName, optionName, label, info) {
      super();

      var shadow = this.attachShadow({ mode: "open" }),
        labelElement = document.createElement("label"),
        inputElement;
      
      labelElement.setAttribute("for", cipherName + "-" + optionName);
      labelElement.innerText = label;

      switch (inputDetails.type) {
        case "select":
          inputElement = document.createElement("select");
          let options = inputDetails.options;
          for (let option in options) {
            let optionElement = document.createElement("option");
            optionElement.innerText = option;
            optionElement.setAttribute("value", options[option]);
            inputElement.append(optionElement);
          };
          break;
        case "number":
          inputElement = document.createElement("input");
          inputElement.setAttribute("type", "number");
          for (let attribute of ["min", "max", "placeholder", "value"])
            if (inputDetails.hasOwnProperty(attribute))
              inputElement.setAttribute(attribute, inputDetails[attribute]);
          break;
      };
      this._inputElement = inputElement;

      shadow.appendChild(labelElement);
      shadow.appendChild(inputElement);
    }
    get value () {
      return this._inputElement.value;
    }
    checkValidity() {
      return this._inputElement.checkValidity();
    }
  }
)
*/
