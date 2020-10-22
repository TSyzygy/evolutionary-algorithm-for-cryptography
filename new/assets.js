"use strict";

const
  centralAssets = {},
  // Gets asset from central database
  getAsset = async function (path) {
    var
      splitPath = path.split("/"),
      directory = splitPath.slice(0, -1).reduce(
        // Progresses down the asset tree. If a directory does not exist, creates one (another nested empty object).
        (t, v) => t.hasOwnProperty(v) ? t[v] : t[v] = {},
        centralAssets
      ),
      fileName = splitPath[splitPath.length - 1];

    // If data is not stored centrally, gets it from the server-side json files
    return directory.hasOwnProperty(fileName) ? directory[fileName] : fetch("../assets/" + path)
      .then(response => response.json())
      .then(json => directory[fileName] = json);
  }
