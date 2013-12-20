function MoleculeViewer(id, parentID, settings, width, height) {
  this.__init(id, parentID, settings, width, height);
}

MoleculeViewer.prototype = {
  oframp: undefined,
  settings: undefined,
  cache: undefined,

  id: undefined,
  canvas: undefined,
  ctx: undefined,

  molecule: undefined,

  isInteractive: false,
  selectionArea: undefined,
  overlayShowing: false,
  overlayMessage: "",
  overlayStatus: 1,

  __init: function(oframp, id, parentID, width, height) {
    this.oframp = oframp;
    this.settings = oframp.settings;
    this.cache = new Cache();

    this.id = id;
    this.canvas = document.createElement('canvas');
    this.__initCanvas(parentID, width, height);

    this.ctx = this.canvas.getContext('2d');
  },

  __initCanvas: function(parentID, width, height) {
    width = width || document.documentElement.clientWidth;
    height = height || document.documentElement.clientHeight;

    this.canvas.id = this.id;
    this.canvas.width = width;
    this.canvas.height = height;

    var parent = document.getElementById(parentID);
    parent.appendChild(this.canvas);
  },

  setupInteraction: function() {
    var _this = this;

    this.isInteractive = true;

    $ext.dom.onContextMenu(this.canvas, function(e) {
      if(e.preventDefault) {
        e.preventDefault();
      } else if(e.stopPropagation) {
        e.stopPropagation();
      } else {
        return false;
      }
    });

    $ext.dom.onMouseMove(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        var c = $ext.mouse.getCoords(e);
        var a = _this.molecule.getAtomAt(c.x, c.y);
        if(_this.molecule.setHover(a)) {
          _this.redraw();
        }
      }
    });

    $ext.dom.onMouseClick(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        var c = $ext.mouse.getCoords(e);
        var a = _this.molecule.getAtomAt(c.x, c.y);
        var s = a ? [a] : [];
        if(e.ctrlKey === true) {
          _this.molecule.atoms.addSelected(s);
          _this.redraw();
        } else if(_this.molecule.setSelected(s)) {
          _this.redraw();
        }
        _this.afterSelect();
      }
    }, 0);

    $ext.dom.onMouseDrag(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        _this.move(e.deltaX, e.deltaY);
      }
    }, 0);

    $ext.dom.onMouseDrag(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        if(!_this.selectionArea) {
          _this.selectionArea = new SelectionArea(_this, e.clientX, e.clientY);
          if(e.ctrlKey === true) {
            window.__initialSelection = _this.molecule.atoms.getSelected();
          }
        } else {
          _this.selectionArea.resize(e.deltaX, e.deltaY);
          var bb = _this.selectionArea.getBB();
          var atoms = _this.molecule.getAtomsIn(bb.x1, bb.y1, bb.x2, bb.y2);
          if(e.ctrlKey === true) {
            _this.molecule.setSelected(window.__initialSelection);
            _this.molecule.atoms.addSelected(atoms);
          } else {
            _this.molecule.setSelected(atoms);
          }
          _this.redraw();
        }
      }
    }, 2);

    $ext.dom.onMouseUp(window, function(e) {
      if(!_this.overlayShowing) {
        _this.selectionArea = undefined;
        _this.redraw();
        _this.afterSelect();
      }
    }, 2);

    $ext.dom.onMouseWheel(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        if(e.deltaY < 0) {
          var f = _this.settings.zoom.factor;
        } else {
          var f = 1 / _this.settings.zoom.factor;
        }
        var c = $ext.mouse.getCoords(e);
        _this.zoomOn(c.x, c.y, f);

        return false;
      }
    });
  },

  /*
   * Handler to be called after a change in the atom selection.
   */
  afterSelect: function() {
    var selection = this.molecule.atoms.getSelected();
    if(selection && selection.length > 0) {
      this.oframp.findFragmentsButton.disabled = "";
      this.oframp.showSelectionDetails(selection);
    } else {
      this.oframp.findFragmentsButton.disabled = "disabled";
      this.oframp.hideSelectionDetails();
    }
  },

  setCanvasSize: function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;

    if(this.molecule) {
      this.molecule.atoms.each(function(atom) {
        atom.cache.clear('position.visible');
      });
      this.molecule.bonds.each(function(bond) {
        bond.cache.clear('position.visible');
      });
      this.redraw();
    }
  },

  /*
   * Get the molecule data from OAPoC and run the success function on success.
   */
  getMoleculeData: function(dataStr, success) {
    var _this = this;

    this.showOverlay("Loading molecule data...", MESSAGE_TYPES.info);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if(xhr.readyState == 1) {
        _this.showOverlay("Loading molecule data...\nConnection established.");
      } else if(xhr.readyState == 2) {
        _this.showOverlay("Loading molecule data...\nRequest received.");
      } else if(xhr.readyState == 3) {
        _this.showOverlay("Loading molecule data...\nProcessing request...");
      } else if(xhr.readyState == 4 && xhr.status == 200) {
        var md = JSON.parse(xhr.responseText);
        console.log("md", md);

        var vc = $ext.string.versionCompare(_this.settings.oapoc.version,
            md.version);
        if(vc == -1) {
          var msg = "OAPoC version too old." + "\n\nRequired version: "
              + _this.settings.oapoc.version + "\nCurrent version: "
              + md.version;
          _this.showOverlay(msg, MESSAGE_TYPES.error);
        } else if(vc == 1) {
          var msg = "OAPoC version too new." + "\n\nRequired version: "
              + _this.settings.oapoc.version + "\nCurrent version: "
              + md.version;
          _this.showOverlay(msg, MESSAGE_TYPES.error);
        } else if(md.error) {
          _this.showOverlay(md.error, MESSAGE_TYPES.error);
        } else if(md.atoms && md.bonds) {
          success.call(_this, md);
        }
      } else if(xhr.status != 200) {
        _this
            .showOverlay("Could not connect to server", MESSAGE_TYPES.critical);
      }
    };

    xhr.open("POST", this.settings.oapoc.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("fmt=smiles&data=" + encodeURIComponent(dataStr));
  },

  /*
   * Get the matching fragments with the selection of the molecule.
   */
  getMatchingFragments: function() {
    var selection = this.molecule.atoms.getSelected();
    if(selection.length === 0) {
      alert("No atoms have been selected.");
      return false;
    }

    var selectionIDs = $ext.array.map(selection, function(atom) {
      return atom.id;
    });
    var tree = this.molecule.atoms.getTree(selection[0]);
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
      molecule: this.molecule.getSimpleJSON()
    });

    console.log(queryJSON);
    // TODO!!
    var fragments = new Array();
    var r = Math.round(Math.random() * 10);
    for( var i = 0; i < r; i++) {
      fragments.push("OCO");
    }
    this.oframp.showRelatedFragments(fragments);
  },

  /*
   * Load and show the molecule represented by dataStr (currently in SMILES).
   * 
   * Once the molecule has been loaded execute the optional success function;
   */
  showMolecule: function(dataStr, success) {
    this.getMoleculeData(dataStr, function(md) {
      this.showOverlay("Initializing molecule...");
      this.molecule = new Molecule(this, md.atoms, md.bonds, md.dataStr);
      this.molecule.idealize();
      this.hideOverlay();
      if(success) {
        success.call(this, this.molecule);
      }
    });
  },

  /*
   * Show an overlay with a given message msg of status status.
   * 
   * Both msg and status will be retrieved from 'this' if they are undefined.
   */
  showOverlay: function(msg, status) {
    if(this.overlayShowing) {
      this.hideOverlay();
    }

    msg = msg || this.overlayMsg;
    status = status || this.overlayStatus;

    var ctx = this.ctx;
    var bw = this.settings.popup.borderWidth;
    ctx.fillStyle = this.settings.popup.borderColor;
    ctx.fillRect(0, 0, this.canvas.width, bw);
    ctx.fillRect(0, bw, bw, this.canvas.height - 2 * bw);
    ctx.fillRect(this.canvas.width - bw, bw, bw, this.canvas.height - 2 * bw);
    ctx.fillRect(0, this.canvas.height - bw, this.canvas.width, bw);

    ctx.fillStyle = this.settings.popup.bgColors[status];
    ctx.fillRect(bw, bw, this.canvas.width - 2 * bw, this.canvas.height - 2
        * bw);

    ctx.font = this.settings.popup.font;
    ctx.fillStyle = this.settings.popup.color;
    var p = this.settings.popup.padding + bw;
    $ext.context.boxedFillText(ctx, this.canvas.width / 2,
        this.canvas.height / 2, this.canvas.width - 2 * p, this.canvas.height
            - 2 * p, msg, true);

    this.canvas.style.cursor = this.settings.cursor.normal;

    this.overlayShowing = true;
    this.overlayMsg = msg;
    this.overlayStatus = status;
  },

  /*
   * Hide the overlay.
   */
  hideOverlay: function() {
    this.overlayShowing = false;
    if(!this.isInteractive) {
      this.canvas.style.cursor = this.settings.cursor.click;
    }
    this.redraw();
  },

  /*
   * Preview the charges given as a mapping from atom IDs to charges.
   */
  previewCharges: function(charges) {
    this.molecule.atoms.each(function(atom) {
      if(charges[atom.id]) {
        atom.previewCharge = charges[atom.id];
        atom.highlight();
      } else {
        atom.previewCharge = undefined;
        atom.dehighlight();
      }
    });
    this.redraw();
  },

  /*
   * Set the charges given as a mapping from atom IDs to charges.
   */
  setCharges: function(charges) {
    this.molecule.atoms.each(function(atom, i) {
      if(charges[atom.id]) {
        if(atom.charge) {
          this.__fixCharge(atom, this.molecule.atoms.slice(i + 1), charges);
          return $ext.BREAK;
        } else {
          atom.charge = charges[atom.id];
          atom.previewCharge = undefined;
        }
      }
    }, this);
    this.redraw();
  },

  __fixCharge: function(atom, rem, charges) {
    var title = "Attempting to assign a new charge to an already charged atom";
    var content = document.createElement('div');
    var dt = document.createElement('table');
    $ext.dom.addTableRow(dt, "Atom ID", atom.id);
    $ext.dom.addTableRow(dt, "Element", atom.element);
    $ext.dom.addTableRow(dt, "Current charge", $ext.number.format(atom.charge,
        1, 3));
    $ext.dom.addTableRow(dt, "Proposed charge", $ext.number.format(
        charges[atom.id], 1, 3));

    var rc = document.createElement('input');
    rc.disabled = "disabled";
    rc.value = $ext.number.format(atom.charge, 1, 3);

    var ss = document.createElement('select');
    $ext.dom.addSelectOption(ss, "current", "Current value");
    $ext.dom.addSelectOption(ss, "other", "Other value");
    $ext.dom.addSelectOption(ss, "average", "Average value");
    $ext.dom.addSelectOption(ss, "custom", "Custom value");
    $ext.dom.addEventListener(ss, 'change', function() {
      rc.disabled = "disabled";
      switch(ss.value) {
        case "current":
          rc.value = atom.charge;
          break;

        case "other":
          rc.value = charges[atom.id];
          break;

        case "average":
          rc.value = (atom.charge + charges[atom.id]) / 2;
          break;

        case "custom":
          rc.disabled = "";
          break;
      }
    });

    $ext.dom.addTableRow(dt, "Solution", ss);
    $ext.dom.addTableRow(dt, "Resulting charge", rc);

    content.appendChild(dt);
    content.appendChild(document.createTextNode("Atom ID: " + atom.id))
    var rb = document.createElement('button');
    rb.appendChild(document.createTextNode("Apply charge"));
    content.appendChild(rb);

    var _this = this;
    $ext.dom.onMouseClick(rb, function() {
      console.log(atom, rem, charges)
      atom.charge = rc.value;
      atom.previewCharge = undefined;
      _this.oframp.hidePopup();

      rem.each(function(atom, i) {
        if(charges[atom.id]) {
          if(atom.charge) {
            this.__fixCharge(atom, rem.slice(i + 1), charges);
            return $ext.BREAK;
          } else {
            atom.charge = charges[atom.id];
            atom.previewCharge = undefined;
          }
        }
      }, _this);
      _this.redraw();
    }, 0);
    this.oframp.showPopup(title, content);
  },

  /*
   * Fix overlapping bonds and atoms.
   */
  deoverlap: function() {
    if(!this.molecule) {
      return;
    }

    var _this = this;
    var limit = this.settings.deoverlap.timeLimit * 1000;
    window.requestAnimationFrame(function drawLoop(ts) {
      if(!window.__animStart) {
        window.__animStart = ts;
      }

      if(ts - window.__animStart < limit && _this.molecule.deoverlap()) {
        _this.redraw();
        requestAnimationFrame(drawLoop);
      } else {
        window.__animStart = undefined;
      }
    });
  },

  clearCache: function(name) {
    this.cache.clear(name);
  },

  /*
   * Move the molecule dx in the x direction and dy on the y axis.
   */
  move: function(dx, dy) {
    if(!this.molecule) {
      return;
    }

    this.molecule.move(dx, dy);
    this.redraw();
  },

  /*
   * Zoom on the center of the molecule with a factor f.
   */
  zoom: function(f) {
    if(!this.molecule) {
      return;
    }

    // Restrict minimum and maximum zoom
    var ad = this.molecule.bonds.getAverageDistance();
    if(f < 1 && ad < this.settings.zoom.min || f > 1
        && ad > this.settings.zoom.max) {
      return;
    }

    this.molecule.zoom(f);
    this.redraw();
  },

  /*
   * Zoom on the position (x, y) with a factor f.
   */
  zoomOn: function(x, y, f) {
    if(!this.molecule) {
      return;
    }

    // Restrict minimum and maximum zoom
    var ad = this.molecule.bonds.getAverageDistance()
    if(f < 1 && ad < this.settings.zoom.min || f > 1
        && ad > this.settings.zoom.max) {
      return;
    }

    this.molecule.zoomOn(x, y, f);
    this.redraw();
  },

  resetContext: function() {
    $ext.context.clear(this.ctx);
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
  },

  /*
   * Redraw the canvas.
   */
  redraw: function() {
    this.resetContext();

    if(this.molecule) {
      this.molecule.draw();
    }

    if(this.selectionArea) {
      this.selectionArea.draw();
    }

    if(this.overlayShowing) {
      this.showOverlay();
    }
  }
};
