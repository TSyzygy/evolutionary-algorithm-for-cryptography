"use strict";

// Gets asset from central database
const getAsset = (function () {
  const centralAssets = {};
  return async function (directoryPath, fileName) {
    const directory = directoryPath.reduce(
      // Progresses down the asset tree. If a directory does not exist, creates one (another nested empty object).
      (t, v) => (t.hasOwnProperty(v) ? t[v] : (t[v] = {})),
      centralAssets
    );

    // If data is not stored centrally, gets it from the server-side json files
    return directory.hasOwnProperty(fileName)
      ? directory[fileName]
      : fetch("../assets/" + directoryPath.join("/") + "/" + fileName)
          .then((response) => response.json())
          .then((json) => (directory[fileName] = json));
  };
})();
