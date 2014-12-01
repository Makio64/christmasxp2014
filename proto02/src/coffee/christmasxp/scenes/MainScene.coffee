class MainScene extends Scene

	constructor:()->

		@mouse = new THREE.Vector2(window.innerWidth/2,window.innerHeight/2)
		@time = 0
		@useMap = true
		@shading = THREE.FlatShading
		@opacity = 1

		@container = new THREE.Object3D();
		# @container.position.y -= 10;
		Stage3d.add(@container)

		@createLight()

		@map = THREE.ImageUtils.loadTexture("./3d/textures/preview01.jpg")
		@envMap = THREE.ImageUtils.loadTextureCube(["./3d/textures/preview01.jpg","./3d/textures/preview01.jpg"
			,"./3d/textures/preview01.jpg","./3d/textures/preview01.jpg"
			,"./3d/textures/preview01.jpg","./3d/textures/preview01.jpg"])

		loader = new THREE.JSONLoader()
		loader.load( './3d/json/crystal.js', @onDiamondLoad )

		loader = new THREE.JSONLoader()
		loader.load( './3d/json/mirror.js', @onMirrorLoad )

		@createBackground()
		@createGUI()
		@addEvent()
		Stage3d.initPostprocessing(@gui)

		return

	createBackground:()=>
		material = new THREE.MeshLambertMaterial({ wireframe:false,color:0xFFFFFF})

		geometry =  new THREE.PlaneBufferGeometry(1000, 1000, 16, 16)
		for i in [1...geometry.attributes.position.array.length] by 3
			geometry.attributes.position.array[i+1] += 60*Math.random()
		geometry.attributes.position.needsUpdate = true
		geometry.attributes.normal.needsUpdate = true
		geometry.computeTangents();
		geometry.computeVertexNormals()

		# console.log geometry
		mesh = new THREE.Mesh(geometry, material)
		mesh.position.z = -1000
		# Stage3d.add(mesh)

		return

	createLight:()=>
		@ambientLight = new THREE.AmbientLight(0xAAAAAA)
		Stage3d.add(@ambientLight)
		
		@cameraLight = new THREE.PointLight(0x443355, .3, 200)
		@cameraLight.position.set( 30, 60, 60 );
		Stage3d.add(@cameraLight)

		@cameraLight2 = new THREE.PointLight(0x443355, .2, 200)
		@cameraLight2.position.set( 30, 60, 60 );
		Stage3d.add(@cameraLight2)

		return

	addEvent:()=>
		window.addEventListener('mousemove',(e)=>
			@mouse.x = e.clientX
			@mouse.y = e.clientY
		,false)
		return

	onDiamondLoad:(geometry)=>
		@computeGeometry(geometry)

		material = new THREE.MeshLambertMaterial({color: 0xffffff, transparent:true, envMap:@envMap})
		
		if @useMap then material.map = @map

		material.shading = @shading
		material.opacity = .85
		material.side = THREE.DoubleSide
		material.combine = THREE.MixOperation

		@diamond = new THREE.Mesh(geometry,material)
		@container.add(@diamond)

		folder = @gui.addFolder('diamond')
		folder.add(@diamond.material, 'opacity', 0, 1)
		folder.add(@diamond.material, 'reflectivity',0,1)
		# folder.add(@diamond.material, 'refractionRatio',0,1)
		@diamondColor = 0xffffff
		folder.add(@diamond.material, 'combine', {multiply:THREE.Multiply,mix:THREE.MixOperation,add:THREE.AddOperation})
		folder.addColor(@, 'diamondColor').onChange(()=>
			console.log(@diamond.material)
			@diamond.material.color.setHex(@diamondColor)
		)
		# @diamondUseDiffuse = false
		# folder.add(@, 'diamondUseDiffuse').onChange((e)=>
		# 	if @diamondUseDiffuse then @diamond.material.map = @map
		# 	else @diamond.material.map = null
		# 	@diamond.material.needsUpdate = true
		# )


		return

	onMirrorLoad:(geometry)=>
		@computeGeometry(geometry)
		material = new THREE.MeshLambertMaterial({color: 0xffffff, transparent:true, envMap:@envMap})
		if @useMap then material.map = @map
		material.shading = @shading
		# material.side = THREE.DoubleSide
		material.combine = THREE.AddOperation
		material.reflectivity = .41
		material.opacity = 0.9
		console.log(material)
		# material.depthWrite = false
		# material.depthTest = false

		if(@mirror)
			@container.remove(@mirror)
		@mirror = new THREE.Mesh(geometry,material)
		@container.add(@mirror)

		folder = @gui.addFolder('mirror')
		folder.add(@mirror.material, 'opacity', 0, 1)
		folder.add(@mirror.material, 'reflectivity',0,1)

		@mirrorColor = 0xffffff
		folder.add(@mirror.material, 'combine', {multiply:THREE.Multiply,mix:THREE.MixOperation,add:THREE.AddOperation})
		folder.addColor(@, 'mirrorColor').onChange(()=>
			@mirror.material.color.setHex(@mirrorColor)
		)
		# folder.add(@, 'useMap').onChange((e)=>
		# 	if @useMap then @material.map = @map
		# 	else @material.map = null
		# 	@material.needsUpdate = true
		# )
		return

	createGUI:()=>
		@gui = new dat.GUI()
		@textures = null

		@maps = [
			THREE.ImageUtils.loadTexture("./3d/textures/preview01.jpg")
			THREE.ImageUtils.loadTexture("./3d/textures/crystal.jpg")
			THREE.ImageUtils.loadTexture("./3d/textures/mario.png")
		]
		@envMaps = [
			THREE.ImageUtils.loadTextureCube(["./3d/textures/preview01.jpg","./3d/textures/preview01.jpg","./3d/textures/preview01.jpg","./3d/textures/preview01.jpg","./3d/textures/preview01.jpg","./3d/textures/preview01.jpg"]),
			THREE.ImageUtils.loadTextureCube(["./3d/textures/crystal.jpg","./3d/textures/crystal.jpg","./3d/textures/crystal.jpg","./3d/textures/crystal.jpg","./3d/textures/crystal.jpg","./3d/textures/crystal.jpg"]),
			THREE.ImageUtils.loadTextureCube(["./3d/textures/mario.png","./3d/textures/mario.png","./3d/textures/mario.png","./3d/textures/mario.png","./3d/textures/mario.png","./3d/textures/mario.png"])
		]
		@gui.add(@,'textures',{xp1:'0',xp2:'1',xp3:'2'}).onChange((e)=>
			@mirror.material.map = @maps[@textures]
			@mirror.material.envMaps = @envMaps[@textures]
			@diamond.material.envMap = @envMaps[@textures]
			@diamond.material.needsUpdate = true
			console.log(@diamond.material)
			return
		)
		return

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
		# @container.rotation.y += 0.005
		@cameraLight.position.x = Math.cos(@time*0.001)*100
		@cameraLight2.position.x = Math.cos(@time*0.0015)*120
		@cameraLight2.position.y = Math.sin(@time*0.0015)*120
		@container.rotation.y += (@mouse.x/window.innerWidth-.5 - @container.rotation.y)*.09
		@container.rotation.x += (@mouse.y/window.innerWidth-.5 - @container.rotation.x)*.09
		return
