function NaiveDemo(oframp, step) {
  this.__init(oframp, step);
}

NaiveDemo.prototype = {
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

  step3: function() {
    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    $ext.dom.addEventListener(this.oframp.container, "moleculedisplayed",
        moleculeDisplayed);

    var _this = this;
    function moleculeDisplayed() {
      $ext.dom.removeEventListener(_this.oframp.container, "moleculedisplayed",
          moleculeDisplayed);

      _this.overlay.style.top = "30px";
      _this.overlay.style.left = "30px";
      _this.overlay.style.width = "220px";
      _this.overlay.style.paddingBottom = "30px";
      _this.overlay.style.background = "url('static/img/demo/mouse_drag_left.png') bottom center no-repeat";

      $ext.dom.addText(_this.overlay,
          "You can now move around the molecule by "
              + "holding down the left mouse button and dragging it");

      $ext.dom.onMouseDrag(_this.oframp.container, null, $ext.mouse.LEFT);
      $ext.dom.onMouseDragEnd(_this.oframp.container, moleculeMoved,
          $ext.mouse.LEFT);
    }

    function moleculeMoved() {
      if(_this.currentStep !== 3) {
        // TODO: check if we can remove the listener rather than doing this.
        return;
      }

      _this.nextStep();
    }
  },

  step4: function() {
    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.top = "30px";
    this.overlay.style.right = "30px";
    this.overlay.style.width = "220px";

    $ext.dom.addText(this.overlay, "You can now zoom the molecule by "
        + "using your mouse's scrollwheel");

    $ext.dom.onMouseWheel(this.oframp.container, null);
    $ext.dom.onMouseWheelEnd(this.oframp.container, moleculeZoomed);

    var _this = this;
    function moleculeZoomed() {
      if(_this.currentStep !== 4) {
        // TODO: check if we can remove the listener rather than doing this.
        return;
      }

      _this.nextStep();
    }
  },
};

NaiveDemo.prototype = $ext.extend($ext.copy(Demo.prototype),
    NaiveDemo.prototype);
