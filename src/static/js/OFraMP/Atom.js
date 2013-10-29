/**
 * Data structure for an atom
 */
function Atom(list, id, element, element_id, x, y, charge) {
  this.list = list;
  this.id = id;
  this.element = element;
  this.element_id = element_id;
  this.x = x;
  this.y = y;
  this.charge = charge || Math.random() > .5 ? 0.123 : undefined;
  if(element == "H" && !list.molecule.mv.settings.draw_h_atoms)
    this.show = false;
  else
    this.show = true;
  this.status = ATOM_STATUSES.normal;
}

Atom.prototype.bonds = function(aromatic) {
  var bonds = [];
  for( var i = 0; i < this.list.molecule.bonds.count(); i++) {
    var bond = this.list.molecule.bonds.get(i);
    if(this === bond.a1 || this === bond.a2 && (!aromatic || bond.type == 4)) {
      bonds.push(bond);
    }
  }
  return bonds;
};

Atom.prototype.bondedAtoms = function(aromatic) {
  var that = this;
  return this.bonds(aromatic).map(function(b) {
    return b.a1 === that ? b.a2 : b.a1;
  });
};

Atom.prototype.bondCount = function() {
  return this.bonds().length;
};

Atom.prototype.radius = function() {
  var s = this.list.molecule.mv.settings;
  if(this.isCharged())
    return s.atom_radius_charged;
  else
    return s.atom_radius;
}

Atom.prototype.dx = function(a) {
  return a.x - this.x;
};

Atom.prototype.dy = function(a) {
  return a.y - this.y;
};

Atom.prototype.distance = function(a) {
  return Math.sqrt(Math.pow(this.dx(a), 2) + Math.pow(this.dy(a), 2));
};

Atom.prototype.radiusDistance = function(a) {
  return this.distance(a) - this.radius() - a.radius();
};

Atom.prototype.bondAnchor = function(bond) {
  if(bond.a1 === this || bond.a2 === this)
    return;

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
  if(bond.touches(x, y))
    return {
      x: x,
      y: y
    };
};

Atom.prototype.bondDistance = function(bond) {
  var a = this.bondAnchor(bond);
  if(!a)
    return Infinity;

  var dx = this.x - a.x;
  var dy = this.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

Atom.prototype.isCharged = function() {
  return this.charge !== undefined;
};

Atom.prototype.touches = function(x, y) {
  var s = this.list.molecule.mv.settings;
  if(this.isCharged())
    var r = s.atom_radius_charged;
  else
    var r = s.atom_radius;

  var dx = this.x - x;
  var dy = this.y - y;
  return Math.sqrt(dx * dx + dy * dy) <= r;
};

Atom.prototype.getColor = function() {
  var c = this.list.molecule.mv.settings.atom_colors[this.element];
  return c || this.list.molecule.mv.settings.atom_colors["other"];
};

Atom.prototype.move = function(dx, dy) {
  this.x += dx;
  this.y += dy;
  return this;
};

Atom.prototype.findCycle = function(aromatic) {
  var q = [this];
  var pq = [[this]];
  while(q.length > 0) {
    var c = q.shift();
    var p = pq.shift();

    var bas = c.bondedAtoms(aromatic);

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
  return pq;
};

Atom.prototype.draw = function() {
  if(!this.show)
    return;

  var ctx = this.list.molecule.mv.ctx;
  var s = this.list.molecule.mv.settings;

  if(this.isCharged()) {
    if(s.draw_atom_circ) {
      ctx.lineWidth = s.atom_border_widths[this.status];
      ctx.strokeStyle = s.atom_border_color;
      ctx.fillStyle = s.atom_bg_colors[this.status];
      ctx.beginPath();
      ctx.arc(this.x, this.y, s.atom_radius_charged, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = s.atom_font;
    ctx.fillStyle = this.getColor();
    ctx.fillText(this.element, this.x, this.y - 6);
    ctx.font = s.atom_charge_font;
    ctx.fillStyle = s.atom_charge_color;
    ctx.fillText(this.charge, this.x, this.y + 6);
  } else {
    if(s.draw_atom_circ) {
      ctx.lineWidth = s.atom_border_widths[this.status];
      ctx.strokeStyle = s.atom_border_color;
      ctx.fillStyle = s.atom_bg_colors[this.status];
      ctx.beginPath();
      ctx.arc(this.x, this.y, s.atom_radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    ctx.font = s.atom_font;
    ctx.fillStyle = this.getColor();
    ctx.fillText(this.element, this.x, this.y);
  }
};
