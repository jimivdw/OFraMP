$ext.extend($ext, {
  locale: {
    en: {
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
    }
  },

  date: {
    MONTH_LENGTHS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    /*
     * Return whether this Date is in a leap year.
     */
    isLeapYear: function(date) {
      var y = this.getFullYear(date);
      return y % 400 == 0 || (y % 100 != 0 && y % 4 == 0);
    },

    /*
     * Get the day number in the year this Date represents.
     */
    getDayOfYear: function(date) {
      var d = $ext.array.sum($ext.array.rslice(MONTH_LENGTHS, date.getMonth()))
          + date.getDate();
      if(this.isLeapYear(date) && date.getMonth() > 1) {
        d += 1;
      }
      return d;
    },

    /*
     * Get the day of the week, with weeks starting on Monday.
     */
    getDayM: function(date) {
      return (date.getDay() + 6) % 7;
    },

    /*
     * Get the week number, with weeks starting on Sunday.
     */
    getWeek: function(date) {
      var doy = this.getDayOfYear(date);
      var fd = new Date(date.getFullYear(), 0, 1).getDay();
      if(fd > 0) {
        doy -= (7 - fd);
      }

      if(doy < 1) {
        return 0;
      } else {
        return Math.ceil(doy / 7);
      }
    },

    /*
     * Get the week number, with weeks starting on Monday.
     */
    getWeekM: function(date) {
      var doy = this.getDayOfYear(date);
      var fd = new Date(date.getFullYear(), 0, 1).getDayM();
      if(fd > 0) {
        doy -= (7 - fd);
      }

      if(doy < 1) {
        return 0;
      } else {
        return Math.ceil(doy / 7);
      }
    },

    /*
     * Format a Date according to the formatting described here:
     * http://docs.python.org/2/library/datetime.html#strftime-and-strptime-behavior
     * 
     * Note that there is no way to get the timezone name in JavaScript, so %Z
     * has been left out.
     */
    format: function(date, fmt) {
      var f_pts = fmt.split("");
      var d_str = "";
      for( var i = 0; i < f_pts.length; i++) {
        if(f_pts[i] === "%") {
          switch(f_pts[++i]) {
            case "a": // Weekday as locale's abbreviated name (Sun, Mon).
              d_str += $ext.locale.en.weekdays[date.getDay()].abbr;
              break;

            case "A": // Weekday as locale's full name (Sunday, Monday).
              d_str += $ext.locale.en.weekdays[date.getDay()].name;
              break;

            case "w": // Weekday as a decimal number.
              d_str += date.getDay();
              break;

            case "d": // Day of the month as a zero-padded decimal number.
              d_str += $ext.number.format(date.getDate(), 2);
              break;

            case "b": // Month as locale's abbreviated name (Jan, Feb).
              d_str += $ext.locale.en.months[date.getMonth() + 1].abbr;
              break;

            case "B": // Month as locale's full name (January, February).
              d_str += $ext.locale.en.months[date.getMonth() + 1].name;
              break;

            case "m": // Month as a zero-padded decimal number.
              d_str += $ext.number.format(date.getMonth() + 1, 2);
              break;

            case "y": // Year without century as a zero-padded decimal number.
              d_str += ("" + date.getFullYear()).slice(2);
              break;

            case "Y": // Year with century as a decimal number.
              d_str += date.getFullYear();
              break;

            case "H": // Hour (24-hour clock) as a zero-padded decimal number.
              d_str += $ext.number.format(date.getHours(), 2);
              break;

            case "I": // Hour (12-hour clock) as a zero-padded decimal number.
              var h = date.getHours();
              if(h > 12) { // Keep 12pm as 12pm, not as 0pm.
                d_str += $ext.number.format(h % 12, 2);
              } else {
                d_str += $ext.number.format(h, 2);
              }
              break;

            case "p": // Locale's equivalent of either AM or PM.
              if(date.getHours() < 12) {
                d_str += $ext.locale.en.am;
              } else {
                d_str += $ext.locale.en.pm;
              }
              break;

            case "M": // Minute as a zero-padded decimal number.
              d_str += $ext.number.format(date.getMinutes(), 2);
              break;

            case "S": // Second as a zero-padded decimal number.
              d_str += $ext.number.format(date.getSeconds(), 2);
              break;

            case "f": // Microsecond as a decimal number, left zero-padded.
              d_str += $ext.number.format(date.getMilliseconds() * 1000, 6);
              break;

            case "z": // UTC offset in the form +HHMM or -HHMM.
              var tzo = date.getTimezoneOffset();
              if(tzo > 0) {
                var p = "-";
              } else {
                var p = "+";
                tzo *= -1;
              }
              var oh = tzo / 60;
              var om = tzo % 60;
              d_str += p + $ext.number.format(oh, 2)
                  + $ext.number.format(om, 2);
              break;

            case "j": // Day of the year as a zero-padded decimal number.
              d_str += $ext.number.format(this.getDayOfYear(date), 3);
              break;

            case "U": // Week number of the year (Sunday as the first day).
              d_str += $ext.number.format(this.getWeek(date), 2);
              break;

            case "W": // Week number of the year (Monday as the first day).
              d_str += $ext.number.format(this.getWeekM(date), 2);
              break;

            case "c": // Locale's appropriate date and time representation.
              d_str += date.toString();
              break;

            case "x": // Locale's appropriate date representation.
              d_str += date.toDateString();
              break;

            case "X": // Locale's appropriate time representation.
              d_str += date.toTimeString();
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
    }
  }
});
