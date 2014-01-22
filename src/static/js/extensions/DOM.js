$ext.extend($ext, {
  dom: {
    /*
     * Add a class to the given elem.
     */
    addClass: function(elem, className) {
      elem.className += className;
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
      // Make a copy of the children to not mess with the foreach loop.
      var children = $ext.copy(elem.children);
      $ext.each(children, function(child) {
        if(child instanceof Element) {
          elem.removeChild(child);
        }
      });
      elem.textContent = "";
    },

    addTableRow: function(table, label, value) {
      var row = document.createElement('tr');

      var head = document.createElement('th');
      if(!(label instanceof Element)) {
        label = document.createTextNode(label);
      }
      head.appendChild(label);

      var data = document.createElement('td');
      if(!(value instanceof Element)) {
        value = document.createTextNode(value);
      }
      data.appendChild(value);

      row.appendChild(head);
      row.appendChild(data);
      table.appendChild(row);
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
    },

    /*
     * Custom mouse events.
     */
    mouseDragEndEvent: new Event('mousedragend'),
    mouseWheelEndEvent: new Event('mousewheelend'),

    /*
     * Fairly cross-browser function for adding an eventListener to an element.
     */
    addEventListener: function(elem, type, callback, useCapture) {
      elem = elem || window;
      useCapture = useCapture || false;

      if(elem.addEventListener) {
        return elem.addEventListener(type, callback, useCapture);
      } else {
        return elem.attachEvent("on" + type, callback, useCapture);
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
      } else {
        return elem.detachEvent("on" + type, callback, useCapture);
      }
    },

    /*
     * Get an Event represented as an Object (fix for IE <= 8 where this
     * strangely isn't the case and Firefox where event objects are immutable).
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

      _onWheel(elem, this.wheelEventName, callback, useCapture);
      if(this.wheelEventName === "DOMMouseScroll") {
        _onWheel(elem, "MozMousePixelScroll", callback, useCapture);
      }

      function _onWheel(elem, wf, callback, useCapture) {
        if(wf === "wheel") {
          _this.addEventListener(elem, wf, callback, useCapture);
        } else {
          _this.addEventListener(elem, wf, function(originalEvent) {
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
              elem.dispatchEvent(_this.mouseWheelEndEvent);
              wheelEndTimeout = undefined;
            }, _this.MOUSE_WHEEL_TIMEOUT);

            // it's time to fire the callback
            return callback(event);
          }, useCapture);
        }
      }
    },

    onMouseWheelEnd: function(elem, callback, useCapture) {
      this.addEventListener(elem, "mousewheelend", function(evt) {
        if(callback instanceof Function) {
          return callback(evt);
        }
      }, useCapture);
    },

    // Minimal distance a mouse should move before a click becomes a drag.
    MOUSE_DRAG_EPSILON: 2,


    getMouseButton: function(evt) {
      if(!$ext.onBrokenIE() && !$ext.onFirefox()) {
        return evt.button;
      } else {
        if($ext.onFirefox()) {
          var button = evt.buttons;
        } else {
          var button = evt.button;
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
      }
    },

    /*
     * Attach a callback to the mouseover event on a given elem.
     */
    onMouseOver: function(elem, callback, useCapture) {
      var _this = this;
      this.addEventListener(elem, "mouseover", function(evt) {
        evt = _this.eventObject(evt);
        if(callback instanceof Function) {
          return callback(evt);
        }
      }, useCapture);
    },

    /*
     * Attach a callback to the mouseout event on a given elem.
     */
    onMouseOut: function(elem, callback, useCapture) {
      var _this = this;
      this.addEventListener(elem, "mouseout", function(evt) {
        evt = _this.eventObject(evt);
        if(callback instanceof Function) {
          return callback(evt);
        }
      }, useCapture);
    },

    /*
     * Attach a callback to the mousedown event on a given elem.
     */
    onMouseDown: function(elem, callback, button, useCapture) {
      var _this = this;
      this.addEventListener(elem, "mousedown", function(evt) {
        evt = _this.eventObject(evt);
        evt.button = _this.getMouseButton(evt);
        if(button !== undefined && evt.button !== button) {
          return;
        }

        if(callback instanceof Function) {
          return callback(evt);
        }
      }, useCapture);
    },

    /*
     * Attach a callback to the mouseup event on a given elem.
     */
    onMouseUp: function(elem, callback, button, useCapture) {
      var _this = this;
      this.addEventListener(elem, "mouseup", function(evt) {
        evt = _this.eventObject(evt);
        evt.button = _this.getMouseButton(evt);
        if(button !== undefined && evt.button !== button) {
          return;
        }

        if(callback instanceof Function) {
          return callback(evt);
        }
      }, useCapture);
    },

    /*
     * Attach a callback to the mousemove event on a given elem.
     * 
     * Note that, in this implementation, this event will only be fired when the
     * mouse is moved but NOT down, i.e. the user is not dragging.
     */
    onMouseMove: function(elem, callback, useCapture) {
      var mouseDown = false;

      this.onMouseDown(elem, function() {
        mouseDown = true;
      });
      this.onMouseUp(elem, function() {
        mouseDown = false;
      });

      this.addEventListener(elem, "mousemove", function(evt) {
        if(mouseDown) {
          return;
        }

        if(callback instanceof Function) {
          return callback(evt);
        }
      }, useCapture);
    },

    /*
     * Attach a callback to the mouseclick event on a given elem.
     * 
     * Note that, in this implementation, this event will only be fired when the
     * mouse is not moved more than MOUSE_DRAG_EPSILON, i.e. only when the user
     * is not dragging.
     */
    onMouseClick: function(elem, callback, button, useCapture) {
      var _this = this;
      var lastDownPos = undefined;

      this.onMouseDown(elem, function(evt) {
        lastDownPos = {
          clientX: evt.clientX,
          clientY: evt.clientY
        };
      }, button, useCapture);

      this.onMouseUp(elem, function(evt) {
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

      this.onMouseDown(elem, _onMouseDown, button, useCapture);
      this.onMouseUp(window, _onMouseUp, button, useCapture);

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

          _this.addEventListener(elem, "mousemove", _onMouseDrag, useCapture);
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
        var mdee = _this.mouseDragEndEvent;
        mdee.button = _this.getMouseButton(evt);
        elem.dispatchEvent(mdee);
      }

      function _onMouseDrag(evt) {
        evt = _this.eventObject(evt);
        evt.button = _this.getMouseButton(evt);
        if(button !== undefined && evt.button !== button || !mouseDragged
            || !mouseDown) {
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
    },

    onMouseDragEnd: function(elem, callback, button, useCapture) {
      var _this = this;
      this.addEventListener(elem, "mousedragend", function(evt) {
        evt = _this.eventObject(evt);
        if(button !== undefined && evt.button !== button) {
          return;
        }

        if(callback instanceof Function) {
          return callback(evt);
        }
      }, useCapture);
    },

    onContextMenu: function(elem, callback, useCapture) {
      var _this = this;
      this.addEventListener(elem, "contextmenu", function(evt) {
        if(callback instanceof Function) {
          return callback(evt);
        }
      }, useCapture);
    },

    onScroll: function(elem, callback, useCapture) {
      this.addEventListener(elem, "scroll", callback, useCapture);
    }
  }
});
