
'use strict';

var ColliderBox = function ( opts ) {

	this.scene			= opts.scene;
	this.controller		= opts.controller;
	this.world			= opts.world;

	this.size			= opts.size;
	this.position		= opts.position;
	this.rotation		= opts.rotation;
	this.positionOpen	= opts.positionOpen;
	this.rotationOpen	= opts.rotationOpen;

	this.debug			= opts.debug || false;

	this.id				= 'collider-' + ( opts.id || '0' );

	this.physicsConfig	= [ 10, 0.4, 0.2 ];

	this.bottom			= null;
	this.side1			= null;
	this.side2			= null;
	this.side3			= null;
	this.side4			= null;
	this.boxContainer	= null;

	this.lidPhysics		= null;
	this.lidObject3D	= null;
	this.lidSize		= null;
	this.lidPos			= null;
	this.lidRot			= null;

	this.geometry		= null;
	this.material		= null;

	this.init();
};

var proto = ColliderBox.prototype;

proto.init = function () {

	this.createGeometryAndMaterial();
	this.createBoxes();
	this.createPhysicsBoxes();
};

proto.createGeometryAndMaterial = function () {

	this.geometry = new THREE.BufferGeometry();
	this.geometry.fromGeometry( new THREE.BoxGeometry( 1, 1, 1 ) );

	this.material = new THREE.MeshLambertMaterial( {

		color		: 0x0000ff,
		transparent	: true,
		opacity		: 1.0,
		side		: THREE.DoubleSide

	} );
};

proto.createBoxes = function ( ) {

	this.boxContainer = new THREE.Object3D();

	this.bottom = this.addStaticBox( [ this.size.x - 3, 1, this.size.z - 3 ], [ 0, 0, 0 ], [ 0, 0, 0] );
	this.bottom.userData.id = this.id;

	this.side1 = this.addStaticBox( [ this.size.y, 1, this.size.z ], [ -this.size.x * 0.5, this.size.y * 0.5, 0 ], [ 0, 0, 90 ] );
	this.side2 = this.addStaticBox( [ this.size.y, 1, this.size.z ], [ this.size.x * 0.5, this.size.y * 0.5, 0 ], [ 0, 0, 90 ] );
	this.side3 = this.addStaticBox( [ this.size.x, 1, this.size.y ], [ 0, this.size.y * 0.5, -this.size.z * 0.5 ], [ 90, 0, 0 ] );
	this.side4 = this.addStaticBox( [ this.size.x, 1, this.size.y ], [ 0, this.size.y * 0.5, this.size.z * 0.5 ], [ 90, 0, 0 ] );

	this.boxContainer.position.x = this.position.x;
	this.boxContainer.position.y = this.position.y;
	this.boxContainer.position.z = this.position.z;

	this.boxContainer.rotation.x = this.rotation.x;
	this.boxContainer.rotation.y = this.rotation.y;
	this.boxContainer.rotation.z = this.rotation.z;

	this.boxContainer.visible = false;
	this.boxContainer.updateMatrix();
	this.boxContainer.updateMatrixWorld();

	// if ( this.debug ) this.controller.positionHelper.setMesh( this.boxContainer );

	this.scene.add( this.boxContainer );
};


