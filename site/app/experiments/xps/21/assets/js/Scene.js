// ------------------------------------------
// Scene.js
// ------------------------------------------
//
// Main ThreeJS scene setup & controller
//
// ------------------------------------------


'use strict';

var Scene = function ( opts ) {

	this.controller				= opts.controller;
	this.positionHelper			= opts.positionHelper;
	this.audioController		= opts.audioController;
	this.throwController		= opts.throwController;
	this.arrowPointerEl			= document.getElementById( 'arrow-pointer-box' );

	this.isPlaying				= true;

	this.camera					= null;
	this.scene					= null;
	this.light					= null;
	this.lightTone				= null;
	this.renderer				= null;
	this.raycaster				= null;
	this.containerEl			= null;

	this.camPos					= { h: 293, v: 30, distance: 500, automove: false };
	this.mouse					= { ox: 0, oy: 0, h: 0, v: 0, mx: 0, my: 0, down: false, over: false, moving: true, button: 0 };
	this.vsize					= { w : window.innerWidth, h : window.innerHeight };
	this.center					= new THREE.Vector3( -40, -70, -40 );
	this.rayTest				= null;
	this.cameraMoved			= false;

	this.physics				= null;
	this.staticMesh				= null;
	this.staticMesh2			= null;
	this.material				= null;
	this.material2				= null;
	this.ballGeometry			= null;
	this.caneGeometry			= null;
	this.soccerGeometry			= null;
	this.soccerMaterial			= null;
	this.rubikGeometry			= null;
	this.rubikMaterial			= null;
	this.bookGeometry			= null;
	this.bookMaterial			= null;

	this.lastBook				= 0;

	this.topElements			= [];
	this.boxPointers			= [];

	this.settingsGeometryBuffer	= {

		setNormals		: false,
		setUVs			: true,
		setVertexColors : false
	};

	this.signals				= {

		loaded	: new signals.Signal(),
		updated	: new signals.Signal()
	};

	this.init();
};

var proto = Scene.prototype;

proto.init = function () {

	this.createScene();
	this.createLights();
	this.createPhysics();
	this.createStaticMesh();
	this.createTopElements();
	this.createBoxPointers();

	this.addEventListeners();

	if ( this.isPlaying ) {

		requestAnimationFrame( this.update.bind( this ) );
	}
};


// ThreeJS scene
// ------------------------------------------

proto.createScene = function () {

// TODO: USE 60!!!

	this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	// this.camera.setLens( 20 );

	this.initCamera( this.camPos.h, this.camPos.v, this.camPos.distance );

	this.scene = new THREE.Scene();

	this.raycaster = new THREE.Raycaster();

	this.renderer = new THREE.WebGLRenderer( { antialias:true } );
	this.renderer.setSize( window.innerWidth, window.innerHeight );
	this.renderer.autoClear = false;
	this.renderer.setClearColor( 0xfa5a4a, 1 );
	this.renderer.shadowMapEnabled = true;
	this.renderer.shadowMapType = THREE.PCFShadowMap;
	this.renderer.gammaInput = true;
	this.renderer.gammaOutput = true;

	this.containerEl = document.getElementById( 'container' );
	this.containerEl.appendChild( this.renderer.domElement );
};

proto.initCamera = function ( h, v, d ) {

	this.camPos.h = h || 90;
	this.camPos.v = v || 60;
	this.camPos.distance = d || 400;
	this.moveCamera();
};

