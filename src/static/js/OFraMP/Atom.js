/**
 * Data structure for an atom
 */
function Atom(list, id, element, element_id, x, y, charge) {
  this.init(list, id, element, element_id, x, y, charge);
}

Atom.prototype = {
  list: undefined,
  id: undefined,
  element: undefined,
  element_id: undefined,
  x: undefined,
  y: undefined,
  charge: undefined,
  status: undefined,

  cache: undefined,

  init: function(list, id, element, element_id, x, y, charge) {
    this.list = list;
    this.id = id;
    this.element = element;
    this.element_id = element_id;
    this.x = x;
    this.y = y;
    this.charge = charge || Math.random() > .5 ? 0.123 : undefined;
    this.status = ATOM_STATUSES.normal;

    this.cache = new Cache();
  },

  /*
   * Determine if this atom is currently visible.
   */
  isVisible: function() {
    if(this.cache.get('position.visible')) {
      return this.cache.get('position.visible');
    }

    var s = this.list.molecule.mv.settings;
    var c = this.list.molecule.mv.canvas;
    var visible = ((s.atom.show_h_atoms || this.element != "H")
        && this.x + this.getRadius() > 0 && this.x - this.getRadius() < c.width
        && this.y + this.getRadius() > 0 && this.y - this.getRadius() < c.height);

    this.cache.set('position.visible', visible, this.cache
        .getCache('appearance.visible'));
    return visible;
  },

  /*
   * Determine if this atom's label should be shown.
   */
  showLabel: function() {
    if(this.cache.get('appearance.show_label')) {
      return this.cache.get('appearance.show_label');
    }

    var s = this.list.molecule.mv.settings;
    var show = (s.atom.show_c_labels || this.element != "C");

    this.cache.set('appearance.show_label', show);
    return show;
  },


  /*
   * Get all bonds that are connected to this atom, or just the aromatic ones
   * when arom is set to true.
   */
  getBonds: function(arom) {
    if(arom && this.cache.get('structure.arom_bonds')) {
      return this.cache.get('structure.arom_bonds');
    } else if(!arom && this.cache.get('structure.bonds')) {
      return this.cache.get('structure.bonds');
    }

    var bonds = Array();
    this.list.molecule.bonds.each(function(bond) {
      if(this === bond.a1 || this === bond.a2 && (!arom || bond.type == 4)) {
        bonds.push(bond);
      }
    }, this);

    if(arom) {
      this.cache.set('structure.arom_bonds', bonds);
    } else {
      this.cache.set('structure.bonds', bonds);
    }
    return bonds;
  },

  /*
   * Get the atoms with which this atom is bonded, or just those with which this
   * atom has an aromatic bond when arom is set to true.
   */
  bondedAtoms: function(arom) {
    if(arom && this.cache.get('structure.arom_atoms')) {
      return this.cache.get('structure.arom_atoms');
    } else if(!arom && this.cache.get('structure.atoms')) {
      return this.cache.get('structure.atoms');
    }

    var bonded_atoms = $ext.array.map(this.getBonds(arom), function(b) {
      return b.a1 === this ? b.a2 : b.a1;
    }, this);

    if(arom) {
      this.cache.set('structure.arom_atoms', bonded_atoms);
    } else {
      this.cache.set('structure.atoms', bonded_atoms);
    }
    return bonded_atoms;
  },

  /*
   * Get the number of bonds this atom has, or just the aromatic ones.
   */
  bondCount: function(arom) {
    if(arom && this.cache.get('structure.arom_bond_count')) {
      return this.cache.get('structure.arom_bond_count');
    } else if(!arom && this.cache.get('structure.bond_count')) {
      return this.cache.get('structure.bond_count');
    }

    var bond_count = this.getBonds(arom).length;
    if(arom) {
      this.cache.get('structure.arom_bond_count', bond_count);
    } else {
      this.cache.get('structure.bond_count', bond_count);
    }
    return bond_count;
  },

  /*
   * Get the radius of this atom.
   */
  getRadius: function() {
    if(this.cache.get('appearance.radius')) {
      return this.cache.get('appearance.radius');
    }

    var s = this.list.molecule.mv.settings;
    if(!this.showLabel()) {
      var radius = 0;
    } else if(this.isCharged()) {
      var radius = s.atom.radius_charged;
    } else {
      var radius = s.atom.radius;
    }
    this.cache.set('appearance.radius', radius, this.cache
        .getCache('appearance.show_label'));
    return radius;
  },

  /*
   * Get the x distance of this atom to another atom a.
   */
  dx: function(a) {
    return a.x - this.x;
  },

  /*
   * Get the y distance of this atom to another atom a.
   */
  dy: function(a) {
    return a.y - this.y;
  },

  /*
   * Get the distance of this atom to another atom a.
   */
  distance: function(a) {
    return Math.sqrt(Math.pow(this.dx(a), 2) + Math.pow(this.dy(a), 2));
  },

  /*
   * Get the distance of this atom to another atom a, from the edges of their
   * radiuses.
   */
  radiusDistance: function(a) {
    return this.distance(a) - this.getRadius() - a.getRadius();
  },

  /*
   * Get the anchor of this atom on a bond b, i.e. the closest point on the bond
   * from which a perpendicular line to the atom can be drawn.
   */
  bondAnchor: function(bond) {
    if(bond.a1 === this || bond.a2 === this) {
      return;
    }

    var a = this.distance(bond.a2);
    var b = this.distance(bond.a1);
    var c = bond.a1.distance(bond.a2);
    var cosp = (b * b + c * c - a * a) / (2 * b * c);
    var p = Math.acos(cosp);
    var d = Math.sin(p) * b;
    var c1 = cosp * b;
    var dx = bond.a1.dx(bond.a2) * c1 / c;
    var dy = bond.a1.dy(bond.a2) * c1 / c;
    var x = bond.a1.x + dx;
    var y = bond.a1.y + dy;
    if(bond.touches(x, y)) {
      return {
        x: x,
        y: y
      };
    }
  },

  /*
   * Get the perpendicular distance from this atom to a bond.
   * 
   * Returns Infinity if this atom has no bond anchor on that bond.
   */
  bondDistance: function(bond) {
    var a = this.bondAnchor(bond);
    if(!a) {
      return Infinity;
    }

    var dx = this.x - a.x;
    var dy = this.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /*
   * Returns whether the charge of this atom is set or not.
   */
  isCharged: function() {
    return this.charge !== undefined;
  },

  /*
   * Determine if a point (x, y) is within this atom's radius.
   */
  touches: function(x, y) {
    var dx = this.x - x;
    var dy = this.y - y;
    return Math.sqrt(dx * dx + dy * dy) <= this.getRadius();
  },

  /*
   * Get the color of this atom.
   */
  getColor: function() {
    if(this.cache.get('appearance.color')) {
      return this.cache.get('appearance.color');
    }
    var c = this.list.molecule.mv.settings.atom.colors[this.element];
    var color = c || this.list.molecule.mv.settings.atom.colors["other"];
    this.cache.set('appearance.color', color);
    return color;
  },

  /*
   * Move this atom dx in the x direction and dy on the y axis.
   */
  move: function(dx, dy) {
    if(isNaN(dx) || isNaN(dy)) {
      throw "Moving to nowhere.";
    }

    this.x += dx;
    this.y += dy;

    this.clearCache('position');
    $ext.each(this.getBonds(), function(bond) {
      bond.clearCache('position');
    });
    return this;
  },

  /*
   * Find the cycle this atom is a part of (if any).
   * 
   * If arom is set to true, only aromatic cycles will be considered.
   */
  findCycle: function(arom) {
    if(arom && this.cache.get('structure.arom_cycle')) {
      return this.cache.get('structure.arom_cycle');
    } else if(!arom && this.cache.get('structure.cycle')) {
      return this.cache.get('structure.cycle');
    }

    var q = [this];
    var pq = [[this]];
    while(q.length > 0) {
      var c = q.shift();
      var p = pq.shift();

      var bas = c.bondedAtoms(arom);

      var path = $ext.each(bas, function(ba) {
        if(ba === this && p.length > 2) {
          return p;
        }

        if(p.indexOf(ba) == -1) {
          q.push(ba);
          pq.push(p.concat(ba));
        }
      }, this);

      if(path) {
        if(arom) {
          this.cache.set('structure.arom_cycle', path);
        } else {
          this.cache.set('structure.cycle', path);
        }
        return path;
      }
    }
  },

  /*
   * Clear the given cache of this atom and its parent.
   */
  clearCache: function(name) {
    this.cache.clear(name);
    this.list.clearCache(name);
  },

  /*
   * Draw this atom.
   */
  draw: function() {
    if(!this.isVisible() || !this.showLabel()) {
      return;
    }

    var ctx = this.list.molecule.mv.ctx;
    var s = this.list.molecule.mv.settings;

    if(s.atom.show_circ) {
      ctx.lineWidth = s.atom.border_widths[this.status];
      ctx.strokeStyle = s.atom.border_color;
      ctx.fillStyle = s.atom.bg_colors[this.status];
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.getRadius(), 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    var label = this.element;
    if(s.atom.show_id) {
      label += this.id;
    }

    ctx.font = s.atom.font;
    ctx.fillStyle = this.getColor();
    if(this.isCharged()) {
      ctx.fillText(label, this.x, this.y - s.atom.charge_offset);
      ctx.font = s.atom.charge_font;
      ctx.fillStyle = s.atom.charge_color;
      ctx.fillText(this.charge, this.x, this.y + s.atom.charge_offset);
    } else {
      ctx.fillText(label, this.x, this.y);
    }
  }
};
