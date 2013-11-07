/**
 * Data structure for a bond
 */
function Bond(list, id, a1, a2, type) {
  this.init(list, id, a1, a2, type);
}

Bond.prototype = {
  list: undefined,
  id: undefined,
  a1: undefined,
  a2: undefined,
  type: undefined,

  cache: undefined,

  init: function(list, id, a1, a2, type) {
    this.list = list;
    this.id = id;
    this.a1 = a1;
    this.a2 = a2;
    this.type = type;

    this.cache = new Cache();
  },

  /*
   * Determine if this bond is currently visible.
   * 
   * Depends on both position and appearance, so track both in cache.
   */
  isVisible: function() {
    if(this.cache.get('position.visible')) {
      return this.cache.get('position.visible');
    }

    var s = this.list.molecule.mv.settings;
    var visible = (s.atom.show_h_atoms || (this.a1.element != "H" && this.a2.element != "H"))
        && (this.a1.isVisible() || this.a2.isVisible());
    this.cache.set('position.visible', visible, this.cache
        .getCache('appearance.visible'));
    return visible;
  },

  /*
   * Get the coordinates of the starting and end points of this bond.
   */
  coords: function() {
    if(this.cache.get('position.coords')) {
      return this.cache.get('position.coords');
    }

    var dx = this.a1.dx(this.a2);
    var dy = this.a1.dy(this.a2);
    var dist = this.a1.distance(this.a2);

    var ar1 = this.a1.getRadius();
    var ddx1 = dx * ar1 / dist;
    var ddy1 = dy * ar1 / dist;

    var ar2 = this.a2.getRadius();
    var ddx2 = dx * ar2 / dist;
    var ddy2 = dy * ar2 / dist;

    var coords = {
      x1: this.a1.x + ddx1,
      y1: this.a1.y + ddy1,
      x2: this.a2.x - ddx2,
      y2: this.a2.y - ddy2
    };

    this.cache.set('position.coords', coords);
    return coords;
  },

  /*
   * Get the length of this bond.
   */
  length: function() {
    if(this.cache.get('position.length')) {
      return this.cache.get('position.length');
    }
    var c = this.coords();
    var dx = c.x2 - c.x1;
    var dy = c.y2 - c.y1;
    var length = Math.sqrt(dx * dx + dy * dy);
    this.cache.set('position.length', length);
    return length;
  },

  /*
   * Determine if a point (x, y) lies within the bounding box of this bond.
   */
  inBB: function(x, y) {
    return x.between(this.a1.x, this.a2.x) && y.between(this.a1.y, this.a2.y);
  },

  /*
   * Determine if a point (x, y) is on this bond.
   */
  touches: function(x, y) {
    if(!this.inBB(x, y)) {
      return false;
    }

    var c = this.coords();
    var br = Math.abs(c.x1 - c.x2) / Math.abs(c.y1 - c.y2);
    var tr = Math.abs(c.x1 - x) / Math.abs(c.y1 - y);
    return br.approx(tr);
  },

  /*
   * Get the intersection point of this bond with anonther bond b, if any.
   * 
   * Based on the algorithm described in:
   * http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
   */
  intersection: function(b) {
    if(this.length() < 10) {
      return;
    }

    var c = this.coords();
    var d = b.coords();
    var p = {
      x: c.x1,
      y: c.y1
    };
    var q = {
      x: d.x1,
      y: d.y1
    };
    var r = {
      x: c.x2 - c.x1,
      y: c.y2 - c.y1
    };
    var s = {
      x: d.x2 - d.x1,
      y: d.y2 - d.y1
    };
    var t = ((q.x - p.x) * s.y - (q.y - p.y) * s.x) / (r.x * s.y - r.y * s.x);
    var u = ((q.x - p.x) * r.y - (q.y - p.y) * r.x) / (r.x * s.y - r.y * s.x);
    if(t > 0 && t < 1 && u > 0 && u < 1) {
      return {
        x: p.x + t * r.x,
        y: p.y + t * r.y
      };
    }
  },

  /*
   * Clear the given value from the cache and the parent's cache.
   */
  clearCache: function(name) {
    this.cache.clear(name);
    this.list.clearCache(name);
  },

  /*
   * Cache the coordinates of all bond lines.
   */
  cacheLineCoords: function() {
    if(this.cache.get('position.lines')) {
      return;
    }

    var a1 = this.a1;
    var a2 = this.a2;
    var lines = Array();
    var s = this.list.molecule.mv.settings;

    if(this.isVisible() && a1.distance(a2) >= a1.getRadius() + a2.getRadius()) {
      this.coords().extract(window);
      // Inner line for single/triple bonds
      if(this.type == 1 || this.type == 3) {
        lines.push({
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2
        });
      }

      // Outer lines for double/triple/aromatic bonds
      if(this.type > 1) {
        dx = x2 - x1;
        dy = y2 - y1;
        dist = Math.sqrt(dx * dx + dy * dy);

        ddx = dy * s.bond.spacing / dist;
        ddy = dx * s.bond.spacing / dist;

        if(this.type == 4) {
          // Find the center of the aromatic cycle
          var cycle = this.a2.findCycle();
          var center = new AtomList(this.list.molecule, cycle).centerPoint();
          var cdx1 = center.x - (x1 + ddx);
          var cdy1 = center.y - (y1 - ddy);
          var cdx2 = center.x - (x1 - ddx);
          var cdy2 = center.y - (y1 + ddy);
          var cdist1 = Math.sqrt(cdx1 * cdx1 + cdy1 * cdy1);
          var cdist2 = Math.sqrt(cdx2 * cdx2 + cdy2 * cdy2);

          if(cdist1 > cdist2) {
            lines.push({
              x1: x1 + ddx,
              y1: y1 - ddy,
              x2: x2 + ddx,
              y2: y2 - ddy
            });
            lines.push({
              x1: x1 - ddx,
              y1: y1 + ddy,
              x2: x2 - ddx,
              y2: y2 + ddy,
              n: s.bond.dash_count
            });
          } else {
            lines.push({
              x1: x1 - ddx,
              y1: y1 + ddy,
              x2: x2 - ddx,
              y2: y2 + ddy
            });
            lines.push({
              x1: x1 + ddx,
              y1: y1 - ddy,
              x2: x2 + ddx,
              y2: y2 - ddy,
              n: s.bond.dash_count
            });
          }
        } else {
          lines.push({
            x1: x1 + ddx,
            y1: y1 - ddy,
            x2: x2 + ddx,
            y2: y2 - ddy
          });
          lines.push({
            x1: x1 - ddx,
            y1: y1 + ddy,
            x2: x2 - ddx,
            y2: y2 + ddy
          });
        }
      }
    }

    this.cache.set('position.lines', lines, [
        this.cache.getCache('appearance.lines'),
        this.cache.getCache('position.visible')]);
  },

  /*
   * Cache the coordinates of the bond's connector on atom a.
   */
  cacheConnectorCoords: function(a) {
    if(this.cache.get('position.connectors')) {
      var connectors = this.cache.get('position.connectors');
    } else {
      var connectors = new Array();
    }

    var ep = {
      x: a.x + a.getRadius(),
      y: a.y
    };

    var c = this.coords();
    if(this.a1 === a) {
      var sp = {
        x: c.x1,
        y: c.y1
      }
    } else {
      var sp = {
        x: c.x2,
        y: c.y2
      }
    }

    var d = Math.sqrt(Math.pow(ep.x - sp.x, 2) + Math.pow(ep.y - sp.y, 2));
    var r2 = Math.pow(a.getRadius(), 2);
    var alpha = Math.acos((2 * r2 - Math.pow(d, 2)) / (2 * r2));
    if(sp.y < a.y) {
      alpha = -alpha;
    }

    var s = this.list.molecule.mv.settings;
    var delta = s.bond.connector_width / a.getRadius() / 2;

    if(this.type == 1 || this.type == 3) {
      connectors.push({
        x: a.x,
        y: a.y,
        r: a.getRadius(),
        s: alpha - delta,
        e: alpha + delta
      });
    }

    // For double/triple/aromatic bonds
    if(this.type > 1) {
      var beta = Math.acos((2 * r2 - Math.pow(s.bond.spacing, 2)) / (2 * r2));

      connectors.push({
        x: a.x,
        y: a.y,
        r: a.getRadius(),
        s: alpha + beta - delta,
        e: alpha + beta + delta
      });
      connectors.push({
        x: a.x,
        y: a.y,
        r: a.getRadius(),
        s: alpha - beta - delta,
        e: alpha - beta + delta
      });
    }

    this.cache.set('position.connectors', connectors, [
        this.cache.getCache('appearance.connectors'),
        this.cache.getCache('position.visible')]);
  },

  /*
   * Cache the coordinates of this bond's atom connectors.
   */
  cacheConnectorsCoords: function() {
    if(this.cache.get('position.connectors')) {
      return;
    }

    if(!this.isVisible()) {
      this.cache.set('position.connectors', [], [
          this.cache.getCache('appearance.connectors'),
          this.cache.getCache('position.visible')]);
      return;
    }

    this.cacheConnectorCoords(this.a1);
    this.cacheConnectorCoords(this.a2);
  },

  /*
   * Draw this bond.
   */
  draw: function() {
    this.drawConnectors();
    this.cacheLineCoords();

    var ctx = this.list.molecule.mv.ctx;
    var s = this.list.molecule.mv.settings;

    ctx.lineWidth = s.bond.width;
    ctx.strokeStyle = s.bond.color;

    this.cache.get('position.lines').each(function(l) {
      if(l.n) {
        ctx.drawDashedLine(l.x1, l.y1, l.x2, l.y2, l.n);
      } else {
        ctx.drawLine(l.x1, l.y1, l.x2, l.y2);
      }
    });

    // Draw the bond ID
    if(s.bond.show_id) {
      var c = this.coords();
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect((c.x1 + c.x2) / 2 - 8, (c.y1 + c.y2) / 2 - 8, 16, 16);
      ctx.fillStyle = "#000000";
      ctx.fillText(this.id, (c.x1 + c.x2) / 2, (c.y1 + c.y2) / 2);
    }
  },

  /*
   * Draw this bond's connectors.
   */
  drawConnectors: function() {
    this.cacheConnectorsCoords();

    var ctx = this.list.molecule.mv.ctx;
    var s = this.list.molecule.mv.settings;
    ctx.lineWidth = s.bond.connector_width;
    ctx.strokeStyle = s.bond.connector_color;

    return this.cache.get('position.connectors').each(function(c) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, c.s, c.e);
      ctx.stroke();
    });
  }
};
