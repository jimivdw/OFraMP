var MESSAGE_TYPES = {
  info: 1,
  warning: 2,
  error: 3,
  critical: 4,
  debug: 5
};

var ATOM_STATUSES = {
  normal: 1,
  hover: 2,
  selected: 3
};

var DEFAULT_SETTINGS = {
  interactive: false,

  oapoc: {
    url: "http://vps955.directvps.nl/OAPoC/",
    version: "0.1.3",
  },

  zoom: {
    factor: 1.1,
    min: 40,
    max: 300,
    min_bond_length: 50,
    ideal_bond_length: 70,
    max_bond_length: 150,
  },

  deoverlap: {
    deoverlap: true,
    deoverlap_atoms: true,
    deoverlap_bonds: true,
    decross_bonds: true,
    lengthen_bonds: false,
  },

  cursor: {
    normal: "default",
    drag: "move",
    click: "pointer",
  },

  popup: {
    border_width: 40,
    border_color: "rgba(0, 0, 0, 0.8)",
    padding: 10,
    font: "40px Arial",
    color: "rgb(0, 0, 0)",
    bg_colors: {
      1: "rgba(255, 255, 255, 0.9)",
      2: "rgba(253, 198, 137, 0.9)",
      3: "rgba(246, 150, 121, 0.9)",
      4: "rgba(189, 140, 191, 0.9)",
      5: "rgba(131, 147, 202, 0.9)"
    }
  },

  atom: {
    show_circ: true,
    show_h_atoms: true,
    show_id: false,
    font: "bold 12px Arial",
    charge_font: "9px Arial",
    colors: {
      S: "#b2b200",
      O: "#ff0000",
      N: "#004dff",
      H: "#707070",
      F: "#66cd00",
      Cl: "#66cd00",
      Br: "#66cd00",
      I: "#66cd00",
      other: "#000000"
    },
    charge_color: "rgb(0, 0, 0)",
    radius: 10,
    radius_charged: 20,
    charge_offset: 6,
    border_widths: {
      1: 1,
      2: 3,
      3: 3
    },
    border_color: "rgb(0, 0, 0)",
    bg_colors: {
      1: "rgb(255, 255, 255)",
      2: "rgb(204, 166,  40)",
      3: "rgb(203,  83,  73)"
    },
  },

  bond: {
    show_id: false,
    width: 1,
    color: "rgb(0, 0, 0)",
    connector_width: 3,
    connector_color: "rgb(0, 0, 0)",
    spacing: 4,
    dash_count: 5
  }
};

var SETTINGS_OPTIONS = extrapolate({
  zoom: {
    factor: {
      min: 1.01,
      max: 2,
      step: 0.01
    },
    "min, max, min_bond_length, ideal_bond_length, max_bond_length": {
      min: 0,
      max: 500,
      step: 1
    }
  },

  deoverlap: {
    "deoverlap, deoverlap_atoms, deoverlap_bonds, decross_bonds, lengthen_bonds": {
      onChange: function(v) {
        if(v) {
          mv.deoverlap();
        }
      }
    }
  },

  cursor: {
    "normal, drag, click": {
      options: ["crosshair", "default", "e-resize", "help", "move", "n-resize",
          "ne-resize", "nw-resize", "pointer", "progress", "s-resize",
          "se-resize", "sw-resize", "text", "w-resize", "wait"]
    }
  },

  popup: {
    "border_width, padding": {
      min: 0,
      max: 100,
      step: 1
    },
    "border_width, border_color, padding, font, color": {
      onChange: function() {
        mv.redraw();
      }
    },
    bg_colors: {
      "1, 2, 3, 4, 5": {
        onChange: function() {
          mv.redraw();
        }
      }
    }
  },

  atom: {
    "radius, radius_charged, charge_offset": {
      min: 0,
      max: 50,
      step: 1
    },
    show_h_atoms: {
      onChange: function() {
        mv.molecule.bonds.each(function(b) {
          b.cache.clear('appearance');
        });
        mv.redraw();
      }
    },
    "show_circ, show_id, font, charge_font, charge_color, charge_offset, border_color": {
      onChange: function() {
        mv.molecule.atoms.each(function(a) {
          a.cache.clear('appearance');
        });
        mv.redraw();
      }
    },
    "radius, radius_charged": {
      onChange: function() {
        mv.molecule.atoms.each(function(a) {
          a.cache.clear('appearance');
        });
        mv.molecule.bonds.each(function(b) {
          b.cache.clear();
        });
        mv.redraw();
      },
      onFinishChange: function() {
        mv.deoverlap();
      }
    },
    colors: {
      "S, O, N, H, F, Cl, Br, I, other": {
        onChange: function() {
          mv.molecule.atoms.each(function(a) {
            a.cache.clear('appearance');
          });
          mv.redraw();
        }
      }
    },
    border_widths: {
      "1, 2, 3": {
        min: 0,
        max: 10,
        step: 1,
        onChange: function() {
          mv.redraw();
        }
      }
    },
    bg_colors: {
      "1, 2, 3": {
        onChange: function() {
          mv.redraw();
        }
      }
    }
  },

  bond: {
    "width, connector_width, spacing": {
      min: 0,
      max: 10,
      step: 1
    },
    dash_count: {
      min: 1,
      max: 20,
      step: 1
    },
    "connector_width, spacing, dash_count": {
      onChange: function() {
        mv.molecule.bonds.each(function(b) {
          b.cache.clear('appearance');
        });
        mv.redraw();
      }
    },
    "show_id, width, color, connector_color": {
      onChange: function() {
        mv.redraw();
      }
    }
  }
});


/*
 * Nice colors: Gray: rgb(148, 148, 148) Green: rgb( 80, 169, 75) Blue: rgb( 76,
 * 81, 178) Red: rgb(203, 83, 73) Yellow: rgb(204, 166, 40) Brown: rgb(127, 79,
 * 66) Purple: rgb(227, 119, 219)
 */
