import Tab from "../../tab";

const template = fetch("template.html")
  .then((response) => response.text())
  .catch((err) => { console.log(err) });

export default class DecryptTab extends Tab {

  constructor() {
    super();

    const elements = (await template).cloneNode(true);

    this._onrequest = null;
    // this.ready = false;
    this._table = elements.querySelector("table");

    this._ciphertextsInitialised = false;

    this._main.appendChild(elements);
  }

  get onrequest() { return this._onrequest }
  set onrequest(newFunct) {
    // this.ready = true;
    this._onrequest = newFunct;
  }

  get ciphertexts() { return this._ciphertexts }
  set ciphertexts(ciphertexts) {
    if (!this._ciphertextsInitialised) {
      const table = this._table,
        decryptionCells = this._decryptionCells = [],
        scoreCells = this._scoreCells = [];

      var row, cell;
      // Loops through the ciphertexts
      for (let ciphertext of ciphertexts) {
        row = document.createElement("tr");

        // Adds ciphertext cell
        cell = document.createElement("td");
        cell.innerText = ciphertext;
        row.appendChild(cell);

        // Adds decryption cell
        cell = document.createElement("td");
        decryptionCells.push(cell);
        row.appendChild(cell);

        // Adds score cell
        cell = document.createElement("td");
        scoreCells.push(cell);
        row.appendChild(cell);

        // Adds row to table
        table.appendChild(row);
      };
      this._ciphertextsInitialised = true;
    }
  }

}
