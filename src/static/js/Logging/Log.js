var __log = new Array();

function log(type, desc) {
  var now = Date.now();
  type = type || "generic";
  desc = desc || "";
  var msg = "" + now + ";" + type + ";" + desc + ";";
  __log.push(msg);
}

log("logging.create", "Logger created");
