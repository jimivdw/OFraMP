function OFraMP(containerID, settings) {
  this.__init(containerID, settings);
}

OFraMP.prototype = {
  container: undefined,
  settings: undefined,
  mv: undefined,
  settingsUI: undefined,

  atomDetails: undefined,
  relatedFragments: undefined,

  popup: undefined,
  popupTitle: undefined,
  popupContent: undefined,

  enterMoleculeButton: undefined,
  findFragmentsButton: undefined,

  relatedFragmentViewers: undefined,
  activeFragment: undefined,

  uiInitializedEvent: new Event('uiinitialized'),
  moleculeEnteredEvent: new Event('moleculeentered'),
  moleculeDisplayedEvent: new Event('moleculedisplayed'),

  __init: function(containerID, settings) {
    this.container = document.getElementById(containerID);
    this.settings = $ext.merge($ext.copy(DEFAULT_SETTINGS), settings);
    this.__initUI();
    this.showInsertMoleculePopup();
  },

  __initUI: function() {
    var lb = document.createElement('div');
    lb.id = "leftbar";
    lb.className = "sidebar border_box";
    lb.style.visibility = "hidden";
    this.container.appendChild(lb);
    this.__initAtomDetails(lb);

    var rb = document.createElement('div');
    rb.id = "rightbar";
    rb.className = "sidebar border_box";
    rb.style.visibility = "hidden";
    this.container.appendChild(rb);
    this.__initRelatedFragments(rb);

    this.popup = document.createElement('div');
    this.popup.id = "popup";
    this.popup.className = "border_box";
    this.popup.style.visibility = "hidden";
    this.container.appendChild(this.popup);
    this.__initPopup(this.popup);

    var emb = document.createElement('button');
    emb.id = "enter_molecule";
    emb.className = "border_box";
    emb.style.visibility = "hidden";
    this.container.appendChild(emb);
    this.__initEMB(emb);
    this.enterMoleculeButton = emb;

    var ffb = document.createElement('button');
    ffb.id = "find_fragments";
    ffb.className = "border_box";
    ffb.style.visibility = "hidden";
    this.container.appendChild(ffb);
    this.__initFFB(ffb);
    this.findFragmentsButton = ffb;

    var cc = document.createElement('div');
    cc.id = "canvas_container";
    this.container.appendChild(cc);
    this.__initMainViewer(cc);

    if(!$ext.onBrokenIE()) {
      this.__initSettingsUI();
    }

    this.container.dispatchEvent(this.uiInitializedEvent);
  },

  __initAtomDetails: function(container) {
    var ad = document.createElement('div');
    ad.id = "atom_details";
    container.appendChild(ad);
    this.atomDetails = ad;
  },

  __initRelatedFragments: function(container) {
    var rf = document.createElement('div');
    rf.id = "related_fragments";
    container.appendChild(rf);
    this.relatedFragments = rf;
  },

  __initPopup: function(container) {
    this.popupTitle = document.createElement('div');
    this.popupTitle.id = "popup_title";

    this.popupContent = document.createElement('div');
    this.popupContent.id = "popup_content";

    container.appendChild(this.popupTitle);
    container.appendChild(document.createElement('hr'));
    container.appendChild(this.popupContent);
  },

  __initEMB: function(elem) {
    elem.appendChild(document.createTextNode("Submit a new molecule"));
    var _this = this;
    $ext.dom.onMouseClick(elem, function() {
      _this.showInsertMoleculePopup();
    }, 0);
  },

  __initFFB: function(elem) {
    elem.appendChild(document.createTextNode("Find matching fragments"));
    elem.disabled = "disabled";
    var _this = this;
    $ext.dom.onMouseClick(elem, function() {
      // Make sure the previewed charges are reset.
      _this.mv.previewCharges({});
      _this.mv.getMatchingFragments();
    }, 0);
  },

  __initMainViewer: function(container) {
    this.mv = new MoleculeViewer(this, "main_molecule", "canvas_container");
  },

  __initSettingsUI: function() {
    this.settingsUI = new dat.GUI({
      name: 'OFraMP Settings',
      savable: true
    });

    var _this = this;
    var settingsObj = $ext.extend($ext.copy(this.settings), {
      getMV: function() {
        return _this.mv;
      }
    });
    this.settingsUI.addAll(settingsObj, this.settings, $ext.object
        .extrapolate(SETTINGS_OPTIONS));
  },

  __initMP: function() {
    this.enterMoleculeButton.style.visibility = "visible";
    this.findFragmentsButton.style.visibility = "visible";
  },

  showPopup: function(title, content) {
    $ext.dom.clear(this.popupTitle);
    $ext.dom.clear(this.popupContent);
    this.popupTitle.appendChild(document.createTextNode(title));
    this.popupContent.appendChild(content);
    this.popup.style.visibility = 'visible';
  },

  hidePopup: function() {
    this.popup.style.visibility = "hidden";
  },

  showInsertMoleculePopup: function() {
    var _this = this;

    var title = "Please enter a molecule data string";

    var content = document.createElement('div');

    var ta = document.createElement('textarea');
    ta.placeholder = "Insert SMILES / InChI string here";
    content.appendChild(ta);

    var cbs = document.createElement('div');
    cbs.className = 'controls';
    content.appendChild(cbs);

    var sb = document.createElement('button');
    sb.appendChild(document.createTextNode("Submit"));
    sb.onclick = function() {
      _this.mv.showMolecule(ta.value, function() {
        _this.container.dispatchEvent(_this.moleculeDisplayedEvent);
      });

      if(!_this.mv.molecule) {
        _this.mv.setupInteraction();
        _this.__initMP();
      }
      _this.container.dispatchEvent(_this.moleculeEnteredEvent);
      _this.hidePopup();
    }
    cbs.appendChild(sb);

    var rb = document.createElement('button');
    rb.appendChild(document.createTextNode("Random molecule"));
    rb.onclick = function() {
      ta.value = $ext.array.randomElement(PREDEFINED_MOLECULES);
    }
    cbs.appendChild(rb);

    var cb = document.createElement('button');
    cb.style.float = 'right';
    cb.appendChild(document.createTextNode("Cancel"));
    cb.onclick = function() {
      if(!_this.mv.molecule) {
        _this.mv.showMolecule($ext.array.randomElement(PREDEFINED_MOLECULES));
        _this.mv.setupInteraction();
        _this.__initMP();
        _this.container.dispatchEvent(_this.moleculeEnteredEvent);
      }
      _this.hidePopup();
    }
    cbs.appendChild(cb);

    this.showPopup(title, content);
  },

  showSelectionDetails: function(selection) {
    var _this = this;

    $ext.dom.clear(this.atomDetails);
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
    this.atomDetails.appendChild(ts);

    var sl = new AtomList(this.mv.molecule, selection);
    var center = sl.getCenterPoint();
    var s = sl.getSize();
    var c = this.getMoleculeCutout(center.x, center.y, s.w, s.h, 228, 130);
    this.atomDetails.appendChild(c);

    var dt = document.createElement('table');

    if(atom) {
      $ext.dom.addTableRow(dt, "ID", atom.id);
      $ext.dom.addTableRow(dt, "Element", atom.element);
      var cc = document.createElement('span');
      cc.appendChild(document.createTextNode(atom.charge || "unknown"));
      $ext.dom.addTableRow(dt, "Charge", cc);
    } else {
      // Get the unparameterised atoms
      var uas = $ext.array.filter(selection, function(atom) {
        return atom.charge === undefined;
      });
      // Get the charged of all atoms
      var cs = $ext.array.map(selection, function(atom) {
        return atom.charge || 0;
      });

      $ext.dom.addTableRow(dt, "Selection count", selection.length);
      $ext.dom.addTableRow(dt, "Unparameterised", uas.length);
      $ext.dom.addTableRow(dt, "Parameterised", selection.length - uas.length);
      $ext.dom.addTableRow(dt, "Total charge", $ext.array.sum(cs));
    }

    this.atomDetails.appendChild(dt);

    if(atom) {
      var ced = document.createElement('div');
      ced.id = "charge_edit";
      ced.className = "border_box";
      ced.style.height = "0px";

      var cet = document.createElement('table');
      $ext.dom.addTableRow(cet, "Used fragments", "TODO");
      var ceb = document.createElement('input');
      ceb.value = atom.charge || "";
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
          _this.atomDetails.insertBefore(ecb, ffb);
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
      this.atomDetails.appendChild(ced);

      $ext.dom.onMouseClick(acb, function() {
        // TODO validate!
        atom.charge = ceb.value || undefined;
        $ext.dom.clear(cc);
        cc.appendChild(document.createTextNode(atom.charge || "unknown"));
        _this.redraw();

        toggleChargeEdit();
      });
    }

    var ffb = document.createElement('button');
    ffb.className = "border_box";
    ffb.appendChild(document.createTextNode("Find matching fragments"));

    if(atom) {
      this.atomDetails.appendChild(ecb);
      $ext.dom.onMouseClick(ecb, toggleChargeEdit, 0);
    }

    this.atomDetails.appendChild(ffb);
    $ext.dom.onMouseClick(ffb, function() {
      _this.mv.getMatchingFragments();
    }, 0);

    this.atomDetails.parentElement.style.visibility = "visible";
    this.atomDetails.parentElement.style.opacity = "1.0";
  },

  hideSelectionDetails: function() {
    this.atomDetails.parentElement.style.visibility = "hidden";
    this.atomDetails.parentElement.style.opacity = "0.0";
  },

  showRelatedFragments: function(fragments) {
    $ext.dom.clear(this.relatedFragments);
    this.relatedFragmentViewers = new Array();

    var ts = document.createElement('span');
    ts.className = "title";
    ts.appendChild(document.createTextNode("Found " + fragments.length
        + " fragments"));
    this.relatedFragments.appendChild(ts);

    $ext.each(fragments, function(fragment, i) {
      var fc = document.createElement('div');
      fc.id = "fc_" + i;
      fc.className = "fragment";
      this.relatedFragments.appendChild(fc);

      var ab = document.createElement('button');
      ab.className = "border_box";
      ab.disabled = "disabled";
      ab.appendChild(document.createTextNode("Select fragment"));
      fc.appendChild(ab);

      var _this = this;
      var mv = new MoleculeViewer(this, "fragment_" + i, fc.id, 228, 130);
      mv.showMolecule(fragment, function(molecule) {
        molecule.bestFit();
        this.redraw();

        $ext.dom.onMouseClick(this.canvas, function() {
          ab.disabled = "";

          if(_this.activeFragment && _this.activeFragment !== molecule.mv) {
            // Disable the currently active fragment's button
            _this.activeFragment.canvas.parentElement
                .getElementsByClassName("border_box")[0].disabled = "disabled";
          }
          _this.activeFragment = molecule.mv;

          // TODO
          var m = _this.mv.molecule.find(molecule.dataStr.split(''))[0];
          var charges = {};
          $ext.each(m, function(atom, i) {
            charges[atom.id] = molecule.atoms.get(i + 1).charge;
          });
          _this.mv.previewCharges(charges);
        }, 0);
      });
      this.relatedFragmentViewers.push(mv);

      $ext.dom.onMouseClick(ab, function() {
        // TODO
        var m = _this.mv.molecule.find(mv.molecule.dataStr.split(''))[0];
        _this.mv.molecule.dehighlight();
        _this.mv.molecule.setSelected([]);

        var charges = {};
        $ext.each(m, function(atom, i) {
          charges[atom.id] = mv.molecule.atoms.get(i + 1).charge;
        });
        _this.mv.setCharges(charges);

        _this.mv.afterSelect();
        _this.redraw();

        _this.hideRelatedFragments();
      }, 0);
    }, this);

    this.relatedFragments.parentElement.style.visibility = "visible";
    this.relatedFragments.parentElement.style.opacity = "1.0";
  },

  hideRelatedFragments: function() {
    this.relatedFragments.parentElement.style.visibility = "hidden";
    this.relatedFragments.parentElement.style.opacity = "0.0";
  },

  getMoleculeCutout: function(x, y, sw, sh, width, height) {
    // Redraw first to make sure no pending changes are ignored
    this.redraw();

    var c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    var ctx = c.getContext('2d');

    // Increase selection size when the ratio is off
    var r = sw / sh;
    if(r > width / height) {
      sh *= r * c.height / c.width;
    } else {
      sw *= (1 / r) * c.width / c.height;
    }

    var dx = Math.max(width, sw) / 2;
    var dy = Math.max(height, sh) / 2;
    var wf = width / (2 * dx);
    var hf = height / (2 * dy);
    var f = wf < hf ? wf : hf;

    var id = this.mv.ctx.getImageData(x - dx, y - dy, 2 * dx, 2 * dy);

    var tc = document.createElement('canvas');
    tc.width = id.width;
    tc.height = id.height;
    tc.getContext("2d").putImageData(id, 0, 0);

    ctx.scale(f, f);
    ctx.drawImage(tc, 0, 0);
    return c;
  },


  /*
   * Set the size of the main molecule viewer to width x height.
   */
  setMVSize: function(width, height) {
    this.mv.setCanvasSize(width, height)
  },

  /*
   * Move the molecule dx in the x direction and dy on the y axis.
   */
  move: function(dx, dy) {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.move(dx, dy);
  },

  /*
   * Zoom on the center of the molecule with a factor f.
   */
  zoom: function(f) {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.zoom(f);
  },

  /*
   * Zoom on the position (x, y) with a factor f.
   */
  zoomOn: function(x, y, f) {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.zoomOn(x, y, f);
  },

  /*
   * Fit the molecule on the canvas.
   */
  bestFit: function() {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.molecule.bestFit();
    this.redraw();
  },

  /*
   * Show the molecule in minimum size on the canvas.
   */
  minimize: function() {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.molecule.minimize();
    this.redraw();
  },

  /*
   * Show the molecule in ideal size on the canvas.
   */
  idealize: function() {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.molecule.idealize();
    this.redraw();
  },

  /*
   * Show the molecule in maximum size on the canvas.
   */
  maximize: function() {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.molecule.maximize();
    this.redraw();
  },

  /*
   * Reset the atom positions to those obtained with OAPoC.
   */
  resetPositions: function() {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.molecule.resetPositions();
    this.redraw();
  },

  /*
   * Get the molecule canvas data as a Base64 string.
   */
  getMVDataURI: function(format) {
    return this.mv.canvas.toDataURL(format);
  },

  /*
   * Redraw the molecule canvas.
   */
  redraw: function() {
    if(!this.mv) {
      return;
    }

    this.mv.redraw();
  }
};
