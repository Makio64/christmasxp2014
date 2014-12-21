// ------------------------------------------
// ThrowUI.js
// ------------------------------------------
//
// Angle & strenth calculator.
//
// Simplified to show only one strength progress bar
// but still using angle on the background.
//
// There is a canvas previewer of the values
// that has to be enabled to use ( disabled for performance )
//
// ------------------------------------------


'use strict';

var ThrowUI = function ( opts ) {

	this.controller			= opts.controller;

	this.menuEls			= null;
	this.infoEls			= null;
	this.angleEl			= null;
	this.strengthEl			= null;
	this.strengthPositionEl	= null;
	this.strengthHelperEl	= null;
	this.gradientLeftEl		= null;
	this.gradientRightEl	= null;
	this.menuUpEl			= null;
	this.boxPointerEl		= null;

	this.isKeyDown			= false;
	this.isPlaying			= false;

	this.parentEl			= opts.parentEl || document.body;

	this.state				= ThrowUI.States.SELECT_ANGLE;

	this.movingAngle		= false;
	this.movingStrength		= false;

	this.angleCtx			= null;
	this.angleMin			= 20;
	this.angleMax			= 45;
	this.angleStep			= ( this.angleMax - this.angleMin ) / 100;
	this.angle				= this.angleMin;
	this.angleUp			= true;

	this.strengthCtx		= null;
	this.strengthMin		= 20;
	this.strengthMax		= 100;
	this.strengthStep		= ( this.strengthMax - this.strengthMin ) / 100;
	this.strength			= this.strengthMin;
	this.strengthUp			= true;

	this.hasHelper			= true;
	this.hasCanvas			= false;

	this.signals			= {

		stateChanged	: new signals.Signal(),
		throwed			: new signals.Signal()
	};

	this.bindedMethods		= {

		onKeyDown	: this.onKeyDown.bind( this ),
		onKeyUp		: this.onKeyUp.bind( this )
	};

	this.init();
};

ThrowUI.States = {

	SELECT_ANGLE	: 'THROW_SELECT_ANGLE',
	SELECT_STRENGTH	: 'THROW_SELECT_STRENGTH',
	THROWING		: 'THROW_THROWING'
}

var proto = ThrowUI.prototype;

proto.init = function () {

	this.setDomEls();

	if ( this.hasCanvas ) {

		this.setupCanvas();
		setTimeout( this.draw.bind( this ), 100 );
	}

	if ( this.isPlaying ) this.addEventListeners();
};

proto.setDomEls = function () {

	this.menuEls			= document.querySelectorAll( '#menu a' );
	this.infoEls			= document.querySelectorAll( '#info div' );
	this.angleEl			= document.querySelector( '.angle-canvas' );
	this.strengthEl			= document.querySelector( '.strength-canvas' );
	this.strengthPositionEl	= document.querySelector( '#strength-position' );
	this.strengthHelperEl	= document.querySelector( '#strength-helper' );
	this.gradientRightEl	= document.querySelector( '.gradient-right' );
	this.menuUpEl			= document.querySelector( '.up-block' );
	this.boxPointerEl		= document.querySelector( '#arrow-pointer-box' );
};


// Canvas
// ---------------------------------------------------

proto.setupCanvas = function () {

	if ( !this.hasCanvas ) return;

	this.angleCtx			= this.angleEl.getContext( '2d' );
	this.angleEl.width		= 100;
	this.angleEl.height		= 100;

	this.strengthCtx		= this.strengthEl.getContext( '2d' );
	this.strengthEl.width	= 100;
	this.strengthEl.height	= 100;
};

proto.clearCanvas = function ( ctx ) {

	if ( !this.hasCanvas ) return;

	ctx.clearRect( 0, 0, 100, 100 );
};


// Events
// ---------------------------------------------------

proto.addEventListeners = function () {

	this.parentEl.addEventListener( 'keydown', this.bindedMethods.onKeyDown, false );
	this.parentEl.addEventListener( 'keyup', this.bindedMethods.onKeyUp, false );
};

