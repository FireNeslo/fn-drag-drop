module.exports = function removeElement(node) {
  if(!node) return
  if(!node.parentNode) return
  node.parentNode.removeChild(node)
}
