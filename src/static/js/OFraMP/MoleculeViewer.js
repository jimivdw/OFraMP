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
  isModifyingSelection: false,
  overlayShowing: false,
  overlayMessage: "",
  overlayStatus: 1,

  __init: function(oframp, id, parentID, width, height) {
    this.oframp = oframp;
    if(oframp.mv) {
      this.settings = oframp.settings.fragment;
    } else {
      this.settings = oframp.settings;
    }
    this.cache = new Cache();

    this.id = id;
    this.canvas = document.createElement('canvas');
    this.__initCanvas(parentID, width, height);

    this.ctx = $ext.context.getContext(this.canvas, '2d');
  },

  __initCanvas: function(parentID, width, height) {
    width = width || document.documentElement.clientWidth;
    height = height || document.documentElement.clientHeight;

    this.canvas.id = this.id;
    this.canvas.width = width;
    this.canvas.height = height;

    if(parentID instanceof Element) {
      var parent = parentID;
    } else {
      var parent = document.getElementById(parentID);
    }
    parent.appendChild(this.canvas);
  },

  isMainViewer: function() {
    return this.settings.fragment !== undefined;
  },

  setupInteraction: function() {
    if(this.isInteractive) {
      return;
    }

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

    if(this.isMainViewer()) {
      this.setupFullInteraction();
    } else {
      this.setupBasicInteraction();
    }
  },

  setupBasicInteraction: function() {
    var _this = this;

    $ext.dom.onMouseDrag(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        _this.move(e.deltaX, e.deltaY);
      }
    }, $ext.mouse.LEFT);

    $ext.dom.onMouseWheel(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        if(e.deltaY < 0) {
          var f = _this.settings.zoom.factor;
        } else {
          var f = 1 / _this.settings.zoom.factor;
        }
        var c = $ext.mouse.getCoords(e);
        _this.zoomOn(c.x, c.y, f);

        if(e.preventDefault) {
          e.preventDefault();
        } else if(e.stopPropagation) {
          e.stopPropagation();
        } else {
          return false;
        }
      }
    });
  },

  setupFullInteraction: function() {
    var _this = this;

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
        if(e.ctrlKey === true || _this.isModifyingSelection) {
          _this.molecule.atoms.addSelected(s);
          _this.redraw();
        } else if(_this.molecule.setSelected(s)) {
          _this.redraw();
        }
        _this.oframp.selectionChanged();
      }
    }, $ext.mouse.LEFT);

    var lastDragTime = undefined;
    $ext.dom.onMouseDrag(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        _this.move(e.deltaX, e.deltaY);

        var now = Date.now();
        if(!lastDragTime) {
          lastDragTime = now;
        }
        if(now - lastDragTime > 1000) {
          _this.oframp.checkpoint();
          lastDragTime = now;
        }
      }
    }, $ext.mouse.LEFT);

    $ext.dom.onMouseDragEnd(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        _this.oframp.checkpoint();
        lastDragTime = undefined;
      }
    }, $ext.mouse.LEFT);

    var initialSelection = [];
    $ext.dom.onMouseDrag(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        if(!_this.selectionArea) {
          _this.selectionArea = new SelectionArea(_this, $ext.mouse.getX(e),
              $ext.mouse.getY(e));
          if(e.ctrlKey === true || _this.isModifyingSelection) {
            initialSelection = _this.molecule.getSelected();
          }
        } else {
          _this.selectionArea.resize(e.deltaX, e.deltaY);
          var bb = _this.selectionArea.getBB();
          var atoms = _this.molecule.getAtomsIn(bb.x1, bb.y1, bb.x2, bb.y2);
          if(e.ctrlKey === true || _this.isModifyingSelection) {
            _this.molecule.setSelected(initialSelection);
            _this.molecule.atoms.addSelected(atoms);
          } else {
            _this.molecule.setSelected(atoms);
          }
          _this.redraw();
        }
      }
    }, $ext.mouse.RIGHT);

    $ext.dom.onMouseDragEnd(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        _this.selectionArea = undefined;
        _this.redraw();
        _this.oframp.selectionChanged();
      }
    }, $ext.mouse.RIGHT);

    var lastZoomTime = undefined;
    $ext.dom.onMouseWheel(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        if(e.deltaY < 0) {
          var f = _this.settings.zoom.factor;
        } else {
          var f = 1 / _this.settings.zoom.factor;
        }
        var c = $ext.mouse.getCoords(e);
        _this.zoomOn(c.x, c.y, f);

        var now = Date.now();
        if(!lastZoomTime) {
          lastZoomTime = now;
        }
        if(now - lastZoomTime > 1000) {
          _this.oframp.checkpoint();
          lastZoomTime = now;
        }

        return false;
      }
    });

    $ext.dom.onMouseWheelEnd(this.canvas, function(e) {
      if(!_this.overlayShowing) {
        _this.oframp.checkpoint();
        lastZoomTime = undefined;
      }
    });
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
   * 
   * If fromATB is true, the molecule will be retrieved from ATB.
   */
  getMoleculeData: function(dataStr, success, failure, fromATB) {
    var _this = this;
    success = success || function() {};
    failure = failure || function() {};

    this.showOverlay("Loading molecule data...", MESSAGE_TYPES.info);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if(xhr.readyState == 1) {
        _this.showOverlay("Loading molecule data...\nConnection established.");
      } else if(xhr.readyState == 2) {
        _this.showOverlay("Loading molecule data...\nRequest received.");
      } else if(xhr.readyState == 3) {
        _this.showOverlay("Loading molecule data...\nProcessing request...");
      } else if(xhr.readyState == 4) {
        if(xhr.status == 200) {
          var md = JSON.parse(xhr.responseText);
          var vc = $ext.string.versionCompare(_this.settings.oapoc.version,
              md.version);
          if(vc == -1) {
            var msg = "OAPoC version too old." + "\n\nRequired version: "
                + _this.settings.oapoc.version + "\nCurrent version: "
                + md.version;
            _this.showOverlay(msg, MESSAGE_TYPES.error);
            failure.call(_this, msg);
          } else if(vc == 1) {
            var msg = "OAPoC version too new." + "\n\nRequired version: "
                + _this.settings.oapoc.version + "\nCurrent version: "
                + md.version;
            _this.showOverlay(msg, MESSAGE_TYPES.error);
            failure.call(_this, msg);
          } else if(md.error) {
            var msg = "An error has occured:\n" + md.error;
            _this.showOverlay(msg, MESSAGE_TYPES.error);
            failure.call(_this, msg);
          } else if(md.atoms && md.bonds) {
            success.call(_this, md);
          }
        } else {
          var msg = "Could not connect to server";
          _this.showOverlay(msg, MESSAGE_TYPES.critical);
          failure.call(_this, msg);
        }
      }
    };

    if(fromATB) {
      var url = this.settings.oapoc.loadUrl;
      var data = "molid=" + encodeURIComponent(dataStr);
    } else {
      var url = this.settings.oapoc.url;
      var data = "data=" + encodeURIComponent(dataStr);
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
  },

  /*
   * Load and show the molecule represented by dataStr (currently in SMILES).
   * 
   * Once the molecule has been loaded execute the optional success function;
   */
  showMolecule: function(dataStr, success, failure, fromATB) {
    this.getMoleculeData(dataStr, function(md) {
      this.showOverlay("Initializing molecule...");
      this.molecule = new Molecule(this, md.atoms, md.bonds, md.dataStr,
          md.molid);

      if(!fromATB) {
        var mj = JSON.stringify({
          molecule: this.molecule.getSimpleJSON()
        });
        this.oframp.generateMoleculeFragments(mj);
      }

      this.molecule.idealize();
      this.hideOverlay();
      if(success) {
        success.call(this, this.molecule);
      }
    }, function(msg) {
      if(failure) {
        failure.call(this, msg);
      }
    }, fromATB);
  },

  loadMolecule: function(data) {
    this.molecule = new Molecule(this, data.atoms, data.bonds, data.dataStr);
    this.hideOverlay();
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

    msg = msg || this.overlayMessage;
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
    this.overlayMessage = msg;
    this.overlayStatus = status;
  },

  /*
   * Hide the overlay.
   */
  hideOverlay: function() {
    this.overlayShowing = false;
    if(this.isInteractive) {
      this.canvas.style.cursor = this.settings.cursor.drag;
    } else {
      this.canvas.style.cursor = this.settings.cursor.click;
    }
    this.redraw();
  },

  /*
   * Preview the charges given as a mapping from atom IDs to charges.
   */
  previewCharges: function(charges) {
    this.molecule.atoms.each(function(atom) {
      if(charges[atom.id] !== undefined) {
        atom.previewCharge = charges[atom.id];
        if(atom.isCharged()) {
          atom.addHighlight(ATOM_STATUSES.conflict);
        } else {
          atom.addHighlight(ATOM_STATUSES.preview);
        }
      } else {
        atom.previewCharge = undefined;
        atom.removeHighlight(ATOM_STATUSES.preview | ATOM_STATUSES.conflict);
      }
    });
    this.redraw();
  },

  /*
   * Set the charges given as a mapping from atom IDs to charges.
   * 
   * Returns true if all went well, false if any conflicting charges were found
   */
  setCharges: function(charges, fragment) {
    var needsFix = false;
    this.molecule.atoms.each(function(atom, i) {
      if(charges[atom.id] !== undefined) {
        if(atom.isCharged()) {
          if(this.oframp.settings.atom.showHAtoms || atom.element !== "H") {
            this.oframp.behavior.showChargeFixer(atom, this.molecule.atoms
                .slice(i + 1), charges, fragment);
            needsFix = true;
            return $ext.BREAK;
          }
        } else {
          atom.setCharge(charges[atom.id], fragment);
          atom.resetHighlight();
        }
      }
    }, this);
    this.redraw();

    if(needsFix) {
      return false;
    } else {
      if(this.molecule.getUnparameterized().length === 0) {
        this.oframp.behavior.parameterizationFinished();
      }
      return true;
    }
  },

  /*
   * Set the charges that are currently previewed as the real charges.
   */
  setPreviewCharges: function(fragment) {
    var charges = new Object();
    this.molecule.atoms.each(function(atom, i) {
      if(atom.previewCharge !== undefined) {
        charges[atom.id] = atom.previewCharge;
      }
    }, this);
    return this.setCharges(charges, fragment);
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
    var animStart = undefined;
    window.requestAnimationFrame(function drawLoop(ts) {
      if(!animStart) {
        animStart = ts;
      }

      if(ts - animStart < limit && _this.molecule.deoverlap()) {
        _this.redraw();
        requestAnimationFrame(drawLoop);
      } else {
        animStart = undefined;
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
