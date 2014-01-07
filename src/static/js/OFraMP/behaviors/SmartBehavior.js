function SmartBehavior(oframp) {
  this.__init(oframp);
}

SmartBehavior.prototype = $ext.extend($ext.copy(Behavior.prototype), {
  name: "Smart",

  test: function() {
    console.log("TEST SUCCEEDED");
  }
});
