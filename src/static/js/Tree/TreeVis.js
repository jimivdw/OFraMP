function TreeVis(tree) {
  this.init(tree);
}

TreeVis.prototype = {
  init: function(tree) {
    this.tree = tree;
    this.canvas = document.createElement('canvas');
    this.ctx = $ext.context.getContext(this.canvas, '2d');
  },

  __drawRow: function(nodes, x, y, width, px, py) {
    $ext.each(nodes, function(node, i) {
      if(px && py) {
        $ext.context.line(this.ctx, px, py, x + i * width + width / 2, y);
      }
      this.ctx.fillText(node.key, x + i * width + width / 2, y);
      if(node.children && node.children.length > 0) {
        this.__drawRow(node.children, x + i * width, y + 40, width
            / node.children.length, x + i * width + width / 2, y);
      }
    }, this);
  },

  draw: function() {
    $ext.context.clear(this.ctx);
    this.__drawRow([this.tree], 0, 40, this.canvas.width);
  },

  overlayOnScreen: function() {
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "10px";
    this.canvas.style.left = "10px";
    this.canvas.style.backgroundColor = "#FFF";
    this.canvas.width = document.documentElement.clientWidth - 20;
    this.canvas.height = document.documentElement.clientHeight - 20;
    this.draw();
    document.documentElement.appendChild(this.canvas);
  }
};
