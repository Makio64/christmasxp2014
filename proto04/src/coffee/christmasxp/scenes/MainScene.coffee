class MainScene extends Scene

	constructor:()->

		@isReady = false
		@isImgReady = false

		@currentIndex = 1

		@mouse = new THREE.Vector2(0,0)
		@time = 0
		@useMap = true
		@shading = THREE.FlatShading
		@opacity = 1
		@fragments = []
		@hitboxs = []
		@maxDate = 13
		@positions = {};
		@positions.base = {
			fragments : []
			diamond : new THREE.Vector3()
			mirror : new THREE.Vector3()
		}

		@offsetX = 0

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

		@lightContainer = new THREE.Object3D();
		@container.add(@lightContainer)

		@createLight()
		@createBackground()
		@createCircles()
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
		@atlas.src = './3d/textures/atlas_low_2048.jpg'
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

		mesh = new THREE.Mesh(geometry, material)
		mesh.position.z = -1000
		Stage3d.add(mesh)

		material = new THREE.MeshBasicMaterial({ wireframe:true,color:0,transparent:true,opacity:.1})
		material.shading = THREE.FlatShading
		mesh = new THREE.Mesh(geometry, material)
		mesh.position.z = -950
		mesh.position.y += 10
		Stage3d.add(mesh)

		@backgroundGeometry = geometry

		return

	createCircles:()->
		image = new Image()
		image.onload = ()=>
			map = new THREE.Texture( image, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBFormat, THREE.UnsignedByteType, 1 )
			material = new THREE.PointCloudMaterial({color:0,size:64,sizeAttenuation:false,fog:false})
			mesh = new THREE.PointCloud(@backgroundGeometry,material)

			@container.add(mesh)
		image.src = './3d/textures/circle.png'
		return

	createLight:()=>
		@ambientLight = new THREE.AmbientLight(0x333333)
		@ambientLight2 = new THREE.AmbientLight(0xFFFFFF)
		
		@cameraLight = new THREE.PointLight(0x221199, 2, 2000)
		@cameraLight.position.set( 0, -1000, 0 );

		@cameraLight3 = new THREE.PointLight(0x2233AA, 2, 2400)
		@cameraLight3.position.set( 1000, 0, 0 );

		@cameraLight2 = new THREE.PointLight(0x2211AA, 1, 2400)
		@cameraLight2.position.set( -1500, 0, 0 );

		@cameraLight4 = new THREE.PointLight(0x222277, 2, 2400)
		@cameraLight4.position.set( 0, 1000, 0 );

		@cameraLight5 = new THREE.PointLight(0xFFFFFF, 1, 200)
		@cameraLight5.position.set( 0, 0, 0 );

		Stage3d.add(@ambientLight)
		Stage3d.add(@cameraLight)
		Stage3d.add(@cameraLight3)
		Stage3d.add(@cameraLight2)
		Stage3d.add(@cameraLight4)
		Stage3d.add(@cameraLight5)

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
		matrix.makeScale( .2, .2, .2 )
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
		matrix.makeScale( .2, .2, .2 )
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
			matrix.makeScale( .23, .23, .23 )
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
		global.add(@,'globalOpacity',0,1).step(0.01).onChange(()=>
			document.getElementById('webgl').style.opacity = @globalOpacity
		)

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
		@movementScale = 1.1
		@speedScale = 0.1
		frag.add(@,'movementScale',0,2)
		frag.add(@,'speedScale',0,2)
		frag.add(@,'hitboxVisible').onChange((e)=>
			for i in [0...24] by 1
				@hitboxs[i].visible = @hitboxVisible
			
		)

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

	showXP:(index)->
		if(index == @currentIndex || parseInt(index) > @maxDate)
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
			
			idx = parseInt( @currentIndex ) - 1
			if idx <= 14
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
			if(distance.x < 17.5)
				@hitboxs[i].position.z = Math.max(@hitboxs[i].position.z,14)
			else if(distance.x < 29)
				@hitboxs[i].position.z = Math.max(@hitboxs[i].position.z,(1-(distance.x-14)/15)*14+2)
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

		# @cameraLight.position.x = Math.cos(@time*0.001)*100
		# @cameraLight2.position.x = Math.cos(@time*0.0015)*120
		# @cameraLight2.position.y = Math.sin(@time*0.0015)*120
		# @container.rotation.y += (@mouse.x*Math.PI/16 - @container.rotation.y)*.09
		# @container.rotation.x += (-@mouse.y*Math.PI/16 - @container.rotation.x)*.09

		if(@backgroundGeometry)
			geometry =  @backgroundGeometry
			speeds = [800,700,1200]
			for i in [0...geometry.vertices.length] by 1
				v = geometry.vertices[i]
				v.z += Math.cos(@time/speeds[i%speeds.length]+Math.PI/16*i)*2
			# for i in [1...geometry.attributes.position.array.length] by 3
			# 	geometry.attributes.position.array[i+2] += Math.cos(@time/speeds[(i/3)%speeds.length]+Math.PI/16*i)*2
			# geometry.attributes.positionneedsUpdate = true
			# geometry.attributes.normal.needsUpdate = true
			# geometry.normalizeNormals()
			geometry.computeTangents();
			geometry.computeVertexNormals()
			geometry.computeFaceNormals()
			geometry.computeVertexNormals()
			geometry.computeTangents()
			geometry.verticesNeedUpdate = true
			geometry.normalsNeedUpdate = true
			geometry.elementsNeedUpdate = true;
			geometry.tangentsNeedUpdate = true;

		Stage3d.camera.position.x += (@mouse.x*30 - Stage3d.camera.position.x)*.03
		
		# Stage3d.camera.position.y += (@mouse.y*2+20 - Stage3d.camera.position.y)*.03
		# @container.rotation.x += (@mouse.y*Math.PI/16 - @container.rotation.x)*.03
		# @lightContainer.rotation.x += (@mouse.y*Math.PI/16 - @container.rotation.x)*.03
		return
