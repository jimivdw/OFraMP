function OFraMP(behavior, containerID, settings) {
  this.__init(behavior, containerID, settings);
}

OFraMP.prototype = {
  behavior: undefined,
  container: undefined,
  settings: undefined,
  mv: undefined,
  settingsUI: undefined,
  repos: undefined,
  off: undefined,
  off_missing: undefined,
  finished: false,

  atomDetails: undefined,
  relatedFragments: undefined,
  errorControls: undefined,

  popup: undefined,
  popupClose: undefined,
  popupTitle: undefined,
  popupContent: undefined,

  findFragmentsButton: undefined,

  checkpoints: undefined,
  activeCheckpoint: undefined,

  uiInitializedEvent: 'uiinitialized',
  moleculeEnteredEvent: 'moleculeentered',
  moleculeDisplayedEvent: 'moleculedisplayed',
  fragmentsGeneratedEvent: 'fragmentsgenerated',
  fragmentsFoundEvent: 'fragmentsfound',
  selectionChangedEvent: 'selectionchanged',
  historyChangedEvent: 'historychanged',
  parameterizationFinishedEvent: 'parameterizationfinished',

  __init: function(behavior, containerID, settings) {
    settings = $ext.merge($ext.copy(DEFAULT_SETTINGS), settings);
    settings.fragment = $ext.deepCopy(settings);
    // Ugly way to achieve this, but cannot do it otherwise currently.
    settings.fragment.atom.backgroundColor.charged = settings.fragment.atom.backgroundColor.standard;
    settings.fragment.atom.backgroundColor.unparameterizable = "rgb(76, 132,  70)";
    SETTINGS_OPTIONS.fragment = $ext.deepCopy(SETTINGS_OPTIONS);
    this.settings = settings;

    this.container = document.getElementById(containerID);
    this.behavior = new behavior(this);
    this.__initUI();

    if(!this.isValidBrowser(PARTIALLY_SUPPORTED_BROWSERS)) {
      return this.showErrorPopup();
    }

    this.getRepositories(function(repos) {
      console.log("Got repositories", repos);
      this.repos = repos;
      var rs = document.getElementById("repository");
      if(rs) {
        $ext.dom.clear(rs);
        $ext.each(repos, function(repo) {
          $ext.dom.addSelectOption(rs, repo);
        });
        rs.disabled = "";
        var sb = document.getElementById("mds_submit");
        sb.disabled = "";
        sb.title = "";
      }
    }, function(msg) {
      alert("Could not connect to OMFraF, fragment finding is not possible:\n"
          + msg);
      this.repos = [];
      var sb = document.getElementById("mds_submit");
      sb.disabled = "";
      sb.title = "Submit only for visualisation";
    });

    if($ext.cookie.get("hideWelcome")) {
      this.showInsertMoleculePopup();
    } else {
      this.showWelcomePopup();
    }
  },

  __initUI: function() {
    var lb = document.createElement('div');
    lb.id = "leftbar";
    lb.className = "sidebar border_box";
    lb.style.visibility = "hidden";
    this.container.appendChild(lb);
    this.__initAtomDetails(lb);

    var rb = document.createElement('div');
    rb.id = "rightbar";
    rb.className = "sidebar border_box";
    rb.style.visibility = "hidden";
    this.container.appendChild(rb);
    this.__initRelatedFragments(rb);

    this.popup = document.createElement('div');
    this.popup.id = "popup";
    this.popup.className = "border_box";
    this.popup.style.visibility = "hidden";
    this.container.appendChild(this.popup);
    this.__initPopup(this.popup);

    var ffb = document.getElementById("find_fragments");
    $ext.dom.clear(ffb);
    this.__initFFB(ffb);
    this.findFragmentsButton = ffb;

    var ecd = document.createElement('div');
    ecd.id = "error_controls";
    this.__initECD(ecd);
    this.container.appendChild(ecd);
    this.errorControls = ecd;

    var cc = document.createElement('div');
    cc.id = "canvas_container";
    this.container.appendChild(cc);
    this.__initMainViewer(cc);

    if(!$ext.onBrokenIE()) {
      this.__initSettingsUI();
    }

    $ext.dom.dispatchEvent(this.container, this.uiInitializedEvent);
  },

  __initAtomDetails: function(container) {
    var ad = document.createElement('div');
    ad.id = "atom_details";
    container.appendChild(ad);
    this.atomDetails = ad;
  },

  __initRelatedFragments: function(container) {
    var rf = document.createElement('div');
    rf.id = "related_fragments";
    container.appendChild(rf);
    this.relatedFragments = rf;
  },

  __initPopup: function(container) {
    var _this = this;
    this.popupClose = document.createElement('div');
    this.popupClose.className = "close";
    $ext.dom.onMouseClick(this.popupClose, function() {
      _this.hidePopup();
    }, $ext.mouse.LEFT);

    this.popupTitle = document.createElement('div');
    this.popupTitle.id = "popup_title";

    this.popupContent = document.createElement('div');
    this.popupContent.id = "popup_content";

    $ext.dom.onMouseDrag(this.popupTitle, function(e) {
      var s = getComputedStyle(container);
      var left = (popup.offsetLeft - parseInt(s.marginLeft) + e.deltaX) + "px";
      var top = (parseInt(s.top) + e.deltaY) + "px";
      var bottom = (parseInt(s.bottom) - e.deltaY) + "px";
      container.style.left = left;
      container.style.top = top;
      container.style.bottom = bottom;
    }, $ext.mouse.LEFT);

    container.appendChild(this.popupClose);
    container.appendChild(this.popupTitle);
    container.appendChild(document.createElement('hr'));
    container.appendChild(this.popupContent);
  },

  __initFFB: function(elem) {
    var _this = this;
    elem.disabled = "disabled";
    if(this.off) {
      elem.appendChild(document.createTextNode("Find fragments"));
      $ext.dom.onMouseClick(elem, function() {
        // Make sure the previewed charges are reset.
        _this.mv.previewCharges({});
        _this.getMatchingFragments();
      }, $ext.mouse.LEFT);
    } else {
      elem.appendChild(document.createTextNode("Loading fragments..."));
    }
  },

  __initECD: function(elem) {
    var _this = this;

    var rnb = document.createElement('button');
    rnb.id = "retry_new";
    rnb.className = "border_box";
    $ext.dom.addText(rnb, "Enter a new molecule");
    elem.appendChild(rnb);

    $ext.dom.onMouseClick(rnb, function() {
      _this.showInsertMoleculePopup();
    }, $ext.mouse.LEFT);
  },

  __initMainViewer: function(container) {
    this.mv = new MoleculeViewer(this, "main_molecule", "canvas_container");
  },

  __initSettingsUI: function() {
    this.settingsUI = new dat.GUI({
      name: 'OFraMP Settings',
      savable: true
    });

    var _this = this;
    var settingsObj = $ext.extend($ext.copy(this.settings), {
      getMV: function() {
        return _this.mv;
      }
    });
    this.settingsUI.addAll(settingsObj, this.settings, $ext.object
        .extrapolate(SETTINGS_OPTIONS));
  },

  isValidBrowser: function(browsers) {
    var names = $ext.array.map(browsers, function(browser) {
      return browser.browser;
    });
    if(names.indexOf(BrowserDetect.browser) === -1) {
      return false;
    }

    var minVersion = $ext.each(browsers, function(browser) {
      if(browser.browser === BrowserDetect.browser) {
        return browser.minVersion;
      }
    });
    return BrowserDetect.version >= minVersion;
  },

  getUnparameterizedAtoms: function(only_parameterizable) {
    var unpar = this.mv.molecule.getUnparameterized();
    if(only_parameterizable) {
      var parunpar = $ext.array.filter(unpar, function(atom) {
        return this.off_missing.indexOf(atom.id) === -1;
      }, this);
      return parunpar;
    } else {
      return unpar;
    }
  },

  showPopup: function(title, content, closable) {
    $ext.dom.clear(this.popupTitle);
    $ext.dom.clear(this.popupContent);
    this.popupTitle.appendChild(document.createTextNode(title));
    this.popupContent.appendChild(content);
    if(closable === true) {
      this.popupClose.style.display = "block";
    }
    this.popup.style.top = "";
    this.popup.style.bottom = "";
    this.popup.style.left = "";
    this.popup.style.visibility = 'visible';
  },

  hidePopup: function() {
    this.popup.style.visibility = "hidden";
    this.popupClose.style.display = "";
  },

  showErrorPopup: function() {
    var title = "Please upgrade your browser";
    var content = document.createElement("p");
    $ext.dom.addText(content, "The Online tool for Fragment-based Molecule "
        + "Parameterisation has been designed and implemented for use in "
        + "modern browsers. You appear to be using a very old browser ("
        + BrowserDetect.browser + ", version " + BrowserDetect.version + ") "
        + "which, unfortunately, is not supported. For best results, please "
        + "upgrade to the latest version of ");
    var cdl = document.createElement('a');
    cdl.href = "http://chrome.google.com/";
    $ext.dom.addText(cdl, "Google Chrome");
    content.appendChild(cdl);
    $ext.dom.addText(content, ". Apologies for any inconvenience.");

    $ext.dom.addClass(this.popup, "error");
    this.showPopup(title, content);
  },

  showWelcomePopup: function() {
    var _this = this;

    var title = "Welcome";

    var content = document.createElement('div');

    var mp = document.createElement('p');
    $ext.dom.addText(mp, "Welcome at OFraMP, the Online tool for Fragment-"
        + "based molecule parameterisation. Using OFraMP, you can assign "
        + "atomic partial charges of a molecule based on fragments of "
        + "other molecules. Once the whole molecule has been parameterised, "
        + "you can download the resulting parameterisation in an LGF file.");
    content.appendChild(mp);

    if(!this.isValidBrowser(FULLY_SUPPORTED_BROWSERS)) {
      var bp = document.createElement("p");
      $ext.dom.addText(bp, "The Online tool for Fragment-based Molecule "
          + "Parameterisation has been designed and implemented for use in "
          + "modern browsers. Your browser (" + BrowserDetect.browser
          + ", version " + BrowserDetect.version + ") is only partially "
          + "supported and is lacking some features. For best results, please "
          + "upgrade to the latest version of ");
      var cdl = document.createElement('a');
      cdl.href = "http://chrome.google.com/";
      $ext.dom.addText(cdl, "Google Chrome");
      bp.appendChild(cdl);
      $ext.dom.addText(bp, ".");

      content.appendChild(bp);
      $ext.dom.addClass(this.popup, "warning");
    }

    var dp = document.createElement('p');
    $ext.dom.addText(dp, "If you are here for the first time, it might be a "
        + "good idea to take the guided demo. This can be started using the "
        + "'Start demo' button below. More help is available by clicking the "
        + "'Help' button below. Otherwise, you can continue to the "
        + "molecule input by clicking the 'New molecule' button.");
    content.appendChild(dp);

    var rd = document.createElement('div');
    rd.style.textAlign = "left";
    rd.style.position = "absolute";
    rd.style.bottom = "40px";
    content.appendChild(rd);

    var ri = document.createElement('input');
    ri.type = "checkbox";
    ri.value = "true";
    ri.checked = "checked";
    ri.id = "remember";
    rd.appendChild(ri);

    var rl = document.createElement('label');
    rl.htmlFor = ri.id;
    $ext.dom.setFloat(rl, "none");
    $ext.dom.addText(rl, "Show this message next time");
    rd.appendChild(rl);

    var cd = document.createElement('div');
    cd.className = "controls";
    content.appendChild(cd);

    function rememberCookie() {
      if(!ri.checked) {
        $ext.cookie.set('hideWelcome', true, 100);
      }
    }

    var nb = document.createElement('button');
    nb.className = "border_box";
    $ext.dom.addText(nb, "New molecule");
    $ext.dom.onMouseClick(nb, function() {
      rememberCookie();
      _this.showInsertMoleculePopup();
    }, $ext.mouse.LEFT);
    cd.appendChild(nb);

    var db = document.createElement('button');
    db.className = "border_box";
    $ext.dom.addText(db, "Start demo");
    $ext.dom.onMouseClick(db, function() {
      rememberCookie();
      _this.behavior.demo.start();
    }, $ext.mouse.LEFT);
    cd.appendChild(db);

    var hb = document.createElement('button');
    hb.className = "border_box";
    $ext.dom.setFloat(hb, "left");
    $ext.dom.addText(hb, "Help");
    $ext.dom.onMouseClick(hb, function() {
      window.open('help.html', '_blank').focus();
    }, $ext.mouse.LEFT);
    cd.appendChild(hb);

    this.showPopup(title, content);
  },

  showInsertMoleculePopup: function() {
    var _this = this;

    $ext.dom.removeClass(this.popup, "warning");

    var title = "Please enter a molecule data string";

    var content = document.createElement('div');

    var ta = document.createElement('textarea');
    ta.id = "mds_input";
    ta.style.height = this.popup.clientHeight - 136 + "px";
    ta.placeholder = "Insert PDB / SMILES / InChI string or ATB ID here";
    content.appendChild(ta);

    var sd = document.createElement('div');
    sd.id = "omfraf_settings";
    content.appendChild(sd);

    var rl = document.createElement('label');
    rl.htmlFor = "repository";
    $ext.dom.addText(rl, "Fragment repository");
    sd.appendChild(rl);

    var rs = document.createElement('select');
    rs.id = "repository";
    rs.className = "border_box";
    if(this.repos) {
      $ext.each(this.repos, function(repo) {
        $ext.dom.addSelectOption(rs, repo);
      });
    } else {
      $ext.dom.addSelectOption(rs, "Loading...");
      rs.disabled = "disabled";
    }
    sd.appendChild(rs);

    var sl = document.createElement('label');
    sl.htmlFor = "shell_size";
    $ext.dom.addText(sl, "Shell size");
    sd.appendChild(sl);

    var ss = document.createElement('select');
    ss.id = "shell_size";
    ss.className = "border_box";
    for( var i = 1; i <= 5; i++) {
      $ext.dom.addSelectOption(ss, i);
    }
    sd.appendChild(ss);

    var hr = document.createElement('hr');
    hr.style.margin = "3px 0";
    content.appendChild(hr);

    var cbs = document.createElement('div');
    cbs.className = 'controls';
    content.appendChild(cbs);

    var sb = document.createElement('button');
    sb.id = "mds_submit";
    sb.className = "border_box";
    if(!this.repos) {
      sb.disabled = "disabled";
      sb.title = "Please wait for the repository list to load";
    }
    sb.appendChild(document.createTextNode("Submit"));
    sb.onclick = function() {
      _this.submitMDS(ta.value);

      var repository = rs.value;
      _this.settings.omfraf.repository = repository;

      var shellSize = parseInt(ss.value);
      _this.settings.omfraf.shellSize = shellSize;
    }
    cbs.appendChild(sb);

    if(BrowserDetect.browser !== "Explorer" || BrowserDetect.version > 9) {
      var ossi = document.createElement("input");
      ossi.type = "file";
      ossi.style.display = "none";
      ossi.accept = ".oss";
      ossi.onchange = function() {
        var oss = ossi.files[0];
        if(!oss.name.match(/.*\.oss$/)) {
          alert("Only OFraMP Structure Storage (.oss) files are allowed.");
          return;
        }

        var reader = new FileReader();
        reader.onload = function(evt) {
          _this.loadOSS(evt.target.result);
        };
        reader.readAsText(oss);
      };
      cbs.appendChild(ossi);

      var lb = document.createElement('button');
      lb.id = "load_oss";
      lb.className = "border_box";
      lb.appendChild(document.createTextNode("Load from OSS file"));
      lb.onclick = function() {
        ossi.click();
      }
      cbs.appendChild(lb);
    }

    var cb = document.createElement('button');
    $ext.dom.setFloat(cb, "left");
    cb.className = "border_box";
    cbs.appendChild(cb);

    if(this.mv.molecule) {
      $ext.dom.addText(cb, "Cancel");
      cb.onclick = function() {
        _this.hidePopup();
      }
    } else {
      $ext.dom.addText(cb, "Start demo");
      cb.onclick = function() {
        _this.behavior.demo.start();
      }
    }

    this.showPopup(title, content, this.mv.molecule !== undefined);
    ta.focus();
  },

  submitMDS: function(mds) {
    var _this = this;
    this.mv.showMolecule(mds, function() {
      _this.checkpoint();
      $ext.dom.dispatchEvent(_this.container, _this.moleculeDisplayedEvent);
      _this.errorControls.style.display = "none";
    }, function(msg) {
      _this.errorControls.style.display = "block";
    });

    if(!this.mv.molecule) {
      this.mv.setupInteraction();
    }
    this.finished = false;
    this.off = undefined;
    this.selectionChanged();
    $ext.dom.dispatchEvent(this.container, this.moleculeEnteredEvent);
    this.hideSelectionDetails();
    this.hideRelatedFragments();
    this.hidePopup();
    this.findFragmentsButton.style.display = "inline-block";
  },

  loadOSS: function(oss) {
    try {
      var data = JSON.parse(atob(oss));
      if(!this.mv.molecule) {
        this.mv.setupInteraction();
      }

      $ext.dom.dispatchEvent(this.container, this.moleculeEnteredEvent);
      this.hideSelectionDetails();
      this.hideRelatedFragments();
      this.mv.loadMolecule(data);
      this.checkpoint();
      $ext.dom.dispatchEvent(this.container, this.moleculeDisplayedEvent);
      this.errorControls.style.display = "none";

      this.hidePopup();
    } catch(err) {
      alert("Unable to parse the OSS file. Please try a different file.");
    }
  },

  showUsedFragments: function(atom) {
    var _this = this;

    var title = "Used molecule fragments";

    var content = document.createElement('div');
    this.showPopup(title, content, true);

    var frags = document.createElement('div');
    frags.id = "used_fragments";
    content.appendChild(frags);

    $ext.each(atom.usedFragments, function(fragment, i) {
      var atoms = $ext.array.map(fragment.atoms, function(atom) {
        var orig = this.mv.molecule.atoms.get(atom.id);
        atom.element = orig.element;
        atom.x = orig.x;
        atom.y = orig.y;
        return atom;
      }, this);

      var aids = $ext.array.map(fragment.atoms, function(atom) {
        return atom.id;
      });
      var abs = this.mv.molecule.bonds.filter(function(bond) {
        return aids.indexOf(bond.a1.id) !== -1
            && aids.indexOf(bond.a2.id) !== -1;
      });
      var bonds = $ext.array.map(abs, function(bond) {
        return bond.getJSON();
      });

      var fc = document.createElement('div');
      fc.id = "ufc_" + i;
      fc.className = 'used_fragment border_box';
      frags.appendChild(fc);

      var ob = document.createElement('button');
      ob.className = "show_original border_box";
      ob.appendChild(document.createTextNode("Show molecule"));
      fc.appendChild(ob);

      var fv = new MoleculeViewer(this, "fragment_" + i, fc.id, 560, 230);
      fv.molecule = new Molecule(fv, atoms, bonds);
      fv.molecule.bestFit();
      fv.molecule.setSelected([fv.molecule.atoms.get(atom.id)]);
      fv.redraw();

      $ext.dom.onMouseClick(ob, function() {
        _this.showOriginal(fragment, function() {
          _this.showUsedFragments(atom);
        });
      }, $ext.mouse.LEFT);
    }, this);

    var cb = document.createElement('button');
    cb.className = 'border_box';
    cb.appendChild(document.createTextNode("Close"));
    content.appendChild(cb);

    $ext.dom.onMouseClick(cb, function() {
      _this.hidePopup();
    }, $ext.mouse.LEFT);
  },

  showSelectionDetails: function() {
    this.atomDetails.parentElement.style.visibility = "visible";
    this.atomDetails.parentElement.style.opacity = "1.0";
  },

  hideSelectionDetails: function() {
    this.atomDetails.parentElement.style.visibility = "hidden";
    this.atomDetails.parentElement.style.opacity = "0.0";
  },

  showRelatedFragments: function() {
    this.relatedFragments.parentElement.style.visibility = "visible";
    this.relatedFragments.parentElement.style.opacity = "1.0";
  },

  hideRelatedFragments: function() {
    this.relatedFragments.parentElement.style.visibility = "hidden";
    this.relatedFragments.parentElement.style.opacity = "0.0";
  },

  /*
   * Get the molecule data from OAPoC and run the success function on success.
   * 
   * If fromATB is true, the molecule will be retrieved from ATB.
   */
  getRepositories: function(success, failure) {
    var _this = this;
    success = success || function() {};
    failure = failure || function() {};

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        if(xhr.status == 200) {
          var rd = JSON.parse(xhr.responseText);
          if(rd.error) {
            var msg = "An error has occured:\n" + rd.error;
            failure.call(_this, msg);
          } else if(rd.repos) {
            success.call(_this, rd.repos);
          }
        } else {
          var msg = "Could not connect to server";
          failure.call(_this, msg);
        }
      }
    };

    xhr.open("POST", this.settings.omfraf.repoUrl, true);
    xhr.send(null);
  },

  /*
   * Instruct OMFraF to generate the molecule fragments.
   */
  generateMoleculeFragments: function(queryJSON) {
    var _this = this;

    function showError(msg) {
      $ext.dom.clear(_this.relatedFragments);
      var ts = document.createElement('span');
      ts.className = "title";
      ts.appendChild(document.createTextNode("An error has occured"));
      _this.relatedFragments.appendChild(ts);

      var ep = document.createElement('p');
      ep.appendChild(document.createTextNode(msg));
      _this.relatedFragments.appendChild(ep);

      var cb = document.createElement("button");
      cb.appendChild(document.createTextNode("Close"));
      $ext.dom.onMouseClick(cb, function() {
        _this.hideRelatedFragments();
      }, $ext.mouse.LEFT);
      _this.relatedFragments.appendChild(cb);

      _this.showRelatedFragments();
    }

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        if(xhr.status == 200) {
          var fd = JSON.parse(xhr.responseText);
          var vc = $ext.string.versionCompare(_this.settings.omfraf.version,
              fd.version);
          if(vc == 1) {
            var msg = "OMFraF version too old." + "\n\nRequired version: "
                + _this.settings.omfraf.version + "\nCurrent version: "
                + fd.version;
            showError(msg);
          } else if(vc == -1) {
            var msg = "OMFraF version too new." + "\n\nRequired version: "
                + _this.settings.omfraf.version + "\nCurrent version: "
                + fd.version;
            showError(msg);
          } else if(fd.error) {
            showError(fd.error);
          } else if(fd.off) {
            console.log("Related fragments generated:", fd.off,
                fd.missing_atoms);

            _this.off = fd.off;
            _this.off_missing = fd.missing_atoms;
            $ext.each(fd.missing_atoms, function(aid) {
              _this.mv.molecule.atoms.get(aid).addHighlight(
                  ATOM_STATUSES.unparameterizable);
            });
            _this.redraw();
            $ext.dom.dispatchEvent(_this.container,
                _this.fragmentsGeneratedEvent);
          }
        } else {
          var msg = "Could not connect to the OMFraF server.";
          showError(msg);
        }
      }
    };

    var data = "data=" + encodeURIComponent(queryJSON);
    var repo = this.settings.omfraf.repository;
    if(repo && repo !== DEFAULT_REPO) {
      data += "&repo=" + repo;
    }
    var shell = this.settings.omfraf.shellSize;
    if(shell && shell !== DEFAULT_SHELL) {
      data += "&shell=" + shell;
    }

    xhr.open("POST", this.settings.omfraf.generateUrl, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);
  },

  /*
   * Get the matching fragments with the selection of the molecule.
   */
  getMatchingFragments: function(selection) {
    var _this = this;

    var selection = selection || this.mv.molecule.getSelected();
    if(selection.length === 0) {
      alert("No atoms have been selected.");
      return false;
    }

    var selectionIDs = $ext.array.map(selection, function(atom) {
      return atom.id;
    });
    var tree = this.mv.molecule.atoms.getTree(selection[0]);
    var selectionTree = tree.filter(function(node) {
      return selectionIDs.indexOf(node.key) !== -1;
    });

    var connected = $ext.each(selection, function(atom) {
      var f = selectionTree.findNode(atom.id);
      if(!f) {
        return false;
      }
    });

    if(connected === false) {
      alert("The atoms in the selection are not connected.");
      return false;
    }

    var queryJSON = JSON.stringify({
      off: this.off,
      needle: selectionIDs
    });

    $ext.dom.clear(this.relatedFragments);
    var ts = document.createElement('span');
    ts.className = "title";
    ts.appendChild(document.createTextNode("Looking for fragments"));
    this.relatedFragments.appendChild(ts);

    var ep = document.createElement('p');
    var exp = "Please stand by as the fragments are being loaded.";
    ep.appendChild(document.createTextNode(exp));
    this.relatedFragments.appendChild(ep);
    this.showRelatedFragments();

    function showError(msg) {
      $ext.dom.clear(ts);
      $ext.dom.clear(ep);
      ts.appendChild(document.createTextNode("An error has occured"));
      ep.appendChild(document.createTextNode(msg));

      var cb = document.createElement("button");
      cb.appendChild(document.createTextNode("Close"));
      $ext.dom.onMouseClick(cb, function() {
        _this.hideRelatedFragments();
      }, $ext.mouse.LEFT);
      _this.relatedFragments.appendChild(cb);
    }

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        if(xhr.status == 200) {
          var fd = JSON.parse(xhr.responseText);
          var vc = $ext.string.versionCompare(_this.settings.omfraf.version,
              fd.version);
          if(vc == 1) {
            var msg = "OMFraF version too old." + "\n\nRequired version: "
                + _this.settings.omfraf.version + "\nCurrent version: "
                + fd.version;
            showError(msg);
          } else if(vc == -1) {
            var msg = "OMFraF version too new." + "\n\nRequired version: "
                + _this.settings.omfraf.version + "\nCurrent version: "
                + fd.version;
            showError(msg);
          } else if(fd.error) {
            showError(fd.error);
          } else if(fd.fragments) {
            $ext.each(fd.fragments, function(fragment) {
              var overlapCount = 0;
              $ext.each(fragment.atoms, function(atom) {
                var orig = this.mv.molecule.atoms.get(atom.id);
                if(orig.isCharged() && orig.element !== "H") {
                  overlapCount += 1;
                }
              }, this);

              if(overlapCount > 0) {
                fragment.hasOverlap = true;
                fragment.score -= overlapCount + 1;
              }
            }, _this);

            fragments = fd.fragments.sort(function(a, b) {
              return b.score - a.score || b.atoms.length - a.atoms.length;
            });
            _this.hideRelatedFragments();
            _this.behavior.showRelatedFragments(fragments, selectionIDs);
            $ext.dom.dispatchEvent(_this.container, _this.fragmentsFoundEvent);
          }
        } else {
          var msg = "Could not connect to the OMFraF server.";
          showError(msg);
        }
      }
    };

    xhr.open("POST", this.settings.omfraf.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("data=" + encodeURIComponent(queryJSON));
  },

  getMoleculeCutout: function(x, y, sw, sh, width, height) {
    if($ext.onBrokenIE()) {
      var e = document.createElement('span');
      e.className = "error";
      $ext.dom.addText(e,
          "Please update your browser to see a section of the molecule here");
      return e;
    }

    // Redraw first to make sure no pending changes are ignored
    this.redraw();

    var c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    var ctx = $ext.context.getContext(c, '2d');

    // Increase selection size when the ratio is off
    var r = sw / sh;
    if(r > width / height) {
      sh *= r * c.height / c.width;
    } else {
      sw *= (1 / r) * c.width / c.height;
    }

    var dx = Math.max(width, sw) / 2;
    var dy = Math.max(height, sh) / 2;
    var wf = width / (2 * dx);
    var hf = height / (2 * dy);
    var f = wf < hf ? wf : hf;

    var id = this.mv.ctx.getImageData(x - dx, y - dy, 2 * dx, 2 * dy);

    var tc = document.createElement('canvas');
    tc.width = id.width;
    tc.height = id.height;
    $ext.context.getContext(tc, '2d').putImageData(id, 0, 0);

    ctx.scale(f, f);
    ctx.drawImage(tc, 0, 0);
    return c;
  },

  getShellAtoms: function(molecule, selection) {
    var shell = [];
    for( var i = 0; i < this.settings.omfraf.shellSize; i++) {
      if(i === 0) {
        var base = selection;
      } else {
        var base = shell;
      }
      shell = shell.concat($ext.array.filter($ext.array.flatten($ext.array.map(
          base, function(atom) {
            return atom.getBondedAtoms();
          })), function(atom) {
        return selection.indexOf(atom) === -1;
      }));
    }
    return $ext.array.unique(shell);
  },

  showOriginal: function(fragment, onClose) {
    var _this = this;

    var title = "Fragment molecule (ATB ID: " + fragment.atb_id + ")";
    var content = document.createElement('div');

    var oids = $ext.array.map(fragment.atoms, function(atom) {
      return atom.other_id;
    });
    var ov = new MoleculeViewer(this, "original_" + fragment.atb_id, content,
        580, this.popup.clientHeight - 100);
    ov.showMolecule(fragment.atb_id, function() {
      $ext.each(fragment.atoms, function(atom) {
        var o = this.molecule.atoms.get(atom.other_id);
        o.charge = atom.charge;
        o.addHighlight(ATOM_STATUSES.preview);
      }, this);
      this.setupInteraction();
      this.molecule.minimize();
      var oas = $ext.array.map(oids, function(oid) {
        return this.molecule.atoms.get(oid);
      }, this);
      $ext.each(_this.getShellAtoms(this.molecule, oas), function(atom) {
        atom.addHighlight(ATOM_STATUSES.unparameterizable);
      });
      this.molecule.centerOnAtoms(oas);
      this.hideOverlay();
      this.redraw();
    }, null, true);
    ov.canvas.className = "border_box";

    var cd = document.createElement('div');
    cd.className = "controls";
    content.appendChild(cd);

    var cb = document.createElement('button');
    cb.className = "border_box";
    $ext.dom.setFloat(cb, "left");
    cb.appendChild(document.createTextNode("Close"));
    cd.appendChild(cb);

    var _this = this;
    var oc = function() {
      if(onClose) {
        onClose.call(_this);
      } else {
        _this.hidePopup();
      }
    };
    $ext.dom.onMouseClick(cb, oc, $ext.mouse.LEFT);

    this.showPopup(title, content, true);
  },

  checkpoint: function() {
    var checkpoint = {
      molecule: this.mv.molecule.getJSON(),
      behavior: this.behavior.getJSON()
    };

    if(!this.checkpoints) {
      this.checkpoints = [checkpoint];
      this.activeCheckpoint = 0;
      $ext.dom.dispatchEvent(this.container, this.historyChangedEvent);
      return;
    }

    if(this.activeCheckpoint !== this.checkpoints.length - 1) {
      this.checkpoints.splice(this.activeCheckpoint + 1);
    }

    this.checkpoints.push(checkpoint);
    this.activeCheckpoint += 1;
    $ext.dom.dispatchEvent(this.container, this.historyChangedEvent);
  },

  loadCheckpoint: function(i) {
    if(i < 0 || i >= this.checkpoints.length) {
      alert("Cannot load checkpoint " + i + ": does not exist.");
      return;
    }

    this.mv.loadMolecule(this.checkpoints[i].molecule);
    this.behavior.loadJSON(this.checkpoints[i].behavior);
    this.activeCheckpoint = i;
    $ext.dom.dispatchEvent(this.container, this.historyChangedEvent);
  },

  previousCheckpoint: function() {
    if(this.activeCheckpoint === 0) {
      return;
    }
    this.loadCheckpoint(this.activeCheckpoint - 1);
  },

  nextCheckpoint: function() {
    if(this.activeCheckpoint === this.checkpoints.length - 1) {
      return;
    }
    this.loadCheckpoint(this.activeCheckpoint + 1);
  },

  /*
   * Handler to be called after a change in the atom selection.
   */
  selectionChanged: function() {
    if(this.mv.molecule) {
      var selection = this.mv.molecule.getSelected();
    }
    var ffbState = "";
    if(!this.off) {
      ffbState = "disabled";
      $ext.dom.clear(this.findFragmentsButton);
      $ext.dom.addText(this.findFragmentsButton, "Loading fragments...");
    }
    if(selection && selection.length > 0) {
      this.findFragmentsButton.disabled = ffbState;
      this.behavior.showSelectionDetails(selection);
    } else {
      this.findFragmentsButton.disabled = "disabled";
      this.hideSelectionDetails();
    }

    if(this.mv.molecule) {
      this.behavior.selectionChanged();
      $ext.dom.dispatchEvent(this.container, this.selectionChangedEvent);
    }
  },

  parameterizationFinished: function(incomplete) {
    this.behavior.parameterizationFinished(incomplete);

    if(this.finished) {
      return;
    }

    $ext.dom.dispatchEvent(this.container, this.parameterizationFinishedEvent);
    this.finished = true;
  },


  /*
   * Set the size of the main molecule viewer to width x height.
   */
  setMVSize: function(width, height) {
    this.mv.setCanvasSize(width, height)
  },

  /*
   * Move the molecule dx in the x direction and dy on the y axis.
   */
  move: function(dx, dy) {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.move(dx, dy);
  },

  /*
   * Zoom on the center of the molecule with a factor f.
   */
  zoom: function(f) {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.zoom(f);
  },

  /*
   * Zoom on the position (x, y) with a factor f.
   */
  zoomOn: function(x, y, f) {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.zoomOn(x, y, f);
  },

  /*
   * Fit the molecule on the canvas.
   */
  bestFit: function() {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.molecule.bestFit();
    this.redraw();
  },

  /*
   * Show the molecule in minimum size on the canvas.
   */
  minimize: function() {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.molecule.minimize();
    this.redraw();
  },

  /*
   * Show the molecule in ideal size on the canvas.
   */
  idealize: function() {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.molecule.idealize();
    this.redraw();
  },

  /*
   * Show the molecule in maximum size on the canvas.
   */
  maximize: function() {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.molecule.maximize();
    this.redraw();
  },

  /*
   * Reset the atom positions to those obtained with OAPoC.
   */
  resetPositions: function() {
    if(!this.mv || !this.mv.molecule) {
      return;
    }

    this.mv.molecule.resetPositions();
    this.redraw();
  },

  /*
   * Get the molecule canvas data as a Base64 string.
   */
  getMVDataURI: function(format) {
    return this.mv.canvas.toDataURL(format);
  },

  /*
   * Get the molecule data as a Base64 string.
   */
  getDataURI: function() {
    var data = JSON.stringify(this.mv.molecule.getJSON());
    return "data:application/octet-stream;base64," + btoa(data);
  },

  /*
   * Redraw the molecule canvas.
   */
  redraw: function() {
    if(!this.mv) {
      return;
    }

    this.mv.redraw();
  }
};
