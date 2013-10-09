var CANVAS_PADDING = 40;
var ATOM_RADIUS = 10;
var ATOM_RADIUS_CHARGED = 20;
var BOND_SPACING = 4;
var DASH_COUNT = 5;
var MIN_BOND_LENGTH = 50;
var IDEAL_BOND_LENGTH = 70;
var MAX_BOND_LENGTH = 150;
var MESSAGE_TYPES = {
  info: 1,
  warning: 2,
  error: 3,
  critical: 4,
  debug: 5
}
var MESSAGE_COLORS = {
  1: "rgba(255, 255, 255, .5)",
  2: "rgba(253, 198, 137, .5)",
  3: "rgba(246, 150, 121, .5)",
  4: "rgba(189, 140, 191, .5)",
  5: "rgba(131, 147, 202, .5)"
}
var OAPoC_URL = document.URL.match(/vps955\.directvps\.nl/) ? "http://vps955.directvps.nl/OAPoC/"
    : "http://127.0.0.1:8000/";


// Based on:
// http://stackoverflow.com/questions/8730262/extract-keys-from-javascript-object-and-use-as-variables
Object.prototype.extract = function(tgt) {
  for( var k in this) {
    tgt[k] = this[k];
  }
}

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
}

// From:
// http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

CanvasRenderingContext2D.prototype.clear = function() {
  this.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

CanvasRenderingContext2D.prototype.drawLine = function(x1, y1, x2, y2) {
  this.beginPath();
  this.moveTo(x1, y1);
  this.lineTo(x2, y2);
  this.closePath();
  this.stroke();
}

CanvasRenderingContext2D.prototype.drawDashedLine = function(x1, y1, x2, y2, n) {
  dx = x2 - x1;
  dy = y2 - y1;
  dz = Math.sqrt(dx * dx + dy * dy);

  n = n || DASH_COUNT;
  l = dz / (n * 2 - 1);

  ddx = dx * l / dz;
  ddy = dy * l / dz;
  for( var i = 0; i < n; i++) {
    this.drawLine(x1 + 2 * i * ddx, y1 + 2 * i * ddy, x1 + (2 * i + 1) * ddx,
        y1 + (2 * i + 1) * ddy);
  }
}

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
  };

  lines.forEach(function(line) {
    if(y <= max_y) {
      ctx.fillText(line, x, y);
    }
    y += lineHeight;
  });
}


function MoleculeViewer() {
  this.molecule = new Molecule();
  this.canvas = undefined;
  this.ctx = undefined;

  this.overlay_showing = false;
  this.overlay_msg = "";
  this.overlay_status = 1;

  this.interactive = false;
}

MoleculeViewer.prototype.init = function(canvas_id, interactive) {
  this.canvas = document.getElementById(canvas_id);

  var ctx = this.canvas.getContext("2d");
  ctx.font = "12px Arial";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = '#000';
  this.ctx = ctx;

  if(interactive !== undefined)
    this.interactive = interactive;
}

MoleculeViewer.prototype.showMolecule = function(data_str) {
  this.showOverlay("Loading molecule data...", MESSAGE_TYPES.info);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", OAPoC_URL, false);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send("fmt=smiles&data=" + data_str);

  var md = JSON.parse(xhr.response);
  console.log("md", md);

  if(md.error) {
    this.showOverlay(md.error, MESSAGE_TYPES.error);
  } else if(md.atoms && md.bonds) {
    this.showOverlay("Initializing molecule...", MESSAGE_TYPES.info);
    this.molecule.init(md.atoms, md.bonds);
    this.hideOverlay();

    this.bestFit();
  } else {
    this.showOverlay("Missing data, received: " + md.show(),
        MESSAGE_TYPES.critical);
  }
}

MoleculeViewer.prototype.showOverlay = function(msg, status) {
  if(this.overlay_showing) {
    this.hideOverlay();
  }

  msg = msg || this.overlay_msg;
  status = status || this.overlay_status;

  var ctx = this.ctx;
  ctx.fillStyle = "rgba(0, 0, 0, .8)";
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  ctx.fillStyle = MESSAGE_COLORS[status];
  ctx.fillRect(40, 40, this.canvas.width - 80, this.canvas.height - 80);

  ctx.fillStyle = "#000000";
  ctx.font = "40px Arial";
  ctx.boxedFillText(this.canvas.width / 2, this.canvas.height / 2,
      this.canvas.width - 100, this.canvas.height - 100, msg, true);
  ctx.font = "12px Arial";

  this.overlay_showing = true;
  this.overlay_msg = msg;
  this.overlay_status = status;
}

MoleculeViewer.prototype.hideOverlay = function() {
  this.overlay_showing = false;
  this.redraw();
}

