
const cipherDecrypters = {
  vigenere (m, k, decrypt = false) {
    var resChar;
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var encrypted = "";
    var i = 0;
    var l = k.length;
    var numeric = [];
    for (var char of k) {
      num = alphabet.indexOf(char.toUpperCase());
      if (num > -1) {
        numeric.push(num);
      } else {
        return false;
      }
    }

    for (var char of m) {
      if (alphabet.indexOf(char.toUpperCase()) > -1) {
          diff = numeric[i];
          if (decrypt) {
            diff *= -1;
          }

          resChar = alphabet.charAt( (alphabet.indexOf(char.toUpperCase()) + diff + 26) % 26 );
          if (char == char.toLowerCase()) {
            resChar = resChar.toLowerCase();
          }

          encrypted += resChar;
          i ++;
          if (i == l) {
            i = 0;
          }
      } else {
        encrypted += char
      }
    }

    return encrypted;
  }
}
