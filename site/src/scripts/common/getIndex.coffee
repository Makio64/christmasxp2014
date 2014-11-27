module.exports = ( node ) ->
    i = 1
    while node = node.previousElementSibling
        if node.nodeType == 1
            i++
    i
