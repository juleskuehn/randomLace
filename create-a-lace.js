//======================================
// Create-a-Lace Script
// Last updated: 22-Sep-2015
// Copyright (c) 2015 by Ian W. Fieggen
//======================================

//=========
// Globals
//=========
var r=4.5;	// Radius of endcaps = 1/2 shoelace thickness
var t=0;	// Total segments
var s=0;	// Current segment
var pathCount=0;// Count of preset paths shown; reload ads every 5 paths
var e='';	// Eyelet ('a' thru 'p')
var ePrev='';	// Previous eyelet
var eFrom;	// From eyelet
var eTo;	// To eyelet
var i;		// Inner flag
var iPrev=false;// Previous Inner flag
var iFrom;	// From Inner flag
var iTo;	// To Inner flag
var y;		// General counter
var n;		// General counter
var temp;	// Temp swap variable
var eFromArray=new Array();	// Array of From Eyelets
var eToArray=new Array();	// Array of To Eyelets
var iFromArray=new Array();	// Array of From Inner flags
var iToArray=new Array();	// Array of To Inner flags
var stepDelay=200;		// Delay between frames of animation
var nextStepTimer;		// Animation timeout
var animFlag=false;		// Animation flag
var title=document.title;	// Grab empty title
var spans=document.getElementsByTagName('span');	// All spans, which may contain pre-defined eyelet paths
var spanHTML;		// Span HTML
var stringOffset;	// Search offset of found string
var eyeletPath='';	// Eyelet path
var animPath='';	// Animation path
var titlePath='';	// Title eyelet path
var methodName='';	// Method name
var methodDesc='';	// Method description

//=================
// Check parameter
//=================
if (window.location.search.substr(0,3)=='?p=') {	// Parameter 'p' ?
  replayPath(window.location.search.substr(3,16));
}

//==============
// Click eyelet
//==============
function clickEyelet(eClick) {
  e=eClick;
  if (e<'a') {	// Uppercase = Outer ?
    i=false;
    if (document.getElementById('e'+e.toLowerCase()).getAttribute('class')=='inactive') {	// Outer inactive ?
      return;
    }
  } else {	// Lowercase = Inner ?
    i=true;
    if (document.getElementById('i'+e).getAttribute('class')=='inactive') {	// Inner inactive ?
      return;
    }
  }
  // Append eyelet to eyelet path
  eyeletPath+=e;
  // Convert eyelet to lowercase
  e=e.toLowerCase();
  // Choose where to place new segment to minimise weird overlaps
  if (t==0) {		// First segment ?
    s=0;		// Place new segment at start
  } else {		// Already some segments ?
    // Remove loose end segment (from previous click)
    eFromArray.splice(s,1);
    iFromArray.splice(s,1);
    eToArray.splice(s,1);
    iToArray.splice(s,1);
    if (iPrev) {	// Prev = Inner ?
      if (i) {		// Current also Inner ?
        s=0;		// Place new segment at bottom
      } else {		// Current = Outer ?
        s=eToArray.indexOf(ePrev);	// Place new segment below segment containing same "To" as this segment's "From"
      }
    } else {		// Prev = Outer ?
      s=t;		// Place new segment at top
    }
  }
  // Splice new segment into arrays
  eFromArray.splice(s,0,ePrev);
  iFromArray.splice(s,0,iPrev);
  eToArray.splice(s,0,e);
  iToArray.splice(s,0,i);
  // Place subsequent loose end segment either below or above new segment
  if (i) {	// Current = Inner ?
    s=t+1;	// Subsequent loose end is on top
  }
  // Splice subsequent loose end into arrays
  if (t==0) {	// First ever subsequent loose end ?
    eFromArray.splice(s,0,e);	// From and To both the same, forming a 'dot', thus avoiding problem where loose ends overlap
  } else {	// All other loose ends ?
    eFromArray.splice(s,0,'');	// Use reversed "From" and "To", giving same format as first segment: From = '', To = eyelet
  }
  iFromArray.splice(s,0,false);
  eToArray.splice(s,0,e);
  iToArray.splice(s,0,!i);
  // Update total 't', while 's' still points to subsequent loose end (which will be removed at next click)
  t++;
  // Save for next click
  ePrev=e;
  iPrev=!i;	// Alternate Inner & Outer
  // Update SVG image
  updateSVG();
  // Update title + URL
  if (!animFlag) {	// Animation not running ?
    updateTitle(eyeletPath);
  } else {		// Animation running ?
    // Don't update title during each step of animation
  }
}

