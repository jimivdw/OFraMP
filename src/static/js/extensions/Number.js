// Determine if a number is inbetween two other numbers.
Number.prototype.between = function(a, b) {
  return a > b ? this <= a && this >= b : this >= a && this <= b;
};

// Determine if a number is approximately equal to another number n
Number.prototype.approx = function(n) {
  return this.between(n - 1e-3, n + 1e-3);
};
