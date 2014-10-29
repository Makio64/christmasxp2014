# 
# Stage3d for three.js with every basics you need
# @author David Ronai / Makiopolis.com / @Makio64 
# 
class Stage3d

	@camera = null
	@cameraTarget = null
	@scene = null
	@renderer = null

	@init = (options)->
		w = window.innerWidth
		h = window.innerHeight

		@camera = new THREE.PerspectiveCamera( 45, w / h, 1, 10000 )
		@camera.position.set(0,20,100)

		@scene = new THREE.Scene()

		transparent = options.transparent||false
		antialias = options.antialias||false

		@renderer = new THREE.WebGLRenderer({alpha:transparent,antialias:antialias})
		@renderer.setSize( w, h )

		document.body.appendChild(@renderer.domElement)
		return

	@add = (obj)->
		@scene.add(obj)
		return

	@remove = (obj)->
		@scene.remove(obj)
		return

	@render = ()->
		@camera.lookAt(new THREE.Vector3(0,@camera.position.y-20,0))
		Stage3d.renderer.render(@scene, @camera)
		return

	@resize = ()->
		if @renderer
			@camera.aspect = window.innerWidth / window.innerHeight
			@camera.updateProjectionMatrix()
			@renderer.setSize( window.innerWidth, window.innerHeight )
		return