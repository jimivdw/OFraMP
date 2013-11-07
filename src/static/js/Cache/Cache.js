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
    this.__value = undefined;
    this.__dependent = undefined;
    this.__ts = new Date();
    this.__subcaches = new Array();
  },

  touch: function() {
    this.__ts = new Date();
  },

  get: function(k) {
    if(k && k.length > 0) {
      var parts = k.split(".");
      var c = this.__getSubCache(parts[0]);
      if(c) {
        return c.get(parts.splice(1).join("."));
      }
    } else {
      if(this.__dependent && this.__ts < this.__dependent.__ts) {
        this.clear();
      }
      return this.__value;
    }
  },

  getCache: function(name) {
    if(name && name.length > 0) {
      var parts = name.split(".");
      var c = this.__createSubCache(parts[0]);
      return c.getCache(parts.splice(1).join("."));
    }
    return this;
  },

  __getSubCache: function(name) {
    return this.__subcaches.each(function(c) {
      if(c.name === name) {
        return c;
      }
    });
  },

  set: function(k, v, dependent) {
    if(k && k.length > 0) {
      var parts = k.split(".");
      var c = this.__createSubCache(parts[0]);
      c.set(parts.splice(1).join("."), v, dependent);
    } else {
      this.__value = v;
      this.__dependent = dependent;
    }
    this.touch();
    return this;
  },

  __createSubCache: function(name) {
    var c = this.__getSubCache(name);
    if(c) {
      return c;
    }

    var c = new Cache(name);
    this.__subcaches.push(c);
    return c;
  },

  clear: function(name) {
    if(name && name.length > 0) {
      var parts = name.split(".");
      var c = this.__getSubCache(parts[0]);
      if(c) {
        c.clear(parts.splice(1).join("."));
      }
    } else {
      delete this.__value;
      this.__subcaches.each(function(c) {
        c.clear();
      });
    }

    this.touch();
    return c;
  }
};
