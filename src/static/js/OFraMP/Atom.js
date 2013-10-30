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
  show: true,

  init: function(list, id, element, element_id, x, y, charge) {
    this.list = list;
    this.id = id;
    this.element = element;
    this.element_id = element_id;
    this.x = x;
    this.y = y;
    this.charge = charge || Math.random() > .5 ? 0.123 : undefined;
    this.status = ATOM_STATUSES.normal;
    if(element == "H" && !list.molecule.mv.settings.draw_h_atoms) {
      this.show = false;
    }
  },

  /*
   * Get all bonds that are connected to this atom, or just the aromatic ones
   * when arom is set to true.
   */
  getBonds: function(arom) {
    if(arom && this.arom_bonds) {
      return this.arom_bonds;
    } else if(!arom && this.bonds) {
      return this.bonds;
    }

    var bonds = Array();
    this.list.molecule.bonds.each(function(bond, atom) {
      if(atom === bond.a1 || atom === bond.a2 && (!arom || bond.type == 4)) {
        bonds.push(bond);
      }
    }, this);

    if(arom) {
      this.arom_bonds = bonds;
    } else {
      this.bonds = bonds;
    }
    return bonds;
  },

  /*
   * Get the atoms with which this atom is bonded, or just those with which this
   * atom has an aromatic bond when arom is set to true.
   */
  bondedAtoms: function(arom) {
    if(arom && this.arom_bonded_atoms) {
      return this.arom_bonded_atoms;
    } else if(!arom && this.bonded_atoms) {
      return this.bonded_atoms;
    }
    
    var bonded_atoms = this.getBonds(arom).mapF(function(b, atom) {
      return b.a1 === atom ? b.a2 : b.a1;
    }, this);
    
    if(arom) {
      this.arom_bonded_atoms = bonded_atoms;
    } else {
      this.bonded_atoms = bonded_atoms;
    }
    return bonded_atoms;
  },

  /*
   * Get the number of bonds this atom has, or just the aromatic ones.
   */
  bondCount: function(arom) {
    if(arom && this.arom_bond_count) {
      return this.arom_bond_count;
    } else if(!arom && this.bond_count) {
      return this.bond_count;
    }

    var bond_count = this.getBonds(arom).length;
    if(arom) {
      this.arom_bond_count = bond_count;
    } else {
      this.bond_count = bond_count;
    }
    return bond_count;
  },

  /*
   * Get the radius of this atom.
   */
  getRadius: function() {
    if(this.radius) {
      return this.radius;
    }

    var s = this.list.molecule.mv.settings;
    if(this.isCharged()) {
      this.radius = s.atom_radius_charged;
    } else {
      this.radius = s.atom_radius;
    }
    return this.radius;
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
    if(this.color) {
      return this.color;
    }
    var c = this.list.molecule.mv.settings.atom_colors[this.element];
    this.color = c || this.list.molecule.mv.settings.atom_colors["other"];
    return this.color;
  },

  /*
   * Move this atom dx in the x direction and dy on the y axis.
   */
  move: function(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.getBonds().each(function(bond) {
      bond.cache = {};
    });
    return this;
  },

  /*
   * Find the cycle this atom is a part of (if any).
   * 
   * If arom is set to true, only aromatic cycles will be considered.
   */
  findCycle: function(arom) {
    if(arom && this.arom_cycle) {
      return this.arom_cycle;
    } else if(!arom && this.cycle) {
      return this.cycle;
    }

    var q = [this];
    var pq = [[this]];
    while(q.length > 0) {
      var c = q.shift();
      var p = pq.shift();

      var bas = c.bondedAtoms(arom);

      var path = bas.each(function(ba, needle) {
        if(ba === needle && p.length > 2) {
          return p;
        }

        if(p.indexOf(ba) == -1) {
          q.push(ba);
          pq.push(p.concat(ba));
        }
      }, this);

      if(path) {
        if(arom) {
          this.arom_cycle = path;
        } else {
          this.cycle = path;
        }
        return path;
      }
    }
  },

  /*
   * Draw this atom.
   */
  draw: function() {
    if(!this.show) {
      return;
    }

    var ctx = this.list.molecule.mv.ctx;
    var s = this.list.molecule.mv.settings;

    if(s.draw_atom_circ) {
      ctx.lineWidth = s.atom_border_widths[this.status];
      ctx.strokeStyle = s.atom_border_color;
      ctx.fillStyle = s.atom_bg_colors[this.status];
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.getRadius(), 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = s.atom_font;
    ctx.fillStyle = this.getColor();
    if(this.isCharged()) {
      ctx.fillText(this.element, this.x, this.y - s.atom_charge_offset);
      ctx.font = s.atom_charge_font;
      ctx.fillStyle = s.atom_charge_color;
      ctx.fillText(this.charge, this.x, this.y + s.atom_charge_offset);
    } else {
      ctx.fillText(this.element, this.x, this.y);
    }
  }
};
