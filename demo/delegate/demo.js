var dragging = {}

// basic sortable and droppable elements
// dragAndDrop(Element | Nodelist | Array | jQWrapper)
fnDragDrop('.item')
  .drop(function (e) {
    console.log('drop, item')
    if(this.parentNode.contains(dragging[e.detail])) {
      this.parentNode.removeChild(dragging[e.detail])
    }
    this.parentNode.insertBefore(dragging[e.detail], this)
  })
  .on('dragstart', function (e) {
    console.log('dragstart, item')
    dragging[e.detail] = this; // always bound dragged element
  })

var level = 0

fnDragDrop('#source, #target')
  .drop(function(e) {
    console.log('drop, container')
    this.appendChild(dragging[e.detail]) // add it to list
  })
  .on('dragenter', function() {
    console.log('dragenter, container')
    level +=1 ; this.classList.add('fn-over')
  })
  .on('dragleave', function() {
    console.log('dragleave, container')
    if(!(level -= 1)) this.classList.remove('fn-over')
  })
  .on('dragend', function(argument) {
    console.log('dragend, container')
    level = 0; this.classList.remove('fn-over')
  })

var count = 0
function addItem() {
  var item = document.createElement('li')
  var button = document.createElement('button')
  item.className = 'item'
  button.textContent = "Dynamic box #" + count
  item.appendChild(button)
  document.getElementById('source').appendChild(item)
  if(count++ < 10)setTimeout(addItem, Math.random() * 1000 | 0)
}

addItem()

