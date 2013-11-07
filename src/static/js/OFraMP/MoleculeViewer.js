function MoleculeViewer(canvas_id, settings) {
  this.init(canvas_id, settings);
}

MoleculeViewer.prototype = {
  molecule: undefined,
  canvas: undefined,
  ctx: undefined,

  overlay_showing: false,
  overlay_message: "",
  overlay_status: 1,

  settings: undefined,
  
  cache: undefined,

  init: function(canvas_id, settings) {
    this.canvas = document.getElementById(canvas_id);
    this.ctx = this.canvas.getContext('2d');
    this.init_context();

    this.settings = $ext.merge($ext.copy(DEFAULT_SETTINGS), settings);

    if(this.settings.interactive) {
      this.init_interaction();
    }
    
    this.cache = new Cache();
  },

  init_context: function() {
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
  },

  init_interaction: function() {
    var mv = this;

    // TODO: Not supported in Firefox!
    this.canvas.onmousewheel = function(e) {
      if(!mv.overlay_showing) {
        if(e.wheelDelta > 0) {
          var f = mv.settings.zoom.factor;
        } else {
          var f = 1 / mv.settings.zoom.factor;
        }
        mv.zoomOn(e.offsetX, e.offsetY, f);

        return false;
      }
    };

    this.canvas.onmousedown = function(e) {
      if(!mv.overlay_showing) {
        var a = mv.molecule.atomAt(e.getX(), e.getY());
        if(a) {
          if(mv.molecule.setSelected(a))
            mv.redraw();
        } else {
          mv.lastX = e.getX();
          mv.lastY = e.getY();
          mv.mouseDown = true;
        }
      }
    };

    this.canvas.onmousemove = function(e) {
      if(!mv.overlay_showing) {
        if(mv.mouseDown) {
          var dx = e.getX() - mv.lastX;
          var dy = e.getY() - mv.lastY;
          mv.move(dx, dy);

          mv.lastX = e.getX();
          mv.lastY = e.getY();
          mv.mouseDragged = true;
        } else {
          var a = mv.molecule.atomAt(e.getX(), e.getY());
          if(mv.molecule.setHover(a))
            mv.redraw();
        }
      }
    };

    document.onmouseup = function(e) {
      if(!mv.overlay_showing) {
        if(e.target === mv.canvas && !mv.mouseDragged) {
          if(!mv.molecule.atomAt(e.getX(), e.getY())) {
            if(mv.molecule.setSelected())
              mv.redraw();
          }
        }
        mv.mouseDown = false;
        mv.mouseDragged = false;
      }
    };
  },

  /*
   * Get the molecule data from OAPoC and run the success function on success.
   */
  getMoleculeData: function(data_str, success) {
    var mv = this;

    this.showOverlay("Loading molecule data...", MESSAGE_TYPES.info);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if(xhr.readyState == 1) {
        mv.showOverlay("Loading molecule data...\nConnection established.");
      } else if(xhr.readyState == 2) {
        mv.showOverlay("Loading molecule data...\nRequest received.");
      } else if(xhr.readyState == 3) {
        mv.showOverlay("Loading molecule data...\nProcessing request...");
      } else if(xhr.readyState == 4 && xhr.status == 200) {
        var md = JSON.parse(xhr.response);
        console.log("md", md);

        if(mv.settings.oapoc.version.versionCompare(md.version) == -1) {
          var msg = "OAPoC version too old." + "\n\nRequired version: "
              + mv.settings.oapoc.version + "\nCurrent version: " + md.version;
          mv.showOverlay(msg, MESSAGE_TYPES.error);
        } else if(mv.settings.oapoc.version.versionCompare(md.version) == 1) {
          var msg = "OAPoC version too new." + "\n\nRequired version: "
              + mv.settings.oapoc.version + "\nCurrent version: " + md.version;
          mv.showOverlay(msg, MESSAGE_TYPES.error);
        } else if(md.error) {
          mv.showOverlay(md.error, MESSAGE_TYPES.error);
        } else if(md.atoms && md.bonds) {
          success(md);
        }
      } else if(xhr.status != 200) {
        mv.showOverlay("Could not connect to server", MESSAGE_TYPES.critical);
      }
    };

    xhr.open("POST", this.settings.oapoc.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("fmt=smiles&data=" + data_str);
  },

  /*
   * Load and show the molecule represented by data_str (currently in SMILES).
   */
  showMolecule: function(data_str) {
    var mv = this;
    this.getMoleculeData(data_str, function(md) {
      mv.showOverlay("Initializing molecule...");
      mv.molecule = new Molecule(mv, md.atoms, md.bonds, md.data_str);
      mv.hideOverlay();

      mv.idealize();
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
    ctx.boxedFillText(this.canvas.width / 2, this.canvas.height / 2,
        this.canvas.width - 2 * p, this.canvas.height - 2 * p, msg, true);

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
    if(!this.settings.interactive || !this.molecule) {
      return;
    }

    this.molecule.move(dx, dy);
    this.redraw();
  },

  /*
   * Zoom on the center of the molecule with a factor f.
   */
  zoom: function(f) {
    if(!this.settings.interactive || !this.molecule) {
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
    if(!this.settings.interactive || !this.molecule) {
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
    if(!this.settings.deoverlap.deoverlap || !this.molecule) {
      return;
    }

    window.molecule = this.molecule;
    window.fixcount = 0;
    window.fixmax = 1000 - 4.8 * this.molecule.atoms.count();
    window.requestAnimationFrame(function drawLoop() {
      if(fixcount < fixmax && molecule.deoverlap()) {
        fixcount++;
        molecule.mv.redraw();
        requestAnimationFrame(drawLoop);
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
    this.ctx.clear();
    this.init_context();

    if(this.molecule) {
      this.molecule.draw();
    }

    if(this.overlay_showing) {
      this.showOverlay();
    }
  }
};
