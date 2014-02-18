var cookie = {
  getAll: function() {
    var co = {};
    $ext.each(document.cookie.split(';'), function(cp) {
      cp = cp.trim();
      var kv = cp.split('=');
      co[kv[0]] = kv[1];
    });
    return co;
  },

  get: function(name) {
    return this.getAll()[name];
  },

  set: function(name, value, expireDays) {
    if(expireDays) {
      var d = new Date();
      d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + d.toGMTString();
    } else {
      var expires = "";
    }
    document.cookie = name + "=" + value + expires;
  },

  remove: function(name) {
    name += "=";
    var d = new Date('1970-01-01');
    document.cookie = name + "; expires=" + d.toGMTString();
  }
};

$ext.extend($ext, {
  cookie: cookie
});
