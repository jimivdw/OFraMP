// From:
// http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

Array.prototype.avg = function() {
  return this.sum() / this.length;
};

Array.prototype.sum = function() {
  var sum = 0;
  this.each(function(e) {
    sum += e;
  });
  return sum;
};

Array.prototype.toBack = function(i) {
  var e = this.splice(i, 1)[0];
  if(e === undefined)
    return this.length;
  else
    return this.push(e);
};

Array.prototype.each = function(f, that) {
  for( var i = 0; i < this.length; i++) {
    var r = f(this[i], that);
    if(r !== undefined) {
      return r;
    }
  }
};

Array.prototype.rslice = function(i) {
  var r = Array();
  for(var j = 0; j < i; j++) {
    r.push(this[j]);
  }
  return r;
};
