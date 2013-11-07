$ext.extend($ext, {
  number: {
    EPSILON: 1e-3,

    /*
     * Determine if a number is inbetween two other numbers.
     */
    between: function(num, a, b) {
      return a > b ? num <= a && num >= b : num >= a && num <= b;
    },

    /*
     * Determine if a number is approximately equal to another number n
     */
    approx: function(num, other) {
      return this.between(num, other - this.EPSILON, other + this.EPSILON);
    },

    /*
     * Format a number to have bl characters berfore the comma, and fl after it.
     */
    format: function(num, bl, fl) {
      var o_str = "" + num;
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
          frac = this.format(Number(frac) + 1, ol, 0);
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
    }
  }
});
