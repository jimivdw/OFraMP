$ext.extend($ext, {
  mouse: {
    /*
     * Get the proper x coordinate of a MouseEvent.
     */
    getX: function(evt) {
      return evt.clientX - evt.target.offsetLeft
          + document.documentElement.scrollLeft;
    },

    /*
     * Get the proper y coordinate of a MouseEvent.
     */
    getY: function(evt) {
      return evt.clientY - evt.target.offsetTop
          + document.documentElement.scrollTop;
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
  }
});
