(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var api = module.exports = require('./lib/api')

api.DragAndDrop.prototype.drag = function (callback) {
  this.elements.forEach(function(element) {
    element.setAttribute('draggable', true)
  })
  return this.on('dragstart', function onDragStart(e) {
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
    callback.call(this, e)
  })
}
api.DragAndDrop.prototype.drop = function (callback) {
  this.elements.forEach(function(element) {
    element.setAttribute('dropzone', true)
  })
  function inihibit(e, cb) {
    e.stopPropagation()
    e.preventDefault()
  }
  function onDrop(e){
    inihibit(e, callback.call(this, e))
  }
  function effect(e) {
    inihibit(e, e.dataTransfer.dropEffect = 'move')
  }
  return this.on('drop', onDrop)
    .on("dragover", effect)
    .on("dragenter", inihibit)
    .on("dragleave", inihibit)
}
'enter leave over end '.split(' ')
  .forEach(function shorthand(event) {
    api.DragAndDrop.prototype[event || 'move'] = function (callback) {
      return this.on('drag'+event, callback)
    }
  })

},{"./lib/api":3}],2:[function(require,module,exports){
var virtual = require('./virtual')

module.exports = function addEvent(element, event, callback) {
  var attach = element.addEventListener.bind(element);
  virtual.promise
    .then(function($event) {
      if (virtual[event]) virtual[event](element, attach)
      return $event
    })
    .then(function($event) {
      if (event === 'dragstart' && element.contains($event.srcElement)){
        setTimeout(function() {
          element.dispatchEvent($event)
        })
      }
    })
  attach(event, callback)
  return this
}

},{"./virtual":12}],3:[function(require,module,exports){
var addEvent = require('./add-event')
var dragging = require('./state').dragging
var toArray = Array.call.bind(Array.prototype.slice)

function array(value) {
  if(Array.isArray(value)) return value
  if('length' in value) return toArray(value)
  return [value]
}
function api(element) {
  return new DragAndDrop(element)
}
function DragAndDrop(element) {
  this.using = {}
  this.elements = array(element)
}
DragAndDrop.prototype.on = function(event, callback) {
  this.elements.forEach(function(element) {
    addEvent(element, event, callback.bind(element))
  })
  return this
}

api.defer = require('./util/defer')
api.elementAt = require('./util/element-at')
api.observeElement = require('./util/observe-element')
api.removeElement = require('./util/remove')
api.addEventToElement = addEvent
api.DragAndDrop = DragAndDrop
api.dragging = dragging

module.exports = api

},{"./add-event":2,"./state":5,"./util/defer":6,"./util/element-at":7,"./util/observe-element":8,"./util/remove":9}],4:[function(require,module,exports){
var fnDragDrop = require('../../index')

jQuery.extend(fnDragDrop.defer, {
  Promise: function jQueryPromise(callback) {
    return jQuery.Deferred(function(deferred) {
      callback(deferred.resolve, deferred.reject)
    })
    .promise()
  }
})

jQuery.each(fnDragDrop.DragAndDrop.prototype, function(key) {
  if(key === 'on') return;
  jQuery.fn['fn'+key[0].toUpperCase() + key.slice(1)] = function(cb) {
    return ((this.fnDragDrop||(this.fnDragDrop=fnDragDrop(this)))[key](cb),this)
  }
})

},{"../../index":1}],5:[function(require,module,exports){
module.exports = []
module.exports.elements = []
module.exports.dragging = []

},{}],6:[function(require,module,exports){
(function (global){
function defer() {
  var Promise = defer.Promise || global.Promise
  var deferred = {}
  deferred.promise = new Promise(function deferrer(resolve, reject) {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  return deferred
}
module.exports = defer

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
var elements = require('../state').elements

module.exports = function elementAt(touch) {
  var element, dimension
  for (var i = 0; i < elements.length; i++) {
    element = elements[i]
    dimension = element.getClientRects().item(0)
    if(dimension && (touch.clientX >= dimension.left &&
      touch.clientX <= (dimension.left + dimension.width) &&
      touch.clientY >= dimension.top &&
      touch.clientY <= (dimension.top + dimension.height))) {
      return element
    }
  }
}

},{"../state":5}],8:[function(require,module,exports){
var elements = require('../state').elements

module.exports = function observeElement(element) {
  if(elements.indexOf(element) < 0) {
    elements.push(element)
  }
  elements.sort(function(a, b) {
    if(a.contains(b)) return 1
    else return 0
  })
}

},{"../state":5}],9:[function(require,module,exports){
module.exports = function removeElement(node) {
  if(!node) return
  if(!node.parentNode) return
  node.parentNode.removeChild(node)
}

},{}],10:[function(require,module,exports){
var drags = require('../state')
var elementAt = require('../util/element-at')
var sanityCheck = require('./sanity-check')
var elements = drags.elements

module.exports = function onMove(event) {
  var touch, drag, target, i, j, over, dragstart, detail, dragEvent
  for (i = 0; i < event.changedTouches.length; i++) {
    touch = event.changedTouches[i]
    drag = drags[touch.identifier]
    target = elementAt(touch)

    detail = {
      detail: touch.identifier,
      bubbles: true
    }

    if (!drag) continue

    if (drag.state === 'started'){
      sanityCheck(event.touches)
      dragstart = new CustomEvent('dragstart', detail)
      drag.source.dispatchEvent(dragstart)
      drag.state = 'dragging'
    }

    if (drag.state !== 'dragging') continue

    dragEvent = new CustomEvent('drag', {detail: touch.identifier})
    dragEvent.clientX = touch.clientX
    dragEvent.clientY = touch.clientY

    for (j = 0; j < elements.length; j++) {
      elements[j].dispatchEvent(dragEvent)
    }

    if (!target) continue

    if (target !== drag.target) {
      if (drag.target) {
        drag.target.dispatchEvent(new CustomEvent('dragleave', detail))
      }
      target.dispatchEvent(new CustomEvent('dragenter', detail))
      drag.target = target
    }

    over = new CustomEvent('dragover', detail)
    over.dataTransfer = {}
    target.dispatchEvent(over)
  }
}

},{"../state":5,"../util/element-at":7,"./sanity-check":13}],11:[function(require,module,exports){
var drags = require('../state')

module.exports = function onEnd(event) {
  var touch, drag, i, drop, dragend, detail
  for (i = 0; i < event.changedTouches.length; i++) {
    touch = event.changedTouches[i]
    drag = drags[touch.identifier]
    delete drags[touch.identifier]

    detail = {detail: touch.identifier, bubbles: true}

    if (!(drag && drag.state === 'dragging')) continue
    drag.state = 'dropped'

    if (drag.target) {
      drop = new CustomEvent('drop', detail)
      drag.target.dispatchEvent(drop)
    }
    dragend = new CustomEvent('dragend', detail)
    drag.source.dispatchEvent(dragend)
  }
}

},{"../state":5}],12:[function(require,module,exports){
var observeElement = require('../util/observe-element')
var remove = require('../util/remove')
var defer = require('../util/defer')

var drags = require('../state')
var api = require('../api')

var onEnd = require('./end-drop')
var onMove= require('./drag-enter-over-leave')
var virtual = defer()

window.addEventListener('dragstart', function native(e) {
  window.removeEventListener('dragstart', native)
  virtual.reject(new Error('Browser supports drag and drop'))
})

/*
 * Drag-and-Drop is basically undetectable.
 * Polyfill as soon as touch events happen.
 */
window.addEventListener('touchstart', function polyfill(event){
  event.preventDefault()
  window.removeEventListener('touchstart', polyfill)
  window.addEventListener('touchend', onEnd)
  window.addEventListener('touchcancel', onEnd)
  window.addEventListener('touchmove', onMove)

  'dragleave dragenter dragover drag drop'.split(' ').forEach(function(ev) {
    virtual[ev] = observeElement
  })

  virtual.dragstart = function(element, attach) {
    attach('touchstart', function(event) {
      event.preventDefault()
      var touch, drag, i
      for (i = 0; i < event.changedTouches.length; i++) {
        touch = event.changedTouches[i]
        drag = drags.dragging[touch.identifier]
        if (drag) remove(drag.image)

        drags[touch.identifier] = {
          state: 'started',
          source: event.target
        }
      }
    })
  }
  virtual.resolve(event)
})
module.exports = virtual

},{"../api":3,"../state":5,"../util/defer":6,"../util/observe-element":8,"../util/remove":9,"./drag-enter-over-leave":10,"./end-drop":11}],13:[function(require,module,exports){
var toArray = Array.call.bind(Array.prototype.slice)
var remove = require('../util/remove')
var drags = require('../state')
var api = require('../api')
/*
 * onEnd will not always fire when multitouching,
 * therefore we have to check whether a touch event that no longer exist
 * ended or not, and remove the drag image if it has.
 */
module.exports = function sanityCheck(touches){
  var touchIds = toArray(touches).map(function(touch) {
    return touch.identifier
  })
  for (i = 0; i < drags.length; i++) {
    if (!drags[i] || touchIds.indexOf(i) >= 0) continue
    remove(api.dragging[i].image)
    delete drags[i]
  }
}

},{"../api":3,"../state":5,"../util/remove":9}]},{},[4]);