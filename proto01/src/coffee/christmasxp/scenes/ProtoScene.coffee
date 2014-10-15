class ProtoScene extends Scene

	constructor:()->
		@vx = @vy = 0
		@constantVy = 0
		@lastX = @lastY = 0
		@friction = 0.98
		@maxSpeed = 15
		@height = 2200
		@radius = 200
		@camBaseRadius = @camRadius = 500
		@camAngle = 0
		@camAngleAuto = true
		@navTopBottom = false

		@createLights()
		@createMountain()
		@createExperiments()
		# @createBackScreen()
		@createGround()
		@createTree()
		@createStairs()
		@createFancy()

		@initGUI()

		Stage3d.scene.fog = new THREE.Fog( 0xFAFAFF, 0, 3000 )
		Stage3d.renderer.setClearColor(0xFAFAFF, 1);


		@addEvents()
		return

	createLights:()->
		@ambient = new THREE.AmbientLight( 0x555599 )
		@directional = new THREE.DirectionalLight( 0x6666AA, .2 )
		@directional.position.set( .5, 1, .5 )
		@directional2 = new THREE.DirectionalLight( 0x996666, 1.5 )
		@directional2.position.set( .5, 1, -.5 )
		@cameraLight = new THREE.PointLight( 0xffffff, 1, 900 )
		@cameraLight.position.set( 0, 0, 0 )
		Stage3d.add(@ambient)
		Stage3d.add(@directional)
		Stage3d.add(@directional2)
		Stage3d.add(@cameraLight)
		return

	createMountain:()->
		material = new THREE.MeshLambertMaterial({shading:THREE.FlatShading, color:0x99FFFF, wireframe:false,lights:true, transparent:true, opacity:.98})
		geometry =  new THREE.CylinderGeometry(0, @radius, @height, 32, 32)
		for i in [0...geometry.vertices.length] by 1
			v = geometry.vertices[i]
			v.x += 40*Math.random()-20
			v.y += 40*Math.random()-20
			v.z += 40*Math.random()-20

		console.log(geometry)
		geometry.computeTangents();
		geometry.computeVertexNormals()
		geometry.normalsNeedUpdate = true
		geometry.verticesNeedUpdate = true

		mesh = new THREE.Mesh(geometry, material)
		mesh.position.y = @height/2
		Stage3d.add(mesh)
		return mesh

	createExperiments:()->
		@xpMesh = []
		for i in [0...24] by 1
			percent = (((i+1)/24)*.9+.05)*.9
			material = new THREE.MeshBasicMaterial({color:0xFFFF11, wireframe:false, transparent:true, opacity:1})
			geometry =  new THREE.SphereGeometry(5, 8, 8, 8)
			mesh = new THREE.Mesh(geometry, material)
			angle = percent*Math.PI*6
			mesh.position.x = Math.cos(angle)*(@radius+50)*(1-percent)
			mesh.position.y = @height*percent
			mesh.position.z = Math.sin(angle)*(@radius+50)*(1-percent)
			Stage3d.add(mesh)
			@xpMesh.push(mesh)
		return

	createStairs:()->
		for i in [0...100] by 1
			percent = (((i+1)/100)*.9+.05)*.9
			material = new THREE.MeshBasicMaterial({color:0x333333, wireframe:false, transparent:true, opacity:1})
			geometry =  new THREE.BoxGeometry(20, 3, 20, 8)
			for i in [0...geometry.vertices.length] by 1
				v = geometry.vertices[i]
				v.x += 1.1*Math.random()-.55
				v.y += 1.1*Math.random()-.55
				v.z += 1.1*Math.random()-.55
			mesh = new THREE.Mesh(geometry, material)
			angle = percent*Math.PI*6
			mesh.position.x = Math.cos(angle)*(@radius)*(1-percent)
			mesh.position.y = @height*percent
			mesh.position.z = Math.sin(angle)*(@radius)*(1-percent)
			Stage3d.add(mesh)
		return


	createFancy:()->
		for i in [0...30] by 1
			percent = (((i+1)/30)*.9+.05)*.9
			material = new THREE.MeshBasicMaterial({color:0xFFFFFF, wireframe:true, transparent:true, opacity:.4})
			geometry =  new THREE.SphereGeometry(4)
			for i in [0...geometry.vertices.length] by 1
				v = geometry.vertices[i]
				v.x += 10*Math.random()-5
				v.y += 10*Math.random()-5
				v.z += 10*Math.random()-5
			mesh = new THREE.Mesh(geometry, material)
			angle = Math.PI*2*Math.random()
			mesh.position.x = Math.cos(angle)*(@radius+300*Math.random()+200)
			mesh.position.y = @height*percent
			mesh.position.z = Math.sin(angle)*(@radius+300*Math.random()+200)
			Stage3d.add(mesh)
		return

	createBackScreen:()->
		material = new THREE.MeshBasicMaterial({color:0xFFFFFF, wireframe:false, transparent: true, opacity:1, fog:false, light:false, map:THREE.ImageUtils.loadTexture( "img/map.jpg" );})
		geometry =  new THREE.PlaneBufferGeometry(160*10, 90*10, 10, 10)
		# for i in [1...geometry.attributes.position.array.length] by 3
		# 	geometry.attributes.position.array[i+1] += Math.cos(i/120)*20
		# geometry.attributes.position.needsUpdate = true
		# geometry.attributes.normal.needsUpdate = true
		# geometry.computeTangents();
		# geometry.computeVertexNormals()
		mesh = new THREE.Mesh(geometry, material)
		mesh.position.set(0,0,-@radius*1.3)
		@backScreen = mesh
		Stage3d.add(mesh)
		return

	createGround:()->
		# FlatShading not working on planeBuffer ?
		material = new THREE.MeshLambertMaterial({shading:THREE.FlatShading, wireframe:false,color:0xFFFFFF})
		geometry =  new THREE.PlaneBufferGeometry(10000, 10000, 128, 128)
		for i in [1...geometry.attributes.position.array.length] by 3
			geometry.attributes.position.array[i+1] += 100*Math.random()
		geometry.attributes.position.needsUpdate = true
		geometry.attributes.normal.needsUpdate = true
		geometry.computeTangents();
		geometry.computeVertexNormals()

		# console.log geometry
		mesh = new THREE.Mesh(geometry, material)
		mesh.rotation.x -= Math.PI/2

		@geometry = geometry
		Stage3d.add(mesh)
		return

	createTree:()->
		for i in [0...30] by 1
			percent = (((i+1)/30)*.9+.05)*.9
			material = new THREE.MeshBasicMaterial({color:0x33AA33, wireframe:false, transparent:true, opacity:1})
			geometry =  new THREE.BoxGeometry(3, 40, 3)
			# for i in [0...geometry.vertices.length] by 1
			# 	v = geometry.vertices[i]
			# 	v.x += 10*Math.random()-5
			# 	v.y += 10*Math.random()-5
			# 	v.z += 10*Math.random()-5
			mesh = new THREE.Mesh(geometry, material)
			angle = Math.PI*2*Math.random()
			mesh.position.x = Math.cos(angle)*(@radius)*(1-percent)
			mesh.position.y = @height*percent+20
			mesh.position.z = Math.sin(angle)*(@radius)*(1-percent)
			Stage3d.add(mesh)

		return

	transitionIn:()->
		TweenLite.to(Stage3d.camera.position,2.7,{y:@height/2})
		TweenLite.from(@,2.7,{camRadius:2000,onComplete:()=>
			@camAngleAuto = true
		})

	update:(dt)->
		if @navTopBottom
			@vy += @constantVy
		@vy *= @friction
		@vx *= @friction
		@vx = Math.min(@maxSpeed,@vx)
		@vy = Math.min(@maxSpeed,@vy)
		@vx = Math.max(-@maxSpeed,@vx)
		@vy = Math.max(-@maxSpeed,@vy)

		@camRadius += (Math.abs(@vy*30)+@camBaseRadius-@camRadius)*.15

		Stage3d.camera.position.y += @vy
		Stage3d.camera.position.y = Math.max(Math.min(@height+50,Stage3d.camera.position.y ),100)
		if @camAngleAuto
			@camAngle = Stage3d.camera.position.y/@height*Math.PI*6
		else
			@camAngle += @vx*0.005

		Stage3d.camera.position.x = Math.cos(@camAngle)*@camRadius
		Stage3d.camera.position.z = Math.sin(@camAngle)*@camRadius
 
		# @backScreen.position.y = Stage3d.camera.position.y 
		# @backScreen.position.x = Math.cos(@camAngle-Math.PI)*@camRadius
		# @backScreen.position.z = Math.sin(@camAngle-Math.PI)*@camRadius
		# @backScreen.lookAt(new THREE.Vector3(0,@backScreen.position.y,0))

		# @backScreen.position.x = Math.cos(@camAngle+.4)*@camRadius*.4
		# @backScreen.position.y = Stage3d.camera.position.y
		# @backScreen.position.z = Math.sin(@camAngle+.4)*@camRadius*.4
		# @backScreen.lookAt(Stage3d.camera.position)

		@cameraLight.position.set(Stage3d.camera.position.x,Stage3d.camera.position.y,Stage3d.camera.position.z)
		@updateExperiment()
		return

	updateExperiment:()->
		materialOn = new THREE.MeshBasicMaterial({color:0xFFFF11, wireframe:false, transparent:true, opacity:.6})
		materialOff = new THREE.MeshBasicMaterial({color:0xFF0000, wireframe:false, transparent:true, opacity:.6})
		minDist = 10000000
		currentXP = null
		for xp in @xpMesh
			dx = xp.position.y-Stage3d.camera.position.y
			dist = dx*dx
			if dist<minDist
				minDist = dist
				currentXP = xp
		for xp in @xpMesh
			if xp == currentXP
				xp.material = materialOn
			else
				xp.material = materialOff
		return

	initGUI:()->
		gui = new dat.GUI()
		gui.add(@,'camAngleAuto').listen()
		gui.add(@,'navTopBottom')
		gui.add(@,'camBaseRadius',200,1600)
		gui.add(Stage3d.camera,'fov',0,180)
		gui.add(@,'friction',0.95,1)
		return

	addEvents:()->
		window.addEventListener('mousedown',@onMouseDown)
		window.addEventListener('touchstart',@onTouchStart)
		window.addEventListener('mousemove',@onMouseMoveConstant)
		# todo do same with accelerometer
		# window.addEventListener('touchstart',@onTouchStart)
		return

	onMouseMoveConstant:(e)=>
		# x = (e.pageX/window.innerWidth)-.5
		y = (e.pageY/window.innerHeight)-.5
		
		if(y > .2) then @constantVy = -.8*(y-.2)
		else if(y < -.2) then @constantVy = -.8*(y+.2)
		else @constantVy = 0
		return

	onTouchStart:(e)=>
		@lastX = e.touches[0].pageX;
		@lastY = e.touches[0].pageY;
		window.addEventListener('touchend',@onTouchUp)
		window.addEventListener('touchmove',@onTouchMove)
		return

	onTouchMove:(e)=>
		@vx = e.touches[0].pageX - @lastX
		@vy = e.touches[0].pageY - @lastY
		@lastX = e.touches[0].pageX;
		@lastY = e.touches[0].pageY;
		return

	onTouchEnd:(e)=>
		window.removeEventListener('touchend',@onTouchUp)
		window.removeEventListener('touchmove',@onTouchMove)
		return

	onMouseDown:(e)=>
		@lastX = e.pageX;
		@lastY = e.pageY;
		window.addEventListener('mouseup',@onMouseUp)
		window.addEventListener('mousemove',@onMouseMove)
		return

	onMouseMove:(e)=>
		@vx = e.pageX - @lastX
		@vy = e.pageY - @lastY
		@lastX = e.pageX;
		@lastY = e.pageY;
		return

	onMouseUp:(e)=>
		window.removeEventListener('mouseup',@onMouseUp)
		window.removeEventListener('mousemove',@onMouseMove)
		return

