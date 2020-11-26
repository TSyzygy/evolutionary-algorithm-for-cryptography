// from https://stackoverflow.com/questions/44474864/compute-determinant-of-a-matrix
const determinant = m => 
m.length == 1 ?
m[0][0] :
m.length == 2 ? 
m[0][0]*m[1][1]-m[0][1]*m[1][0] :
m[0].reduce((r,e,i) => 
  r+(-1)**(i+2)*e*d(m.slice(1).map(c => 
    c.filter((_,j) => i != j))),0);

// Finds the number x such that ax = 1 (mod n)
function modularInverse(a, n) {
  var t = 0, newT = 1, tempT, r = n, newR = a, tempR, quot;
  while (newR != 0) {
    quot = Math.floor(r / newR);

    tempT = t
    t = newT
    newT = tempT - quot * newT

    tempR = r
    r = newR
    newR = tempR - quot * newR
  }

  if (r > 1) {
    return false;
  }

  if (t < 0) {
    return t + n
  } else {
    return t;
  }
}

function invertMatrixMod26(A) {
  const m = A.length;

  // Checks det != 0 and is coprime with 26
  var det = d(key);
  var detInv = modularInverse(det, 26)
  if (detInv) {
    
    // Calculates modular inverse of determinant
    var B = A.map(
      (row, r, mat) => row.map(
        (item, c, row) => (-1) ** (r + c) * det(
          // Gets minor
          [...mat].slice(r, 1).map(
            (minorRow) => [...minorRow].slice(c, 1)
          )
        ) * detInv // Multiplies each element by detInv
      )
    )

  } else {
    return false;
  }
}
