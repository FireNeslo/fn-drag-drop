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
