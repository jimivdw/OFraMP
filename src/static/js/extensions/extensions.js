$ext = {
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
  each: function(obj, f, scope) {
    if(obj instanceof Array) {
      for( var i = 0; i < obj.length; i++) {
        var r = f.call(scope, obj[i], i);
        if(r === this.CONTINUE) {
          continue;
        } else if(r === this.BREAK) {
          break;
        } else if(r !== undefined) {
          return r;
        }
      }
    } else if(obj instanceof Object) {
      for( var k in obj) {
        if(Object.prototype[k] !== undefined) {
          continue;
        }

        var r = f.call(scope, obj[k], k);
        if(r === this.CONTINUE) {
          continue;
        } else if(r === this.BREAK) {
          break;
        } else if(r !== undefined) {
          return r;
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
    } else if(orig instanceof Object) {
      this.each(extension, function(v, k) {
        if(v !== undefined) {
          orig[k] = v;
        }
      });
      return orig;
    }
  },

  /*
   * Create a copy of an object.
   */
  copy: function(obj) {
    if(obj instanceof Array) {
      return this.extend([], obj);
    } else if(obj instanceof Object) {
      return this.extend({}, obj);
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
    } else if(orig instanceof Object) {
      this.each(extension, function(v, k) {
        if(typeof r[k] === 'object' && typeof v === 'object') {
          this.merge(r[k], v);
        } else {
          r[k] = v;
        }
      }, this);
      return r;
    }
  }
};