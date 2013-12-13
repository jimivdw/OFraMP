function SelectionArea(mv, x, y) {
  this.init(mv, x, y);
}

SelectionArea.prototype = {
  init: function(mv, x, y) {
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
    mv.ctx.fillStyle = mv.settings.selection.color;
    mv.ctx.fillRect(this.x, this.y, this.width, this.height);
    mv.ctx.lineWidth = mv.settings.selection.border_width;
    mv.ctx.strokeStyle = mv.settings.selection.border_color;
    mv.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
};
