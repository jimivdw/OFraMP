/*
 * Merge two objects, either destructive (modify the current object) or
 * nondestructive (return a new object that is the merge result).
 */
Object.prototype.merge = function(other, nondestructive) {
  if(nondestructive) {
    var r = {};
    this.extract(r);
  } else {
    var r = this;
  }
  $ext.each(other, function(_, k) {
    if(typeof r[k] === 'object') {
      r[k].merge(other[k]);
    } else {
      r[k] = other[k];
    }
  });
  return r;
};

/*
 * Create a copy of an object.
 */
Object.prototype.copy = function() {
  return this.merge({}, true);
};

/*
 * Extract all key-value pairs of an object into another tgt object.
 */
Object.prototype.extract = function(tgt) {
  $ext.each(this, function(_, k) {
    tgt[k] = this[k];
  }, this);
};

/*
 * Show one level of an object.
 */
Object.prototype.show = function() {
  var s = "{";
  this.each(function(k, _this) {
    if(typeof _this[k] != "function") {
      if(typeof _this[k] == "object") {
        d = "object";
      } else {
        d = _this[k];
      }
      s += k + ": " + d + ", ";
    }
  }, this);
  return s.substr(0, s.length - 2) + "}";
};

/*
 * Extrapolate all keys from an object.
 */
extrapolate = function(obj) {
  var r = {};
  $ext.each(obj, function(_, k) {
    var parts = k.split(",");
    if(parts.length > 1) {
      $ext.each(parts, function(part) {
        part = part.trim();
        if(r[part]) {
          r[part].merge(obj[k]);
        } else {
          r[part] = obj[k].copy();
        }
      });
    } else {
      if(typeof obj[k] === "object") {
        var e = extrapolate(obj[k]);
        if(r[k]) {
          r[k].merge(e);
        } else {
          r[k] = e;
        }
      } else {
        r[k] = obj[k];
      }
    }
  });

  return r;
};
