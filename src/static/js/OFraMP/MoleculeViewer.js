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

  init: function(canvas_id, settings) {
    this.canvas = document.getElementById(canvas_id);
    this.init_context();

    this.settings = DEFAULT_SETTINGS.copy().merge(settings);

    if(this.settings.interactive) {
      this.init_interaction();
    }
  },

  init_context: function() {
    this.ctx = this.canvas.getContext('2d');
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
  },

  init_interaction: function() {
    var mv = this;

    // TODO: Not supported in Firefox!
    this.canvas.onmousewheel = function(e) {
      if(!mv.overlay_showing) {
        if(e.wheelDelta > 0) {
          var f = mv.settings.zoom_factor;
        } else {
          var f = 1 / mv.settings.zoom_factor;
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

        if(mv.settings.oapoc_version.versionCompare(md.version) == -1) {
          var msg = "OAPoC version too old." + "\n\nRequired version: "
              + mv.settings.oapoc_version + "\nCurrent version: " + md.version;
          mv.showOverlay(msg, MESSAGE_TYPES.error);
        } else if(mv.settings.oapoc_version.versionCompare(md.version) == 1) {
          var msg = "OAPoC version too new." + "\n\nRequired version: "
              + mv.settings.oapoc_version + "\nCurrent version: " + md.version;
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

    xhr.open("POST", this.settings.oapoc_url, true);
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
    ctx.fillStyle = this.settings.message_border_color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = this.settings.message_bg_colors[status];
    var bw = this.settings.message_border_width;
    ctx.fillRect(bw, bw, this.canvas.width - 2 * bw, this.canvas.height - 2
        * bw);

    ctx.font = this.settings.message_font;
    ctx.fillStyle = this.settings.message_color;
    var p = this.settings.message_padding + bw;
    ctx.boxedFillText(this.canvas.width / 2, this.canvas.height / 2,
        this.canvas.width - 2 * p, this.canvas.height - 2 * p, msg, true);

    this.canvas.style.cursor = this.settings.canvas_cursor_normal;

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
   * Redraw the canvas.
   */
  redraw: function() {
    this.ctx.clear();

    if(this.molecule) {
      this.molecule.draw();
    }

    if(this.overlay_showing) {
      this.showOverlay();
    }
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
    if(f < 1 && ad < this.settings.min_zoom || f > 1
        && ad > this.settings.max_zoom) {
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
    if(f < 1 && ad < this.settings.min_zoom || f > 1
        && ad > this.settings.max_zoom) {
      return;
    }

    this.molecule.zoomOn(x, y, f);
    this.redraw();
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
   * Show the molecule in ideal size on the canvas.
   */
  idealize: function() {
    if(!this.molecule) {
      return;
    }

    this.molecule.idealize();
    this.redraw();
  }
};
