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
     * Insert a given element at a position i.
     */
    insertAt: function(arr, i, e) {
      arr.splice(i, 0, e);
    },

    /*
     * Remove the element with a given value v from a given array arr.
     */
    remove: function(arr, v) {
      var i = arr.indexOf(v);
      if(i !== -1) {
        return this.removeI(arr, i);
      }
    },

    /*
     * Remove the item at position i from a given array arr.
     */
    removeI: function(arr, i) {
      return arr.splice(i, 1)[0];
    },

    /*
     * Return an array, consisting of the results of applying a function f to
     * each entry of the current Array.
     * 
     * The parameter that will be provided to the function and can be used for
     * 'this' scoping.
     * 
     * If recursive is set to true, the mapping will also be applied to the
     * array's subarrays.
     */
    map: function(arr, f, scope, recursive) {
      var r = Array();
      $ext.each(arr, function(e, i) {
        if(recursive && e instanceof Array) {
          r.push(this.map(e, f, scope, recursive));
        } else {
          r.push(f.call(scope, e, i));
        }
      }, this);
      return r;
    },

    /*
     * Return an array, consisting of only the elements in the given array arr
     * for which applying the function f to them returns true.
     * 
     * The parameter that will be provided to the function and can be used for
     * 'this' scoping.
     * 
     * If recursive is set to true, the filter will also be applied to the
     * array's subarrays.
     */
    filter: function(arr, f, scope, recursive) {
      var r = Array();
      $ext.each(arr, function(e, i) {
        if(recursive && e instanceof Array) {
          var rr = this.filter(e, f, scope, recursive);
          if(rr.length > 0) {
            r.push(rr);
          }
        } else {
          var m = f.call(scope, e, i);
          if(m === true) {
            r.push(e);
          }
        }
      }, this);
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
    },

    /*
     * Reduce an array to only its unique elements.
     */
    unique: function(arr) {
      var r = Array();
      $ext.each(arr, function(e) {
        if(r.indexOf(e) === -1) {
          r.push(e);
        }
      });
      return r;
    },

    /*
     * Flatten a multi-level array.
     */
    flatten: function(arr) {
      var r = Array();
      $ext.each(arr, function(e) {
        if(e instanceof Array) {
          r = r.concat(this.flatten(e));
        } else {
          r.push(e);
        }
      }, this);
      return r;
    },

    /*
     * See if an element e is contained in an array arr or any of its subarrays.
     */
    containsr: function(arr, e) {
      return this.flatten(arr).indexOf(e) !== -1;
    },

    /*
     * Convert an arbitrarily nested Array to a string with an optional string
     * conversion method for its elements.
     */
    toString: function(arr, f) {
      f = f || $ext.id;

      var r = "[";
      $ext.each(arr, function(e) {
        if(e instanceof Array) {
          r += this.toString(e, f);
        } else {
          r += f(e);
        }
        r += ", ";
      }, this);
      if(r.charAt(r.length - 2) === ',') {
        r = $ext.string.rslice(r, r.length - 2);
      }
      r += "]";
      return r;
    },

    /*
     * Get a random element from a given array.
     */
    randomElement: function(arr) {
      var i = Math.floor(Math.random() * arr.length);
      return arr[i];
    }
  }
});
