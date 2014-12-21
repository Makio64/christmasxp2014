// ------------------------------------------
// PositionHelper.js
// ------------------------------------------
//
// Helper to position the OimoJS colliders
//
// This reminds me that I want to make a decision
// for a physics engine to use and then spend
// some time writing a good wrapper for Three.
//
// Terrible amount of time positioning colliders!
//
// ------------------------------------------


'use strict';

var PositionHelper = function ( opts ) {

	this.controller			= opts.controller;

	this.selectedMesh		= null;
	this.originalPosition	= new THREE.Vector3();
	this.incPosition		= new THREE.Vector3();
	this.incStep			= 0.5;
	this.rotStep			= THREE.Math.degToRad( 1 );

	this.init();
};

var proto = PositionHelper.prototype;

proto.init = function () {

	// Only available if we are in devs mode
	if ( this.controller.developmentMode ) {

		this.addEventListeners();
	}
};


//  Events
//----------------------------------

proto.addEventListeners = function () {

	document.addEventListener( 'keydown', this.onKeyDown.bind( this ), false );
};

proto.onKeyDown = function ( event ) {

	var inc	= new THREE.Vector3(),
		rot = new THREE.Vector3();

	switch ( event.keyCode ) {

		case 83 : // 'S' speed

			this.incStep = ( this.incStep === 0.5 )? 2.0 : 0.5;
			this.rotStep = ( this.rotStep === THREE.Math.degToRad( 1 ) )? THREE.Math.degToRad( 5 ) : THREE.Math.degToRad( 1 );

			break;

		case 37 : // Left

			inc.x -= this.incStep;
			break;

		case 39 : // Right

			inc.x += this.incStep;
			break;

		case 38 : // Up

			inc.z -= this.incStep;
			break;

		case 40 : // Down

			inc.z += this.incStep;
			break;

		case 81 : // Y-up

			inc.y += this.incStep;
			break;

		case 65 : // Y-Down

			inc.y -= this.incStep;
			break;

		case 32 : // Space

			this.logMesh();
			break;

		case 188 : // rotY Dec

			rot.y -= this.rotStep;
			break;

		case 190 : // rotY Inc

			rot.y += this.rotStep;
			break;

		case 75 : // rotX Dec

			rot.x -= this.rotStep;
			break;

		case 76 : // rotX Inc

			rot.x += this.rotStep;
			break;

		case 85 : // rotZ Dec

			rot.z -= this.rotStep;
			break;

		case 73 : // rotZ Inc

			rot.z += this.rotStep;
			break;

		case 67 : // (c)olliders

			scene.physics.blenderBoxes.visible = !scene.physics.blenderBoxes.visible;
			break;
	}

	this.updateInc( inc, rot );
	this.updateMesh( inc, rot );
};


//  Mesh selection and update
//----------------------------------

proto.setMesh = function ( mesh ) {

	this.selectedMesh		= mesh;
	this.originalPosition	= mesh.position.clone();
};

proto.updateInc = function ( inc ) {

	this.incPosition.x += inc.x;
	this.incPosition.y += inc.y;
	this.incPosition.z += inc.z;
};

proto.updateMesh = function ( inc, rot ) {

	if ( this.selectedMesh === null ) return;

	this.selectedMesh.position.x += inc.x;
	this.selectedMesh.position.y += inc.y;
	this.selectedMesh.position.z += inc.z;

	this.selectedMesh.rotation.x += rot.x;
	this.selectedMesh.rotation.y += rot.y;
	this.selectedMesh.rotation.z += rot.z;
};


//  Info log
//----------------------------------

proto.logMesh = function () {

	if ( this.selectedMesh === null ) return;

	console.log( 'Original:', this.originalPosition );
	console.log( 'Inc:', this.incPosition );
	console.log( 'Current:', this.selectedMesh.position );
	console.log( 'Rotation:', this.selectedMesh.rotation );
};
