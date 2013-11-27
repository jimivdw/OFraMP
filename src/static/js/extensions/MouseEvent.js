$ext.extend($ext, {
  mouse: {
    /*
     * Get the proper x coordinate of a MouseEvent.
     */
    getX: function(evt) {
      if(evt.target) {
        return evt.clientX - evt.target.offsetLeft
            + document.documentElement.scrollLeft;
      } else if(evt.srcElement) {
        return evt.clientX - evt.srcElement.offsetLeft
            + document.documentElement.scrollLeft;
      } else {
        return evt.clientX + document.documentElement.scrollLeft;
      }
    },

    /*
     * Get the proper y coordinate of a MouseEvent.
     */
    getY: function(evt) {
      if(evt.target) {
        return evt.clientY - evt.target.offsetTop
            + document.documentElement.scrollTop;
      } else if(evt.srcElement) {
        return evt.clientY - evt.srcElement.offsetTop
            + document.documentElement.scrollTop;
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
  }
});
