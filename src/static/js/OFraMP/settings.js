var MESSAGE_TYPES = {
  info: 1,
  warning: 2,
  error: 3,
  critical: 4,
  debug: 5
};

var ATOM_STATUSES = {
  normal: 0,
  highlighted: 1,
  hover: 2,
  selected: 4
};

var PREDEFINED_MOLECULES = ["CC(NC)CC1=CC=C(OCO2)C2=C1", "c1ccccc1"];

var DEFAULT_SETTINGS = {
  oapoc: {
    url: "http://vps955.directvps.nl/OAPoC/",
    version: "0.1.3"
  },

  zoom: {
    factor: 1.1,
    min: 40,
    max: 300,
    min_bond_length: 50,
    ideal_bond_length: 70,
    max_bond_length: 150
  },

  deoverlap: {
    deoverlap: true,
    deoverlap_atoms: true,
    deoverlap_bonds: false,
    decross_bonds: false,
    lengthen_bonds: false,
    time_limit: .5
  },

  cursor: {
    normal: "default",
    drag: "move",
    click: "pointer"
  },

  popup: {
    border_width: 40,
    border_color: "rgba(0, 0, 0, 0.8)",
    padding: 10,
    font: "40px Arial",
    color: "rgb( 48, 48, 48)",
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
    show_h_atoms: false,
    show_c_labels: true,
    show_id: false,
    font: "bold 12px Arial",
    charge_font: "9px Arial",
    colors: {
      S: "rgb(204, 166,  40)",
      O: "rgb(223,  83,  73)",
      N: "rgb( 76,  81, 178)",
      H: "rgb(148, 148, 148)",
      F: "rgb( 80, 169,  75)",
      Cl: "rgb( 80, 169,  75)",
      Br: "rgb( 80, 169,  75)",
      I: "rgb( 80, 169,  75)",
      other: "rgb( 48, 48, 48)"
    },
    charge_color: "rgb( 48, 48, 48)",
    radius: 20,
    radius_charged: 20,
    charge_offset: 6,
    border_widths: {
      0: 1,
      1: 3,
      2: 3,
      4: 3
    },
    border_color: "rgb( 48, 48, 48)",
    bg_colors: {
      0: "rgb(255, 255, 255)",
      1: "rgb( 80, 169,  75)",
      2: "rgb(204, 166,  40)",
      4: "rgb(203,  83,  73)"
    }
  },

  bond: {
    width: 1,
    color: "rgb( 48, 48, 48)",
    connector_width: 3,
    connector_color: "rgb( 48, 48, 48)",
    spacing: 4,
    dash_count: 5,
    id: {
      show: false,
      radius: 8,
      bg_color: "rgb(205, 205, 205)",
      font: "9px Arial",
      color: "rgb( 48, 48, 48)"
    }
  },

  selection: {
    color: "rgba(44, 10, 205, .3)",
    border_width: 1,
    border_color: "rgba(44, 10, 205, .5)"
  }
};

var SETTINGS_OPTIONS = {
  oapoc: {
    hidden: true
  },

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
    },
    time_limit: {
      min: .1,
      max: 10,
      step: .1
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
        if(mv.molecule) {
          mv.molecule.atoms.each(function(a) {
            a.clearCache('appearance.visible');
          });
          mv.molecule.bonds.each(function(b) {
            b.clearCache('appearance.visible');
          });
          mv.redraw();
        }
      }
    },
    show_c_labels: {
      onChange: function() {
        if(mv.molecule) {
          mv.molecule.atoms.each(function(a) {
            a.clearCache('appearance.show_label');
          });
          mv.molecule.bonds.each(function(b) {
            b.clearCache('position.coords');
          });
          mv.redraw();
        }
      }
    },
    "show_circ, show_id, font, charge_font, charge_color, charge_offset, border_color": {
      onChange: function() {
        mv.redraw();
      }
    },
    "radius, radius_charged": {
      onChange: function() {
        if(mv.molecule) {
          mv.molecule.atoms.each(function(a) {
            a.clearCache('appearance.radius');
          });
          mv.molecule.bonds.each(function(b) {
            b.clearCache('position');
          });
          mv.redraw();
        }
      },
      onFinishChange: function() {
        mv.deoverlap();
      }
    },
    colors: {
      "S, O, N, H, F, Cl, Br, I, other": {
        onChange: function() {
          if(mv.molecule) {
            mv.molecule.atoms.each(function(a) {
              a.clearCache('appearance.color');
            });
            mv.redraw();
          }
        }
      }
    },
    border_widths: {
      "0, 1, 2, 4": {
        min: 0,
        max: 10,
        step: 1,
        onChange: function() {
          mv.redraw();
        }
      }
    },
    bg_colors: {
      "0, 1, 2, 4": {
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
    connector_width: {
      onChange: function() {
        if(mv.molecule) {
          mv.molecule.bonds.each(function(b) {
            b.clearCache('appearance.connectors');
          });
          mv.redraw();
        }
      }
    },
    spacing: {
      onChange: function() {
        if(mv.molecule) {
          mv.molecule.bonds.each(function(b) {
            b.clearCache('appearance.lines');
            b.clearCache('appearance.connectors');
          });
          mv.redraw();
        }
      }
    },
    dash_count: {
      min: 1,
      max: 20,
      step: 1,
      onChange: function() {
        if(mv.molecule) {
          mv.molecule.bonds.each(function(b) {
            b.clearCache('appearance.lines');
          });
          mv.redraw();
        }
      }
    },
    "width, color, connector_color": {
      onChange: function() {
        mv.redraw();
      }
    },
    id: {
      radius: {
        min: 0,
        max: 30,
        step: 1
      },
      "show, radius, bg_color, font, color": {
        onChange: function() {
          mv.redraw();
        }
      }
    }
  }
};


/*
 * Nice colors: Gray: rgb(148, 148, 148) Green: rgb( 80, 169, 75) Blue: rgb( 76,
 * 81, 178) Red: rgb(203, 83, 73) Yellow: rgb(204, 166, 40) Brown: rgb(127, 79,
 * 66) Purple: rgb(227, 119, 219)
 */
