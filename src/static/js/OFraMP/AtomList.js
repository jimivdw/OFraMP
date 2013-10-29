/**
 * Data structure for a list of atoms
 */
function AtomList(molecule, atoms) {
  this.init(molecule, atoms);
}

AtomList.prototype = {
  molecule: undefined,
  atoms: undefined,
  
  init: function(molecule, atoms) {
    this.molecule = molecule;
    this.atoms = new Array();
    atoms.each(function(atom, list) {
      list.atoms.push(new Atom(list, atom.id, atom.element, atom.element_id,
          atom.x, atom.y));
    }, this);
  },
  
  /*
   * Get the atom with the given id.
   */
  get: function(id) {
    // TODO: modify OAPoC so that it does not modify ids
    id += 1;
    return this.atoms[this.indexOf(id)];
  },
  
  /*
   * Get the index of the atom with the given id.
   */
  indexOf: function(id) {
    for( var i = 0; i < this.atoms.length; i++) {
      if(this.atoms[i].id == id) {
        return i;
      }
    }
  },

  /*
   * Get the number of atoms in this list.
   */
  count: function() {
    return this.atoms.length;
  },
  
  /*
   * Apply a function f to each atom in this list.
   */
  each: function(f, that) {
    return this.atoms.each(f, that);
  },

  /*
   * Mapping function for a list of atoms.
   */
  map: function(f, that) {
    return this.atoms.mapF(f, that);
  },

  /*
   * Get the width of this AtomList.
   */
  width: function() {
    var lt = this.leftTop();
    var rb = this.rightBottom();
    return rb.x - lt.x;
  },

  /*
   * Get the height of this AtomList.
   */
  height: function() {
    var lt = this.leftTop();
    var rb = this.rightBottom();
    return rb.y - lt.y;
  },

  /*
   * Get the coordinates of the left top of this AtomList.
   */
  leftTop: function() {
    return {
      x: this.map(function(atom) { return atom.x; }).min(),
      y: this.map(function(atom) { return atom.y; }).min()
    };
  },

  /*
   * Get the coordinates of the right bottom of this AtomList.
   */
  rightBottom: function() {
    return {
      x: this.map(function(atom) { return atom.x; }).max(),
      y: this.map(function(atom) { return atom.y; }).max()
    };
  },

  /*
   * Get the size (width, height) of this AtomList.
   */
  size: function() {
    return {
      w: this.width(),
      h: this.height()
    };
  },

  /*
   * Get the coordinates of the center of this AtomList.
   */
  centerPoint: function() {
    var lt = this.leftTop();
    var s = this.size();
    return {
      x: lt.x + s.w / 2,
      y: lt.y + s.h / 2
    };
  },

  /*
   * Get the atom at position (x, y), if any.
   */
  atomAt: function(x, y) {
    return this.each(function(atom) {
      if(atom.touches(x, y)) {
        return atom;
      }
    });
  },
  
  /*
   * Set the atom that is hovered to h. If h is undefined, no atom is hovered.
   * 
   * Returns true if the hover was changed and a redraw is needed.
   */
  setHover: function(h) {
    if(h && !h.show) {
      return;
    }
  
    var changed = false;
    
    // Unset hover from the currently hovered atom
    this.each(function(a) {
      if(a.status === ATOM_STATUSES.hover && a !== h) {
        a.status = ATOM_STATUSES.normal;
        changed = true;
        return;
      }
    });
  
    var s = this.molecule.mv.settings;
    var c = this.molecule.mv.canvas;
    if(h) {
      if(h.status === ATOM_STATUSES.normal) {
        h.status = ATOM_STATUSES.hover;
        
        // Bring to back of list to be drawn last (on top).
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
  },

  /*
   * Set the selected atom to s. If s is undefined, no atom is selected.
   * 
   * Returns true if the selection was changed and a redraw is needed.
   */
  setSelected: function(s) {
    var changed = false;
    this.each(function(a) {
      if(a.status === ATOM_STATUSES.selected && a !== s) {
        a.status = ATOM_STATUSES.normal;
        changed = true;
        return;
      }
    });
  
    var t = this.molecule.mv.settings;
    var c = this.molecule.mv.canvas;
    if(s && s.show && s.status !== ATOM_STATUSES.selected) {
      s.status = ATOM_STATUSES.selected;
      
      // Bring to back of list to be drawn last (on top).
      this.atoms.toBack(this.indexOf(s.id));
      c.style.cursor = t.canvas_cursor_normal;
      changed = true;
    }
  
    return changed;
  },
  
  /*
   * Move all atoms in this list dx in the x direction and dy on the y axis.
   */
  move: function(dx, dy) {
    this.each(function(a) {
      a.move(dx, dy);
    });
  },
  
  /*
   * Scale the atoms with a factor f.
   */
  scale: function(f) {
    this.map(function(a) {
      a.x *= f;
      a.y *= f;
      return a;
    });
  
    window.molecule = this.molecule;
    window.fixcount = 0;
    window.fixmax = 1000 - 4.8 * this.count();
    window.requestAnimationFrame(function drawLoop() {
      if(fixcount < fixmax && molecule.atoms.deoverlap()) {
        fixcount++;
        molecule.mv.redraw();
        requestAnimationFrame(drawLoop);
      }
    });
  },
  
  /*
   * Center the list of atoms.
   */
  center: function() {
    var cc = this.molecule.mv.ctx.centerPoint();
    var mc = this.centerPoint();
    var dx = cc.x - mc.x;
    var dy = cc.y - mc.y;
    this.move(dx, dy);
  },
  
  /*
   * Zoom on the center of the molecule with a factor f.
   */
  zoom: function(f) {
    var c = this.centerPoint();
    this.zoomOn(c.x, c.y, f);
  },
  
  /*
   * Zoom on a specific point (x, y) with a factor f.
   */
  zoomOn: function(x, y, f) {
    this.move(-x, -y);
    this.scale(f);
    this.move(x, y);
  },
  
  /*
   * Fit the molecule in a box of size w * h.
   */
  bestFit: function(w, h) {
    var s = this.molecule.mv.settings;
    var wf = (w - s.canvas_padding) / this.width();
    var hf = (h - s.canvas_padding) / this.height();
    var f = wf < hf ? wf : hf;
    this.scale(f);
  
    var tx = w / 2 - this.width() / 2;
    var ty = h / 2 - this.height() / 2;
    var lt = this.leftTop();
    var dx = tx - lt.x;
    var dy = ty - lt.y;
    this.move(dx, dy);
  },
  
  /*
   * Fix atoms overlapping each other, atoms overlapping bonds and bonds
   * crossing each other.
   * 
   * Returns true is atoms were moved and a redraw is needed.
   */
  deoverlap: function() {
    var da = this.deoverlapAtoms();
    var db = this.deoverlapBonds();
    var dc = this.decrossBonds();
    return da || db || dc;
  },

  /*
   * Fix atoms overlapping each other.
   * 
   * Returns true is atoms were moved and a redraw is needed.
   */
  deoverlapAtoms: function() {
    var changed = false;
  
    for( var i = 0; i < this.count(); i++) {
      var a1 = this.atoms[i];
      if(!a1.show) {
        continue;
      }
  
      for( var j = i + 1; j < this.count(); j++) {
        var a2 = this.atoms[j];
        if(!a2.show) {
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
    var s = this.molecule.mv.settings;
    var changed = false;
  
    for( var i = 0; i < this.count(); i++) {
      var a = this.atoms[i];
      if(!a.show) {
        continue;
      }
  
      for( var j = 0; j < this.molecule.bonds.count(); j++) {
        var b = this.molecule.bonds.get(j);
        if(!b.show) {
          continue;
        }
  
        var bd = a.bondDistance(b);
  
        // Prevent problems with atoms that are exactly on a bond by slightly
        // moving them.
        if(bd.approx(0)) {
          a.move(1e-3, 1e-3);
          bd = a.bondDistance(b);
        }
  
        if(bd < a.radius() + s.bond_spacing - 1) {
          var f = (a.radius() - bd + s.bond_spacing) / bd;
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
  
    for( var i = 0; i < this.molecule.bonds.count(); i++) {
      var b1 = this.molecule.bonds.get(i);
      if(!b1.show) {
        continue;
      }
  
      for( var j = i + 1; j < this.molecule.bonds.count(); j++) {
        var b2 = this.molecule.bonds.get(j);
        if(!b2.show) {
          continue;
        }
  
        var c = b1.intersection(b2);
        if(c) {
          var ctx = this.molecule.mv.ctx;
          ctx.fillRect(c.x - 5, c.y - 5, 10, 10);
  
          var atoms = [b1.a1, b1.a2, b2.a1, b2.a2];
          var bcs = atoms.map(function(a) {
            return a.bondCount();
          });
          var a = atoms[bcs.indexOf(bcs.min())];
  
          var dx = c.x - a.x;
          var dy = c.y - a.y;
          a.move(dx, dy);
          changed = true;
        }
      }
    }
  
    return changed;
  },
  
  /*
   * Draw all atoms in this list.
   */
  draw: function() {
    this.each(function(a) {
      a.draw();
    });
  }
};
