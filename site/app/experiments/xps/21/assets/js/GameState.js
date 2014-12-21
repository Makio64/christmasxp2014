// ------------------------------------------
// GameState.js
// ------------------------------------------
//
// Game state controller ( ish )
//
// ------------------------------------------

'use strict';

var GameState = function ( opts ) {

	this.livesIconEl		= null;
	this.livesNumberEl		= null;
	this.gradientTopEl		= null;
	this.gradientBottomEl	= null;
	this.canvasContainerEl	= null;
	this.menuUpEl			= null;
	this.msgEl				= null;
	this.msgWinEl			= null;
	this.msgLoseEl			= null;
	this.resetBtnEl			= null;
	this.hintsToggleEl		= null;
	this.boxPointerEl		= null;
	this.blockEl			= null;

	this.lives				= 9
	this.currentTarget		= 0;
	this.totalTargets		= 5;
	this.currentIcon		= 0;
	this.hasHints			= false;

	this.isBlocked			= false;

	this.state				= GameState.States.PLAY;

	this.controller			= opts.controller;
	this.topElements		= this.controller.scene.topElements;
	this.boxPointers		= this.controller.scene.boxPointers;
	this.topColliders		= this.controller.scene.physics.colliderBoxes;

	this.cameraTween		= null;

	this.cameraPositions	= [

		{ h : 241, v : 62, distance : 400 },
		{ h : 142, v : 55.8, distance : 400 },
		{ h : 62, v : 63.5, distance : 400 },
		{ h : -53.1, v : 55, distance : 400 },
		{ h : -67.5, v : 59.5, distance : 400 }
	];

	this.cameraMessagePosition = { h : -80, v : 20, distance : 600 };

	this.helperData			= [

		{ angle : 40, strength : 60.5 },
		{ angle : 47, strength : 60 },
		{ angle : 51, strength : 62 },
		{ angle : 36.5, strength : 53.5 },
		{ angle : 52, strength : 91.5 },
		{ angle : 0, strength : 0 }
	];

	this.type				= [

		GameState.Types.SOCCER,
		GameState.Types.BOOK,
		GameState.Types.CANE,
		GameState.Types.BALL,
		GameState.Types.RUBIK
	];

	this.init();
};

GameState.States = {

	PLAY	: 'GAME_STATE_PLAY',
	WIN		: 'GAME_STATE_WIN',
	LOSE	: 'GAME_STATE_LOSE',
	HOLD	: 'GAME_STATE_HOLD'
};

GameState.Types = {

	SOCCER	: 'GAME_TYPE_SOCCER',
	BALL	: 'GAME_TYPE_BALL',
	CANE	: 'GAME_TYPE_CANE',
	RUBIK	: 'GAME_TYPE_RUBIK',
	BOOK	: 'GAME_TYPE_BOOK'
};

var proto = GameState.prototype;

proto.init = function () {

	this.setDomEls();
	this.setDecoration();
	this.addEventListeners();
};


// Create elements
// ---------------------------------------------------

proto.setDomEls = function () {

	this.livesIconEl		= document.querySelector( '.lives-icon' );
	this.livesNumberEl		= document.querySelector( '.lives-number' );
	this.gradientTopEl		= document.querySelector( '.gradient-up' );
	this.gradientBottomEl	= document.querySelector( '.gradient-down' );
	this.canvasContainerEl	= document.querySelector( '#container' );
	this.menuUpEl			= document.querySelector( '.up-block' );
	this.msgEl				= document.querySelector( '#msg' );
	this.msgWinEl			= this.msgEl.querySelector( '.win' );
	this.msgLoseEl			= this.msgEl.querySelector( '.lose' );
	this.resetBtnEl			= this.msgEl.querySelector( '.reset' );
	this.hintsToggleEl		= document.querySelector( '#hint' );
	this.boxPointerEl		= document.querySelector( '#arrow-pointer-box' );
	this.blockEl			= document.querySelector( '#block-ui' );
};

proto.setDecoration = function () {

	Decoration.init( this.msgEl.querySelector( '.bg' ) );
};


// Events
// ---------------------------------------------------

proto.addEventListeners = function () {

	this.resetBtnEl.addEventListener( 'click', this.onClickReset.bind( this ), false );
	this.hintsToggleEl.addEventListener( 'click', this.onClickHints.bind( this ), false );
};

proto.onClickReset = function ( event ) {

	event.preventDefault();
	this.reset();
};

