/*
 * Get the maximum value of an Array.
 * 
 * From:
 * http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
 */
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

/*
 * Get the minimum value of an Array.
 * 
 * From:
 * http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
 */
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

/*
 * Get the sum of all values of an Array.
 */
Array.prototype.sum = function() {
  var sum = 0;
  this.each(function(e) {
    sum += e;
  });
  return sum;
};

/*
 * Get the average value in an Array.
 */
Array.prototype.avg = function() {
  return this.sum() / this.length;
};

/*
 * Move the element at position i to the back of the Array.
 */
Array.prototype.toBack = function(i) {
  var e = this.splice(i, 1)[0];
  if(e === undefined)
    return this.length;
  else
    return this.push(e);
};

/*
 * Apply a function f to each entry of an Array, as long as that function does
 * not return anyting.
 * 
 * The parameter that will be provided to the function and can be used for
 * 'this' scoping.
 */
Array.prototype.each = function(f, that) {
  for( var i = 0; i < this.length; i++) {
    var r = f(this[i], that);
    if(r !== undefined) {
      return r;
    }
  }
};

/*
 * Return an array, consisting of the results of applying a function f to each
 * entry of the current Array.
 * 
 * The parameter that will be provided to the function and can be used for
 * 'this' scoping.
 */
Array.prototype.mapF = function(f, that) {
  var r = Array();
  for( var i = 0; i < this.length; i++) {
    r.push(f(this[i], that));
  }
  return r;
};

/*
 * Reverse slice, returns the opposite of what slice returns.
 */
Array.prototype.rslice = function(i) {
  var r = Array();
  for( var j = 0; j < i; j++) {
    r.push(this[j]);
  }
  return r;
};
