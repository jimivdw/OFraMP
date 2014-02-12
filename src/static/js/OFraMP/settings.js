var MESSAGE_TYPES = {
  info: 1,
  warning: 2,
  error: 3,
  critical: 4,
  debug: 5
};

var ATOM_STATUSES = {
  normal: 0,
  hover: 1,
  selected: 2,
  preview: 4,
  conflict: 8
};

var PREDEFINED_MOLECULES = ["CC(NC)CC1=CC=C(OCO2)C2=C1", "c1ccccc1"];

var DEFAULT_SETTINGS = {
  oapoc: {
    url: "http://vps955.directvps.nl/OAPoC/generate/",
    loadUrl: "http://vps955.directvps.nl/OAPoC/loadATB/",
    version: "0.5.0"
  },

  omfraf: {
    url: "http://vps955.directvps.nl/OMFraF/load/",
    generateUrl: "http://vps955.directvps.nl/OMFraF/generate/",
    version: "0.4.1"
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
    borderWidth: 10,
    borderColor: "rgba(0, 0, 0, 0.8)",
    padding: 10,
    font: "13px Arial",
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
    showHAtoms: false,
    combineHLabels: true,
    showCLabels: true,
    showCirc: true,
    showID: false,
    radius: {
      default: 20,
      charged: 20
    },
    backgroundColor: {
      default: "rgb(255, 255, 255)",
      charged: "rgb(180, 180, 180)",
      hover: "rgb(210, 180, 245)",
      selected: "rgb(150, 140, 205)",
      preview: "rgb(140, 205, 108)",
      conflict: "rgb(204, 166,  40)"
    },
    borderWidth: {
      default: 1,
      active: 3
    },
    borderColor: {
      default: "rgb( 48, 48, 48)",
      active: "rgb( 48, 48, 48)"
    },
    color: {
      default: "rgb( 48, 48, 48)",
      charged: "rgb( 48, 48, 48)"
    },
    elementFont: "bold 12px Arial",
    chargeFont: "9px Arial",
    chargeOffset: 6
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
  "oapoc, omfraf": {
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
    "showCirc, showID, elementFont, chargeFont, chargeOffset": {
      onChange: function() {
        this.__gui.getRootObject().getMV().redraw();
      }
    },
    radius: {
      "default, charged": {
        min: 0,
        max: 50,
        step: 1,
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
      }
    },
    backgroundColor: {
      "default, charged, hover, selected, preview, conflict": {
        onChange: function() {
          this.__gui.getRootObject().getMV().redraw();
        }
      }
    },
    borderWidth: {
      "default, active": {
        min: 0,
        max: 10,
        step: 1,
        onChange: function() {
          this.__gui.getRootObject().getMV().redraw();
        }
      }
    },
    borderColor: {
      "default, active": {
        onChange: function() {
          this.__gui.getRootObject().getMV().redraw();
        }
      }
    },
    color: {
      "default, charged": {
        onChange: function() {
          this.__gui.getRootObject().getMV().redraw();
        }
      }
    },
    chargeOffset: {
      min: 0,
      max: 50,
      step: 1
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
