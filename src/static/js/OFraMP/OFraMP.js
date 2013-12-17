function OFraMP(container_id, settings) {
  this.init(container_id, settings);
}

OFraMP.prototype = {
  container: undefined,
  settings: undefined,
  mv: undefined,
  settings_ui: undefined,

  init: function(container_id, settings) {
    this.container = document.getElementById(container_id);
    this.settings = $ext.merge($ext.copy(DEFAULT_SETTINGS), settings);
    this.__initUI();
  },

  __initUI: function() {
    var lb = document.createElement('div');
    lb.id = "leftbar";
    lb.className = "border_box";
    lb.style.visibility = "hidden";
    this.__initAtomDetails(lb);

    var rb = document.createElement('div');
    rb.id = "rightbar";
    rb.className = "border_box";
    rb.style.visibility = "hidden";
    this.__initRelatedFragments(rb);

    var popup = document.createElement('div');
    popup.id = "popup";
    popup.className = "border_box";
    popup.style.visibility = "hidden";
    this.__initPopup(popup);

    var cc = document.createElement('div');
    cc.id = "canvas_container";
    this.__initMainViewer(cc);

    this.container.appendChild(lb);
    this.container.appendChild(rb);
    this.container.appendChild(popup);
    this.container.appendChild(cc);

    if(!$ext.onBrokenIE()) {
      this.__initSettingsUI();
    }
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
    var title = document.createElement('div');
    title.id = "popup_title";

    var content = document.createElement('div');
    content.id = "popup_content";

    container.appendChild(title);
    container.appendChild(document.createElement('hr'));
    container.appendChild(content);
  },

  __initMainViewer: function(container) {
    this.mv = new MoleculeViewer(this, "main_molecule", "canvas_container");
  },

  __initSettingsUI: function() {
    this.settings_ui = new dat.GUI({
      name: 'OFraMP Settings',
      savable: true
    });
    this.settings_ui.addAll(this.settings, this.settings, $ext.object
        .extrapolate(SETTINGS_OPTIONS));
  }
};
