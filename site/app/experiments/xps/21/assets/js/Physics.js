
'use strict';

var Physics = function ( opts ) {

	this.world				= null;
	this.collisionGroupes	= {};
	this.meshes				= [];
	this.grounds			= [];
	this.bodys				= [];
	this.type				= 1;

	this.controller			= opts.controller;
	this.throwController	= opts.throwController;
	this.scene				= opts.scene;
	this.blenderBoxes		= new THREE.Object3D();

	this.matBox				= null;
	this.matSphere			= null;
	this.matBoxSleep		= null;
	this.matSphereSleep		= null;
	this.matGround			= null;
	this.matGroundColor		= null;
	this.matGroundWin		= null;
	this.matGroundTrans		= null;

	this.buffgeoSphere		= null;
	this.buffgeoBox			= null;

	this.colliderBoxes		= [];

	this.numContacts		= 0;
	this.isThrowing			= false;
	this.throwSto			= 0;



	this.numBall			= 0;
	this.isInTimes			= 0;

	this.signals			= {

		loaded : new signals.Signal()
	};


	this.init();
};

var proto = Physics.prototype;

proto.init = function () {

	this.createElements();
	this.createPhysics();

	this.createBlenderBoxes();
	this.createColliderBoxes();
	this.createColliderBalls();

	this.addEventListeners();

	setTimeout( this.onLoaded.bind( this ), 500 );
};

proto.onLoaded = function () {

	this.signals.loaded.dispatch();
};

