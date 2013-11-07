DEFAULT_DASH_COUNT = 2;

/*
 * Get the coordinates of the center point of the canvas.
 */
CanvasRenderingContext2D.prototype.centerPoint = function() {
  return {
    x: this.canvas.width / 2,
    y: this.canvas.height / 2
  };
};

/*
 * Clear the canvas.
 */
CanvasRenderingContext2D.prototype.clear = function() {
  this.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

/*
 * Draw a line from (x1, y1) to (x2, y2).
 */
CanvasRenderingContext2D.prototype.drawLine = function(x1, y1, x2, y2) {
  this.beginPath();
  this.moveTo(x1, y1);
  this.lineTo(x2, y2);
  this.closePath();
  this.stroke();
};

/*
 * Draw a dashed line of n dashes from (x1, y1) to (x2, y2).
 */
CanvasRenderingContext2D.prototype.drawDashedLine = function(x1, y1, x2, y2, n) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  var dz = Math.sqrt(dx * dx + dy * dy);

  var n = n || DEFAULT_DASH_COUNT;
  var l = dz / (n * 2 - 1);

  var ddx = dx * l / dz;
  var ddy = dy * l / dz;
  for( var i = 0; i < n; i++) {
    this.drawLine(x1 + 2 * i * ddx, y1 + 2 * i * ddy, x1 + (2 * i + 1) * ddx,
        y1 + (2 * i + 1) * ddy);
  }
};

/*
 * Get the lines of a given text, provided that is has to fit in a box of size w *
 * h. It will split inside words if hard_wrap is set to true.
 * 
 * Based on the original implementation of:
 * http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial
 */
CanvasRenderingContext2D.prototype.textLines = function(w, h, text, hard_wrap) {
  var lines = Array();
  var hard_lines = text.trim().split("\n");
  $ext.each(hard_lines, function(hard_line) {
    if(this.measureText(hard_line).width > w) {
      var line = "";
      var words = hard_line.split(" ");
      $ext.each(words, function(word) {
        var nline = line + word + " ";
        if(this.measureText(nline).width > w) {
          lines.push(line);

          if(this.measureText(word).width > w && hard_wrap) {
            line = "";
            var chars = word.split("");
            $ext.each(chars, function(char) {
              var nline = line + char;
              if(this.measureText(nline).width > w) {
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
  }, this);
  return lines;
};

/*
 * Show a given text at the position (x, y), while making sure it fits in the
 * box of size w * h.
 */
CanvasRenderingContext2D.prototype.boxedFillText = function(x, y, w, h, text,
    hard_wrap) {

  var lines = this.textLines(w, h, text, hard_wrap);
  var lineHeight = parseInt(this.font.split("px")[0]) * 1.2;

  var min_y = y;
  var max_y = y + h;
  var ll = lines.length - 1;
  var bl = this.textBaseline.toLowerCase();
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
      this.fillText(line, x, y);
    }
    y += lineHeight;
  }, this);
};
