fn-drag-drop-angular
===
#### also check out
* [The jQuery wrapper](jquery.md)
* [The AngularJS wrapper](angular.md)
* [The polyfill (experimental)](polyfill.md)
* [fnDragDrop](../README.md)

Delegatable API for fnDragDrop

## Install
### npm
```bash
$ npm install FireNeslo/fn-drag-drop --save
```
```js
var fnDragDrop = require('fn-drag-drop')
```
### bower
```bash
$ bower install FireNeslo/fn-drag-drop --save
```
```html
<script src="bower_components/fn-drag-drop/dist/fn-drag-drop.js"></script>
```
## Usage
```js
var dragging;

fnDragDrop('#source')
  .on('dragstart', function dragStart() {
    console.log('is now dragging ', dragging =  this)
  })

fnDragDrop('#target')
  .drop(function dragStart() {
    console.log('you just dropped ', dragging)
  })
```

## demo
  [check it out live](http://fireneslo.github.io/fn-drag-drop/demo/delegate)

## Test
```bash
$ npm install -g mocha
$ npm test
```
##API
See [fnDragDrop](../README.md)

