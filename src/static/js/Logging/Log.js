var __log = new Object();

function log(type, desc) {
  var now = Date.now();
  type = type || "other";
  desc = desc || type;

  var tp = type.split(".");
  var cl = __log;
  $ext.each(tp, function(subtype, i) {
    if(cl[subtype] === undefined) {
      if(i === tp.length - 1) {
        cl[subtype] = new Array();
      } else {
        cl[subtype] = new Object();
      }
    }
    cl = cl[subtype];
  });

  var lo = {
    time: now,
    msg: desc
  };
  cl.push(lo);
}

function getCSVLog() {
  var csvl = new Array();
  $ext.each(__log, function(v, type) {
    $ext.each(v, function(entry) {
      csvl.push("" + entry.time + ";" + type + ";" + entry.msg + ";");
    });
  }, undefined, true);
  return csvl.sort();
}

log("system.init.logger", "Logger created");
