/**
 * Data structure for a bond
 */
function Bond(list, id, a1, a2, type) {
  this.__init(list, id, a1, a2, type);
}

Bond.prototype = {
  list: undefined,
  settings: undefined,
  cache: undefined,

  id: undefined,
  a1: undefined,
  a2: undefined,
  type: undefined,


  __init: function(list, id, a1, a2, type) {
    this.list = list;
    this.settings = list.settings;
    this.cache = new Cache();

    this.id = id;
    this.a1 = a1;
    this.a2 = a2;
    this.type = type;
  },

  /*
   * Convert the basic data of this Bond to JSON.
   */
  getSimpleJSON: function() {
    return {
      a1: this.a1.id,
      a2: this.a2.id,
      bondType: this.type
    };
  },

  /*
   * Get all data of this Bond as a JSON object.
   */
  getJSON: function() {
    return {
      id: this.id,
      a1: this.a1.id,
      a2: this.a2.id,
      bondType: this.type
    };
  },

  getLGF: function() {
    // atom1 atom2 label
    return this.a1.id + "\t" + this.a2.id + "\t" + this.id + "\t" + "\n";
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

    var visible = (this.settings.atom.showHAtoms || (this.a1.element != "H" && this.a2.element != "H"))
        && (this.a1.isVisible() || this.a2.isVisible());
    this.cache.set('position.visible', visible, this.cache
        .getCache('appearance.visible'));
    return visible;
  },

  /*
   * Get the coordinates of the starting and end points of this bond.
   */
  getCoordinates: function() {
    if(this.cache.get('position.coords')) {
      return this.cache.get('position.coords');
    }

    var dx = this.a1.dx(this.a2);
    var dy = this.a1.dy(this.a2);
    var dist = this.a1.getDistanceTo(this.a2);

    if(this.a1.isShowingLabel()) {
      var ar1 = this.a1.getRadius();
    } else {
      var ar1 = 0;
    }
    var ddx1 = dx * ar1 / dist;
    var ddy1 = dy * ar1 / dist;

    if(this.a2.isShowingLabel()) {
      var ar2 = this.a2.getRadius();
    } else {
      var ar2 = 0;
    }
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
  getLength: function() {
    if(this.cache.get('position.length')) {
      return this.cache.get('position.length');
    }
    var c = this.getCoordinates();
    var dx = c.x2 - c.x1;
    var dy = c.y2 - c.y1;
    var length = Math.sqrt(dx * dx + dy * dy);
    this.cache.set('position.length', length, this.cache
        .getCache('position.coords'));
    return length;
  },

  /*
   * Determine if a point (x, y) lies within the bounding box of this bond.
   */
  isInBB: function(x, y) {
    return $ext.number.between(x, this.a1.x, this.a2.x)
        && $ext.number.between(y, this.a1.y, this.a2.y);
  },

  /*
   * Determine if a point (x, y) is on this bond.
   */
  isTouching: function(x, y) {
    if(!this.isInBB(x, y)) {
      return false;
    }

    var c = this.getCoordinates();
    var br = Math.abs(c.x1 - c.x2) / Math.abs(c.y1 - c.y2);
    var tr = Math.abs(c.x1 - x) / Math.abs(c.y1 - y);
    return $ext.number.approx(br, tr);
  },

  /*
   * Get the intersection point of this bond with anonther bond b, if any.
   * 
   * Based on the algorithm described in:
   * http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
   */
  getIntersectionWith: function(b) {
    if(this.getLength() < 10) {
      return;
    }

    var c = this.getCoordinates();
    var d = b.getCoordinates();
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
  __cacheLineCoords: function() {
    if(this.cache.get('position.lines')) {
      return this.cache.get('position.lines');
    }

    var a1 = this.a1;
    var a2 = this.a2;
    var lines = Array();

    if(this.a1.isShowingLabel()) {
      var ar1 = this.a1.getRadius();
    } else {
      var ar1 = 0;
    }
    if(this.a2.isShowingLabel()) {
      var ar2 = this.a2.getRadius();
    } else {
      var ar2 = 0;
    }
    if(this.isVisible() && a1.getDistanceTo(a2) >= ar1 + ar2) {
      var c = this.getCoordinates();
      // Inner line for single/triple/arom bonds (or amide/dummy/unknown ones)
      if([1, 3, 4, 5, 6, 7].indexOf(this.type) !== -1) {
        lines.push({
          x1: c.x1,
          y1: c.y1,
          x2: c.x2,
          y2: c.y2
        });
      }

      // Outer lines for double/triple/aromatic bonds
      if([2, 3, 5].indexOf(this.type) !== -1) {
        dx = c.x2 - c.x1;
        dy = c.y2 - c.y1;
        dist = Math.sqrt(dx * dx + dy * dy);

        // Dotted line for aromatic bonds
        if(this.type == 5) {
          ddx = dy * 2 * this.settings.bond.spacing / dist;
          ddy = dx * 2 * this.settings.bond.spacing / dist;

          // Find the center of the aromatic cycle
          var cycle = this.a2.getCycle(true);
          var center = new AtomList(this.list.molecule, cycle).getCenterPoint();
          var cdx1 = center.x - (c.x1 + ddx);
          var cdy1 = center.y - (c.y1 - ddy);
          var cdx2 = center.x - (c.x1 - ddx);
          var cdy2 = center.y - (c.y1 + ddy);
          var cdist1 = Math.sqrt(cdx1 * cdx1 + cdy1 * cdy1);
          var cdist2 = Math.sqrt(cdx2 * cdx2 + cdy2 * cdy2);

          if(cdist1 > cdist2) {
            lines.push({
              x1: c.x1 - ddx,
              y1: c.y1 + ddy,
              x2: c.x2 - ddx,
              y2: c.y2 + ddy,
              n: this.settings.bond.dashCount
            });
          } else {
            lines.push({
              x1: c.x1 + ddx,
              y1: c.y1 - ddy,
              x2: c.x2 + ddx,
              y2: c.y2 - ddy,
              n: this.settings.bond.dashCount
            });
          }
        } else {
          ddx = dy * this.settings.bond.spacing / dist;
          ddy = dx * this.settings.bond.spacing / dist;

          lines.push({
            x1: c.x1 + ddx,
            y1: c.y1 - ddy,
            x2: c.x2 + ddx,
            y2: c.y2 - ddy
          });
          lines.push({
            x1: c.x1 - ddx,
            y1: c.y1 + ddy,
            x2: c.x2 - ddx,
            y2: c.y2 + ddy
          });
        }
      }
    }

    this.cache.set('position.lines', lines, [
        this.cache.getCache('appearance.lines'),
        this.cache.getCache('position.visible'),
        this.cache.getCache('position.coords')]);

    return lines;
  },

  /*
   * Cache the coordinates of the bond's connector on atom a.
   */
  __cacheConnectorCoords: function(a) {
    if(this.cache.get('position.connectors')) {
      var connectors = this.cache.get('position.connectors');
    } else {
      var connectors = new Array();
    }

    if(!a.isShowingLabel()) {
      return [];
    }

    var ep = {
      x: a.x + a.getRadius(),
      y: a.y
    };

    var c = this.getCoordinates();
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

    var delta = this.settings.bond.connectorWidth / a.getRadius() / 2;

    if([1, 3, 4, 5, 6, 7].indexOf(this.type) !== -1) {
      connectors.push({
        x: a.x,
        y: a.y,
        r: a.getRadius(),
        s: alpha - delta,
        e: alpha + delta
      });
    }

    // For double/triple bonds
    if([2, 3].indexOf(this.type) !== -1) {
      var beta = Math.acos((2 * r2 - Math.pow(this.settings.bond.spacing, 2))
          / (2 * r2));

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
        this.cache.getCache('position.visible'),
        this.cache.getCache('position.coords')]);

    return connectors;
  },

  /*
   * Cache the coordinates of this bond's atom connectors.
   */
  __cacheConnectorsCoords: function() {
    if(this.cache.get('position.connectors')) {
      return this.cache.get('position.connectors');
    }

    if(!this.isVisible()) {
      this.cache.set('position.connectors', [], [
          this.cache.getCache('appearance.connectors'),
          this.cache.getCache('position.visible'),
          this.cache.getCache('position.coords')]);
      return [];
    }

    var c1 = this.__cacheConnectorCoords(this.a1);
    var c2 = this.__cacheConnectorCoords(this.a2);
    return $ext.merge(c1, c2, true);
  },

  /*
   * Draw this bond.
   */
  draw: function() {
    this.drawConnectors();
    var lines = this.__cacheLineCoords();

    var ctx = this.list.molecule.mv.ctx;
    var s = this.settings;

    ctx.lineWidth = s.bond.width;
    ctx.strokeStyle = s.bond.color;

    $ext.each(lines, function(l) {
      if(l.n) {
        $ext.context.dashedLine(ctx, l.x1, l.y1, l.x2, l.y2, l.n);
      } else {
        $ext.context.line(ctx, l.x1, l.y1, l.x2, l.y2);
      }
    });

    // Draw the bond ID
    if(s.bond.id.show && this.isVisible()) {
      var c = this.getCoordinates();
      ctx.fillStyle = s.bond.id.bgColor;
      var r = s.bond.id.radius;
      ctx.beginPath();
      ctx.arc((c.x1 + c.x2) / 2, (c.y1 + c.y2) / 2, r, 0, 2 * Math.PI);
      ctx.fill();

      ctx.font = s.bond.id.font;
      ctx.fillStyle = s.bond.id.color;
      ctx.fillText(this.id, (c.x1 + c.x2) / 2, (c.y1 + c.y2) / 2);
    }
  },

  /*
   * Draw this bond's connectors.
   */
  drawConnectors: function() {
    var connectors = this.__cacheConnectorsCoords();

    var ctx = this.list.molecule.mv.ctx;
    ctx.lineWidth = this.settings.bond.connectorWidth;
    ctx.strokeStyle = this.settings.bond.connectorColor;

    $ext.each(connectors, function(c) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, c.s, c.e);
      ctx.stroke();
    });
  }
};
