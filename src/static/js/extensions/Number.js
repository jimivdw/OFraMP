$ext.extend($ext, {
  number: {
    EPSILON: 1e-3,

    /*
     * Check if a variable is numeric.
     * 
     * From: http://stackoverflow.com/a/1830844
     */
    isNumeric: function(num) {
      return !isNaN(parseFloat(num)) && isFinite(num);
    },

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
     * Get the most significant bit of a 32-bit number.
     */
    msb: function(x) {
      x |= (x >> 1);
      x |= (x >> 2);
      x |= (x >> 4);
      x |= (x >> 8);
      x |= (x >> 16);
      return(x & ~(x >> 1));
    },

    /*
     * Format a number to have bl characters berfore the comma, and fl after it.
     * 
     * If me is provided, the exponent cannot exceed that number.
     */
    format: function(num, bl, fl, me) {
      if(!this.isNumeric(num)) {
        return num;
      }

      var o_str = "" + Math.abs(num);
      var exp_part = o_str.match(/e[+-][0-9]+$/);
      if(exp_part && exp_part.length === 1) {
        var exp = parseInt(exp_part[0].split(/e/)[1]);
        o_str = o_str.split(exp_part[0])[0];
      } else {
        var exp = 0;
      }
      var parts = o_str.split(".");
      var sign = num < 0 ? "-" : "";
      var base = parts[0] || "";
      var frac = parts[1] || "";

      var bd = bl - base.length;
      if(bd > 0) {
        base = $ext.string.repeat("0", bd) + base;
      } else {
        frac = base.slice(base.length + bd) + frac;
        base = $ext.string.rslice(base, base.length + bd);
        exp -= bd;
      }

      var fd = fl - frac.length;
      if(fd > 0) {
        frac = frac + $ext.string.repeat("0", fd)
      } else {
        var s = frac.slice(frac.length + fd).charAt(0);
        frac = $ext.string.rslice(frac, frac.length + fd);
        if(s >= 5) {
          var ol = frac.length;
          frac = this.format(Number(frac) + 1, ol, 0);
        }
      }

      var f_str = sign + base;
      if(frac.length > 0) {
        f_str += "." + frac;
      }
      if(exp != 0) {
        f_str += "e" + exp;
      }

      if(me) {
        if(exp > me) {
          return "Infinity";
        } else if(exp < -me) {
          return this.format(0, bl, fl);
        }
      }

      return f_str;
    }
  }
});
