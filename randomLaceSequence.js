
// Returns a string of 16 characters a..p and A..P
// Upper case indicates lacing from the outside to the inside of the hole


// Constraint: hole can only be used once
// 
function randomLace() {

  // 65..80
  // 97..112

  var usedHoles = new Array(16);
  var outString = "";
  var lastUpperCaseFlag;
  var upperCaseFlag;
  var rand;
  var lastRand;

  for (var i = 0; i < 16; i++) {

    rand = Math.floor(Math.random() * 16);
    // Constraint 1
    for(;;) {
      rand = Math.floor(Math.random() * 16);
      if (usedHoles[rand] === undefined) {
        usedHoles[rand] = true;
        break;
      }
    }

    // Constraint 2
    upperCaseFlag = Math.floor(Math.random() * 2);
    twoHolesSameSideSameOut = lastUpperCaseFlag === upperCaseFlag && Math.floor(lastRand / 2) === Math.floor(rand / 2);




    lastUpperCaseFlag = upperCaseFlag;
    rand += 65;
    if (upperCaseFlag) {
      rand += 32;
    }
    outString += String.fromCharCode(rand);
  }
  return outString;
}