MoleculeViewer.prototype.redraw = function() {
  this.ctx.clear();
  this.molecule.draw(this.ctx);
  if(this.overlay_showing) {
    this.showOverlay();
  }
}

MoleculeViewer.prototype.move = function(dx, dy) {
  if(!this.interactive)
    return;

  this.molecule.move(dx, dy);
  this.redraw();
}

MoleculeViewer.prototype.zoom = function(f) {
  if(!this.interactive)
    return;

  this.molecule.zoom(f);
  this.redraw();
}

MoleculeViewer.prototype.bestFit = function() {
  this.molecule.bestFit(this.canvas.width, this.canvas.height);
  this.redraw();
}


/**
 * Molecule data structure
 */
function Molecule() {
  this.atoms = new AtomList();
  this.bonds = new BondList();
}

Molecule.prototype.init = function(atoms, bonds) {
  this.atoms.init(atoms);
  this.bonds.init(bonds, this.atoms);
}

Molecule.prototype.width = function() {
  return this.atoms.width();
}

Molecule.prototype.height = function() {
  return this.atoms.height();
}

Molecule.prototype.move = function(dx, dy) {
  return this.atoms.move(dx, dy);
}

Molecule.prototype.scale = function(f) {
  return this.atoms.scale(f);
}

Molecule.prototype.zoom = function(f) {
  return this.atoms.zoom(f);
}

Molecule.prototype.bestFit = function(w, h) {
  return this.atoms.bestFit(w, h);
}

Molecule.prototype.minimize = function() {
  var sd = this.bonds.shortestDistance();
  var f = MIN_BOND_LENGTH / sd;
  this.zoom(f);
}

Molecule.prototype.idealize = function() {
  var sd = this.bonds.shortestDistance();
  var f = IDEAL_BOND_LENGTH / sd;
  this.zoom(f);
}

Molecule.prototype.maximize = function() {
  var ld = this.bonds.longestDistance();
  var f = MAX_BOND_LENGTH / ld;
  this.zoom(f);
}

Molecule.prototype.draw = function(ctx) {
  this.atoms.draw(ctx);
  this.bonds.draw(ctx);
}


/**
 * Data structure for a list of atoms
 */
function AtomList() {
  this.atoms = [];
}

AtomList.prototype.init = function(atoms) {
  var oatoms = Array();
  atoms.forEach(function(a) {
    var o = new Atom();
    o.init(a.id, a.element, a.element_id, a.x, a.y);
    oatoms.push(o);
  });
  this.atoms = oatoms;
}

AtomList.prototype.get = function(i) {
  return this.atoms[i];
}

AtomList.prototype.propMin = function(p) {
  var min = this.atoms[0][p];
  this.atoms.forEach(function(a) {
    if(a[p] < min)
      min = a[p];
  });

  return min;
}

AtomList.prototype.propMax = function(p) {
  var max = this.atoms[0][p];
  this.atoms.forEach(function(a) {
    if(a[p] > max)
      max = a[p];
  });

  return max;
}

AtomList.prototype.propWidth = function(p) {
  var min = this.propMin(p);
  var max = this.propMax(p);
  return max - min;
}

AtomList.prototype.width = function() {
  return this.propWidth('x');
}

AtomList.prototype.height = function() {
  return this.propWidth('y');
}

AtomList.prototype.leftTop = function() {
  return {
    x: this.propMin('x'),
    y: this.propMin('y')
  };
}

AtomList.prototype.center = function() {
  var lt = this.leftTop();
  var s = this.size();
  return {
    x: lt.x + s.w / 2,
    y: lt.y + s.h / 2
  }
}

AtomList.prototype.size = function() {
  return {
    w: this.width(),
    h: this.height()
  };
}

AtomList.prototype.move = function(dx, dy) {
  this.atoms.map(function(a) {
    a.x += dx;
    a.y += dy;
    return a;
  });
}

AtomList.prototype.scale = function(f) {
  this.atoms.map(function(a) {
    a.x *= f;
    a.y *= f;
    return a;
  });
}

AtomList.prototype.zoom = function(f) {
  var c = this.center();
  this.zoomOn(c.x, c.y, f);
}

AtomList.prototype.zoomOn = function(x, y, f) {
  this.move(-x, -y);
  this.scale(f);
  this.move(x, y);
}

AtomList.prototype.bestFit = function(w, h) {
  var wf = (w - CANVAS_PADDING) / this.width();
  var hf = (h - CANVAS_PADDING) / this.height();
  var f = wf < hf ? wf : hf;
  this.scale(f);

  var tx = w / 2 - this.width() / 2;
  var ty = h / 2 - this.height() / 2;
  var dx = tx - this.propMin('x');
  var dy = ty - this.propMin('y');
  this.move(dx, dy);
}

