function SmartDemo(oframp, step) {
  this.__init(oframp, step);
}

SmartDemo.prototype = {
  step0: function() {
    console.warn("NOT YET IMPLEMENTED");
  }
};

SmartDemo.prototype = $ext.extend($ext.copy(Demo.prototype),
    SmartDemo.prototype);
