function Demo(oframp, step) {
  this.__init(oframp, step);
}

Demo.prototype = {
  oframp: undefined,
  currentStep: undefined,
  overlay: undefined,

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
    this.step0();
  },

  nextStep: function() {
    this.currentStep += 1;
    var step = "step" + this.currentStep;
    if(this[step]) {
      this[step].call(this);
    } else {
      alert("End of demo!");
    }
  },

  step0: function() {
    this.nextStep();
  },

  step1: function() {
    this.oframp.showInsertMoleculePopup();
    this.overlay.appendChild(document.createTextNode("Input MDS here"));
    var ri = document.createElement('img');
    ri.src = "static/img/demo/arrow_right.png";
    this.overlay.appendChild(ri);

    this.overlay.style.top = "150px";
    this.overlay.style.left = "50%";
    this.overlay.style.width = "100px";
    this.overlay.style.marginLeft = "-400px";
    var mi = document.getElementById("mds_input");
    mi.className += "highlighted";
  }
};