proto.createBlenderBoxes = function () {

	var blenderData = [

		{
			pos		: [ -0.08038, 0.64049, 0.30922 + 0.011 ],
			rot		: [ 90, 0, 20.748 ],
			scale	: [ 0.009, 0.016, 0.009 ],
			size	: [ 0.353, 0.611, 0.353 ]
		},

		// Box 5!
		// {
		// 	pos		: [ -0.07708, 0.69151, 0.66697 + 0.006 ],
		// 	rot		: [ 90, 0, 9.59 ],
		// 	scale	: [ 0.003, 0.003, 0.003 ],
		// 	size	: [ 0.132, 0.104, 0.132 ]
		// },

		{
			pos		: [ 0.03381, 0.56780, 0.64251 + 0.013 ],
			rot		: [ 90, 0, 44.172 ],
			scale	: [ 0.004, 0.002, 0.004 ],
			size	: [ 0.162, 0.060, 0.142 ]
		},
		{
			pos		: [ -0.18966, 0.32720, 0.19079 + 0.011 ],
			rot		: [ 176.726, 11.518, 64.701 ],
			scale	: [ 0.003, 0.003, 0.009 ],
			size	: [ 0.102, 0.127, 0.363 ]
		},

		{
			pos		: [ 0.14373, 0.16331, 0.17080 - 0.05 ],
			rot		: [ 90, 0, 44.476 ],
			scale	: [ 0.015, 0.015, 0.013 ],
			size	: [ 0.589, 0.201 + 0.01, 0.507 ]
		},

		// Box 3!
		// {
		// 	pos		: [ 0.11762, 0.13195, 0.32032 + 0.0 ],
		// 	rot		: [ 90, 0, 83.702 ],
		// 	scale	: [ 0.006, 0.006, 0.006 ],
		// 	size	: [ 0.235, 0.169 + 0.01, 0.235 ]
		// },

		{
			pos		: [ 0.35612 + 0.005, 0.49660, 0.23201 + 0.011 ],
			rot		: [ -180, -18.539, 0 ],
			scale	: [ 0.003, 0.004, 0.012 ],
			size	: [ 0.126, 0.161, 0.450 ]
		},

		{
			pos		: [ 0.19939 + 0.005, 0.71396, 0.15677 + 0.011 ],
			rot		: [ 90, -18.729, 17.74 ],
			scale	: [ 0.003, 0.008, 0.009 ],
			size	: [ 0.129, 0.297, 0.341 ]
		},

		// Box 4!
		// {
		// 	pos		: [ 0.19067, 1.08851, 0.10677 + 0.0 ],
		// 	rot		: [ 90, 0, 34.318 ],
		// 	scale	: [ 0.007, 0.005, 0.007 ],
		// 	size	: [ 0.251, 0.207, 0.251 ]
		// },

		// Box 1!
		// {
		// 	pos		: [ -0.32895, 0.96245, 0.14474 + 0.011 ],
		// 	rot		: [ 90, 0, 34.218 ],
		// 	scale	: [ 0.009, 0.007, 0.009 ],
		// 	size	: [ 0.364, 0.273, 0.364 ]
		// },

		{
			pos		: [ -0.484495, 0.39849, 0.12848 - 0.03 ],
			rot		: [ 90, 0, 91.205 ],
			scale	: [ 0.011, 0.011, 0.011 ],
			size	: [ 0.490, 0.178, 0.427 ]
		},

		{
			pos		: [ -0.46479 + 0.002, 0.57488, 0.24846 + 0.005 ],
			rot		: [ 90, 0, 56.701 ],
			scale	: [ 0.004, 0.003, 0.012 ],
			size	: [ 0.153, 0.119 + 0.005, 0.458 ]
		},

		// Box 2!
		// {
		// 	pos		: [ -0.53186 + 0.005, 0.31863, 0.29030 ],
		// 	rot		: [ 90, 0, 99.086 ],
		// 	scale	: [ 0.006, 0.006, 0.006 ],
		// 	size	: [ 0.245, 0.176 + 0.011, 0.245 ]
		// }
	];


	for ( var i = 0; i < blenderData.length; i++ ) {

		var d = blenderData[ i ];
		d.pos[ 0 ] *= 200;
		d.pos[ 1 ] *= 200;
		d.pos[ 2 ] *= 200;
		d.size[ 0 ] *= 200;
		d.size[ 1 ] *= 200;
		d.size[ 2 ] *= 200;

		var pos		= [ d.pos[ 0 ],  d.pos[ 1 ], d.pos[ 2 ] ],
			size	= [ d.size[ 0 ], d.size[ 1 ], d.size[ 2 ] ],
			rot		= [ d.rot[ 0 ], d.rot[ 1 ], d.rot[ 2 ] ];

		var meshStatic = this.addStaticBlenderBox( size, pos, rot, true );

	}

	this.blenderBoxes.rotation.x = THREE.Math.degToRad( -90 );
	this.blenderBoxes.position.x = -9.5;
	this.blenderBoxes.position.y = -72;
	this.blenderBoxes.position.z = 76;

	this.scene.add( this.blenderBoxes );
	this.blenderBoxes.visible = false;
	this.blenderBoxes.updateMatrixWorld();

	var config = [ 5, 0.4, 0.2 ];

	for ( var i = 0; i < this.blenderBoxes.children.length; i++ ) {

		// Get the local to world values

		var box		= this.blenderBoxes.children[ i ],
			pos		= new THREE.Vector3(),
			mat		= new THREE.Matrix4(),
			rot		= new THREE.Euler( 0, 0, 0, 'ZYX' ),
			size	= new THREE.Vector3();

		pos.setFromMatrixPosition( box.matrixWorld );
		rot.setFromRotationMatrix(  mat.extractRotation( box.matrixWorld ) );
		size.setFromMatrixScale( box.matrixWorld );

		pos.y += 1;

		if ( i === 5 ) {

			rot.x -= 0.1;
		}

		if ( i === 2 ) {

			rot.y += 0.1;
			rot.x += 0.4;
			rot.z += 0.3;
		}

		var sizeArray	= [ size.x, size.y, size.z ],
			rotArray	= [ THREE.Math.radToDeg( rot.x ), THREE.Math.radToDeg( rot.y ), THREE.Math.radToDeg( rot.z ) ],
			posArray	= [ pos.x, pos.y, pos.z ];

		var body = new OIMO.Body( { size : sizeArray, pos : posArray, rot : rotArray, world : this.world, config : config } );

		// var checkMesh = this.addStaticCheckBox( sizeArray, posArray, rotArray, body );
		// if ( i === 2 ) { this.controller.positionHelper.setMesh( checkMesh ); }
	}

	this.scene.remove( this.blenderBoxes );
}


