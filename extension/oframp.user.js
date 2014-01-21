var mt = document.getElementsByClassName("default")[0];
var mtb = mt.children[0];
for(var i = 0; i < mtb.childElementCount; i++) {
  var tr = mtb.children[i];
  var rl = tr.children[0];
  var rv = tr.children[1];
  if(rl.innerText.match(/SMILES/)) {
    var mds = rv.innerText;
  }
}

if(mds) {
  var ob = document.createElement("button");
  ob.appendChild(document.createTextNode("Import in OFraMP"));
  ob.onclick = function() {
    var url = "http://vps955.directvps.nl/OFraMP/?mds=";
    url += encodeURIComponent(mds);
    window.location.href = url;
  };

  var mtp = mt.parentNode;
  mtp.insertBefore(ob, mt);
}
