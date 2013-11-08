(function() {
  var requestAnimationFrame = window.requestAnimationFrame
      || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
      || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
  if(!requestAnimationFrame) {
    requestAnimationFrame = function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  }
  window.requestAnimationFrame = requestAnimationFrame;
})();