proto.addStaticBlenderBox = function (size, position, rotation, color, isWin, spec) {

	var mesh = new THREE.Mesh( this.buffgeoBox, this.matGroundWin );
		mesh.rotation.order = 'ZYX';
		mesh.scale.set( size[0], size[1], size[2] );
		mesh.position.set( position[0], position[1], position[2] );
		mesh.rotation.set( THREE.Math.degToRad( rotation[0] ), THREE.Math.degToRad( rotation[1] ), THREE.Math.degToRad( rotation[2] ) );

	this.blenderBoxes.add( mesh );

	return mesh;
};

proto.addStaticCheckBox = function ( size, position, rotation, body ) {

	var mesh = new THREE.Mesh( this.buffgeoBox, this.matGroundWin );
		mesh.scale.set( size[0], size[1], size[2] );

	if ( body ) {

		mesh.position.copy( body.getPosition() );
		mesh.quaternion.copy( body.getQuaternion() );

	} else {

		mesh.position.set( position[0], position[1], position[2] );
		mesh.rotation.set( THREE.Math.degToRad( rotation[0] ), THREE.Math.degToRad( rotation[1] ), THREE.Math.degToRad( rotation[2] ) );
	}

	this.scene.add( mesh );

	return mesh;
};


proto.addStaticCheckSphere = function ( size, position, rotation, body ) {

	var mesh = new THREE.Mesh( this.buffgeoSphere, this.matGroundWin );
		mesh.scale.set( size[0], size[1], size[2] );

	if ( body ) {

		mesh.position.copy( body.getPosition() );
		mesh.quaternion.copy( body.getQuaternion() );

	} else {

		mesh.position.set( position[0], position[1], position[2] );
		mesh.rotation.set( THREE.Math.degToRad( rotation[0] ), THREE.Math.degToRad( rotation[1] ), THREE.Math.degToRad( rotation[2] ) );
	}

	this.scene.add( mesh );

	return mesh;
};

proto.createColliderBoxes = function () {

	var box1 = new ColliderBox( {

		scene			: this.scene,
		controller		: this.controller,
		world			: this.world,
		id				: 1,
		size			: new THREE.Vector3( 72.8, 54.6, 72.8  ),
		position		: new THREE.Vector3( -75.29, -67.85, -116.49 ),
		rotation		: new THREE.Vector3( 0, -0.977, 0 ),
		positionOpen	: new THREE.Vector3( -250.79, -63.24, 29.01 ),
		rotationOpen	: new THREE.Vector3( 0, -1.465, 0 ),
		debug			: false
	} );

	this.colliderBoxes.push( box1 );

	var box2 = new ColliderBox( {

		scene			: this.scene,
		controller		: this.controller,
		world			: this.world,
		id				: 2,
		size			: new THREE.Vector3( 49, 37.4, 49 ),
		position		: new THREE.Vector3( -114.87, -32.94, 12.27 ),
		rotation		: new THREE.Vector3( 0, 0.157, 0 ),
		positionOpen	: new THREE.Vector3( -175.87, -66.54, -49.73 ),
		rotationOpen	: new THREE.Vector3( 0, -0.0175, 0 ),
		debug			: false
	} );

	this.colliderBoxes.push( box2 );

	var box3 = new ColliderBox( {

		scene			: this.scene,
		controller		: this.controller,
		world			: this.world,
		id				: 3,
		size			: new THREE.Vector3( 46, 36, 46 ),
		position		: new THREE.Vector3( 14, -24.5, 49.5 ),
		rotation		: new THREE.Vector3( 0, -0.0872, 0 ),
		positionOpen	: new THREE.Vector3( 18.5, -6.5, 2 ),
		rotationOpen	: new THREE.Vector3( -2.321, 0.262, -0.2967 ),
		debug			: false
	} );

	this.colliderBoxes.push( box3 );

	var box4 = new ColliderBox( {

		scene			: this.scene,
		controller		: this.controller,
		world			: this.world,
		id				: 4,
		size			: new THREE.Vector3( 50.2, 41.4, 50.2 ),
		position		: new THREE.Vector3( 28.63, -69.14, -141.70 ),
		rotation		: new THREE.Vector3( 0, 0.61, 0 ),
		positionOpen	: new THREE.Vector3( 138.63, -67.74, -249.2 ),
		rotationOpen	: new THREE.Vector3( 0, -0.227, 0 ),
		debug			: false
	} );

	this.colliderBoxes.push( box4 );

	var box5 = new ColliderBox( {

		scene			: this.scene,
		controller		: this.controller,
		world			: this.world,
		id				: 5,
		size			: new THREE.Vector3( 26.4, 20.8, 26.4 ),
		position		: new THREE.Vector3( -24.91, 54, -62.3 ),
		rotation		: new THREE.Vector3( 0, 0.174, 0 ),
		positionOpen	: new THREE.Vector3( 128.09, -69.2, -69.8 ),
		rotationOpen	: new THREE.Vector3( 0, 0.558, 0 ),
		debug			: false
	} );

	this.colliderBoxes.push( box5 );

};

