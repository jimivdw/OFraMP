var DEFAULT_SETTINGS = {
  interactive: false,

  oapoc_url: "http://vps955.directvps.nl/OAPoC/",

  min_bond_length: 50,
  ideal_bond_length: 70,
  max_bond_length: 150,

  draw_atom_circ: true,
  draw_h_atoms: true,

  canvas_padding: 40,
  canvas_cursor_normal: "default",
  canvas_cursor_drag: "move",
  canvas_cursor_click: "pointer",

  message_border_width: 40,
  message_border_color: "rgba(0, 0, 0, .8)",
  message_padding: 10,
  message_font: "40px Arial",
  message_color: "rgb(0, 0, 0)",
  message_bg_colors: {
    1: "rgba(255, 255, 255, .5)",
    2: "rgba(253, 198, 137, .5)",
    3: "rgba(246, 150, 121, .5)",
    4: "rgba(189, 140, 191, .5)",
    5: "rgba(131, 147, 202, .5)"
  },

  atom_font: "bold 12px Arial",
  atom_charge_font: "9px Arial",
  atom_colors: {
    S: "#b2b200",
    O: "#ff0000",
    N: "#004dff",
    H: "#707070",
    F: "#66cd00",
    Cl: "#66cd00",
    Br: "#66cd00",
    I: "#66cd00",
    other: "#000000"
  },
  atom_charge_color: "rgb(0, 0, 0)",
  atom_radius: 10,
  atom_radius_charged: 20,
  atom_border_widths: {
    1: 1,
    2: 3,
    3: 3
  },
  atom_border_color: "rgb(0, 0, 0)",
  atom_bg_colors: {
    1: "rgb(255, 255, 255)",
    2: "rgb(204, 166,  40)",
    3: "rgb(203,  83,  73)"
  },

  bond_width: 1,
  bond_color: "rgb(0, 0, 0)",
  bond_spacing: 4,
  bond_dash_count: 5
};

/*
 * Nice colors: Gray: rgb(148, 148, 148) Green: rgb( 80, 169, 75) Blue: rgb( 76,
 * 81, 178) Red: rgb(203, 83, 73) Yellow: rgb(204, 166, 40) Brown: rgb(127, 79,
 * 66) Purple: rgb(227, 119, 219)
 */

var MESSAGE_TYPES = {
  info: 1,
  warning: 2,
  error: 3,
  critical: 4,
  debug: 5
};

var ATOM_STATUSES = {
  normal: 1,
  hover: 2,
  selected: 3
};


Object.prototype.merge = function(other, nondestructive) {
  if(nondestructive) {
    var r = {};
    for( var k in this)
      r[k] = this[k];
  } else {
    var r = this;
  }
  for( var k in other)
    r[k] = other[k];
  return r;
};

Object.prototype.copy = function() {
  return this.merge({}, true);
};

// Based on:
// http://stackoverflow.com/questions/8730262/extract-keys-from-javascript-object-and-use-as-variables
Object.prototype.extract = function(tgt) {
  for( var k in this) {
    tgt[k] = this[k];
  }
};

Object.prototype.show = function() {
  var s = "{";
  for( var k in this) {
    if(typeof this[k] != "function") {
      if(typeof this[k] == "object")
        d = "object";
      else
        d = this[k];
      s += k + ": " + d + ", ";
    }
  }
  return s.substr(0, s.length - 2) + "}";
};

// From:
// http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

Array.prototype.toBack = function(i) {
  var e = this.splice(i, 1)[0];
  if(e === undefined)
    return this.length;
  else
    return this.push(e);
};


MouseEvent.prototype.getX = function() {
  return this.clientX - this.target.offsetLeft + document.body.scrollLeft;
};

MouseEvent.prototype.getY = function() {
  return this.clientY - this.target.offsetTop + document.body.scrollTop;
};


