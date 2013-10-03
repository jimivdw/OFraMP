/**
 * Molecule data structure
 */
function Molecule() {
  this.atoms = new AtomList();
  this.bonds = new BondList();
}

Molecule.prototype.init = function(atoms, bonds) {
  this.atoms.init(atoms);
  this.bonds.init(bonds);
}


/**
 * Data structure for a list of atoms
 */
function AtomList() {
  this.atoms = [];
}

AtomList.prototype.init = function(atoms) {
  this.atoms = atoms;
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


/**
 * Data structure for a list of bonds
 */
function BondList() {
  this.bonds = [];
}

BondList.prototype.init = function(bonds) {
  this.bonds = bonds;
}
