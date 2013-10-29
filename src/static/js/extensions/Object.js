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

Object.prototype.copy = function() {
  return this.merge({}, true);
};

// Based on:
// http://stackoverflow.com/questions/8730262/extract-keys-from-javascript-object-and-use-as-variables
Object.prototype.extract = function(tgt) {
  for( var k in this) {
    tgt[k] = this[k];
  }
};

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
