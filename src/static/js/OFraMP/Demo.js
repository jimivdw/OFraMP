function Demo(oframp, step) {
  this.__init(oframp, step);
}

Demo.prototype = {
  oframp: undefined,
  overlay: undefined,
  isActive: false,
  currentStep: undefined,

  __init: function(oframp, step) {
    this.oframp = oframp;
    this.currentStep = step || 0;
    this.__initOverlay();
  },

  __initOverlay: function() {
    var overlay = document.createElement("div");
    overlay.id = "instruction_overlay";
    this.oframp.container.parentElement.appendChild(overlay);
    this.overlay = overlay;
  },

  start: function() {
    this.currentStep = 0;
    this.isActive = true;
    this.step0();
  },

  pause: function() {
    this.overlay.style.cssText = "";
    this.isActive = false;
  },

  resume: function() {
    this.currentStep -= 1;
    this.isActive = true;
    this.nextStep();
  },

  nextStep: function() {
    if(!this.isActive) {
      return;
    }

    this.currentStep += 1;
    var step = "step" + this.currentStep;
    if(this[step]) {
      this[step].call(this);
    } else {
      this.end();
    }
  },

  step0: function() {
    this.oframp.showInsertMoleculePopup();
    // TODO: random_molecule will be removed
    var td = ["load_oss", "random_molecule", "mds_submit", "new", "open",
        "snap", "save", "extra_controls_toggle"];
    $ext.each(td, function(id) {
      document.getElementById(id).disabled = "disabled";
    });
    this.nextStep();
  },

  end: function() {
    this.isActive = false;
    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";
    var td = ["new", "open", "snap", "save", "extra_controls_toggle"];
    $ext.each(td, function(id) {
      document.getElementById(id).disabled = "";
    });
    console.log("End of demo!");
  }
};
