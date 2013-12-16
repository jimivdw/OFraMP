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

  toJSON: function() {
    return {
      key: this.key,
      value: this.value,
      children: $ext.array.map(this.children, function(child) {
        return child.toJSON();
      })
    };
  },

  depth: function() {
    depths = $ext.array.map(this.children, function(child) {
      return child.depth();
    });
    if(depths.length > 0) {
      return 1 + $ext.array.max(depths);
    } else {
      return 1;
    }
  },

  getSiblings: function() {
    var r = new Array();
    $ext.each(this.parent.children, function(child) {
      if(child !== this) {
        r.push(child);
      }
    }, this);
    return r;
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

  each: function(f, scope, i) {
    var r = f.call(scope, this, i);
    if(r !== undefined) {
      return r;
    }

    return $ext.each(this.children, function(child, i) {
      var r = child.each(f, scope, i);
      if(r !== undefined) {
        return r;
      }
    });
  },

  __filterChildren: function(f, scope) {
    for( var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      if(f.call(scope, child) !== true) {
        this.removeChild(child.key);
        i--;
      } else {
        child.__filterChildren(f, scope);
      }
    }
  },

  filter: function(f, scope) {
    // Return an empty tree if the root node needs to be filtered out.
    if(f.call(scope, this) !== true) {
      return new Tree();
    }

    var cp = $ext.copy(this)
    cp.__filterChildren(f, scope);
    return cp;
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
  findSequences: function(needles, f) {
    f = f || $ext.id;

    var needle = needles.shift();
    if(needle instanceof Array) {
      var subsequences = this.findSequences($ext.copy(needle), f);
      if(subsequences.length > 0) {
        var parentneedle = [f(this.parent.value)].concat(needles);
        var parentsequences = this.parent.findSequences(parentneedle, f);
        var childsequences = $ext.array.map(parentsequences, function(s) {
          s.shift();
          return s;
        });

        var sequences = new Array();
        $ext.each(childsequences, function(childsequence) {
          $ext.each(subsequences, function(subsequence) {
            var sequence = [subsequence].concat(childsequence);
            var flatsequence = $ext.array.flatten(sequence);
            if($ext.array.unique(flatsequence).length === flatsequence.length) {
              sequences.push(sequence);
            }
          });
        });
        return sequences;
      } else {
        return [];
      }
    } else if(needle === f(this.value)) {
      if(needles.length == 0) {
        return [[this.value]];
      } else {
        var sequences = new Array();
        $ext.each(this.children, function(child) {
          var childsequences = child.findSequences($ext.copy(needles), f);
          if($ext.array.flatten(childsequences).indexOf(this.value) == -1) {
            sequences = sequences.concat(childsequences);
          }
        }, this);

        if(sequences.length > 0) {
          return $ext.array.map(sequences, function(sequence) {
            return [this.value].concat(sequence);
          }, this);
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
  },

  toIDString: function() {
    return JSON.stringify($ext.array.map(this.toArray(), function(node) {
      return node.id;
    }, null, true));
  }
};
