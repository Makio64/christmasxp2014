// ------------------------------------------
// Detector.js
// ------------------------------------------
//
// Browser capabilities simple detector
// I love experiments requirements
//
// ------------------------------------------


'use strict';

var Detector = ( function () {

	var hasWebGL = ( function () { try {

				var canvas = document.createElement( 'canvas' );
				return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );

			} catch ( e ) {

				return false;
			}

		} )();

	var isMobile = {

		Android		: function() { return navigator.userAgent.match(/Android/i); },
		BlackBerry	: function() { return navigator.userAgent.match(/BlackBerry/i); },
		iOS			: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
		Opera		: function() { return navigator.userAgent.match(/Opera Mini/i); },
		Windows		: function() { return navigator.userAgent.match(/IEMobile/i); },
		any			: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
	};

	var isOpera		= !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
		isFirefox	= typeof InstallTrigger !== 'undefined',
		isSafari	= Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
		isChrome	= !!window.chrome && !isOpera,
		isIE		= /*@cc_on!@*/false || !!document.documentMode;

	var isDesired	= ( hasWebGL !== false ) && ( isFirefox || isChrome ),
		isSafariGL	= ( hasWebGL !== false ) && ( isSafari ),
		isMobileGL	= ( hasWebGL !== false ) && ( isMobile.any() !== null );

	return {

		hasWebGL	: ( hasWebGL !== false ),
		isDesired	: isDesired,
		isSafariGL	: isSafariGL,
		isMobileGL	: isMobileGL
	};

} )();