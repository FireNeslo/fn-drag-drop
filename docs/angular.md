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
    <li ng-repeat="data in dropped">{{data}}</li>
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


## &lt;any fn-drag="dragging" /&gt;
attach data to drag

## &lt;any fn-drop="drop($data)" /&gt;
call when a element is dropped on the target
* **any** *data* - what was dragged
