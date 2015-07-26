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
