$ext.extend($ext, {
  array: {
    /*
     * Get the minimum value of an Array.
     * 
     * From:
     * http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
     */
    min: function(arr) {
      return Math.min.apply(null, arr);
    },

    /*
     * Get the maximum value of an Array.
     * 
     * From:
     * http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
     */
    max: function(arr) {
      return Math.max.apply(null, arr);
    },

    /*
     * Get the sum of all values of an Array.
     */
    sum: function(arr) {
      var sum = 0;
      $ext.each(arr, function(e) {
        sum += e;
      });
      return sum;
    },

    /*
     * Get the average value in an Array.
     */
    avg: function(arr) {
      return this.sum(arr) / arr.length;
    },

    /*
     * Move the element at position i to the back of the Array.
     */
    toBack: function(arr, i) {
      var e = arr.splice(i, 1)[0];
      if(e === undefined)
        return arr.length;
      else
        return arr.push(e);
    },

    /*
     * Return an array, consisting of the results of applying a function f to
     * each entry of the current Array.
     * 
     * The parameter that will be provided to the function and can be used for
     * 'this' scoping.
     */
    map: function(arr, f, scope) {
      var r = Array();
      $ext.each(arr, function(e, i) {
        r.push(f.call(scope, e, i));
      });
      return r;
    },

    /*
     * Reverse slice, returns the opposite of what slice returns.
     */
    rslice: function(arr, i) {
      var r = Array();
      for( var j = 0; j < i; j++) {
        r.push(arr[j]);
      }
      return r;
    }
  }
});
