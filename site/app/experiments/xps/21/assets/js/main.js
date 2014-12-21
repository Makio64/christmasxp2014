// ------------------------------------------
// main.js
// ------------------------------------------
//
// Experiment entry point
// Browser detection, preload &
// setup of the project
//
// ------------------------------------------

'use strict';

var scene				= null,
	positionHelper		= null,
	audioController		= null,
	throwUI				= null,
	gameState			= null,

	preloadImgs			= [ 'assets/texture/paintedDiff.jpg', 'assets/texture/shadow.jpg', 'assets/texture/soccer.jpg', 'assets/texture/rubik.jpg', 'assets/texture/book-red.jpg', 'assets/texture/book-green.jpg', 'assets/texture/book-blue.jpg' ],
	preloadIndex		= 0,
	preloadTotal		= 8,

	preloadLoadImgs		= [ 'assets/img/logo.png', 'assets/img/claim.png', 'assets/img/instructions-short.gif' ],
	preloadLoadIndex	= 0,
	preloadLoadTotal	= preloadLoadImgs.length,

	developmentMode		= false;


window.onload = function () {

	detectBrowser();
};


// Detect browser
// ---------------------------------------------------

function detectBrowser () {

	if ( Detector.isSafariGL || Detector.isMobileGL ) {

		preloadImages();

	} else if ( Detector.isDesired ) {

		preloadLoad();

	} else {

		document.getElementById( 'not-supported-generic' ).style.display = 'block';
		document.body.className = '';
	}
}

function addDecoration () {

	// WebGL enabled browser & devices
	// that are not supported show the simple WebGL decoration
	// It's the least thing we could do...

	var el = null;

	if ( Detector.isMobileGL ) {

		document.getElementById( 'not-supported-mobile' ).style.display = 'block';
		document.body.className = '';

		el = document.getElementById( 'webgl-mobile' );

	} else if ( Detector.isSafariGL ) {

		document.getElementById( 'not-supported-safari' ).style.display = 'block';
		document.body.className = 'preload';

		el = document.getElementById( 'webgl-safari' );

	}

	Decoration.init( el, true );
	setTimeout( function () {

		document.body.removeChild( document.getElementById( 'loader-load' ) );

	}, 1000 );
}


// Preload the intro screen
// ---------------------------------------------------

function preloadLoad () {

	document.querySelector( 'footer' ).classList.add( 'left' );

	preloadLoadIndex	= 0;
	preloadLoadTotal	= preloadLoadImgs.length;

	preloadLoadNext();
}

function preloadLoadNext () {

	if ( preloadLoadIndex !== preloadLoadTotal ) {

		var imgSrc	= preloadLoadImgs[ preloadLoadIndex ],
			newImg	= new Image();

		newImg.onload = function () {

			preloadLoadIndex++;
			preloadLoadNext();

		};
		newImg.src = imgSrc;

	} else {

		setTimeout( preloadLoadEnd, ( developmentMode )? 1 : 1000 );
	}
}

function preloadLoadEnd () {

	document.getElementById( 'loader' ).classList.add( 'active' );
	document.body.classList.remove( 'preload-load' );

	setTimeout( function () {

		document.body.removeChild( document.getElementById( 'loader-load' ) );
		createSite();
		preload();

	}, ( developmentMode )? 1 : 3500 );
}


// Site creation
// ---------------------------------------------------

function createSite () {

	throwUI			= new ThrowUI( {

		controller		: window
	} );
	audioController	= new Audio( {

		controller		: window
	} );
	positionHelper	= new PositionHelper( {

		controller		: window
	} );
	scene			= new Scene( {

		controller		: window,
		positionHelper	: positionHelper,
		audioController	: audioController,
		throwController	: throwUI

	} );
	gameState		= new GameState( {

		controller		: window
	} );

	addEventListeners();
}


// Events
// ---------------------------------------------------

function addEventListeners () {

	scene.signals.updated.add( onUpdate );
	throwUI.signals.stateChanged.add( onChangedState );
}

function onChangedState ( state, oldState ) {

}

function onUpdate () {

	throwUI.update();
}


// Preload site audio & meshes
// ---------------------------------------------------

function preload () {

	audioController.signals.loaded.add( onLoaded );
	scene.signals.loaded.add( onLoaded );
	for ( var i = 0; i < scene.topElements.length; i++ ) {

		scene.topElements[ i ].signals.loaded.add( onLoaded );
	}
	scene.physics.signals.loaded.add( onLoaded );
}

function onLoaded () {

	preloadTotal--;
	if ( preloadTotal === 0 ) preloadImages();
}


// Preload meshes textures
// ---------------------------------------------------

function preloadImages () {

	preloadIndex	= 0;
	preloadTotal	= preloadImgs.length;

	preloadNext();
}

function preloadNext () {

	if ( preloadIndex !== preloadTotal ) {

		var imgSrc	= preloadImgs[ preloadIndex ],
			newImg	= new Image();

		newImg.onload = function () {

			preloadIndex++;
			preloadNext();

		};
		newImg.src = imgSrc;

	} else {

		setTimeout( preloadEnd, ( developmentMode )? 1 : 1000 );
	}
}


// Start button
// ---------------------------------------------------

function preloadEnd () {

	if ( Detector.isSafariGL || Detector.isMobileGL ) {

		addDecoration();

	} else {

		setTimeout( function () {

			showButtonStart();

		}, ( developmentMode )? 1 : 500 );
	}
}

function showButtonStart () {

	document.getElementById( 'loader' ).classList.add( 'loaded' );

	var btnStartEl = document.querySelector( 'a.start' );

	btnStartEl.classList.add( 'active' );
	btnStartEl.addEventListener( 'click', startGame, false );
}

function startGame ( event ) {

	if ( event ) event.preventDefault();


	document.body.classList.remove( 'preload' );
	setTimeout( function () {

		document.body.removeChild( document.getElementById( 'loader' ) );

		gameState.start();

	}, ( developmentMode )? 1 : 1750 );
}