proto.createLights = function () {

	var ambientLight = new THREE.AmbientLight( 0x404040 );
	this.scene.add( ambientLight );


	this.light = new THREE.DirectionalLight( 0xffffff , 1.3 );
	this.light.position.set( -300, 1000, -300 );
	this.light.target.position.set( 0, 0, 0 );
	this.light.castShadow = true;
	this.light.shadowCameraNear = 100;
	this.light.shadowCameraFar = 2600;
	this.light.shadowCameraFov = 70;
	this.light.shadowBias = 0.0001;
	this.light.shadowDarkness = 0.1;// * 2.5;
	this.light.shadowMapWidth = this.light.shadowMapHeight = 1024;

	this.scene.add( this.light );


	this.lightTone = new THREE.DirectionalLight( 0xffffff, 1.5 );// 0xff9b88 , 1.5 );
	this.lightTone.position.set( 100, 1000, 300 );
	this.lightTone.target.position.set( 0, 0, 0 );
	this.lightTone.castShadow = true;
	this.lightTone.shadowCameraNear = 100;
	this.lightTone.shadowCameraFar = 2600;
	this.lightTone.shadowCameraFov = 70;
	this.lightTone.shadowBias = 0.0001;
	this.lightTone.shadowDarkness = 0.025;// * 2.5;
	this.lightTone.shadowMapWidth = this.lightTone.shadowMapHeight = 1024;

	this.scene.add( this.lightTone );

	this.backlightTone = new THREE.DirectionalLight( 0xffffff , 1.0 );
	this.backlightTone.position.set( 300, 10, -300 );
	this.backlightTone.target.position.set( 0, 0, 0 );
	// this.backlightTone.onlyShadow = true;

	this.scene.add( this.backlightTone );
};


// Physics
// ------------------------------------------

proto.createPhysics = function () {

	this.physics = new Physics( {

		scene			: this.scene,
		controller		: this,
		gameState		: this.controller.gameState,
		throwController	: this.throwController

	} );
};


// Specific meshes for the scene
//
// TODO: Mixing json, buffergeometries, DAE...
// convert everything tp buffergeometries
// ------------------------------------------

proto.createStaticMesh = function () {

	window.loadGeometry( 'assets/mesh/bin/boxes-static-1.bin', this.settingsGeometryBuffer, this.onLoadedStaticMesh.bind( this ) );
};

proto.onLoadedStaticMesh = function ( geometry ) {

	geometry.center();
	geometry.computeBoundingSphere();
	geometry.computeVertexNormals();

	var scale = 2;

	this.material = new THREE.MeshBasicMaterial( { map : THREE.ImageUtils.loadTexture( 'assets/texture/paintedDiff.jpg' ), color: 0xffffff } );

	this.staticMesh = new THREE.Mesh( geometry, this.material );
	this.staticMesh.scale.set( scale, scale, scale );

	this.staticMesh.position.x = -26.5;
	this.staticMesh.position.y = 1.5;
	this.staticMesh.position.z = -28;

	this.staticMesh.receiveShadow = true;
	this.staticMesh.castShadow = true;

	this.scene.add( this.staticMesh );

	this.createStaticMesh2();
};

proto.createStaticMesh2 = function () {

	window.loadGeometry( 'assets/mesh/bin/boxes-static-2.bin', this.settingsGeometryBuffer, this.onLoadedStaticMesh2.bind( this ) );
};

proto.onLoadedStaticMesh2 = function ( geometry ) {

	geometry.center();
	geometry.computeBoundingSphere();
	geometry.computeVertexNormals();

	var scale = 2;

	this.material2 = new THREE.MeshLambertMaterial( { map : THREE.ImageUtils.loadTexture( 'assets/texture/paintedDiff.jpg' ), color: 0xffffff } );

	this.staticMesh2 = new THREE.Mesh( geometry, this.material2 );
	this.staticMesh2.scale.set( scale, scale, scale );

	this.staticMesh2.position.y = -8;

	this.staticMesh2.receiveShadow = true;
	this.staticMesh2.castShadow = true;

	this.scene.add( this.staticMesh2 );

// this.controller.positionHelper.setMesh( this.staticMesh2 );

	this.createBall();
};

proto.createBall = function () {

	var loader = new THREE.JSONLoader( true );
		loader.load( 'assets/mesh/ball.json', this.onLoadedBall.bind( this ) );
};

proto.onLoadedBall = function ( geometry ) {

	geometry.center();
	this.ballGeometry = geometry;

	this.createCane();
};

proto.addBall = function () {

	var scale = 250,
		mesh = new THREE.Mesh( this.ballGeometry, this.material );
		mesh.scale.set( scale, scale, scale );

	return mesh;
};

proto.createCane = function () {

	var loader = new THREE.JSONLoader( true );
		loader.load( 'assets/mesh/cane.json', this.onLoadedCane.bind( this ) );
};

proto.onLoadedCane = function ( geometry ) {

	geometry.center();
	this.caneGeometry = geometry;

	this.createSoccer();
};