proto.createPhysicsBoxes = function () {

	// console.log( '----', this.id );

	for ( var i = 0; i < this.boxContainer.children.length; i++ ) {

		// Get the local to world values

		var box		= this.boxContainer.children[ i ],
			pos		= new THREE.Vector3(),
			mat		= new THREE.Matrix4(),
			rot		= new THREE.Euler( 0, 0, 0, 'ZYX' ),
			size	= new THREE.Vector3();

		pos.setFromMatrixPosition( box.matrixWorld );
		rot.setFromRotationMatrix( mat.extractRotation( box.matrixWorld ) );
		size.setFromMatrixScale( box.matrixWorld );

		var sizeArray	= [ size.x, size.y, size.z ],
			rotArray	= [ this.getRotationAngle( rot.x ), this.getRotationAngle( rot.y ), this.getRotationAngle( rot.z ) ],
			posArray	= [ pos.x, pos.y, pos.z ];

		var body = new OIMO.Body( { type : 'box', size : sizeArray, pos : posArray, rot : rotArray, world : this.world, config : this.physicsConfig } );

		if ( box.userData.id && box.userData.id !== '' ) {

			body.body.name = box.userData.id;

			// Create LID
			var sizeLid = [ sizeArray[ 0 ] + 5, 10, sizeArray[ 2 ] + 5 ],
				posLid	= [ posArray[ 0 ], posArray[ 1 ] + this.size.y, posArray[ 2 ] ];

			this.lidSize		= sizeLid;
			this.lidPos			= posLid;
			this.lidRot			= rotArray;

			this.lidPhysics		= new OIMO.Body( { type : 'box', size : sizeLid, pos : posLid, rot : rotArray, world : this.world, config : this.physicsConfig } );
			this.lidObject3D	= this.addStaticBox( sizeLid, posLid, rotArray, true, this.lidPhysics );

			this.lidObject3D.visible = false;

			// if ( this.debug ) this.controller.positionHelper.setMesh( this.lidObject3D );
		}

		// this.addStaticBox( sizeArray, posArray, rotArray, true, body );
	}

	this.scene.remove( this.boxContainer );
};

proto.getRotationAngle = function ( rad ) {

	var deg = THREE.Math.radToDeg( rad );

	return deg;
}

proto.addStaticBox = function ( size, position, rotation, addToScene, body ) {

	var mesh = new THREE.Mesh( this.geometry, this.material );

		mesh.rotation.order = 'ZYX';

		mesh.scale.set( size[0], size[1], size[2] );

	if ( body ) {

		mesh.position.copy( body.getPosition() );
		mesh.quaternion.copy( body.getQuaternion() );

	} else {



		mesh.position.set( position[0], position[1], position[2] );
		mesh.rotation.set( THREE.Math.degToRad( rotation[0] ), THREE.Math.degToRad( rotation[1] ), THREE.Math.degToRad( rotation[2] ) );
	}

	if ( !addToScene ) this.boxContainer.add( mesh );
	else this.scene.add( mesh );

	return mesh;
};

proto.openLid = function () {

	// Update the position & rotation of the lid

	this.lidObject3D.position.x = this.positionOpen.x;
	this.lidObject3D.position.y = this.positionOpen.y;
	this.lidObject3D.position.z = this.positionOpen.z;

	this.lidObject3D.rotation.x = this.rotationOpen.x;
	this.lidObject3D.rotation.y = this.rotationOpen.y;
	this.lidObject3D.rotation.z = this.rotationOpen.z;

	this.lidObject3D.updateMatrix();
	this.lidObject3D.updateMatrixWorld();

	var mat	= new THREE.Matrix4(),
		rot	= new THREE.Euler( 0, 0, 0, 'ZYX' );
		rot.setFromRotationMatrix( mat.extractRotation( this.lidObject3D.matrixWorld ) );

	this.world.removeRigidBody( this.lidPhysics.body );
	this.lidPhysics = new OIMO.Body( { type : 'box', size : this.lidSize, pos : [ this.positionOpen.x, this.positionOpen.y, this.positionOpen.z ], rot : [ this.getRotationAngle( rot.x ), this.getRotationAngle( rot.y ), this.getRotationAngle( rot.z ) ], world : this.world, config :  this.physicsConfig } );

    if ( this.lidObject3D !== null ) {

		this.lidObject3D.position.copy( this.lidPhysics.getPosition() );
		this.lidObject3D.quaternion.copy( this.lidPhysics.getQuaternion() );
    }
};

proto.closeLid = function () {

	this.world.removeRigidBody( this.lidPhysics.body );
	this.lidPhysics = new OIMO.Body( { type : 'box', size : this.lidSize, pos : this.lidPos, rot : this.lidRot, world : this.world, config : this.physicsConfig } );

    if ( this.lidObject3D !== null ) {

		this.lidObject3D.position.copy( this.lidPhysics.getPosition() );
		this.lidObject3D.quaternion.copy( this.lidPhysics.getQuaternion() );
    }
};


proto.update = function () {

};
