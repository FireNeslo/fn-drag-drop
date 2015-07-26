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
