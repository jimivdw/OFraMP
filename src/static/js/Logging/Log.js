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
  console.log(type, desc);
}

function getOrderedLog() {
  var ol = new Array();
  $ext.each(__log, function(v, type) {
    $ext.each(v, function(entry) {
      ol.push({
        time: entry.time,
        type: type,
        msg: entry.msg
      });
    });
  }, undefined, true);
  return ol.sort(function(a, b) {
    return a.time - b.time;
  });
}

function getCSVLog() {
  var ol = getOrderedLog();
  var csvl = "Time;TimeDelta;Type;Message;\n";
  var fe = ol[0];
  var le = ol[0];
  $ext.each(ol, function(entry) {
    var time = (entry.time - fe.time) / 1000.;
    var timeDlt = (entry.time - le.time) / 1000.;
    csvl += time + ";" + timeDlt + ";" + entry.type + ";" + entry.msg + ";\n";
    le = entry;
  });
  return csvl;
}

log("system.init.logger", "Logger created");
