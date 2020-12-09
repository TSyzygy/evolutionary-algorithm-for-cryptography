
let vigenereCipherSetup = {
  displayName: "Vigenere",
  options: [
    {
      name: "keylength",
      type: "number",
      label: "Keylength",
      description:
        "The length of the key used to encrypt the plaintext with the vigenere cipher.",
      params: {
        min: 2,
        max: 100,
        default: 8,
      },
    },
    {
      name: "n",
      label: "Fitness evaluation method",
      description:
        "The length of n-gram used to compare each decryption to expected English frequencies.",
      type: "select",
      params: {
        options: [
          {
            value: "",
            name: "Select fitness method...",
          },
          {
            value: "2",
            name: "Bigram score",
          },
          {
            value: "3",
            name: "Trigram score",
          },
          {
            value: "4",
            name: "Quadgram score",
          },
        ],
      },
    },
  ],
};

const availableCiphers = [/* "adfgvx", "hill", "monoalphabetic", "transposition", */ "vigenere"];
const ciphers = {};
const addPopulationModal = document.getElementById("add-population-modal"),
  cipherSpecificOptions = document.getElementById("cipher-specific-options"),
  cipherTypeSelect = document.getElementById("cipher-name");

var currentCipherOptionGroup = null;

class Cipher {
  constructor(cipherName, { displayName, options }) {
    this.name = cipherName;
    this.displayName = displayName;
    this.options = options;

    // Adds to add-population-modal cipher options
    const optionGroup = document.createElement("div");
    optionGroup.dataset.cipherName = cipherName;
    for (let { name: optionName, type, label, description, params } of options) {
      let div = document.createElement("div"),
        labelElement = document.createElement("label"),
        id = `option-${cipherName}-${optionName}`,
        inputElement;

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
          break;
      }

      div.appendChild(labelElement);
      div.appendChild(inputElement);

      optionGroup.appendChild(div);
    };
    this.optionGroup = optionGroup;
    cipherSpecificOptions.appendChild(optionGroup);

    // Adds an option to the cipher type dropdown
    const cipherTypeOption = document.createElement("option");
    cipherTypeOption.setAttribute("value", cipherName);
    cipherTypeOption.innerText = displayName;
  }

  get open() {
    return this.optionGroup.classList.has("chosen");
  }

  set open(open) {
    if (open) {
      this.optionGroup.classList.add("chosen");
      currentCipherOptionGroup = this;
    }
    else this.optionGroup.classList.remove("chosen");
  }
};

availableCiphers.forEach(function (cipherName) {
  import("./ciphers/" + cipherName + "/population-functions.js")
    .then(({ cipherSetup }) => {
      ciphers.push(new Cipher(cipherName, cipherSetup));
    });
});
