/**
 * Data structure for a list of bonds
 */
function BondList(molecule, bonds) {
  this.init(molecule, bonds);
}

BondList.prototype = {
  molecule: undefined,
  bonds: undefined,
  cache: undefined,

  init: function(molecule, bonds) {
    this.molecule = molecule;
    this.bonds = new Array();
    $ext.each(bonds, function(bond) {
      this.bonds.push(new Bond(this, bond.id, molecule.atoms.get(bond.a1),
          molecule.atoms.get(bond.a2), bond.bond_type));
    }, this);
    this.cache = new Cache();
  },

  /*
   * Get the bond with the given ID.
   */
  get: function(id) {
    return this.bonds[this.indexOf(id)];
  },

  /*
   * Get the index in the list of the bond with the given ID.
   */
  indexOf: function(id) {
    for( var i = 0; i < this.count(); i++) {
      if(this.bonds[i].id === id) {
        return i;
      }
    }
  },

  /*
   * Get the number of bonds in the list.
   */
  count: function() {
    return this.bonds.length;
  },

  /*
   * Apply a function to each bond in this list.
   */
  each: function(f, scope) {
    return $ext.each(this.bonds, f, scope);
  },

  /*
   * Mapping function for the list of bonds.
   */
  map: function(f, that) {
    return this.bonds.mapF(f, that);
  },

  /*
   * Get the shortest bond length.
   */
  shortestLength: function() {
    if(this.cache.get('position.shortest_length')) {
      return this.cache.get('position.shortest_length');
    }
    var sl = this.map(function(b) {
      return b.length();
    }).min();
    this.cache.set('position.shortest_length', sl);
    return sl;
  },

  /*
   * Get the shortest distance between two atoms over all bonds in this list.
   */
  shortestDistance: function() {
    if(this.cache.get('position.shortest_distance')) {
      return this.cache.get('position.shortest_distance');
    }
    var sd = this.map(function(b) {
      return b.a1.distance(b.a2);
    }).min();
    this.cache.set('position.shortest_distance', sd);
    return sd;
  },

  /*
   * Get the average distance between two atoms over all bonds in this list.
   */
  averageDistance: function() {
    if(this.cache.get('position.average_distance')) {
      return this.cache.get('position.average_distance');
    }
    var ad = this.map(function(b) {
      return b.a1.distance(b.a2);
    }).avg();
    this.cache.set('position.average_distance', ad);
    return ad;
  },

  /*
   * Get the longest distance between two atoms over all bonds in this list.
   */
  longestDistance: function() {
    if(this.cache.get('position.longest_distance')) {
      return this.cache.get('position.longest_distance');
    }
    var ld = this.map(function(b) {
      return b.a1.distance(b.a2);
    }).max();
    this.cache.set('position.longest_distance', ld);
    return ld;
  },

  clearCache: function(name) {
    this.cache.clear(name);
    this.molecule.clearCache(name);
  },

  /*
   * Draw all bonds in this list.
   */
  draw: function() {
    this.each(function(b) {
      b.draw();
    });
  }
};