proto.createColliderBalls = function () {

	var sizeBall		= [ 6, 6, 6 ],
		rotationBall	= [ 0, 0, 0 ],
		configBall		= [ 10, 0.4, 0.2 ];

	this.createColliderBall( sizeBall, [ -148.5, -64, -202.5 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ -120.5, -64, -187.5 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ -132.5, -64, -170 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ -81, -64, -188 ] , rotationBall, configBall );

	this.createColliderBall( sizeBall, [ -21, -64, -173 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ -20, -64, -203 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ 15, -64, -198.5 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ 8.5, -64, -224.5 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ 67.5, -64, -179.5 ] , rotationBall, configBall );

	this.createColliderBall( sizeBall, [ 130.5, -64, -116.5 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ 113.5, -64, -96 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ 133.5, -64, -42 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ 113.5, -64, -33.5 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ 225.5, -64, -98 ] , rotationBall, configBall );

	this.createColliderBall( sizeBall, [ -205.5, -64, -132.5 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ -224, -64, -110.5 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ -207, -64, -97 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ -174.5, -64, -99 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ -211.5, -64, -61.5 ] , rotationBall, configBall );

	this.createColliderBall( sizeBall, [ 54, -64, 122 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ 27, -64, 149 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ -28, -64, 131 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ -45, -64, 157.5 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ -73.5, -64, 108.5 ] , rotationBall, configBall );
	this.createColliderBall( sizeBall, [ 87.5, -64, 225.5 ] , rotationBall, configBall );
};

proto.createColliderBall = function ( sizeBall, positionBall , rotationBall, configBall, createCheckMesh ) {

	var body = new OIMO.Body( {

			type	: 'sphere',
			size	: sizeBall,
			pos		: positionBall,
			rot		: rotationBall,
			move	: false, world : this.world, config : configBall
		} );

	if ( createCheckMesh ) {

		var checkMesh = this.addStaticCheckSphere( sizeBall, positionBall, rotationBall, body );
		this.controller.positionHelper.setMesh( checkMesh );
	}
};

