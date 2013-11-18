function Molecule(mv, atoms, bonds, data_str) {
  this.init(mv, atoms, bonds, data_str);
}

Molecule.prototype = {
  mv: undefined,
  atoms: undefined,
  bonds: undefined,
  data_str: undefined,

  cache: undefined,

  init: function(mv, atoms, bonds, data_str) {
    this.mv = mv;
    this.atoms = new AtomList(this, atoms);
    this.bonds = new BondList(this, bonds);
    this.data_str = data_str;
    this.cache = new Cache();
  },

  /*
   * Get the width of this molecule.
   */
  width: function() {
    if(this.cache.get('position.width')) {
      return this.cache.get('position.width');
    }
    var w = this.atoms.width();
    this.cache.set('position.width', w, this.cache
        .getCache('appearance.radius'));
    return w;
  },

  /*
   * Get the height of this molecule.
   */
  height: function() {
    if(this.cache.get('position.height')) {
      return this.cache.get('position.height');
    }
    var h = this.atoms.height();
    this.cache.set('position.height', h, this.cache
        .getCache('appearance.radius'));
    return h;
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

  dehighlight: function() {
    this.atoms.dehighlight();
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
      $ext.each(md.atoms, function(atom) {
        var a = molecule.atoms.get(atom.id);
        a.x = atom.x;
        a.y = atom.y;
      });

      molecule.mv.idealize();
      molecule.mv.hideOverlay();
    });
  },

  /*
   * Find all occurrences of a given sequence or Molecule in this molecule.
   */
  find: function(needle) {
    if(needle instanceof Molecule) {
      var seqs = this.findOccurrences(needle);
    } else if(needle instanceof Array) {
      var seqs = this.findSequences(needle);
    } else {
      throw "Find only works with Molecules or Arrays";
    }

    this.dehighlight();
    $ext.each($ext.array.flatten(seqs), function(atom) {
      atom.highlight();
    });
    this.mv.redraw();

    return seqs;
  },

  /*
   * Find all occurrences of a given sequence in this molecule.
   */
  findSequences: function(seq) {
    return this.atoms.findSequences(seq);
  },

  /*
   * Find all occurrences of a given Molecule in this molecule.
   */
  findOccurrences: function(list) {
    return this.atoms.findOccurrences(list);
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
        if($ext.number.approx(d, 0)) {
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
        if($ext.number.approx(bd, 0)) {
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
          var tds = [this.atoms.toTree(b1.a2).getChild(b1.a1.id).depth(),
              this.atoms.toTree(b1.a1).getChild(b1.a2.id).depth(),
              this.atoms.toTree(b2.a2).getChild(b2.a1.id).depth(),
              this.atoms.toTree(b2.a1).getChild(b2.a2.id).depth()];

          var atoms = [b1.a1, b1.a2, b2.a1, b2.a2];
          var a = atoms[tds.indexOf($ext.array.min(tds))];

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
        if($ext.number.approx(dist, 0)) {
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

  clearCache: function(name) {
    this.cache.clear(name);
    this.mv.clearCache(name);
  },

  /*
   * Draw the molecule.
   */
  draw: function() {
    this.atoms.draw();
    this.bonds.draw();
  }
};
