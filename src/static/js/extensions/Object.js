/*
 * Merge two objects, either destructive (modify the current object) or
 * nondestructive (return a new object that is the merge result).
 */
Object.prototype.merge = function(other, nondestructive) {
  if(nondestructive) {
    var r = {};
    for( var k in this)
      r[k] = this[k];
  } else {
    var r = this;
  }
  for( var k in other)
    r[k] = other[k];
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
  for( var k in this) {
    tgt[k] = this[k];
  }
};

/*
 * Show one level of an object.
 */
Object.prototype.show = function() {
  var s = "{";
  for( var k in this) {
    if(typeof this[k] != "function") {
      if(typeof this[k] == "object")
        d = "object";
      else
        d = this[k];
      s += k + ": " + d + ", ";
    }
  }
  return s.substr(0, s.length - 2) + "}";
};
