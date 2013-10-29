Date.prototype.format = function(fmt) {
  // TODO: extend
  // http://docs.python.org/2/library/datetime.html#strftime-and-strptime-behavior
  var f_pts = fmt.split("");
  var d_str = "";
  var directive_next = false;
  for( var i = 0; i < f_pts.length; i++) {
    switch(f_pts[i]) {
      case "%":
        directive_next = true;
        break;

      case "Y":
        d_str += this.getFullYear();
        directive_next = false;
        break;

      case "m":
        var m = this.getMonth() + 1;
        if(m < 10)
          d_str += "0" + m;
        else
          d_str += m;
        directive_next = false;
        break;

      case "d":
        var d = this.getDate();
        if(d < 10)
          d_str += "0" + d;
        else
          d_str += d;
        directive_next = false;
        break;

      case "H":
        var h = this.getHours();
        if(h < 10)
          d_str += "0" + h;
        else
          d_str += h;
        directive_next = false;
        break;

      case "M":
        var m = this.getMinutes();
        if(m < 10)
          d_str += "0" + m;
        else
          d_str += m;
        directive_next = false;
        break;

      case "S":
        var s = this.getSeconds();
        if(s < 10)
          d_str += "0" + s;
        else
          d_str += s;
        directive_next = false;
        break;

      default:
        d_str += f_pts[i];
        directive_next = false;
    }
  }
  return d_str;
};
