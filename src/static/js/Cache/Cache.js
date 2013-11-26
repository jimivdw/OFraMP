function Cache(name) {
  this.init(name);
}

Cache.prototype = {
  init: function(name) {
    this.name = name;
    this.__value = undefined;
    this.__dependencies = new Array();
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
      if(this.__dependencies && !this.__checkDependencies()) {
        return this.clear();
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
    return $ext.each(this.__subcaches, function(c) {
      if(c.name === name) {
        return c;
      }
    });
  },

  __checkDependencies: function() {
    var clean = $ext.each(this.__dependencies, function(d) {
      if(this.__ts <= d.__ts) {
        return false;
      }
      if(!d.__checkDependencies()) {
        return false;
      }
    }, this);
    return clean === false ? false : true;
  },

  set: function(k, v, dependencies) {
    if(k && k.length > 0) {
      var parts = k.split(".");
      var c = this.__createSubCache(parts[0]);
      c.set(parts.splice(1).join("."), v, dependencies);
    } else {
      this.__value = v;
      if(dependencies && dependencies.length > 0) {
        this.__dependencies = dependencies;
      } else if(dependencies) {
        this.__dependencies = [dependencies];
      }
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
      $ext.each(this.__subcaches, function(c) {
        c.clear();
      });
    }

    this.touch();
    return c;
  }
};