proto.onClickHints = function ( event ) {

	event.preventDefault();
	this.toggleHints();
};


// Update Target
// ---------------------------------------------------

proto.start = function () {

	this.controller.throwUI.play();
	this.showNext();
};

proto.nextTarget = function () {

	this.currentTarget++;

	if ( this.currentTarget < this.totalTargets ) {

		this.showNext();

	} else {

		this.win();
	}
};

proto.showNext = function () {

	this.blockUI();
	this.gotoCameraPosition( true );
};

proto.showNextEnd = function ( hasEnd ) {

	this.unblockUI();

	if ( !this.topElements[ this.currentTarget ].isOpen ) {

		// Animate lid
		this.topElements[ this.currentTarget ].play();
		this.topColliders[ this.currentTarget ].openLid();

		// Show box pointer
		if ( this.currentTarget > 0 ) this.boxPointers[ this.currentTarget - 1 ].deactivate();
		this.boxPointers[ this.currentTarget ].activate();

		// Draw helpers
		this.controller.throwUI.draw();

		// Update icon
		this.updateIcon();

		this.menuUpEl.classList.remove( 'hold' );
		this.boxPointerEl.classList.add( 'active' );
	}
};

proto.gotoCameraPosition = function ( hasEnd ) {

	var data		= this.cameraPositions[ this.currentTarget ],
		h			= ( this.hasHints )? data.h : data.h + THREE.Math.randInt( -20, 10 ),
		v			= ( this.hasHints )? data.v : data.v + THREE.Math.randInt( -20, 10 ),
		distance	= data.distance;

	if ( this.cameraTween !== null ) this.cameraTween.kill();

	this.cameraTween = TweenMax.to( this.controller.scene.camPos, 2.5, {

		h			: h,
		v			: v,
		distance	: distance,
		ease		: Power2.easeInOut,
		onUpdate	: this.controller.scene.moveCamera.bind( this.controller.scene ),
		onComplete	: this.showNextEnd.bind( this, hasEnd )
	} );
};

proto.updateIcon = function () {

	if ( this.currentIcon === this.currentTarget ) return;

	this.currentIcon = this.currentTarget;

	this.gradientTopEl.classList.add( 'active' );
	this.gradientBottomEl.classList.add( 'active' );

	var prevTarget		= this.currentTarget - 1,
		positionInc		= 48,
		positionIconIni	= 3 - ( positionInc * prevTarget ),
		positionTween	= { value : 0 };

	if ( this.currentTarget === 4 ) positionIconIni -= 2;

	TweenMax.to( positionTween, 0.5, {

		value		: 1,
		ease		: Power2.easeInOut,
		delay		: 0.15,
		onUpdate	: ( function () {

			var positionIcon = positionIconIni - ( positionInc * positionTween.value );
			this.livesIconEl.style.backgroundPosition = '0px ' + positionIcon + 'px';

		} ).bind( this ),

		onComplete	: ( function () {

			this.gradientTopEl.classList.remove( 'active' );
			this.gradientBottomEl.classList.remove( 'active' );

		} ).bind( this )
	} );
};


// Win / Lose message
// ---------------------------------------------------

proto.gotoMessageCameraPosition = function () {

	var posH = ( this.currentTarget < 3 )? 360 + this.cameraMessagePosition.h : this.cameraMessagePosition.h;

	TweenMax.to( this.controller.scene.camPos, 1.5, {

		h			: posH,
		v			: this.cameraMessagePosition.v,
		distance	: this.cameraMessagePosition.distance,
		ease		: Power2.easeInOut,
		onUpdate	: this.controller.scene.moveCamera.bind( this.controller.scene ),
		onComplete	: ( function () {

			this.controller.scene.camPos.h = 360 + this.cameraMessagePosition.h;
			this.canvasContainerEl.classList.add( 'message' );
			this.menuUpEl.classList.add( 'hold' );
			this.boxPointerEl.classList.remove( 'active' );
			this.msgEl.classList.add( 'active' );

		} ).bind( this )
	} );

	setTimeout( ( function () {

		this.menuUpEl.classList.add( 'hold' );
		this.boxPointerEl.classList.remove( 'active' );

	} ).bind( this ), 10 );
};

proto.win = function () {

	this.state = GameState.States.WIN;

	if ( this.hasHints ) {

		this.hasHints = false;
		this.hintsToggleEl.classList.remove( 'active' );
		this.controller.throwUI.hideHints();
	}
	this.hintsToggleEl.classList.add( 'disabled' );

	this.controller.throwUI.pause();

	this.gotoMessageCameraPosition();
	this.showWinMessage();
};

