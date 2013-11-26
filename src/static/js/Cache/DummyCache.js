function DummyCache(name) {
  this.init(name);
}

DummyCache.prototype = {
  init: function(name) {
    return
  },

  touch: function() {
    return;
  },

  get: function(k) {
    return;
  },

  getCache: function(name) {
    return;
  },

  set: function(k, v, dependencies) {
    return;
  },

  clear: function(name) {
    return;
  }
};