//=========================
// Update all SVG segments
//=========================
function updateSVG() {
  var xFrom;	// Column of eyelet (0 thru 1)
  var xTo;	// Column of eyelet (0 thru 1)
  var xMove;	// Columns moved (0 thru +/- 1)
  var yFrom;	// Row of eyelet (0 thru 7)
  var yTo;	// Row of eyelet (0 thru 7)
  var yMove;	// Rows moved (0 thru +/- 7)
  var yMoveAbs;	// Absolute rows moved (0 thru +7)
  var rCurve;	// Radius of curved segment
  var a;	// Angle at which ends meet sides (+/-360 degrees)
  var sar;	// Sin(Angle)*Radius;
  var car;	// Cos(Angle)*Radius
  var d;	// Draw attribute for path
  var mask;	// Mask attribute for path
  for (n=0; n<=t; n++) {
    // Retrieve values from arrays
    eFrom=eFromArray[n];
    iFrom=iFromArray[n];
    eTo=eToArray[n];
    iTo=iToArray[n];
    xTo=(eTo.charCodeAt(0)-97)%2;		// Convert ASCII 'a' thru 'p' to Column
    yTo=Math.floor((eTo.charCodeAt(0)-97)/2);	// Convert ASCII 'a' thru 'p' to Row
    // If loose end, can draw immediately, otherwise more calculations to perform
    if (eFrom=='') {				// Loose end ?
      if (xTo==0) {				// From left eyelet, pointing right
        d='M40 '+(300-yTo*40+r)+' a'+r+' '+r+' 0 1 1 0 '+(-2*r)+' h36 l4 2 v5 l-4 2z M80 '+(302.5-yTo*40)+' v-5 h17 v5z';
      } else {					// From right eyelet, pointing left
        d='M160 '+(300-yTo*40+r)+' a'+r+' '+r+' 0 1 0 0 '+(-2*r)+' h-36 l-4 2 v5 l4 2z M120 '+(302.5-yTo*40)+' v-5 h-17 v5z';
      }
    } else {					// Full segment ?
      xFrom=(eFrom.charCodeAt(0)-97)%2;		// Convert ASCII 'a' thru 'p' to Column
      yFrom=Math.floor((eFrom.charCodeAt(0)-97)/2);// Convert ASCII 'a' thru 'p' to Row
      xMove=xTo-xFrom;
      yMove=yTo-yFrom;
      // Calculate angle at which ends meet sides
      if (xMove) {				// Not vertical ?
        a=Math.atan((yMove*40)/(xMove*120));
        if (xMove<0) {				// Right to left ?
          a+=Math.PI;				// Rotate 180°
        }
      } else {					// Vertical ?
        yMoveAbs=Math.abs(yMove);
        if (yMoveAbs>1) {			// Two eyelets separated by one or more in between ?
          // Curved vertical segment
          rCurve=(yMoveAbs-0.3)*45;		// Larger vertical moves have greater curvature. Nested curves don't overlap.
          a=Math.acos(yMoveAbs/2/(yMoveAbs-0.3));
          if (xTo==0) {				// Left side ?
            a=-a;				// Flip right to left
          }
        } else {				// Two consecutive eyelets, nothing in between ?
          // Straight vertical segment
          a=Math.PI/2;
          if (yMove<0) {			// Upper to lower ?
            a+=Math.PI;				// Rotate 180°
          }
        }
      }
      // Sin and Cos of angles, times endcap radius
      sar=Math.sin(a)*r;
      car=Math.cos(a)*r;
      // Build segment path
      if ((xMove==0)&&(yMoveAbs>1)) {		// Curved vertical segment ?
        if (yMove<0) {				// Upper to lower ?
          temp=yFrom;				// Swap upper and lower ...
          yFrom=yTo;
          yTo=temp;
        }
        d='M'+(40+xTo*120+sar)+' '+(300-yFrom*40+car)
        +' A'+r+' '+r+' 0 0 '+xTo+' '+(40+xTo*120-sar)+' '+(300-yFrom*40-car)
        +' A'+(rCurve-r)+' '+(rCurve-r)+' 0 0 '+(1-xTo)+' '+(40+xTo*120-sar)+' '+(300-yTo*40+car)
        +' A'+r+' '+r+' 0 0 '+xTo+' '+(40+xTo*120+sar)+' '+(300-yTo*40-car)
        +' A'+(rCurve+r)+' '+(rCurve+r)+' 0 0 '+xTo+' '+(40+xTo*120+sar)+' '+(300-yFrom*40+car)
        +'z';
      } else {					// Straight segment (vertical, horizontal or diagonal) ?
        d='M'+(40+xFrom*120+sar)+' '+(300-yFrom*40+car)
        +' A'+r+' '+r+' 0 0 1 '+(40+xFrom*120-sar)+' '+(300-yFrom*40-car)
        +' L'+(40+xTo*120-sar)+' '+(300-yTo*40-car)
        +' A'+r+' '+r+' 0 0 1 '+(40+xTo*120+sar)+' '+(300-yTo*40+car)
        +'z';
      }
    }
    // Update SVG with segment
    document.getElementById('seg'+n).setAttribute('d',d);
    // Check if any part of segment is Inner
    if ((eFrom=='')&&(iTo)) {					// Loose end Inner ?
      mask='url(#mask_both)';
    } else if (iFrom&&iTo) {					// Both ends Inner ?
      mask='url(#mask_both)';
    } else if ((iFrom&&(xMove>=0))||(iTo&&(xMove<=0))) {	// Left end Inner ?
      mask='url(#mask_left)';
    } else if ((iFrom&&(xMove<=0))||(iTo&&(xMove>=0))) {	// Right end Inner ?
      mask='url(#mask_right)';
    } else {							// Neither end Inner ?
      mask='';
    }
    // Update SVG with segment mask
    document.getElementById('seg'+n).setAttribute('mask',mask);
  }
  // Temporarily mark all eyelets as active
  for (n=0; n<16; n++) {
    if (!animFlag) {	// Animation not running ?  Set as "highlight", which shows red highlights
      document.getElementById('e'+String.fromCharCode(97+n)).setAttribute('class','highlight');
      document.getElementById('i'+String.fromCharCode(97+n)).setAttribute('class','highlight');
    } else {		// Animation running ?  Set as "active", which doesn't show red highlights
      document.getElementById('e'+String.fromCharCode(97+n)).setAttribute('class','active');
      document.getElementById('i'+String.fromCharCode(97+n)).setAttribute('class','active');
    }
  }
  // Mark all used eyelets as inactive
  for (n=0; n<=t; n++) {
    if (eFromArray[n]>'') {	// Eyelet ?
      document.getElementById('e'+eFromArray[n]).setAttribute('class','inactive');
      document.getElementById('i'+eFromArray[n]).setAttribute('class','inactive');
    }
    if (eToArray[n]>'') {	// Eyelet ?
      document.getElementById('e'+eToArray[n]).setAttribute('class','inactive');
      document.getElementById('i'+eToArray[n]).setAttribute('class','inactive');
    }
  }
  // Mark eyelets directly above / below current eyelet as inactive, otherwise need to allow for "loop-backs" (tricky!)
  for (n=(e.charCodeAt(0)-65)%2; n<16; n=n+2) {
    if (i) {	// Inner ?
      document.getElementById('i'+String.fromCharCode(97+n)).setAttribute('class','inactive');
    } else {	// Outer ?
      document.getElementById('e'+String.fromCharCode(97+n)).setAttribute('class','inactive');
    }
  }
}

