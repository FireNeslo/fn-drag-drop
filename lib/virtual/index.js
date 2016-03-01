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
