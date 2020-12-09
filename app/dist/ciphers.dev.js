"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var vigenereCipherSetup = {
  displayName: "Vigenere",
  options: [{
    name: "keylength",
    type: "number",
    label: "Keylength",
    description: "The length of the key used to encrypt the plaintext with the vigenere cipher.",
    params: {
      min: 2,
      max: 100,
      "default": 8
    }
  }, {
    name: "n",
    label: "Fitness evaluation method",
    description: "The length of n-gram used to compare each decryption to expected English frequencies.",
    type: "select",
    params: {
      options: [{
        value: "",
        name: "Select fitness method..."
      }, {
        value: "2",
        name: "Bigram score"
      }, {
        value: "3",
        name: "Trigram score"
      }, {
        value: "4",
        name: "Quadgram score"
      }]
    }
  }]
};
var availableCiphers = [
/* "adfgvx", "hill", "monoalphabetic", "transposition", */
"vigenere"];
var ciphers = {};
var addPopulationModal = document.getElementById("add-population-modal"),
    cipherSpecificOptions = document.getElementById("cipher-specific-options"),
    cipherTypeSelect = document.getElementById("cipher-name");
var currentCipherOptionGroup = null;

var Cipher =
/*#__PURE__*/
function () {
  function Cipher(cipherName, _ref) {
    var displayName = _ref.displayName,
        options = _ref.options;

    _classCallCheck(this, Cipher);

    this.name = cipherName;
    this.displayName = displayName;
    this.options = options; // Adds to add-population-modal cipher options

    var optionGroup = document.createElement("div");
    optionGroup.dataset.cipherName = cipherName;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _step.value,
            optionName = _step$value.name,
            type = _step$value.type,
            label = _step$value.label,
            description = _step$value.description,
            params = _step$value.params;
        var div = document.createElement("div"),
            labelElement = document.createElement("label"),
            id = "option-".concat(cipherName, "-").concat(optionName),
            inputElement = void 0;
        labelElement.innerText = label;

        switch (type) {
          case "number":
            inputElement = document.createElement("input");
            inputElement.setAttribute("type", "number");
            inputElement.setAttribute("name", optionName);
            inputElement.setAttribute("id", id);
            if (params.hasOwnProperty("min")) inputElement.setAttribute("min", params.min);
            if (params.hasOwnProperty("max")) inputElement.setAttribute("max", params.max);
            if (params.hasOwnProperty("default")) inputElement.setAttribute("value", params["default"]);
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

    ;
    this.optionGroup = optionGroup;
    cipherSpecificOptions.appendChild(optionGroup); // Adds an option to the cipher type dropdown

    var cipherTypeOption = document.createElement("option");
    cipherTypeOption.setAttribute("value", cipherName);
    cipherTypeOption.innerText = displayName;
  }

  _createClass(Cipher, [{
    key: "open",
    get: function get() {
      return this.optionGroup.classList.has("chosen");
    },
    set: function set(open) {
      if (open) {
        this.optionGroup.classList.add("chosen");
        currentCipherOptionGroup = this;
      } else this.optionGroup.classList.remove("chosen");
    }
  }]);

  return Cipher;
}();

;
availableCiphers.forEach(function (cipherName) {
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("".concat("./ciphers/" + cipherName + "/population-functions.js")));
  }).then(function (_ref2) {
    var cipherSetup = _ref2.cipherSetup;
    ciphers.push(new Cipher(cipherName, cipherSetup));
  });
});