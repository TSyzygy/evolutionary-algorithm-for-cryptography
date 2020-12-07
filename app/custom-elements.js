let customElementRegistry = window.customElements;

{
  let populationPageTemplate = document.getElementById(
    "population-page-template"
  ).content.firstElementChild;

  customElementRegistry.define(
    "population-page",
    class extends HTMLElement {
      constructor() {
        super();

        const shadow = this.attachShadow({ mode: "closed" });

        shadow.appendChild(populationPageTemplate.cloneNode(true));
      }
    }
  );
};

{
  let modalTemplate = document.getElementById("modal-template").content;

  customElementRegistry.define(
    "modal-popup",
    class extends HTMLElement {
      static get observedAttributes() {
        return [];
      }
      
      constructor() {
        super();

        const shadow = this.attachShadow({ mode: "closed" }),
          modalElements = modalTemplate.cloneNode(true),
          thisModal = this;

        this.elements = modalElements.querySelector("section");
        
        modalElements.querySelector("#close-button").addEventListener("click", function () {
          thisModal.open = false;
        })

        shadow.appendChild(modalElements);
      }

      set open(val) {
        if (val) this.setAttribute("open", "");
        else this.removeAttribute("open");
      }

      get open() {
        return this.hasAttribute("open");
      }

      attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
          
        }
      }
    }
  );
};
