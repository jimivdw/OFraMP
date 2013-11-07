/**
 * Data structure for a list of atoms
 */
function AtomList(molecule, atoms) {
  this.init(molecule, atoms);
}

AtomList.prototype = {
  molecule: undefined,
  atoms: undefined,

  cache: undefined,

  init: function(molecule, atoms) {
    this.molecule = molecule;
    this.atoms = new Array();
    $ext.each(atoms, function(atom) {
      this.atoms.push(new Atom(this, atom.id, atom.element, atom.element_id,
          atom.x, atom.y));
    }, this);
    this.cache = new Cache();
  },

  /*
   * Get the atom with the given id.
   */
  get: function(id) {
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
  each: function(f, scope) {
    return $ext.each(this.atoms, f, scope);
  },

  /*
   * Mapping function for a list of atoms.
   */
  map: function(f, scope) {
    return $ext.array.map(this.atoms, f, scope);
  },

  /*
   * Get the width of this AtomList.
   */
  width: function() {
    if(this.cache.get('position.width')) {
      return this.cache.get('position.width');
    }
    var lt = this.leftTop();
    var rb = this.rightBottom();
    var width = rb.x - lt.x;
    this.cache.set('position.width', width, [
        this.cache.getCache('position.left_top'),
        this.cache.getCache('position.right_bottom')]);
    return width;
  },

  /*
   * Get the height of this AtomList.
   */
  height: function() {
    if(this.cache.get('position.height')) {
      return this.cache.get('position.height');
    }
    var lt = this.leftTop();
    var rb = this.rightBottom();
    var height = rb.y - lt.y;
    this.cache.set('position.height', height, [
        this.cache.getCache('position.left_top'),
        this.cache.getCache('position.right_bottom')]);
    return height;
  },

  /*
   * Get the coordinates of the left top of this AtomList.
   */
  leftTop: function() {
    if(this.cache.get('position.left_top')) {
      return this.cache.get('position.left_top');
    }
    var lt = {
      x: $ext.array.min(this.map(function(atom) {
        return atom.x - atom.getRadius();
      })),
      y: $ext.array.min(this.map(function(atom) {
        return atom.y - atom.getRadius();
      }))
    };
    this.cache.set('position.left_top', lt, this.cache
        .getCache('appearance.radius'));
    return lt;
  },

  /*
   * Get the coordinates of the right bottom of this AtomList.
   */
  rightBottom: function() {
    if(this.cache.get('position.right_bottom')) {
      return this.cache.get('position.right_bottom');
    }
    var rb = {
      x: $ext.array.max(this.map(function(atom) {
        return atom.x + atom.getRadius();
      })),
      y: $ext.array.max(this.map(function(atom) {
        return atom.y + atom.getRadius();
      }))
    };
    this.cache.set('position.right_bottom', rb, this.cache
        .getCache('appearance.radius'));
    return rb;
  },

  /*
   * Get the size (width, height) of this AtomList.
   */
  size: function() {
    if(this.cache.get('position.size')) {
      return this.cache.get('position.size');
    }
    var s = {
      w: this.width(),
      h: this.height()
    };
    this.cache.set('position.size', s, [this.cache.getCache('position.width'),
        this.cache.getCache('position.height')]);
    return s;
  },

  /*
   * Get the coordinates of the center of this AtomList.
   */
  centerPoint: function() {
    if(this.cache.get('position.center_point')) {
      return this.cache.get('position.center_point');
    }
    var lt = this.leftTop();
    var s = this.size();
    var cp = {
      x: lt.x + s.w / 2,
      y: lt.y + s.h / 2
    };
    this.cache.set('position.center_point', cp, [
        this.cache.getCache('position.left_top'),
        this.cache.getCache('position.size')]);
    return cp;
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
    if(h && !h.isVisible()) {
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
        $ext.array.toBack(this.atoms, this.indexOf(h.id));
        changed = true;
      }
      if(h.status === ATOM_STATUSES.hover) {
        c.style.cursor = s.cursor.click;
      } else {
        c.style.cursor = s.cursor.normal;
      }
    } else {
      c.style.cursor = s.cursor.drag;
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
    if(s && s.isVisible() && s.status !== ATOM_STATUSES.selected) {
      s.status = ATOM_STATUSES.selected;

      // Bring to back of list to be drawn last (on top).
      $ext.array.toBack(this.atoms, this.indexOf(s.id));
      c.style.cursor = t.cursor.normal;
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
    this.each(function(a) {
      var dx = a.x * f - a.x;
      var dy = a.y * f - a.y;
      a.move(dx, dy);
    });

    window.molecule = this.molecule;
    window.fixcount = 0;
    window.fixmax = 1000 - 4.8 * this.count();
    window.requestAnimationFrame(function drawLoop() {
      if(fixcount < fixmax && molecule.deoverlap()) {
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
   * Fit the molecule in a box of size w * h and center it there.
   */
  bestFit: function(w, h) {
    var s = this.molecule.mv.settings;
    var wf = w / this.width();
    var hf = h / this.height();
    var f = wf < hf ? wf : hf;
    this.scale(f);

    var tx = w / 2 - this.width() / 2;
    var ty = h / 2 - this.height() / 2;
    var lt = this.leftTop();
    var dx = tx - lt.x;
    var dy = ty - lt.y;
    this.move(dx, dy);
  },

  clearCache: function(name) {
    this.cache.clear(name);
    this.molecule.clearCache(name);
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