proto.createElements = function () {

	this.buffgeoSphere = new THREE.BufferGeometry();
	this.buffgeoSphere.fromGeometry( new THREE.SphereGeometry( 1 , 32, 32 ) );

	this.buffgeoBox = new THREE.BufferGeometry();
	this.buffgeoBox.fromGeometry( new THREE.BoxGeometry( 1, 1, 1 ) );

	this.matSphere = new THREE.MeshLambertMaterial( { map: this.createBasicTexture(0), name:'sph' } );
	this.matBox = new THREE.MeshLambertMaterial( {  map: this.createBasicTexture(2), name:'box' } );
	this.matSphereSleep = new THREE.MeshLambertMaterial( { map: this.createBasicTexture(1), name:'ssph' } );
	this.matBoxSleep = new THREE.MeshLambertMaterial( {  map: this.createBasicTexture(3), name:'sbox' } );
	this.matGround = new THREE.MeshLambertMaterial( { color: 0xffffff } );
	this.matGroundColor = new THREE.MeshLambertMaterial( { color: 0xff0000, transparent:true, opacity:0.0 } );
	this.matGroundWin = new THREE.MeshLambertMaterial( { color: 0x00ff00, transparent:true, opacity:0.75, name: 'win' } );
	this.matGroundTrans = new THREE.MeshLambertMaterial( { color: 0xffffff, transparent:true, opacity:0.0 } );
};

proto.createPhysics = function () {

	// OIMO.Euler.DefaultOrder = 'YZX';

	this.world = new OIMO.World( 1/60, 2 );

	this.populate();
};

proto.populate = function ( n ) {

	// Is all the physics setting for rigidbody
	var config = [ 10, 0.4, 0.2 ];

	//add ground
	new OIMO.Body( { size : [ 1095.6, 5, 1131.4 ], pos : [ 23.138, -71, 32.798 ], rot : [ 0, 0, 0 ], world : this.world, config : config } );
	this.addFloor( [ 1095.6, 5, 1131.4 ], [ 23.138, -71, 32.798 ], [ 0, 0, 0 ] );

	new OIMO.Body({size:[1200, 5, 1200], pos:[500,290,0], rot:[0, 0, 90], world:this.world, config:config});
	// this.addStaticBox([1200, 5, 1200], [500,290,0], [0, 0, 90], false, false, true);

	new OIMO.Body({size:[1200, 5, 1200], pos:[-500,290,0], rot:[0, 0, 90], world:this.world, config:config});
	// this.addStaticBox([1200, 5, 1200], [-500,290,0], [0, 0, 90], false, false, true);

	new OIMO.Body({size:[1200, 5, 1200], pos:[0,500,500], rot:[90, 0, 0], world:this.world, config:config});
	// this.addStaticBox([1200, 5, 1200], [0,500,500], [90, 0, 0], false, false, true);

	new OIMO.Body({size:[1200, 5, 1200], pos:[0,500,-500], rot:[90, 0, 0], world:this.world, config:config});
	// this.addStaticBox([1200, 5, 1200], [0,500,-500], [90, 0, 0], false, false, true);
};

proto.addFloor = function ( size, position, rotation ) {

	var buffgeo 	= new THREE.BufferGeometry();
		buffgeo.fromGeometry( new THREE.BoxGeometry( 1, 1, 1, 20, 20, 20 ) );

	var material	= new THREE.MeshBasicMaterial( { map : THREE.ImageUtils.loadTexture( 'assets/texture/shadow.jpg' ), side: THREE.DoubleSide, transparent: false } ),
		mesh		= new THREE.Mesh( buffgeo, material );
		mesh.scale.set( size[0], size[1], size[2] );
		mesh.position.set( position[0], position[1], position[2] );
		mesh.rotation.set( THREE.Math.degToRad( rotation[0] ), THREE.Math.degToRad( rotation[1] ), THREE.Math.degToRad( rotation[2] ) );
		mesh.receiveShadow = true;

	this.scene.add( mesh );
};

proto.addStaticBox = function (size, position, rotation, color, isWin, spec) {

	var mesh;

	if ( isWin ) mesh = new THREE.Mesh( this.buffgeoBox, this.matGroundWin );
	else if ( color ) mesh = new THREE.Mesh( this.buffgeoBox, this.matGroundColor );
	else if ( spec ) mesh = new THREE.Mesh( this.buffgeoBox, this.matGroundTrans );
	else mesh = new THREE.Mesh( this.buffgeoBox, this.matGround );

	mesh.scale.set( size[0], size[1], size[2] );
	mesh.position.set( position[0], position[1], position[2] );
	mesh.rotation.set( THREE.Math.degToRad( rotation[0] ), THREE.Math.degToRad( rotation[1] ), THREE.Math.degToRad( rotation[2] ) );

	this.scene.add( mesh );
	this.grounds.push(mesh);
	if ( spec ) {

	} else {

		// mesh.castShadow = true;
		// mesh.receiveShadow = true;
	}

	return mesh;
};