//====================
// Update title + URL
//====================
function updateTitle(titlePath) {
  if (titlePath.length>0) {	// Some eyelets clicked ?
    document.title=title+' - Eyelet path = '+titlePath;
    history.replaceState('','Eyelet path = '+titlePath,'?p='+titlePath);
  } else {			// Empty lacing ?
    document.title=title;
    history.replaceState('','','?');
  }
}

//============================
// Replay sequence of eyelets
//============================
function replayPath(ap) {
  // Cancel any pending animation
  clearTimeout(nextStepTimer);
  // Finalise parameters
  if (ap>'') {
    animPath=ap;
  } else {
    return;
  }
  // Search for Method Name + Description
  methodName='Custom Lacing';		// Defaults if can't match a pre-defined path
  methodDesc='(No description)';
  for (n=0; n<spans.length; n++) {	// Search all spans in document
    spanHTML=spans[n].outerHTML;
    stringOffset=spanHTML.indexOf('replayPath');
    if (stringOffset>0) {		// Found a pre-defined eyelet path ?
      eyeletPath=spanHTML.substring(stringOffset+12,spanHTML.indexOf("'",stringOffset+12));
      if (eyeletPath==animPath) {	// Matches URL parameter ?
        methodName=spans[n].innerHTML;
        stringOffset=methodName.indexOf('(');
        if (stringOffset>0) {		// Method name with bracketed suffix ?
          methodName=methodName.substr(0,stringOffset)+' Lacing '+methodName.substr(stringOffset);
        } else {			// No bracketed suffix in method name ?
          methodName=methodName+' Lacing';
        }
        methodDesc=spans[n].title;
      }
    }
  }
  // Show Method Name + Description
  document.getElementById('methodName').innerHTML='Preset Method: '+methodName;
  document.getElementById('methodDesc').innerHTML=methodDesc;
  document.getElementById('methodName').parentNode.style.display='block';
  document.getElementById('methodDesc').parentNode.style.display='block';
  // Every ten path animations, reload sponsors' ads
  ++pathCount;
  if (pathCount==10) {
    document.getElementById('ad160x600').src=document.getElementById('ad160x600').src;
    pathCount=0;
  }
  // Initiate animation
  animFlag=true;
  clearAll();
  y=0;
  showNextStep();
}

