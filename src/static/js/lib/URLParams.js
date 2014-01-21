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
