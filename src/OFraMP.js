var CANVAS_PADDING = 40;
var ATOM_RADIUS = 10;
var ATOM_RADIUS_CHARGED = 20;
var BOND_SPACING = 4;
var DASH_COUNT = 5;
var OAPoC_URL = document.URL.match(/vps955\.directvps\.nl/) ? "http://vps955.directvps.nl:12345/OAPoC/"
    : "http://127.0.0.1:8000/OAPoC/";


Object.prototype.extract = function(tgt) {
  for(var k in this) {
    tgt[k] = this[k];
  }
}

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


function MoleculeViewer() {
  this.molecule = new Molecule();
  this.canvas = undefined;
  this.ctx = undefined;
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
  var xhr = new XMLHttpRequest();
  xhr.open("POST", OAPoC_URL, false);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send("fmt=smiles&data=" + data_str);

  var md = JSON.parse(xhr.response);
  this.molecule.init(md.atoms, md.bonds);
  this.bestFit();
}

MoleculeViewer.prototype.redraw = function() {
  this.ctx.clear();
  this.molecule.draw(this.ctx);
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
    ctx.fillText(this.element, this.x, this.y - 6);
    ctx.font = "9px Arial";
    ctx.fillText(this.charge, this.x, this.y + 6);
    ctx.font = "12px Arial";
  } else {
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
