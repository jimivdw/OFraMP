$ext.extend($ext, {
  dom: {
    /*
     * Fairly cross-browser function for adding an eventListener to an element.
     */
    addEventListener: function(elem, type, callback, useCapture) {
      elem = elem || window;
      useCapture = useCapture || false;

      if(elem.addEventListener) {
        return elem.addEventListener(type, callback, useCapture);
      } else {
        return elem.attachEvent(type, callback, useCapture);
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
        return elem.detachEvent(type, callback, useCapture);
      }
    },

    /*
     * Get the name the user's browser uses for the wheel event.
     */
    wheelEventName: (function() {
      if("onwheel" in document.createElement("div")) {
        return "wheel";
      } else if(document.onmousewheel !== undefined) {
        if(window.addEventListener) {
          return "mousewheel";
        } else {
          return "onmousewheel";
        }
      } else {
        return "DOMMouseScroll";
      }
    })(),

    /*
     * Bind a callback to the wheel event on a given element.
     * 
     * Based on the implementation from:
     * https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
     */
    onMouseWheel: function(elem, callback, useCapture) {
      _onWheel(elem, this.wheelEventName, callback, useCapture);
      if(this.wheelEventName === "DOMMouseScroll") {
        _onWheel(elem, "MozMousePixelScroll", callback, useCapture);
      }

      function _onWheel(elem, wf, callback, useCapture) {
        if(wf === "wheel") {
          $ext.dom.addEventListener(elem, wf, callback, useCapture);
        } else {
          $ext.dom.addEventListener(elem, wf, function(originalEvent) {
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
              button: $ext.dom.getMouseButton(originalEvent),
              buttons: originalEvent.buttons,
              deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
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

            // it's time to fire the callback
            return callback(event);
          }, useCapture);
        }
      }
    },

    // Minimal distance a mouse should move before a click becomes a drag.
    MOUSE_DRAG_EPSILON: 2,


    getMouseButton: function(evt) {
      if(evt.target.addEventListener) {
        return evt.button;
      } else {
        if(evt.button & 1) {
          return 0;
        } else if(evt.button & 2) {
          return 2;
        } else if(evt.button & 4) {
          return 1;
        } else {
          return 0;
        }
      }
    },

    /*
     * Attach a callback to the mousedown event on a given elem.
     */
    onMouseDown: function(elem, callback, useCapture) {
      this.addEventListener(elem, "mousedown", function(evt) {
        window.__mouseDown = true;
        if(callback instanceof Function) {
          evt.button = $ext.dom.getMouseButton(evt);
          return callback(evt);
        }
      }, useCapture);
    },

    /*
     * Attach a callback to the mouseup event on a given elem.
     */
    onMouseUp: function(elem, callback, useCapture) {
      this.addEventListener(elem, "mouseup", function(evt) {
        window.__mouseDown = false;
        delete window.__mouseDown;
        if(callback instanceof Function) {
          evt.button = $ext.dom.getMouseButton(evt);
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
      this.onMouseDown(elem);
      this.onMouseUp(elem);
      this.addEventListener(elem, "mousemove", function(evt) {
        if(window.__mouseDown === true) {
          return;
        }

        if(callback instanceof Function) {
          evt.button = $ext.dom.getMouseButton(evt);
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
    onMouseClick: function(elem, callback, useCapture) {
      this.onMouseDown(elem, function(evt) {
        window.__lastDownPos = {
          clientX: evt.clientX,
          clientY: evt.clientY
        };
      }, useCapture);

      this.onMouseUp(elem, function(evt) {
        var dp = window.__lastDownPos;
        var delta = Math.sqrt(Math.pow(dp.clientX - evt.clientX, 2)
            + Math.pow(dp.clientY - evt.clientY, 2));
        if(dp && delta < $ext.dom.MOUSE_DRAG_EPSILON) {
          return callback(evt);
        }
        delete window.__lastDownPos;
      }, useCapture);
    },

    /*
     * Attach a callback for when the mouse is dragged on a given elem.
     * 
     * Note the difference between this event and the regular onDrag event.
     */
    onMouseDrag: function(elem, callback, useCapture) {
      this.onMouseDown(elem, _onMouseDown, useCapture);
      this.onMouseUp(window, function() {
        delete window.__lastDragPos;
        $ext.dom.removeEventListener(window, "mousemove", _onMouseMove);
      }, useCapture);

      this.addEventListener(elem, "mousemove", function(evt) {
        if(window.__mouseDragged !== true || window.__mouseDown !== true) {
          return;
        }

        if(window.__lastDragPos) {
          var delta = {
            deltaX: evt.clientX - window.__lastDragPos.clientX,
            deltaY: evt.clientY - window.__lastDragPos.clientY
          };
        } else {
          var delta = {
            deltaX: evt.clientX - window.__lastDownPos.clientX,
            deltaY: evt.clientY - window.__lastDownPos.clientY
          };
        }
        $ext.merge(delta, {
          type: "mousedrag"
        });

        window.__lastDragPos = {
          clientX: evt.clientX,
          clientY: evt.clientY
        };

        if(callback instanceof Function) {
          evt.button = $ext.dom.getMouseButton(evt);
          return callback($ext.merge(evt, delta, true));
        }
      }, useCapture);

      function _onMouseDown(evt) {
        window.__mouseDown = true;
        window.__mouseDragged = false;
        window.__lastDownPos = {
          clientX: evt.clientX,
          clientY: evt.clientY
        };

        $ext.dom
            .addEventListener(window, "mousemove", _onMouseMove, useCapture);
      }

      function _onMouseMove(evt) {
        var dp = window.__lastDownPos;
        var delta = Math.sqrt(Math.pow(dp.clientX - evt.clientX, 2)
            + Math.pow(dp.clientY - evt.clientY, 2));
        if(delta > $ext.dom.MOUSE_DRAG_EPSILON) {
          window.__mouseDragged = true;
          $ext.dom.removeEventListener(window, "mousemove", _onMouseMove,
              useCapture);
        }
      }
    }
  }
});
