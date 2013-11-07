$ext.extend($ext, {
  object: {
    /*
     * Extrapolate all keys from an object.
     */
    extrapolate: function(obj) {
      var r = {};
      $ext.each(obj, function(_, k) {
        var parts = k.split(",");
        if(parts.length > 1) {
          $ext.each(parts, function(part) {
            part = part.trim();
            if(r[part]) {
              $ext.merge(r[part], obj[k]);
            } else {
              r[part] = $ext.copy(obj[k]);
            }
          });
        } else {
          if(typeof obj[k] === "object") {
            var e = $ext.object.extrapolate(obj[k]);
            if(r[k]) {
              $ext.merge(r[k], e);
            } else {
              r[k] = e;
            }
          } else {
            r[k] = obj[k];
          }
        }
      });

      return r;
    }
  }
});
