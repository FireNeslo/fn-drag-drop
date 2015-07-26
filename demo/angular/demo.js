angular.module('fnDragDropDemo', ['fnSimpleDragDrop'])
  .directive('body', function() {
    return { controller: 'FnDragDropDemo' }
  })
  .controller('FnDragDropDemo', function FnDragDropDemo($scope) {
    $scope.source = ["a", "very", "simple", "demo"]
    $scope.target = []

    function remove(list, index) {
      if(index > -1) list.splice(index, 1)
    }

    $scope.drop = function drop(item, source, target, index) {
      remove(target, target.indexOf(item))
      remove(source, source.indexOf(item))
      source.splice(index || target.length, 0, item)
    }
  })
