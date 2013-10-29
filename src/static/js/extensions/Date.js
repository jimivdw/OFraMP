LOCALE = {
  am: "AM",
  pm: "PM",
  weekdays: {
    0: {
      name: "Sunday",
      abbr: "Sun"
    },
    1: {
      name: "Monday",
      abbr: "Mon"
    },
    2: {
      name: "Tuesday",
      abbr: "Tue"
    },
    3: {
      name: "Wednesday",
      abbr: "Wed"
    },
    4: {
      name: "Thursday",
      abbr: "Thu"
    },
    5: {
      name: "Friday",
      abbr: "Fri"
    },
    6: {
      name: "Saturday",
      abbr: "Sat"
    }
  },
  months: {
    1: {
      name: "January",
      abbr: "Jan"
    },
    2: {
      name: "February",
      abbr: "Feb"
    },
    3: {
      name: "March",
      abbr: "Mar"
    },
    4: {
      name: "April",
      abbr: "Apr"
    },
    5: {
      name: "May",
      abbr: "May"
    },
    6: {
      name: "June",
      abbr: "Jun"
    },
    7: {
      name: "July",
      abbr: "Jul"
    },
    8: {
      name: "August",
      abbr: "Aug"
    },
    9: {
      name: "September",
      abbr: "Sep"
    },
    10: {
      name: "October",
      abbr: "Oct"
    },
    11: {
      name: "November",
      abbr: "Nov"
    },
    12: {
      name: "December",
      abbr: "Dec"
    }
  }
};

MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

Date.prototype.isLeapYear = function() {
  var y = this.getFullYear();
  return y % 400 == 0 || (y % 100 != 0 && y % 4 == 0);
};

Date.prototype.getDayOfYear = function() {
  var d = MONTH_LENGTHS.rslice(this.getMonth()).sum() + this.getDate();
  if(this.isLeapYear() && this.getMonth() > 1) {
    d += 1;
  }
  return d;
};

/*
 * Format a Date according to the formatting described here:
 * http://docs.python.org/2/library/datetime.html#strftime-and-strptime-behavior
 * 
 * Note that there is no way to get the timezone name in JavaScript, so %Z has
 * been left out.
 */
Date.prototype.format = function(fmt) {
  var f_pts = fmt.split("");
  var d_str = "";
  for( var i = 0; i < f_pts.length; i++) {
    if(f_pts[i] === "%") {
      switch(f_pts[++i]) {
        case "a": // Weekday as locale's abbreviated name (Sun, Mon).
          d_str += LOCALE.weekdays[this.getDay()].abbr;
          break;
        
        case "A": // Weekday as locale's full name (Sunday, Monday).
          d_str += LOCALE.weekdays[this.getDay()].name;
          break;
        
        case "w": // Weekday as a decimal number.
          d_str += this.getDay();
          break;
          break;
  
        case "d": // Day of the month as a zero-padded decimal number.
          d_str += this.getDate().format(2);
          break;
        
        case "b": // Month as locale's abbreviated name (Jan, Feb).
          d_str += LOCALE.months[this.getMonth() + 1].abbr;
          break;
        
        case "B": // Month as locale's full name (January, February).
          d_str += LOCALE.months[this.getMonth() + 1].name;
          break;
        
        case "m": // Month as a zero-padded decimal number.
          d_str += (this.getMonth() + 1).format(2);
          break;
        
        case "y": // Year without century as a zero-padded decimal number.
          d_str += ("" + this.getFullYear()).slice(2);
          break;
        
        case "Y": // Year with century as a decimal number.
          d_str += this.getFullYear();
  
        case "H": // Hour (24-hour clock) as a zero-padded decimal number.
          d_str += this.getHours().format(2);
          break;
        
        case "I": // Hour (12-hour clock) as a zero-padded decimal number.
          var h = this.getHours();
          if(h > 12) {
            d_str += (h % 12).format(2);
          } else {
            d_str += h.format(2);
          }
          break;
        
        case "p": // Locale's equivalent of either AM or PM.
          if(this.getHours() < 12) {
            d_str += LOCALE.am;
          } else {
            d_str += LOCALE.pm;
          }
          break;
  
        case "M": // Minute as a zero-padded decimal number.
          d_str += this.getMinutes().format(2);
          break;
  
        case "S": // Second as a zero-padded decimal number.
          d_str += this.getSeconds().format(2);
          break;
        
        case "f": // Microsecond as a decimal number, zero-padded on the left.
          d_str += (this.getMilliseconds() * 1000).format(6);
          break;
        
        case "z": // UTC offset in the form +HHMM or -HHMM.
          var tzo = this.getTimezoneOffset();
          if(tzo > 0) {
            var p = "-";
          } else {
            var p = "+";
            tzo *= -1;
          }
          var oh = tzo / 60;
          var om = tzo % 60;
          d_str += p + oh.format(2) + om.format(2);
          break;

        case "j": // Day of the year as a zero-padded decimal number.
          d_str += this.getDayOfYear().format(3);
          break;

        case "U": // Week number of the year (Sunday as the first day).
          var doy = this.getDayOfYear();
          var fd = new Date(this.getFullYear(), 0, 1).getDay();
          if(fd > 0) {
            doy -= (7 - fd);
          }
          
          if(doy < 1) {
            d_str += "00";
          } else {
            d_str += Math.ceil(doy / 7).format(2);
          }
          break;
        
        case "W": // Week number of the year (Monday as the first day).
          var doy = this.getDayOfYear();
          var fd = new Date(this.getFullYear(), 0, 1).getDay() - 1;
          if(fd == -1) { fd = 6; } // Make Monday day 0
          if(fd > 0) {
            doy -= (7 - fd);
          }
          
          if(doy < 1) {
            d_str += "00";
          } else {
            d_str += Math.ceil(doy / 7).format(2);
          }
          break;
        
        case "c": // Locale's appropriate date and time representation.
          d_str += this.toString();
          break;
        
        case "x": // Locale's appropriate date representation.
          d_str += this.toDateString();
          break;
        
        case "X": // Locale's appropriate time representation.
          d_str += this.toTimeString();
          break;
        
        case "%": // A literal '%' character.
          d_str += "%";
          break;
  
        default:
          console.warn("Encountered unknown directive:", f_pts[i]);
      }
    } else {
      d_str += f_pts[i];
    }
  }
  return d_str;
};
