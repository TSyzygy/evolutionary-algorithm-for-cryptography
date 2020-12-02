"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageDecrypter = MessageDecrypter;
exports.KeyToString = KeyToString;
exports.KeyToText = KeyToText;
exports.TextToKey = TextToKey;

function MessageDecrypter(message, config) {
  var convertedMessage = message.split("").map(function (c) {
    return value.hasOwnProperty(c) ? value[c] : c;
  });
  return function (key) {
    var p = 0,
        b = 0;
    return convertedMessage.reduce(function (plaintext, val) {
      if (p == keylength) {
        p = 0;
        b += keylength;
      }

      ;
      return plaintext + (typeof val == "number" ? letter[val + key[p++]] : val);
    }, "");
  };
  var decrypted = [];

  for (var i = 0, b = 0, p = 0, l = message.length; i < l; i++, p++) {
    if (p == keylength) {
      p = 0;
      b += keylength;
    }

    ;
    decrypted.push(message[b + key[p]]);
  }

  ;
}

;

function KeyToString(config) {}

;

function KeyToText(config) {}

;

function TextToKey(config) {}

;