"use strict"; // Gets asset from central database

var getAsset = function () {
  var centralAssets = {};
  return function _callee(directoryPath, fileName) {
    var directory;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            directory = directoryPath.reduce( // Progresses down the asset tree. If a directory does not exist, creates one (another nested empty object).
            function (t, v) {
              return t.hasOwnProperty(v) ? t[v] : t[v] = {};
            }, centralAssets); // If data is not stored centrally, gets it from the server-side json files

            return _context.abrupt("return", directory.hasOwnProperty(fileName) ? directory[fileName] : fetch("../assets/" + directoryPath.join("/") + "/" + fileName).then(function (response) {
              return response.json();
            }).then(function (json) {
              return directory[fileName] = json;
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  };
}();