var dragging = {}
// basic sortable and droppable elements
// dragAndDrop(Element | Nodelist | Array | jQWrapper)
$('.item')
  .fnDrop(function (e) {
    $(this).before(dragging[e.detail])
  })
  .fnDrag(function (e) {
    dragging[e.detail] = $(this); // always bound dragged element
  })

var level = 0

$('#target, #source')
  .fnDrop(function(e) {
    $(this).append(dragging[e.detail]) // add it to list
  })
  .fnEnter(function() {
    level +=1 ; $(this).addClass('fn-over')
  })
  .fnLeave(function() {
    if(!(level -= 1)) $(this).removeClass('fn-over')
  })
  .fnEnd(function() {
    level = 0; $(this).removeClass('fn-over')
  })
