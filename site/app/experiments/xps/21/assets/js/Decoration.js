// ------------------------------------------
// Decoration.js
// ------------------------------------------
//
// ThreeJS scene with a generative Xmas swag
//
// TODO:
// refactor, built in 3 hours
// why 2 scenes?
// make all the planes only one geometry
//
// ------------------------------------------


'use strict';

var Decoration = ( function () {

	var scene,
		pointLight,
		camera,
		renderer,
		containerEl;

	var isPlaying = false,
		isAutoPlay = false;


	function init ( container, autoplay ) {

		containerEl	= container || document.body;
		isAutoPlay	= autoplay || false;

		createScene();
		createElements();
		addEventListeners();
	}


	// ThreeJS scene
	// ------------------------------------------

	function createScene () {

		// Camera

		camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.01, 1000 );
		camera.position.set( 0, 0, 40 );
		camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

		// Scene

		scene = new THREE.Scene();

		// Lights

		pointLight = new THREE.PointLight( 0xffffff, 1.75 );
		scene.add( pointLight );

		// Renderer

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor( 0xfa5a4a, 1 );

		containerEl.appendChild( renderer.domElement );
	}

	function createElements () {

		setupBall();
	}


	// Events
	// ------------------------------------------

	function addEventListeners () {

		window.addEventListener( 'resize', onWindowResize, false );
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
	}


	// Update ( RAF )
	// ------------------------------------------

	function animate( timestamp ) {

		pointLight.position.copy( camera.position );
		renderer.render( scene, camera );

		if ( isPlaying ) {

			requestAnimationFrame( animate );
		}
	}


	// Ball
	// ------------------------------------------

	var ballGeometry = null,
		ballMaterial = null;

	function setupBall () {

		createBallMaterial();
		loadBallGeometry();
	}

	function createBallMaterial () {

		ballMaterial = new THREE.MeshPhongMaterial( {

			map		: THREE.ImageUtils.loadTexture( 'assets/texture/paintedDiff.jpg' ),
			color	: 0xfbfbfb,
			shading	: THREE.FlatShading,
		} );
	}

	function loadBallGeometry () {

		var loader = new THREE.JSONLoader( true );
			loader.load( 'assets/mesh/ball.json', onLoadedBallGeometry );
	}

	function onLoadedBallGeometry ( geometry ) {

		geometry.center();
		ballGeometry = geometry;

		if ( isAutoPlay ) play()
	}

	function createBall () {

		var ball = new THREE.Mesh( ballGeometry, ballMaterial );
			ball.scale.set( 50, 50, 50 );
			ball.rotation.x = THREE.Math.degToRad( -90 );

		return ball;
	}


	// Xmas swag
	// ------------------------------------------

	var swag			= null,
		lines			= [],
		lineMaterial	= null,
		stoReset		= 0,
		colorz			= [

				[ 0 / 255, 30 / 255, 0 / 255 ],
				[ 16 / 255, 79 / 255, 16 / 255 ],
				[ 7 / 255, 109 / 255, 7 / 255 ],
				[ 1 / 255, 174 / 255, 0 / 255 ]
			];

	function createDecoration () {

		swag = new THREE.Object3D();
		swag.position.y = -20;
		scene.add( swag );

		createLineMaterial();

		var posX	= 0,
			nextX	= 0,
			difX	= 0,
			groups	= [],
			ballDif = THREE.Math.randInt( 2, 6 ),
			i;

		for ( i = 0; i < 20; i++ ) {

			var group = createLineGroup();

			if ( i < 17 ) {

				posX += THREE.Math.randFloat( -1.75, 1.75 );

			} else {

				if ( posX > 0 ) posX -= Math.min( 1.25, posX );
				else if ( posX < 0 ) posX += Math.min( 1.25, -posX );
			}

			group.position.x = posX;
			group.position.y = i * 2.0;
			group.scale.set( 0.001, 0.001, 0.001 );

			groups.push( group );
			swag.add( group );

			if ( i === ballDif ) {

				ballDif += THREE.Math.randInt( 2, 8 );

				var rotDeg = THREE.Math.randFloat( -20, 20 )

				var ball = createBall();
					ball.position.copy( group.position );
					ball.rotation.y = THREE.Math.degToRad( rotDeg );
					ball.position.x += rotDeg * 0.1 * -1;
					ball.scale.set( 0.001, 0.001, 0.001 );

				swag.add( ball );

				group.userData.ball = ball;
			}
		}

		for ( i = 0; i < ( 20 - 1 ); i++ ) {

			posX = groups[ i ].position.x;
			nextX = groups[ i + 1 ].position.x;
			difX = nextX - posX;
			groups[ i ].userData.rotation = THREE.Math.degToRad( -15 * difX );

			if ( i === ( 20 - 1 -1 ) ) {

				groups[ i + 1 ].userData.rotation = THREE.Math.degToRad( -15 * difX );
			}
		}

		for ( i = 0; i < 20; i++ ) {

			var tweenData	= { value : 0.001 },
				group		= groups[ i ],
				groupIndex	= i;

			( function ( tweenData, group, i, isLast ) {

				TweenMax.to( tweenData, 0.75, {

					value		: 1,
					delay		: 0.15 * i,
					ease		: Power2.easeInOut,
					onUpdate	: function () {

						group.scale.set( tweenData.value, tweenData.value, tweenData.value );
						group.rotation.z = tweenData.value * group.userData.rotation;
					}
				} );

				if ( group.userData.ball ) {

					var tweenBall	= { value : 0.001 },
						ball		= group.userData.ball;

					TweenMax.to ( tweenBall, 1.0, {

						value		: 1,
						delay		: 0.2 * i,
						ease		: Power2.easeInOut,
						onUpdate	: function () {

							ball.scale.set( tweenBall.value * 50, tweenBall.value * 50, tweenBall.value * 50 );
						}
					} );
				}

			} )( tweenData, group, i, i === ( 20 - 1 ) );
		}

		clearTimeout( stoReset );
		stoReset = setTimeout( resetDecoration, 3600 );
	}

	function resetDecoration () {

		clearTimeout( stoReset );
		stoReset = setTimeout( function () {

			TweenMax.to( renderer.domElement, 1, {

				opacity		: 0,
				ease		: Power2.easeInOut,
				onComplete	: function () {

					scene.remove( swag );
					clearTimeout( stoReset );
					stoReset = setTimeout( function () {

						TweenMax.set( renderer.domElement, { opacity : 1 } );
						createDecoration();

					}, 100 );
				}
			} );

		}, 5000 );
	}

	function removeDecoration () {

		clearTimeout( stoReset );
		TweenMax.to( renderer.domElement, 1, {

			opacity		: 0,
			ease		: Power2.easeInOut,
			onComplete	: function () {

				scene.remove( swag );
			}
		} );
	}

	function createLineMaterial () {

		lineMaterial = new THREE.MeshBasicMaterial( {

			vertexColors	: THREE.VertexColors,
			side			: THREE.DoubleSide,
			shading			: THREE.FlatShading,
			wireframe		: false
		} );
	}

	function createLineGeometry () {

		var lineGeometry = new THREE.PlaneBufferGeometry( 0.5, 3, 1, 3 );

		var positions	= lineGeometry.attributes.position.array,
			colors		= [],
			incsX		= [ 0.0, 0.0, 0.0, THREE.Math.randFloat( 0.1, 0.15 ) ],
			incsZ		= [ 0.0, 0.0, 0.0, 0.0 ],
			incsY		= [ 0.0, 0.0, 0.0, 0.0 ];

		incsZ[ 1 ] = THREE.Math.randFloat( 0.1, 0.8 );
		incsZ[ 2 ] = incsZ[ 1 ] + THREE.Math.randFloat( 0.1, 0.8 );
		incsZ[ 3 ] = incsZ[ 2 ] + THREE.Math.randFloat( 0.4, 0.8 );

		incsY[ 1 ] = THREE.Math.randFloat( 0.0, 1.0 );
		incsY[ 2 ] = incsY[ 1 ] + THREE.Math.randFloat( 0.0, 1.0 );
		incsY[ 3 ] = incsY[ 2 ] + THREE.Math.randFloat( 0.0, 1.0 );

		var height = 0;

		for ( var i = 0; i < positions.length; i+=3 ) {

			if ( i % 3 === 0 ) {

				var dirInc = ( positions[ i ] < 0 )? 1 : -1;

				if ( positions[ i + 1 ] === -1.5 ) {

					positions[ i + 1 ] += incsY[ 0 ];
					positions[ i + 2 ] += incsZ[ 0 ];

					colors.push( colorz[ 0 ][ 0 ], colorz[ 0 ][ 1 ], colorz[ 0 ][ 2 ], 1.0 );

				} else if ( positions[ i + 1 ] === -0.5 ) {

					positions[ i + 1 ] += incsY[ 1 ];
					positions[ i + 2 ] += incsZ[ 1 ];

					colors.push( colorz[ 1 ][ 0 ], colorz[ 1 ][ 1 ], colorz[ 1 ][ 2 ], 1.0 );

				} else if ( positions[ i + 1 ] === 0.5 ) {

					positions[ i + 1 ] += incsY[ 2 ];
					positions[ i + 2 ] += incsZ[ 2 ];

					colors.push( colorz[ 2 ][ 0 ], colorz[ 2 ][ 1 ], colorz[ 2 ][ 2 ], 1.0 );

				} else if ( positions[ i + 1 ] === 1.5 ) {

					positions[ i ] += dirInc * incsX[ 3 ];
					positions[ i + 1 ] += incsY[ 3 ];
					positions[ i + 2 ] += incsZ[ 3 ];

					height = positions[ i + 1 ];

					colors.push( colorz[ 3 ][ 0 ], colorz[ 3 ][ 1 ], colorz[ 3 ][ 2 ], 1.0 );
				}
			}
		}

		lineGeometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( colors ), 4 ) );

		lineGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, height / 2, 0 ) );
		return {

			geometry	: lineGeometry,
			height		: height
		};
	}

	function createLineGroup () {

		var group = new THREE.Object3D();

		for ( var i = 0; i < 10; i++ ) {

			var line = createLine();
			group.add( line );
		}

		return group;
	}

	function createLine () {

		var meshGeo		= createLineGeometry(),
			meshLine	= new THREE.Mesh( meshGeo.geometry, lineMaterial );

			meshLine.rotation.z = THREE.Math.degToRad( THREE.Math.randFloat( -35, 35 ) );
			meshLine.scale.set(

				1.0 + THREE.Math.randFloat( -0.2, 0 ),
				1.0 + THREE.Math.randFloat( -0.2, 0.2 ),
				1.0
			);

		return meshLine;
	}


	// Play / Pause
	// ------------------------------------------

	function play () {

		if ( !isPlaying ) {

			isPlaying = true;
			createDecoration();
			TweenMax.set( renderer.domElement, { opacity : 1 } );
			animate();
		}

	}

	function pause () {

		if ( isPlaying ) {

			isPlaying = false;
			removeDecoration();
		}
	}


	// API
	// ------------------------------------------

	return {

		init	: init,
		play	: play,
		pause	: pause
	}

} )();