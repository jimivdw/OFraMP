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
