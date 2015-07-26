fn-drag-drop-angular
===

AngularJS for fnDragDrop

## Install
### npm
```bash
$ npm install FireNeslo/fn-drag-drop --save
```
```js
var fnDragDrop = require('fn-drag-drop/lib/angular')
```
### bower
```bash
$ bower install FireNeslo/fn-drag-drop --save
```
```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/fn-drag-drop/dist/fn-drag-drop-angular.js"></script>
```
## Usage
```js
angular.module('application', ['fnDragDrop'])
  .controller('DemoController', function($scope) {
    $scope.dropped = []
    $scope.drop = function(data) {
      $scope.dropped.push(data)
    }
  })
```
```html
<section ng-controller="DemoController" ng-app="application">
  <input ng-model="text" />
  <button fn-drag="text">Drag me</button>
  <ol fn-drop="dropped($data)">
    <li ng-repeat="data in dropped"></li>
  </ol>
</section>
```
## Test
```bash
$ npm install -g mocha
$ npm test
```
##API

#### also check out the docs for
* [The jQuery wrapper](docs/jquery.md)
* [The polyfill (experimental)](docs/polyfill.md)
* [fnDragDrop](readme.md)


## fnDragDrop(target) -> dragDrop
Add listeners for dragging or dropping.

* **EventTarget | ArrayLike&lt;EventTarget&gt;** *target* - element(s) to drag/drop

```js
// With a regular HTMLElement
fnDragDrop(document.getElementById('source'))
// With a regular NodeList
fnDragDrop(document.querySelectorAll('.item'))
// With an array of things with addEventListener method
fnDragDrop([window, document])
// With a jquery wrapper
fnDragDrop($('#target'))
```