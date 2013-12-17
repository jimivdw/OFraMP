function MoleculeViewer(id, parent_id, settings) {
  this.init(id, parent_id, settings);
}

MoleculeViewer.prototype = {
  oframp: undefined,
  settings: undefined,
  cache: undefined,

  id: undefined,
  canvas: undefined,
  ctx: undefined,

  molecule: undefined,

  selection_area: undefined,
  overlay_showing: false,
  overlay_message: "",
  overlay_status: 1,

  init: function(oframp, id, parent_id) {
    this.oframp = oframp;
    this.settings = oframp.settings;
    this.cache = new Cache();

    this.id = id;
    this.canvas = document.createElement('canvas');
    this.init_canvas(parent_id);

    this.ctx = this.canvas.getContext('2d');
    this.init_context();
  },

  init_canvas: function(parent_id) {
    this.canvas.id = this.id;
    this.canvas.width = document.documentElement.clientWidth;
    this.canvas.height = document.documentElement.clientHeight;

    var parent = document.getElementById(parent_id);
    parent.appendChild(this.canvas);
  },

  init_context: function() {
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
  },

  init_interaction: function() {
    var _this = this;

    $ext.dom.onContextMenu(this.canvas, function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });

    $ext.dom.onMouseMove(this.canvas, function(e) {
      if(!_this.overlay_showing) {
        var c = $ext.mouse.getCoords(e);
        var a = _this.molecule.atomAt(c.x, c.y);
        if(_this.molecule.setHover(a)) {
          _this.redraw();
        }
      }
    });

    $ext.dom.onMouseClick(this.canvas, function(e) {
      if(!_this.overlay_showing) {
        var c = $ext.mouse.getCoords(e);
        var a = _this.molecule.atomAt(c.x, c.y);
        var s = a ? [a] : [];
        if(e.ctrlKey === true) {
          _this.molecule.atoms.addSelected(s);
          _this.redraw();
        } else if(_this.molecule.setSelected(s)) {
          _this.redraw();
        }

        var selection = _this.molecule.atoms.getSelected();
        if(selection && selection.length > 0) {
          _this.oframp.find_fragments_button.disabled = "";
        } else {
          _this.oframp.find_fragments_button.disabled = "disabled";
        }
      }
    }, 0);

    $ext.dom.onMouseDrag(this.canvas, function(e) {
      if(!_this.overlay_showing) {
        _this.move(e.deltaX, e.deltaY);
      }
    }, 0);

    $ext.dom.onMouseDrag(this.canvas, function(e) {
      if(!_this.overlay_showing) {
        if(!_this.selection_area) {
          _this.selection_area = new SelectionArea(_this, e.clientX, e.clientY);
          if(e.ctrlKey === true) {
            window.__initial_selection = _this.molecule.atoms.getSelected();
          }
        } else {
          _this.selection_area.resize(e.deltaX, e.deltaY);
          var bb = _this.selection_area.getBB();
          var atoms = _this.molecule.atoms.atomsIn(bb.x1, bb.y1, bb.x2, bb.y2);
          if(e.ctrlKey === true) {
            _this.molecule.setSelected(window.__initial_selection);
            _this.molecule.atoms.addSelected(atoms);
          } else {
            _this.molecule.setSelected(atoms);
          }
          _this.redraw();
        }
      }
    }, 2);

    $ext.dom.onMouseUp(this.canvas, function(e) {
      if(!_this.overlay_showing) {
        _this.selection_area = undefined;
        _this.redraw();

        var selection = _this.molecule.atoms.getSelected();
        if(selection && selection.length > 0) {
          _this.oframp.find_fragments_button.disabled = "";
          _this.oframp.showSelectionDetails(selection);
        } else {
          _this.oframp.find_fragments_button.disabled = "disabled";
        }
      }
    }, 2);

    $ext.dom.onMouseWheel(this.canvas, function(e) {
      if(!_this.overlay_showing) {
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

    window.onresize = function() {
      _this.canvas.width = document.documentElement.clientWidth;
      _this.canvas.height = document.documentElement.clientHeight;

      if(_this.molecule) {
        _this.molecule.atoms.each(function(atom) {
          atom.cache.clear('position.visible');
        });
        _this.molecule.bonds.each(function(bond) {
          bond.cache.clear('position.visible');
        });
        _this.redraw();
      }
    };
  },

  /*
   * Get the molecule data from OAPoC and run the success function on success.
   */
  getMoleculeData: function(data_str, success) {
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
          success(md);
        }
      } else if(xhr.status != 200) {
        _this
            .showOverlay("Could not connect to server", MESSAGE_TYPES.critical);
      }
    };

    xhr.open("POST", this.settings.oapoc.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("fmt=smiles&data=" + encodeURIComponent(data_str));
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

    var selection_ids = $ext.array.map(selection, function(atom) {
      return atom.id;
    });
    var tree = this.molecule.atoms.toTree(selection[0]);
    var selection_tree = tree.filter(function(node) {
      return selection_ids.indexOf(node.key) !== -1;
    });

    var connected = $ext.each(selection, function(atom) {
      var f = selection_tree.findNode(atom.id);
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
      molecule: this.molecule.toBasicJSON()
    });

    console.log(queryJSON);
    // TODO!!
  },

  /*
   * Load and show the molecule represented by data_str (currently in SMILES).
   */
  showMolecule: function(data_str) {
    var _this = this;
    this.getMoleculeData(data_str, function(md) {
      _this.showOverlay("Initializing molecule...");
      _this.molecule = new Molecule(_this, md.atoms, md.bonds, md.data_str);
      _this.hideOverlay();

      _this.idealize();
    });
  },

  /*
   * Show an overlay with a given message msg of status status.
   * 
   * Both msg and status will be retrieved from 'this' if they are undefined.
   */
  showOverlay: function(msg, status) {
    if(this.overlay_showing) {
      this.hideOverlay();
    }

    msg = msg || this.overlay_msg;
    status = status || this.overlay_status;

    var ctx = this.ctx;
    var bw = this.settings.popup.border_width;
    ctx.fillStyle = this.settings.popup.border_color;
    ctx.fillRect(0, 0, this.canvas.width, bw);
    ctx.fillRect(0, bw, bw, this.canvas.height - 2 * bw);
    ctx.fillRect(this.canvas.width - bw, bw, bw, this.canvas.height - 2 * bw);
    ctx.fillRect(0, this.canvas.height - bw, this.canvas.width, bw);

    ctx.fillStyle = this.settings.popup.bg_colors[status];
    ctx.fillRect(bw, bw, this.canvas.width - 2 * bw, this.canvas.height - 2
        * bw);

    ctx.font = this.settings.popup.font;
    ctx.fillStyle = this.settings.popup.color;
    var p = this.settings.popup.padding + bw;
    $ext.context.boxedFillText(ctx, this.canvas.width / 2,
        this.canvas.height / 2, this.canvas.width - 2 * p, this.canvas.height
            - 2 * p, msg, true);

    this.canvas.style.cursor = this.settings.cursor.normal;

    this.overlay_showing = true;
    this.overlay_msg = msg;
    this.overlay_status = status;
  },

  /*
   * Hide the overlay.
   */
  hideOverlay: function() {
    this.overlay_showing = false;
    this.redraw();
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
    var ad = this.molecule.bonds.averageDistance();
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
    var ad = this.molecule.bonds.averageDistance()
    if(f < 1 && ad < this.settings.zoom.min || f > 1
        && ad > this.settings.zoom.max) {
      return;
    }

    this.molecule.zoomOn(x, y, f);
    this.redraw();
  },

  /*
   * Fix overlapping bonds and atoms.
   */
  deoverlap: function() {
    if(!this.molecule) {
      return;
    }

    var _this = this;
    var limit = this.settings.deoverlap.time_limit * 1000;
    window.requestAnimationFrame(function drawLoop(ts) {
      if(!window.__anim_start) {
        window.__anim_start = ts;
      }

      if(ts - window.__anim_start < limit && _this.molecule.deoverlap()) {
        _this.redraw();
        requestAnimationFrame(drawLoop);
      } else {
        window.__anim_start = undefined;
      }
    });
  },

  /*
   * Fit the molecule on the canvas.
   */
  bestFit: function() {
    if(!this.molecule) {
      return;
    }

    this.molecule.bestFit(this.canvas.width, this.canvas.height);
    this.redraw();
  },

  /*
   * Show the molecule in minimum size on the canvas.
   */
  minimize: function() {
    if(!this.molecule) {
      return;
    }

    this.molecule.minimize();
    this.redraw();
  },

  /*
   * Show the molecule in ideal size on the canvas.
   */
  idealize: function() {
    if(!this.molecule) {
      return;
    }

    this.molecule.idealize();
    this.redraw();
  },

  /*
   * Show the molecule in maximum size on the canvas.
   */
  maximize: function() {
    if(!this.molecule) {
      return;
    }

    this.molecule.maximize();
    this.redraw();
  },

  /*
   * Reset the atom positions to those obtained with OAPoC.
   */
  resetPositions: function() {
    if(!this.molecule) {
      return;
    }

    this.molecule.resetPositions();
    this.redraw();
  },

  clearCache: function(name) {
    this.cache.clear(name);
  },

  /*
   * Redraw the canvas.
   */
  redraw: function() {
    $ext.context.clear(this.ctx);
    this.init_context();

    if(this.molecule) {
      this.molecule.draw();
    }

    if(this.selection_area) {
      this.selection_area.draw();
    }

    if(this.overlay_showing) {
      this.showOverlay();
    }
  }
};
