var Replicate = (function() {

	/*

		Replicate

                                                		    __.  .--,
		*-/___,  ,-/___,-/___,-/___,-/___,           _.-.=,{\/ _/  /`)
		 `\ _ ),-/___,-/___,-/___,-/___, )     _..-'`-(`._(_.;`   /
		  /< \\=`\ _ )`\ _ )`\ _ )`\ _ )<`--''`     (__\_________/___,
		         /< <\ </ /< /< /< </ /<           (_____Y_____Y___,  jgs

		
		A small Christmas(*cough*) experiment for http://christmasexperiments.com/

		Lovely sound by "Skinny Puppy"
		Beginning of the song "jaHer" from the album "Mythmaker"
		http://open.spotify.com/album/7DmZ0tFAjTBxGp3oVCJ3xH

		Makes use of:
		three.js - https://github.com/mrdoob/three.js @mrdoob
		tween.js - https://github.com/sole/tween.js/ @sole

		Ghetto code by @oosmoxiecode

		Merry Christmas!

	*/

	var rep = {};

	var camera, scene, renderer, composer;

	var has_gl = false;

	var delta;
	var time;
	var oldTime;
	var currentTime = 0;
	var startTime;

	var blackCover;
	var done = false;

	var uniforms;
	var overlay;

	var road;
	var speed;

	var cameraTarget = new THREE.Vector3(0,70,-350);

	var array = [];

	var color = 0x112834;

	var rabbit;
	var centipede;
	var car;

	var hsl = {s: 0.5, l: 0.8};

	var tube;
	var objArray = [];
	var tank;
	var pipe;
	var isFiring = false;
	var shake = {value: 0};
	var smokeArray = [];
	var missile;

	var effectFilmGrain;
	var effectWave;
	var effectRoll;

    var touchDevice = ( ('ontouchstart' in document) || (navigator.userAgent.match(/ipad|iphone|android/i) != null) );
	var scaleRatio = 1;
	if (touchDevice) {
		scaleRatio = window.devicePixelRatio || 1
	}

	var textures = {};
	var rabbitGeometry;
	var centiGeometry;
	var tankGeometry;
	var missileGeometry;
	var carGeomtries;

	var particlesReplicate;
	var arrayReplicate = [];


	var loadedAssets = 0;

    var music;
    var volume = 0.75;



	// init
	rep.init = function() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		preload();

	}
	// preload
	var preload = function () {
		
	    // textures
	    textures.road = THREE.ImageUtils.loadTexture( "assets/road.png", undefined, assetLoaded );
	    textures.tree0 = THREE.ImageUtils.loadTexture( "assets/tree0.png", undefined, assetLoaded );
	    textures.tree1 = THREE.ImageUtils.loadTexture( "assets/tree1.png", undefined, assetLoaded );
	    textures.tree0b = THREE.ImageUtils.loadTexture( "assets/tree0_b.png", undefined, assetLoaded );
	    textures.tree1b = THREE.ImageUtils.loadTexture( "assets/tree1_b.png", undefined, assetLoaded );
	    textures.sign0 = THREE.ImageUtils.loadTexture( "assets/sign0.png", undefined, assetLoaded );
	    textures.sign1 = THREE.ImageUtils.loadTexture( "assets/sign1.png", undefined, assetLoaded );
	    textures.lights = THREE.ImageUtils.loadTexture( "assets/lights.png", undefined, assetLoaded );
	    textures.snowflake = THREE.ImageUtils.loadTexture( "assets/snowflake.png", undefined, assetLoaded );
	    textures.vignette = THREE.ImageUtils.loadTexture( "assets/VignetteWithDirt_alpha_sq.png", undefined, assetLoaded );
	    textures.lensflare = THREE.ImageUtils.loadTexture( "assets/lensflare0.png", undefined, assetLoaded );
	    textures.camaroshadow = THREE.ImageUtils.loadTexture( "assets/camaro/plane-ao-256.png", undefined, assetLoaded );
	    textures.taillights = THREE.ImageUtils.loadTexture( "assets/camaro/taillights2.png", undefined, assetLoaded );
	    textures.tankshadow = THREE.ImageUtils.loadTexture( "assets/tank_shadow2.png", undefined, assetLoaded );
	    textures.smoke = THREE.ImageUtils.loadTexture( "assets/smoke3.png", undefined, assetLoaded );

	    // models
		var loader = new THREE.JSONLoader();
		
		// rabbit
		loader.load( "assets/rabbit.js", function( geometry ) {

			rabbitGeometry = geometry;

			morphColorsToFaceColors( rabbitGeometry );
			rabbitGeometry.computeMorphNormals();
			assetLoaded();

		} );

		// centi
		loader.load( "assets/centi.js", function( geometry ) {

			centiGeometry = geometry;
			assetLoaded();

		} );

		// tank
		loader.load( "assets/tank/t34.js", function( geometry ) {

			tankGeometry = geometry;
			assetLoaded();

		} );		

		// missile
		loader.load( "assets/missile.js", function( geometry ) {

			missileGeometry = geometry;
			assetLoaded();

		} );	

		// car
		var loaderCTM = new THREE.CTMLoader( true );

		loaderCTM.loadParts( "assets/camaro/camaro.js", function( geometries, materials ) {

			carGeomtries = geometries;
			assetLoaded();

		}, { useWorker: true } );

		loadAudio();

		var img = new Image();
		img.onload = function () {

			// canvas
			var imgCanvas = document.createElement( "canvas" );
			imgCanvas.width = this.width;
			imgCanvas.height = this.height;

			var context = imgCanvas.getContext( "2d" );
			context.drawImage(this,0,0);

			var w = imgCanvas.width;
			var h = imgCanvas.height;

			//data
			var pixels = context.getImageData(0, 0, w, h).data;
			var index = 0;
			for (var y=0; y<h; ++y ) {
				for (var x=0; x<w; ++x ) {
					var redIndex = pixels[index];
					index += 4;
					
					var value = {x:x-w/2, y:y-h/2};
					if (redIndex == 255) {
						value = null;
					};
					arrayReplicate.push({value: value, xx: x/w});
				}
			}	

			assetLoaded();				

		};
		img.src = "assets/replicate.png";

	}

	var loadAudio = function () {
		
        if (Audio != undefined) {
          var a = new Audio();
          var ext = "ogg";
          if(a.canPlayType("audio/mp3")) ext = "mp3";
          music = new Audio("assets/audio."+ext);
          music.volume = volume;
          music.load();

          music.addEventListener("loadeddata", function() {

            assetLoaded();

          }, false);

        } else {
          assetLoaded();
        }

	}

	var assetLoaded = function () {
		++loadedAssets;

		if (loadedAssets >= 22) {
			allLoaded();
		}

	}

	var allLoaded = function () {

		// fade out loader
		var spinner = document.getElementById('loading_spinner');
		spinner.style.opacity = 1.0;

    	if (touchDevice) {
    		spinner.style.display = "none";
    		document.getElementById('touch_start').style.display = "block";
    		document.addEventListener( 'touchstart', onTouchStart, false );
    		return;
    	}

        var outTween0 = new TWEEN.Tween( spinner.style )
            .to( { opacity: 0.1 }, 1500 )
            .easing( TWEEN.Easing.Quadratic.In )
            .onComplete(function () {
            	spinner.style.display = "none";
            });
    	outTween0.start();


    	rep.start();

	}

	rep.start = function () {
		
		setup();
		startTime = Date.now();
		if (music) {
			music.play();
		}
		animate();

		//music.currentTime = 110;

    	// cover
        blackCover.alphaTween = new TWEEN.Tween( blackCover.material )
            .to( { opacity: 0.0 }, 5000 )
            .easing( TWEEN.Easing.Quadratic.Out )
            .delay(250)
            .onComplete(function () {
            	blackCover.visible = false;
            });
    	blackCover.alphaTween.start();

		effectFilmGrain.uniforms[ 'amount' ].value = 0;					

    	// grain
        var grainTween = new TWEEN.Tween( effectFilmGrain.uniforms[ 'amount' ] )
            .to( { value: 0.13 }, 5000 )
            .easing( TWEEN.Easing.Quadratic.Out )
            .delay(250)
    	grainTween.start();



	}

	var getTime = function () {
		
		if (music) {
			return music.currentTime*1000;
		}

		return time - startTime;

	}

	// setup
	var setup = function () {

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(color, -1000, 2000);

		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 3000 );
		camera.position.x = 50;
		camera.position.y = 200;
		camera.position.z = -500;

		scene.add( camera );

		Math.seedrandom(188522);

		// road
		var plane = new THREE.PlaneGeometry(160,4000);
		plane.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Vector3( -Math.PI/2, 0, 0 ) ) );

		var material = new THREE.MeshBasicMaterial( {color: 0xffffff, map: textures.road, transparent: true, alphaTest: 0.1} );
		material.map.repeat.y = 16;
		material.map.wrapS = THREE.RepeatWrapping;
		material.map.wrapT = THREE.RepeatWrapping;
		road = new THREE.Mesh(plane, material);
		road.position.y = 15;
		scene.add(road);

		// ground
		var ground = new THREE.Mesh( new THREE.PlaneGeometry(10000,10000), new THREE.MeshBasicMaterial( {color: 0x898989} ) );
		ground.rotation.x = -Math.PI*0.5;
		scene.add(ground);

		// trees
	    var w0 = 933;
	    var h0 = 1770;
		var plane0 = new THREE.PlaneGeometry(w0,h0);

		var w1 = 798*0.7;
	    var h1 = 1024*0.7;
		var plane1 = new THREE.PlaneGeometry(w1,h1);

		var geometry = new THREE.Geometry();

		var tempArray = [];

		for (var i = 0; i < 400; i++) {

			var s = 0.3 + Math.random()*0.5;

			var x = 0;
			var dif = 200;
			while (x < dif && x > -dif) {
				x = Math.random()*4000 - 2000;
			}
			
			var id = 0;
			if (Math.random() > 0.8 && (x > 700 || x < -700) ) id = 1;

			if (id == 0) {
				var tree = new THREE.Mesh( plane0 );
				tree.position.y = (h0*0.5)*s;
			}
			if (id == 1) {
				var tree = new THREE.Mesh( plane1 );
				tree.position.y = (h1*0.5)*s;
			}

			var zoffset = Math.random();

			tree.position.z = zoffset*-3000;
			tree.position.x = x;
			
			var m = 1;
			if (Math.random() < 0.5) m = -1;

			tree.scale.set(s*m,s,s);

			tree.lookAt( new THREE.Vector3(0, 0, tree.position.z) );

			tree.rotation.x = 0;
			tree.rotation.z = 0;
			
			tree.position.z = 0;


			tempArray.push( {zoffset: zoffset, id: id} );

			THREE.GeometryUtils.merge(geometry, tree);
		}


		var attributes = {

			time:		 { type: 'f', value: [] },
			customColor: { type: 'c', value: [] },
			index:		 { type: 'f', value: [] },
						
		};


		var uniforms = {

			map0: { type: "t", value: textures.tree0 },
			map1: { type: "t", value: textures.tree1 },
			color : { type: "c", value: new THREE.Color( 0x898989 ) },
			fogColor : { type: "c", value: scene.fog.color },
			fogNear : { type: "f", value: scene.fog.near },
			fogFar : { type: "f", value: scene.fog.far },
			globalTime : { type: "f", value: 0.0 },

		};

		var material = new THREE.ShaderMaterial( {

			uniforms: uniforms,
			attributes: attributes,
			vertexShader: document.getElementById( 'vertexshader_tree' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader_tree' ).textContent,
			transparent: true,
			side: THREE.DoubleSide,

		} );


		var vertices = geometry.vertices;
		var values_time = attributes.time.value;
		var values_colors = attributes.customColor.value;
		var values_index = attributes.index.value;


		for( var v = 0; v < vertices.length; v+=4 ) {

			var time = tempArray[Math.floor(v/4)].zoffset;
			values_time[v] = time;
			values_time[v+1] = time;
			values_time[v+2] = time;
			values_time[v+3] = time;


			var color = new THREE.Color( 0xffffff );
			color.setHSL(Math.random()*0.1+0.7,1.0,0.2+Math.random()*0.6);

			values_colors[v] = color;
			values_colors[v+1] = color;
			values_colors[v+2] = color;
			values_colors[v+3] = color;

			var index = tempArray[Math.floor(v/4)].id;
			values_index[v] = index;
			values_index[v+1] = index;
			values_index[v+2] = index;
			values_index[v+3] = index;


		}


		trees = new THREE.Mesh( geometry, material );
		scene.add( trees );


		// snow
		var attributes = {

			size:		 { type: 'f', value: [] },
			customColor: { type: 'c', value: [] },
			time:		 { type: 'f', value: [] },

		};


		var uniforms = {

			color:      { type: "c", value: new THREE.Color( 0xffffff ) },
			texture:    { type: "t", value: textures.snowflake },
			globalTime:	{ type: "f", value: 0.0 },
			fogColor : { type: "c", value: scene.fog.color },
			fogNear : { type: "f", value: scene.fog.near },
			fogFar : { type: "f", value: scene.fog.far },
			opacity : { type: "f", value: 0.75 },
			force : { type: "v2", value: new THREE.Vector2(0,1.5) },
			scale : { type: "f", value: (window.innerHeight/2)/scaleRatio },

		};

		var shaderMaterial = new THREE.ShaderMaterial( {

			uniforms: 		uniforms,
			attributes:     attributes,
			vertexShader:   document.getElementById( 'vertexshader_snow' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader_snow' ).textContent,

			depthTest: 		false,
			transparent:	true,
			
		});


		var geometry = new THREE.Geometry();

		for ( var i = 0; i < 50000; i++ ) {
			var vector = new THREE.Vector3(Math.random()*2000 - 1000, -1500, Math.random()*2000-1000)

			geometry.vertices.push( vector );
		}

		particles = new THREE.ParticleSystem( geometry, shaderMaterial );

		particles.position.y = 1500;

		var vertices = particles.geometry.vertices;
		var values_size = attributes.size.value;
		var values_color = attributes.customColor.value;
		var values_time = attributes.time.value;

		for( var v = 0; v < vertices.length; v++ ) {
			
			values_size[ v ] = (6+Math.random()*18)/scaleRatio;//baseSize[v];
			values_color[ v ] = new THREE.Color( 0xffffff );
			values_color[ v ].setHSL(1.0, 0.0, 0.05 + Math.random()*0.75);
			values_time[ v ] = Math.random();

		}

		particles.position.z = -1000;

		scene.add( particles );

		// vignette
	    var overlayMaterial = new THREE.SpriteMaterial( { map: textures.vignette, useScreenCoordinates: true, fog: false, opacity: 0.75 } );
	    overlay = new THREE.Sprite( overlayMaterial );
	    overlay.scale.set( window.innerWidth/scaleRatio, window.innerHeight/scaleRatio , 1 );
	    overlay.position.set((window.innerWidth/scaleRatio)/2, (window.innerHeight/scaleRatio)/2 , 0);
	    camera.add(overlay);

		// cover
		var material = new THREE.MeshBasicMaterial( { color: 0x000000, depthTest: false, fog: false, transparent: true, opacity: 1.0 } );
		blackCover = new THREE.Mesh(new THREE.PlaneGeometry(1000,1000), material );
		blackCover.position.z = -2;
		camera.add( blackCover );

		var light = new THREE.DirectionalLight(0xffffff);
		light.position.set(0.2,0.5,-1);
		scene.add(light);

		// sign0
		var signMaterial = new THREE.MeshBasicMaterial( { map: textures.sign0, color: 0x898989, transparent: true, alphaTest: 0.4} );
	    var s = 0.6;
	    var plane = new THREE.PlaneGeometry(76*s,275*s);
	    var sign0 = new THREE.Mesh(plane, signMaterial);
	    sign0.position.set(270, 137*s, -800);
	    sign0.rotation.y = -0.1;
	    scene.add(sign0);

	    sign0.visible = false;

		// sign1
		var signMaterial = new THREE.MeshBasicMaterial( { map: textures.sign1, color: 0x898989, transparent: true, alphaTest: 0.4} );
	    var s = 0.2;
	    var plane = new THREE.PlaneGeometry(284*s,740*s);
	    var sign1 = new THREE.Mesh(plane, signMaterial);
	    sign1.position.set(270, 370*s, -600);
	    sign1.rotation.y = -0.1;
	    scene.add(sign1);

	    sign1.visible = false;


	    // rabbit
		var material = new THREE.MeshLambertMaterial( { color: 0x898989, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors } );
		rabbit = new THREE.MorphAnimMesh( rabbitGeometry, material );

		rabbit.duration = 2000;

		rabbit.scale.set( 0.7, 0.7, 0.7 );
		rabbit.position.set(-400, 0, -500);

		rabbit.rotation.y = Math.PI;

		scene.add( rabbit );

		rabbit.visible = false;


		// centi
		var material = new THREE.MeshBasicMaterial( { color: 0x000000, morphTargets: true } );
		centipede = new THREE.MorphAnimMesh( centiGeometry, material );

		centipede.duration = 5000;

		var s = 8;
		centipede.scale.set( s, s, s );
		centipede.position.set(-1500, 0, -500);

		centipede.rotation.y = Math.PI;

		scene.add( centipede );

		centipede.visible = false;


		// tank
		var material = new THREE.MeshLambertMaterial( {color: 0x333333, transparent: true } );


		tank = new THREE.Mesh(tankGeometry, material);

		tank.rotation.y = Math.PI;

		tank.position.set(30,16.2,-400);

		var s = 0.6;
		tank.scale.set(s,s,s);

		scene.add(tank);

		var pipeContainer = new THREE.Object3D();
		pipeContainer.rotation.x = 1.48
		pipeContainer.position.y = 70;
		tank.add(pipeContainer);

		var pipeGeo = new THREE.CylinderGeometry(6,6,170,12,1,false);
		pipeGeo.applyMatrix( new THREE.Matrix4().setPosition( new THREE.Vector3( 0, 90, 0 ) ) );
		pipe = new THREE.Mesh(pipeGeo, material);

		pipeContainer.add(pipe);


		// missile
		missile = new THREE.Mesh(missileGeometry, material);
		missile.scale.set(4,4,4);

		scene.add(missile);

		missile.visible = false;

		// spline
		var xx = 0;

		var array = [
					new THREE.Vector3(xx,0,66),
					new THREE.Vector3(xx,4,80),
					new THREE.Vector3(xx,21,89),
					new THREE.Vector3(xx,32,88),
					new THREE.Vector3(xx,39,76),
					new THREE.Vector3(xx,39,30),
					new THREE.Vector3(xx,39,-30),
					new THREE.Vector3(xx,39,-118),
					new THREE.Vector3(xx,30,-132),
					new THREE.Vector3(xx,20,-128),
					new THREE.Vector3(xx,4,-114),
					new THREE.Vector3(xx,0,-102),
					new THREE.Vector3(xx,0,-70),
					new THREE.Vector3(xx,0,66),
					];

		array.reverse()

		var spline = new THREE.SplineCurve3(array);

		var segments = 1;
		var tubeSegments = 1;

		var thickness = 12;

		var tubeGeometry = new THREE.TubeGeometry(spline, segments, thickness, tubeSegments, false, false);

		tube = new THREE.Mesh(tubeGeometry, material);

		var cube = new THREE.CubeGeometry(20,3,10);

		var offset = 60;

		var c0 = new THREE.Mesh(cube);
		c0.position.x = offset;

		var c1 = new THREE.Mesh(cube);
		c1.position.x = -offset;

		var band = new THREE.Geometry();

		THREE.GeometryUtils.merge(band, c0);
		THREE.GeometryUtils.merge(band, c1);

		var os = 30;

		for (var i = 0; i < os; i++) {
			
			var obj = new THREE.Mesh(band, material);

			tank.add(obj);

			objArray.push({obj: obj, time: i/os});

		}

		// smoke
		for (var i = 0; i < 20; i++) {
			var material = new THREE.SpriteMaterial( { map: textures.smoke, opacity: 0.0, useScreenCoordinates: false, color: 0x333333 } );
			var size = 16+Math.random()*16;
			var sprite = new THREE.Sprite( material );
			sprite.scale.set( size, size, 1 );
			sprite.rotation = Math.random()*Math.PI;

			sprite.position.set(0,90,180);

			sprite.position.x += Math.random()*40-20;
			sprite.position.y += Math.random()*40-20;

			smokeArray.push(sprite);

			tank.add(sprite);

		}


		// shadow
		var material = new THREE.MeshBasicMaterial( {map: textures.tankshadow, fog: false, blending: THREE.MultiplyBlending, transparent: true } );
		var plane = new THREE.PlaneGeometry(400,550);
		plane.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Vector3( -Math.PI/2, 0, 0 ) ) );
		var mesh = new THREE.Mesh(plane, material);
		tank.add(mesh);

		tank.setVisible = function (state) {
			
			tank.visible = state;
			pipe.visible = state

			for (var i = 0; i < tank.children.length; i++) {
				tank.children[i].visible = state;
			}

			for (var i = 0; i < objArray.length; i++) {
				objArray[i].obj.visible = state;
			}

		}

		tank.setVisible(false);

		// car
		car = new THREE.Object3D();
		scene.add(car);

		car.body = new THREE.Object3D();
		car.add(car.body);

		car.position.set(0,0,-600);

		var scale = 25;
		car.scale.set(scale,scale,scale);

		var material = new THREE.MeshLambertMaterial( {color: 0x222222, depthTest: true, fog: true, transparent: true, side: THREE.DoubleSide } );
	
		for ( var i = 0; i < carGeomtries.length; i ++ ) {

			carGeomtries[ i ].applyMatrix( new THREE.Matrix4().setPosition( new THREE.Vector3( -2.8, -28/scale, 0 ) ) );

			if (i == carGeomtries.length-1) {
				material = new THREE.MeshBasicMaterial( {map: textures.camaroshadow, fog: false, blending: THREE.MultiplyBlending, transparent: true } );
			}

			var mesh = new THREE.Mesh( carGeomtries[ i ], material );

			if (i==0 || i == 2 || i == 4 || i == 5 || i == 6) {
				car.body.add( mesh );
			} else {
				car.add( mesh );
			}

		}

		// tail lights
		var material = new THREE.MeshBasicMaterial( {map: textures.taillights, opacity: 0.4, depthTest: false, fog: true, transparent: true, side: THREE.BackSide } );
		var plane = new THREE.PlaneGeometry(256,256);
		var mesh = new THREE.Mesh(plane, material);
		mesh.position.y = 1.53;
		mesh.position.z = -3;
		mesh.position.x = 0.85;
		var s = 0.005;
		mesh.scale.set(s,s,s);					
		car.body.add(mesh);

		var mesh2 = new THREE.Mesh(plane, material);
		mesh2.position.y = 1.53;
		mesh2.position.z = -3;
		mesh2.position.x = -0.4;
		mesh2.scale.set(s,s,s);					
		car.body.add(mesh2);

		// headlights
		var material = new THREE.MeshBasicMaterial( {map: textures.lensflare, fog: false, depthTest: false, opacity: 0.8, transparent: true, blending: THREE.AdditiveBlending} );
		var plane = new THREE.PlaneGeometry(1,1);

		var z = 2.9;

		var sprite = new THREE.Mesh( plane, material );
		sprite.position.set( -0.75, 1.43, z );
		car.body.add( sprite );

		var sprite2 = new THREE.Mesh( plane, material );
		sprite2.position.set( -0.55, 1.48, z );
		car.body.add( sprite2 );

		var sprite3 = new THREE.Mesh( plane, material );
		sprite3.position.set( 0.75, 1.48, z );
		car.body.add( sprite3 );

		var sprite4 = new THREE.Mesh( plane, material );
		sprite4.position.set( 0.95, 1.43, z );
		car.body.add( sprite4 );

		// ligths on road
		var material = new THREE.MeshBasicMaterial( {map: textures.lights, depthTest: true, fog: true, opacity: 0.65, transparent: true} );
		var plane = new THREE.PlaneGeometry(8,16);
		plane.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Vector3( -Math.PI/2, 0, 0 ) ) );
		car.lights = new THREE.Mesh(plane, material);
		car.lights.rotation.y = -Math.PI;
		car.lights.position.y = 0.75;
		car.lights.position.z = 13;
		car.add(car.lights);


		car.setVisible = function (state) {
			
			for (var i = 0; i < car.children.length; i++) {
				car.children[i].visible = state;
			}

			for (var i = 0; i < car.body.children.length; i++) {
				car.body.children[i].visible = state;
			}

		}

		car.setVisible(false);

		// text
		var scale = 2.8;
		var textLayers = 8;
		var geometry = new THREE.Geometry();

		var tempArray = [];

		for ( i = 0; i < arrayReplicate.length; i ++ ) {

			var value = arrayReplicate[i].value;
			var xx = arrayReplicate[i].xx;
			var vertex = null;

			for (var j = 0; j < textLayers; j++) {

				if (value != null) {

					var rx = Math.random()*1 - 0.5;
					var ry = Math.random()*1 - 0.5;
					var rz = Math.random()*1 - 0.5;

					vertex = new THREE.Vector3(value.x*scale, value.y*-1*scale, j*(scale*0.5) - (textLayers*0.5)*scale*0.5);
					vertex.x += rx;
					vertex.y += ry;
					vertex.z += rz;
					
				};

				if (vertex != null) {
					geometry.vertices.push( vertex );

					tempArray.push(xx);
				};

			};

		}

		// particles
		var map = THREE.ImageUtils.loadTexture( "assets/flare.png" );

		var attributes = {

			size:		 { type: 'f', value: [] },
			customColor: { type: 'c', value: [] },
			time:		 { type: 'f', value: [] },
			end:		 { type: 'v3', value: [] },
			xx:		 	 { type: 'f', value: [] },

		};


		uniforms = {

			color:      { type: "c", value: new THREE.Color( 0xffffff ) },
			texture:    { type: "t", value: map },
			globalTime:	{ type: "f", value: 0.0 },
			morph:		{ type: "f", value: 0.0 },
			fogColor : { type: "c", value: scene.fog.color },
			fogNear : { type: "f", value: scene.fog.near },
			fogFar : { type: "f", value: scene.fog.far },
			opacity : { type: "f", value: 1.0 },
			bullet:		{ type: "v3", value: new THREE.Vector3(0,0,0) },
			scale : { type: "f", value: (window.innerHeight/2)/scaleRatio },

		};

		var shaderMaterial = new THREE.ShaderMaterial( {

			uniforms: 		uniforms,
			attributes:     attributes,
			vertexShader:   document.getElementById( 'vertexshader_text' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader_text' ).textContent,

			depthTest: 		false,
			transparent:	true,
			
		});

		var vertices = geometry.vertices;
		var values_size = attributes.size.value;
		var values_color = attributes.customColor.value;
		var values_time = attributes.time.value;
		var values_end = attributes.end.value;
		var values_xx = attributes.xx.value;

		for( var v = 0; v < vertices.length; v++ ) {
			
			values_size[ v ] = (1.0+Math.random()*5);
			values_color[ v ] = new THREE.Color( 0xffffff );
			values_color[ v ].setHSL(1.0, 0.0, 0.4 + Math.random()*0.2);
			values_time[ v ] = Math.random();
			values_end[ v ] = vertices[v].clone();

			values_end[ v ].x += Math.random()*16-8;
			values_end[ v ].z += Math.random()*16-8;
			values_end[ v ].y += Math.random()*20;

			values_xx[ v ] = tempArray[v];

		}

		
		particlesReplicate = new THREE.ParticleSystem( geometry, shaderMaterial );
		particlesReplicate.visible = false;

		scene.add( particlesReplicate );




		// Sequences
		var seq0 = new Sequence( 0 );
		seq0.start = function () {
			console.log("start 0");
			camera.position.x = 50;
			camera.position.y = 200;
			camera.position.z = -500;
			
			cameraTarget.x = -400;
			cameraTarget.y = 0;
			cameraTarget.z = -800;

			seq0.transition = false;

		}

		seq0.update = function () {

			speed = -(delta*0.00005);
			trees.material.uniforms.globalTime.value += speed;
			road.material.map.offset.y -= speed*4.9;

			cameraTarget.y = 280 + Math.sin(this.currentTime*0.0005)*30;
			cameraTarget.x = -400;
			cameraTarget.z = -800;
				
			camera.lookAt( cameraTarget );

			camera.up.x = Math.sin(this.currentTime*0.0003)*0.2;

			if (currentTime > 18500 && !seq0.transition) {
				
				seq0.transition = true;

				composer.passes[2].enabled = true;

				effectRoll.uniforms[ 'strength' ].value = 0;

				var aTween = new TWEEN.Tween( effectRoll.uniforms[ 'strength' ] )
		            .to( { value: 1 }, 500 )
		            .easing( TWEEN.Easing.Cubic.In );

				var bTween = new TWEEN.Tween( effectRoll.uniforms[ 'strength' ] )
		            .to( { value: 0 }, 500 )
		            .easing( TWEEN.Easing.Cubic.Out )
		            .onComplete(function () {
		            	composer.passes[2].enabled = false;
		            });

		        aTween.chain(bTween);
		        aTween.start();


			}

		}


		var seq1 =  new Sequence( 19000 );
		seq1.start = function () {
				
			camera.position.z = 0;
			camera.position.y = 30;
			camera.position.x = 50;

			sign0.visible = true;

			sign0.position.x = 180;
			sign0.position.z = -3000;

			seq1.transition = false;

		}
		seq1.update = function () {
			
			cameraTarget.x = Math.sin(this.currentTime*0.0002)*120;

			cameraTarget.y = 180 + Math.sin(this.currentTime*0.0005)*30;

			camera.lookAt( cameraTarget );
			
			camera.up.x = Math.sin(this.currentTime*0.0003)*0.2;

			speed = -(delta*0.0001);
			trees.material.uniforms.globalTime.value += speed;
			road.material.map.offset.y -= speed*3.7;

			sign0.position.z += delta*0.3;

			if (currentTime > 37300 && !seq1.transition) {
				
				seq1.transition = true;

				composer.passes[2].enabled = true;

				effectRoll.uniforms[ 'strength' ].value = 0;

				var aTween = new TWEEN.Tween( effectRoll.uniforms[ 'strength' ] )
		            .to( { value: 1 }, 500 )
		            .easing( TWEEN.Easing.Cubic.In );

				var bTween = new TWEEN.Tween( effectRoll.uniforms[ 'strength' ] )
		            .to( { value: 0 }, 500 )
		            .easing( TWEEN.Easing.Cubic.Out )
		            .onComplete(function () {
		            	composer.passes[2].enabled = false;
		            });

		        aTween.chain(bTween);
		        aTween.start();

			}

		}

		var seq2 = new Sequence( 37800 );
		seq2.start = function () {
			
			camera.position.x = 80;
			camera.position.y = 20;
			camera.position.z = -500;
			
			cameraTarget.x = -400;
			cameraTarget.y = 0;
			cameraTarget.z = -800;

			centipede.visible = true;
			centipede.position.x = -2500;

			var hslTween = new TWEEN.Tween( hsl )
	            .to( { s: 0.1, l: 0.3 }, 5000 )
	            .easing( TWEEN.Easing.Cubic.In );
	        hslTween.start();

			var overlayTween = new TWEEN.Tween( overlay.material )
	            .to( { opacity: 1.0 }, 5000 )
	            .easing( TWEEN.Easing.Cubic.In );
	        overlayTween.start();

			particles.material.uniforms.color.value = new THREE.Color( 0x888888 );

			composer.passes[1].enabled = true;
			effectWave.uniforms[ 'strength' ].value = 0;

			var aTween = new TWEEN.Tween( effectWave.uniforms[ 'strength' ] )
	            .to( { value: 1.5 }, 10000 )
	            .easing( TWEEN.Easing.Cubic.In );
	        aTween.start();

	        sign0.visible = false;

		}

		seq2.update = function () {


			speed = -(delta*0.0001);
			trees.material.uniforms.globalTime.value += speed;
			road.material.map.offset.y -= speed*4.9;

			cameraTarget.y = 200 + Math.sin(this.currentTime*0.0005)*30;
				
			camera.lookAt( cameraTarget );

			camera.up.x = Math.sin(this.currentTime*0.0003)*0.2;

			if (centipede.position.x < -1500) {
				centipede.position.x += delta*0.085;
			}

		}

		var seq3 = new Sequence( 56000 );
		seq3.start = function () {
			
			camera.position.x = 50;
			camera.position.y = 40;
			camera.position.z = 0;
			
			cameraTarget.x = -400;
			cameraTarget.y = 0;
			cameraTarget.z = -800;

			car.setVisible(true);

			var hslTween = new TWEEN.Tween( hsl )
	            .to( { s: 0.5, l: 0.8 }, 1000 )
	            .easing( TWEEN.Easing.Cubic.Out );
	        hslTween.start();

			var overlayTween = new TWEEN.Tween( overlay.material )
	            .to( { opacity: 0.75 }, 1000 )
	            .easing( TWEEN.Easing.Cubic.Out );
	        overlayTween.start();

			car.position.x = -40;
			car.position.z = -2500;

			particles.material.uniforms.color.value = new THREE.Color( 0xffffff );

			particles.material.uniforms.force.value.y = -1.5;
			particles.position.z = 0;

			composer.passes[1].enabled = false;

			centipede.visible = false;

			seq3.haveShaked = false;
		}

		seq3.update = function () {


			speed = (delta*0.0001);
			trees.material.uniforms.globalTime.value += speed;
			road.material.map.offset.y -= speed*4.9;

			car.position.z += delta*0.8;

			car.lights.material.opacity = 0.65 + Math.random()*0.2-0.1;

			car.body.position.y = Math.random()*0.03;

			camera.lookAt( cameraTarget );

			camera.up.x = Math.sin(this.currentTime*0.0003)*0.2;
			camera.up.x += Math.random()*0.06*shake.value;

			if (currentTime > 58500 && !seq3.haveShaked) {

				seq3.haveShaked = true;

				var aTween = new TWEEN.Tween( shake )
		            .to( { value: 1 }, 750 )
		            .easing( TWEEN.Easing.Cubic.Out );

				var bTween = new TWEEN.Tween( shake )
		            .to( { value: 0 }, 750 )
		            .easing( TWEEN.Easing.Cubic.InOut );

				aTween.chain(bTween);
		    	aTween.start();

			}

		}

		var seq4 = new Sequence( 60000 );
		seq4.start = function () {
			
			camera.position.x = -30;
			camera.position.y = 50;
			camera.position.z = -180;
			
			cameraTarget.x = 50;
			cameraTarget.y = 0;
			cameraTarget.z = -500;

			car.setVisible(true);
			car.lights.visible = true;

			car.position.x = 40;
			car.position.z = -250;

			car.rotation.y = Math.PI;

			particles.material.uniforms.force.value.y = 1.5;
			particles.position.z = -1000;

			sign1.visible = true;

			sign1.position.x = 180;
			sign1.position.z = -5500;

			seq4.transition = false;
		}

		seq4.update = function () {


			speed = -(delta*0.00025);
			trees.material.uniforms.globalTime.value += speed;
			road.material.map.offset.y -= speed*4.9;

			cameraTarget.y += delta*0.005;
			cameraTarget.z -= delta*0.005;
				
			sign1.position.z += delta*0.75;


			car.body.position.y = Math.random()*0.015;

			car.position.x = 40 + Math.sin(this.currentTime*0.001)*2;

			car.lights.material.opacity = 0.45 + Math.random()*0.4-0.2;

			camera.position.x = -30 + Math.sin(this.currentTime*0.0005)*20;

			camera.lookAt( cameraTarget );

			camera.up.x = Math.sin(this.currentTime*0.0003)*0.2;
			camera.up.x += Math.random()*0.005;

			if (currentTime > 73000 && !seq4.transition) {
				
				seq4.transition = true;

				composer.passes[2].enabled = true;

				effectRoll.uniforms[ 'strength' ].value = 0;

				var aTween = new TWEEN.Tween( effectRoll.uniforms[ 'strength' ] )
		            .to( { value: 2 }, 1000 )
		            .easing( TWEEN.Easing.Cubic.In );

				var bTween = new TWEEN.Tween( effectRoll.uniforms[ 'strength' ] )
		            .to( { value: 0 }, 1000 )
		            .easing( TWEEN.Easing.Cubic.Out )
		            .onComplete(function () {
		            	composer.passes[2].enabled = false;
		            });

		        aTween.chain(bTween);
		        aTween.start();

			}

		}

		var seq5 = new Sequence( 74000 );
		seq5.start = function () {
			
			camera.position.x = 50;
			camera.position.y = 20;
			camera.position.z = 0;
			
			cameraTarget.x = 50;
			cameraTarget.y = 0;
			cameraTarget.z = -500;

			car.setVisible(true);
			car.lights.visible = false;

			sign1.visible = false;

			car.position.x = 40;
			car.position.z = -250;

			car.rotation.y = Math.PI;

			particles.material.uniforms.force.value.y = 1.5;
			particles.position.z = -1000;
		}

		seq5.update = function () {


			speed = -(delta*0.0001);
			trees.material.uniforms.globalTime.value += speed;
			road.material.map.offset.y -= speed*4.9;

			cameraTarget.y += delta*0.005;
			cameraTarget.z -= delta*0.005;

			camera.position.x = 36 + Math.cos(this.currentTime*0.0005)*20;

			camera.position.z -= delta*0.025;

			camera.lookAt( cameraTarget );

			camera.up.x = Math.sin(this.currentTime*0.0003)*0.2;

			car.body.position.y = Math.random()*0.015;

		}

		var seq6 = new Sequence( 93000 );
		seq6.start = function () {
			
			camera.position.x = -50;
			camera.position.y = 25;
			camera.position.z = -300;
			
			cameraTarget.x = 400;
			cameraTarget.y = 0;
			cameraTarget.z = -600;

			particles.material.uniforms.force.value.y = -1.5;
			particles.position.z = 0;

			car.setVisible(false);

			rabbit.visible = true;

			rabbit.position.x = 350;
			rabbit.position.z = 500;

			seq6.transition = false;

		}

		seq6.update = function () {


			speed = (delta*0.0001);
			trees.material.uniforms.globalTime.value += speed;
			road.material.map.offset.y -= speed*6.5;

			cameraTarget.y = 80 + Math.sin(this.currentTime*0.0005)*30;
				
			camera.position.x -= delta*0.01;
			camera.position.y += delta*0.005;

			camera.lookAt( cameraTarget );

			camera.up.x = Math.sin(this.currentTime*0.0003)*0.2;

			rabbit.position.z -= delta*0.4;

			if (currentTime > 98500 && !seq6.transition) {
				
				seq6.transition = true;

				composer.passes[2].enabled = true;

				effectRoll.uniforms[ 'strength' ].value = 0;

				var aTween = new TWEEN.Tween( effectRoll.uniforms[ 'strength' ] )
		            .to( { value: 2 }, 1000 )
		            .easing( TWEEN.Easing.Cubic.In );

				var bTween = new TWEEN.Tween( effectRoll.uniforms[ 'strength' ] )
		            .to( { value: 0 }, 1000 )
		            .easing( TWEEN.Easing.Cubic.Out )
		            .onComplete(function () {
		            	composer.passes[2].enabled = false;
		            });

		        aTween.chain(bTween);
		        aTween.start();

			}

		}

		var seq7 = new Sequence( 99500 );
		seq7.start = function () {
			
			camera.position.x = -60;
			camera.position.y = 30;
			camera.position.z = -100;
			
			cameraTarget.x = 200;
			cameraTarget.y = 0;
			cameraTarget.z = -400;

			tank.setVisible(true);

			tank.position.x = 20;
			tank.position.z = -200;

			switchTrees(1);

			particles.material.uniforms.force.value.y = 1.5;
			particles.position.z = -1000;

			rabbit.visible = false;

			hsl.s = 0.1;
			hsl.l = 0.3;

			overlay.material.opacity = 1;

			particles.material.uniforms.color.value = new THREE.Color( 0x888888 );

		}

		seq7.update = function () {


			speed = -(delta*0.00005);
			trees.material.uniforms.globalTime.value += speed;
			road.material.map.offset.y -= speed*4.9;

			camera.position.y = 30 + Math.sin(this.currentTime*0.0005)*10;

			cameraTarget.y = 100 + Math.sin(this.currentTime*0.0005)*30;
				
			camera.lookAt( cameraTarget );

			camera.up.x = Math.sin(this.currentTime*0.0003)*0.4;
			camera.up.x += Math.random()*0.02;

		}

		var seq8 = new Sequence( 105000 );
		seq8.start = function () {
			
			camera.position.x = 60;
			camera.position.y = 30;
			camera.position.z = -50;
			
			cameraTarget.x = -200;
			cameraTarget.y = 0;
			cameraTarget.z = -400;

			tank.setVisible(true);

			tank.rotation.y = Math.PI*2;

			tank.position.x = -20;
			tank.position.z = -300;

			particles.material.uniforms.force.value.y = -1.5;
			particles.position.z = 1000;

			composer.passes[1].enabled = true;
			effectWave.uniforms[ 'strength' ].value = 0;

			seq8.transition = false;

		}

		seq8.update = function () {

			var slowdown = 1;
			if (isFiring) slowdown = 0.1;

			speed = (delta*0.00005)*slowdown;
			trees.material.uniforms.globalTime.value += speed;
			road.material.map.offset.y -= speed*4.9;

			camera.position.y = 30 + Math.sin(this.currentTime*0.0005)*10;

			cameraTarget.y = 100 + Math.sin(this.currentTime*0.0005)*30;
				
			camera.lookAt( cameraTarget );

			camera.up.x = Math.sin(this.currentTime*0.0003)*0.4;
			camera.up.x += Math.random()*0.05*shake.value;

			if (tank) {
				tank.rotation.x = Math.random()*0.05*shake.value;
				tank.rotation.z = Math.random()*0.05*shake.value;
			}

			if (currentTime >= 111500 && !isFiring && tank) {
				fire();

				var camTween = new TWEEN.Tween( camera.position )
		            .to( { z: -25 }, 3000 )
		            .delay(2000)
		            .easing( TWEEN.Easing.Cubic.InOut );
		        camTween.start();

				var camTargetTween = new TWEEN.Tween( cameraTarget )
		            .to( { z: -300 }, 3000 )
		            .delay(2000)
		            .easing( TWEEN.Easing.Cubic.InOut );
		        camTargetTween.start();

			}

			if (currentTime > 116000 && !seq8.transition) {
				
				seq8.transition = true;

				composer.passes[2].enabled = true;

				effectRoll.uniforms[ 'strength' ].value = 0;

				var aTween = new TWEEN.Tween( effectRoll.uniforms[ 'strength' ] )
		            .to( { value: 2 }, 2000 )
		            .easing( TWEEN.Easing.Cubic.In );

				var bTween = new TWEEN.Tween( effectRoll.uniforms[ 'strength' ] )
		            .to( { value: 0 }, 2000 )
		            .easing( TWEEN.Easing.Cubic.Out )
		            .onComplete(function () {
		            	composer.passes[2].enabled = false;
		            });

		        aTween.chain(bTween);
		        aTween.start();

			}

		}

		var seq9 = new Sequence( 118000 );
		seq9.start = function () {
			
			camera.position.x = 150;
			camera.position.y = 30;
			camera.position.z = -600;
			
			cameraTarget.x = -200;
			cameraTarget.y = 0;
			cameraTarget.z = -700;

			tank.setVisible(false);

			particles.material.uniforms.force.value.y = -1.5;
			particles.position.z = 1000;

			isFiring = false;

			particles.visible = false;

			particles.material.uniforms.color.value = new THREE.Color( 0xffffff );


			var hslTween = new TWEEN.Tween( hsl )
	            .to( { s: 0.5, l: 0.8 }, 6000 )
	            .easing( TWEEN.Easing.Cubic.In );
	        hslTween.start();

			var overlayTween = new TWEEN.Tween( overlay.material )
	            .to( { opacity: 0.75 }, 6000 )
	            .easing( TWEEN.Easing.Cubic.In );
	        overlayTween.start();


			composer.passes[1].enabled = true;
			effectWave.uniforms[ 'strength' ].value = 1;

			var aTween = new TWEEN.Tween( effectWave.uniforms[ 'strength' ] )
	            .to( { value: 0 }, 3000 )
	            .easing( TWEEN.Easing.Cubic.Out );
	        aTween.start();


	        missile.visible = true;

	        missile.scale.set(5,5,5);

	        missile.position.z = -650;
	        missile.position.x = 50;

		}

		seq9.update = function () {

			speed = delta*0.001;
			trees.material.uniforms.globalTime.value += speed;
			road.material.map.offset.y -= speed*4.9;

			camera.position.y = 40 + Math.sin(this.currentTime*0.0005)*10;

			cameraTarget.y = 100 + Math.sin(this.currentTime*0.0005)*30;
				
			missile.rotation.z += speed*3;

			missile.position.z += speed*10;
			cameraTarget.z += speed*3;

			camera.lookAt( cameraTarget );

			camera.up.x = Math.sin(this.currentTime*0.0003)*0.4;

		}

		var seq10 = new Sequence( 125000 );
		seq10.start = function () {
			
			camera.position.x = -150;
			camera.position.y = 30;
			camera.position.z = -800;
			
			cameraTarget.x = 200;
			cameraTarget.y = 0;
			cameraTarget.z = -850;

			tank.setVisible(false);

			particles.material.uniforms.force.value.y = -1.5;
			particles.position.z = 1000;

			particles.material.uniforms.force.value.y = 0;
			particles.position.z = 0;
			particles.visible = true;

			particlesReplicate.position.z = -760;
			particlesReplicate.position.x = 50;
			particlesReplicate.position.y = 100;
			particlesReplicate.rotation.y = -Math.PI/2;
			particlesReplicate.visible = true;

	        missile.visible = true;

	        missile.scale.set(7,7,7);

	        missile.position.z = -1700;
	        missile.position.x = 50;
	        missile.position.y = 100;

			var delay = 500;

			var mTween = new TWEEN.Tween( missile.position )
	            .to( { z: 500 }, 5500 )
	            .delay(delay)
	            .easing( TWEEN.Easing.Linear.None );
        	mTween.start();

			isFiring = true;

			switchTrees(0);

			particlesReplicate.material.uniforms.bullet.value.x = -700;

			var aTween = new TWEEN.Tween( particlesReplicate.material.uniforms.bullet.value )
	            .to( { x: 500 }, 6000 )
	            .delay(delay)
	            .easing( TWEEN.Easing.Cubic.InOut );
        	aTween.start();

        	particlesReplicate.material.uniforms.morph.value = -0.1;

			var bTween = new TWEEN.Tween( particlesReplicate.material.uniforms.morph )
	            .to( { value: 2.1 }, 6200 )
	            .delay(delay)
	            .easing( TWEEN.Easing.Cubic.InOut );
        	bTween.start();

        	composer.passes[1].enabled = false;


	    	// cover
	    	if (blackCover.alphaTween) {
	    		blackCover.alphaTween.stop();
	    	}

	    	blackCover.visible = true;
	    	blackCover.material.opacity = 0.0;
	        blackCover.alphaTween = new TWEEN.Tween( blackCover.material )
	            .to( { opacity: 1.0 }, 6000 )
	            .easing( TWEEN.Easing.Quadratic.In )
	            .delay(8000);
	    	blackCover.alphaTween.start();

	    	// end credits
			var end = document.getElementById('end_credits');
			end.style.display = "block";
			end.style.opacity = 0.01;

		    var inTween0 = new TWEEN.Tween( end.style )
		        .to( { opacity: 1.0 }, 4000 )
		        .delay(10000)
		        .easing( TWEEN.Easing.Quadratic.In );

		    var outTween0 = new TWEEN.Tween( end.style )
		        .to( { opacity: 0.01 }, 4000 )
		        .delay(12000)
		        .easing( TWEEN.Easing.Quadratic.Out )
		        .onComplete(function () {
		        	done = true;
		        	composer.passes[1].enabled = false;
		        	composer.passes[2].enabled = false;
		        });

		    inTween0.chain(outTween0);
			inTween0.start();

	    	// grain
	        var grainTween = new TWEEN.Tween( effectFilmGrain.uniforms[ 'amount' ] )
	            .to( { value: 0.0 }, 4000 )
	            .easing( TWEEN.Easing.Quadratic.Out )
	            .delay(26000)
	            .onStart(function () {
	            	particlesReplicate.visible = false;
	            })
	    	grainTween.start();

		}

		seq10.update = function () {

			speed = 0;
			trees.material.uniforms.globalTime.value += speed;
			road.material.map.offset.y -= speed*4.9;

			missile.position.z += delta*0.01;

			cameraTarget.y = 150 + Math.sin(this.currentTime*0.0005)*30;
				
			camera.lookAt( cameraTarget );

			camera.position.y += delta*0.01;
			camera.position.x -= delta*0.008;

			camera.position.z += delta*0.05;
			cameraTarget.z += delta*0.02;

			camera.up.x = Math.sin(this.currentTime*0.0003)*0.4;

		}



		try {
			// renderer
			renderer = new THREE.WebGLRenderer({antialias: false});
			renderer.setSize( window.innerWidth/scaleRatio, window.innerHeight/scaleRatio );

			renderer.setClearColor(scene.fog.color);
			renderer.sortObjects = false;

			// postprocessing
			renderer.autoClear = false;

			var renderModel = new THREE.RenderPass( scene, camera );
			effectFilmGrain = new THREE.ShaderPass( THREE.FilmGrainShader );
			effectFilmGrain.uniforms[ 'size' ].value.x = window.innerWidth/scaleRatio;
			effectFilmGrain.uniforms[ 'size' ].value.y = window.innerHeight/scaleRatio;					

			effectWave = new THREE.ShaderPass( THREE.WaveShader );

			effectRoll = new THREE.ShaderPass( THREE.RollShader );

			var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
			effectCopy.renderToScreen = true;

			composer = new THREE.EffectComposer( renderer );
			composer.setSize(window.innerWidth/scaleRatio, window.innerHeight/scaleRatio);

			composer.addPass( renderModel );
			composer.addPass( effectWave );
			composer.addPass( effectRoll );
			composer.addPass( effectFilmGrain );
			composer.addPass( effectCopy );

			composer.passes[1].enabled = false;
			composer.passes[2].enabled = false;
			
			renderer.domElement.style.position = "absolute";
			renderer.domElement.style.top = "0px";
			renderer.domElement.style.left = "0px";

			if (scaleRatio > 1) {
				renderer.domElement.style.webkitTransform = "scale3d("+scaleRatio+", "+scaleRatio+", 1)";
				renderer.domElement.style.webkitTransformOrigin = "0 0 0";
				renderer.domElement.style.transform = "scale3d("+scaleRatio+", "+scaleRatio+", 1)";
				renderer.domElement.style.transformOrigin = "0 0 0";				
			}

			window.addEventListener( 'resize', onWindowResize, false );
			document.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

			container.appendChild( renderer.domElement );

		}
		catch (e) {
			// need webgl
			alert("You need webgl. :'(")
			return;
		}

	}

	// render
	var animate = function () {
		
		if (done) return;

		requestAnimationFrame( animate );

		render();

	}

	var render = function () {
		
		time = Date.now();
		delta = time - oldTime;
		oldTime = time;

		if (isNaN(delta) || delta > 1000 || delta == 0 ) {
			delta = 1000/60;
		}

		currentTime = getTime();

		runSequences();

		var slowdown = 1;
		if (isFiring) slowdown = 0.1;


		particles.material.uniforms.globalTime.value += (delta * 0.00015)*slowdown;
		effectFilmGrain.uniforms[ 'globalTime' ].value += delta*0.000000001;
		effectWave.uniforms[ 'globalTime' ].value += delta*0.0001;
		effectRoll.uniforms[ 'globalTime' ].value += delta*0.001;

		TWEEN.update();

		scene.fog.color.setHSL(Math.sin(currentTime*0.0001),hsl.s,hsl.l)
		renderer.setClearColor(scene.fog.color);
		particles.material.uniforms.fogColor.value = scene.fog.color;
		particlesReplicate.material.uniforms.globalTime.value += delta * 0.0003;
		particlesReplicate.material.uniforms.fogColor.value = scene.fog.color;

		if (rabbit && rabbit.visible) {
			rabbit.updateAnimation( delta );
		}

		if (centipede && centipede.visible) {
			centipede.updateAnimation( delta );
		}

		// tank
		if (tube && tank.visible) {

			var looptime = 4 * 1000;

			if (isFiring) looptime *= 10;

			for (var i = 0; i < objArray.length; i++) {
			
				var o = objArray[i];

				var t = ( (time+o.time*looptime) % looptime ) / looptime;

				var pos = tube.geometry.path.getPointAt( t );

				o.obj.position = pos;

				var dir = tube.geometry.path.getTangentAt( t );
				o.obj.rotation.x = dir.y;


			}

		}	

		renderer.clear();
		composer.render();

	}

	// events
	var onWindowResize = function ( event ) {

		var w = window.innerWidth;
		var h = window.innerHeight;

		renderer.setSize( w/scaleRatio, h/scaleRatio );

		camera.aspect = w / h;
		camera.updateProjectionMatrix();

		composer.reset();
		composer.setSize(w/scaleRatio, h/scaleRatio);				

		effectFilmGrain.uniforms[ 'size' ].value.x = w/scaleRatio;
		effectFilmGrain.uniforms[ 'size' ].value.y = h/scaleRatio;

		if (overlay) {
			overlay.scale.set( w/scaleRatio, h/scaleRatio, 1 );
	   		overlay.position.set((w/scaleRatio)/2, (h/scaleRatio)/2 , 0);
		}

		particles.material.uniforms.scale.value = (h/2)/scaleRatio;
		particlesReplicate.material.uniforms.scale.value = (h/2)/scaleRatio;

	}

	var fire = function() {

		var aTween = new TWEEN.Tween( pipe.position )
            .to( { y: -45 }, 2000 )
            .easing( TWEEN.Easing.Cubic.Out );

		var bTween = new TWEEN.Tween( pipe.position )
            .to( { y: 0 }, 6000 )
            .easing( TWEEN.Easing.Bounce.Out );

		aTween.chain(bTween);
    	aTween.start();

		var aTween = new TWEEN.Tween( shake )
            .to( { value: 0.5 }, 4000 )
            .easing( TWEEN.Easing.Cubic.Out );

		var bTween = new TWEEN.Tween( shake )
            .to( { value: 0 }, 4000 )
            .easing( TWEEN.Easing.Cubic.InOut );

		aTween.chain(bTween);
    	aTween.start();

		isFiring = true;


		var aTween = new TWEEN.Tween( effectWave.uniforms[ 'strength' ] )
            .to( { value: 1.5 }, 6000 )
            .delay(1000)
            .easing( TWEEN.Easing.Bounce.Out );

    	aTween.start();

		// smoke
		for (var i = 0; i < smokeArray.length; i++) {
			var s = smokeArray[i];

			var aTween = new TWEEN.Tween( s.material )
	            .to( { opacity: 0.75+Math.random()*0.25 }, 3000 )
	            .delay(1500)
	            .easing( TWEEN.Easing.Cubic.Out );

			var bTween = new TWEEN.Tween( s.material )
	            .to( { opacity: 0 }, 5000 )
	            .easing( TWEEN.Easing.Cubic.InOut );

			aTween.chain(bTween);
        	aTween.start();

			s.position.x = Math.random()*40-20;
			s.position.y = 90+Math.random()*40-20;
			s.position.z = 180;

        	var px = s.position.x + Math.random()*80-40;
        	var py = s.position.y + Math.random()*80-40;
        	var pz = s.position.z + Math.random()*80-40;

			var posTween = new TWEEN.Tween( s.position )
	            .to( { x: px, y: py, z: pz }, 6000 )
	            .delay(1500)
	            .easing( TWEEN.Easing.Cubic.Out );
	        posTween.start();

			var size = 16+Math.random()*16;
			s.scale.set( size, size, 1 );

			var scaleTween = new TWEEN.Tween( s.scale )
	            .to( { x: size*3, y: size*3 }, 6000 )
	            .delay(1500)
	            .easing( TWEEN.Easing.Cubic.Out );
	        scaleTween.start();

		}

		// missile
		missile.position.x = -20;
		missile.position.y = 64;
		missile.position.z = -220;

		var missileTween = new TWEEN.Tween( missile.position )
            .to( { z: 100 }, 2000 )
            .delay(1500)
            .easing( TWEEN.Easing.Cubic.In )
            .onStart(function () {
            	missile.visible = true;
            });
        missileTween.start();

		var rotateTween = new TWEEN.Tween( missile.rotation )
            .to( { z: 8 }, 2000 )
            .delay(1500)
            .easing( TWEEN.Easing.Cubic.In );
        rotateTween.start();


	}

	var switchTrees = function (t) {
		
		if (t == 0) {
			trees.material.uniforms.map0.value = textures.tree0;
			trees.material.uniforms.map1.value = textures.tree1;
		} else {
			trees.material.uniforms.map0.value = textures.tree1b;
			trees.material.uniforms.map1.value = textures.tree0b;
		}

	}


	var sequenceList = [];

	var runSequences = function () {
		
		// run current item
		sequenceList[0].update();
		sequenceList[0].currentTime = currentTime - sequenceList[0].startTime;

		if (sequenceList.length <= 1) {
			//console.log("No more items.");
			return;
		}

		var nextSequence = sequenceList[1];

		if (currentTime >= nextSequence.startTime) {
			// switch item
			var currentSequence = sequenceList[0];
			currentSequence.end();

			nextSequence.start();
			nextSequence.update();

			sequenceList.splice(0, 1);
		}

	}

	function Sequence( time ) {

		this.startTime = time;
		this.currentTime = 0;

		this.start = function () {

		}

		this.update = function () {

		}

		this.end = function () {
			
		}

		sequenceList.push(this);

	}



	function morphColorsToFaceColors( geometry ) {

		if ( geometry.morphColors && geometry.morphColors.length ) {

			var colorMap = geometry.morphColors[ 0 ];

			for ( var i = 0; i < colorMap.colors.length; i ++ ) {

				geometry.faces[ i ].color = colorMap.colors[ i ];
				geometry.faces[ i ].color.offsetHSL( 0, 0.3, 0 );

			}

		}

	}

	var onTouchStart = function ( event ) {

		event.preventDefault();

		rep.start();

   		document.getElementById('touch_start').style.display = "none";

		document.removeEventListener( 'touchstart', onTouchStart, false );

	}

	return rep;

})();