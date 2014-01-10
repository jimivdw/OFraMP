function OFraMP(behavior, containerID, settings) {
  this.__init(behavior, containerID, settings);
}

OFraMP.prototype = {
  behavior: undefined,
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

  __init: function(behavior, containerID, settings) {
    this.container = document.getElementById(containerID);
    this.settings = $ext.merge($ext.copy(DEFAULT_SETTINGS), settings);
    this.behavior = new behavior(this);
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
      _this.getMatchingFragments();
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

    var ossi = document.createElement("input");
    ossi.type = "file";
    ossi.style.display = "none";
    ossi.accept = ".oss";
    ossi.onchange = function() {
      var oss = this.files[0];
      if(!oss.name.match(/.*\.oss$/)) {
        alert("Only OFraMP Structure Storage (.oss) files are allowed.");
        return;
      }

      var reader = new FileReader();
      reader.onload = function(evt) {
        try {
          var data = JSON.parse(atob(evt.target.result));
          if(!_this.mv.molecule) {
            _this.mv.setupInteraction();
            _this.__initMP();
          }

          _this.container.dispatchEvent(_this.moleculeEnteredEvent);
          _this.mv.loadMolecule(data);
          _this.container.dispatchEvent(_this.moleculeDisplayedEvent);

          _this.hidePopup();
        } catch(err) {
          alert("Unable to parse the OSS file. Please try a different file.");
        }
      };
      reader.readAsBinaryString(oss);
    };
    cbs.appendChild(ossi);

    var lb = document.createElement('button');
    lb.appendChild(document.createTextNode("Load from OSS file"));
    lb.onclick = function() {
      ossi.click();
    }
    cbs.appendChild(lb);

    if(this.mv.molecule) {
      var cb = document.createElement('button');
      cb.style.float = 'left';
      cb.appendChild(document.createTextNode("Cancel"));
      cb.onclick = function() {
        _this.hidePopup();
      }
      cbs.appendChild(cb);
    }

    this.showPopup(title, content);
  },

  showUsedFragments: function(fragments) {
    var _this = this;

    var title = "Used molecule fragments";

    var content = document.createElement('div');

    var frags = document.createElement('div');
    frags.id = "used_fragments";
    $ext.each(fragments, function(fragment) {
      var fc = document.createElement('div');
      fc.className = 'used_fragment border_box';
      fc.appendChild(document.createTextNode("TODO"));
      frags.appendChild(fc);
    });
    content.appendChild(frags);

    var cb = document.createElement('button');
    cb.className = 'border_box';
    cb.appendChild(document.createTextNode("Close"));
    content.appendChild(cb);

    $ext.dom.onMouseClick(cb, function() {
      _this.hidePopup();
    }, 0);

    this.showPopup(title, content);
  },

  showSelectionDetails: function() {
    this.atomDetails.parentElement.style.visibility = "visible";
    this.atomDetails.parentElement.style.opacity = "1.0";
  },

  hideSelectionDetails: function() {
    this.atomDetails.parentElement.style.visibility = "hidden";
    this.atomDetails.parentElement.style.opacity = "0.0";
  },

  showRelatedFragments: function() {
    this.relatedFragments.parentElement.style.visibility = "visible";
    this.relatedFragments.parentElement.style.opacity = "1.0";
  },

  hideRelatedFragments: function() {
    this.relatedFragments.parentElement.style.visibility = "hidden";
    this.relatedFragments.parentElement.style.opacity = "0.0";
  },

  /*
   * Get the matching fragments with the selection of the molecule.
   */
  getMatchingFragments: function(selection) {
    var selection = selection || this.mv.molecule.getSelected();
    if(selection.length === 0) {
      alert("No atoms have been selected.");
      return false;
    }

    var selectionIDs = $ext.array.map(selection, function(atom) {
      return atom.id;
    });
    var tree = this.mv.molecule.atoms.getTree(selection[0]);
    var selectionTree = tree.filter(function(node) {
      return selectionIDs.indexOf(node.key) !== -1;
    });

    var connected = $ext.each(selection, function(atom) {
      var f = selectionTree.findNode(atom.id);
      if(!f) {
        return false;
      }
    });

    if(connected === false) {
      alert("The atoms in the selection are not connected.");
      return false;
    }

    var queryJSON = JSON.stringify({
      needle: $ext.array.map(selection, function(atom) {
        return atom.id;
      }),
      molecule: this.mv.molecule.getSimpleJSON()
    });

    console.log(queryJSON);
    // TODO!!
    var fragments = new Array();
    var r = Math.round(Math.random() * 10);
    for( var i = 0; i < r; i++) {
      fragments.push("OCO");
    }
    this.behavior.showRelatedFragments(fragments);
  },

  /*
   * Handler to be called after a change in the atom selection.
   */
  selectionChanged: function() {
    var selection = this.mv.molecule.getSelected();
    if(selection && selection.length > 0) {
      this.findFragmentsButton.disabled = "";
      this.behavior.showSelectionDetails(selection);
    } else {
      this.findFragmentsButton.disabled = "disabled";
      this.hideSelectionDetails();
    }
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
   * Get the molecule data as a Base64 string.
   */
  getDataURI: function() {
    var data = JSON.stringify(this.mv.molecule.getJSON());
    return "data:application/octet-stream:base64," + btoa(data);
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
