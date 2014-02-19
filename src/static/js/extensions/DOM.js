var dom = {
  /*
   * Add a class to the given elem.
   */
  addClass: function(elem, className) {
    elem.className += " " + className;
  },

  /*
   * Remove a class from the given elem.
   */
  removeClass: function(elem, className) {
    elem.className = elem.className.replace(className, "");
  },

  /*
   * Add a text node containing the given text to the given elem.
   */
  addText: function(elem, text) {
    elem.appendChild(document.createTextNode(text));
  },

  /*
   * Remove an element from the DOM.
   */
  remove: function(elem) {
    return elem.parentNode.removeChild(elem);
  },

  /*
   * Remove all child elements from the given elem.
   */
  clear: function(elem) {
    if($ext.onBrokenIE()) {
      return elem.innerHTML = "";
    }

    // Make a copy of the children to not mess with the foreach loop.
    var children = $ext.copy(elem.childNodes);
    $ext.each(children, function(child) {
      if(child instanceof Element) {
        elem.removeChild(child);
      }
    });
    if(elem.textContent) {
      elem.textContent = "";
    }
  },

  totalOffsetLeft: function(elem) {
    var o = elem.offsetLeft;
    while(elem.offsetParent) {
      elem = elem.offsetParent;
      o += elem.offsetLeft;
    }
    return o;
  },

  totalOffsetTop: function(elem) {
    var o = elem.offsetTop;
    while(elem.offsetParent) {
      elem = elem.offsetParent;
      o += elem.offsetTop;
    }
    return o;
  },

  totalScrollLeft: function(elem) {
    var s = elem.scrollLeft;
    while(elem.parentElement) {
      elem = elem.parentElement;
      s += elem.scrollLeft;
    }
    return s;
  },

  totalScrollTop: function(elem) {
    var s = elem.scrollTop;
    while(elem.parentElement) {
      elem = elem.parentElement;
      s += elem.scrollTop;
    }
    return s;
  },

  addListItem: function(list, item) {
    var li = document.createElement('li');

    if(item instanceof String || typeof item === "string") {
      item = document.createTextNode(item);
    }
    li.appendChild(item);

    list.appendChild(li);
    return li;
  },

  addTableRow: function(table, values, headers) {
    if(values === undefined) {
      values = [];
    } else if(!(values instanceof Array)) {
      values = [values];
    }

    if(headers === undefined) {
      headers = [];
    } else if(!(headers instanceof Array)) {
      headers = [headers];
    }

    var row = document.createElement('tr');

    $ext.each(headers, function(header) {
      var head = document.createElement('th');
      if(header instanceof String || typeof header === "string") {
        header = document.createTextNode(header);
      }
      head.appendChild(header);
      row.appendChild(head);
    });

    $ext.each(values, function(value) {
      var data = document.createElement('td');
      if(value instanceof String || typeof value === "string") {
        value = document.createTextNode(value);
      }
      data.appendChild(value);
      row.appendChild(data);
    });

    table.appendChild(row);
    return row;
  },

  addSelectOption: function(select, value, label, selected) {
    var option = document.createElement('option');
    option.value = value;
    if(label) {
      option.appendChild(document.createTextNode(label));
    } else {
      option.appendChild(document.createTextNode(value));
    }
    if(selected) {
      option.selected = "selected";
    }
    select.appendChild(option);
    return option;
  },

  /*
   * Custom mouse events.
   */
  mouseDragEndEvent: 'mousedragend',
  mouseWheelEndEvent: 'mousewheelend',

  STANDARD_EVENTS: {
    // <body> and <frameset> Events
    onload: 1,
    onunload: 1,
    oncontextmenu: 1,
    // Form Events
    onblur: 1,
    onchange: 1,
    onfocus: 1,
    onreset: 1,
    onselect: 1,
    onsubmit: 1,
    // Image Events
    onabort: 1,
    // Keyboard Events
    onkeydown: 1,
    onkeypress: 1,
    onkeyup: 1,
    // Mouse Events
    onclick: 1,
    ondblclick: 1,
    onmousedown: 1,
    onmousemove: 1,
    onmouseout: 1,
    onmouseover: 1,
    onmouseup: 1
  },

  /*
   * Fairly cross-browser function for adding an eventListener to an element.
   */
  addEventListener: function(elem, type, callback, useCapture) {
    elem = elem || window;
    useCapture = useCapture || false;

    if(elem.addEventListener) {
      return elem.addEventListener(type, callback, useCapture);
    } else if(elem.attachEvent && this.STANDARD_EVENTS["on" + type]) {
      return elem.attachEvent("on" + type, callback, useCapture);
    } else {
      if(elem["on" + type]) {
        elem["on" + type].push(callback);
      } else {
        elem["on" + type] = [callback];
      }
    }
  },

  /*
   * Fairly cross-browser function for removing an eventListener from an
   * element.
   */
  removeEventListener: function(elem, type, callback, useCapture) {
    elem = elem || window;
    useCapture = useCapture || false;

    if(elem.removeEventListener) {
      return elem.removeEventListener(type, callback, useCapture);
    } else if(elem.detachEvent && this.STANDARD_EVENTS["on" + type]) {
      return elem.detachEvent("on" + type, callback, useCapture);
    } else {
      if(elem["on" + type]) {
        $ext.array.remove(elem["on" + type], callback);
      }
    }
  },

  /*
   * Remove all eventlisteners listed in the callbacks object from the given
   * element elem.
   */
  removeEventListeners: function(elem, callbacks, useCapture) {
    $ext.each(callbacks, function(callback, name) {
      this.removeEventListener(elem, name, callback, useCapture);
    }, this);
  },

  /*
   * Fairly cross-browser function for dispatching an event on an element.
   */
  dispatchEvent: function(elem, type, data) {
    var event;
    try {
      event = new Event(type);
    } catch(e) {
      if(document.createEvent) {
        event = document.createEvent("Event");
        event.initEvent(type, true, true);
      } else {
        event = document.createEventObject("Event");
        event.eventType = type;
      }
    }

    $ext.each(data, function(v, k) {
      event[k] = v;
    });

    if(elem.dispatchEvent) {
      elem.dispatchEvent(event);
    } else if(elem.fireEvent && this.STANDARD_EVENTS["on" + type]) {
      elem.fireEvent("on" + type, event);
    } else if(elem["on" + type]) {
      $ext.each(elem["on" + type], function(callback) {
        callback.call(elem, event);
      });
    }
  },

  /*
   * Get an Event represented as an Object (fix for IE <= 8 where this strangely
   * isn't the case and Firefox where event objects are immutable).
   */
  eventObject: function(evt) {
    if(evt instanceof Object && !$ext.onFirefox()) {
      return evt;
    }

    var r = new Object();
    for(k in evt) {
      r[k] = evt[k];
    }
    return r;
  },

  /*
   * Get the name the user's browser uses for the wheel event.
   */
  wheelEventName: (function() {
    if("onwheel" in document.createElement("div")) {
      return "wheel";
    } else if(document.onmousewheel !== undefined) {
      return "mousewheel";
    } else {
      return "DOMMouseScroll";
    }
  })(),

  // Time in miliseconds until the mousewheelend event is fired.
  MOUSE_WHEEL_TIMEOUT: 500,

  /*
   * Bind a callback to the wheel event on a given element.
   * 
   * Based on the implementation from:
   * https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
   */
  onMouseWheel: function(elem, callback, useCapture) {
    var _this = this;

    var wheelEndTimeout = undefined;

    function _onWheel(elem, wf, callback, useCapture) {
      if(wf === "wheel") {
        var cb = function(event) {
          if(wheelEndTimeout) {
            window.clearTimeout(wheelEndTimeout);
          }
          wheelEndTimeout = window.setTimeout(function() {
            _this.dispatchEvent(elem, _this.mouseWheelEndEvent);
            wheelEndTimeout = undefined;
          }, _this.MOUSE_WHEEL_TIMEOUT);

          // it's time to fire the callback
          if(callback instanceof Function) {
            return callback(event);
          }
        }
        _this.addEventListener(elem, wf, cb, useCapture);
        return cb;
      } else {
        var cb = function(originalEvent) {
          if(!originalEvent) {
            originalEvent = window.event;
          }

          // create a normalized event object
          var event = {
            // keep a ref to the original event object
            originalEvent: originalEvent,
            target: originalEvent.target || originalEvent.srcElement,
            type: "wheel",
            canBubble: originalEvent.canBubble,
            cancelable: originalEvent.cancelable,
            view: originalEvent.view,
            detail: originalEvent.detail,
            currentTarget: originalEvent.currentTarget,
            relatedTarget: originalEvent.relatedTarget,
            screenX: originalEvent.screenX || 0,
            screenY: originalEvent.screenY || 0,
            clientX: originalEvent.clientX || 0,
            clientY: originalEvent.clientY || 0,
            button: _this.getMouseButton(originalEvent),
            buttons: originalEvent.buttons,
            deltaMode: originalEvent.type === "MozMousePixelScroll" ? 0 : 1,
            deltaX: 0,
            deltaY: 0,
            deltaZ: 0,
            preventDefault: function() {
              originalEvent.preventDefault ? originalEvent.preventDefault()
                  : originalEvent.returnValue = false;
            }
          };

          // calculate deltaY (and deltaX) according to the event
          if(wf === "mousewheel" || wf === "onmousewheel") {
            event.deltaY = -1 / 40 * originalEvent.wheelDelta;
            // Webkit also supports wheelDeltaX
            if(originalEvent.wheelDeltaX) {
              event.deltaX = -1 / 40 * originalEvent.wheelDeltaX;
            }
          } else {
            event.deltaY = originalEvent.detail;
          }

          if(wheelEndTimeout) {
            window.clearTimeout(wheelEndTimeout);
          }
          wheelEndTimeout = window.setTimeout(function() {
            _this.dispatchEvent(elem, _this.mouseWheelEndEvent);
            wheelEndTimeout = undefined;
          }, _this.MOUSE_WHEEL_TIMEOUT);

          // it's time to fire the callback
          if(callback instanceof Function) {
            return callback(event);
          }
        };

        _this.addEventListener(elem, wf, cb, useCapture);
        return cb;
      }
    }

    var cbs = {};
    cbs[this.wheelEventName] = _onWheel(elem, this.wheelEventName, callback,
        useCapture);
    if(this.wheelEventName === "DOMMouseScroll") {
      cbs["MozMousePixelScroll"] = _onWheel(elem, "MozMousePixelScroll",
          callback, useCapture);
    }
    return cbs;
  },

  /*
   * Bind a callback to the mousewheelend event on a given elem.
   * 
   * Note: ONLY dispatched when the mousewheel event is bound on the elem as
   * well.
   */
  onMouseWheelEnd: function(elem, callback, useCapture) {
    var cb = function(evt) {
      if(callback instanceof Function) {
        return callback(evt);
      }
    };
    this.addEventListener(elem, "mousewheelend", cb, useCapture);
    return {
      mousewheelend: cb
    };
  },

  // Minimal distance a mouse should move before a click becomes a drag.
  MOUSE_DRAG_EPSILON: 2,


  getMouseButton: function(evt) {
    if(BrowserDetect.browser === "Explorer" && BrowserDetect.version === 9) {
      var button = window.event.button;
    } else if(evt.buttons === undefined) {
      var button = evt.button;
    } else {
      var button = evt.buttons;
    }

    if(button & 1) {
      return 0;
    } else if(button & 2) {
      return 2;
    } else if(button & 4) {
      return 1;
    } else {
      return 0;
    }
  },

  /*
   * Attach a callback to the mouseover event on a given elem.
   */
  onMouseOver: function(elem, callback, useCapture) {
    var _this = this;
    var cb = function(evt) {
      evt = _this.eventObject(evt);
      if(callback instanceof Function) {
        return callback(evt);
      }
    };
    this.addEventListener(elem, "mouseover", cb, useCapture);
    return {
      mouseover: cb
    };
  },

  /*
   * Attach a callback to the mouseout event on a given elem.
   */
  onMouseOut: function(elem, callback, useCapture) {
    var _this = this;
    var cb = function(evt) {
      evt = _this.eventObject(evt);
      if(callback instanceof Function) {
        return callback(evt);
      }
    };
    this.addEventListener(elem, "mouseout", cb, useCapture);
    return {
      mouseout: cb
    };
  },

  /*
   * Attach a callback to the mousedown event on a given elem.
   */
  onMouseDown: function(elem, callback, button, useCapture) {
    var _this = this;
    var cb = function(evt) {
      evt = _this.eventObject(evt);
      evt.button = _this.getMouseButton(evt);
      if(button !== undefined && evt.button !== button) {
        return;
      }

      if(callback instanceof Function) {
        return callback(evt);
      }
    };
    this.addEventListener(elem, "mousedown", cb, useCapture);
    return {
      mousedown: cb
    };
  },

  /*
   * Attach a callback to the mouseup event on a given elem.
   */
  onMouseUp: function(elem, callback, button, useCapture) {
    var _this = this;
    var cb = function(evt) {
      evt = _this.eventObject(evt);
      evt.button = _this.getMouseButton(evt);
      if(button !== undefined && evt.button !== button) {
        return;
      }

      if(callback instanceof Function) {
        return callback(evt);
      }
    };
    this.addEventListener(elem, "mouseup", cb, useCapture);
    return {
      mouseup: cb
    };
  },

  /*
   * Attach a callback to the mousemove event on a given elem.
   * 
   * Note that, in this implementation, this event will only be fired when the
   * mouse is moved but NOT down, i.e. the user is not dragging.
   */
  onMouseMove: function(elem, callback, useCapture) {
    var mouseDown = false;

    var dcb = this.onMouseDown(elem, function() {
      mouseDown = true;
    });
    var ucb = this.onMouseUp(elem, function() {
      mouseDown = false;
    });

    var mcb = function(evt) {
      if(mouseDown) {
        return;
      }

      if(callback instanceof Function) {
        return callback(evt);
      }
    };
    this.addEventListener(elem, "mousemove", mcb, useCapture);
    return $ext.merge($ext.merge({
      mousemove: mcb
    }, dcb), ucb);
  },

  /*
   * Attach a callback to the mouseclick event on a given elem.
   * 
   * Note that, in this implementation, this event will only be fired when the
   * mouse is not moved more than MOUSE_DRAG_EPSILON, i.e. only when the user is
   * not dragging.
   */
  onMouseClick: function(elem, callback, button, useCapture) {
    var _this = this;
    var lastDownPos = undefined;

    var dcb = this.onMouseDown(elem, function(evt) {
      lastDownPos = {
        clientX: evt.clientX,
        clientY: evt.clientY
      };
    }, button, useCapture);

    var ucb = this.onMouseUp(elem, function(evt) {
      if(!lastDownPos) {
        return;
      }

      var delta = Math.sqrt(Math.pow(lastDownPos.clientX - evt.clientX, 2)
          + Math.pow(lastDownPos.clientY - evt.clientY, 2));
      if(lastDownPos && delta < _this.MOUSE_DRAG_EPSILON) {
        return callback(evt);
      }
      lastDownPos = undefined;
    }, button, useCapture);

    return $ext.merge(dcb, ucb);
  },

  /*
   * Attach a callback for when the mouse is dragged on a given elem.
   * 
   * Note the difference between this event and the regular onDrag event.
   */
  onMouseDrag: function(elem, callback, button, useCapture) {
    var _this = this;

    var mouseDown = false;
    var mouseDragged = false;
    var lastDownPos = undefined;
    var lastDragPos = undefined;

    function _onMouseDown(evt) {
      mouseDown = true;
      lastDownPos = {
        clientX: evt.clientX,
        clientY: evt.clientY
      };

      _this.addEventListener(elem, "mousemove", _onMouseMove, useCapture);
    }

    function _onMouseMove(evt) {
      var delta = Math.sqrt(Math.pow(lastDownPos.clientX - evt.clientX, 2)
          + Math.pow(lastDownPos.clientY - evt.clientY, 2));
      if(delta > _this.MOUSE_DRAG_EPSILON) {
        mouseDragged = true;
        _this.removeEventListener(elem, "mousemove", _onMouseMove);

        _this.addEventListener(document.documentElement, "mousemove", _onMouseDrag, useCapture);
      }
    }

    function _onMouseUp(evt) {
      mouseDown = false;
      lastDragPos = undefined;
      lastDownPos = undefined;
      _this.removeEventListener(elem, "mousemove", _onMouseMove);
      _this.removeEventListener(elem, "mousemove", _onMouseDrag);

      if(mouseDragged !== true) {
        return;
      }
      mouseDragged = false;
      _this.dispatchEvent(elem, _this.mouseDragEndEvent, {
        button: evt.button,
        ctrlKey: evt.ctrlKey,
        altKey: evt.altKey,
        shiftKey: evt.shiftKey
      });
    }

    function _onMouseDrag(evt) {
      evt = _this.eventObject(evt);
      var eb = _this.getMouseButton(evt);
      evt.button = eb;
      if(button !== undefined && eb !== button || !mouseDragged || !mouseDown) {
        return;
      }

      if(lastDragPos) {
        var delta = {
          deltaX: evt.clientX - lastDragPos.clientX,
          deltaY: evt.clientY - lastDragPos.clientY
        };
      } else {
        var delta = {
          deltaX: evt.clientX - lastDownPos.clientX,
          deltaY: evt.clientY - lastDownPos.clientY
        };
      }
      $ext.merge(delta, {
        type: "mousedrag"
      });

      lastDragPos = {
        clientX: evt.clientX,
        clientY: evt.clientY
      };

      if(callback instanceof Function) {
        return callback($ext.merge(evt, delta, true));
      }
    }

    var dcb = this.onMouseDown(elem, _onMouseDown, button, useCapture);
    var ucb = this.onMouseUp(document.documentElement, _onMouseUp, button, useCapture);
    return $ext.merge(dcb, ucb);
  },

  onMouseDragEnd: function(elem, callback, button, useCapture) {
    var _this = this;
    var cb = function(evt) {
      evt = _this.eventObject(evt);
      if(button !== undefined && evt.button !== button) {
        return;
      }

      if(callback instanceof Function) {
        return callback(evt);
      }
    };
    this.addEventListener(elem, "mousedragend", cb, useCapture);
    return {
      mousedragend: cb
    };
  },

  onContextMenu: function(elem, callback, useCapture) {
    var cb = function(evt) {
      if(callback instanceof Function) {
        return callback(evt);
      }
    };
    this.addEventListener(elem, "contextmenu", cb, useCapture);
    return {
      contextmenu: cb
    };
  },

  onScroll: function(elem, callback, useCapture) {
    var cb = function(evt) {
      if(callback instanceof Function) {
        return callback(evt);
      }
    };
    this.addEventListener(elem, "scroll", cb, useCapture);
    return {
      scroll: cb
    };
  }
};

$ext.extend($ext, {
  dom: dom
});
