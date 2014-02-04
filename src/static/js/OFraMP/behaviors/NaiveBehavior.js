function NaiveBehavior(oframp) {
  this.__init(oframp);
}

NaiveBehavior.prototype = {
  name: "Naive",

  relatedFragmentViewers: undefined,
  activeFragment: undefined,

  __init: function(oframp) {
    this.oframp = oframp;

    var _this = this;
    $ext.dom.addEventListener(oframp.container, 'fragmentsgenerated',
        function() {
          var ffb = document.getElementById("find_fragments");
          $ext.dom.clear(ffb);
          ffb.appendChild(document.createTextNode("Find fragments"));
          oframp.selectionChanged();

          $ext.dom.onMouseClick(ffb, function() {
            // Make sure the previewed charges are reset.
            oframp.mv.previewCharges({});
            oframp.getMatchingFragments();
          }, $ext.mouse.LEFT);
        });
  },

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
    this.oframp.atomDetails.appendChild(dt);

    if(atom) {
      $ext.dom.addTableRow(dt, atom.id, "ID");
      $ext.dom.addTableRow(dt, atom.getLabel(), "Element");
      var cc = document.createElement('span');
      var charge = $ext.number.format(atom.getCharge(), 1, 3, 9);
      cc.appendChild(document.createTextNode(charge || "unknown"));
      $ext.dom.addTableRow(dt, cc, "Charge");
    } else {
      // Get the unparameterised atoms
      var uas = $ext.array.filter(selection, function(atom) {
        return !atom.isCharged();
      });
      // Get the charge of all atoms
      var cs = $ext.array.map(selection, function(atom) {
        return atom.charge;
      });
      var charge = $ext.number.format($ext.array.sum(cs), 1, 3, 9);
      var cc = document.createElement("span");
      $ext.dom.addText(cc, charge || "unknown");

      $ext.dom.addTableRow(dt, selection.length, "Selection count");
      $ext.dom.addTableRow(dt, uas.length, "Unparameterised");
      $ext.dom.addTableRow(dt, selection.length - uas.length, "Parameterised");
      $ext.dom.addTableRow(dt, cc, "Total charge");

      var sadl = document.createElement("table");
      sadl.id = "selected_atom_details";
      sadl.style.display = "none";
      $ext.dom.addTableRow(sadl, [], ["Elem", "ID", "Charge", ""]);
      $ext.each(selection, function(atom) {
        var cei = document.createElement('input');
        cei.disabled = "disabled";
        cei.value = $ext.number.format(atom.charge, 1, 3, 9) || "";

        var ceb = document.createElement("button");
        ceb.className = "border_box";
        $ext.dom.addText(ceb, "Edit");
        $ext.dom.onMouseClick(ceb, function() {
          $ext.dom.clear(ceb);
          if(cei.disabled) {
            cei.disabled = "";
            $ext.dom.addText(ceb, "Apply");
          } else {
            if(cei.value && !$ext.number.isNumeric(cei.value)) {
              alert("Only numeric values are allowed for the atom charge.");
              return;
            }

            var oldCharge = atom.charge;
            var newCharge = parseFloat(cei.value) || undefined;
            atom.setCharge(newCharge);
            if(oldCharge !== newCharge) {
              var cs = $ext.array.map(selection, function(atom) {
                return atom.charge;
              });
              var charge = $ext.number.format($ext.array.sum(cs), 1, 3, 9);
              $ext.dom.clear(cc);
              $ext.dom.addText(cc, charge || "undefined");
              _this.oframp.redraw();
              _this.oframp.checkpoint();
            }
            cei.disabled = "disabled";
            $ext.dom.addText(ceb, "Edit");
          }
        }, $ext.mouse.LEFT);

        $ext.dom.addTableRow(sadl, [atom.element, atom.id, cei, ceb]);
      });
      this.oframp.atomDetails.appendChild(sadl);

      var satb = document.createElement("button");
      satb.className = "border_box";
      $ext.dom.addText(satb, "Show");
      $ext.dom.onMouseClick(satb, function() {
        $ext.dom.clear(satb);
        if(sadl.style.display === "table") {
          sadl.style.display = "none";
          $ext.dom.addText(satb, "Show");
        } else {
          sadl.style.display = "table";
          $ext.dom.addText(satb, "Hide");
        }
      }, $ext.mouse.LEFT);
      $ext.dom.addTableRow(dt, satb, "Selected atoms");
    }

    if(atom) {
      var ced = document.createElement('div');
      ced.id = "charge_edit";
      ced.className = "border_box";
      ced.style.height = "0px";

      var cet = document.createElement('table');
      if(atom.usedFragments.length > 0) {
        var ufb = document.createElement('button');
        ufb.id = "show_used_fragments";
        ufb.className = "border_box";
        ufb.appendChild(document.createTextNode("(" + atom.usedFragments.length
            + ") Show"));

        $ext.dom.onMouseClick(ufb, function() {
          _this.oframp.showUsedFragments(atom);
        }, $ext.mouse.LEFT);
      } else {
        var ufb = "-";
      }
      $ext.dom.addTableRow(cet, ufb, "Used fragments");
      var ceb = document.createElement('input');
      ceb.className = "border_box";
      ceb.value = $ext.number.format(atom.charge, 1, 3, 9) || "";
      $ext.dom.addTableRow(cet, ceb, "New charge");

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
        if(ceb.value && !$ext.number.isNumeric(ceb.value)) {
          alert("Only numeric values are allowed for the atom charge.");
          return;
        }

        var oldCharge = atom.charge;
        var newCharge = parseFloat(ceb.value) || undefined;
        atom.setCharge(newCharge);
        if(oldCharge !== newCharge) {
          $ext.dom.clear(cc);
          var charge = $ext.number.format(atom.getCharge(), 1, 3, 9);
          cc.appendChild(document.createTextNode(charge || "unknown"));
          _this.oframp.redraw();
          _this.oframp.checkpoint();
        }

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
      if(!this.oframp.off) {
        ffb.disabled = "disabled";
      }
      $ext.dom.onMouseClick(ffb, function() {
        _this.oframp.getMatchingFragments();
      }, $ext.mouse.LEFT);
    }

    this.oframp.showSelectionDetails();
  },

  showRelatedFragments: function(fragments, selectionIDs) {
    $ext.dom.clear(this.oframp.relatedFragments);
    this.relatedFragmentViewers = new Array();

    var ts = document.createElement('span');
    ts.className = "title";
    if(fragments.length > 100) {
      var title = "Found 100+ fragments";
    } else {
      var title = "Found " + fragments.length + " fragments";
    }
    ts.appendChild(document.createTextNode(title));
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

    var rightBar = this.oframp.relatedFragments.parentElement;
    var barHeight = rightBar.clientHeight;
    $ext.each(fragments, function(fragment, i) {
      var atoms = $ext.array.map(fragment.atoms, function(atom) {
        var orig = this.oframp.mv.molecule.atoms.get(atom.id);
        atom.element = orig.element;
        atom.x = orig.x;
        atom.y = orig.y;
        return atom;
      }, this);

      var aids = $ext.array.map(fragment.atoms, function(atom) {
        return atom.id;
      });
      var abs = this.oframp.mv.molecule.bonds.filter(function(bond) {
        return aids.indexOf(bond.a1.id) !== -1 && aids.indexOf(bond.a2.id) !== -1;
      });
      var bonds = $ext.array.map(abs, function(bond) {
        return bond.getJSON();
      });

      var fc = document.createElement('div');
      fc.id = "fc_" + i;
      fc.className = "fragment";
      this.oframp.relatedFragments.appendChild(fc);

      var ob = document.createElement('button');
      ob.className = "show_original border_box";
      ob.disabled = "disabled";
      ob.appendChild(document.createTextNode("Show molecule"));
      fc.appendChild(ob);

      var ab = document.createElement('button');
      ab.className = "select_fragment border_box";
      ab.disabled = "disabled";
      ab.appendChild(document.createTextNode("Select fragment"));
      fc.appendChild(ab);

      var _this = this;
      var fv = new MoleculeViewer(this.oframp, "fragment_" + i, fc.id,
          228, 130);
      this.relatedFragmentViewers.push(fv);
      if(fragment.hasOverlap) {
        fv.canvas.className += "overlapping";
      }

      var load = function() {
        fv.molecule = new Molecule(fv, atoms, bonds);
        fv.molecule.setSelected($ext.array.map(selectionIDs, function(id) {
          return fv.molecule.atoms.get(id);
        }));
        fv.molecule.bestFit();
        fv.redraw();
      };

      if(i * 150 < barHeight) {
        load();
      } else {
        var callback = function() {
          if(fv.molecule || fv.overlayShowing) {
            return;
          }

          var ot = $ext.dom.totalOffsetTop(fv.canvas);
          var ph = rightBar.clientHeight;
          var pt = rightBar.scrollTop;
          if(ot < ph + pt && ot > pt) {
            load();
            $ext.dom.removeEventListener(rightBar, "scroll", callback);
          }
        };
        $ext.dom.onScroll(rightBar, callback);
      }

      $ext.dom.onMouseClick(fv.canvas, function() {
        if(!fv.molecule) {
          return;
        }

        ob.disabled = "";
        ab.disabled = "";

        if(_this.activeFragment && _this.activeFragment !== fv) {
          // Disable the currently active fragment's buttons
          _this.activeFragment.canvas.parentElement
          .getElementsByClassName("border_box")[0].disabled = "disabled";
          _this.activeFragment.canvas.parentElement
          .getElementsByClassName("border_box")[1].disabled = "disabled";
        }
        _this.activeFragment = fv;

        var charges = {};
        $ext.each(atoms, function(atom) {
          charges[atom.id] = atom.charge;
        }, this);
        _this.oframp.mv.previewCharges(charges);
      }, $ext.mouse.LEFT);

      var oids = $ext.array.map(fragment.atoms, function(atom) {
        return atom.other_id;
      });
      $ext.dom.onMouseClick(ob, function() {
        var title = "Fragment molecule (ATB ID: " + fragment.atb_id + ")";
        var content = document.createElement('div');

        var ov = new MoleculeViewer(_this.oframp, "original_" + i, content,
            580, _this.oframp.popup.clientHeight - 100);
        ov.showMolecule(fragment.atb_id, function() {
          this.setupInteraction();
          this.molecule.centerOnAtom(this.molecule.atoms.get(oids[0]));
          var oas = $ext.array.map(oids, function(oid) {
            return this.molecule.atoms.get(oid);
          }, this);
          this.molecule.setSelected(oas);
          this.hideOverlay();
          this.redraw();
        }, null, true);
        ov.canvas.className = "border_box";

        var cb = document.createElement('button');
        cb.appendChild(document.createTextNode("Close"));
        content.appendChild(cb);

        $ext.dom.onMouseClick(cb, function() {
          _this.oframp.hidePopup();
        }, $ext.mouse.LEFT);

        _this.oframp.showPopup(title, content);
      }, $ext.mouse.LEFT);

      $ext.dom.onMouseClick(ab, function() {
        _this.oframp.mv.molecule.dehighlight(ATOM_STATUSES.preview);
        _this.oframp.mv.molecule.setSelected([]);

        var charges = {};
        $ext.each(atoms, function(atom) {
          charges[atom.id] = atom.charge;
        }, this);
        if(_this.oframp.mv.setCharges(charges, fragment)) {
          _this.oframp.checkpoint();
        }

        _this.oframp.selectionChanged();
        _this.oframp.redraw();

        _this.oframp.hideRelatedFragments();
      }, $ext.mouse.LEFT);

      // It makes no sense to show more than 100 fragments
      if(i === 100) {
        return $ext.BREAK;
      }
    }, this);

    this.oframp.showRelatedFragments();
  },

  showChargeFixer: function(atom, rem, charges, fragment) {
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
    $ext.dom.addTableRow(dt, atom.id, "Atom ID");
    $ext.dom.addTableRow(dt, atom.element, "Element");
    $ext.dom.addTableRow(dt, $ext.number.format(atom.getCharge(), 1, 3, 9),
        "Current charge");
    $ext.dom.addTableRow(dt, $ext.number.format(
        atom.getPreviewCharge(), 1, 3, 9), "Proposed charge");

    var rc = document.createElement('input');
    rc.disabled = "disabled";
    rc.value = $ext.number.format(
        (atom.getCharge() + atom.getPreviewCharge()) / 2, 1, 3, 9);

    var ss = document.createElement('select');
    $ext.dom.addSelectOption(ss, "current", "Current value");
    $ext.dom.addSelectOption(ss, "other", "Other value");
    $ext.dom.addSelectOption(ss, "average", "Average value", true);
    if(this.oframp.settings.atom.showHAtoms ||
        atom.getHydrogenAtoms().length === 0) {
      $ext.dom.addSelectOption(ss, "custom", "Custom value");
    } // TODO maybe add some slider-like thing for old:new ratio otherwise?
    $ext.dom.addEventListener(ss, 'change', function() {
      rc.disabled = "disabled";
      var value = rc.value;
      switch(ss.value) {
        case "current":
          value = atom.getCharge();
          break;

        case "other":
          value = atom.getPreviewCharge();
          break;

        case "average":
          value = (atom.getCharge() + atom.getPreviewCharge()) / 2;
          break;

        case "custom":
          rc.disabled = "";
          break;
      }
      rc.value = $ext.number.format(value, 1, 3, 9);
    });

    $ext.dom.addTableRow(dt, ss, "Solution");
    $ext.dom.addTableRow(dt, rc, "Resulting charge");
    dd.appendChild(dt);
    id.appendChild(dd);
    content.appendChild(id);

    var rb = document.createElement('button');
    rb.appendChild(document.createTextNode("Apply charge"));
    content.appendChild(rb);

    function getResultingCharge(atom, method) {
      var value = rc.value;
      switch(method) {
        case "current":
          value = atom.charge;
          break;

        case "other":
          value = atom.previewCharge;
          break;

        case "average":
          value = (atom.charge + atom.previewCharge) / 2;
          break;
      }
      return parseFloat(value) || undefined;
    }

    var _this = this;
    $ext.dom.onMouseClick(rb, function() {
      atom.setCharge(getResultingCharge(atom, ss.value), fragment);
      if(!_this.oframp.settings.atom.showHAtoms) {
        $ext.each(atom.getHydrogenAtoms(), function(a) {
          a.setCharge(getResultingCharge(a, ss.value), fragment);
          a.resetHighlight();
        });
      }
      atom.resetHighlight();
      _this.oframp.hidePopup();

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