proto.addCane = function () {

	var scale = 140,
		mesh = new THREE.Mesh( this.caneGeometry, this.material );
		mesh.scale.set( scale, scale, scale );
		mesh.rotation.y = THREE.Math.degToRad( 180 );

	return mesh;
};

proto.createSoccer = function () {

	window.loadGeometry( 'assets/mesh/bin/soccer.bin', this.settingsGeometryBuffer, this.onLoadedSoccer.bind( this ) );
};

proto.onLoadedSoccerCollada = function ( collada ) {

	// var scale		= 2,
	// 	material	= new THREE.MeshBasicMaterial( { map : THREE.ImageUtils.loadTexture( 'assets/texture/paintedDiff.jpg' ), color : 0xfbfbfb, side: THREE.DoubleSide, opacity: 1, transparent: true } );

	this.mesh = collada.scene;

	var geometry = null;

	this.mesh.traverse( function ( child ) {

		if ( child.geometry !== undefined ) {

			child.geometry.center();
			child.geometry.computeBoundingSphere();
			child.geometry.computeVertexNormals();

			geometry = child.geometry;
		}
	} );


	this.soccerGeometry = geometry;
	this.soccerMaterial = new THREE.MeshBasicMaterial( {

		map			: THREE.ImageUtils.loadTexture( 'assets/texture/soccer.jpg' ),
		specularMap	: THREE.ImageUtils.loadTexture( 'assets/texture/soccer.jpg' ),
		side		: THREE.DoubleSide,
		color		: 0xffffff,
		ambient		: 0xffffff,
		specular	: 0xffffff,
		opacity		: 1.0,
		transparent	: true,
		shading		: THREE.FlatShading

	} );

	this.createRubik();
};

proto.onLoadedSoccer = function ( geometry ) {

	geometry.center();
	geometry.computeBoundingSphere();
	geometry.computeVertexNormals();

	this.soccerGeometry = geometry;
	this.soccerMaterial = new THREE.MeshPhongMaterial( {

		map			: THREE.ImageUtils.loadTexture( 'assets/texture/soccer.jpg' ),
		color		: 0x9e9e9e,
		ambient		: 0x9e9e9e,
		specular	: 0x000000,
		side		: THREE.DoubleSide,
		opacity		: 1.0,
		transparent	: true
		// ,
		// shading		: THREE.FlatShading

	} );

	this.createRubik();
};

proto.addSoccer = function () {

	var scale = 4.5,
		mesh = new THREE.Mesh( this.soccerGeometry, this.soccerMaterial );
		mesh.scale.set( scale, scale, scale );

	return mesh;
};

proto.createRubik = function () {

	window.loadGeometry( 'assets/mesh/bin/rubik.bin', this.settingsGeometryBuffer, this.onLoadedRubik.bind( this ) );
}

proto.onLoadedRubik = function ( geometry ) {

	geometry.center();
	geometry.computeBoundingSphere();
	geometry.computeVertexNormals();

	this.rubikGeometry = geometry;
	this.rubikMaterial = new THREE.MeshPhongMaterial( {

		map			: THREE.ImageUtils.loadTexture( 'assets/texture/rubik.jpg' ),
		color		: 0xb4b4b4,
		ambient		: 0xb4b4b4,
		specular	: 0x333333,
		side		: THREE.DoubleSide,
		opacity		: 1.0,
		transparent	: true,
		shading		: THREE.SmoothShading

	} );

	this.createBook();
};

proto.addRubik = function () {

	var scale = 2,
		mesh = new THREE.Mesh( this.rubikGeometry, this.rubikMaterial );
		mesh.scale.set( scale, scale, scale );

	return mesh;
};

proto.createBook = function () {

	window.loadGeometry( 'assets/mesh/bin/book.bin', this.settingsGeometryBuffer, this.onLoadedBook.bind( this ) );
};