proto.removeEventListeners = function () {

	this.parentEl.removeEventListener( 'keydown', this.bindedMethods.onKeyDown, false );
	this.parentEl.removeEventListener( 'keyup', this.bindedMethods.onKeyUp, false );
};

proto.onKeyDown = function ( event ) {

	if ( this.controller.gameState.state === GameState.States.PLAY ) {

		if ( event.keyCode === 32 && !this.isKeyDown && !this.controller.gameState.isBlocked ) {

			event.preventDefault();

			this.isKeyDown = true;

			this.startAngle();
			this.startStrength();

			this.menuUpEl.classList.add( 'hold' );
			this.boxPointerEl.classList.remove( 'active' );
		}
	}
};

proto.onKeyUp = function ( event ) {

	if ( this.controller.gameState.state === GameState.States.PLAY ) {

		if ( event.keyCode === 32 && this.isKeyDown ) {

			event.preventDefault();

			this.isKeyDown = false;

			this.endAngle();
			this.endStrength();
		}
	}
};


// State
// ---------------------------------------------------

proto.changeState = function ( newState ) {

	if ( this.state !== newState ) {

		var oldState = this.state;
		this.state = newState;

		this.signals.stateChanged.dispatch( newState, oldState );

		if ( this.state === ThrowUI.States.THROWING ) {

			this.throw();
		}
	}
};

proto.play = function () {

	if ( !this.isPlaying ) {

		this.isPlaying = true;
		this.addEventListeners();
	}
};

proto.pause = function () {

	if ( this.isPlaying ) {

		this.isPlaying = false;
		this.removeEventListeners();
	}
};

// Angle
// ---------------------------------------------------

proto.startAngle = function () {

	if ( !this.movingAngle ) {

		this.movingAngle = true;
		this.angle = this.angleMin;
	}
};

proto.endAngle = function () {

	if ( this.movingAngle ) {

		this.movingAngle = false;
		this.changeState( ThrowUI.States.SELECT_STRENGTH );
	}
};

proto.updateAngle = function () {

	if ( this.angleUp ) this.updateIncAngle();
	else this.updateDecAngle();

	this.drawAngle();
};

proto.updateIncAngle = function () {

	this.angle += this.angleStep;
	if ( this.angle >= this.angleMax ) {

		this.angle		= this.angleMax;
		this.angleUp	= false;
	}
};

proto.updateDecAngle = function () {

	this.angle -= this.angleStep;
	if ( this.angle <= this.angleMin ) {

		this.angle		= this.angleMin;
		this.angleUp	= true;
	}
};

proto.resetAngle = function () {

	TweenMax.to( this, 0.5, {

		angle		: this.angleMin,
		ease		: Power2.easeInOut,
		onUpdate	: this.drawAngle.bind( this )
	} );
};

proto.drawAngle = function () {

	if ( this.hasHelper ) this.drawAngleHelper( this.controller.gameState.getCurrentHelperAngle() );

	if ( this.hasCanvas ) {

		this.clearCanvas( this.angleCtx );
		this.drawAngleCurrent( this.angle );
	}
};

proto.drawAngleHelper = function ( angle ) {

	if ( !this.hasCanvas ) return;

	this.angleCtx.fillStyle = '#cc0000';

	this.angleCtx.save();
	this.angleCtx.translate( 0, 99 );
	this.angleCtx.rotate( -THREE.Math.degToRad( angle ) );
	this.angleCtx.translate( 0, -99 );
	this.angleCtx.beginPath();
	this.angleCtx.rect( 0, 99, 200, 2 );
	this.angleCtx.fill();
	this.angleCtx.restore();
};

proto.drawAngleCurrent = function ( angle ) {

	if ( !this.hasCanvas ) return;

	this.angleCtx.fillStyle = '#ffffff';

	this.angleCtx.save();
	this.angleCtx.translate( 0, 98 );
	this.angleCtx.rotate( -THREE.Math.degToRad( angle ) );
	this.angleCtx.translate( 0, -98 );
	this.angleCtx.beginPath();
	this.angleCtx.rect( 0, 98, 200, 4 );
	this.angleCtx.fill();
	this.angleCtx.restore();
};


