// check to see if node data exists
function checkNodeData(data) {
  if (data.edges[0].node.data === 'none') {
    return false
  } else {
    return true
  }
}

export default checkNodeData