proto.onLoadedBook = function ( geometry ) {

	geometry.center();
	geometry.computeBoundingSphere();
	geometry.computeVertexNormals();

	this.bookGeometry = geometry;
	this.bookMaterial = [

		new THREE.MeshLambertMaterial( {

			map			: THREE.ImageUtils.loadTexture( 'assets/texture/book-blue.jpg' ),
			color		: 0x7d7d7d,
			side		: THREE.DoubleSide,
			opacity		: 1.0,
			transparent	: true,
			shading		: THREE.FlatShading
		} ),

		new THREE.MeshLambertMaterial( {

			map			: THREE.ImageUtils.loadTexture( 'assets/texture/book-green.jpg' ),
			side		: THREE.DoubleSide,
			opacity		: 1.0,
			transparent	: true,
			shading		: THREE.FlatShading

		} ),

		new THREE.MeshLambertMaterial( {

			map			: THREE.ImageUtils.loadTexture( 'assets/texture/book-red.jpg' ),
			side		: THREE.DoubleSide,
			opacity		: 1.0,
			transparent	: true,
			shading		: THREE.FlatShading

		} )
	];

	this.signals.loaded.dispatch();
};

proto.addBook = function () {

	var index	= this.lastBook,
		scale	= 12,
		mesh	= new THREE.Mesh( this.bookGeometry, this.bookMaterial[ index ] );
		mesh.scale.set( scale, scale * 1.2, scale );

	this.lastBook++;
	if ( this.lastBook > 2 ) this.lastBook = 0;

	return mesh;
};


//  Top Elements
// ------------------------------------------

proto.createTopElements = function () {

	for ( var i = 1; i <= 5; i++ ) {

		var topElement = new TopElement( {

			id			: i,
			controller	: this,
			url			: 'assets/mesh/top-elements/top0' + i + '.dae'
		} );

		this.topElements.push( topElement );
	}
};


//  Box Pointers
// ------------------------------------------

proto.createBoxPointers = function () {

	var data = [

		{
			position	: new THREE.Vector3( -75.29, -67.85, -116.49 ),
			height		: 54.6
		},
		{
			position	: new THREE.Vector3( -114.87, -32.94, 12.27 ),
			height		: 37.4
		},
		{
			position	: new THREE.Vector3( 14, -24.5, 49.5 ),
			height		: 36
		},
		{
			position	: new THREE.Vector3( 28.63, -69.14, -141.70 ),
			height		: 41.4
		},
		{
			position	: new THREE.Vector3( -24.91, 54, -62.3 ),
			height		: 20.8
		}

	];

	for ( var i = 1; i <= 5; i++ ) {

		var boxPointer = new BoxPointer( {

			id			: i,
			controller	: this,
			centerBox	: data[ i - 1 ].position,
			heightBox	: data[ i - 1 ].height,
			arrowEl		: this.arrowPointerEl
		} );

		this.boxPointers.push( boxPointer );
	}
};


//  Events
// ------------------------------------------

proto.addEventListeners = function () {

	this.containerEl.addEventListener( 'mousemove', this.onMouseMove.bind( this ), false );
	this.containerEl.addEventListener( 'mousedown', this.onMouseDown.bind( this ), false );
	this.containerEl.addEventListener( 'mouseout',  this.onMouseUp.bind( this ), false );
	this.containerEl.addEventListener( 'mouseup', this.onMouseUp.bind( this ), false );

	this.containerEl.addEventListener( 'touchstart', this.onMouseDown.bind( this ), false );
	this.containerEl.addEventListener( 'touchend', this.onMouseUp.bind( this ), false );
	this.containerEl.addEventListener( 'touchmove', this.onMouseMove.bind( this ), false );

	this.containerEl.addEventListener( 'mousewheel', this.onMouseWheel.bind( this ), false );
	this.containerEl.addEventListener( 'DOMMouseScroll', this.onMouseWheel.bind( this ), false );
	window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
};

proto.onMouseRay = function ( x, y ) {

	this.rayTest();
};

