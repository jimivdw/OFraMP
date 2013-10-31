/*
 * Repeat a string n times.
 */
String.prototype.repeat = function(n) {
  var r = "";
  for( var i = 0; i < n; i++) {
    r += this;
  }
  return r;
};

/*
 * Reverse slice, returns the opposite of slice.
 */
String.prototype.rslice = function(i) {
  var chars = this.split("");
  chars.splice(i);
  return chars.join("");
};

/*
 * Compare two version strings, e.g. "1.9.4" or "2.0".
 * 
 * Return -1 if other is older, 0 if equal and 1 if newer.
 */
String.prototype.versionCompare = function(other) {
  if(!other) {
    return -1;
  }

  var tparts = this.split(".");
  var oparts = other.split(".");
  var i;
  for(i = 0; i < tparts.length; i++) {
    if(!oparts[i] || tparts[i] > oparts[i]) {
      return -1;
    } else if(tparts[i] < oparts[i]) {
      return 1;
    }
  }

  if(oparts[i] > 0) {
    return 1;
  } else {
    return 0;
  }
};