proto.update = function () {

	this.world.step();

	var p, r, m, x, y, z;
	var mtx = new THREE.Matrix4();
	var i = this.bodys.length;
	var mesh;
	var body;

	// TODO: bad window reference
	var colliderName = window.gameState.getCurrentCollider();

	var allSleeping = true;

	while (i--) {

		body = this.bodys[i].body;


		// FIX: force angular velocity to reduce
		if ( window.gameState.getCurrentType() === GameState.Types.BALL || window.gameState.getCurrentType() === GameState.Types.SOCCER ) {

			body.angularVelocity.x *= 0.00000000000000001;
			body.angularVelocity.y *= 0.00000000000000001;
			body.angularVelocity.z *= 0.00000000000000001;
		}

		if ( this.bodys[i].name !== '' ) {

			if ( this.world.checkContact( this.bodys[i].name, colliderName ) ) {

				this.isInTimes++;
				if ( this.isInTimes === 30 ) {

					window.gameState.changeState( GameState.States.PLAY );

					// console.log( 'INSIDE', colliderName );
					window.gameState.nextTarget();
					this.isInTimes = 0;
					this.isThrowing = false;
					clearTimeout( this.throwSto );
				}
			}

		}

		if ( !body.sleeping ) {

			allSleeping = false;

			mesh = this.meshes[ i ];
			var position	= body.getPosition(),
				quaternion	= body.getQuaternion();

			if ( mesh.length === 2 ) {

				mesh[ 0 ].position.copy( position );
				mesh[ 0 ].quaternion.copy( quaternion );
				mesh[ 1 ].position.copy( position );
				mesh[ 1 ].quaternion.copy( quaternion );

			} else {

				mesh.position.copy( position );
				mesh.quaternion.copy( quaternion );

			}
		}
	}

	if ( allSleeping && this.isThrowing ) {

		window.gameState.changeState( GameState.States.PLAY );

		// console.log( 'FAIL' );
		this.isThrowing = false;
		clearTimeout( this.throwSto );
		window.gameState.removeLife();

	}

	if ( this.bodys.length > 0 && this.world.numContacts > this.numContacts ) {


		// console.log( 'CONTACT' );
		this.numContacts = this.world.numContacts;

		this.controller.audioController.playHitFx( window.gameState.getCurrentElementNumber() );
	}



};


proto.checkThrowing = function () {

	// console.warn( 'THROW end because of time' );
	this.isThrowing = false;
	window.gameState.changeState( GameState.States.PLAY );
	window.gameState.removeLife();
};


proto.clearMeshes = function (){

	var i=this.meshes.length;
	while (i--) this.scene.remove(this.meshes[ i ]);
	// i = this.grounds.length;
	// while (i--) this.scene.remove(this.grounds[ i ]);
	// this.grounds = [];
	this.meshes = [];

	var i=this.bodys.length;
	while (i--) {

		this.world.removeRigidBody(this.bodys[ i ].body);
		this.bodys[ i ] = null;
	}
	this.bodys = [];
};

proto.setGravity = function ( g ) {

	this.world.gravity = new OIMO.Vec3(0, g, 0);
};

//----------------------------------
//  TEXTURES
//----------------------------------

proto.createGradientTexture = function ( color ) {

	var c = document.createElement("canvas");
	var ct = c.getContext("2d");
	c.width = 16; c.height = 256;
	var gradient = ct.createLinearGradient(0,0,0,256);
	var i = color[0].length;
	while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
	ct.fillStyle = gradient;
	ct.fillRect(0,0,16,256);
	var texture = new THREE.Texture(c);
	texture.needsUpdate = true;
	return texture;
};

