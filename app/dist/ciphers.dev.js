"use strict";
/*

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

*/

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var availableCiphers = [{
  cipherName: "vigenere",
  displayName: "Vigenere"
}, {
  cipherName: "adfgvx",
  displayName: "ADFGVX"
}, {
  cipherName: "hill",
  displayName: "Hill"
}, {
  cipherName: "monoalphabetic",
  displayName: "Monoalphabetic"
}, {
  cipherName: "transposition",
  displayName: "Transposition"
}];
var addPopulationModal = document.getElementById("add-population-modal"),
    cipherSpecificOptions = document.getElementById("cipher-specific-options"),
    cipherSelect = document.getElementById("cipher-name");
var currentCipherOptionGroup = null;

var Cipher =
/*#__PURE__*/
function () {
  function Cipher(_ref) {
    var cipherName = _ref.cipherName,
        displayName = _ref.displayName;

    _classCallCheck(this, Cipher);

    this.cipherName = cipherName;
    this.displayName = displayName; // this.options = cipherSetup.options;

    this.loading = false;
    this.loaded = false;
    this._open = false; // Adds to add-population-modal cipher options

    var optionGroup = this.optionGroup = document.createElement("div"),
        loadingMessage = this.loadingMessage = document.createElement("p");
    loadingMessage.innerText = "Loading"; // this.loadingStatus = "Not loaded."

    optionGroup.appendChild(loadingMessage);
    cipherSpecificOptions.appendChild(optionGroup); // Adds an option to the cipher type dropdown

    var cipherTypeOption = document.createElement("option");
    cipherTypeOption.setAttribute("value", cipherName);
    cipherTypeOption.innerText = displayName;
    cipherSelect.appendChild(cipherTypeOption);
  }

  _createClass(Cipher, [{
    key: "collectInputs",
    value: function collectInputs() {
      var config = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var option = _step.value;
          config[option.name] = option.value;
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

      return config;
    }
  }, {
    key: "module",
    get: function get() {
      var _this = this;

      if (this.loading) {
        return this._module;
      } else {
        this.loading = true;
        this.loadingMessage.innerText = "Loading...";
        var cipherName = this.cipherName;
        return this._module = Promise.resolve().then(function () {
          return _interopRequireWildcard(require("".concat("./ciphers/" + cipherName + "/module.js")));
        }).then(function (cipherModule) {
          _this.loadingMessage.innerText = "Setting up..."; // this._module = cipherModule;

          var optionGroup = _this.optionGroup;
          _this.options = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = cipherModule.setup.options[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _step2$value = _step2.value,
                  optionName = _step2$value.name,
                  type = _step2$value.type,
                  label = _step2$value.label,
                  description = _step2$value.description,
                  params = _step2$value.params;
              var div = document.createElement("div"),
                  labelElement = document.createElement("label"),
                  id = "option-".concat(cipherName, "-").concat(optionName);
              var inputElement, getValue;
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
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = params.options[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var _step3$value = _step3.value,
                          value = _step3$value.value,
                          name = _step3$value.name;
                      var optionElement = document.createElement("option");
                      optionElement.setAttribute("value", value);
                      optionElement.innerText = name;
                      inputElement.appendChild(optionElement);
                    }
                  } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                        _iterator3["return"]();
                      }
                    } finally {
                      if (_didIteratorError3) {
                        throw _iteratorError3;
                      }
                    }
                  }

                  ;
                  break;
              }

              div.appendChild(labelElement);
              div.appendChild(inputElement);

              _this.options.push({
                name: optionName,
                input: inputElement,

                get value() {
                  return this.input.value;
                }

              });

              optionGroup.appendChild(div);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          _this.loadingMessage.remove();

          _this.loaded = true;
          return cipherModule;
        });
      }
    }
  }, {
    key: "open",
    get: function get() {
      return this.optionGroup.classList.has("chosen");
    },
    set: function set(open) {
      if (open != this._open) {
        if (open) {
          this.optionGroup.classList.add("chosen"); // Adds 'required' attribute to each of the options

          if (this.loaded) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = this.options[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var option = _step4.value;
                option.input.setAttribute("required", "");
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                  _iterator4["return"]();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          }
        } else {
          this.optionGroup.classList.remove("chosen"); // Removes 'required' attribute from each of the options

          if (this.loaded) {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = this.options[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var _option = _step5.value;

                _option.input.removeAttribute("required");
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                  _iterator5["return"]();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }
          }
        }

        this._open = open;
      }

      if (!this.loading) this.load();
    }
  }]);

  return Cipher;
}();

var ciphers = {};
availableCiphers.forEach(function (cipher) {
  ciphers[cipher.cipherName] = new Cipher(cipher);
  console.log("A");
});
cipherSelect.addEventListener("change", function () {
  if (currentCipherOptionGroup) currentCipherOptionGroup.open = false;
  var cipherName = this.value;

  if (cipherName) {
    currentCipherOptionGroup = ciphers[cipherName];
    currentCipherOptionGroup.open = true;
  }
});