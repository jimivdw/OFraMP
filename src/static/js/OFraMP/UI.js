function showPopup(title, content) {
  var pe = document.getElementById("popup");
  var te = document.getElementById("popup_title");
  var ce = document.getElementById("popup_content");
  te.innerHTML = title;
  $ext.each(ce.childNodes, function(n) {
    try {
      ce.removeChild(n);
    } catch(e) {
      // Pass
    }
  });
  ce.appendChild(content);
  pe.style.visibility = 'visible';
}

function hidePopup() {
  var pe = document.getElementById("popup");
  pe.style.visibility = 'hidden';
}

function showInsertMoleculePopup() {
  var title = "Please enter a molecule data string";
  var content = document.createElement('div');
  var ta = document.createElement('textarea');
  ta.placeholder = "Insert SMILES / InChI string here";
  var cbs = document.createElement('div');
  cbs.className = 'controls';
  var sb = document.createElement('button');
  sb.appendChild(document.createTextNode("Submit"));
  sb.onclick = function() {
    mv.showMolecule(ta.value);
    hidePopup();
  }
  var rb = document.createElement('button');
  rb.appendChild(document.createTextNode("Random molecule"));
  rb.onclick = function() {
    ta.value = $ext.array.randomElement(PREDEFINED_MOLECULES);
  }
  cbs.appendChild(sb);
  cbs.appendChild(rb);
  content.appendChild(ta);
  content.appendChild(cbs);
  showPopup(title, content);
}

function init() {
  initControls();
}

function initControls() {
  var controls = document.getElementById("controls");
  var toggle = document.getElementById("controls_toggle");
  $ext.dom.onMouseOver(controls, function() {
    toggle.className = "hover";
  });
  $ext.dom.onMouseOut(controls, function() {
    toggle.className = "";
  });

  $ext.dom.onMouseClick(toggle, function() {
    if(controls.style.visibility === "visible") {
      controls.style.height = "0px";
      controls.style.padding = "0px";
      controls.style.visibility = "hidden";
      toggle.style.bottom = "0px";
      toggle.innerHTML = "Controls &#8673";
    } else {
      controls.style.visibility = "visible";
      controls.style.height = "40px";
      controls.style.padding = "5px";
      toggle.style.bottom = "40px";
      toggle.innerHTML = "Controls &#8675";
    }
  });
}
