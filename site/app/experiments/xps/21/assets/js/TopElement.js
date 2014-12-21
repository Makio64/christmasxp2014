// ------------------------------------------
// TopElement.js
// ------------------------------------------
//
// Box lid with Collada animation.
// Very simple animation engine.
//
// TODO: The animation engine should not be
// in each instance, abstract that.
//
// ------------------------------------------


'use strict';

var TopElement = function ( opts ) {

	this.id				= opts.id;
	this.controller		= opts.controller;
	this.scene			= opts.scene || this.controller.scene;
	this.url			= opts.url;
	this.mesh			= null;
	this.animations		= [];
	this.numFrames		= [];
	this.currentFrames	= [];
	this.fps			= 25;
	this.sti			= 0;
	this.ready			= false;

	this.isOpen			= false;

	this.signals		= {

		loaded : new signals.Signal()
	};

	this.init();
};

var proto = TopElement.prototype;

proto.init = function () {

	this.preload();
};


// Preload
// ------------------------------------------

proto.preload = function () {

	var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( this.url, this.onPreloaded.bind( this ) );
};

proto.onPreloaded = function ( collada ) {

	var scale		= 2,
		material	= new THREE.MeshBasicMaterial( { map : THREE.ImageUtils.loadTexture( 'assets/texture/paintedDiff.jpg' ), color : 0xfbfbfb, side: THREE.DoubleSide, opacity: 1, transparent: true } );

	this.mesh = collada.scene;

	this.mesh.scale.set( scale, scale, scale );
	this.mesh.position.x = -9.5;
	this.mesh.position.y = -68;
	this.mesh.position.z = 76;

	this.mesh.traverse( function ( child ) {

		if ( child.material !== undefined ) {

			child.material		= new THREE.MeshBasicMaterial( { map : THREE.ImageUtils.loadTexture( 'assets/texture/paintedDiff.jpg' ), color : 0xfbfbfb, side: THREE.DoubleSide, opacity: 1, transparent: true } );
			child.castShadow	= true;
			child.receiveShadow	= true;
		}
	} );

	this.scene.add( this.mesh );

	this.createAnimations( collada.animations );
	this.initAnimations();
	this.addEventListeners();
	this.ready = true;

	this.signals.loaded.dispatch();
};


// Animation engine
// ------------------------------------------

proto.createAnimations = function ( colladaAnimations ) {

	for ( var i = 0; i < colladaAnimations.length; ++i ) {

		var animation = new THREE.KeyFrameAnimation( colladaAnimations[ i ] );
			animation.timeScale = 1;

		this.animations.push( animation );
		this.numFrames.push( 0 );
		this.currentFrames.push( 0 );
	}
};

proto.initAnimations = function () {

	for ( var i = 0; i < this.animations.length; ++i ) {

		var animation	= this.animations[ i ],
			hLength		= animation.hierarchy.length;


		for ( var h = 0; h < hLength; h++ ) {

			var keys	= animation.data.hierarchy[ h ].keys,
				sids	= animation.data.hierarchy[ h ].sids,
				obj		= animation.hierarchy[ h ];

			if ( keys.length && sids ) {

				for ( var s = 0; s < sids.length; s++ ) {

					var sid		= sids[ s ],
						next	= animation.getNextKeyWith( sid, h, 0 );

					if ( next ) next.apply( sid );

				}

				obj.matrixAutoUpdate = false;
				animation.data.hierarchy[ h ].node.updateMatrix();
				obj.matrixWorldNeedsUpdate = true;


				this.numFrames[ i ] = keys.length;
			}
		}

		animation.loop = false;
	}
};

proto.play = function () {

	this.reset();
	this.isOpen = true;

	// Play the animation
	this.sti = setInterval( this.updateAnimation.bind( this ), 1000 / this.fps );

	// Play the audio of the animation
	this.controller.audioController.playTopElementFx( this.id );
};

proto.reset = function () {

	this.isOpen = false;

	for ( var i = 0; i < this.animations.length; ++i ) {

		this.animations[ i ].stop();
		this.animations[ i ].play();
		this.currentFrames[ i ] = 0;
	}

	clearInterval( this.sti );
};

proto.updateAnimation = function () {

	if ( !this.ready ) return;

	var isAnimating = false;

	for ( var i = 0; i < this.animations.length; ++i ) {

		if ( this.currentFrames[ i ] < this.numFrames[ i ] ) {

			isAnimating = true;

			this.currentFrames[ i ]++;
			this.animations[ i ].update( 1 / this.fps );

			if ( this.currentFrames[ i ] === this.numFrames[ i ] ) {

				this.animations[ i ].stop();
			}
		}
	}

	if ( !isAnimating ) {

		clearInterval( this.sti );
	}
};


//  Update ( RAF external )
//----------------------------------

proto.update = function () {

};


//  Events
//----------------------------------

proto.addEventListeners = function () {

	// Helper for dev.
	// use the key 1 to 5 to trigger the lid animation

	if ( this.controller.controller.developmentMode ) {

		document.addEventListener( 'keydown', this.onKeyDown.bind( this ), false );
	}
};


proto.onKeyDown = function ( event ) {

	var keyId = event.keyCode - 48;

	if ( keyId === this.id ) {

		this.play();
	}
};