function SmartBehavior(oframp) {
  this.__init(oframp);
}

SmartBehavior.prototype = {
  name: "Smart",

  __needle: undefined,
  __fragments: undefined,
  __currentFragment: undefined,

  __init: function(oframp) {
    this.oframp = oframp;
    var _this = this;
    $ext.dom.addEventListener(oframp.container, 'moleculedisplayed',
        function() {
          var fcd = document.getElementById("fragment_controls");
          var ffb = document.getElementById("find_fragments");
          if(ffb) {
            $ext.dom.remove(ffb);
          } else {
            if(fcd) {
              $ext.dom.clear(fcd);
            }
          }
          ffb = document.createElement("button");
          ffb.id = "find_fragments";
          ffb.className = "border_box";
          if(_this.oframp.off) {
            ffb.appendChild(document.createTextNode("Start parameterising"));
          } else {
            ffb.disabled = "disabled";
            ffb.appendChild(document.createTextNode("Loading fragments..."));
          }
          fcd.appendChild(ffb);

          _this.__fcd = fcd;
          _this.__ffb = ffb;

          $ext.dom.onMouseClick(ffb, function() {
            _this.__selectAtom();
          }, $ext.mouse.LEFT);
        });

    $ext.dom.addEventListener(oframp.container, 'fragmentsgenerated',
        function() {
          var ffb = document.getElementById("find_fragments");
          $ext.dom.clear(ffb);
          ffb.appendChild(document.createTextNode("Start parameterising"));
          ffb.disabled = "";
        });

    $ext.dom.addEventListener(oframp.container, 'historychanged', function() {
      if(!_this.__fcd || !_this.__ffb || !_this.__afb || !_this.__rfb
          || !_this.__vob) {
        return;
      }

      if(_this.oframp.mv.molecule.getUnparameterized().length > 0) {
        _this.__fcd.style.display = "block";
        if(_this.__needle === undefined) {
          _this.__ffb.style.display = "block";
          _this.__afb.style.display = "none";
          _this.__rfb.style.display = "none";
          _this.__vob.style.display = "none";
        } else {
          _this.__ffb.style.display = "none";
          _this.__afb.style.display = "block";
          _this.__rfb.style.display = "block";
          _this.__vob.style.display = "block";
        }
      } else {
        _this.__fcd.style.display = "none";
      }
    });
  },

  getJSON: function() {
    return {
      needle: this.__needle,
      fragments: this.__fragments,
      currentFragment: this.__currentFragment
    };
  },

  loadJSON: function(data) {
    this.__needle = data.needle;
    this.__fragments = data.fragments;
    this.__currentFragment = data.currentFragment;

    if(this.__needle !== undefined) {
      if(this.__currentFragment !== undefined) {
        this.__showFragment(this.__currentFragment);
      }
    } else {
      this.oframp.mv.molecule.center();
    }
    this.oframp.redraw();
  },

  showSelectionDetails: function(selection) {
    NaiveBehavior.prototype.showSelectionDetails.call(this, selection);
  },

  __selectAtom: function() {
    var unpar = this.oframp.mv.molecule.getUnparameterized();
    if(!unpar) {
      alert("Could not find any more unparameterised atoms.");
      return;
    }

    var needle = $ext.array.randomElement(unpar);
    if(this.__fragments && this.__fragments.length > 0) {
      var fragment = this.__fragments[this.__currentFragment];
      var ua = $ext.each(fragment.atoms, function(atom) {
        var orig = this.oframp.mv.molecule.atoms.get(atom.id);
        var ua = $ext.each(orig.getBondedAtoms(), function(ba) {
          if(unpar.indexOf(ba) !== -1) {
            return ba;
          }
        });
        if(ua) {
          return ua;
        }
      }, this);
      if(ua) {
        needle = ua;
      }
    }
    this.__needle = needle;
    this.oframp.mv.molecule.centerOnAtom(needle);
    this.oframp.getMatchingFragments([needle]);
  },

  showRelatedFragments: function(fragments) {
    this.__fragments = fragments;

    if(this.__ffb.style.display !== "none") {
      this.__initFCD();
    }

    this.__showFragment(0);
    if(this.__fragments.length > 0) {
      this.oframp.checkpoint();
    }
  },

  __initFCD: function() {
    this.__ffb.style.display = "none";

    var afb = document.createElement("button");
    afb.id = "accept_fragment";
    afb.className = "border_box";
    afb.title = "Accept fragment";
    afb.style.backgroundImage = "url('static/img/check_mark.png')";
    $ext.dom.addText(afb, "Accept");
    this.__fcd.appendChild(afb);
    this.__afb = afb;

    var rfb = document.createElement("button");
    rfb.id = "reject_fragment";
    rfb.className = "border_box";
    rfb.title = "Reject fragment";
    rfb.style.backgroundImage = "url('static/img/ballot_x.png')";
    $ext.dom.addText(rfb, "Reject");
    this.__fcd.appendChild(rfb);
    this.__rfb = rfb;

    var vob = document.createElement("button");
    vob.id = "view_original";
    vob.className = "border_box";
    vob.title = "View fragment in original molecule";
    $ext.dom.addText(vob, "View original");
    this.__fcd.appendChild(vob);
    this.__vob = vob;

    var _this = this;
    $ext.dom.onMouseClick(afb, function() {
      var cf = _this.__fragments[_this.__currentFragment];
      _this.oframp.mv.setPreviewCharges(cf);

      if(_this.oframp.mv.molecule.getUnparameterized().length > 0) {
        _this.__selectAtom();
      }
    }, $ext.mouse.LEFT);

    $ext.dom.onMouseClick(rfb, function() {
      if(!rfb.disabled) {
        _this.__showFragment(_this.__currentFragment + 1);
        _this.oframp.checkpoint();
      }
    }, $ext.mouse.LEFT);

    $ext.dom.onMouseClick(vob, function() {
      _this.oframp.showOriginal(_this.__fragments[_this.__currentFragment]);
    }, $ext.mouse.LEFT);
  },

  __showFragment: function(i) {
    this.__currentFragment = i;
    var fragment = this.__fragments[i];
    if(!fragment) {
      if(confirm("No fragments were found, select a different atom?")) {
        this.__selectAtom();
      } else {
        this.parameterizationFinished();
      }
      return;
    }

    var atoms = $ext.array.map(fragment.atoms, function(atom) {
      var orig = this.oframp.mv.molecule.atoms.get(atom.id);
      atom.element = orig.element;
      atom.x = orig.x;
      atom.y = orig.y;
      return atom;
    }, this);

    var charges = {};
    $ext.each(atoms, function(atom) {
      charges[atom.id] = atom.charge;
    }, this);
    this.oframp.mv.previewCharges(charges);

    if(this.__currentFragment === 0) {
      if(this.__fragments.length === 1) {
        this.__rfb.disabled = "disabled";
      } else {
        this.__rfb.disabled = "";
      }
    } else if(this.__currentFragment === this.__fragments.length - 1) {
      this.__rfb.disabled = "disabled";
    } else {
      this.__rfb.disabled = "";
    }
  },

  showChargeFixer: function(atom, rem, charges, fragment) {
    atom.setCharge((atom.charge + atom.previewCharge) / 2, fragment);
    if(!_this.oframp.settings.atom.showHAtoms) {
      $ext.each(atom.getHydrogenAtoms(), function(a) {
        a.setCharge((atom.charge + atom.previewCharge) / 2, fragment);
        a.resetHighlight();
      });
    }
    atom.resetHighlight();

    var needsFix = false;
    rem.each(function(atom, i) {
      if(charges[atom.id]) {
        if(atom.isCharged()) {
          if(this.oframp.settings.atom.showHAtoms || atom.element !== "H") {
            this.showChargeFixer(atom, rem.slice(i + 1), charges, fragment);
            needsFix = true;
            return $ext.BREAK;
          }
        } else {
          atom.setCharge(charges[atom.id], fragment);
          atom.resetHighlight();
        }
      }
    }, this);

    if(!needsFix) {
      if(this.oframp.mv.molecule.getUnparameterized().length == 0) {
        this.parameterizationFinished();
      }
    }
  },

  parameterizationFinished: function() {
    this.__needle = undefined;
    this.__fragments = undefined;
    this.__currentFragment = undefined;
    this.__fcd.style.display = "none";
    this.oframp.mv.molecule.center();
    this.oframp.checkpoint();
    alert("You're done! I don't know what should happen now...");
  }
};

SmartBehavior.prototype = $ext.extend($ext.copy(Behavior.prototype),
    SmartBehavior.prototype);
