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
  var sb = document.createElement('button');
  sb.appendChild(document.createTextNode("Submit"));
  sb.onclick = function() {
    mv.showMolecule(ta.value);
    hidePopup();
  }
  content.appendChild(ta);
  content.appendChild(sb);
  showPopup(title, content);
}
