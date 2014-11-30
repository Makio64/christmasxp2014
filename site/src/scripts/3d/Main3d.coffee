Stage3d = require "3d/Stage3d"
Scene3d = require "3d/Scene3d"

class Main3d

	dt 				: 0
	lastTime 		: 0
	pause 			: false
	scene 			: null

	constructor:()->
		@pause = false
		@lastTime = Date.now()

		window.onblur = (e)=>
			@pause = true
			cancelAnimationFrame(@update)
			return

		window.onfocus = ()=>
			requestAnimationFrame(@update)
			@lastTime = Date.now()
			@pause = false
			return

		window.onresize = ()=>
			@resize()
			return

		Stage3d.init({transparent:false,antialias:false, background:0xFFFFFF})
		
		@scene = new Scene3d()
		
		requestAnimationFrame( @update )
		return

	update:()=>
		t = Date.now()
		dt = t - @lastTime
		@lastTime = t

		if @pause then return

		# update logic here
		@scene.update(dt)
		Stage3d.render()

		requestAnimationFrame( @update )
		return

	resize:()=>
		width 	= window.innerWidth
		height 	= window.innerHeight
		@scene.resize()
		Stage3d.resize()
		return


module.exports = Main3d