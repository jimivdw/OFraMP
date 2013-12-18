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
    version: "0.1.4"
  },

  zoom: {
    factor: 1.1,
    min: 40,
    max: 300,
    minBondLength: 50,
    idealBondLength: 70,
    maxBondLength: 150
  },

  deoverlap: {
    deoverlap: true,
    deoverlapAtoms: true,
    deoverlapBonds: false,
    decrossBonds: false,
    lengthenBonds: false,
    timeLimit: .5
  },

  cursor: {
    normal: "default",
    drag: "move",
    click: "pointer"
  },

  popup: {
    borderWidth: 40,
    borderColor: "rgba(0, 0, 0, 0.8)",
    padding: 10,
    font: "40px Arial",
    color: "rgb( 48, 48, 48)",
    bgColors: {
      1: "rgba(255, 255, 255, 0.9)",
      2: "rgba(253, 198, 137, 0.9)",
      3: "rgba(246, 150, 121, 0.9)",
      4: "rgba(189, 140, 191, 0.9)",
      5: "rgba(131, 147, 202, 0.9)"
    }
  },

  atom: {
    showCirc: true,
    showHAtoms: false,
    combineHLabels: true,
    showCLabels: true,
    showID: false,
    font: "bold 12px Arial",
    chargeFont: "9px Arial",
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
    chargeColor: "rgb( 48, 48, 48)",
    radius: 20,
    radiusCharged: 20,
    chargeOffset: 6,
    borderWidths: {
      0: 1,
      1: 3,
      2: 3,
      4: 3
    },
    borderColor: "rgb( 48, 48, 48)",
    bgColors: {
      0: "rgb(255, 255, 255)",
      1: "rgb( 80, 169,  75)",
      2: "rgb(204, 166,  40)",
      4: "rgb(203,  83,  73)"
    }
  },

  bond: {
    width: 1,
    color: "rgb( 48, 48, 48)",
    connectorWidth: 3,
    connectorColor: "rgb( 48, 48, 48)",
    spacing: 4,
    dashCount: 5,
    id: {
      show: false,
      radius: 8,
      bgColor: "rgb(205, 205, 205)",
      font: "9px Arial",
      color: "rgb( 48, 48, 48)"
    }
  },

  selection: {
    color: "rgba(44, 10, 205, .3)",
    borderWidth: 1,
    borderColor: "rgba(44, 10, 205, .5)"
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
    "min, max, minBondLength, idealBondLength, maxBondLength": {
      min: 0,
      max: 500,
      step: 1
    }
  },

  deoverlap: {
    "deoverlap, deoverlapAtoms, deoverlapBonds, decrossBonds, lengthenBonds": {
      onChange: function(v) {
        if(v) {
          this.__gui.getRootObject().getMV().deoverlap();
        }
      }
    },
    timeLimit: {
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
    "borderWidth, padding": {
      min: 0,
      max: 100,
      step: 1
    },
    "borderWidth, borderColor, padding, font, color": {
      onChange: function() {
        this.__gui.getRootObject().getMV().redraw();
      }
    },
    bgColors: {
      "1, 2, 3, 4, 5": {
        onChange: function() {
          this.__gui.getRootObject().getMV().redraw();
        }
      }
    }
  },

  atom: {
    "radius, radiusCharged, chargeOffset": {
      min: 0,
      max: 50,
      step: 1
    },
    showHAtoms: {
      onChange: function() {
        var mv = this.__gui.getRootObject().getMV();
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
    combineHLabels: {
      onChange: function() {
        var mv = this.__gui.getRootObject().getMV();
        if(mv.molecule) {
          mv.molecule.atoms.each(function(a) {
            a.clearCache('appearance.label');
          });
          mv.redraw();
        }
      }
    },
    showCLabels: {
      onChange: function() {
        var mv = this.__gui.getRootObject().getMV();
        if(mv.molecule) {
          mv.molecule.atoms.each(function(a) {
            a.clearCache('appearance.showLabel');
          });
          mv.molecule.bonds.each(function(b) {
            b.clearCache('position.coords');
          });
          mv.redraw();
        }
      }
    },
    "showCirc, showID, font, chargeFont, chargeColor, chargeOffset, borderColor": {
      onChange: function() {
        this.__gui.getRootObject().getMV().redraw();
      }
    },
    "radius, radiusCharged": {
      onChange: function() {
        var mv = this.__gui.getRootObject().getMV();
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
        this.__gui.getRootObject().getMV().deoverlap();
      }
    },
    colors: {
      "S, O, N, H, F, Cl, Br, I, other": {
        onChange: function() {
          var mv = this.__gui.getRootObject().getMV();
          if(mv.molecule) {
            mv.molecule.atoms.each(function(a) {
              a.clearCache('appearance.color');
            });
            mv.redraw();
          }
        }
      }
    },
    borderWidths: {
      "0, 1, 2, 4": {
        min: 0,
        max: 10,
        step: 1,
        onChange: function() {
          this.__gui.getRootObject().getMV().redraw();
        }
      }
    },
    bgColors: {
      "0, 1, 2, 4": {
        onChange: function() {
          this.__gui.getRootObject().getMV().redraw();
        }
      }
    }
  },

  bond: {
    "width, connectorWidth, spacing": {
      min: 0,
      max: 10,
      step: 1
    },
    connectorWidth: {
      onChange: function() {
        var mv = this.__gui.getRootObject().getMV();
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
        var mv = this.__gui.getRootObject().getMV();
        if(mv.molecule) {
          mv.molecule.bonds.each(function(b) {
            b.clearCache('appearance.lines');
            b.clearCache('appearance.connectors');
          });
          mv.redraw();
        }
      }
    },
    dashCount: {
      min: 1,
      max: 20,
      step: 1,
      onChange: function() {
        var mv = this.__gui.getRootObject().getMV();
        if(mv.molecule) {
          mv.molecule.bonds.each(function(b) {
            b.clearCache('appearance.lines');
          });
          mv.redraw();
        }
      }
    },
    "width, color, connectorColor": {
      onChange: function() {
        this.__gui.getRootObject().getMV().redraw();
      }
    },
    id: {
      radius: {
        min: 0,
        max: 30,
        step: 1
      },
      "show, radius, bgColor, font, color": {
        onChange: function() {
          this.__gui.getRootObject().getMV().redraw();
        }
      }
    }
  }
};
