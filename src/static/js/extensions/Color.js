var color = {
  /*
   * Get the individual R, G, B and (optional) A values from a given color
   * string.
   */
  getRGBA: function(cs) {
    if(cs.charAt(0) === "#") {
      if(cs.length <= 5) {
        return {
          r: parseInt(cs.slice(1, 2), 16) * 17,
          g: parseInt(cs.slice(2, 3), 16) * 17,
          b: parseInt(cs.slice(3, 4), 16) * 17,
          a: (parseInt(cs.slice(4, 5), 16) / 15.) || 1.
        };
      } else {
        return {
          r: parseInt(cs.slice(1, 3), 16),
          g: parseInt(cs.slice(3, 5), 16),
          b: parseInt(cs.slice(5, 7), 16),
          a: (parseInt(cs.slice(7, 9), 16) / 255.) || 1.
        };
      }
    } else if(cs.match(/^rgb\(/)) {
      var cp = cs.slice(4, cs.length - 1);
      var cps = cp.split(',');
      return {
        r: parseInt(cps[0]),
        g: parseInt(cps[1]),
        b: parseInt(cps[2]),
        a: 1.
      };
    } else if(cs.match(/^rgba\(/)) {
      var cp = cs.slice(5, cs.length - 1);
      var cps = cp.split(',');
      return {
        r: parseInt(cps[0]),
        g: parseInt(cps[1]),
        b: parseInt(cps[2]),
        a: parseFloat(cps[3])
      };
    } else {
      return {
        error: "Unsupported color format: " + cs
      };
    }
  },

  /*
   * Convert the given color object to a string in RGBA or other format.
   */
  toString: function(co, fmt) {
    if(!co.a) {
      co.a = 1.;
    }
    fmt = fmt || "rgba";
    switch(fmt) {
      case "hex":
        var r = co.r < 16 ? "0" + co.r.toString(16) : co.r.toString(16);
        var g = co.g < 16 ? "0" + co.g.toString(16) : co.g.toString(16);
        var b = co.b < 16 ? "0" + co.b.toString(16) : co.b.toString(16);
        return "#" + r + g + b;

      case "hexa":
        var r = co.r < 16 ? "0" + co.r.toString(16) : co.r.toString(16);
        var g = co.g < 16 ? "0" + co.g.toString(16) : co.g.toString(16);
        var b = co.b < 16 ? "0" + co.b.toString(16) : co.b.toString(16);
        var a = Math.round(co.a * 255).toString(16);
        if(a < 16) {
          a = "0" + a;
        }
        return "#" + r + g + b + a;

      case "rgb":
        return "rgb(" + co.r + ", " + co.g + ", " + co.b + ")";

      case "rgba":
        return "rgba(" + co.r + ", " + co.g + ", " + co.b + ", " + co.a + ")";

      default:
        return "Unsupported color format: " + fmt;
    }
  },

  /*
   * Determine if a given color c is a dark color or not.
   */
  isDark: function(c) {
    if(c instanceof String || typeof c === "string") {
      c = this.getRGBA(c);
    }
    var ac = $ext.array.avg([c.r, c.g, c.b]);
    return ac < 128;
  },

  /*
   * Invert the given color c.
   */
  invert: function(c) {
    var co = c;
    if(c instanceof String || typeof c === "string") {
      co = this.getRGBA(c);
    }
    co.r = 255 - co.r;
    co.g = 255 - co.g;
    co.b = 255 - co.b;
    if(c instanceof String || typeof c === "string") {
      return this.toString(co);
    } else {
      return co;
    }
  },

  /*
   * Invert the given color c1, BUT ONLY IF its contrast with color c2 is low.
   */
  conditionalInvert: function(c1, c2) {
    var co1 = c1;
    var co2 = c2;
    if(c1 instanceof String || typeof c1 === "string") {
      co1 = this.getRGBA(c1);
    }
    if(c2 instanceof String || typeof c2 === "string") {
      co2 = this.getRGBA(c2);
    }

    var ad = $ext.array.avg([Math.abs(co1.r - co2.r), Math.abs(co1.g - co2.g),
        Math.abs(co1.b - co2.b)]);
    if(ad < 128) {
      return this.invert(c1);
    } else {
      return c1;
    }
  }
};

$ext.extend($ext, {
  color: color
});
