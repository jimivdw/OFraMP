function OFraMP(container_id, settings) {
  this.init(container_id, settings);
}

OFraMP.prototype = {
  container: undefined,
  settings: undefined,
  mv: undefined,
  settings_ui: undefined,

  popup: undefined,
  popup_title: undefined,
  popup_content: undefined,

  enter_molecule_button: undefined,
  find_fragments_button: undefined,

  ui_initialized_event: new Event('ui_initialized'),
  molecule_entered_event: new Event('molecule_entered'),

  init: function(container_id, settings) {
    this.container = document.getElementById(container_id);
    this.settings = $ext.merge($ext.copy(DEFAULT_SETTINGS), settings);
    this.__initUI();
    this.showInsertMoleculePopup();
  },

  __initUI: function() {
    var lb = document.createElement('div');
    lb.id = "leftbar";
    lb.className = "border_box";
    lb.style.visibility = "hidden";
    this.container.appendChild(lb);
    this.__initAtomDetails(lb);

    var rb = document.createElement('div');
    rb.id = "rightbar";
    rb.className = "border_box";
    rb.style.visibility = "hidden";
    this.container.appendChild(rb);
    this.__initRelatedFragments(rb);

    this.popup = document.createElement('div');
    this.popup.id = "popup";
    this.popup.className = "border_box";
    this.popup.style.visibility = "hidden";
    this.container.appendChild(this.popup);
    this.__initPopup(this.popup);

    var emb = document.createElement('button');
    emb.id = "enter_molecule";
    emb.className = "border_box";
    emb.style.visibility = "hidden";
    this.container.appendChild(emb);
    this.__initEMB(emb);
    this.enter_molecule_button = emb;

    var ffb = document.createElement('button');
    ffb.id = "find_fragments";
    ffb.className = "border_box";
    ffb.style.visibility = "hidden";
    this.container.appendChild(ffb);
    this.__initFFB(ffb);
    this.find_fragments_button = ffb;

    var cc = document.createElement('div');
    cc.id = "canvas_container";
    this.container.appendChild(cc);
    this.__initMainViewer(cc);

    if(!$ext.onBrokenIE()) {
      this.__initSettingsUI();
    }

    this.container.dispatchEvent(this.ui_initialized_event);
  },

  __initAtomDetails: function(container) {
    var ad = document.createElement('div');
    ad.id = "atom_details";
    ad.appendChild(document.createTextNode("Atom details... Coming soon!"));
    container.appendChild(ad);
  },

  __initRelatedFragments: function(container) {
    var rf = document.createElement('div');
    rf.id = "related_fragments";
    rf.appendChild(document.createTextNode("Related frags... Coming soon!"));
    container.appendChild(rf);
  },

  __initPopup: function(container) {
    this.popup_title = document.createElement('div');
    this.popup_title.id = "popup_title";

    this.popup_content = document.createElement('div');
    this.popup_content.id = "popup_content";

    container.appendChild(this.popup_title);
    container.appendChild(document.createElement('hr'));
    container.appendChild(this.popup_content);
  },

  __initEMB: function(elem) {
    elem.appendChild(document.createTextNode("Submit a new molecule"));
    var _this = this;
    $ext.dom.onMouseClick(elem, function() {
      _this.showInsertMoleculePopup();
    });
  },

  __initFFB: function(elem) {
    elem.appendChild(document.createTextNode("Find matching fragments"));
    elem.disabled = "disabled";
    var _this = this;
    $ext.dom.onMouseClick(elem, function() {
      _this.mv.getMatchingFragments();
    });
  },

  __initMainViewer: function(container) {
    this.mv = new MoleculeViewer(this, "main_molecule", "canvas_container");
  },

  __initSettingsUI: function() {
    this.settings_ui = new dat.GUI({
      name: 'OFraMP Settings',
      savable: true
    });

    var _this = this;
    var settings_obj = $ext.extend($ext.copy(this.settings), {
      getMV: function() {
        return _this.mv;
      }
    });
    this.settings_ui.addAll(settings_obj, this.settings, $ext.object
        .extrapolate(SETTINGS_OPTIONS));
  },

  __initMP: function() {
    this.enter_molecule_button.style.visibility = "visible";
    this.find_fragments_button.style.visibility = "visible";
  },

  showPopup: function(title, content) {
    $ext.dom.clear(this.popup_title);
    $ext.dom.clear(this.popup_content);
    this.popup_title.appendChild(document.createTextNode(title));
    this.popup_content.appendChild(content);
    this.popup.style.visibility = 'visible';
  },

  hidePopup: function() {
    this.popup.style.visibility = "hidden";
  },

  showInsertMoleculePopup: function() {
    var _this = this;

    var title = "Please enter a molecule data string";

    var content = document.createElement('div');

    var ta = document.createElement('textarea');
    ta.placeholder = "Insert SMILES / InChI string here";
    content.appendChild(ta);

    var cbs = document.createElement('div');
    cbs.className = 'controls';
    content.appendChild(cbs);

    var sb = document.createElement('button');
    sb.appendChild(document.createTextNode("Submit"));
    sb.onclick = function() {
      _this.mv.showMolecule(ta.value);
      if(!_this.mv.molecule) {
        _this.mv.init_interaction();
        _this.__initMP();
      }
      _this.container.dispatchEvent(_this.molecule_entered_event);
      _this.hidePopup();
    }
    cbs.appendChild(sb);

    var rb = document.createElement('button');
    rb.appendChild(document.createTextNode("Random molecule"));
    rb.onclick = function() {
      ta.value = $ext.array.randomElement(PREDEFINED_MOLECULES);
    }
    cbs.appendChild(rb);

    var cb = document.createElement('button');
    cb.style.float = 'right';
    cb.appendChild(document.createTextNode("Cancel"));
    cb.onclick = function() {
      if(!_this.mv.molecule) {
        _this.mv.showMolecule($ext.array.randomElement(PREDEFINED_MOLECULES));
        _this.mv.init_interaction();
        _this.__initMP();
        _this.container.dispatchEvent(_this.molecule_entered_event);
      }
      _this.hidePopup();
    }
    cbs.appendChild(cb);

    this.showPopup(title, content);
  }
};
