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

  // TODO: get rid of this!
  canvas_padding: 40,

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
    border_color: "rgba(0, 0, 0, .8)",
    padding: 10,
    font: "40px Arial",
    color: "rgb(0, 0, 0)",
    bg_colors: {
      1: "rgba(255, 255, 255, .5)",
      2: "rgba(253, 198, 137, .5)",
      3: "rgba(246, 150, 121, .5)",
      4: "rgba(189, 140, 191, .5)",
      5: "rgba(131, 147, 202, .5)"
    },
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

/*
 * Nice colors: Gray: rgb(148, 148, 148) Green: rgb( 80, 169, 75) Blue: rgb( 76,
 * 81, 178) Red: rgb(203, 83, 73) Yellow: rgb(204, 166, 40) Brown: rgb(127, 79,
 * 66) Purple: rgb(227, 119, 219)
 */
