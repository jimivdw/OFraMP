$ext.extend($ext, {
  dom: {
    addEventListener: function(elem, type, callback, useCapture) {
      elem = elem || window;
      useCapture = useCapture || false;

      if(elem.addEventListener) {
        return elem.addEventListener(type, callback, useCapture);
      } else {
        return elem.attachEvent(type, callback, useCapture);
      }
    },

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
    onWheel: function(elem, callback, useCapture) {
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
              button: originalEvent.button,
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

    MOUSE_DRAG_EPSILON: 2,

    onMouseDrag: function(elem, callback, useCapture) {
      this.addEventListener(elem, "mousedown", _onMouseDown);
      this.addEventListener(elem, "mousemove", function(evt) {
        if(!window.__mouseDragged === true) {
          return;
        }

        if(window.__lastDragPos) {
          var delta = {
            deltaX: evt.clientX - window.__lastDragPos.clientX,
            deltaY: evt.clientY - window.__lastDragPos.clientY
          };
        } else {
          var delta = {
            deltaX: evt.clientX - window.__downPos.clientX,
            deltaY: evt.clientY - window.__downPos.clientY
          };
        }
        window.__lastDragPos = {
          clientX: evt.clientX,
          clientY: evt.clientY
        };

        return callback($ext.merge(evt, delta));
      });

      function _onMouseDown(evt) {
        window.__downPos = {
          clientX: evt.clientX,
          clientY: evt.clientY
        };

        $ext.dom.addEventListener(window, "mousemove", _onMouseMove);
        $ext.dom.addEventListener(window, "mouseup", function() {
          delete window.__mouseDragged;
          delete window.__downPos;
          delete window.__lastDragPos;
          $ext.dom.removeEventListener(window, "mousemove", _onMouseMove);
        });
      }

      function _onMouseMove(evt) {
        var dp = window.__downPos;
        var delta = Math.sqrt(Math.pow(dp.clientX - evt.clientX, 2)
            + Math.pow(dp.clientY - evt.clientY, 2));
        if(delta >= $ext.dom.MOUSE_DRAG_EPSILON) {
          window.__mouseDragged = true;
          $ext.dom.removeEventListener(window, "mousemove", _onMouseMove);
        }
      }
    }
  }
});
