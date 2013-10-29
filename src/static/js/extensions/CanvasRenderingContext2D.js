DEFAULT_DASH_COUNT = 2;

CanvasRenderingContext2D.prototype.centerPoint = function() {
  return {
    x: this.canvas.width / 2,
    y: this.canvas.height / 2
  };
};

CanvasRenderingContext2D.prototype.clear = function() {
  this.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

CanvasRenderingContext2D.prototype.drawLine = function(x1, y1, x2, y2) {
  this.beginPath();
  this.moveTo(x1, y1);
  this.lineTo(x2, y2);
  this.closePath();
  this.stroke();
};

CanvasRenderingContext2D.prototype.drawDashedLine = function(x1, y1, x2, y2, n) {
  dx = x2 - x1;
  dy = y2 - y1;
  dz = Math.sqrt(dx * dx + dy * dy);

  n = n || DEFAULT_DASH_COUNT;
  l = dz / (n * 2 - 1);

  ddx = dx * l / dz;
  ddy = dy * l / dz;
  for( var i = 0; i < n; i++) {
    this.drawLine(x1 + 2 * i * ddx, y1 + 2 * i * ddy, x1 + (2 * i + 1) * ddx,
        y1 + (2 * i + 1) * ddy);
  }
};

// Based on:
// http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial
CanvasRenderingContext2D.prototype.textLines = function(x, y, w, h, text,
    hard_wrap) {
  //var ctx = this;

  var lines = Array();
  var hard_lines = text.trim().split("\n");
  hard_lines.each(function(hard_line, ctx) {
    if(ctx.measureText(hard_line).width > w) {
      var line = "";
      var words = hard_line.split(" ");
      words.each(function(word) {
        var nline = line + word + " ";
        if(ctx.measureText(nline).width > w) {
          lines.push(line);

          if(ctx.measureText(word).width > w && hard_wrap) {
            line = "";
            var chars = word.split("");
            chars.each(function(char) {
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
  }, this);
  return lines;
};

CanvasRenderingContext2D.prototype.boxedFillText = function(x, y, w, h, text,
    hard_wrap) {

  var lines = this.textLines(x, y, w, h, text, hard_wrap);
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

  lines.each(function(line, ctx) {
    if(y <= max_y) {
      ctx.fillText(line, x, y);
    }
    y += lineHeight;
  }, this);
};
