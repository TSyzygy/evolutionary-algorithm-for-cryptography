// template
console.assert("content" in document.createElement("template"));

// worker
console.assert(window.Worker);

// will not work in IE because [node].remove() is needed

// custom elements
console.assert(window.customElements);
