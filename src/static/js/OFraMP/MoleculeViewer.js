function MoleculeViewer(canvas_id, settings) {
  this.molecule = undefined;
  this.canvas = document.getElementById(canvas_id);
  this.ctx = this.canvas.getContext("2d");
  this.init_context();

  this.overlay_showing = false;
  this.overlay_msg = "";
  this.overlay_status = 1;

  this.settings = DEFAULT_SETTINGS.copy().merge(settings);

  if(this.settings.interactive) {
    this.init_interaction();
  }
}

MoleculeViewer.prototype.init_context = function() {
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'middle';
};

MoleculeViewer.prototype.init_interaction = function() {
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
};

MoleculeViewer.prototype.showMolecule = function(data_str) {
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

      if(md.error) {
        mv.showOverlay(md.error, MESSAGE_TYPES.error);
      } else if(md.atoms && md.bonds) {
        mv.showOverlay("Initializing molecule...");
        mv.molecule = new Molecule(mv, md.atoms, md.bonds);
        mv.hideOverlay();

        mv.idealize();// bestFit();
      } else {
        mv.showOverlay("Missing data, received: " + md.show(),
            MESSAGE_TYPES.critical);
      }
    } else if(xhr.status != 200) {
      mv.showOverlay("Could not connect to server", MESSAGE_TYPES.critical);
    }
  };

  xhr.open("POST", this.settings.oapoc_url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send("fmt=smiles&data=" + data_str);
};

MoleculeViewer.prototype.showOverlay = function(msg, status) {
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
  ctx.fillRect(bw, bw, this.canvas.width - 2 * bw, this.canvas.height - 2 * bw);

  ctx.font = this.settings.message_font;
  ctx.fillStyle = this.settings.message_color;
  var p = this.settings.message_padding + bw;
  ctx.boxedFillText(this.canvas.width / 2, this.canvas.height / 2,
      this.canvas.width - 2 * p, this.canvas.height - 2 * p, msg, true);

  this.canvas.style.cursor = this.settings.canvas_cursor_normal;

  this.overlay_showing = true;
  this.overlay_msg = msg;
  this.overlay_status = status;
};

MoleculeViewer.prototype.hideOverlay = function() {
  this.overlay_showing = false;
  this.redraw();
};

MoleculeViewer.prototype.redraw = function() {
  this.ctx.clear();
  if(this.molecule)
    this.molecule.draw();
  if(this.overlay_showing)
    this.showOverlay();
};

MoleculeViewer.prototype.move = function(dx, dy) {
  if(!this.settings.interactive)
    return;

  this.molecule.move(dx, dy);
  this.redraw();
};

MoleculeViewer.prototype.zoomOn = function(x, y, f) {
  if(!this.settings.interactive)
    return;

  // Restrict minimum and maximum zoom
  var ad = this.molecule.bonds.averageDistance()
  if(f < 1 && ad < this.settings.min_zoom || f > 1
      && ad > this.settings.max_zoom)
    return;

  this.molecule.zoomOn(x, y, f);
  this.redraw();
};

MoleculeViewer.prototype.zoom = function(f) {
  if(!this.settings.interactive)
    return;

  // Restrict minimum and maximum zoom
  var ad = this.molecule.bonds.averageDistance()
  if(f < 1 && ad < this.settings.min_zoom || f > 1
      && ad > this.settings.max_zoom)
    return;

  this.molecule.zoom(f);
  this.redraw();
};

MoleculeViewer.prototype.bestFit = function() {
  this.molecule.bestFit(this.canvas.width, this.canvas.height);
  this.redraw();
};

MoleculeViewer.prototype.idealize = function() {
  this.molecule.idealize();
  this.redraw();
}
