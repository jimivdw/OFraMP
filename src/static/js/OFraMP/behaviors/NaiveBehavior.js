function NaiveBehavior(oframp) {
  this.__init(oframp);
}

NaiveBehavior.prototype = {
  name: "Naive",

  showSelectionDetails: function(selection) {
    var _this = this;

    $ext.dom.clear(this.oframp.atomDetails);
    if(selection.length === 1) {
      var atom = selection[0];
    }

    var ts = document.createElement('span');
    ts.className = "title";
    if(atom) {
      var tn = document.createTextNode("Atom details");
    } else {
      var tn = document.createTextNode("Selection details");
    }
    ts.appendChild(tn);
    this.oframp.atomDetails.appendChild(ts);

    var sl = new AtomList(this.oframp.mv.molecule, selection);
    var cntr = sl.getCenterPoint();
    var s = sl.getSize();
    var c = this.oframp.getMoleculeCutout(cntr.x, cntr.y, s.w, s.h, 228, 130);
    this.oframp.atomDetails.appendChild(c);

    var dt = document.createElement('table');

    if(atom) {
      $ext.dom.addTableRow(dt, "ID", atom.id);
      $ext.dom.addTableRow(dt, "Element", atom.element);
      var cc = document.createElement('span');
      var charge = $ext.number.format(atom.charge, 1, 3);
      cc.appendChild(document.createTextNode(charge || "unknown"));
      $ext.dom.addTableRow(dt, "Charge", cc);
    } else {
      // Get the unparameterised atoms
      var uas = $ext.array.filter(selection, function(atom) {
        return atom.charge === undefined;
      });
      // Get the charge of all atoms
      var cs = $ext.array.map(selection, function(atom) {
        return atom.charge;
      });

      $ext.dom.addTableRow(dt, "Selection count", selection.length);
      $ext.dom.addTableRow(dt, "Unparameterised", uas.length);
      $ext.dom.addTableRow(dt, "Parameterised", selection.length - uas.length);
      var charge = $ext.number.format($ext.array.sum(cs), 1, 3);
      $ext.dom.addTableRow(dt, "Total charge", charge || "unknown");
    }

    this.oframp.atomDetails.appendChild(dt);

    if(atom) {
      var ced = document.createElement('div');
      ced.id = "charge_edit";
      ced.className = "border_box";
      ced.style.height = "0px";

      var cet = document.createElement('table');
      if(atom.isCharged()) {
        var ufb = document.createElement('button');
        ufb.id = "show_used_fragments";
        ufb.className = "border_box";
        ufb.appendChild(document.createTextNode("(" + atom.usedFragments.length
            + ") Show"));

        $ext.dom.onMouseClick(ufb, function() {
          _this.oframp.showUsedFragments(atom.usedFragments);
        }, $ext.mouse.LEFT);
      } else {
        var ufb = "-";
      }
      $ext.dom.addTableRow(cet, "Used fragments", ufb);
      var ceb = document.createElement('input');
      ceb.className = "border_box";
      ceb.value = $ext.number.format(atom.charge, 1, 3) || "";
      $ext.dom.addTableRow(cet, "New charge", ceb);

      var acb = document.createElement('button');
      acb.className = "border_box";
      acb.appendChild(document.createTextNode("Apply charge"));

      var ecb = document.createElement('button');
      ecb.className = "border_box";
      ecb.appendChild(document.createTextNode("Edit charge"));

      function toggleChargeEdit() {
        if(ced.style.visibility === "visible") {
          ced.style.height = "0px";
          ced.style.visibility = "hidden";
          $ext.dom.clear(ecb);
          ecb.appendChild(document.createTextNode("Edit charge"));
          _this.oframp.atomDetails.insertBefore(ecb, ffb);
        } else {
          ced.style.height = "";
          ced.style.visibility = "visible";
          $ext.dom.clear(ecb);
          ecb.appendChild(document.createTextNode("Cancel"));
          ced.appendChild(ecb);
        }
      }

      ced.appendChild(cet);
      ced.appendChild(acb);
      this.oframp.atomDetails.appendChild(ced);

      $ext.dom.onMouseClick(acb, function() {
        // TODO validate!
        atom.charge = ceb.value || undefined;
        $ext.dom.clear(cc);
        var charge = $ext.number.format(atom.charge, 1, 3);
        cc.appendChild(document.createTextNode(charge || "unknown"));
        _this.oframp.redraw();

        toggleChargeEdit();
      }, $ext.mouse.LEFT);
    }

    var msb = document.createElement('button');
    msb.className = "border_box";
    toggleSelectionEdit();
    toggleSelectionEdit();
    function toggleSelectionEdit() {
      if(_this.oframp.mv.isModifyingSelection) {
        _this.oframp.mv.isModifyingSelection = false;
        $ext.dom.clear(msb);
        msb.appendChild(document.createTextNode("Modify selection"));
      } else {
        _this.oframp.mv.isModifyingSelection = true;
        $ext.dom.clear(msb);
        msb.appendChild(document.createTextNode("Stop modifying selection"));
      }
    }

    var ffb = document.createElement('button');
    ffb.className = "border_box";
    ffb.appendChild(document.createTextNode("Find matching fragments"));

    if(atom) {
      this.oframp.atomDetails.appendChild(ecb);
      $ext.dom.onMouseClick(ecb, toggleChargeEdit, $ext.mouse.LEFT);
    }

    this.oframp.atomDetails.appendChild(msb);
    $ext.dom.onMouseClick(msb, toggleSelectionEdit, $ext.mouse.LEFT);

    if(this instanceof NaiveBehavior) {
      this.oframp.atomDetails.appendChild(ffb);
      $ext.dom.onMouseClick(ffb, function() {
        _this.oframp.getMatchingFragments();
      }, $ext.mouse.LEFT);
    }

    this.oframp.showSelectionDetails();
  },

  showRelatedFragments: function(fragments) {
    $ext.dom.clear(this.oframp.relatedFragments);
    this.oframp.relatedFragmentViewers = new Array();

    var ts = document.createElement('span');
    ts.className = "title";
    ts.appendChild(document.createTextNode("Found " + fragments.length
        + " fragments"));
    this.oframp.relatedFragments.appendChild(ts);

    if(fragments.length === 0) {
      var ep = document.createElement('p');
      var exp = "No matching fragments have been found, please ";
      if(this.oframp.mv.molecule.getSelected().length > 1) {
        exp += "select fewer atoms and try again.";
      } else {
        exp += "try selecting a different atom and search again";
      }
      ep.appendChild(document.createTextNode(exp));
      this.oframp.relatedFragments.appendChild(ep);
    }

    $ext.each(fragments, function(fragment, i) {
      var atoms = $ext.array.map(fragment.atoms, function(atom) {
        var orig = this.oframp.mv.molecule.atoms.get(atom.id);
        atom.element = orig.element;
        atom.x = orig.x;
        atom.y = orig.y;
        return atom;
      }, this);

      var bonds = $ext.array.map(fragment.bonds, function(bond) {
        return this.oframp.mv.molecule.bonds.get(bond.id).getJSON();
      }, this);

      var fc = document.createElement('div');
      fc.id = "fc_" + i;
      fc.className = "fragment";
      this.oframp.relatedFragments.appendChild(fc);

      var ab = document.createElement('button');
      ab.className = "border_box";
      ab.disabled = "disabled";
      ab.appendChild(document.createTextNode("Select fragment"));
      fc.appendChild(ab);

      var _this = this;
      var fv = new MoleculeViewer(this.oframp, "fragment_" + i, fc.id,
          228, 130);
      this.oframp.relatedFragmentViewers.push(fv);

      var load = function() {
        fv.molecule = new Molecule(fv, atoms, bonds, "TODO?");
        fv.molecule.bestFit();
        fv.redraw();
      };

      var ot = fv.canvas.offsetTop;
      var rb = this.oframp.relatedFragments.parentElement;
      var ph = rb.clientHeight;
      var pt = rb.scrollTop;
      if(ot < ph + pt && ot > pt) {
        load();
      } else {
        var callback = function() {
          if(fv.molecule || fv.overlayShowing) {
            return;
          }

          pt = rb.scrollTop;
          if(ot < ph + pt && ot > pt) {
            load();
            $ext.dom.removeEventListener(rb, "scroll", callback);
          }
        };
        $ext.dom.onScroll(rb, callback);
      }

      $ext.dom.onMouseClick(fv.canvas, function() {
        if(!fv.molecule) {
          return;
        }

        ab.disabled = "";

        if(_this.oframp.activeFragment && _this.oframp.activeFragment !== fv) {
          // Disable the currently active fragment's button
          _this.oframp.activeFragment.canvas.parentElement
              .getElementsByClassName("border_box")[0].disabled = "disabled";
        }
        _this.oframp.activeFragment = fv;

        var charges = {};
        $ext.each(atoms, function(atom) {
          charges[atom.id] = atom.charge;
        }, this);
        _this.oframp.mv.previewCharges(charges);
      }, $ext.mouse.LEFT);

      $ext.dom.onMouseClick(ab, function() {
        _this.oframp.mv.molecule.dehighlight(ATOM_STATUSES.preview);
        _this.oframp.mv.molecule.setSelected([]);

        var charges = {};
        $ext.each(atoms, function(atom) {
          charges[atom.id] = atom.charge;
        }, this);
        _this.oframp.mv.setCharges(charges);

        _this.oframp.selectionChanged();
        _this.oframp.redraw();

        _this.oframp.hideRelatedFragments();
      }, $ext.mouse.LEFT);
    }, this);

    this.oframp.showRelatedFragments();
  },

  showChargeFixer: function(atom, rem, charges) {
    var title = "Attempting to assign a new charge to an already charged atom";
    var content = document.createElement('div');
    var id = document.createElement('div');
    id.style.overflow = "hidden";
    id.style.marginBottom = "10px";

    var cd = document.createElement('div');
    cd.id = "molecule_cutout";
    cd.appendChild(this.oframp
        .getMoleculeCutout(atom.x, atom.y, 1, 1, 280, 160));
    id.appendChild(cd);

    var dd = document.createElement('div');
    dd.id = "charge_details";
    var dt = document.createElement('table');
    $ext.dom.addTableRow(dt, "Atom ID", atom.id);
    $ext.dom.addTableRow(dt, "Element", atom.element);
    $ext.dom.addTableRow(dt, "Current charge", $ext.number.format(atom.charge,
        1, 3));
    $ext.dom.addTableRow(dt, "Proposed charge", $ext.number.format(
        charges[atom.id], 1, 3));

    var rc = document.createElement('input');
    rc.disabled = "disabled";
    rc.value = $ext.number.format((atom.charge + charges[atom.id]) / 2, 1, 3);

    var ss = document.createElement('select');
    $ext.dom.addSelectOption(ss, "current", "Current value");
    $ext.dom.addSelectOption(ss, "other", "Other value");
    $ext.dom.addSelectOption(ss, "average", "Average value", true);
    $ext.dom.addSelectOption(ss, "custom", "Custom value");
    $ext.dom.addEventListener(ss, 'change', function() {
      rc.disabled = "disabled";
      var value = rc.value;
      switch(ss.value) {
        case "current":
          value = atom.charge;
          break;

        case "other":
          value = charges[atom.id];
          break;

        case "average":
          value = (atom.charge + charges[atom.id]) / 2;
          break;

        case "custom":
          rc.disabled = "";
          break;
      }
      rc.value = $ext.number.format(value, 1, 3);
    });

    $ext.dom.addTableRow(dt, "Solution", ss);
    $ext.dom.addTableRow(dt, "Resulting charge", rc);
    dd.appendChild(dt);
    id.appendChild(dd);
    content.appendChild(id);

    var rb = document.createElement('button');
    rb.appendChild(document.createTextNode("Apply charge"));
    content.appendChild(rb);

    var _this = this;
    $ext.dom.onMouseClick(rb, function() {
      atom.setCharge(parseFloat(rc.value) || undefined, "TODO");
      atom.resetHighlight();
      _this.oframp.hidePopup();

      var needsFix = false;
      rem.each(function(atom, i) {
        if(charges[atom.id]) {
          if(atom.charge) {
            this.showChargeFixer(atom, rem.slice(i + 1), charges);
            needsFix = true;
            return $ext.BREAK;
          } else {
            atom.setCharge(charges[atom.id], "TODO");
          }
        }
      }, _this);
      _this.oframp.redraw();

      var unpar = _this.oframp.mv.molecule.getUnparameterized();
      if(!needsFix) {
        _this.oframp.checkpoint();
        if(unpar.length === 0) {
          _this.parameterizationFinished();
        }
      }
    }, $ext.mouse.LEFT);
    this.oframp.showPopup(title, content);
  },

  parameterizationFinished: function() {
    alert("You're done! I don't know what should happen now...");
  }
};

NaiveBehavior.prototype = $ext.extend($ext.copy(Behavior.prototype),
    NaiveBehavior.prototype);
