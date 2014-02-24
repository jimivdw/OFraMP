var mouse = {
  /*
   * Mouse button codes
   */
  LEFT: 0,
  RIGHT: 2,
  MIDDLE: 1,

  /*
   * Get the proper x coordinate of a MouseEvent.
   */
  getX: function(evt) {
    if(evt.target) {
      return evt.clientX - $ext.dom.totalOffsetLeft(evt.target)
          + $ext.dom.totalScrollLeft(evt.target);
    } else if(evt.srcElement) {
      return evt.clientX - $ext.dom.totalOffsetLeft(evt.srcElement)
          + $ext.dom.totalScrollLeft(evt.srcElement);
    } else {
      return evt.clientX + document.documentElement.scrollLeft;
    }
  },

  /*
   * Get the proper y coordinate of a MouseEvent.
   */
  getY: function(evt) {
    if(evt.target) {
      return evt.clientY - $ext.dom.totalOffsetTop(evt.target)
          + $ext.dom.totalScrollTop(evt.target);
    } else if(evt.srcElement) {
      return evt.clientY - $ext.dom.totalOffsetTop(evt.srcElement)
          + $ext.dom.totalScrollTop(evt.srcElement);
    } else {
      return evt.clientY + document.documentElement.scrollTop;
    }
  },

  /*
   * Get the proper (x, y) coordinates of a MouseEvent.
   */
  getCoords: function(evt) {
    return {
      x: this.getX(evt),
      y: this.getY(evt)
    }
  }
};

$ext.extend($ext, {
  mouse: mouse
});
