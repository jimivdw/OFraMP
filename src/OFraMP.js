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

Molecule.prototype.draw = function(ctx) {
  ctx.clear();
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
  oatoms = Array();
  atoms.forEach(function(a) {
    o = new Atom();
    o.init(a.id, a.element, a.element_id, a.x, a.y);
    oatoms.push(o);
  });
  this.atoms = oatoms;
}

AtomList.prototype.get = function(i) {
  return this.atoms[i];
}

AtomList.prototype.propMin = function(p) {
  min = this.atoms[0][p];
  this.atoms.forEach(function(a) {
    if(a[p] < min)
      min = a[p];
  });
  
  return min;
}

AtomList.prototype.propMax = function(p) {
  max = this.atoms[0][p];
  this.atoms.forEach(function(a) {
    if(a[p] > max)
      max = a[p];
  });
  
  return max;
}

AtomList.prototype.propWidth = function(p) {
  min = this.propMin(p);
  max = this.propMax(p);
  return max - min;
}

AtomList.prototype.width = function() {
  return this.propWidth('x');
}

AtomList.prototype.height = function() {
  return this.propWidth('y');
}

AtomList.prototype.scale = function(f) {
  this.atoms.map(function(a) {
    a.x *= f;
    a.y *= f;
    return a;
  });
}

AtomList.prototype.move = function(dx, dy) {
  this.atoms.map(function(a) {
    a.x += dx;
    a.y += dy;
    return a;
  });
}

AtomList.prototype.bestFit = function(w, h) {
  wf = w / this.width();
  hf = h / this.height();
  f = wf < hf ? wf : hf;
  console.log(w, this.width(), wf, hf, f);
  this.scale(f);

  tx = w / 2 - this.width() / 2;
  ty = h / 2 - this.height() / 2;
  dx = tx - this.propMin('x');
  dy = ty - this.propMin('y');
  console.log(tx, ty, dx, dy);
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
  this.charge = 0.;
}

Atom.prototype.init = function(id, element, element_id, x, y, charge) {
  this.id = id;
  this.element = element;
  this.element_id = element_id;
  this.x = x;
  this.y = y;
  this.charge = charge;
}

Atom.prototype.draw = function(ctx) {
  ctx.fillText(this.element, this.x, this.y);
}


/**
 * Data structure for a list of bonds
 */
function BondList() {
  this.bonds = [];
}

BondList.prototype.init = function(bonds, atoms) {
  obonds = Array();
  bonds.forEach(function(b) {
    o = new Bond();
    o.init(atoms.get(b.a1), atoms.get(b.a2), b.type);
    obonds.push(o);
  });
  this.bonds = obonds;
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

Bond.prototype.draw = function(ctx) {
  ctx.drawLine(this.a1.x, this.a1.y, this.a2.x, this.a2.y);
}

