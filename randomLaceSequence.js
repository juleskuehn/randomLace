
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
  var veryFirstRand;
  var tieOffPoints = [];

  function savesTieOff() {
    console.log("Tie Off Points for ", rand, ": ", tieOffPoints);
    var freeNearbyHoles = 0;
    var isLastMove = outString.length === 15;
    if (isLastMove) return true;
    var usingTieOffPoint = false;

    // everything is ok if not attempting to use a tieOffPoint
    for (var i = 0; i < tieOffPoints.length; i++) {
      if (rand === tieOffPoints[i]) {
        usingTieOffPoint = true;
        break;
      }
    }

    if (usingTieOffPoint) {
      // then we do have to check
      for (var j = 0; j < tieOffPoints.length; j++) {
        // we want to leave at least one hole free to tie off
        if (usedHoles[tieOffPoints[j]] === undefined) {
          freeNearbyHoles++;
        }
      }
      return freeNearbyHoles > 1;
    }

    return true;
  }


  for (var j = 0; j < 16; j++) {

    rand = Math.floor(Math.random() * 16);

    for (; ;) {

      rand = Math.floor(Math.random() * 16);
      upperCaseFlag = Math.floor(Math.random() * 2);
      // If first number, no constraints need to be checked
      if (veryFirstRand === undefined) break;


      twoHolesSameSideSameOut =
        lastUpperCaseFlag == upperCaseFlag &&
        lastRand % 2 == rand % 2;

      // check candidate number for qualification
      conditionIfEverythingOk =
        usedHoles[rand] === undefined
        && !twoHolesSameSideSameOut
        && savesTieOff();

      if (conditionIfEverythingOk) {
        // we've got a new candidate!
        break;
      }
    } // end forever loop

    // stuff that happens if we're good to go
    if (veryFirstRand === undefined) {
      veryFirstRand = rand;
      tieOffPoints = [];
      // create array of surrounding indices of interest...
      if (rand % 2 == true) { // even
        for (var i = -2; i <= 3; i++) {
          if (rand + i >= 0 && rand + i < 16) {
            tieOffPoints.push(rand + i);
          }
        }
      } else {
        for (var i = -3; i <= 2; i++) {
          if (rand + i >= 0 && rand + i < 16) {
            tieOffPoints.push(rand + i);
          }
        }
      }
    }

    lastUpperCaseFlag = upperCaseFlag;
    lastRand = rand;
    usedHoles[rand] = true;

    rand += 65;
    if (upperCaseFlag) {
      rand += 32;
    }
    outString += String.fromCharCode(rand);
  }
  return outString;
}