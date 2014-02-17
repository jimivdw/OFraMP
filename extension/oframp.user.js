/*
 * Store the URL parameters in the URLParams object.
 * 
 * Original idea from: http://stackoverflow.com/a/979995
 */
var URLParams = function() {
  var query_string = {};
  var query = decodeURI(window.location.search.substring(1));
  var vars = query.split("&");
  for( var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if(typeof query_string[key] === "undefined") {
      query_string[key] = value;
      // If second entry with this name
    } else if(typeof query_string[key] === "string") {
      var arr = [query_string[key], value];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(value);
    }
  }
  return query_string;
}();

var ot = document.getElementById("MDOutputForm").parentNode;
if(URLParams.molid) {
  var cr = document.createElement("tr");
  cr.className = "border_top";
  var ch = document.createElement("td");
  var chc = document.createElement("b");
  chc.appendChild(document.createTextNode("Use with OFraMP"));
  ch.appendChild(chc);
  cr.appendChild(ch);
  cr.appendChild(document.createElement("td"));
  cr.appendChild(document.createElement("td"));
  cc = document.createElement("td");
  cr.appendChild(cc);

  var ob = document.createElement("button");
  ob.appendChild(document.createTextNode("Import molid"));
  ob.onclick = function() {
    var url = "http://vps955.directvps.nl/OFraMP/?atb_id=";
    url += encodeURIComponent(URLParams.molid);
    window.location.href = url;
  };

  cc.appendChild(ob);
  ot.appendChild(cr);
}
