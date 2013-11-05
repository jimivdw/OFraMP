function Cache(name) {
  this.init(name);
}

Object.defineProperty(Cache, 'DEPEND', {
  get: function() {
    return {};
  }
});

Cache.prototype = {
  init: function(name) {
    this.name = name;
    this.__subcaches = new Array();
    this.__values = new Object();
  },

  get: function(k) {
    var parts = k.split(".");
    if(parts.length > 1) {
      var c = this.__getSubCache(parts[0]);
      if(c) {
        return c.get(parts.splice(1).join("."));
      }
    } else {
      return this.__values[k];
    }
  },

  __getSubCache: function(name) {
    return this.__subcaches.each(function(c) {
      if(c.name === name) {
        return c;
      }
    });
  },

  set: function(k, v) {
    var parts = k.split(".");
    if(parts.length > 1) {
      var c = this.__createSubCache(parts[0]);
      c.set(parts.splice(1).join("."), v);
    } else {
      this.__values[k] = v;
    }
    return this;
  },

  __createSubCache: function(name) {
    if(this.__getSubCache(name)) {
      return this.__getSubCache(name);
    }

    var c = new Cache(name);
    this.__subcaches.push(c);
    return c;
  },

  clear: function(name) {
    if(name) {
      var parts = name.split(".");
      var c = this.__getSubCache(parts[0]);
      if(c) {
        c.clear(parts.splice(1).join("."));
      } else if(parts.length == 1) {
        delete this.__values[name];
      }
    } else {
      this.__values = Object();
      this.__subcaches.each(function(c) {
        c.clear();
      });
    }

    return c;
  }
};