//================
// Show next step
//================
function showNextStep() {
  e=animPath.substr(y,1);
  clickEyelet(e);
  y++;
  if (y<animPath.length) {
    nextStepTimer=setTimeout('showNextStep()',stepDelay);
  } else {
    animFlag=false;
    updateSVG();	// Otherwise any remaining empty eyelets won't appear highlighted
  }
}

//================
// Translate path
//================
function translatePath(p) {
  // Cancel any pending animation
  clearTimeout(nextStepTimer);
  if (t>0) {
    animPath='';
    for (n=0; n<t; n++) {
      animPath+=p.charAt('AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp'.indexOf(eyeletPath.substr(n,1)));
    }
    replayPath(animPath);
  }
}

//==============
// Reverse path
//==============
function reversePath() {
  // Cancel any pending animation
  clearTimeout(nextStepTimer);
  if (t>1) {
    animPath='';
    for (n=t-1; n>=0; n--) {
      e=eyeletPath.substr(n,1);
      // Swap case because pass through eyelets in opposite direction
      if (e<'a') {	// Uppercase ?
        e=e.toLowerCase();
      } else {		// Lowercase ?
        e=e.toUpperCase();
      }
      animPath+=e;
    }
    replayPath(animPath);
  }
}

//===========
// Undo last
//===========
function undoLast() {
  // Cancel any pending animation
  clearTimeout(nextStepTimer);
  if (t>1) {		// Two or more eyelets filled ?
    // Retrieve last eyelet
    e=eyeletPath.substr(t-1,1);
    e=e.toLowerCase();
    // Search array for segments using that eyelet
    for (n=16; n>=0; n--) {
      if (eToArray[n]==e) {		// Found eyelet ?
        if (eFromArray[n]=='') {	// Loose end ?
          // Clear loose end
          eFromArray.splice(n,1);
          iFromArray.splice(n,1);
          eToArray.splice(n,1);
          iToArray.splice(n,1);
          s--;		// Update previous loose end, which will be removed at next click
        } else {			// Full segment ?
          // Convert segment to loose end
          eToArray[n]=eFromArray[n];
          iToArray[n]=iFromArray[n];
          if (t==2) {	// This will become the first subsequent loose end ?
            // From and To both the same, forming a 'dot', thus avoiding problem where loose ends overlap
          } else {	// All other loose ends ?
            eFromArray[n]='';
            iFromArray[n]=false;
          }
          s=n;		// Point to new loose end, which will be removed at next click
        }
      }
    }
    // Clear highest SVG segment and mask
    document.getElementById('seg'+t).setAttribute('d','');
    document.getElementById('seg'+t).setAttribute('mask','');
    // Update variables
    t--;		// Update total 't', while 's' still points to subsequent loose end (which will be removed at next click)
    eyeletPath=eyeletPath.substr(0,t);
    e=eyeletPath.substr(t-1,1);
    if (e<'a') {	// Uppercase = Outer ?
      i=false;
    } else {		// Lowercase = Inner ?
      i=true;
    }
    e=e.toLowerCase();
    // Save for next click
    ePrev=e;
    iPrev=!i;		// Alternate Inner & Outer
    // Update SVG image
    updateSVG();
    // Update title + URL
    updateTitle(eyeletPath);
  } else if (t==1) {	// 1 eyelet filled ?
    clearAll();
  } else {		// Empty ?
    // Do nothing (already empty)
  }
}

