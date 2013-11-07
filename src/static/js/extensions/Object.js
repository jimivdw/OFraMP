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
          $ext.merge(r[part], obj[k]);
        } else {
          r[part] = $ext.copy(obj[k]);
        }
      });
    } else {
      if(typeof obj[k] === "object") {
        var e = extrapolate(obj[k]);
        if(r[k]) {
          $ext.merge(r[k], e);
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
