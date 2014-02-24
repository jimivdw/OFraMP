var context = {
  DEFAULT_DASH_COUNT: 2,

  getContext: function(elem, type) {
    if($ext.onBrokenIE()) {
      G_vmlCanvasManager.initElement(elem);
    }
    return elem.getContext(type);
  },

  /*
   * Get the coordinates of the center point of the canvas.
   */
  centerPoint: function(ctx) {
    return {
      x: ctx.canvas.width / 2,
      y: ctx.canvas.height / 2
    };
  },

  /*
   * Clear the canvas.
   */
  clear: function(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },

  /*
   * Draw a line from (x1, y1) to (x2, y2).
   */
  line: function(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
  },

  /*
   * Draw a dashed line of n dashes from (x1, y1) to (x2, y2).
   */
  dashedLine: function(ctx, x1, y1, x2, y2, n) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dist = Math.sqrt(dx * dx + dy * dy);

    var n = n || this.DEFAULT_DASH_COUNT;
    var l = dist / (n * 2 - 1);

    var ddx = dx * l / dist;
    var ddy = dy * l / dist;
    for( var i = 0; i < n; i++) {
      this.line(ctx, x1 + 2 * i * ddx, y1 + 2 * i * ddy,
          x1 + (2 * i + 1) * ddx, y1 + (2 * i + 1) * ddy);
    }
  },

  /*
   * Get the lines of a given text, provided that is has to fit in a box of size
   * w * h. It will split inside words if hard_wrap is set to true.
   * 
   * Based on the original implementation of:
   * http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial
   */
  textLines: function(ctx, w, h, text, hard_wrap) {
    var lines = Array();
    var hard_lines = text.trim().split("\n");
    $ext.each(hard_lines, function(hard_line) {
      if(ctx.measureText(hard_line).width > w) {
        var line = "";
        var words = hard_line.split(" ");
        $ext.each(words, function(word) {
          var nline = line + word + " ";
          if(ctx.measureText(nline).width > w) {
            lines.push(line);

            if(ctx.measureText(word).width > w && hard_wrap) {
              line = "";
              var chars = word.split("");
              $ext.each(chars, function(char) {
                var nline = line + char;
                if(ctx.measureText(nline).width > w) {
                  lines.push(line);
                  line = char;
                } else {
                  line = nline;
                }
              });
              line += " ";
            } else {
              line = word + " ";
            }
          } else {
            line = nline;
          }
        });
        lines.push(line);
      } else {
        lines.push(hard_line);
      }
    });
    return lines;
  },

  /*
   * Show a given text at the position (x, y), while making sure it fits in the
   * box of size w * h.
   */
  boxedFillText: function(ctx, x, y, w, h, text, hard_wrap) {
    var lines = this.textLines(ctx, w, h, text, hard_wrap);
    var lineHeight = parseInt(ctx.font.split("px")[0]) * 1.2;

    var min_y = y;
    var max_y = y + h;
    var ll = lines.length - 1;
    var bl = ctx.textBaseline.toLowerCase();
    if(bl === "bottom") {
      min_y = y - h + lineHeight;
      max_y = y;
      y -= ll * lineHeight;
      if(y < min_y) {
        y = min_y;
      }
    } else if(bl === "middle") {
      min_y = y - h / 2 + lineHeight / 2;
      max_y = y + h / 2 - lineHeight / 2;
      y -= (ll / 2) * lineHeight;
      if(y < min_y) {
        y = min_y;
      }
    }

    $ext.each(lines, function(line) {
      if(y <= max_y) {
        ctx.fillText(line, x, y);
      }
      y += lineHeight;
    });
  }
};

$ext.extend($ext, {
  context: context
});
