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
  bonds: function(arom) {
    var bonds = [];
    for( var i = 0; i < this.list.molecule.bonds.count(); i++) {
      var bond = this.list.molecule.bonds.get(i);
      if(this === bond.a1 || this === bond.a2 && (!arom || bond.type == 4)) {
        bonds.push(bond);
      }
    }
    return bonds;
  },
  
  /*
   * Get the atoms with which this atom is bonded, or just those with which
   * this atom has an aromatic bond when arom is set to true.
   */
  bondedAtoms: function(arom) {
    return this.bonds(arom).mapF(function(b, atom) {
      return b.a1 === atom ? b.a2 : b.a1;
    }, this);
  },
  
  /*
   * Get the number of bonds this atom has, or just the aromatic ones.
   */
  bondCount: function(arom) {
    return this.bonds(arom).length;
  },
  
  /*
   * Get the radius of this atom.
   */
  radius: function() {
    var s = this.list.molecule.mv.settings;
    if(this.isCharged())
      return s.atom_radius_charged;
    else
      return s.atom_radius;
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
    return this.distance(a) - this.radius() - a.radius();
  },

  /*
   * Get the anchor of this atom on a bond b, i.e. the closest point on the
   * bond from which a perpendicular line to the atom can be drawn.
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
    return Math.sqrt(dx * dx + dy * dy) <= this.radius();
  },
  
  /*
   * Get the color of this atom.
   */
  color: function() {
    var c = this.list.molecule.mv.settings.atom_colors[this.element];
    return c || this.list.molecule.mv.settings.atom_colors["other"];
  },
  
  /*
   * Move this atom dx in the x direction and dy on the y axis.
   */
  move: function(dx, dy) {
    this.x += dx;
    this.y += dy;
    return this;
  },
  
  /*
   * Find the cycle this atom is a part of (if any).
   * 
   * If arom is set to true, only aromatic cycles will be considered.
   */
  findCycle: function(arom) {
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
      ctx.arc(this.x, this.y, this.radius(), 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  
    ctx.font = s.atom_font;
    ctx.fillStyle = this.color();
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
