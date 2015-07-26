var dragging = {}

// basic sortable and droppable elements
// dragAndDrop(Element | Nodelist | Array | jQWrapper)
fnDragDrop(document.querySelectorAll('.item'))
  .drop(function (e) {
    if(this.parentNode.contains(dragging[e.detail])) {
      this.parentNode.removeChild(dragging[e.detail])
    }
    this.parentNode.insertBefore(dragging[e.detail], this)
  })
  .drag(function (e) {
    dragging[e.detail] = this; // always bound dragged element
  })

var level = 0

fnDragDrop(document.querySelectorAll('#source, #target'))
  .drop(function(e) {
    this.appendChild(dragging[e.detail]) // add it to list
  })
  .enter(function() {
    level +=1 ; this.classList.add('fn-over')
  })
  .leave(function() {
    if(!(level -= 1)) this.classList.remove('fn-over')
  })
  .end(function(argument) {
    level = 0; this.classList.remove('fn-over')
  })
