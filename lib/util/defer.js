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
