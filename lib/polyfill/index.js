var virtual  = require('../virtual')
var addEvent = EventTarget.prototype.addEventListener

EventTarget.prototype.addEventListener = function(event, callback) {
  var element = this
  var attach = addEvent.bind(element);
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
    .catch(function(error) {
      EventTarget.prototype.addEventListener = addEvent
    })
  return attach.apply(element, arguments)
}
