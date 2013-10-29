/**
 * Data structure for a list of bonds
 */
function BondList(molecule, bonds) {
  this.molecule = molecule;
  this.bonds = new Array();
  var atoms = molecule.atoms;
  for( var i = 0; i < bonds.length; i++) {
    var bond = bonds[i];
    var b = new Bond(this, atoms.get(bond.a1), atoms.get(bond.a2),
        bond.bond_type);
    this.bonds.push(b);
  }
}

BondList.prototype.get = function(i) {
  return this.bonds[i];
};

BondList.prototype.count = function() {
  return this.bonds.length;
};

BondList.prototype.shortestLength = function() {
  return this.bonds.map(function(b) {
    return b.length();
  }).min();
};

BondList.prototype.shortestDistance = function() {
  return this.bonds.map(function(b) {
    return b.a1.distance(b.a2);
  }).min();
};

BondList.prototype.averageDistance = function() {
  return this.bonds.map(function(b) {
    return b.a1.distance(b.a2);
  }).avg();
};

BondList.prototype.longestDistance = function() {
  return this.bonds.map(function(b) {
    return b.a1.distance(b.a2);
  }).max();
};

BondList.prototype.draw = function() {
  this.bonds.forEach(function(b) {
    b.draw();
  });
};
