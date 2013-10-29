function Molecule(mv, atoms, bonds) {
  this.mv = mv;
  this.atoms = new AtomList(this, atoms);
  this.bonds = new BondList(this, bonds);
}

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

Molecule.prototype.center = function() {
  return this.atoms.center();
};

Molecule.prototype.bestFit = function(w, h) {
  return this.atoms.bestFit(w, h);
};

Molecule.prototype.minimize = function() {
  this.center();
  var sd = this.bonds.shortestDistance();
  var f = this.mv.settings.min_bond_length / sd;
  this.zoom(f);
};

Molecule.prototype.idealize = function() {
  this.center();
  var sd = this.bonds.averageDistance();
  var f = this.mv.settings.ideal_bond_length / sd;
  this.zoom(f);
};

Molecule.prototype.maximize = function() {
  this.center();
  var ld = this.bonds.longestDistance();
  var f = this.mv.settings.max_bond_length / ld;
  this.zoom(f);
};

Molecule.prototype.draw = function() {
  this.atoms.draw();
  this.bonds.draw();
};
