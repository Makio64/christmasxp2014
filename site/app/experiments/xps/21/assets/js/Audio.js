// ------------------------------------------
// Audio.js
// ------------------------------------------
//
// Sound controller using Howler.js
// https://github.com/goldfire/howler.js/
//
// ------------------------------------------

'use strict';

var Audio = function ( opts ) {

	this.controller		= opts.controller;

	this.toggleAudioEl	= null;
	this.isPlaying		= false;
	this.loadedSounds	= 0;
	this.totalSounds	= 5;
	this.sounds			= {

		music	: {

			url		: 'assets/audio/music.mp3',
			loop	: true,
			volume	: 0.1,
			howl	: null,
			type	: 'MUSIC'
		},

		top1	: {

			url		: 'assets/audio/top01.mp3',
			loop	: false,
			howl	: null,
			type	: 'FX'
		},

		top2	: {

			url		: 'assets/audio/top02.mp3',
			loop	: false,
			howl	: null,
			type	: 'FX'
		},

		top3	: {

			url		: 'assets/audio/top03.mp3',
			loop	: false,
			howl	: null,
			type	: 'FX'
		},

		top4	: {

			url		: 'assets/audio/top04.mp3',
			loop	: false,
			howl	: null,
			type	: 'FX'
		},

		top5	: {

			url		: 'assets/audio/top05.mp3',
			loop	: false,
			howl	: null,
			type	: 'FX'
		},

		hit1	: {

			url		: 'assets/audio/hit01.mp3',
			loop	: false,
			howl	: null,
			type	: 'FX',
			volume	: 0.15
		},

		hit2	: {

			url		: 'assets/audio/hit02.mp3',
			loop	: false,
			howl	: null,
			type	: 'FX',
			volume	: 0.15
		},

		hit3	: {

			url		: 'assets/audio/hit03.mp3',
			loop	: false,
			howl	: null,
			type	: 'FX',
			volume	: 0.15
		},

		hit4	: {

			url		: 'assets/audio/hit04.mp3',
			loop	: false,
			howl	: null,
			type	: 'FX',
			volume	: 0.15
		},

		hit5	: {

			url		: 'assets/audio/hit05.mp3',
			loop	: false,
			howl	: null,
			type	: 'FX',
			volume	: 0.15
		}
	};
	this.signals		= {

		loaded : new signals.Signal()
	};

	this.init();
};

var proto = Audio.prototype;

proto.init = function () {

	this.toggleAudioEl	= document.querySelector( '#audio-toggle' );
	this.createSounds();
};

proto.createSounds = function () {

	for ( var soundName in this.sounds ) {

		var sound = this.sounds[ soundName ];
		sound.howl = new Howl( {

			urls	: [ sound.url ],
			loop	: sound.loop,
			volume	: sound.volume || 1.0,
			onload	: ( sound.type === 'MUSIC' )? this.loadedMusic.bind( this ) : this.loadedSound.bind( this )

		} );
	}
};


// Preload
// ---------------------------------------------------

proto.loadedSound = function () {

	this.loadedSounds++;
	if ( this.loadedSounds === this.totalSounds ) this.onLoadedSounds();
};

proto.onLoadedSounds = function () {

	this.signals.loaded.dispatch();
};

proto.loadedMusic = function () {

	this.showEl();
	if ( !this.controller.developmentMode ) this.playEl();
	this.addEventListeners();
};


// Fade in / out general volume
// ---------------------------------------------------

proto.fadeInVolume = function () {

	this.fadeVolume( 1.0, 2.0 );
};

proto.fadeOutVolume = function () {

	this.fadeVolumeTo( 0.0, 1.0 );
};

proto.fadeVolumeTo = function ( volumeEnd, duration ) {

	var soundRange		= { volume : Howler.volume() },
		durationFade	= duration || 1.0;

	TweenMax.to( soundRange, durationFade, {

		volume		: volumeEnd,
		ease		: Power2.easeOut,
		onUpdate	: ( function () {

 			Howler.volume( soundRange.volume );

		} ).bind( this )
	} );
};


// Specific sound API
// ---------------------------------------------------

proto.playBackgroundMusic = function () {

	this.sounds.music.howl.fadeIn( this.sounds.music.volume, 2000 );
};

proto.pauseBackgroundMusic = function () {

	this.sounds.music.howl.fadeOut( 0.0, 1000 );
};

proto.playTopElementFx = function ( numTop ) {

	this.sounds[ 'top' + numTop ].howl.play();
};

proto.playHitFx = function ( numHit ) {

	this.sounds[ 'hit' + numHit ].howl.play();
};


// Events
// ---------------------------------------------------

proto.addEventListeners = function () {

	this.toggleAudioEl.addEventListener( 'click', this.onClickToggle.bind( this ), false );
};

proto.onClickToggle = function ( event ) {

	event.preventDefault();

	if ( !this.isPlaying ) this.playEl();
	else this.pauseEl();
};


// Dom element
// ---------------------------------------------------

proto.showEl = function () {

	this.toggleAudioEl.classList.add( 'visible' );
};

proto.playEl = function () {

	this.isPlaying = true;
	this.playBackgroundMusic();
	this.toggleAudioEl.classList.add( 'playing' );
};

proto.pauseEl = function () {

	this.isPlaying = false;
	this.pauseBackgroundMusic();
	this.toggleAudioEl.classList.remove( 'playing' );
};
