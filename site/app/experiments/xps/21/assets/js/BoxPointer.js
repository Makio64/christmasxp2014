// ------------------------------------------
// BoxPointer.js
// ------------------------------------------
//
// Indicator of the current box.
//
// It stores a Vector3 position and calculates
// the 2D position to show the indicator.
//
// ------------------------------------------


'use strict';

var BoxPointer = function ( opts ) {

	this.id				= opts.id;
	this.controller		= opts.controller;
	this.scene			= opts.scene || this.controller.scene;
	this.centerBox		= opts.centerBox;
	this.heightBox		= opts.heightBox;
	this.arrowPointerEl = opts.arrowEl;
	this.position		= null;

	this.mesh			= null;
	this.active			= false;

	this.widthHalf		= this.controller.vsize.w * 0.5;
	this.heightHalf		= this.controller.vsize.h * 0.5;

	this.init();
};

var proto = BoxPointer.prototype;

proto.init = function () {

	this.createPosition();
};

proto.createPosition = function () {

	this.position	= this.centerBox.clone();
	this.position.y	+= ( this.heightBox + 20 );
};


// On / Off
//----------------------------------

proto.activate = function () {

	this.active = true;
};

proto.deactivate = function () {

	this.active = false;
};


// Update & resize
//----------------------------------

proto.update = function ( hasCameraMoved ) {

	if ( this.active ) {

		if ( hasCameraMoved ) {

			var pos = this.getPosition2D();
			TweenMax.set( this.arrowPointerEl, {

				x : pos.x,
				y : pos.y
			} );
		}
	}
};

proto.resize = function () {

	this.widthHalf		= this.controller.vsize.w * 0.5;
	this.heightHalf		= this.controller.vsize.h * 0.5;
};


// 2D position
//----------------------------------

proto.getPosition2D = function () {

	var vector = new THREE.Vector3( this.position.x, this.position.y, this.position.z );
		vector.project( this.controller.camera );
		vector.x = Math.round( (   vector.x + 1 ) * this.widthHalf ),
		vector.y = Math.round( ( - vector.y + 1 ) * this.heightHalf );

	return vector;
};