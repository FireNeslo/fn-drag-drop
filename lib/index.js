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
api.DragAndDelegate = DragAndDelegate
api.dragging = dragging

module.exports = api