proto.showWinMessage = function () {

	this.msgWinEl.classList.add( 'active' );
	this.msgLoseEl.classList.remove( 'active' );

	setTimeout( ( function () {

		Decoration.play();
		this.controller.scene.pause();

	} ).bind( this ), 4250 );
};

proto.lose = function () {

	this.state = GameState.States.LOSE;

	if ( this.hasHints ) {

		this.hasHints = false;
		this.hintsToggleEl.classList.remove( 'active' );
		this.controller.throwUI.hideHints();
	}
	this.hintsToggleEl.classList.add( 'disabled' );

	this.controller.throwUI.pause();

	this.gotoMessageCameraPosition();
	this.showLoseMessage();
};

proto.showLoseMessage = function () {

	this.msgWinEl.classList.remove( 'active' );
	this.msgLoseEl.classList.add( 'active' );

	setTimeout( ( function () {

		Decoration.play();
		this.controller.scene.pause();

	} ).bind( this ), 4250 );
};


// Reset state
// ---------------------------------------------------

proto.reset = function () {

	Decoration.pause();
	this.controller.scene.play();
	this.controller.throwUI.play();

	this.msgEl.classList.remove( 'active' );

	this.hintsToggleEl.classList.remove( 'disabled' );

	this.controller.scene.physics.clearMeshes();

	for ( var i = 0; i < this.totalTargets; i++ ) {

		this.topColliders[ i ].closeLid();
		this.topElements[ i ].reset();
		this.boxPointers[ i ].deactivate();
	}

	this.currentTarget	= 0;
	this.currentIcon	= 0;
	this.livesIconEl.style.backgroundPosition = '0px 3px';

	this.showNext();

	this.lives = 9;
	this.updateLives();

	this.state = GameState.States.PLAY;

	this.canvasContainerEl.classList.remove( 'message' );
};


// API for current information about the game state
// ---------------------------------------------------

proto.getCurrentCollider = function () {

	return 'collider-' + ( this.currentTarget + 1 );
};

proto.getCurrentCameraH = function () {

	return this.cameraPositions[ this.currentTarget ].h;
};

proto.getCurrentHelperAngle = function () {

	return this.helperData[ this.currentTarget ].angle;
};

proto.getCurrentHelperStrength = function () {

	return this.helperData[ this.currentTarget ].strength;
};

proto.getCurrentType = function () {

	return this.type[ this.currentTarget ];
};

proto.getCurrentElementNumber = function () {

	return ( this.currentTarget + 1 );
};


// Lives counter
// ---------------------------------------------------

proto.removeLife = function () {

	this.lives--;
	this.updateLives();
	if ( this.lives === 0 ) this.lose();

	this.menuUpEl.classList.remove( 'hold' );
	this.boxPointerEl.classList.add( 'active' );
};

proto.updateLives = function () {

	var el			= this.livesNumberEl,
		numLives	= this.lives;

	setTimeout( function () { el.style.opacity = 0.000001; }, 80 );
	setTimeout( function () { el.style.opacity = 0.999999; }, 160 );
	setTimeout( function () { el.style.opacity = 0.000001; }, 240 );
	setTimeout( function () { el.style.opacity = 0.999999; el.innerHTML = numLives; }, 320 );
	setTimeout( function () { el.style.opacity = 0.000001; }, 400 );
	setTimeout( function () { el.style.opacity = 0.999999; }, 480 );
};


// Hints
// ---------------------------------------------------

proto.toggleHints = function () {

	if ( !this.hasHints ) {

		this.hasHints = true;
		this.hintsToggleEl.classList.add( 'active' );

		this.controller.throwUI.showHints();
		this.gotoCameraPosition( false );

	} else {

		this.hasHints = false;
		this.hintsToggleEl.classList.remove( 'active' );

		this.controller.throwUI.hideHints();
		this.gotoCameraPosition( false );
	}
};


// Change state ( external API )
// ---------------------------------------------------

proto.changeState = function ( newState ) {

	if ( this.state !== newState ) {

		this.state = newState;
	}
};


// Block / unblock UI
// ---------------------------------------------------

proto.blockUI = function () {

	this.blockEl.style.display = 'block';
	this.isBlocked = true;
};

proto.unblockUI = function () {

	setTimeout( ( function () {

		this.blockEl.style.display = 'none';
		this.isBlocked = false;

	} ).bind( this ), 300 );
};
