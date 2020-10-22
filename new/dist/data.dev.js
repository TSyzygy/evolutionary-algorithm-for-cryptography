"use strict";

var centralData = {}; // Gets data from central database 

function getData(path) {
  var splitPath, directory, fileName;
  return regeneratorRuntime.async(function getData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          splitPath = path.split("/");
          directory = splitPath.slice(0, -1).reduce(function (t, v) {
            if (t.hasOwnProperty(v)) {
              return t[v];
            } else {
              return t[v] = {};
            }
          }, centralData);
          fileName = splitPath[splitPath.length - 1];

          if (!directory.hasOwnProperty(fileName)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", directory[fileName]);

        case 7:
          return _context.abrupt("return", fetch("../assets/data/" + path).then(function (response) {
            return response.json();
          }).then(function (json) {
            directory[fileName] = json;
            return json;
          }));

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}