const populationPageTemplate = document.getElementById("population-page-template").content.firstElementChild;

class PopulationPage extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({mode: "closed"});
    
    shadow.appendChild(populationPageTemplate.cloneNode(true));
  }
};
