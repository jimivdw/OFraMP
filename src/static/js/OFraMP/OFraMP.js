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

  uiInitializedEvent: new Event('uiinitialized'),
  moleculeEnteredEvent: new Event('moleculeentered'),

  __init: function(containerID, settings) {
    this.container = document.getElementById(containerID);
    this.settings = $ext.merge($ext.copy(DEFAULT_SETTINGS), settings);
    this.__initUI();
    this.showInsertMoleculePopup();
  },

  __initUI: function() {
    var lb = document.createElement('div');
    lb.id = "leftbar";
    lb.className = "border_box";
    lb.style.visibility = "hidden";
    this.container.appendChild(lb);
    this.__initAtomDetails(lb);

    var rb = document.createElement('div');
    rb.id = "rightbar";
    rb.className = "border_box";
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
      _this.mv.showMolecule(ta.value);
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
    function addTableRow(table, label, value) {
      var row = document.createElement('tr');
      var head = document.createElement('th');
      head.appendChild(document.createTextNode(label));
      var data = document.createElement('td');
      data.appendChild(document.createTextNode(value));
      row.appendChild(head);
      row.appendChild(data);
      table.appendChild(row);
    }

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

    var c = document.createElement('canvas');
    c.width = 228;
    c.height = 130;
    var ctx = c.getContext('2d');

    var sl = new AtomList(this.mv.molecule, selection);
    var center = sl.getCenterPoint();
    var size = sl.getSize();

    // Increase selection size when the ratio is off
    var r = size.w / size.h;
    if(r > c.width / c.height) {
      size.h *= r * c.height / c.width;
    } else {
      size.w *= (1 / r) * c.width / c.height;
    }

    var dx = Math.max(c.width, size.w) / 2;
    var dy = Math.max(c.height, size.h) / 2;
    var wf = c.width / (2 * dx);
    var hf = c.height / (2 * dy);
    var f = wf < hf ? wf : hf;

    var id = this.mv.ctx.getImageData(center.x - dx, center.y - dy, 2 * dx,
        2 * dy);

    var tc = document.createElement('canvas');
    tc.width = id.width;
    tc.height = id.height;
    tc.getContext("2d").putImageData(id, 0, 0);

    ctx.scale(f, f);
    ctx.drawImage(tc, 0, 0);
    this.atomDetails.appendChild(c);

    var dt = document.createElement('table');

    if(atom) {
      addTableRow(dt, "ID", atom.id);
      addTableRow(dt, "Element", atom.element);
      addTableRow(dt, "Charge", atom.charge || "unknown");
    } else {
      // Get the unparameterised atoms
      var uas = $ext.array.filter(selection, function(atom) {
        return atom.charge === undefined;
      });
      // Get the charged of all atoms
      var cs = $ext.array.map(selection, function(atom) {
        return atom.charge || 0;
      });

      addTableRow(dt, "Selection count", selection.length);
      addTableRow(dt, "Unparameterised", uas.length);
      addTableRow(dt, "Parameterised", selection.length - uas.length);
      addTableRow(dt, "Total charge", $ext.array.sum(cs));
    }

    this.atomDetails.appendChild(dt);

    var ffb = document.createElement('button');
    ffb.className = "border_box";
    ffb.appendChild(document.createTextNode("Find matching fragments"));
    this.atomDetails.appendChild(ffb);
    var _this = this;
    $ext.dom.onMouseClick(ffb, function() {
      _this.mv.getMatchingFragments();
    }, 0);

    if(atom) {
      var ecb = document.createElement('button');
      ecb.className = "border_box";
      ecb.disabled = "disabled";
      ecb.appendChild(document.createTextNode("Edit charge"));
      this.atomDetails.appendChild(ecb);
      $ext.dom.onMouseClick(ecb, function() {
        alert("TODO =)");
      }, 0);
    }

    this.atomDetails.parentElement.style.visibility = "visible";
    this.atomDetails.parentElement.style.opacity = "1.0";
  },

  hideSelectionDetails: function() {
    this.atomDetails.parentElement.style.visibility = "hidden";
    this.atomDetails.parentElement.style.opacity = "0.0";
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

    this.mv.molecule.bestFit(this.mv.canvas.width, this.mv.canvas.height);
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
