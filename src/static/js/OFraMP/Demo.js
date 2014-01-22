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
    this.nextStep();
  },

  step1: function() {
    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";
    this.overlay.style.top = "150px";
    this.overlay.style.left = "50%";
    this.overlay.style.width = "120px";
    this.overlay.style.marginLeft = "-410px";
    this.overlay.style.paddingBottom = "34px";
    this.overlay.style.background = "url('static/img/demo/arrow_right.png') bottom right no-repeat";

    $ext.dom.addText(this.overlay, "You insert your molecule data here");

    var mi = document.getElementById("mds_input");
    $ext.dom.addClass(mi, "highlighted");
    $ext.dom.addEventListener(mi, "click", mdsChanged);

    var _this = this;
    function mdsChanged() {
      mi.disabled = "disabled";
      // TODO: better molecule
      $ext.dom.addText(mi, "CNc1ccc(CN)cc1");
      $ext.dom.removeClass(mi, "highlighted");
      $ext.dom.removeEventListener(mi, "click", mdsChanged);
      _this.nextStep();
    }
  },

  step2: function() {
    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";
    this.overlay.style.bottom = "35px";
    this.overlay.style.left = "50%";
    this.overlay.style.marginLeft = "-220px";
    this.overlay.style.paddingTop = "15px";
    this.overlay.style.paddingRight = "50px";
    this.overlay.style.background = "url('static/img/demo/arrow_up.png') top right no-repeat";

    $ext.dom.addText(this.overlay,
        "We will use this molecule for the demo, now click 'Submit'");

    var ms = document.getElementById("mds_submit");
    $ext.dom.addClass(ms, "highlighted");
    $ext.dom.addEventListener(ms, "click", mdsSubmit);

    var _this = this;
    function mdsSubmit() {
      $ext.dom.removeClass(ms, "highlighted");
      $ext.dom.removeEventListener(ms, "click", mdsSubmit);
      _this.nextStep();
    }
  },

  end: function() {
    this.isActive = false;
    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";
    alert("End of demo!");
  }
};
