const template = document.getElementById("tab-template");

export default class Tab extends HTMLElement {

  static get observedAttributes() {
    return ["open"];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({mode: "closed"}),
      elements = template.cloneNode(true);

    this._main = this.getElementById("main");

    this._open = false;

    shadow.appendChild(elements);
  }

  get open() { return this._open }
  set open(newValue) {
    if (newValue) this.setAttribute("open", "")
    else this.removeAttribute("open");
  }

  attributeChangedCallback(_name, _oldValue, newValue) {
    this._open = !(newValue == null);
  }
}