// Strength
// ---------------------------------------------------

proto.startStrength = function () {

	if ( !this.movingStrength ) {

		this.movingStrength = true;
		this.strength = this.strengthMin;
	}
};

proto.endStrength = function () {

	if ( this.movingStrength ) {

		this.movingStrength = false;
		this.changeState( ThrowUI.States.THROWING );
	}
};

proto.updateStrength = function () {

	if ( this.strengthUp ) this.updateIncStrength();
	else this.updateDecStrength();

	this.drawStrength();
};

proto.updateIncStrength = function () {

	this.strength += this.strengthStep;
	if ( this.strength >= this.strengthMax ) {

		this.strength = this.strengthMax;
		this.strengthUp	= false;
	}
};

proto.updateDecStrength = function () {

	this.strength -= this.strengthStep;
	if ( this.strength <= this.strengthMin ) {

		this.strength = this.strengthMin;
		this.strengthUp	= true;
	}
};

proto.resetStrength = function () {

	TweenMax.to( this, 0.5, {

		strength	: this.strengthMin,
		ease		: Power2.easeInOut,
		onUpdate	: this.drawStrength.bind( this )
	})
};

proto.drawStrength = function () {

	if ( this.hasHelper ) this.drawStrengthHelper( this.controller.gameState.getCurrentHelperStrength() );

	if ( this.hasCanvas ) {

		this.clearCanvas( this.strengthCtx );
		this.drawStrengthCurrent( this.strength );
	}

	// gradient has to move 162px
	var gradientPos = THREE.Math.mapLinear( this.strength, this.strengthMin, this.strengthMax, 0, 162 );
	TweenMax.set( this.gradientRightEl, { x : gradientPos } );

	var strengthPos = THREE.Math.mapLinear( this.strength, this.strengthMin, this.strengthMax, 0, 122 );
	TweenMax.set( this.strengthPositionEl, { x : strengthPos } );
};

proto.drawStrengthHelper = function ( strength ) {

	var strengthPos = THREE.Math.mapLinear( strength, this.strengthMin, this.strengthMax, 0, 122 );
	TweenMax.set( this.strengthHelperEl, { x : strengthPos } );


	if ( this.hasCanvas ) {

		var width = THREE.Math.mapLinear( strength, this.strengthMin, this.strengthMax, 0, 100 );

		this.strengthCtx.fillStyle = '#cc0000';
		this.strengthCtx.beginPath();
		this.strengthCtx.rect( 0, 48, width, 2 );
		this.strengthCtx.fill();
	}
};

proto.drawStrengthCurrent = function ( strength ) {

	if ( !this.hasCanvas ) return;

	var width = THREE.Math.mapLinear( strength, this.strengthMin, this.strengthMax, 0, 100 );

	this.strengthCtx.fillStyle = '#ffffff';
	this.strengthCtx.beginPath();
	this.strengthCtx.rect( 0, 45, width, 10 );
	this.strengthCtx.fill();
};


// Generic API draw
// ---------------------------------------------------

proto.draw = function () {

	this.drawAngle();
	this.drawStrength();

};


// Throw
// ---------------------------------------------------

proto.throw = function () {

	this.signals.throwed.dispatch( this.angle, this.strength );
	setTimeout( this.endThrow.bind( this ), 1000 );
};

proto.endThrow = function () {

	this.resetAngle();
	this.resetStrength();
	this.changeState( ThrowUI.States.SELECT_ANGLE );
};


// Update
// ---------------------------------------------------

proto.update = function () {

	if ( this.movingAngle ) this.updateAngle();
	if ( this.movingStrength ) this.updateStrength();
};


// Hints
// ---------------------------------------------------

proto.showHints = function () {

	this.strengthHelperEl.classList.add( 'active' );
};

proto.hideHints = function () {

	this.strengthHelperEl.classList.remove( 'active' );
};