AtomList.prototype.draw = function(ctx) {
  this.atoms.forEach(function(a) {
    a.draw(ctx);
  });
}


/**
 * Data structure for an atom
 */
function Atom() {
  this.id = 0;
  this.element = "";
  this.element_id = 0;
  this.x = 0.;
  this.y = 0.;
  this.charge = undefined;
}

Atom.prototype.init = function(id, element, element_id, x, y, charge) {
  this.id = id;
  this.element = element;
  this.element_id = element_id;
  this.x = x;
  this.y = y;
  this.charge = charge;
}

Atom.prototype.dx = function(a) {
  return a.x - this.x;
}

Atom.prototype.dy = function(a) {
  return a.y - this.y;
}

Atom.prototype.distance = function(a) {
  return Math.sqrt(Math.pow(this.dx(a), 2) + Math.pow(this.dy(a), 2));
}

Atom.prototype.isCharged = function() {
  return this.charge !== undefined;
}

Atom.prototype.draw = function(ctx) {
  if(this.isCharged()) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, ATOM_RADIUS_CHARGED, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillText(this.element, this.x, this.y - 6);
    ctx.font = "9px Arial";
    ctx.fillText(this.charge, this.x, this.y + 6);
    ctx.font = "12px Arial";
  } else {
    ctx.beginPath();
    ctx.arc(this.x, this.y, ATOM_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillText(this.element, this.x, this.y);
  }
}


/**
 * Data structure for a list of bonds
 */
function BondList() {
  this.bonds = [];
}

BondList.prototype.init = function(bonds, atoms) {
  var obonds = Array();
  bonds.forEach(function(b) {
    var o = new Bond();
    o.init(atoms.get(b.a1), atoms.get(b.a2), b.bond_type);
    obonds.push(o);
  });
  this.bonds = obonds;
}

BondList.prototype.get = function(i) {
  return this.bonds[i];
}

BondList.prototype.shortestLength = function() {
  return this.bonds.map(function(b) {
    return b.length();
  }).min();
}

BondList.prototype.shortestDistance = function() {
  return this.bonds.map(function(b) {
    return b.a1.distance(b.a2);
  }).min();
}

BondList.prototype.longestDistance = function() {
  return this.bonds.map(function(b) {
    return b.a1.distance(b.a2);
  }).max();
}

BondList.prototype.draw = function(ctx) {
  this.bonds.forEach(function(b) {
    b.draw(ctx);
  });
}


/**
 * Data structure for a bond
 */
function Bond() {
  this.a1 = undefined;
  this.a2 = undefined;
  this.type = 0;
}

Bond.prototype.init = function(a1, a2, type) {
  this.a1 = a1;
  this.a2 = a2;
  this.type = type;
}

Bond.prototype.coords = function() {
  // Leave some space around the atom
  var dx = this.a1.dx(this.a2);
  var dy = this.a1.dy(this.a2);
  var dist = this.a1.distance(this.a2);

  if(this.a1.isCharged())
    var ar = ATOM_RADIUS_CHARGED;
  else
    var ar = ATOM_RADIUS;

  var ddx1 = dx * ar / dist;
  var ddy1 = dy * ar / dist;

  if(this.a2.isCharged())
    ar = ATOM_RADIUS_CHARGED;
  else
    ar = ATOM_RADIUS;

  var ddx2 = dx * ar / dist;
  var ddy2 = dy * ar / dist;

  return {
    x1: this.a1.x + ddx1,
    y1: this.a1.y + ddy1,
    x2: this.a2.x - ddx2,
    y2: this.a2.y - ddy2
  }
}

Bond.prototype.length = function() {
  this.coords().extract(window);
  dx = x2 - x1;
  dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

Bond.prototype.draw = function(ctx) {
  this.coords().extract(window);

  if(this.type == 1 || this.type == 3)
    ctx.drawLine(x1, y1, x2, y2);

  // Draw double/triple/aromatic bonds
  if(this.type > 1) {
    dx = x2 - x1;
    dy = y2 - y1;
    dist = Math.sqrt(dx * dx + dy * dy);

    ddx = dy * BOND_SPACING / dist;
    ddy = dx * BOND_SPACING / dist;

    ctx.drawLine(x1 + ddx, y1 - ddy, x2 + ddx, y2 - ddy);

    if(this.type == 4)
      ctx.drawDashedLine(x1 - ddx, y1 + ddy, x2 - ddx, y2 + ddy);
    else
      ctx.drawLine(x1 - ddx, y1 + ddy, x2 - ddx, y2 + ddy);
  }
}
