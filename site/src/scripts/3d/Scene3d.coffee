Stage3d = require "3d/Stage3d"

class Scene3d extends Emitter

	constructor:()->
		super

		@isOver = false
		@isReady = false
		@isImgReady = false
		@debug = true

		@currentIndex = 1

		@globalAlpha = 0
		@cameraMoveY = true
		@containerMovY = true
		@containerMovYScale = 1
		@cameraMoveYScale = 1.5
		@backgroundFix = false

		@mouse = new THREE.Vector2(0,0)
		@time = 0
		@useMap = true
		@shading = THREE.FlatShading
		@opacity = 1
		@fragments = []
		@hitboxs = []
		@maxDate = 2
		@positions = {};
		@positions.base = {
			fragments : []
			diamond : new THREE.Vector3()
			mirror : new THREE.Vector3()
		}

		@offsetX = 10

		@currentPosition = {
			fragments : []
			diamond : null
			mirror : null
		}

		@images = []

		for i in [0...24] by 1
			@currentPosition.fragments[i] = new THREE.Vector3()
		@currentPosition.diamond = new THREE.Vector3()
		@currentPosition.mirror = new THREE.Vector3()

		@container = new THREE.Object3D();
		Stage3d.add(@container,false)

		@containerFrontcamera = new THREE.Object3D();
		@container.add(@containerFrontcamera)

		@lightContainer = new THREE.Object3D();
		Stage3d.add(@lightContainer)

		@createLight()
		@createBackground()
		@createCircles()
		@createParticles()
		@addEvent()
		@loadImagesLow()
		
		return


	createCanvas:()->
		@canvas = document.createElement('canvas')
		@canvas.width = 64
		@canvas.height = 64
		@ctx = @canvas.getContext('2d')
		@map = new THREE.Texture( @canvas, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBFormat, THREE.UnsignedByteType, 1 )
		@envMap = new THREE.Texture( [@canvas,@canvas,@canvas,@canvas,@canvas,@canvas], THREE.CubeRefractionMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBFormat, THREE.UnsignedByteType, 1 )
		return

	loadImagesLow:()=>
		@atlas = new Image()
		@atlas.onload = ()=>
			@parseAtlas()
			@createCanvas()
			@loadMesh()
			@createGUI()
			@loadImagesHight()
		@atlas.src = './3d/textures/atlas_low_512.jpg'
		return

	parseAtlas:()=>
		size = @atlas.width/8
		for y in [0...8] by 1
			for x in [0...8] by 1
				k = x+y*8
				if k>=24
					@isImgReady = true
					if(@canvas)
						@canvas.width = size
						@canvas.height = size
					return

				canvas = document.createElement('canvas')
				canvas.width = size
				canvas.height = size
				ctx = canvas.getContext('2d')
				ctx.drawImage(@atlas,x*size,y*size,size,size,0,0,size,size)
				@images[k] = canvas
				# document.body.appendChild(canvas)
		return

	loadImagesHight:()=>
		@atlas = new Image()
		@atlas.onload = ()=>
			@parseAtlas()
		@atlas.src = './3d/textures/atlas_low_4096.jpg'
		return

	loadMesh:()=>

		loader = new THREE.JSONLoader()
		loader.load( './3d/json/crystal.js', @onDiamondLoad )

		loader = new THREE.JSONLoader()
		loader.load( './3d/json/mirror.js', @onMirrorLoad )
		
		loader = new THREE.SceneLoader()
		loader.load( './3d/json/fragments.js', @onFragmentLoaded )
		return

	createBackground:()=>
		material = new THREE.MeshLambertMaterial({ wireframe:false,color:0xFFFFFF})
		material.shading = THREE.FlatShading

		geometry =  new THREE.PlaneGeometry(7000, 7000, 8, 8)
		for i in [0...geometry.vertices.length] by 1
			v = geometry.vertices[i]
			v.x += (1*Math.random()-.5)*300
			v.y += (1*Math.random()-.5)*300
			v.z += (1*Math.random()-.5)*300
		geometry.computeTangents();
		geometry.computeVertexNormals()
		geometry.computeBoundingSphere()
		# geometry.computeFaceNormals()
		geometry.computeVertexNormals()
		geometry.computeTangents()
		# geometry.computeMorphNormals()
		geometry.verticesNeedUpdate = true
		geometry.normalsNeedUpdate = true
		geometry.elementsNeedUpdate = true;
		geometry.tangentsNeedUpdate = true;

		# bufferGeometry = THREE.BufferGeometry.fromGeometry(geometry)
		# bufferGeometry.attributes.positionneedsUpdate = true
		# bufferGeometry.attributes.normal.needsUpdate = true
		# bufferGeometry.normalizeNormals()
		# bufferGeometry = geometry

		@backgroundFlat = new THREE.Mesh(geometry, material)
		@backgroundFlat.position.z = -1000
		Stage3d.add(@backgroundFlat)

		material = new THREE.MeshBasicMaterial({ wireframe:true,color:0,transparent:true,opacity:.1})
		material.shading = THREE.FlatShading
		@backgroundLine = new THREE.Mesh(geometry, material)
		@backgroundLine.position.z = -950
		@backgroundLine.position.y += 10
		Stage3d.add(@backgroundLine)

		@backgroundGeometry = geometry

		return

	createCircles:()->
		image = new Image()
		image.onload = ()=>
			# not working this way.. todo: not use ImageUtils
			# map = new THREE.Texture( image )
			map = THREE.ImageUtils.loadTexture('./3d/textures/circle.png')
			@bufferGeometry = new THREE.BufferGeometry()
			@bufferGeometry.fromGeometry(@backgroundGeometry)
			material = new THREE.PointCloudMaterial({depthTest:false,transparent:true, map:map, color:0xFFFFFF,size:64,sizeAttenuation:true,fog:false,opacity:.1})
			@pointcloud = new THREE.PointCloud(@bufferGeometry,material)
			@pointcloud.position.z -= 945.999
			@pointcloud.position.y += 10
			Stage3d.add(@pointcloud)
		image.src = './3d/textures/circle.png'
		return

	createParticles:()->
		geometry = new THREE.BufferGeometry();
		
		triangles = 400
		vertices = new THREE.BufferAttribute( new Float32Array( triangles * 3 * 3 ), 3 );
		

		for i in [0...vertices.length] by 1
			if(i%3==0)
				phi = Math.PI*2*Math.random();
				theta = Math.PI*2*Math.random();
				radius = 60+Math.random()*60

			x = radius * Math.sin( phi ) * Math.cos( theta ) + Math.random()*2
			y = radius * Math.cos( phi ) + Math.random()*2
			z = radius*0.8 * Math.sin( phi ) * Math.sin( theta ) + Math.random()*2-30

			vertices.setXYZ( i, x, y, z );

		geometry.addAttribute( 'position', vertices )

		material = new THREE.MeshBasicMaterial({color:0xFFFFFF, side:THREE.DoubleSide, transparent: true, opacity:.1, fog:false})
		
		@particles = new THREE.Mesh(geometry,material)
		Stage3d.add(@particles)
		return

	createLight:()=>
		@ambientLight = new THREE.AmbientLight(0)
		@ambientLight2 = new THREE.AmbientLight(0xFFFFFF)
		
		@cameraLight = new THREE.PointLight(0x192343, 2, 2000)
		@cameraLight.position.set( 0, -1000, 0 );

		@cameraLight2 = new THREE.PointLight(0x262050, 1.5, 2400)
		@cameraLight2.position.set( -1500, 0, 0 );

		@cameraLight3 = new THREE.PointLight(0x11142d, 1.5, 2400)
		@cameraLight3.position.set( 1000, 0, 0 );

		@cameraLight4 = new THREE.PointLight(0x1d1d43, 2, 2400)
		@cameraLight4.position.set( 0, 1000, 0 );

		Stage3d.add(@ambientLight)
		Stage3d.add(@cameraLight)
		Stage3d.add(@cameraLight2)
		Stage3d.add(@cameraLight3)
		Stage3d.add(@cameraLight4)
		# Stage3d.add(@cameraLight5)

		Stage3d.add(@ambientLight2,false)

		return

	createGrids1:()=>
		p = @positions.grid1 = {
			fragments:[] 
			diamond:@diamond.position.clone()
			mirror:@mirror.position.clone()
		}
		for i in [0...24] by 1
			v = new THREE.Vector3()
			v.x = (-8*((i+1)%5))
			v.y = Math.floor((i+1)/5)*8-16.5
			v.z = 0
			p.fragments.push(v)

		p.diamond.x += 20
		p.mirror.x += 20
		return

	createGrids2:()=>
		p = @positions.grid2 = {
			fragments:[] 
			diamond:@diamond.position.clone()
			mirror:@mirror.position.clone()
		}
		for i in [0...24] by 1
			v = new THREE.Vector3()
			v.x = (-8*(i%8))+28
			v.y = Math.floor(i/8)*8-10
			v.z = 0
			p.fragments.push(v)

		p.diamond.y += 15
		p.mirror.y += 15
		return

	createGrids3:()=>
		p = @positions.grid3 = {
			fragments:[] 
			diamond:@diamond.position.clone()
			mirror:@mirror.position.clone()
		}
		for i in [0...24] by 1
			v = new THREE.Vector3()
			v.x = (-9*((i+1)%5))+15
			v.y = Math.floor((i+1)/5)*9-16.5
			v.z = 0
			p.fragments.push(v)

		# p.diamond.x += 20
		# p.mirror.x += 20
		return

	createGrids4:()=>
		p = @positions.grid4 = {
			fragments:[] 
			diamond:@diamond.position.clone()
			mirror:@mirror.position.clone()
		}
		angle = Math.PI/2
		angleStep = Math.PI*2/24
		radius = 22
		for i in [0...24] by 1
			v = new THREE.Vector3()
			v.x = Math.cos(angle)*(radius+Math.sin(angle*8)*5)
			v.y = Math.sin(angle)*(radius+Math.sin(angle*8)*5)
			v.z = 0
			angle += angleStep
			p.fragments.push(v)

		return

	createPortraitPosition:()=>
		p = @positions.portrait = {
			fragments:[] 
			diamond:@diamond.position.clone()
			mirror:@mirror.position.clone()
		}
		for i in [0...24] by 1
			v = @fragments[i].position.clone()
			v.x *= .75
			v.y *= 1.3
			p.fragments.push(v)
		return

	createMobilePosition:()=>
		p = @positions.mobile = {
			fragments:[] 
			diamond:@diamond.position.clone()
			mirror:@mirror.position.clone()
		}
		for i in [0...24] by 1
			v = new THREE.Vector3()
			v.x = (30*((i+1)%2))-15
			v.y = (12-Math.floor((i)/2))*-20+10
			v.z = 0
			p.fragments.push(v)

		p.diamond.y += 20
		p.mirror.y += 20
		return


	addEvent:()=>
		window.addEventListener('mousemove',(e)=>
			@mouse.x = (e.clientX / window.innerWidth) * 2 - 1
			@mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
		,false)
		return

	onDiamondLoad:(geometry)=>
		@computeGeometry(geometry)

		material = new THREE.MeshLambertMaterial({color: 0xffffff, transparent:true, light:false, envMap:@envMap, depthWrite:true, depthTest:true})
		
		material.map = @map
		material.shading = @shading
		material.opacity = .65
		material.side = THREE.DoubleSide
		material.combine = THREE.MixOperation

		matrix = new THREE.Matrix4()
		matrix.makeScale( .23, .23, .23 )
		geometry.applyMatrix ( matrix )
		@diamond = new THREE.Mesh(geometry,material)
		@container.add(@diamond)

		folder = @gui.addFolder('diamond')
		folder.add(material, 'depthWrite')
		folder.add(material, 'depthTest')
		folder.add(material, 'opacity', 0, 1)
		folder.add(material, 'reflectivity',0,1)
		@diamondColor = 0xffffff
		folder.add(@diamond.material, 'combine', {multiply:THREE.Multiply,mix:THREE.MixOperation,add:THREE.AddOperation})
		folder.addColor(@, 'diamondColor').onChange(()=>
			@diamond.material.color.setHex(@diamondColor)
		)

		@positions.base.diamond = @diamond.position.clone()
		return

	onMirrorLoad:(geometry)=>
		@computeGeometry(geometry)
		
		matrix = new THREE.Matrix4()
		matrix.makeScale( .23, .23, .23 )
		geometry.applyMatrix ( matrix )

		material = new THREE.MeshLambertMaterial({color: 0xffffff, light:false, transparent:true, envMap:@envMap, depthWrite:true, depthTest:true})
		material.map = @map
		material.shading = @shading
		material.side = THREE.DoubleSide
		material.combine = THREE.AddOperation
		material.reflectivity = .41
		material.opacity = 0.77

		@mirror = new THREE.Mesh(geometry,material)
		@container.add(@mirror)

		folder = @gui.addFolder('mirror')
		folder.add(@mirror.material, 'depthWrite')
		folder.add(@mirror.material, 'depthTest')
		folder.add(@mirror.material, 'opacity', 0, 1)
		folder.add(@mirror.material, 'reflectivity',0,1)

		@mirrorColor = 0xffffff
		folder.add(@mirror.material, 'combine', {multiply:THREE.Multiply,mix:THREE.MixOperation,add:THREE.AddOperation})
		folder.addColor(@, 'mirrorColor').onChange(()=>
			@mirror.material.color.setHex(@mirrorColor)
		)

		@positions.base.mirror = @mirror.position.clone()
		
		return

	onFragmentLoaded:(scene)=>

		@fragments = []
		@hitboxs = []
		hitboxGeo = new THREE.SphereGeometry(4)
		hitboxMaterial = new THREE.MeshBasicMaterial({color:0,wireframe:true,opacity:.3,transparent:true})

		@basePosition = []

		for k, v of scene.objects

			o = v
			o.name = o.name.substring(o.name.length-2)

			@computeGeometry(o.geometry)
			material = new THREE.MeshLambertMaterial({color: 0xffffff, transparent:true, envMap:@envMap, depthWrite:true, depthTest:true})
			material.shading = @shading
			material.side = THREE.DoubleSide
			material.combine = THREE.AddOperation
			material.reflectivity = .41
			material.opacity = 0.8

			o.material = material
			matrix = new THREE.Matrix4()
			matrix.makeScale( .2, .2, .2 )
			o.geometry.applyMatrix( matrix )
			o.position.multiplyScalar(.21)
			o.position.y -= 20
			o.position.z += 5
			if parseInt(o.name) > @maxDate
				o.material.opacity = 0.3
			# else
			# 	material.map = THREE.ImageUtils.loadTexture("./3d/textures/preview"+o.name+".jpg")
			
			hitbox = new THREE.Mesh(hitboxGeo,hitboxMaterial)
			hitbox.position.copy(o.position)
			hitbox.visible = @hitboxVisible
			hitbox.fragment = o
			@hitboxs.push(hitbox)
			Stage3d.add(hitbox)

			@positions.base.fragments.push(o.position.clone())

			@computeGeometry(o.geometry)
			@fragments.push(o)
			Stage3d.add(o)
		
		for i in [0...24] by 1
			@currentPosition.fragments[i].copy(@hitboxs[i].position)

		@position = @basePosition
		@createGrids1()
		@createGrids2()
		@createGrids3()
		@createGrids4()
		@createMobilePosition()
		@createPortraitPosition()
		return

	createGUI:()=>
		@gui = new dat.GUI()
		@textures = null

		@maps = []
		@envMaps = []

		global = @gui.addFolder('global')

		@globalOpacity = 1
		# global.add(@,'globalOpacity',0,1).step(0.01).onChange(()=>
		# 	document.getElementById('webgl').style.opacity = @globalOpacity
		# )

		global.add(@,'backgroundFix')
		global.add(@,'cameraMoveY')
		global.add(@,'cameraMoveYScale',-3,3).step(0.01)
		global.add(@,'containerMovY')
		global.add(@,'containerMovYScale',-2,2).step(0.01)

		@hitboxVisible = false
		global.add(@,'offsetX',-30,30).step(0.1)

		positions = @gui.addFolder('positions')
		positions.add(@,'noGrid')
		positions.add(@,'grid1')
		positions.add(@,'grid2')
		positions.add(@,'grid3')
		positions.add(@,'grid4')
		positions.add(@,'portrait')
		positions.add(@,'mobile')

		frag = @gui.addFolder('fragments')
		@movementScale = 1.3
		@speedScale = 0.1
		frag.add(@,'movementScale',0,2)
		frag.add(@,'speedScale',0,2)
		frag.add(@,'hitboxVisible').onChange((e)=>
			for i in [0...24] by 1
				@hitboxs[i].visible = @hitboxVisible
		)

		lights = @gui.addFolder('lights')
		@colorAmbient =  @ambientLight.color.getHex()
		lights.addColor(@,'colorAmbient').onChange(()=>
			@ambientLight.color.setHex(@colorAmbient)
		)

		@light1 =  @cameraLight.color.getHex()
		lights.addColor(@,'light1').onChange(()=>
			if(@light1)
				@cameraLight.color.setHex(@light1)
			else 
				@light1 = @cameraLight.color.getHex()
		)
		lights.add(@cameraLight,'intensity',0,3).step(0.01).name('intensity 1')

		@light2 =  @cameraLight2.color.getHex()
		lights.addColor(@,'light2').onChange(()=>
			if @light2
				@cameraLight2.color.setHex(@light2)
			else 
				@light2 = @cameraLight2.color.getHex()

		)
		lights.add(@cameraLight2,'intensity',0,3).step(0.01).name('intensity 2')

		@light3 =  @cameraLight3.color.getHex()
		lights.addColor(@,'light3').onChange(()=>
			if @light3
				@cameraLight3.color.setHex(@light3)
			else 
				@light3 = @cameraLight3.color.getHex()
		)
		lights.add(@cameraLight3,'intensity',0,3).step(0.01).name('intensity 3')

		@light4 =  @cameraLight4.color.getHex()
		lights.addColor(@,'light4').onChange(()=>
			if @light4
				@cameraLight4.color.setHex(@light4)
			else 
				@light4 = @cameraLight4.color.getHex()
		)
		lights.add(@cameraLight4,'intensity',0,3).step(0.01).name('intensity 4')

		lights.open()

		# Stage3d.initPostprocessing(@gui)

		return

	tweenTo:(positions)->
		for i in [0...24] by 1
			v = @currentPosition.fragments[i]
			v2 = positions.fragments[i]
			
			# diff = v2.clone().sub(v)
			
			TweenLite.to(v, .8+Math.random()*.3, {x: v2.x, y: v2.y, z:v2.z, ease:Back.easeOut})
		TweenLite.to(@currentPosition.diamond,1.4,{x: positions.diamond.x, y: positions.diamond.y, z:positions.diamond.z, ease:Expo.easeOut})
		TweenLite.to(@currentPosition.mirror,1.4,{x: positions.mirror.x, y: positions.mirror.y, z:positions.mirror.z, ease:Expo.easeOut})
		return

	noGrid:()->
		@tweenTo(@positions.base)
		return

	grid1:()->
		@tweenTo(@positions.grid1)
		return

	grid2:()->
		@tweenTo(@positions.grid2)
		return

	grid3:()->
		@tweenTo(@positions.grid3)
		return

	grid4:()->
		@tweenTo(@positions.grid4)
		return

	portrait:()->
		@tweenTo(@positions.portrait)
		return
	
	mobile:()->
		@tweenTo(@positions.mobile)
		return

	addZero:(number,minLength)->
		number = number+""
		while(number.length<minLength)
			number = "0"+number
		return number

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

	showXP:(index)=>
		if parseInt(index) > @maxDate
			return

		if(!@isOver)
			@isOver = true
			@emit "over", parseInt(index)
		
		if(index == @currentIndex)
			return
		
		@currentIndex = index
		@globalAlpha = 0.01
		return

	pause:()->
		return

	resume:()->
		return

	update:(dt)->

		@time += dt

		if (@isImgReady)
			@ctx.globalAlpha = @globalAlpha
			@globalAlpha += .01
			if @globalAlpha<1.1
				idx = parseInt( @currentIndex ) - 1
				if idx <= @maxDate
					@ctx.drawImage(@images[idx],0,0)
					@map.needsUpdate = true
					@envMap.needsUpdate = true

		vector = new THREE.Vector3( @mouse.x, @mouse.y, .5 )
		vector.unproject( Stage3d.camera )
		raycaster = new THREE.Raycaster( Stage3d.camera.position, vector.sub( Stage3d.camera.position ).normalize() )
		t = @time

		if(@diamond && @currentPosition.diamond)
			@diamond.position.copy(@currentPosition.diamond)
			@diamond.position.x += @offsetX

		if(@particles)
			@particles.position.x = 10
	
		if(@mirror && @currentPosition.mirror)
			@mirror.position.copy(@currentPosition.mirror)
			@mirror.position.x += @offsetX

		if(@mirror && @diamond)
			s = 1 + Math.cos(t/1250)*.02
			@diamond.scale.set(s,s,s)
			@diamond.position.y += Math.sin(t/1500)*.5
			@mirror.scale.set(s,s,s)
			@mirror.position.y += Math.sin(t/1500)*.5

		for i in [0...@hitboxs.length] by 1
			distance = new THREE.Vector3()
			dx = @currentPosition.fragments[i].x - @diamond.position.x
			dy = @currentPosition.fragments[i].y - @diamond.position.y
			dz = @currentPosition.fragments[i].z - @diamond.position.z
			distance.set(Math.sqrt(dx*dx),Math.sqrt(dy*dy),Math.sqrt(dz*dz))
			# @currentPosition.fragments[i].z =
			@hitboxs[i].position.copy(@currentPosition.fragments[i] )
			if(distance.x < 28.5)
				@hitboxs[i].position.z = Math.max(@hitboxs[i].position.z,15)
			else if(distance.x < 100)
				@hitboxs[i].position.z = Math.max(@hitboxs[i].position.z,(1-(distance.x-10.5)/10.5)*15+2)
			# @hitboxs[i].position.x += (@currentPosition.fragments[i].x - @hitboxs[i].position.x)*.05
			# @hitboxs[i].position.y += (@currentPosition.fragments[i].y - @hitboxs[i].position.y)*.05
			# @hitboxs[i].position.z += (@currentPosition.fragments[i].z - @hitboxs[i].position.z)*.05
			@hitboxs[i].position.x += @offsetX

		t = @time
		for i in [0...@fragments.length] by 1
			t+=747
			@fragments[i].position.y = @hitboxs[i].position.y+Math.sin(t/350*@speedScale)*1.1*@movementScale
			@fragments[i].position.x = @hitboxs[i].position.x+Math.cos(t/450*@speedScale)*.5*@movementScale
			@fragments[i].position.z = @hitboxs[i].position.z
		
		if(@hitboxs)
			intersects = raycaster.intersectObjects( @hitboxs, false )
			if( intersects.length > 0 )
				document.body.style.cursor = 'pointer'
				frag = intersects[0].object.fragment
				@currentFragment = frag
				@showXP(frag.name)
			else
				if(@isOver)
					@isOver = false
					@emit "out"
				document.body.style.cursor = 'auto'
				@currentFragment = null

		if @currentFragment
			@currentFragment.scale.x += (1.4-@currentFragment.scale.x)*.05
			@currentFragment.scale.y = @currentFragment.scale.x
			@currentFragment.scale.z = @currentFragment.scale.x

		for i in [0...@fragments.length] by 1
			f = @fragments[i]
			if f != @currentFragment
				f.scale.x += (1-f.scale.x)*.09
				f.scale.y = f.scale.x
				f.scale.z = f.scale.x

		if(@backgroundGeometry)
			geometry =  @backgroundGeometry
			#todo optimize it
			if(@bufferGeometry)
				@bufferGeometry.fromGeometry(@backgroundGeometry)
			speeds = [800,700,1200]
			for i in [0...geometry.vertices.length] by 1
				v = geometry.vertices[i]
				v.z += Math.cos(@time/speeds[i%speeds.length]+Math.PI/16*i)*2
			# for i in [1...geometry.attributes.position.array.length] by 3
			# 	geometry.attributes.position.array[i+2] += Math.cos(@time/speeds[(i/3)%speeds.length]+Math.PI/16*i)*2
			# geometry.attributes.positionneedsUpdate = true
			# geometry.attributes.normal.needsUpdate = true
			# geometry.normalizeNormals()
			geometry.computeTangents()
			geometry.computeVertexNormals()
			geometry.computeFaceNormals()
			geometry.computeVertexNormals()
			geometry.computeTangents()
			geometry.verticesNeedUpdate = true
			geometry.normalsNeedUpdate = true
			geometry.elementsNeedUpdate = true
			geometry.tangentsNeedUpdate = true

		Stage3d.camera.position.x += (@mouse.x*30 - Stage3d.camera.position.x)*.03

		# if @mouseChangePosition
		# 	Stage3d.camera.position.y += (@mouse.y*30 - Stage3d.camera.position.y)*.03

		if @cameraMoveY
			Stage3d.camera.position.y += (@mouse.y*@cameraMoveYScale+18 - Stage3d.camera.position.y)*.03

		if @containerMovY
			@container.rotation.x += (@mouse.y*Math.PI/16*@containerMovYScale - @container.rotation.x)*.09
			# @container.rotation.x += (-@mouse.y*Math.PI/16 - @container.rotation.x)*.09

		if(@backgroundFix)
			if(@backgroundFlat)
				vector = new THREE.Vector3( 1, 1, -1000 )
				vector.applyQuaternion( Stage3d.camera.quaternion )
				@backgroundFlat.position.copy(vector)
				@backgroundFlat.lookAt(Stage3d.camera.position)

				vector = new THREE.Vector3( 1, 1, -950 )
				vector.applyQuaternion( Stage3d.camera.quaternion )
				@backgroundLine.position.copy(vector)
				@backgroundLine.position.y += 10
				@backgroundLine.lookAt(Stage3d.camera.position)

				vector = new THREE.Vector3( 1, 1, 1 )
				vector.applyQuaternion( Stage3d.camera.quaternion )
				@lightContainer.position.copy(vector)
				@lightContainer.lookAt(Stage3d.camera.position)
		
			if @pointcloud
				vector = new THREE.Vector3( 1, 1, -945 )
				vector.applyQuaternion( Stage3d.camera.quaternion )
				@pointcloud.position.copy(vector)
				@pointcloud.lookAt(Stage3d.camera.position)

		
		# Stage3d.camera.position.y += (@mouse.y*2+20 - Stage3d.camera.position.y)*.03
		# @container.rotation.x += (@mouse.y*Math.PI/16 - @container.rotation.x)*.03
		# @lightContainer.rotation.x += (@mouse.y*Math.PI/16 - @container.rotation.x)*.03
		return

module.exports = Scene3d
