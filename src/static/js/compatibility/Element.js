(function() {
  if(document.createElement("div").firstElementChild === undefined) {
    Object.defineProperty(Element.prototype, 'firstElementChild', {
      get: function() {
        if(this.children) {
          return this.children[0] || null;
        } else {
          return null;
        }
      }
    });
  }
})();

(function() {
  if(document.createElement("div").remove === undefined) {
    Element.prototype.remove = function() {
      this.parentElement.removeChild(this);
    };
  }
})();
