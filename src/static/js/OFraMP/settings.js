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
  zoom_factor: 1.1,

  oapoc_url: "http://vps955.directvps.nl/OAPoC/",
  oapoc_version: "0.1.3",

  min_zoom: 40,
  max_zoom: 300,
  min_bond_length: 15,
  ideal_bond_length: 70,
  max_bond_length: 150,

  deoverlap: true,
  deoverlap_atoms: true,
  deoverlap_bonds: true,
  decross_bonds: true,
  lengthen_bonds: false,

  canvas_padding: 40,
  canvas_cursor_normal: "default",
  canvas_cursor_drag: "move",
  canvas_cursor_click: "pointer",

  message_border_width: 40,
  message_border_color: "rgba(0, 0, 0, .8)",
  message_padding: 10,
  message_font: "40px Arial",
  message_color: "rgb(0, 0, 0)",
  message_bg_colors: {
    1: "rgba(255, 255, 255, .5)",
    2: "rgba(253, 198, 137, .5)",
    3: "rgba(246, 150, 121, .5)",
    4: "rgba(189, 140, 191, .5)",
    5: "rgba(131, 147, 202, .5)"
  },

  draw_atom_circ: true,
  draw_h_atoms: true,
  draw_atom_id: false,
  atom_font: "bold 12px Arial",
  atom_charge_font: "9px Arial",
  atom_colors: {
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
  atom_charge_color: "rgb(0, 0, 0)",
  atom_radius: 10,
  atom_radius_charged: 20,
  atom_charge_offset: 6,
  atom_border_widths: {
    1: 1,
    2: 3,
    3: 3
  },
  atom_border_color: "rgb(0, 0, 0)",
  atom_bg_colors: {
    1: "rgb(255, 255, 255)",
    2: "rgb(204, 166,  40)",
    3: "rgb(203,  83,  73)"
  },

  draw_bond_id: false,
  bond_width: 1,
  bond_color: "rgb(0, 0, 0)",
  bond_connector_width: 3,
  bond_connector_color: "rgb(0, 0, 0)",
  bond_spacing: 4,
  bond_dash_count: 5
};

/*
 * Nice colors: Gray: rgb(148, 148, 148) Green: rgb( 80, 169, 75) Blue: rgb( 76,
 * 81, 178) Red: rgb(203, 83, 73) Yellow: rgb(204, 166, 40) Brown: rgb(127, 79,
 * 66) Purple: rgb(227, 119, 219)
 */
