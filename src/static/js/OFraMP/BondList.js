/**
 * Data structure for a list of bonds
 */
function BondList(molecule, bonds) {
  this.init(molecule, bonds);
}

BondList.prototype = {
  molecule: undefined,
  settings: undefined,
  cache: undefined,

  bonds: undefined,

  init: function(molecule, bonds) {
    this.molecule = molecule;
    this.settings = molecule.settings;
    this.cache = new Cache();

    this.bonds = new Array();
    $ext.each(bonds, function(bond) {
      this.bonds.push(new Bond(this, bond.id, molecule.atoms.get(bond.a1),
          molecule.atoms.get(bond.a2), bond.bond_type));
    }, this);
  },

  /*
   * Convert the basic data of this BondList to JSON.
   */
  getSimpleJSON: function() {
    return $ext.array.map(this.bonds, function(bond) {
      return bond.getSimpleJSON();
    });
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
  map: function(f, scope) {
    return $ext.array.map(this.bonds, f, scope);
  },

  /*
   * Get the shortest bond length.
   */
  getShortestLength: function() {
    if(this.cache.get('position.shortestLength')) {
      return this.cache.get('position.shortestLength');
    }
    var sl = $ext.array.min(this.map(function(b) {
      return b.getLength();
    }));
    this.cache.set('position.shortestLength', sl);
    return sl;
  },

  /*
   * Get the shortest distance between two atoms over all bonds in this list.
   */
  getShortestDistance: function() {
    if(this.cache.get('position.shortestDistance')) {
      return this.cache.get('position.shortestDistance');
    }
    var sd = $ext.array.min(this.map(function(b) {
      return b.a1.getDistanceTo(b.a2);
    }));
    this.cache.set('position.shortestDistance', sd);
    return sd;
  },

  /*
   * Get the average distance between two atoms over all bonds in this list.
   */
  getAverageDistance: function() {
    if(this.cache.get('position.averageDistance')) {
      return this.cache.get('position.averageDistance');
    }
    var ad = $ext.array.avg(this.map(function(b) {
      return b.a1.getDistanceTo(b.a2);
    }));
    this.cache.set('position.averageDistance', ad);
    return ad;
  },

  /*
   * Get the longest distance between two atoms over all bonds in this list.
   */
  getLongestDistance: function() {
    if(this.cache.get('position.longestDistance')) {
      return this.cache.get('position.longestDistance');
    }
    var ld = $ext.array.max(this.map(function(b) {
      return b.a1.getDistanceTo(b.a2);
    }));
    this.cache.set('position.longestDistance', ld);
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
