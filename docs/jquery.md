fn-drag-drop-angular
===

jQuery wrapper for fnDragDrop

## Install
### npm
```bash
$ npm install FireNeslo/fn-drag-drop --save
```
```js
var fnDragDrop = require('fn-drag-drop/lib/jquery')
```
### bower
```bash
$ bower install FireNeslo/fn-drag-drop --save
```
```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/fn-drag-drop/dist/fn-drag-drop-jquery.js"></script>
```
## Usage
```js
var dragging;
$('#source').fnDrag(function() {
  dragging = $('#input').value()
})
$('#target')
  .fnEnter(function() {
    $(this).css('border', 'thin solid blue')
  })
  .fnLeave(function() {
    $(this).css('border', 'thin solid blue')
  })
  .fnDrop(function() {
    $(this).append($('<li>'+dragging+'</li>'))
  })
```
```html
<section>
  <input id="input" />
  <button id="source">Drag me</button>
  <ol id="target"></ol>
</section>
```
## demo
  [check it out live](http://fireneslo.github.io/fn-drag-drop/demo/jquery)

## Test
```bash
$ npm install -g mocha
$ npm test
```
##API
See [fnDragDrop](../README.md)

#### also check out the docs for
* [The AngularJS wrapper](angular.md)
* [The polyfill (experimental)](polyfill.md)
