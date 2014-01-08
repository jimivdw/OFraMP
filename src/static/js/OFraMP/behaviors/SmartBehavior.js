function SmartBehavior(oframp) {
  this.__init(oframp);
}

SmartBehavior.prototype = $ext.extend($ext.copy(Behavior.prototype), {
  name: "Smart",

  __init: function(oframp) {
    this.oframp = oframp;
    var _this = this;
    $ext.dom.addEventListener(oframp.container, 'moleculedisplayed',
        function() {
          $ext.dom.remove(document.getElementById("find_fragments"));
          var ffb = document.createElement("button");
          ffb.id = "find_fragments";
          ffb.className = "border_box";
          ffb.appendChild(document.createTextNode("Start parameterising"));
          var cc = document.getElementById("canvas_container");
          oframp.container.insertBefore(ffb, cc);

          $ext.dom.onMouseClick(ffb, function() {
            _this.__selectAtom();
          }, 0);
        });
  },

  showSelectionDetails: function(selection) {
    NaiveBehavior.prototype.showSelectionDetails.call(this, selection);
  },

  __selectAtom: function() {
    var unpar = this.oframp.mv.molecule.atoms.getUnparameterised();
    this.oframp.getMatchingFragments([$ext.array.randomElement(unpar)]);
  },

  showRelatedFragments: function(fragments) {
    this.__fragments = fragments;

    if(document.getElementById("find_fragments")) {
      this.__initFCD();
    }

    this.__showFragment(0);
  },

  __initFCD: function() {
    $ext.dom.remove(document.getElementById("find_fragments"));

    var fcd = document.createElement("div");
    fcd.id = "fragment_controls";
    var cc = document.getElementById("canvas_container");
    this.oframp.container.insertBefore(fcd, cc);

    var afb = document.createElement("button");
    afb.id = "accept_fragment";
    afb.className = "border_box";
    afb.title = "Accept fragment";
    afb.style.backgroundImage = "url('static/img/check_mark.png')";
    fcd.appendChild(afb);
    this.__afb = afb;

    var rfb = document.createElement("button");
    rfb.id = "reject_fragment";
    rfb.className = "border_box";
    rfb.title = "Reject fragment";
    rfb.style.backgroundImage = "url('static/img/ballot_x.png')";
    fcd.appendChild(rfb);
    this.__rfb = rfb;

    var pfb = document.createElement("button");
    pfb.id = "previous_fragment";
    pfb.className = "border_box";
    pfb.title = "Previous fragment";
    pfb.style.backgroundImage = "url('static/img/undo.png')";
    fcd.appendChild(pfb);
    this.__pfb = pfb;

    var _this = this;
    $ext.dom.onMouseClick(afb, function() {
      _this.oframp.mv.setPreviewCharges();

      _this.oframp.selectionChanged();
      _this.oframp.redraw();

      _this.__selectAtom();
    }, 0);

    $ext.dom.onMouseClick(rfb, function() {
      if(!rfb.disabled) {
        _this.__showFragment(_this.__currentFragment + 1);
      }
    }, 0);

    $ext.dom.onMouseClick(pfb, function() {
      if(!pfb.disabled) {
        _this.__showFragment(_this.__currentFragment - 1);
      }
    }, 0);
  },

  __showFragment: function(i) {
    this.__currentFragment = i;
    var fragment = this.__fragments[i];
    if(!fragment) {
      if(confirm("No fragments were found, select a different atom?")) {
        this.__selectAtom();
      }
      return;
    }

    // TODO!!
    var fv = new MoleculeViewer(this.oframp, "fragment_x", "atom_details", 228,
        130);
    var _this = this;
    fv.showMolecule(fragment, function(molecule) {
      var m = _this.oframp.mv.molecule.find(molecule.dataStr.split(''))[0];
      var charges = {};
      $ext.each(m, function(atom, i) {
        charges[atom.id] = molecule.atoms.get(i + 1).charge;
      });
      _this.oframp.mv.previewCharges(charges);
    });

    if(this.__currentFragment === 0) {
      if(this.__fragments.length === 1) {
        this.__rfb.disabled = "disabled";
      } else {
        this.__rfb.disabled = "";
      }
      this.__pfb.disabled = "disabled";
    } else if(this.__currentFragment === this.__fragments.length - 1) {
      this.__rfb.disabled = "disabled";
      this.__pfb.disabled = "";
    } else {
      this.__rfb.disabled = "";
      this.__pfb.disabled = "";
    }
  },

  showChargeFixer: function(atom, rem, charges) {
    atom.charge = (atom.charge + charges[atom.id]) / 2;
    atom.previewCharge = undefined;
    atom.resetHighlight();

    rem.each(function(atom, i) {
      if(charges[atom.id]) {
        if(atom.charge) {
          this.showChargeFixer(atom, rem.slice(i + 1), charges);
          return $ext.BREAK;
        } else {
          atom.charge = charges[atom.id];
          atom.previewCharge = undefined;
        }
      }
    }, this);
  }
});
