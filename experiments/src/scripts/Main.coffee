scene = new ( require "Scene" ) document.getElementById "scene"

domGlobeLayer = document.querySelector ".globe-layer"

lx = 0
ly = 0
mx = 0
my = 0

onMouseDown = ( e ) ->
    e.preventDefault()
    addMouseListeners()
    lx = e.clientX
    ly = e.clientY

onMouseMove = ( e ) ->
    e.preventDefault()
    mx = e.clientX - lx
    my = e.clientY - ly
    lx = e.clientX
    ly = e.clientY

    scene.rotate mx, my

onMouseUp = ( e ) ->
    e.preventDefault()
    removeMouseListeners()

addMouseListeners = ->
    document.addEventListener "mousemove", onMouseMove, false
    document.addEventListener "mouseup", onMouseUp, false

removeMouseListeners = ->
    document.removeEventListener "mousemove", onMouseMove, false
    document.removeEventListener "mouseup", onMouseUp, false

domGlobeLayer.addEventListener "mousedown", onMouseDown, false

update = ->
    scene.update()
    requestAnimationFrame update

update()
    
