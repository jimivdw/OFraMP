function Molecule(mv, atoms, bonds) {
  this.init(mv, atoms, bonds);
}

Molecule.prototype = {
  mv: undefined,
  atoms: undefined,
  bonds: undefined,

  init: function(mv, atoms, bonds) {
    this.mv = mv;
    this.atoms = new AtomList(this, atoms);
    this.bonds = new BondList(this, bonds);
  },

  /*
   * Get the width of this molecule.
   */
  width: function() {
    return this.atoms.width();
  },

  /*
   * Get the height of this molecule.
   */
  height: function() {
    return this.atoms.height();
  },

  /*
   * Get the atom at position (x, y), if any.
   */
  atomAt: function(x, y) {
    return this.atoms.atomAt(x, y);
  },

  /*
   * Set the hovered atom to a (or none if a is undefined).
   */
  setHover: function(a) {
    return this.atoms.setHover(a);
  },

  /*
   * Set the selected atom to a (or none if a is undefined).
   */
  setSelected: function(a) {
    return this.atoms.setSelected(a);
  },

  /*
   * Move the molecule dx in the x direction and dy on the y axis.
   */
  move: function(dx, dy) {
    return this.atoms.move(dx, dy);
  },

  /*
   * Scale the molecule with a factor f.
   */
  scale: function(f) {
    return this.atoms.scale(f);
  },

  /*
   * Zoom on the center of the molecule with a factor f.
   */
  zoom: function(f) {
    return this.atoms.zoom(f);
  },

  /*
   * Zoom on the point (x, y) with a factor f.
   */
  zoomOn: function(x, y, f) {
    return this.atoms.zoomOn(x, y, f);
  },

  /*
   * Center the molecule on the canvas.
   */
  center: function() {
    return this.atoms.center();
  },

  /*
   * Fit the molecule in a bounding box of size w * h.
   */
  bestFit: function(w, h) {
    return this.atoms.bestFit(w, h);
  },

  /*
   * Scale the molecule such that the shortest bond is of size min_bond_length.
   */
  minimize: function() {
    this.center();
    var sd = this.bonds.shortestDistance();
    var f = this.mv.settings.min_bond_length / sd;
    this.zoom(f);
  },

  /*
   * Scale the molecule such that the average bond is of size ideal_bond_length.
   */
  idealize: function() {
    this.center();
    var sd = this.bonds.averageDistance();
    var f = this.mv.settings.ideal_bond_length / sd;
    this.zoom(f);
  },

  /*
   * Scale the molecule such that the longest bond is of size max_bond_length.
   */
  maximize: function() {
    this.center();
    var ld = this.bonds.longestDistance();
    var f = this.mv.settings.max_bond_length / ld;
    this.zoom(f);
  },

  /*
   * Draw the molecule.
   */
  draw: function() {
    this.atoms.draw();
    this.bonds.draw();
  }
};
