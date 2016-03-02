var addEvent = require('../add-event')

var events = [
  'mousemove',
  'touchmove'
]

function on(node, listeners, selector) {
  if(node.$fnDragDrop) return
  node.$fnDragDrop = true
  listeners.forEach(function(listener) {
    if(listener[0] === 'dragstart') node.draggable = true
    addEvent(node, listener[0], listener[1])
  })
}

function off(node, listeners, selector) {
  listeners.forEach(function(listener) {
    node.removeEventListener(listener[0], listener[1])
  })
}

function DragAndDelegate(selector, parent) {
  this.parent = parent
  this.selector = selector
  var listeners = this.listeners = []
  this.observer = new MutationObserver(function(changes) {
    changes.forEach(function(change) {
      var nodes = parent.querySelectorAll(selector)
      for(var i = nodes.length - 1; i >= 0; i--) {
        on(nodes[i], listeners, selector)
      }
      nodes = change.removedNodes
      for(var i = nodes.length - 1; i >= 0; i--) {
        if(!(nodes[i].matches && nodes[i].matches(selector))) continue
        off(nodes[i], listeners, selector)
        delete nodes[i].$fnDragDrop
      }
    })
  })
  this.observer.observe(parent, {childList: true, subtree: true})
}

DragAndDelegate.prototype.on = function(event, callback) {
  this.listeners.push([event, callback])
  var nodes = this.parent.querySelectorAll(this.selector)
  for(var i = 0; i < nodes.length; i++) {
    if(event === 'dragstart') nodes[i].draggable = true
    addEvent(nodes[i], event, callback)
  }
  return this
}

module.exports = DragAndDelegate

