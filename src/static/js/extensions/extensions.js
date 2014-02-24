var ext = {
  /*
   * Identity function.
   */
  id: function(obj) {
    return obj;
  },

  BREAK: {
    $break: 'break'
  },
  CONTINUE: {
    $continue: 'continue'
  },

  /*
   * Apply a function f to each element in an Object, as long as that function
   * does not return anything.
   * 
   * The parameter scope will be provided to the function and can be used for
   * 'this' scoping.
   */
  each: function(obj, f, scope, recursive, recursive_key) {
    if(!obj) {
      return;
    }

    if(obj instanceof Array || (obj.length && obj[0])) {
      for( var i = 0; i < obj.length; i++) {
        var e = obj[i];
        var dk = recursive_key ? recursive_key + "." + i : i;
        if(e instanceof Array && recursive) {
          this.each(e, f, scope, recursive, dk);
        } else {
          var r = f.call(scope, e, dk);
          if(r === this.CONTINUE) {
            continue;
          } else if(r === this.BREAK) {
            break;
          } else if(r !== undefined) {
            return r;
          }
        }
      }
    } else if(obj instanceof Object || typeof obj === "object") {
      for( var k in obj) {
        if(Object.prototype[k] !== undefined) {
          continue;
        }

        var e = obj[k];
        var dk = recursive_key ? recursive_key + "." + k : k;
        if(!(e instanceof Array) && e instanceof Object && recursive) {
          this.each(e, f, scope, recursive, dk);
        } else {
          var r = f.call(scope, e, dk);
          if(r === this.CONTINUE) {
            continue;
          } else if(r === this.BREAK) {
            break;
          } else if(r !== undefined) {
            return r;
          }
        }
      }
    }
  },

  /*
   * Extend an object with a given extension.
   */
  extend: function(orig, extension) {
    if(orig instanceof Array) {
      return orig.concat(extension);
    } else if(orig instanceof Object || typeof orig === "object") {
      this.each(extension, function(v, k) {
        if(v !== undefined) {
          orig[k] = v;
        }
      }, this);
      return orig;
    }
  },

  /*
   * Create a copy of an object.
   */
  copy: function(obj) {
    if(obj instanceof Array) {
      return this.extend([], obj);
    } else if(obj instanceof Object || typeof obj === "object") {
      return this.extend({}, obj);
    }
  },

  /*
   * Create a deep copy of an object.
   */
  deepCopy: function(obj) {
    if(obj === null || typeof obj !== "object") {
      return obj;
    }

    if(obj instanceof Array) {
      var r = new Array();
      this.each(obj, function(v, i) {
        r[i] = this.deepCopy(v);
      }, this);
      return r;
    } else if(obj instanceof Object || typeof obj === "object") {
      var r = new Object();
      this.each(obj, function(v, k) {
        if(obj.hasOwnProperty(k)) {
          r[k] = this.deepCopy(v);
        }
      }, this);
      return r;
    }
  },

  /*
   * Merge two objects, either destructive (modify the current object) or
   * nondestructive (return a new object that is the merge result).
   */
  merge: function(orig, extension, nondestructive) {
    if(nondestructive) {
      var r = this.copy(orig);
    } else {
      var r = orig;
    }

    if(orig instanceof Array) {
      this.each(extension, function(v) {
        if(v !== undefined && r.indexOf(v) === -1) {
          r.push(v);
        }
      });
      return r;
    } else if(orig instanceof Object || typeof orig === "object") {
      this.each(extension, function(v, k) {
        if(typeof r[k] === 'object' && typeof v === 'object') {
          this.merge(r[k], v);
        } else {
          r[k] = v;
        }
      }, this);
      return r;
    }
  },

  /*
   * Send the given data using a form to the given action URL.
   * 
   * Based on http://stackoverflow.com/a/133997.
   */
  sendDataForm: function(action, data, method, target) {
    action = action || "";
    data = data || {};
    method = method || "get";
    target = target || "_self";

    var form = document.createElement("form");
    form.setAttribute("action", action);
    form.setAttribute("method", method);
    form.setAttribute("target", target);

    this.each(data, function(value, key) {
      var field = document.createElement("input");
      field.setAttribute("type", "hidden");
      field.setAttribute("name", key);
      field.setAttribute("value", value);

      form.appendChild(field);
    });

    document.documentElement.appendChild(form);
    form.submit();
    form.remove();
  },

  /*
   * Determine whether the user is using a broken IE browser (i.e. IE <= 8).
   */
  onBrokenIE: function() {
    return BrowserDetect.browser === "Explorer" && BrowserDetect.version < 9;
  },

  /*
   * Determine if the user is using Firefox.
   * 
   * Used to fix MouseEvent button problems.
   */
  onFirefox: function() {
    return BrowserDetect.browser === "Firefox";
  }
};

$ext = ext;
