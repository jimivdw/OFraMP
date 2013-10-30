/**
 * Data structure for a list of bonds
 */
function BondList(molecule, bonds) {
  this.init(molecule, bonds);
}

BondList.prototype = {
  molecule: undefined,
  bonds: undefined,

  init: function(molecule, bonds) {
    this.molecule = molecule;
    this.bonds = new Array();
    bonds.each(function(bond, list) {
      list.bonds.push(new Bond(list, bond.id, molecule.atoms.get(bond.a1),
          molecule.atoms.get(bond.a2), bond.bond_type));
    }, this);
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
  each: function(f, that) {
    return this.bonds.each(f, that);
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
    return this.map(function(b) {
      return b.length();
    }).min();
  },

  /*
   * Get the shortest distance between two atoms over all bonds in this list.
   */
  shortestDistance: function() {
    return this.map(function(b) {
      return b.a1.distance(b.a2);
    }).min();
  },

  /*
   * Get the average distance between two atoms over all bonds in this list.
   */
  averageDistance: function() {
    return this.map(function(b) {
      return b.a1.distance(b.a2);
    }).avg();
  },

  /*
   * Get the longest distance between two atoms over all bonds in this list.
   */
  longestDistance: function() {
    return this.map(function(b) {
      return b.a1.distance(b.a2);
    }).max();
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
