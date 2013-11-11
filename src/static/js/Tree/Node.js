function Tree(key, value) {
  return new Node(undefined, key, value);
}

function Node(parent, key, value) {
  this.init(parent, key, value);
}

Node.prototype = {
  init: function(parent, key, value) {
    this.parent = parent;
    this.key = key;
    this.value = value;
    this.children = new Array();
  },

  addChild: function(key, value) {
    if(this.find(key)) {
      return false;
    }

    var c = new Node(this, key, value);
    this.children.push(c);
    return c;
  },

  removeChild: function(key) {
    var ci;
    $ext.each(this.children, function(child, i) {
      if(child.key === key) {
        ci = i;
        return $ext.BREAK;
      }
    });
    if(ci !== undefined) {
      return this.children.splice(ci, 1)[0];
    }
  },

  findNode: function(key) {
    if(this.key === key) {
      return this;
    }

    return $ext.each(this.children, function(child) {
      var r = child.findNode(key);
      if(r) {
        return r;
      }
    });
  },

  find: function(key) {
    var n = this.findNode(key);
    if(n) {
      return n.value;
    }
  },

  flatten: function(tgt) {
    if(!tgt) {
      tgt = new Array();
    }

    if(tgt.indexOf(this.value) === -1) {
      tgt.push(this.value);
    }

    $ext.each(this.children, function(child) {
      child.flatten(tgt);
    });

    return tgt;
  }
};