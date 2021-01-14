"use strict";

document.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "ArrowUp":
      changeOpenPopulation(openPopulationNum-1);
      break
    case "ArrowDown":
      changeOpenPopulation(openPopulationNum+1);
      break
  }
})
