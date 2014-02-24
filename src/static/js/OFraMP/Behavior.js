function Behavior(oframp) {
  this.__init(oframp);
}

Behavior.prototype = {
  oframp: undefined,

  name: undefined,

  __init: function(oframp) {
    this.oframp = oframp;
  },

  getJSON: function() {
    return {};
  },

  loadJSON: function(data) {
    return;
  },

  showSelectionDetails: function(selection) {
    throw "Not implemented";
  },

  showRelatedFragments: function(fragments) {
    throw "Not implemented";
  },

  selectionChanged: function() {
    return;
  },

  showChargeFixer: function(atom, rem, charges) {
    throw "Not implemented";
  },

  parameterizationFinished: function() {
    throw "Not implemented";
  }
};