//===========
// Clear all
//===========
function clearAll() {
  // Cancel any pending animation
  clearTimeout(nextStepTimer);
  // Clear all segment arrays
  eFromArray.length=0;
  iFromArray.length=0;
  eToArray.length=0;
  iToArray.length=0;
  // Clear all variables
  s=0;
  t=0;
  eyeletPath='';
  methodName='';
  methodDesc='';
  ePrev='';
  iPrev=false;
  // Clear all SVG segments
  for (n=0; n<=16; n++) {
    document.getElementById('seg'+n).removeAttribute('d');
    document.getElementById('seg'+n).removeAttribute('mask');
  }
  // Mark all eyelets as active
  for (n=0; n<=15; n++) {
    document.getElementById('e'+String.fromCharCode(97+n)).setAttribute('class','highlight');
    document.getElementById('i'+String.fromCharCode(97+n)).setAttribute('class','highlight');
  }
  // Update title + URL
  if (!animFlag) {	// Animation not running ?
    // Show CLEARED eyeletPath
    updateTitle(eyeletPath);
    // Clear + hide method name + description
    document.getElementById('methodName').innerHTML='';
    document.getElementById('methodDesc').innerHTML='';
    document.getElementById('methodName').parentNode.style.display='none';
    document.getElementById('methodDesc').parentNode.style.display='none';
  } else {		// About to run animation ?
    // Show SAVED eyeletPath at START of animation
    updateTitle(animPath);
  }
}

//==============
// Show presets
//==============
function showPresets() {
  ps=document.getElementById('presets').style;
  if (ps.display=='block') {
    ps.display='none';
  } else {
    ps.display='block';
  }
}
