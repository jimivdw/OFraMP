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