proto.createBasicTexture = function ( n ) {

	var canvas = document.createElement( 'canvas' );
	canvas.width = canvas.height = 64;
	var ctx = canvas.getContext( '2d' );
	var colors = [];
	if(n===0){ // sphere
		colors[0] = "#cccccc";
		colors[1] = "#cccccc";
	}
	if(n===1){ // sphere sleep
		colors[0] = "#fbfbfb";
		colors[1] = "#fbfbfb";
	}
	if(n===2){ // box
		colors[0] = "#cccccc";
		colors[1] = "#cccccc";
	}
	if(n===3){ // box sleep
		colors[0] = "#cccccc";
		colors[1] = "#cccccc";
	}
	ctx.fillStyle = colors[0];
	ctx.fillRect(0, 0, 64, 64);
	ctx.fillStyle = colors[1];
	ctx.fillRect(0, 0, 32, 32);
	ctx.fillRect(32, 32, 32, 32);

	var tx = new THREE.Texture(canvas);
	tx.needsUpdate = true;
	return tx;
};



//----------------------------------
//  Events
//----------------------------------

proto.addEventListeners = function () {

	// this.controller.containerEl.addEventListener( 'click', this.onClick.bind( this ), false );

	this.throwController.signals.throwed.add( this.onThrowed, this );

	this.controller.signals.updated.add( this.update, this );
};

