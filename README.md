fn-drag-drop
===

Wrapper for html5 drag and drop with a nice api and with
the added feature of working on mobile.

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

fnDragDrop(source)
  .drag(function dragStart() {
    console.log('is now dragging ', dragging =  this)
  })

fnDragDrop(target)
  .drop(function dragStart() {
    console.log('you just dropped ', dragging)
  })

```
## demo
  [check it out live](http://fireneslo.github.io/fn-drag-drop/demo/)
## Test
```bash
$ npm install -g mocha
$ npm test
```
##API

#### also check out the docs for
* [The AngularJS wrapper](docs/angular.md)
* [The jQuery wrapper](docs/jquery.md)
* [The polyfill (experimental)](docs/polyfill.md)


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

## fnDragDrop::on(event, callback) -> dragDrop
Add event listener to target

* **string** *event* - name of event to listen for
* **function** *callback* - event handler

```js
fnDragDrop(target)
  .on('click', function() {
    console.log('just your regular click')
  })
  .on('drop', function() {
    console.log('polyfilled drop event')
  })
```

## fnDragDrop::drag(callback) -> dragDrop
Makes the target draggable
* **function** *callback* - event handler for dragstart

```js
fnDragDrop(target)
  .drag(function() {
    console.log('drag', this, '?')
  })
```

## fnDragDrop::drop(callback) -> dragDrop
Makes the target a drop target
* **function** *callback* - event handler for drop

```js
fnDragDrop(target)
  .drop(function() {
    console.log('something was dropped')
  })
```
## fnDragDrop::enter(callback) -> dragDrop
## fnDragDrop::leave(callback) -> dragDrop
Triggers wgen entering/leaving target
* **function** *callback* - event handler for enter/leave

```js
fnDragDrop(target)
  .enter(function() {
    console.log('you entered target space')
  })
  .leave(function() {
    console.log('you left target space')
  })
```

## fnDragDrop::end(callback) -> dragDrop
Triggers when dragging ends
* **function** *callback* - event handler for end

```js
fnDragDrop(target)
  .end(function() {
    console.log('no longer dragging target')
  })
```
