MouseEvent.prototype.getX = function() {
  return this.clientX - this.target.offsetLeft + document.body.scrollLeft;
};

MouseEvent.prototype.getY = function() {
  return this.clientY - this.target.offsetTop + document.body.scrollTop;
};
