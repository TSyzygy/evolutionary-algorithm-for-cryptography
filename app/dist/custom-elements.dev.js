"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var customElementRegistry = window.customElements;
var populationPageTemplate = document.getElementById("population-page-template").content.firstElementChild;
customElementRegistry.define("population-page",
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(_class, _HTMLElement);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));

    var shadow = _this.attachShadow({
      mode: "closed"
    });

    shadow.appendChild(populationPageTemplate.cloneNode(true));
    return _this;
  }

  return _class;
}(_wrapNativeSuper(HTMLElement)));
var modalTemplate = document.getElementById("modal-template").content;
customElementRegistry.define("modal-popup",
/*#__PURE__*/
function (_HTMLElement2) {
  _inherits(_class2, _HTMLElement2);

  _createClass(_class2, null, [{
    key: "observedAttributes",
    get: function get() {
      return ["name"];
    }
  }]);

  function _class2() {
    var _this2;

    _classCallCheck(this, _class2);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(_class2).call(this));

    var shadow = _this2.attachShadow({
      mode: "open"
    }),
        modalElements = modalTemplate.cloneNode(true),
        thisModal = _assertThisInitialized(_this2);

    modalElements.querySelector("#close-button").addEventListener("click", function () {
      thisModal.open = false;
    });
    shadow.appendChild(modalElements);
    return _this2;
  }

  _createClass(_class2, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, _oldValue, newValue) {
      switch (name) {
        case "name":
          this.shadowRoot.querySelector("header h4").innerText = newValue;
          break;
      }
    }
  }, {
    key: "open",
    set: function set(val) {
      if (val) this.setAttribute("open", "");else this.removeAttribute("open");
    },
    get: function get() {
      return this.hasAttribute("open");
    }
  }]);

  return _class2;
}(_wrapNativeSuper(HTMLElement)));
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