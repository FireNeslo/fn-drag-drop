fn-drag-drop-polyfill
===
#### also check out
* [The jQuery wrapper](jquery.md)
* [The AngularJS wrapper](angular.md)
* [The delegatable API (experimental)](delegate.md)
* [fnDragDrop](../README.md)

Polyfill for html5 drag and drop

## Install
### npm
```bash
$ npm install FireNeslo/fn-drag-drop --save
```
```js
var fnDragDrop = require('fn-drag-drop/lib/polyfill')
```
### bower
```bash
$ bower install FireNeslo/fn-drag-drop --save
```
```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/fn-drag-drop/dist/fn-drag-drop-polyfill.js"></script>
```
## Usage
```js
var dragging;

document.getElementById('source')
  .addEventListener('dragstart', function() {
    dragging = document.getElementById('input').value
  })

document.getElementById('target')
  .addEventListener('drop', function() {
    var item = document.createElement('li')
    item.textContent = dragging
    this.appendChild(item)
  })
```
```html
<section>
  <input id="input" />
  <button id="source" draggable="true">Drag me</button>
  <ol id="target"></ol>
</section>
```
## demo
  [check it out live](http://fireneslo.github.io/fn-drag-drop/demo/polyfill)


## Test
```bash
$ npm install -g mocha
$ npm test
```
##API
See [fnDragDrop](../README.md)
