function Demo(oframp, step) {
  this.init(oframp, step);
}

Demo.prototype = {
  oframp: undefined,
  currentStep: undefined,
  
  init: function(oframp, step) {
    this.oframp = oframp;
    this.currentStep = step || 0;
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
    this.oframp.showInsertMoleculePopup();
    this.nextStep();
  }
};
