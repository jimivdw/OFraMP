function Behavior(oframp) {
  this.__init(oframp);
}

Behavior.prototype = {
  oframp: undefined,

  name: undefined,

  __init: function(oframp) {
    this.oframp = oframp;
    console.log("Initializing", this.name, "behaviour...");
  },

  showSelectionDetails: function(selection) {
    throw "Not implemented";
  },

  showRelatedFragments: function(fragments) {
    throw "Not implemented";
  },

  showChargeFixer: function(atom, rem, charges) {
    throw "Not implemented";
  },

  parameterizationFinished: function() {
    throw "Not implemented";
  }
};
