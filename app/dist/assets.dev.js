"use strict"; // Gets asset from central database

var getAsset = function () {
  var centralAssets = {};
  return function _callee(path) {
    var splitPath, directory, fileName;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            splitPath = path.split("/"), directory = splitPath.slice(0, -1).reduce( // Progresses down the asset tree. If a directory does not exist, creates one (another nested empty object).
            function (t, v) {
              return t.hasOwnProperty(v) ? t[v] : t[v] = {};
            }, centralAssets), fileName = splitPath[splitPath.length - 1]; // If data is not stored centrally, gets it from the server-side json files

            return _context.abrupt("return", directory.hasOwnProperty(fileName) ? directory[fileName] : fetch("../assets/" + path).then(function (response) {
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