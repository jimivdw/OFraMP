EPSILON = 1e-3;

/*
 * Determine if a number is inbetween two other numbers.
 */
Number.prototype.between = function(a, b) {
  return a > b ? this <= a && this >= b : this >= a && this <= b;
};

/*
 * Determine if a number is approximately equal to another number n
 */
Number.prototype.approx = function(n) {
  return this.between(n - EPSILON, n + EPSILON);
};

/*
 * Format a number to have bl characters berfore the comma, and fl after it.
 */
Number.prototype.format = function(bl, fl) {
  var o_str = "" + this;
  var parts = o_str.split(".");
  var base = parts[0] || "";
  var frac = parts[1] || "";
  var exp = 0;

  var bd = bl - base.length;
  if(bd > 0) {
    base = "0".repeat(bd) + base;
  } else {
    frac = base.slice(base.length + bd) + frac;
    base = base.rslice(base.length + bd);
    exp = -bd;
  }

  var fd = fl - frac.length;
  if(fd > 0) {
    frac = frac + "0".repeat(fd);
  } else {
    var s = frac.slice(frac.length + fd).charAt(0);
    frac = frac.rslice(frac.length + fd);
    if(s >= 5) {
      var ol = frac.length;
      frac = "" + (Number(frac) + 1).format(ol, 0);
    }
  }

  var f_str = base;
  if(frac.length > 0) {
    f_str += "." + frac;
  }
  if(exp != 0) {
    f_str += "e" + exp;
  }

  return f_str;
};
