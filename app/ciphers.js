"use strict";

const availableCiphers = [
  {
    cipherName: "vigenere",
    displayName: "Vigenere",
  },
  {
    cipherName: "adfgvx",
    displayName: "ADFGVX",
  },
  {
    cipherName: "hill",
    displayName: "Hill",
  },
  {
    cipherName: "monoalphabetic",
    displayName: "Monoalphabetic",
  },
  {
    cipherName: "transposition",
    displayName: "Transposition",
  },
];
const addPopulationModal = document.getElementById("add-population-modal"),
  cipherSpecificOptions = document.getElementById("cipher-specific-options"),
  cipherSelect = document.getElementById("cipher-name");

var currentCipherOptionGroup = null;

class Cipher {
  constructor({ cipherName, displayName }) {
    this.cipherName = cipherName;
    this.displayName = displayName;
    // this.options = cipherSetup.options;
    this.loading = false;
    this.loaded = false;
    this._open = false;

    // Adds to add-population-modal cipher options
    const optionGroup = (this.optionGroup = document.createElement("div")),
      loadingMessage = (this.loadingMessage = document.createElement("p"));
    loadingMessage.innerText = "Loading";
    // this.loadingStatus = "Not loaded."
    optionGroup.appendChild(loadingMessage);
    cipherSpecificOptions.appendChild(optionGroup);

    // Adds an option to the cipher type dropdown
    const cipherTypeOption = document.createElement("option");
    cipherTypeOption.setAttribute("value", cipherName);
    cipherTypeOption.innerText = displayName;
    cipherSelect.appendChild(cipherTypeOption);
  }

  get module() {
    if (this.loading) {
      return this._module;
    } else {
      this.loading = true;
      this.loadingMessage.innerText = "Loading...";
      const cipherName = this.cipherName;
      return (this._module = import(
        "./ciphers/" + cipherName + "/module.js"
      ).then((cipherModule) => {
        this.loadingMessage.innerText = "Setting up...";
        // this._module = cipherModule;
        const optionGroup = this.optionGroup;
        this.options = [];
        for (let {
          name: optionName,
          type,
          label,
          description, // TODO
          params,
        } of cipherModule.setup.options) {
          const div = document.createElement("div"),
            labelElement = document.createElement("label"),
            id = `option-${cipherName}-${optionName}`;
          var inputElement, getValue;

          labelElement.innerText = label;

          switch (type) {
            case "number":
              inputElement = document.createElement("input");
              inputElement.setAttribute("type", "number");
              inputElement.setAttribute("name", optionName);
              inputElement.setAttribute("id", id);
              if (params.hasOwnProperty("min"))
                inputElement.setAttribute("min", params.min);
              if (params.hasOwnProperty("max"))
                inputElement.setAttribute("max", params.max);
              if (params.hasOwnProperty("default"))
                inputElement.setAttribute("value", params.default);
              break;
            case "select":
              inputElement = document.createElement("select");
              inputElement.setAttribute("name", optionName);
              inputElement.setAttribute("id", id);
              for (let { value, name } of params.options) {
                let optionElement = document.createElement("option");
                optionElement.setAttribute("value", value);
                optionElement.innerText = name;
                inputElement.appendChild(optionElement);
              }
              break;
          }

          div.appendChild(labelElement);
          div.appendChild(inputElement);

          this.options.push({
            name: optionName,
            input: inputElement,
            get value() {
              return this.input.value;
            },
          });

          optionGroup.appendChild(div);
        }

        this.loadingMessage.remove();

        this.loaded = true;

        return cipherModule;
      }));
    }
  }

  get open() {
    return this.optionGroup.classList.has("chosen");
  }

  set open(open) {
    if (open != this._open) {
      if (open) {
        this.optionGroup.classList.add("chosen");
        // Adds 'required' attribute to each of the options
        if (this.loaded)
          for (let option of this.options)
            option.input.setAttribute("required", "");
      } else {
        this.optionGroup.classList.remove("chosen");
        // Removes 'required' attribute from each of the options
        if (this.loaded)
          for (let option of this.options)
            option.input.removeAttribute("required");
      }
      this._open = open;
    }
    if (!this.loading) this.module;
  }

  collectInputs() {
    const config = {};
    for (let option of this.options) config[option.name] = option.value;
    return config;
  }
}

const ciphers = {};
availableCiphers.forEach(function (cipher) {
  ciphers[cipher.cipherName] = new Cipher(cipher);
});

cipherSelect.addEventListener("change", function () {
  if (currentCipherOptionGroup) currentCipherOptionGroup.open = false;
  var cipherName = this.value;
  if (cipherName) {
    currentCipherOptionGroup = ciphers[cipherName];
    currentCipherOptionGroup.open = true;
  }
});
