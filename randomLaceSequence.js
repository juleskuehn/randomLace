// by Mike Kuehn and Joe Thibodeau
// to be pasted into https://www.fieggen.com/shoelace/create-a-lace.htm
// Paste the contents of this file in the console


// Returns a string of 16 characters a..p and A..P
// Upper case indicates lacing from the outside to the inside of the hole


// Constraint: hole can only be used once
// 
function randomLace(numNearbyRows, maxDepth, mustAlternateSides) {

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

  function withinMaxDepth() {
    if (maxDepth === undefined || lastRand === undefined || rand === undefined) {
      return true;
    }
    var curDepth = Math.floor(rand / 2);
    var lastDepth = Math.floor(lastRand / 2);
    console.log("curDepth",curDepth,"lastDepth",lastDepth);
    if (Math.abs(curDepth - lastDepth) > maxDepth) {
      return false;
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

      alternatesSides =
        mustAlternateSides === undefined
        || (rand + lastRand) % 2 === 1;

      // check candidate number for qualification
      conditionIfEverythingOk =
        usedHoles[rand] === undefined
        && !twoHolesSameSideSameOut
        && savesTieOff()
        && withinMaxDepth()
        && alternatesSides;

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
      if (rand % 2 == 0) { // even
        for (var i = -2 * numNearbyRows; i <= 2 * numNearbyRows + 1; i++) {
          if (rand + i >= 0 && rand + i < 16) {
            tieOffPoints.push(rand + i);
          }
        }
      } else {
        for (var i = -2 * numNearbyRows - 1; i <= 2 * numNearbyRows; i++) {
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

replayPath(randomLace(8, 8, false));