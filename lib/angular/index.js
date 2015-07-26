var DragAndDrop = require('../api')

function fnDragDrop($q) {
  return DragAndDrop.defer.Promise = $q, DragAndDrop
}

angular.module('fnSimpleDragDrop', [])
  .factory('fnDragDrop', ['$q', fnDragDrop])
  .directive('fnDrag', ['$rootScope', 'fnDragDrop', require('./drag')])
  .directive('fnDragOver', ['fnDragDrop', require('./over')])
  .directive('fnDrop', ['$rootScope', 'fnDragDrop', require('./drop')])

module.exports = 'fnDragDrop'
