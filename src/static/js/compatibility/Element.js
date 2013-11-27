// From: http://stackoverflow.com/questions/597268/element-prototype-in-ie7
(function() {
  if(!window.Element) {
    Element = function() {};

    var __createElement = document.createElement;
    document.createElement = function(tagName) {
      var element = __createElement(tagName);
      if(element == null) {
        return null;
      }
      for( var key in Element.prototype)
        element[key] = Element.prototype[key];
      return element;
    }

    var __getElementById = document.getElementById;
    document.getElementById = function(id) {
      var element = __getElementById(id);
      if(element == null) {
        return null;
      }
      for( var key in Element.prototype)
        element[key] = Element.prototype[key];
      return element;
    }
  }
})();

(function() {
  if(document.createElement("div").firstChild === undefined) {
    Object.defineProperty(Element.prototype, 'firstChild', {
      get: function() {
        if(this.children) {
          return this.childNodes[0] || null;
        } else {
          return null;
        }
      }
    });
  }
})();

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
