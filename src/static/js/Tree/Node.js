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

  depth: function() {
    depths = $ext.array.map(this.children, function(child) {
      return child.depth();
    }, this);
    if(depths.length > 0) {
      return 1 + $ext.array.max(depths);
    } else {
      return 1;
    }
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

  findNode: function(key, skip) {
    if(this.key === key && !skip) {
      return this;
    }

    return $ext.each(this.children, function(child) {
      var r = child.findNode(key);
      if(r) {
        return r;
      }
    });
  },

  /*
   * Breadth first serch for the node with the given key.
   * 
   * Skip the first result if skip is true (useful for finding cycles).
   */
  findNodeB: function(key, skip) {
    var q = [this];
    var pq = [[]];
    while(q.length > 0) {
      var n = q.shift();
      var p = pq.shift();
      if(n.key === key && (!skip || p.length > 0)) {
        return n;
      }

      $ext.each(n.children, function(child) {
        if(p.indexOf(child.key) === -1) {
          q.push(child);
          pq.push(p.concat(child.key));
        }
      });
    }
  },

  find: function(key) {
    var n = this.findNode(key);
    if(n) {
      return n.value;
    }
  },

  /*
   * Breadth first search for the value of the node with the given key.
   */
  findB: function(key) {
    var n = this.findNodeB(key);
    if(n) {
      return n.value;
    }
  },

  findPath: function(key) {
    var n = this.findNode(key, true);
    if(!n) {
      return [];
    }

    var p = new Array();
    while(n.parent) {
      p.push(n.value);
      n = n.parent;
    }
    return p;
  },

  /*
   * Find the shortest path from this node to the node with the given key.
   */
  findShortestPath: function(key) {
    var n = this.findNodeB(key, true);
    if(!n) {
      return [];
    }

    var p = new Array();
    while(n.parent) {
      p.push(n.value);
      n = n.parent;
    }
    return p;
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