proto.onMouseMove = function ( e ) {

	e.preventDefault();
	var px, py;
	if(e.touches){
		px = e.clientX || e.touches[ 0 ].pageX;
		py = e.clientY || e.touches[ 0 ].pageY;
	} else {
		px = e.clientX;
		py = e.clientY;
	}

	this.mouse.mx = ( px / this.vsize.w ) * 2 - 1;
	this.mouse.my = - ( py / this.vsize.h ) * 2 + 1;

	if(this.rayTest !== null) this.onMouseRay(px,py);
	if (this.mouse.down ) {

		var cameraTween = this.controller.gameState.cameraTween;
		if ( cameraTween !== null ) cameraTween.kill();


		document.body.style.cursor = 'move';

		this.camPos.h = ((px - this.mouse.ox) * 0.3) + this.mouse.h;
		this.camPos.v = (-(py - this.mouse.oy) * 0.1) + this.mouse.v;

		// Limit v
		this.camPos.v = Math.max( 45, Math.min( 80, this.camPos.v ) );

		// Limit h
		// it can only be 90deg +- from the current angle

		if ( !this.controller.developmentMode ) {

			var currentH	= this.controller.gameState.getCurrentCameraH(),
				minH		= currentH - 90,
				maxH		= currentH + 90;
			this.camPos.h = Math.max( minH, Math.min( maxH, this.camPos.h ) );

		}

		this.moveCamera();
	}
};

proto.onMouseDown = function ( e ) {

	e.preventDefault();
	var px, py;
	if(e.touches){
		px = e.clientX || e.touches[ 0 ].pageX;
		py = e.clientY || e.touches[ 0 ].pageY;
	} else {
		px = e.clientX;
		py = e.clientY;
		// 0: default  1: left  2: middle  3: right
		this.mouse.button = e.which;
	}
	this.mouse.ox = px;
	this.mouse.oy = py;
	this.mouse.h = this.camPos.h;
	this.mouse.v = this.camPos.v;
	this.mouse.down = true;
	if(this.rayTest !== null) this.onMouseRay(px,py);
};

proto.onMouseUp = function ( e ) {

	this.mouse.down = false;
	document.body.style.cursor = 'auto';

	if ( this.controller.gameState.hasHints ) {

		// If we have hints, we reposition the camera after the movement
		this.controller.gameState.gotoCameraPosition( false );
	}
};

proto.onMouseWheel = function ( e ) {

	if ( this.controller.developmentMode ) {

		var delta = 0;
		if(e.wheelDeltaY){delta=e.wheelDeltaY*0.01;}
		else if(e.wheelDelta){delta=e.wheelDelta*0.05;}
		else if(e.detail){delta=-e.detail*1.0;}
		this.camPos.distance-=(delta*10);
		this.moveCamera();
	}
};

proto.onWindowResize = function () {

	this.vsize.w = window.innerWidth;
	this.vsize.h = window.innerHeight;
	this.camera.aspect = this.vsize.w / this.vsize.h;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize( this.vsize.w, this.vsize.h );

	for ( var i = 0; i < this.boxPointers.length; i++ ) {

		this.boxPointers[ i ].resize();
	}
};


//  Camera move
// ------------------------------------------

proto.moveCamera = function () {

	this.cameraMoved = true;

	this.camera.position.copy( this.getCameraOrbitPosition( this.center, this.camPos.h, this.camPos.v, this.camPos.distance ) );
	this.camera.lookAt( this.center );
};

proto.getCameraOrbitPosition = function ( origin, h, v, distance ) {

	origin = origin || new THREE.Vector3();
	var p = new THREE.Vector3();
	var phi = v*Math.PI / 180;
	var theta = h*Math.PI / 180;
	p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origin.x;
	p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origin.z;
	p.y = (distance * Math.cos(phi)) + origin.y;

	return p;
};


//  Update ( RAF )
// ------------------------------------------

proto.update = function () {

	var i;

	this.signals.updated.dispatch();

	for ( i = 0; i < this.topElements.length; i++ ) {

		this.topElements[ i ].update();
	}

	for ( i = 0; i < this.boxPointers.length; i++ ) {

		this.boxPointers[ i ].update( this.cameraMoved );
	}

	this.cameraMoved = false;

	this.render();

	if ( this.isPlaying ) {

		requestAnimationFrame( this.update.bind( this ) );
	}
};

proto.render = function () {

	this.renderer.clear();
	this.renderer.render( this.scene, this.camera );
};


//  Pause / Play
// ------------------------------------------

proto.pause = function () {

	if ( this.isPlaying ) {

		this.isPlaying = false;
	}
};

proto.play = function () {

	if ( !this.isPlaying ) {

		this.isPlaying = true;
		requestAnimationFrame( this.update.bind( this ) );
	}
};
