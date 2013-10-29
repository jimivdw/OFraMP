/*
 * Get the proper x coordinate of a MouseEvent.
 */
MouseEvent.prototype.getX = function() {
  return this.clientX - this.target.offsetLeft + document.body.scrollLeft;
};

/*
 * Get the proper y coordinate of a MouseEvent.
 */
MouseEvent.prototype.getY = function() {
  return this.clientY - this.target.offsetTop + document.body.scrollTop;
};
