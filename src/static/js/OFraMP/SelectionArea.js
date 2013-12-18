function SelectionArea(mv, x, y) {
  this.__init(mv, x, y);
}

SelectionArea.prototype = {
  __init: function(mv, x, y) {
    this.mv = mv;
    this.x = x;
    this.y = y;
    this.width = 0;
    this.height = 0;
  },

  getBB: function() {
    return {
      x1: this.width > 0 ? this.x : this.x + this.width,
      y1: this.height > 0 ? this.y : this.y + this.height,
      x2: this.width < 0 ? this.x : this.x + this.width,
      y2: this.height < 0 ? this.y : this.y + this.height
    };
  },

  resize: function(dx, dy) {
    this.width += dx;
    this.height += dy;
  },

  draw: function() {
    this.mv.ctx.fillStyle = this.mv.settings.selection.color;
    this.mv.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.mv.ctx.lineWidth = this.mv.settings.selection.borderWidth;
    this.mv.ctx.strokeStyle = this.mv.settings.selection.borderColor;
    this.mv.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
};
