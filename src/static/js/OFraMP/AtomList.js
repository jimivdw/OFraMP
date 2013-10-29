/**
 * Data structure for a list of atoms
 */
function AtomList(molecule, atoms) {
  this.molecule = molecule;
  this.atoms = new Array();
  for( var i = 0; i < atoms.length; i++) {
    var atom = atoms[i];
    var a = new Atom(this, atom.id, atom.element, atom.element_id, atom.x,
        atom.y);
    this.atoms.push(a);
  }
}

AtomList.prototype.get = function(id) {
  // TODO: modify OAPoC so that it does not modify ids
  id += 1;
  return this.atoms[this.indexOf(id)];
};

AtomList.prototype.indexOf = function(id) {
  for( var i = 0; i < this.atoms.length; i++) {
    if(this.atoms[i].id == id)
      return i;
  }
};

AtomList.prototype.count = function() {
  return this.atoms.length;
};

AtomList.prototype.propMin = function(p) {
  var min = this.atoms[0][p];
  this.atoms.forEach(function(a) {
    if(a[p] < min)
      min = a[p];
  });

  return min;
};

AtomList.prototype.propMax = function(p) {
  var max = this.atoms[0][p];
  this.atoms.forEach(function(a) {
    if(a[p] > max)
      max = a[p];
  });

  return max;
};

AtomList.prototype.propWidth = function(p) {
  var min = this.propMin(p);
  var max = this.propMax(p);
  return max - min;
};

AtomList.prototype.width = function() {
  return this.propWidth('x');
};

AtomList.prototype.height = function() {
  return this.propWidth('y');
};

AtomList.prototype.leftTop = function() {
  return {
    x: this.propMin('x'),
    y: this.propMin('y')
  };
};

AtomList.prototype.centerPoint = function() {
  var lt = this.leftTop();
  var s = this.size();
  return {
    x: lt.x + s.w / 2,
    y: lt.y + s.h / 2
  };
};

AtomList.prototype.size = function() {
  return {
    w: this.width(),
    h: this.height()
  };
};

AtomList.prototype.atomAt = function(x, y) {
  for( var i = 0; i < this.atoms.length; i++) {
    if(this.atoms[i].touches(x, y))
      return this.atoms[i];
  }
};

AtomList.prototype.setHover = function(h) {
  if(h && !h.show)
    return;

  var changed = false;
  this.atoms.forEach(function(a) {
    if(a.status === ATOM_STATUSES.hover && a !== h) {
      a.status = ATOM_STATUSES.normal;
      changed = true;
    }
  });

  var s = this.molecule.mv.settings;
  var c = this.molecule.mv.canvas;
  if(h) {
    if(h.status === ATOM_STATUSES.normal) {
      h.status = ATOM_STATUSES.hover;
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
};

AtomList.prototype.setSelected = function(s) {
  var changed = false;
  this.atoms.forEach(function(a) {
    if(a.status === ATOM_STATUSES.selected && a !== s) {
      a.status = ATOM_STATUSES.normal;
      changed = true;
    }
  });

  var t = this.molecule.mv.settings;
  var c = this.molecule.mv.canvas;
  if(s && s.show && s.status !== ATOM_STATUSES.selected) {
    s.status = ATOM_STATUSES.selected;
    this.atoms.toBack(this.indexOf(s.id));
    c.style.cursor = t.canvas_cursor_normal;
    changed = true;
  }

  return changed;
};

AtomList.prototype.move = function(dx, dy) {
  this.atoms.map(function(a) {
    a.move(dx, dy);
  });
};

AtomList.prototype.scale = function(f) {
  this.atoms.map(function(a) {
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
};

AtomList.prototype.center = function() {
  var cc = this.molecule.mv.ctx.centerPoint();
  var mc = this.centerPoint();
  var dx = cc.x - mc.x;
  var dy = cc.y - mc.y;
  this.move(dx, dy);
};

AtomList.prototype.zoom = function(f) {
  var c = this.centerPoint();
  this.zoomOn(c.x, c.y, f);
};

AtomList.prototype.zoomOn = function(x, y, f) {
  this.move(-x, -y);
  this.scale(f);
  this.move(x, y);
};

AtomList.prototype.bestFit = function(w, h) {
  var s = this.molecule.mv.settings;
  var wf = (w - s.canvas_padding) / this.width();
  var hf = (h - s.canvas_padding) / this.height();
  var f = wf < hf ? wf : hf;
  this.scale(f);

  var tx = w / 2 - this.width() / 2;
  var ty = h / 2 - this.height() / 2;
  var dx = tx - this.propMin('x');
  var dy = ty - this.propMin('y');
  this.move(dx, dy);
};

AtomList.prototype.deoverlap = function() {
  var da = this.deoverlapAtoms();
  var db = this.deoverlapBonds();
  var dc = this.decrossBonds();
  return da || db || dc;
};

AtomList.prototype.deoverlapAtoms = function() {
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
};

AtomList.prototype.deoverlapBonds = function() {
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
};

AtomList.prototype.decrossBonds = function() {
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
};

AtomList.prototype.draw = function() {
  this.atoms.forEach(function(a) {
    a.draw();
  });
};
