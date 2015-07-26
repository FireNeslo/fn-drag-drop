var dragging = {}
var level = 0

var items = document.querySelectorAll('.item')
var lists = document.querySelectorAll('#source, #target')

function inihibit(e, cb) {
  e.stopPropagation()
  e.preventDefault()
}
function effect(e) {
  inihibit(e, e.dataTransfer.dropEffect = 'move')
}

function dropOnItem(e) {
  inihibit(e)
  if(this.parentNode.contains(dragging[e.detail])) {
    this.parentNode.removeChild(dragging[e.detail])
  }
  this.parentNode.insertBefore(dragging[e.detail], this)
}

function dragOnItem(e) {
  dragging[e.detail] = this; // always bound dragged element
}

function dropOnList(e) {
  inihibit(e)
  this.appendChild(dragging[e.detail]) // add it to list
}

function enterList() {
  level +=1 ; this.classList.add('fn-over')
}

function leaveList() {
  if(!(level -= 1)) this.classList.remove('fn-over')
}

function end(argument) {
  level = 0; this.classList.remove('fn-over')
}

for (var i = 0; i < items.length; i++) {
  items[i].setAttribute('draggable', true)
  items[i].addEventListener('drop', dropOnItem)
  items[i].addEventListener('dragstart', dragOnItem)
  items[i].addEventListener('dragenter', inihibit)
  items[i].addEventListener('dragleave', inihibit)
  items[i].addEventListener('dragover', effect)
}

for (var i = 0; i < lists.length; i++) {
  items[i].setAttribute('dropzone', true)
  lists[i].addEventListener('drop', dropOnList)
  lists[i].addEventListener('dragenter', enterList)
  lists[i].addEventListener('dragleave', leaveList)
  lists[i].addEventListener('dragover', effect)
  lists[i].addEventListener('dragend', end)
}
