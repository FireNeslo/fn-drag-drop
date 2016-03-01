(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./virtual":16}],2:[function(require,module,exports){
module.exports = function fnDrag($rootScope, fnDragDrop) {
  return {
    link: function (scope, elements, attrs) {
      elements.attr('draggable', true)
      fnDragDrop(elements[0])
        .on('dragstart', function dragStart(e) {
          var dragging = fnDragDrop.dragging[e.detail] = {
            element: elements[0],
            data: scope.$eval(attrs.fnDrag),
            source: scope.$eval(attrs.fnSource)
          }

          if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
          $rootScope.$emit('fn-dragstart', dragging, e)
          if(e instanceof MouseEvent) return
          if (!dragging.image) dragging.image = dragging.element.cloneNode(true)
          dragging.image.style.position = 'fixed'
          dragging.image.classList.add('fn-dragging-image')
          dragging.image.style.left = 0
          dragging.image.style.top = 0
          delete dragging.image.id
          document.body.appendChild(dragging.image)
        })
        .on('dragend', function dragEnd(e) {
          var dragging = fnDragDrop.dragging[e.detail]
          $rootScope.$emit('fn-dragend', dragging, e)
          if(e instanceof MouseEvent) return
          document.body.removeChild(dragging.image)
        })
        .on('drag', function drag(e) {
          var dragging = fnDragDrop.dragging[e.detail]
          $rootScope.$emit('fn-drag', dragging, e)
          if(e instanceof MouseEvent) return
          dragging.image.style.transform =
            'translate(' + e.clientX + 'px, ' + e.clientY + 'px)'
        })
    }
  }
}

},{}],3:[function(require,module,exports){
module.exports = function($rootScope, fnDragDrop) {
  var over = null
  $rootScope.$on("fn-dragstart", function (event, data) {
    angular.element(data.element).addClass("fn-dragging")
  })

  $rootScope.$on("fn-dragend", function (event, data) {
    angular.element(data.element).removeClass("fn-dragging")
  })
  return {
    restrict: 'A',
    link: function (scope, el, attrs, controller) {
      var id = 0
      fnDragDrop(el[0])
        .on("dragover", function (e) {
          e.stopPropagation()
          e.preventDefault()
          e.dataTransfer.dropEffect = 'move'
        })
        .on("dragenter", function (e) {
          id++
          e.stopPropagation()
          e.preventDefault()
          el.addClass('fn-over')
        })
        .on("dragleave", function (e) {
          id--
          e.stopPropagation()
          e.preventDefault()
          if (id === 0) {
            el.removeClass('fn-over')
          }
        })
        .on("drop", function (e) {
          id = 0
          e.preventDefault()
          e.stopPropagation()
          el.removeClass('fn-over')
          scope.$applyAsync(function () {
            var data = fnDragDrop.dragging[e.detail]
            scope.$eval(attrs.fnDrop, {
              $over: data.over,
              $data: data.data,
              $source: data.source,
              $target: scope.$eval(attrs.fnTarget)
            })
          })
        })
    }
  }
}

},{}],4:[function(require,module,exports){
var DragAndDrop = require('../index')

function fnDragDrop($q) {
  return DragAndDrop.defer.Promise = $q, DragAndDrop
}

angular.module('fnDragDrop', [])
  .factory('fnDragDrop', ['$q', fnDragDrop])
  .directive('fnDrag', ['$rootScope', 'fnDragDrop', require('./drag')])
  .directive('fnDragOver', ['fnDragDrop', require('./over')])
  .directive('fnDrop', ['$rootScope', 'fnDragDrop', require('./drop')])

module.exports = 'fnDragDrop'

},{"../index":7,"./drag":2,"./drop":3,"./over":5}],5:[function(require,module,exports){
module.exports = function (fnDragDrop) {
  'use strict'
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      fnDragDrop(el[0])
        .on("dragover", function onDragOver(e) {
          fnDragDrop.dragging[e.detail].over = scope.$eval(attrs.fnDragOver)
        })
    }
  }
}

},{}],6:[function(require,module,exports){
module.exports = function DragAndDelegate(selector, parent) {
  
}

},{}],7:[function(require,module,exports){
var DragAndDrop = module.exports = require('./vanilla')
var DragAndDelegate = require('./delegated')
var dragging = require('./state').dragging
var addEvent = require('./add-event')

function api(element, parent) {
  if('object' === typeof element) {
    return new DragAndDrop(element)
  } else {
    return new DragAndDelegate(element, parent || document)
  }
}

api.defer = require('./util/defer')
api.elementAt = require('./util/element-at')
api.observeElement = require('./util/observe-element')
api.removeElement = require('./util/remove')
api.addEventToElement = addEvent
api.DragAndDrop = DragAndDrop
api.dragging = dragging

module.exports = api

},{"./add-event":1,"./delegated":6,"./state":8,"./util/defer":9,"./util/element-at":10,"./util/observe-element":11,"./util/remove":12,"./vanilla":13}],8:[function(require,module,exports){
module.exports = []
module.exports.elements = []
module.exports.dragging = []

},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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

},{"../state":8}],11:[function(require,module,exports){
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

},{"../state":8}],12:[function(require,module,exports){
module.exports = function removeElement(node) {
  if(!node) return
  if(!node.parentNode) return
  node.parentNode.removeChild(node)
}

},{}],13:[function(require,module,exports){
var addEvent = require('./add-event')
var toArray = Array.call.bind(Array.prototype.slice)

function array(value) {
  if(Array.isArray(value)) return value
  if('length' in value) return toArray(value)
  return [value]
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

module.exports = DragAndDrop

},{"./add-event":1}],14:[function(require,module,exports){
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

},{"../state":8,"../util/element-at":10,"./sanity-check":17}],15:[function(require,module,exports){
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

},{"../state":8}],16:[function(require,module,exports){
var observeElement = require('../util/observe-element')
var remove = require('../util/remove')
var defer = require('../util/defer')

var drags = require('../state')
var api = require('../index')

var onEnd = require('./end-drop')
var onMove= require('./drag-enter-over-leave')
var virtual = defer()

var errorThrown = null

window.addEventListener('dragstart', function native(e) {
  window.removeEventListener('dragstart', native)
  errorThrown = errorThrown ||
    console.info('Browser supports drag and drop') && true
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

},{"../index":7,"../state":8,"../util/defer":9,"../util/observe-element":11,"../util/remove":12,"./drag-enter-over-leave":14,"./end-drop":15}],17:[function(require,module,exports){
var toArray = Array.call.bind(Array.prototype.slice)
var remove = require('../util/remove')
var drags = require('../state')
var api = require('../index')
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

},{"../index":7,"../state":8,"../util/remove":12}]},{},[4]);
