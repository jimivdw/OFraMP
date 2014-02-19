function NaiveDemo(oframp, step) {
  this.__init(oframp, step);
}

NaiveDemo.prototype = {
  step1: function() {
    var _this = this;

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
    var cbs = $ext.dom.onMouseClick(mi, function() {
      mi.disabled = "disabled";
      mi.value = "NCC(=O)CCO";
      $ext.dom.removeClass(mi, "highlighted");
      $ext.dom.removeEventListeners(mi, cbs);
      _this.nextStep();
    }, $ext.mouse.LEFT);
  },

  step2: function() {
    var _this = this;

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
    document.getElementById("mds_submit").disabled = "";

    var ms = document.getElementById("mds_submit");
    $ext.dom.addClass(ms, "highlighted");
    var cbs = $ext.dom.onMouseClick(ms, function() {
      $ext.dom.removeClass(ms, "highlighted");
      $ext.dom.removeEventListeners(ms, cbs);
      _this.nextStep();
    }, $ext.mouse.LEFT);
  },

  step3: function() {
    var _this = this;

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    $ext.dom.addEventListener(this.oframp.container, "moleculedisplayed",
        moleculeDisplayed);

    function moleculeDisplayed() {
      $ext.dom.removeEventListener(_this.oframp.container, "moleculedisplayed",
          moleculeDisplayed);

      _this.overlay.style.top = "30px";
      _this.overlay.style.left = "30px";
      _this.overlay.style.width = "220px";
      _this.overlay.style.paddingBottom = "30px";
      _this.overlay.style.background = "url('static/img/demo/mouse_drag_left.png') bottom center no-repeat";

      $ext.dom.addText(_this.overlay, "You can now move around the molecule "
          + "by holding down the left mouse button and dragging it");
      _this.oframp.mv.selectingDisabled = true;

      $ext.dom.onMouseDrag(_this.oframp.container, null, $ext.mouse.LEFT);
      var cbs = $ext.dom.onMouseDragEnd(_this.oframp.container, function() {
        $ext.dom.removeEventListeners(_this.oframp.container, cbs);
        _this.nextStep();
      }, $ext.mouse.LEFT);
    }
  },

  step4: function() {
    var _this = this;

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.top = "30px";
    this.overlay.style.right = "30px";
    this.overlay.style.width = "220px";

    $ext.dom.addText(this.overlay, "You can also zoom the molecule by "
        + "using your mouse's scrollwheel");

    var wcbs = $ext.dom.onMouseWheel(this.oframp.container, null);
    var cbs = $ext.dom.onMouseWheelEnd(this.oframp.container, function() {
      $ext.dom.removeEventListeners(_this.oframp.container, cbs);
      $ext.dom.removeEventListeners(_this.oframp.container, wcbs);
      _this.nextStep();
    });
  },

  step5: function() {
    var _this = this;

    if(this.oframp.off !== undefined) {
      return this.nextStep();
    }

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.bottom = "30px";
    this.overlay.style.left = "30px";
    this.overlay.style.width = "220px";

    $ext.dom.addText(this.overlay, "Fragments are still being generated, "
        + "please wait until this is done");

    $ext.dom.addEventListener(this.oframp.container, "fragmentsgenerated",
        fragmentsGenerated);
    function fragmentsGenerated() {
      $ext.dom.removeEventListener(_this.oframp.container,
          "fragmentsgenerated", fragmentsGenerated);
      _this.nextStep();
    }
  },

  step6: function() {
    var _this = this;

    if(this.oframp.mv.molecule.getSelected().length > 0) {
      return this.nextStep();
    }

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.bottom = "30px";
    this.overlay.style.right = "30px";
    this.overlay.style.width = "220px";

    $ext.dom.addText(this.overlay, "You can now select an atom by clicking "
        + "on it");
    _this.oframp.mv.selectingDisabled = false;

    $ext.dom.addEventListener(this.oframp.container, "selectionchanged",
        selectionChanged);
    function selectionChanged() {
      if(_this.oframp.mv.molecule.getSelected().length === 0) {
        return;
      }

      $ext.dom.removeEventListener(_this.oframp.container, "selectionchanged",
          selectionChanged);
      _this.oframp.mv.selectingDisabled = true;
      document.getElementById("find_fragments").disabled = "disabled";
      _this.nextStep();
    }
  },

  step7: function() {
    var _this = this;

    if(this.oframp.behavior.relatedFragmentViewers !== undefined) {
      return this.nextStep();
    }

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.top = "60px";
    this.overlay.style.right = "260px";
    this.overlay.style.width = "220px";
    this.overlay.style.paddingBottom = "34px";
    this.overlay.style.background = "url('static/img/demo/arrow_right.png') bottom right no-repeat";

    $ext.dom.addText(this.overlay, "The system is looking for fragments "
        + "that match your selection. They will appear here shortly");

    $ext.dom.addEventListener(this.oframp.container, "fragmentsfound",
        fragmentsFound);
    function fragmentsFound() {
      $ext.dom.removeEventListener(_this.oframp.container, "fragmentsfound",
          fragmentsFound);
      _this.nextStep();
    }
  },

  step8: function() {
    var _this = this;

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.top = "60px";
    this.overlay.style.right = "250px";
    this.overlay.style.width = "220px";
    this.overlay.style.paddingTop = "34px";
    this.overlay.style.background = "url('static/img/demo/arrow_right_2.png') top right no-repeat";

    $ext.dom.addText(this.overlay, "You can now preview fragments' charges "
        + "by clicking on them");

    var rf = document.getElementById("related_fragments");
    rf.parentElement.style.overflowY = "hidden";

    var cb = rf.children[0].getElementsByTagName("div")[0];
    cb.style.display = "none";

    var bd = document.createElement("div");
    bd.id = "fragments_block";
    bd.style.cssText = "position: absolute; width: 230px; height: 100%; "
        + "background-color: #FFF; z-index: 10; opacity: 0.5;";
    var f2 = document.getElementById("fc_1");
    rf.insertBefore(bd, f2);

    var frag = document.getElementById("fc_0");
    var cbs = $ext.dom.onMouseClick(frag, function() {
      $ext.dom.removeEventListeners(frag, cbs);
      _this.nextStep();
    }, $ext.mouse.LEFT);
  },

  step9: function() {
    var _this = this;

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.top = "60px";
    this.overlay.style.right = "250px";
    this.overlay.style.width = "220px";
    this.overlay.style.paddingBottom = "34px";
    this.overlay.style.background = "url('static/img/demo/arrow_right.png') bottom right no-repeat";

    $ext.dom.addText(this.overlay, "The molecule from which this fragment "
        + "originated can be shown by clicking the 'Show molecule' button");

    var smb = document.getElementById("fc_0").children[0];
    var sfb = document.getElementById("fc_0").children[1];
    $ext.dom.addClass(smb, "highlighted");
    sfb.disabled = "disabled";
    var cbs = $ext.dom.onMouseClick(smb, function() {
      $ext.dom.removeEventListeners(smb, cbs);
      $ext.dom.removeClass(smb, "highlighted");
      smb.disabled = "disabled";
      window.setTimeout(function() {
        // Wait a bit to make sure the popup is already opened
        _this.nextStep();
      }, 500);
    }, $ext.mouse.LEFT);
  },

  step10: function() {
    var _this = this;

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.bottom = "15px";
    this.overlay.style.left = "50%";
    this.overlay.style.width = "380px";
    this.overlay.style.marginLeft = "-260px";
    this.overlay.style.paddingTop = "15px";
    this.overlay.style.paddingLeft = "50px";
    this.overlay.style.background = "url('static/img/demo/arrow_up_2.png') top left no-repeat";

    $ext.dom.addText(this.overlay, "Once you have seen enough of this "
        + "molecule, you can close the viewer by clicking 'Close'");

    var cx = this.oframp.popupClose;
    var cbsx = $ext.dom.onMouseClick(cx, closeClicked, $ext.mouse.LEFT);

    var cb = this.oframp.popupContent.getElementsByTagName("button")[0];
    $ext.dom.addClass(cb, "highlighted");
    var cbs = $ext.dom.onMouseClick(cb, closeClicked, $ext.mouse.LEFT);

    function closeClicked() {
      $ext.dom.removeEventListeners(cb, cbs);
      $ext.dom.removeEventListeners(cx, cbsx);
      $ext.dom.removeClass(cb, "highlighted");
      _this.nextStep();
    }
  },

  step11: function() {
    var _this = this;

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.top = "60px";
    this.overlay.style.right = "250px";
    this.overlay.style.width = "220px";
    this.overlay.style.paddingBottom = "34px";
    this.overlay.style.background = "url('static/img/demo/arrow_right.png') bottom right no-repeat";

    $ext.dom.addText(this.overlay, "This fragment's charges can now be "
        + "applied by clicking the 'Select fragment' button");

    var rf = document.getElementById("related_fragments");
    var bd = document.getElementById("fragments_block");

    var smb = document.getElementById("fc_0").children[0];
    var sfb = document.getElementById("fc_0").children[1];
    $ext.dom.addClass(sfb, "highlighted");
    sfb.disabled = "";
    var cbs = $ext.dom.onMouseClick(sfb, function() {
      $ext.dom.removeEventListeners(sfb, cbs);
      $ext.dom.removeClass(sfb, "highlighted");
      rf.parentElement.style.overflowY = "";
      $ext.dom.remove(bd);
      smb.disabled = "";
      _this.nextStep();
    }, $ext.mouse.LEFT);
  },

  step12: function() {
    var _this = this;

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.bottom = "30px";
    this.overlay.style.left = "260px";
    this.overlay.style.width = "300px";
    _this.overlay.style.paddingTop = "30px";
    _this.overlay.style.background = "url('static/img/demo/mouse_drag_right.png') top center no-repeat";

    $ext.dom.addText(this.overlay, "It is also possible to select multiple "
        + "atoms at once by dragging with the right mouse button or holding "
        + "the Ctrl key while clicking atoms");
    _this.oframp.mv.selectingDisabled = false;

    $ext.dom.addEventListener(this.oframp.container, "selectionchanged",
        selectionChanged);
    function selectionChanged() {
      var selection = $ext.array.filter(_this.oframp.mv.molecule.getSelected(),
          function(atom) {
            return _this.oframp.settings.atom.showHAtoms
                || atom.element !== "H";
          });
      if(selection.length > 1) {
        $ext.dom.removeEventListener(_this.oframp.container,
            "selectionchanged", selectionChanged);
        document.getElementById("find_fragments").disabled = "disabled";
        _this.nextStep();
      }
    }
  },

  step13: function() {
    var _this = this;

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.top = "60px";
    this.overlay.style.right = "250px";
    this.overlay.style.width = "220px";
    this.overlay.style.paddingBottom = "34px";
    this.overlay.style.background = "url('static/img/demo/arrow_right.png') bottom right no-repeat";

    $ext.dom.addText(this.overlay, "It is usually a good idea to explore "
        + "different fragments to find the best match. Try comparing the "
        + "first two fragments");

    $ext.dom.addEventListener(this.oframp.container, "fragmentsfound",
        fragmentsFound);
    function fragmentsFound() {
      document.getElementById("find_fragments").disabled = "disabled";
      if(_this.oframp.behavior.relatedFragmentViewers.length === 0) {
        return;
      } else if(_this.oframp.behavior.relatedFragmentViewers.length === 1) {
        return _this.nextStep();
      }

      $ext.dom.removeEventListener(_this.oframp.container, "fragmentsfound",
          fragmentsFound);

      var bd = document.createElement("div");
      bd.style.cssText = "position: absolute; width: 230px; height: 100%; "
          + "background-color: #FFF; z-index: 10; opacity: 0.5;";

      var rf = document.getElementById("related_fragments");
      var f3 = document.getElementById("fc_2");
      rf.insertBefore(bd, f3);
      rf.parentElement.style.overflowY = "hidden";

      var cb = rf.children[0].getElementsByTagName("div")[0];
      cb.style.display = "none";

      var f1 = document.getElementById("fc_0");
      var cbs1 = $ext.dom.onMouseClick(f1, function() {
        f1.children[1].disabled = "disabled";
      }, $ext.mouse.LEFT);

      var frag = document.getElementById("fc_1");
      var cbs = $ext.dom.onMouseClick(frag, function() {
        $ext.dom.removeEventListeners(frag, cbs);
        $ext.dom.removeEventListeners(f1, cbs1);

        $ext.dom.remove(bd);
        rf.parentElement.style.overflowY = "auto";
        cb.style.display = "block";

        _this.nextStep();
      }, $ext.mouse.LEFT);
    }
  },

  step14: function() {
    var _this = this;

    if(this.oframp.mv.molecule.getUnparameterized().length === 0) {
      return this.nextStep();
    }

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    this.overlay.style.top = "50px";
    this.overlay.style.left = "50%";
    this.overlay.style.width = "500px";
    this.overlay.style.marginLeft = "-250px";

    $ext.dom.addText(this.overlay, "You can now continue to parameterise the "
        + "rest of the molecule");

    $ext.dom.addEventListener(this.oframp.container,
        "parameterizationfinished", parameterizationFinished);
    function parameterizationFinished() {
      $ext.dom.removeEventListener(_this.oframp.container,
          "parameterizationfinished", parameterizationFinished);
      _this.nextStep();
    }
  },

  step15: function() {
    var _this = this;

    $ext.dom.clear(this.overlay);
    this.overlay.style.cssText = "";

    var pc = document.getElementById("popup_content").children[0];
    var cd = pc.getElementsByTagName("div")[0];

    var ep = document.createElement("p");
    $ext.dom.addText(ep, "This concludes the guided demo. You can retake the "
        + "demo at any time by reloading the page and clicking the 'Demo' "
        + "button. A more extensive manual is available by clicking the "
        + "'Help' button in the menu at the top of the page.");
    pc.insertBefore(ep, cd);

    var cx = document.getElementById("popup").children[0];
    var cb = cd.children[2];
    var eb = cd.children[1];
    var cbs = $ext.dom.onMouseClick(cx, function() {
      $ext.dom.removeEventListeners(cx, cbs);
      _this.nextStep();
    }, $ext.mouse.LEFT);
    $ext.dom.onMouseClick(cb, function() {
      $ext.dom.removeEventListeners(cx, cbs);
      _this.nextStep();
    }, $ext.mouse.LEFT);
    $ext.dom.onMouseClick(eb, function() {
      $ext.dom.removeEventListeners(cx, cbs);
      _this.nextStep();
    }, $ext.mouse.LEFT);
  }
};

NaiveDemo.prototype = $ext.extend($ext.copy(Demo.prototype),
    NaiveDemo.prototype);