proto.onThrowed = function ( angle, strength ) {


	// 1. The position is the camera position but closer to the ground ( ground = -70 )
	var position	= this.controller.camera.position.clone();
		position.y	= -50;

	// 2. The direction is calculated from the camera to the scene center
	// and we use the angle to calculate the Y value for the direction
	var direction				= this.controller.center.clone().sub( this.controller.camera.position ).normalize(),
		directionInc			= direction.clone(),
		directionNormalizedY	= THREE.Math.mapLinear( angle, 0, 90, 0.5, 2.0 );

	direction.y = directionNormalizedY;

	// 3. Finally we use the strength for multiplying the scalar of the direction
	var directionScalar = THREE.Math.mapLinear( strength, 0, 100, 0.001, 0.010),
		incScalar		= ( window.gameState.getCurrentType() === GameState.Types.BALL )? 1 : ( window.gameState.getCurrentType() === GameState.Types.SOCCER )? 3.25 : ( window.gameState.getCurrentType() === GameState.Types.BOOK )? 3.0 : ( window.gameState.getCurrentType() === GameState.Types.RUBIK )? 0.5 : 2.0;// 2.0; // 4
	direction = direction.multiplyScalar( directionScalar * incScalar );


	var config	= [ 1.0, 0.4, 0.2 ],
		body	= null,
		mesh	= null,
		mesh2	= null;

	if ( window.gameState.getCurrentType() === GameState.Types.BALL ) {

		body = new OIMO.Body( {
				type:'sphere',
				size:[ 7.2, 7.2, 7.2 ],
				pos:[position.x, position.y, position.z],
				rot:[ THREE.Math.randInt( -20, 20 ), THREE.Math.randInt( 0, 90 ), THREE.Math.randInt( 0, 90 ) ],
				move:true, world:this.world, config:config, name: 'ball-' + this.numBall
			} );

		mesh = this.controller.addBall();
		mesh.position.set( new THREE.Vector3( position.x, position.y, position.z ) );
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		// mesh2 = this.addStaticCheckSphere( [ 7, 7, 7 ], [position.x, position.y, position.z], [ 0,0,0 ], body );
		// mesh2.position.copy( position );

	} else if ( window.gameState.getCurrentType() === GameState.Types.SOCCER ) {

		body = new OIMO.Body( {
				type:'sphere',
				size:[ 10.55, 10.55, 10.55 ],
				pos:[position.x, position.y, position.z],
				rot:[ THREE.Math.randInt( -20, 20 ), THREE.Math.randInt( 0, 90 ), THREE.Math.randInt( 0, 90 ) ],
				move:true, world:this.world, config:[ 1.0, 0.8, 0.9 ], name: 'ball-' + this.numBall
			} );

		mesh = this.controller.addSoccer();
		mesh.position.x = position.x;
		mesh.position.y = position.y;
		mesh.position.z = position.z;
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		// mesh2 = this.addStaticCheckSphere( [ 10.3, 10.3, 10.3 ], [position.x, position.y, position.z], [ 0,0,0 ], body );
		// mesh2.position.copy( position );

	} else if ( window.gameState.getCurrentType() === GameState.Types.BOOK ) {

		body = new OIMO.Body( {
			type:'box',
			size:[ 16, 6, 24 ],
			pos:[position.x, position.y, position.z],
			rot:[ THREE.Math.randInt( -20, 20 ), THREE.Math.randInt( 0, 90 ), THREE.Math.randInt( 0, 90 ) ],
			move:true, world:this.world, config:[ 2.0, 0.9, 0.2 ], name: 'ball-' + this.numBall } );

		mesh = this.controller.addBook();
		mesh.position.x = position.x;
		mesh.position.y = position.y;
		mesh.position.z = position.z;
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		// mesh2 = this.addStaticCheckBox( [ 16, 6, 24 ], [position.x, position.y, position.z], [ 0,0,0 ], body );
		// mesh2.position.copy( position );

	} else if ( window.gameState.getCurrentType() === GameState.Types.RUBIK ) {

		body = new OIMO.Body( {
			type:'box',
			size:[ 10, 10, 10 ],
			pos:[position.x, position.y, position.z],
			rot:[ THREE.Math.randInt( -20, 20 ), THREE.Math.randInt( 0, 90 ), THREE.Math.randInt( 0, 90 ) ],
			move:true, world:this.world, config:[ 1.0, 0.9, 0.2 ], name: 'ball-' + this.numBall } );

		mesh = this.controller.addRubik();
		mesh.position.set( new THREE.Vector3( position.x, position.y, position.z ) );
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		// mesh2 = this.addStaticCheckBox( [ 9.58, 9.58, 9.58 ], [position.x, position.y, position.z], [ 0,0,0 ], body );
		// mesh2.position.copy( position );

	} else {

		body = new OIMO.Body( {

			type	: 'box',
			size	: [ 4.5 * 3 , 9.75 * 3, 4 ],
			pos		: [ position.x, position.y, position.z ],
			rot		: [ THREE.Math.randInt( -20, 20 ), THREE.Math.randInt( 0, 90 ), THREE.Math.randInt( 0, 90 ) ],
			move:true, world:this.world, config: [ 2.0, 0.9, 0.2 ], name: 'ball-' + this.numBall
		} );

		mesh = this.controller.addCane();
		mesh.position.set( new THREE.Vector3( position.x, position.y, position.z ) );
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		// mesh2 = this.addStaticCheckBox( [ 4.5 * 3, 9.75 * 3, 4 ], [ 0, 0, 0], [ 0,0,0 ], body );
		// mesh2.position.copy( position );
	}


	body.body.applyImpulse( position, direction );
	body.body.angularVelocity.x = 0;
	body.body.angularVelocity.y = 0;
	body.body.angularVelocity.z = 0;

	window.gameState.changeState( GameState.States.HOLD );

	if ( mesh2 !== null ) this.meshes.push( [ mesh, mesh2 ] );
	else this.meshes.push( mesh );

	this.bodys.push( body );

	// var tOut = ( this.numBall === 0 )? 200 : 200;

	// setTimeout( ( function () {

		this.scene.add( mesh );
		if ( mesh2 !== null ) this.scene.add( mesh2 );
		this.numBall++;

		this.isThrowing = true;
		clearTimeout( this.throwSto );
		this.throwSto = setTimeout( this.checkThrowing.bind( this ), 3000 );

	// } ).bind( this ), tOut );

};