CanvasRenderingContext2D.prototype.clear = function() {
  this.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

CanvasRenderingContext2D.prototype.drawLine = function(x1, y1, x2, y2) {
  this.beginPath();
  this.moveTo(x1, y1);
  this.lineTo(x2, y2);
  this.closePath();
  this.stroke();
};

CanvasRenderingContext2D.prototype.drawDashedLine = function(x1, y1, x2, y2, n) {
  dx = x2 - x1;
  dy = y2 - y1;
  dz = Math.sqrt(dx * dx + dy * dy);

  n = n || 2;
  l = dz / (n * 2 - 1);

  ddx = dx * l / dz;
  ddy = dy * l / dz;
  for( var i = 0; i < n; i++) {
    this.drawLine(x1 + 2 * i * ddx, y1 + 2 * i * ddy, x1 + (2 * i + 1) * ddx,
        y1 + (2 * i + 1) * ddy);
  }
};

// Based on:
// http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial
CanvasRenderingContext2D.prototype.textLines = function(x, y, w, h, text,
    hard_wrap) {
  var ctx = this;

  var lines = Array();
  var hard_lines = text.trim().split("\n");
  hard_lines.forEach(function(hard_line) {
    if(ctx.measureText(hard_line).width > w) {
      var line = "";
      var words = hard_line.split(" ");
      words.forEach(function(word) {
        var nline = line + word + " ";
        if(ctx.measureText(nline).width > w) {
          lines.push(line);

          if(ctx.measureText(word).width > w && hard_wrap) {
            line = "";
            var chars = word.split("");
            chars.forEach(function(char) {
              var nline = line + char;
              if(ctx.measureText(nline).width > w) {
                lines.push(line);
                line = char;
              } else {
                line = nline;
              }
            });
            line += " ";
          } else {
            line = word + " ";
          }
        } else {
          line = nline;
        }
      });
      lines.push(line);
    } else {
      lines.push(hard_line);
    }
  });
  return lines;
};

CanvasRenderingContext2D.prototype.boxedFillText = function(x, y, w, h, text,
    hard_wrap) {
  var ctx = this;

  var lines = ctx.textLines(x, y, w, h, text, hard_wrap);
  var lineHeight = parseInt(ctx.font.split("px")[0]) * 1.2;

  var min_y = y;
  var max_y = y + h;
  var ll = lines.length - 1;
  switch(ctx.textBaseline.toLowerCase()) {
    case "bottom":
      min_y = y - h + lineHeight;
      max_y = y;
      y -= ll * lineHeight;
      if(y < min_y)
        y = min_y;
      break;

    case "middle":
      min_y = y - h / 2 + lineHeight / 2;
      max_y = y + h / 2 - lineHeight / 2;
      y -= (ll / 2) * lineHeight;
      if(y < min_y)
        y = min_y;
      break;

    default:
      break;
  }

  lines.forEach(function(line) {
    if(y <= max_y) {
      ctx.fillText(line, x, y);
    }
    y += lineHeight;
  });
};


function MoleculeViewer() {
  this.molecule = new Molecule();
  this.canvas = undefined;
  this.ctx = undefined;

  this.overlay_showing = false;
  this.overlay_msg = "";
  this.overlay_status = 1;

  this.settings = DEFAULT_SETTINGS.copy();
}

MoleculeViewer.prototype.init = function(canvas_id, settings) {
  var mv = this;
  this.canvas = document.getElementById(canvas_id);

  var ctx = this.canvas.getContext("2d");
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  this.ctx = ctx;

  this.settings.merge(settings);

  if(this.settings.interactive) {
    // TODO: Not supported in Firefox!
    this.canvas.onmousewheel = function(e) {
      if(!mv.overlay_showing) {
        if(e.wheelDelta > 0) {
          var f = 1.1;
        } else {
          var f = 0.9;
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
  }
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
        mv.molecule.init(mv, md.atoms, md.bonds);
        mv.hideOverlay();

        mv.bestFit();
      } else {
        mv.showOverlay("Missing data, received: " + md.show(),
            MESSAGE_TYPES.critical);
      }
    } else if(xhr.status != 200) {
      mv.showOverlay("Could not connect to server", MESSAGE_TYPES.critical);
    }
  };

  xhr.open("POST", this.settings.oapoc_url, true);
  xhr.setRequestHeader("Content-type", "application/json");
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
  this.molecule.draw();
  if(this.overlay_showing) {
    this.showOverlay();
  }
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

  this.molecule.zoomOn(x, y, f);
  this.redraw();
};

MoleculeViewer.prototype.zoom = function(f) {
  if(!this.settings.interactive)
    return;

  this.molecule.zoom(f);
  this.redraw();
};

MoleculeViewer.prototype.bestFit = function() {
  this.molecule.bestFit(this.canvas.width, this.canvas.height);
  this.redraw();
};


/**
 * Molecule data structure
 */
function Molecule() {
  this.mv = undefined;
  this.atoms = new AtomList();
  this.bonds = new BondList();
}

Molecule.prototype.init = function(mv, atoms, bonds) {
  this.mv = mv;
  this.atoms.init(this, atoms);
  this.bonds.init(this, bonds);
};

Molecule.prototype.width = function() {
  return this.atoms.width();
};

Molecule.prototype.height = function() {
  return this.atoms.height();
};

Molecule.prototype.atomAt = function(x, y) {
  return this.atoms.atomAt(x, y);
};

Molecule.prototype.setHover = function(a) {
  return this.atoms.setHover(a);
};

Molecule.prototype.setSelected = function(a) {
  return this.atoms.setSelected(a);
};

Molecule.prototype.move = function(dx, dy) {
  return this.atoms.move(dx, dy);
};

Molecule.prototype.scale = function(f) {
  return this.atoms.scale(f);
};

Molecule.prototype.zoomOn = function(x, y, f) {
  return this.atoms.zoomOn(x, y, f);
};

Molecule.prototype.zoom = function(f) {
  return this.atoms.zoom(f);
};

Molecule.prototype.bestFit = function(w, h) {
  return this.atoms.bestFit(w, h);
};

Molecule.prototype.minimize = function() {
  var sd = this.bonds.shortestDistance();
  var f = this.mv.settings.min_bond_length / sd;
  this.zoom(f);
};

Molecule.prototype.idealize = function() {
  var sd = this.bonds.shortestDistance();
  var f = this.mv.settings.ideal_bond_length / sd;
  this.zoom(f);
};

Molecule.prototype.maximize = function() {
  var ld = this.bonds.longestDistance();
  var f = this.mv.settings.max_bond_length / ld;
  this.zoom(f);
};

Molecule.prototype.draw = function() {
  this.atoms.draw();
  this.bonds.draw();
};


/**
 * Data structure for a list of atoms
 */
function AtomList() {
  this.molecule = undefined;
  this.atoms = [];
}

AtomList.prototype.init = function(molecule, atoms) {
  this.molecule = molecule;
  var al = this;
  al.atoms = [];
  atoms.forEach(function(a) {
    var o = new Atom();
    o.init(al, a.id, a.element, a.element_id, a.x, a.y);
    al.atoms.push(o);
  });
};

AtomList.prototype.get = function(id) {
  // TODO: modify OAPoC so that it does not modify ids
  id += 1;
  return this.atoms[this.indexOf(id)];
};

AtomList.prototype.indexOf = function(id) {
  for( var i = 0; i < this.atoms.length; i++) {
    if(this.atoms[i].id == id)
      return i;
  }
};

AtomList.prototype.propMin = function(p) {
  var min = this.atoms[0][p];
  this.atoms.forEach(function(a) {
    if(a[p] < min)
      min = a[p];
  });

  return min;
};

AtomList.prototype.propMax = function(p) {
  var max = this.atoms[0][p];
  this.atoms.forEach(function(a) {
    if(a[p] > max)
      max = a[p];
  });

  return max;
};

AtomList.prototype.propWidth = function(p) {
  var min = this.propMin(p);
  var max = this.propMax(p);
  return max - min;
};

AtomList.prototype.width = function() {
  return this.propWidth('x');
};

AtomList.prototype.height = function() {
  return this.propWidth('y');
};

AtomList.prototype.leftTop = function() {
  return {
    x: this.propMin('x'),
    y: this.propMin('y')
  };
};

AtomList.prototype.center = function() {
  var lt = this.leftTop();
  var s = this.size();
  return {
    x: lt.x + s.w / 2,
    y: lt.y + s.h / 2
  };
};

AtomList.prototype.size = function() {
  return {
    w: this.width(),
    h: this.height()
  };
};

AtomList.prototype.atomAt = function(x, y) {
  for( var i = 0; i < this.atoms.length; i++) {
    if(this.atoms[i].touches(x, y))
      return this.atoms[i];
  }
};

AtomList.prototype.setHover = function(h) {
  var changed = false;
  this.atoms.forEach(function(a) {
    if(a.status === ATOM_STATUSES.hover && a !== h) {
      a.status = ATOM_STATUSES.normal;
      changed = true;
    }
  });

  var s = this.molecule.mv.settings;
  var c = this.molecule.mv.canvas;
  if(h) {
    if(h.status === ATOM_STATUSES.normal) {
      h.status = ATOM_STATUSES.hover;
      this.atoms.toBack(this.indexOf(h.id));
      changed = true;
    }
    if(h.status === ATOM_STATUSES.hover) {
      c.style.cursor = s.canvas_cursor_click;
    } else {
      c.style.cursor = s.canvas_cursor_normal;
    }
  } else {
    c.style.cursor = s.canvas_cursor_drag;
  }

  return changed;
};

AtomList.prototype.setSelected = function(s) {
  var changed = false;
  this.atoms.forEach(function(a) {
    if(a.status === ATOM_STATUSES.selected && a !== s) {
      a.status = ATOM_STATUSES.normal;
      changed = true;
    }
  });

  var t = this.molecule.mv.settings;
  var c = this.molecule.mv.canvas;
  if(s && s.status !== ATOM_STATUSES.selected) {
    s.status = ATOM_STATUSES.selected;
    this.atoms.toBack(this.indexOf(s.id));
    c.style.cursor = t.canvas_cursor_normal;
    changed = true;
  }

  return changed;
};

AtomList.prototype.move = function(dx, dy) {
  this.atoms.map(function(a) {
    a.x += dx;
    a.y += dy;
    return a;
  });
};

AtomList.prototype.scale = function(f) {
  this.atoms.map(function(a) {
    a.x *= f;
    a.y *= f;
    return a;
  });
};

AtomList.prototype.zoom = function(f) {
  var c = this.center();
  this.zoomOn(c.x, c.y, f);
};

AtomList.prototype.zoomOn = function(x, y, f) {
  this.move(-x, -y);
  this.scale(f);
  this.move(x, y);
};

AtomList.prototype.bestFit = function(w, h) {
  var s = this.molecule.mv.settings;
  var wf = (w - s.canvas_padding) / this.width();
  var hf = (h - s.canvas_padding) / this.height();
  var f = wf < hf ? wf : hf;
  this.scale(f);

  var tx = w / 2 - this.width() / 2;
  var ty = h / 2 - this.height() / 2;
  var dx = tx - this.propMin('x');
  var dy = ty - this.propMin('y');
  this.move(dx, dy);
};

AtomList.prototype.draw = function() {
  this.atoms.forEach(function(a) {
    a.draw();
  });
};


/**
 * Data structure for an atom
 */
function Atom() {
  this.list = undefined;
  this.id = 0;
  this.element = "";
  this.element_id = 0;
  this.x = 0.;
  this.y = 0.;
  this.charge = undefined;
  this.show = true;
  this.status = ATOM_STATUSES.normal;
}

Atom.prototype.init = function(list, id, element, element_id, x, y, charge) {
  this.list = list;
  this.id = id;
  this.element = element;
  this.element_id = element_id;
  this.x = x;
  this.y = y;
  this.charge = charge || 0.231;
  if(element == "H" && !list.molecule.mv.settings.draw_h_atoms)
    this.show = false;
};

Atom.prototype.dx = function(a) {
  return a.x - this.x;
};

Atom.prototype.dy = function(a) {
  return a.y - this.y;
};

Atom.prototype.distance = function(a) {
  return Math.sqrt(Math.pow(this.dx(a), 2) + Math.pow(this.dy(a), 2));
};

Atom.prototype.isCharged = function() {
  return this.charge !== undefined;
};

Atom.prototype.touches = function(x, y) {
  var s = this.list.molecule.mv.settings;
  if(this.isCharged())
    var r = s.atom_radius_charged;
  else
    var r = s.atom_radius;

  var dx = this.x - x;
  var dy = this.y - y;
  return Math.sqrt(dx * dx + dy * dy) <= r;
};

Atom.prototype.getColor = function() {
  var c = this.list.molecule.mv.settings.atom_colors[this.element];
  return c || this.list.molecule.mv.settings.atom_colors["other"];
};

Atom.prototype.draw = function() {
  if(!this.show)
    return;

  var ctx = this.list.molecule.mv.ctx;
  var s = this.list.molecule.mv.settings;

  if(this.isCharged()) {
    if(s.draw_atom_circ) {
      ctx.lineWidth = s.atom_border_widths[this.status];
      ctx.strokeStyle = s.atom_border_color;
      ctx.fillStyle = s.atom_bg_colors[this.status];
      ctx.beginPath();
      ctx.arc(this.x, this.y, s.atom_radius_charged, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = s.atom_font;
    ctx.fillStyle = this.getColor();
    ctx.fillText(this.element, this.x, this.y - 6);
    ctx.font = s.atom_charge_font;
    ctx.fillStyle = s.atom_charge_color;
    ctx.fillText(this.charge, this.x, this.y + 6);
  } else {
    if(s.draw_atom_circ) {
      ctx.lineWidth = s.atom_border_widths[this.status];
      ctx.strokeStyle = s.atom_border_color;
      ctx.fillStyle = s.atom_bg_colors[this.status];
      ctx.beginPath();
      ctx.arc(this.x, this.y, s.atom_radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = s.atom_font;
    ctx.fillStyle = this.getColor();
    ctx.fillText(this.element, this.x, this.y);
  }
};


/**
 * Data structure for a list of bonds
 */
function BondList() {
  this.molecule = undefined;
  this.bonds = [];
}

BondList.prototype.init = function(molecule, bonds) {
  this.molecule = molecule;
  var atoms = molecule.atoms;

  var bl = this;
  bl.bonds = [];
  bonds.forEach(function(b) {
    var o = new Bond();
    o.init(bl, atoms.get(b.a1), atoms.get(b.a2), b.bond_type);
    bl.bonds.push(o);
  });
};

BondList.prototype.get = function(i) {
  return this.bonds[i];
};

BondList.prototype.shortestLength = function() {
  return this.bonds.map(function(b) {
    return b.length();
  }).min();
};

BondList.prototype.shortestDistance = function() {
  return this.bonds.map(function(b) {
    return b.a1.distance(b.a2);
  }).min();
};

BondList.prototype.longestDistance = function() {
  return this.bonds.map(function(b) {
    return b.a1.distance(b.a2);
  }).max();
};

BondList.prototype.draw = function() {
  this.bonds.forEach(function(b) {
    b.draw();
  });
};


/**
 * Data structure for a bond
 */
function Bond() {
  this.list = undefined;
  this.a1 = undefined;
  this.a2 = undefined;
  this.type = 0;
  this.show = true;
}

Bond.prototype.init = function(list, a1, a2, type) {
  this.list = list;
  this.a1 = a1;
  this.a2 = a2;
  this.type = type;
  if(!a1.show || !a2.show)
    this.show = false;
};

Bond.prototype.coords = function() {
  var s = this.list.molecule.mv.settings;

  // Leave some space around the atom
  var dx = this.a1.dx(this.a2);
  var dy = this.a1.dy(this.a2);
  var dist = this.a1.distance(this.a2);

  if(this.a1.isCharged())
    var ar = s.atom_radius_charged;
  else
    var ar = s.atom_radius;

  var ddx1 = dx * ar / dist;
  var ddy1 = dy * ar / dist;

  if(this.a2.isCharged())
    ar = s.atom_radius_charged;
  else
    ar = s.atom_radius;

  var ddx2 = dx * ar / dist;
  var ddy2 = dy * ar / dist;

  return {
    x1: this.a1.x + ddx1,
    y1: this.a1.y + ddy1,
    x2: this.a2.x - ddx2,
    y2: this.a2.y - ddy2
  };
};

Bond.prototype.length = function() {
  this.coords().extract(window);
  dx = x2 - x1;
  dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

Bond.prototype.draw = function() {
  if(!this.show)
    return;

  var ctx = this.list.molecule.mv.ctx;
  var s = this.list.molecule.mv.settings;
  this.coords().extract(window);

  ctx.lineWidth = s.bond_width;
  ctx.strokeStyle = s.bond_color;

  if(this.type == 1 || this.type == 3)
    ctx.drawLine(x1, y1, x2, y2);

  // Draw double/triple/aromatic bonds
  if(this.type > 1) {
    dx = x2 - x1;
    dy = y2 - y1;
    dist = Math.sqrt(dx * dx + dy * dy);

    ddx = dy * s.bond_spacing / dist;
    ddy = dx * s.bond_spacing / dist;

    ctx.drawLine(x1 + ddx, y1 - ddy, x2 + ddx, y2 - ddy);

    if(this.type == 4)
      ctx.drawDashedLine(x1 - ddx, y1 + ddy, x2 - ddx, y2 + ddy,
          s.bond_dash_count);
    else
      ctx.drawLine(x1 - ddx, y1 + ddy, x2 - ddx, y2 + ddy);
  }
};
