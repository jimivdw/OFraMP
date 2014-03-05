var string = {
  /*
   * Repeat a string n times.
   */
  repeat: function(str, n) {
    var r = "";
    for( var i = 0; i < n; i++) {
      r += str;
    }
    return r;
  },

  /*
   * Reverse slice, returns the opposite of slice.
   */
  rslice: function(str, i) {
    if(!str) {
      return "";
    }

    var chars = str.split("");
    chars.splice(i, chars.length - i);
    return chars.join("");
  },

  /*
   * Compare two version strings, e.g. "1.9.4" or "2.0".
   * 
   * If checkMinor is false, only the part of the other string that is part of
   * the original string will be compared, e.g. 1 == 1.1 == 1.1.5.
   * 
   * Return -1 if other is newer, 0 if equal and 1 if older.
   */
  versionCompare: function(str, other, checkMinor) {
    if(!str || !other) {
      return -1;
    }

    var tparts = str.split(".");
    var oparts = other.split(".");
    var i;
    for(i = 0; i < tparts.length; i++) {
      if(tparts[i] > 0 && !oparts[i] || tparts[i] > oparts[i]) {
        return 1;
      } else if(tparts[i] < oparts[i]) {
        return -1;
      }
    }

    if(checkMinor !== true) {
      return 0;
    } else {
      while(oparts[i] !== undefined) {
        if(oparts[i] > 0) {
          return -1;
        }
        i++;
      }
      return 0;
    }
  }
};

$ext.extend($ext, {
  string: string
});
