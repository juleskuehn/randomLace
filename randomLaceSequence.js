
// Returns a string of 16 characters a..p and A..P
// Upper case indicates lacing from the outside to the inside of the hole


// Constraint: hole can only be used once
// 
function randomLace() {

  // 65..80
  // 97..112

  var usedHoles = new Array(16);
  var outString = "";

  for (var i = 0; i < 16; i++) {

    var rand = Math.floor(Math.random() * 16);
    // Constraint 1
    for(;;) {
      rand = Math.floor(Math.random() * 16);
      if (usedHoles[rand] === undefined) {
        usedHoles[rand] = true;
        break;
      }
    }

    // Constraint 2
    


    rand += 65;
    var upperCaseFlag = Math.floor(Math.random() * 2);
    if (upperCaseFlag) {
      rand += 32;
    }
    outString += String.fromCharCode(rand);
  }
  return outString;
}