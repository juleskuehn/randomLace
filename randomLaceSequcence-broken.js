
// Returns a string of 16 characters a..p and A..P
// Upper case indicates lacing from the outside to the inside of the hole


// Constraint: hole can only be used once
// Constraint: two consecutives holes on same side cannot share outString truthiness
function randomLace() {

  // 65..80
  // 97..112

  var usedHoles = new Array(16);
  var outString = "";
  var lastUpperCaseFlag;
  var lastRand;
  var upperCaseFlag;
  var rand;

  for (var i = 0; i < 16; i++) {
    for(;;) {
      rand = Math.floor(Math.random() * 16);
      upperCaseFlag = Math.floor(Math.random() * 2);
      twoHolesSameSideSameOut = lastUpperCaseFlag === upperCaseFlag && Math.floor(lastRand / 2) === Math.floor(rand / 2);
      if (usedHoles[rand] === undefined && !twoHolesSameSideSameOut) {
        usedHoles[rand] === true;
        break;
      }
    }
    rand += 65;
    if (upperCaseFlag) {
      rand += 32;
    }
    lastUpperCaseFlag = upperCaseFlag;
    outString += String.fromCharCode(rand);
  }
  return outString;
}