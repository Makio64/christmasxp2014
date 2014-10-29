class MainScene extends Scene

	constructor:()->

		@time = 0
		@useMap = true
		@shading = THREE.FlatShading
		@opacity = 1

		@container = new THREE.Object3D();
		@container.position.y -= 10;
		Stage3d.add(@container)

		@ambientLight = new THREE.AmbientLight(0x222222)
		Stage3d.add(@ambientLight)
		@cameraLight = new THREE.PointLight(0xffffff, 1, 400)
		@cameraLight.position.set( 30, 50, 50 );
		Stage3d.add(@cameraLight)

		loader = new THREE.JSONLoader()
		loader.load( './3d/json/crystal.js', @onDiamondLoad )
		@map = THREE.ImageUtils.loadTexture("./3d/textures/preview01.jpg")

		return

	onDiamondLoad:(geometry)=>
		@diamondGeometry = geometry
		@generateDiamond()

		gui = new dat.GUI()
		gui.add(@, 'opacity', 0, 1)
		gui.add(@, 'useMap').onChange((e)=>
			if @useMap then @material.map = @map
			else @material.map = null
			@material.needsUpdate = true
		)
		gui.add(@, 'shading', {smooth:THREE.SmoothShading,flat:THREE.FlatShading,none:THREE.NoShading}).onChange((e)=>
			@generateDiamond()
		)
		return

	generateDiamond:()=>
		geometry = @diamondGeometry.clone()
		@computeGeometry(geometry)
		@material = new THREE.MeshLambertMaterial({color: 0xffffff, transparent:true, opacity:@opacity})
		if @useMap then @material.map = @map
		@material.shading = @shading
		@material.side = THREE.DoubleSide

		if(@diamond)
			@container.remove(@diamond)
		@diamond = new THREE.Mesh(geometry,@material)
		@container.add(@diamond)


	computeGeometry:(geometry)->
		# compute the model
		geometry.computeBoundingSphere()
		geometry.computeFaceNormals()
		geometry.computeVertexNormals()
		geometry.computeTangents()
		geometry.computeMorphNormals()
		geometry.verticesNeedUpdate = true
		geometry.normalsNeedUpdate = true
		return

	update:(dt)->
		@time += dt
		@container.rotation.y += 0.005
		
		return