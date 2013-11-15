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

  fromArray: function(arr, f) {
    f = f || $ext.id;

    var e = arr.shift();
    var n = new Node(this, f(e), e);
    this.children.push(n);
    while(arr[0] instanceof Array) {
      e = arr.shift();
      n.fromArray($ext.copy(e), f);
    }
    if(arr.length > 0) {
      n.fromArray(arr, f);
    }
    return n;
  },

  toArray: function() {
    var lp = this.longestPathNodes();
    var arr = $ext.array.map(lp, function(node) {
      return node.value;
    });
    $ext.each(lp, function(node, i) {
      $ext.each(node.children, function(child) {
        var p = arr.indexOf(node.value);
        if(!$ext.array.containsr(arr, child.value)) {
          $ext.array.insertAt(arr, ++p, child.toArray());
        }
      });
    });
    return arr;
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

  getChild: function(key) {
    var r = $ext.each(this.children, function(child) {
      if(child.key === key) {
        return child;
      }
    });
    return r;
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

  /*
   * Find a given sequence seq in the tree.
   * 
   * The function f acts as a mapping function for transforming tree values into
   * values of the sequence.
   * 
   * Note that, for subsequences, the first element will NOT be considered as
   * part of the main sequence.
   */
  // TODO: refactor, this is horrible...
  // TODO 2: fix the wrong concatenation in subsequences.
  findSequences: function(seq, f) {
    f = f || $ext.id;

    var e = seq.shift();
    if(e instanceof Array) {
      var ss = this.findSequences($ext.copy(e), f);
      if(ss.length > 0) {
        if(seq.length > 0) {
          var seqs = new Array();
          $ext.each(this.parent.children, function(child) {
            var s = child.findSequences($ext.copy(seq), f);
            if(s.length > 0) {
              seqs = seqs.concat(s);
            }
          });
          if(seqs.length > 0) {
            var q = new Array();
            $ext.each(seqs, function(s) {
              if($ext.array.flatten(s).indexOf(this.value) == -1) {
                $ext.each(ss, function(sse) {
                  q.push([sse.concat(s)]);
                });
              }
            }, this);
            return q;
          } else {
            return [];
          }
        } else {
          return [ss];
        }
      } else {
        return [];
      }
    } else if(e === f(this.value)) {
      if(seq.length == 0) {
        return [[this.value]];
      } else {
        var seqs = new Array();
        $ext.each(this.children, function(child) {
          var s = child.findSequences($ext.copy(seq), f);
          if(s.length > 0) {
            seqs = seqs.concat(s);
          }
        });
        if(seqs.length > 0) {
          var q = new Array();
          $ext.each(seqs, function(s) {
            if($ext.array.flatten(s).indexOf(this.value) == -1) {
              q.push([this.value].concat(s));
            }
          }, this);
          return q;
        } else {
          return [];
        }
      }
    } else {
      return [];
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
  },

  longestPathNodes: function() {
    var depths = $ext.array.map(this.children, function(child) {
      return child.depth();
    });

    var deepest = this.children[depths.indexOf($ext.array.max(depths))];
    var path = [this];
    if(deepest && deepest.children.length > 0) {
      path = path.concat(deepest.longestPathNodes());
    }
    return path;
  },

  longestPath: function() {
    return $ext.array.map(this.longestPathNodes(), function(node) {
      return node.value;
    });
  }
};
