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
