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
