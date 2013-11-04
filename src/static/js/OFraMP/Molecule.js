function Molecule(mv, atoms, bonds, data_str) {
  this.init(mv, atoms, bonds, data_str);
}

Molecule.prototype = {
  mv: undefined,
  atoms: undefined,
  bonds: undefined,
  data_str: undefined,

  init: function(mv, atoms, bonds, data_str) {
    this.mv = mv;
    this.atoms = new AtomList(this, atoms);
    this.bonds = new BondList(this, bonds);
    this.data_str = data_str;
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
    var sd = this.bonds.shortestDistance();
    var f = this.mv.settings.zoom.min_bond_length / sd;
    this.zoom(f);
    this.center();
  },

  /*
   * Scale the molecule such that the average bond is of size ideal_bond_length.
   */
  idealize: function() {
    var sd = this.bonds.averageDistance();
    var f = this.mv.settings.zoom.ideal_bond_length / sd;
    this.zoom(f);
    this.center();
  },

  /*
   * Scale the molecule such that the longest bond is of size max_bond_length.
   */
  maximize: function() {
    var ld = this.bonds.longestDistance();
    var f = this.mv.settings.zoom.max_bond_length / ld;
    this.zoom(f);
    this.center();
  },

  /*
   * Reset the positions to those calculated by OAPoC.
   */
  resetPositions: function() {
    var molecule = this;
    this.mv.getMoleculeData(this.data_str, function(md) {
      molecule.mv.showOverlay("Initializing atom positions...");
      md.atoms.each(function(atom) {
        var a = molecule.atoms.get(atom.id);
        a.x = atom.x;
        a.y = atom.y;
      });

      molecule.mv.idealize();
      molecule.mv.hideOverlay();
    });
  },

  /*
   * Fix atoms overlapping each other, atoms overlapping bonds and bonds
   * crossing each other.
   * 
   * Returns true is atoms were moved and a redraw is needed.
   */
  deoverlap: function() {
    if(!mv.settings.deoverlap.deoverlap) {
      return;
    }

    if(mv.settings.deoverlap.deoverlap_atoms) {
      var da = this.deoverlapAtoms();
    }

    if(mv.settings.deoverlap.deoverlap_bonds) {
      var db = this.deoverlapBonds();
    }

    if(mv.settings.deoverlap.decross_bonds) {
      var dc = this.decrossBonds();
    }

    if(mv.settings.deoverlap.lengthen_bonds) {
      var lb = this.lengthenBonds();
    }

    return da || db || dc || lb;
  },

  /*
   * Fix atoms overlapping each other.
   * 
   * Returns true is atoms were moved and a redraw is needed.
   */
  deoverlapAtoms: function() {
    var changed = false;

    for( var i = 0; i < this.atoms.count(); i++) {
      var a1 = this.atoms.atoms[i];
      if(!a1.isVisible()) {
        continue;
      }

      for( var j = i + 1; j < this.atoms.count(); j++) {
        var a2 = this.atoms.atoms[j];
        if(!a2.isVisible()) {
          continue;
        }

        var d = a1.distance(a2);
        var rd = a1.radiusDistance(a2);

        // Prevent problems with atoms at the exact same position by slightly
        // moving one of them.
        if(d.approx(0)) {
          a1.move(1e-3, 1e-3);
          d = a1.distance(a2);
          rd = a1.radiusDistance(a2);
        }

        if(rd < -1) {
          var f = rd / d;
          var dx = a1.dx(a2) * f / 2;
          var dy = a1.dy(a2) * f / 2;
          a1.move(dx, dy);
          a2.move(-dx, -dy);
          changed = true;
        }
      }
    }

    return changed;
  },

  /*
   * Fix atoms overlapping bonds.
   * 
   * Returns true is atoms were moved and a redraw is needed.
   */
  deoverlapBonds: function() {
    var s = this.mv.settings;
    var changed = false;

    for( var i = 0; i < this.atoms.count(); i++) {
      var a = this.atoms.atoms[i];
      if(!a.isVisible()) {
        continue;
      }

      for( var j = 0; j < this.bonds.count(); j++) {
        var b = this.bonds.bonds[j];
        if(!b.isVisible()) {
          continue;
        }

        var bd = a.bondDistance(b);

        // Prevent problems with atoms that are exactly on a bond by slightly
        // moving them.
        if(bd.approx(0)) {
          a.move(1e-3, 1e-3);
          bd = a.bondDistance(b);
        }

        if(bd < a.getRadius() + s.bond.spacing - 1) {
          var f = (a.getRadius() - bd + s.bond.spacing) / bd;
          var ba = a.bondAnchor(b);
          var dx = (a.x - ba.x) * f;
          var dy = (a.y - ba.y) * f;
          a.move(dx, dy);
          changed = true;
        }
      }
    }

    return changed;
  },

  /*
   * Fix bonds crossing each other.
   * 
   * Returns true is atoms were moved and a redraw is needed.
   */
  decrossBonds: function() {
    var changed = false;

    for( var i = 0; i < this.bonds.count(); i++) {
      var b1 = this.bonds.bonds[i];
      if(!b1.isVisible()) {
        continue;
      }

      for( var j = i + 1; j < this.bonds.count(); j++) {
        var b2 = this.bonds.bonds[j];
        if(!b2.isVisible()) {
          continue;
        }

        var c = b1.intersection(b2);
        if(c) {
          var atoms = [b1.a1, b1.a2, b2.a1, b2.a2];
          var bcs = atoms.map(function(a) {
            return a.bondCount();
          });
          var a = atoms[bcs.indexOf(bcs.min())];

          var dx = c.x - a.x;
          var dy = c.y - a.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          var ddx = a.getRadius() * dx / d;
          var ddy = a.getRadius() * dy / d;
          a.move(dx + ddx, dy + ddy);
          changed = true;
        }
      }
    }

    return changed;
  },

  /*
   * Make sure each bond is at least min_bond_length long.
   */
  lengthenBonds: function() {
    var s = this.mv.settings;
    var changed = false;

    for( var i = 0; i < this.bonds.count(); i++) {
      var bond = this.bonds.bonds[i];
      if(!bond.isVisible()) {
        continue;
      }

      if(bond.length() < s.zoom.min_bond_length - 1) {
        var dist = bond.a1.distance(bond.a2);
        if(dist.approx(0)) {
          bond.a2.move(1e-3, 1e-3);
          dist = bond.a1.distance(bond.a2);
        }

        var d = Math.abs(s.zoom.min_bond_length - dist) / 2;
        var dx = bond.a2.x - bond.a1.x;
        var dy = bond.a2.y - bond.a1.y;
        var ddx = d * dx / dist;
        var ddy = d * dy / dist;
        bond.a1.move(-ddx, -ddy);
        bond.a2.move(ddx, ddy);
        changed = true;
      }
    }

    return changed;
  },

  /*
   * Draw the molecule.
   */
  draw: function() {
    this.atoms.draw();
    this.bonds.draw();
  }
};
