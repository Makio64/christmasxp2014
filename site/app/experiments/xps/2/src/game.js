/**
	Winter Rush Game
	Gameplay + field
	by Felix Turner / www.airtight.cc / @felixturner
**/

//global
var snoise = new ImprovedNoise();
var FLOOR_WIDTH = 3600; //x
var FLOOR_DEPTH = 7200; //z
var MOVE_STEP = 500; //number of z units to move before recreating a new background strip

var XRGame = function() {

	var debugGeometry, debugMaterial, debugMesh;
	
	var clock;
	
	var moverGroup;
	var presentGroup;
	var stepCount = 0;

	var ACCEL = 2000;
	var MAX_SPEED_ACCEL = 70;
	var START_MAX_SPEED = 1500;
	var FINAL_MAX_SPEED = 7000;

	var moveSpeed = 0; //z-units per second
	var maxSpeed; //increments over time

	var slideSpeed = 0;
	var SIDE_ACCEL = 500;
	var MAX_SIDE_SPEED = 4000;
	var sliding = false;
	var rightDown = false;
	var leftDown = false;

	var trees = [];
	var TREE_COUNT = 10;

	var noiseScale = 3;
	var noiseSeed = Math.random() * 100;

	var FLOOR_RES = 20;
	
	var FLOOR_YPOS = -300; //y
	var FLOOR_THICKNESS = 300;//250;

	var floorGeometry;
	var splash;
	var playing = false;

	var TREE_COLS = [0x466310,0x355B4B,0x5D763F];
	var treeMaterials;
	var trunkMaterial;
	var treeGeom;
	var trunkGeom;

	var acceptInput = true;


	function init(){

		clock = new THREE.Clock();

		//lights
		//HemisphereLight(skyColorHex, groundColorHex, intensity)
		var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
		XRMain.getScene().add( hemisphereLight );
		hemisphereLight.position.y = 300;

		//middle light
		var centerLight = new THREE.PointLight( 0xFFFFFF, 0.5, 4500 );
		XRMain.getScene().add(centerLight);
		centerLight.position.z = FLOOR_DEPTH/4;

		var frontLight = new THREE.PointLight( 0xFFFFFF, 1, 2500 );
		XRMain.getScene().add(frontLight);
		frontLight.position.z = FLOOR_DEPTH/2;

		moverGroup = new THREE.Object3D();
		XRMain.getScene().add( moverGroup );

		//make floor
		var floorGroup = new THREE.Object3D();

		var floorMaterial = new THREE.MeshLambertMaterial({
			color: 0xEEEEEE, //diffuse							
			emissive: 0x000000, 
			shading: THREE.FlatShading, 
			blending: THREE.NormalBlending, 
			transparent: false,
			opacity: 1.0	,
			side: THREE.DoubleSide,
		});

		//add extra x width
		floorGeometry = new THREE.PlaneGeometry( FLOOR_WIDTH + 1200, FLOOR_DEPTH , FLOOR_RES,FLOOR_RES );
		var floorMesh = new THREE.Mesh( floorGeometry, floorMaterial );
		floorGroup.add( floorMesh );
		moverGroup.add( floorGroup );
		floorMesh.rotation.x = Math.PI/2;
		floorGroup.position.y = FLOOR_YPOS;
		moverGroup.position.z = - MOVE_STEP;
		floorGroup.position.z = 500;

		//make trees
		var i;
		treeMaterials = [];

		for(  i= 0; i < TREE_COLS.length; i++) {

			var treeMaterial = new THREE.MeshLambertMaterial({

				color: TREE_COLS[i],				
				shading: THREE.FlatShading, 
				blending: THREE.NormalBlending, 
				depthTest: true,
				transparent: false,
				opacity: 1.0,
						
			});
			treeMaterials.push(treeMaterial);
		}

		trunkMaterial = new THREE.MeshLambertMaterial({
				color: 0x330000, 					
				shading: THREE.FlatShading, 
				blending: THREE.NormalBlending, 
				depthTest: true,
				transparent: false,
				opacity: 1.0,
			});

		trunkGeom = new THREE.CylinderGeometry(50, 50, 200, 8, 1, false);
		treeGeom = new THREE.CylinderGeometry(0, 200, 1200, 8, 1, false);

		var tree;
		for( i = 0; i < TREE_COUNT; i++) {

			var scl = ATUtil.randomRange(0.8,1.3);
			var matID = i%TREE_COLS.length;
			tree = makeTree(scl,matID);

			moverGroup.add( tree );
			tree.posi = Math.random();
			tree.posj = Math.random();
			tree.position.x = tree.posj * FLOOR_WIDTH - FLOOR_WIDTH/2;
			tree.position.z = - (tree.posi * FLOOR_DEPTH) + FLOOR_DEPTH/2;
			trees.push(tree);
			tree.collided = false;
		}

		//add trees down the edges
		var EDGE_TREE_COUNT = 12;
		for( i = 0; i < EDGE_TREE_COUNT; i++) {
			tree = makeTree(1.3,0);
			moverGroup.add( tree );
			tree.position.x = FLOOR_WIDTH/2 + 300;
			tree.position.z = FLOOR_DEPTH * i/EDGE_TREE_COUNT -  FLOOR_DEPTH/2;

		}

		for( i = 0; i < EDGE_TREE_COUNT; i++) {
			tree = makeTree(1.3,0);
			moverGroup.add( tree );
			tree.position.x = -(FLOOR_WIDTH/2 + 300);
			tree.position.z = FLOOR_DEPTH * i/EDGE_TREE_COUNT -  FLOOR_DEPTH/2;
		}


		//add floating present

		if(XRConfig.showPresent){

			presentGroup = new THREE.Object3D();
			moverGroup.add( presentGroup );

			presentGroup.position.x = ATUtil.randomRange(-FLOOR_WIDTH/2, FLOOR_WIDTH/2);
			presentGroup.position.z = ATUtil.randomRange(-FLOOR_DEPTH/2, FLOOR_DEPTH/2);
			//presentGroup.position.y = 200;

			var presentMaterial = new THREE.MeshPhongMaterial({
				color: 0xFF0000, 
				specular: 0x00FFFF, 
				emissive: 0x0000FF, 
				shininess: 60, 
				shading: THREE.FlatShading, 
				blending: THREE.NormalBlending, 
				depthTest: true,
				transparent: false,
				opacity: 1.0		
			});

			var presentGeom = new THREE.TetrahedronGeometry(100, 2);

			var present = new THREE.Mesh( presentGeom, presentMaterial );
			presentGroup.add( present );

			//PointLight(hex, intensity, distance)
			var presentLight = new THREE.PointLight( 0xFF00FF, 1.2, 600 );
			presentGroup.add( presentLight );

			presentGroup.collided = false;
		}				

		
		XRSnow.init();

		setFloorHeight();

		resetField();

		clock.start();
		maxSpeed = START_MAX_SPEED;

	}


	function makeTree(scale,materialID){

		var tree = new THREE.Object3D();
		var branches = new THREE.Mesh( treeGeom, treeMaterials[materialID] );
		var trunk =   new THREE.Mesh( trunkGeom, trunkMaterial );
		tree.add( branches );
		tree.add( trunk );
		trunk.position.y =  -700;
		tree.scale.x = tree.scale.z = tree.scale.y = scale; 
		tree.myheight = 1400 * tree.scale.y;
		//put tree on floor
		tree.position.y =  tree.myheight/2 - 300;
		return tree;
	}

	function setFloorHeight(){ 

		//apply noise to floor

		//move mover back by MOVE_STEP
		stepCount++;
		moverGroup.position.z = - MOVE_STEP;

		//calculate vert psons base on noise
		var i;
		var ipos;
		var offset = stepCount *MOVE_STEP/FLOOR_DEPTH * FLOOR_RES;

		for( i = 0; i < FLOOR_RES + 1; i++) {
			for( var j = 0; j < FLOOR_RES + 1; j++) {
				 ipos = i + offset;
				floorGeometry.vertices[i * (FLOOR_RES + 1)+ j].z = snoise.noise(ipos/FLOOR_RES * noiseScale, j/FLOOR_RES * noiseScale, noiseSeed ) * FLOOR_THICKNESS;
			}
		}
		floorGeometry.verticesNeedUpdate = true;

		for(  i = 0; i < TREE_COUNT; i++) {

			var tree = trees[i];
			tree.position.z +=MOVE_STEP;

			if (tree.position.z + moverGroup.position.z > FLOOR_DEPTH/2){

				tree.collided = false;
				tree.position.z	-= FLOOR_DEPTH;
				ipos = tree.posi + offset/FLOOR_RES * FLOOR_DEPTH;
				//re-randomize x pos
				tree.posj = Math.random();
				tree.position.x = tree.posj * FLOOR_WIDTH - FLOOR_WIDTH/2;
				tree.visible = true;
			}			 

		}

		XRSnow.shift();

		//shift present
		if(XRConfig.showPresent){

			presentGroup.position.z += MOVE_STEP;
			if (presentGroup.position.z + moverGroup.position.z > FLOOR_DEPTH/2){
				presentGroup.collided = false;
				presentGroup.position.z	-= FLOOR_DEPTH;
				//re-randomize x pos
				presentGroup.posj = Math.random();
				var xRange = FLOOR_WIDTH/2 * 0.7;
				presentGroup.position.x = ATUtil.randomRange(-xRange,xRange);
			
			}		
		}

	}

	function animate() {


		var i;

		var delta = clock.getDelta();	

		if (playing){
		
			//max speed accelrate slowly
			maxSpeed += delta *MAX_SPEED_ACCEL;
			maxSpeed = Math.min(maxSpeed,FINAL_MAX_SPEED);

			//move speed accelerates quickly after a collision
			moveSpeed += delta *ACCEL;
			moveSpeed = Math.min(moveSpeed,maxSpeed);
		}else{
			moveSpeed *= 0.95;

		}

		if(XRConfig.showPresent){
			presentGroup.rotation.x += 0.01;
			presentGroup.rotation.y += 0.02;
		}

		//PLAYER MOVEMENT
		//right takes precedence
		if (playing){

			if (rightDown){

				slideSpeed += SIDE_ACCEL;
				slideSpeed = Math.min(slideSpeed,MAX_SIDE_SPEED);

			} else if (leftDown){

				slideSpeed -= SIDE_ACCEL;
				slideSpeed = Math.max(slideSpeed,-MAX_SIDE_SPEED);

			}else{
				slideSpeed *= 0.8;
			}

			//bounce off edges of rails
			var nextx = XRMain.getCamera().position.x + delta * slideSpeed;

			if (nextx > FLOOR_WIDTH/2 || nextx < -FLOOR_WIDTH/2){
				slideSpeed = -slideSpeed;
				XRMain.playCollide();
			}


			XRMain.getCamera().position.x += delta * slideSpeed;

			//TILT
			//moverGroup.rotation.z = 0.016 * slideSpeed * 0.003;
			moverGroup.rotation.z = slideSpeed * 0.000038;

		}

		moverGroup.position.z += delta * moveSpeed;

		if (moverGroup.position.z > 0){
			//build new strip
			setFloorHeight();
		}

		XRSnow.animate();
		
		//SIMPLE HIT DETECT

		if (XRConfig.hitDetect){

			var p;
			var dist;

			var camPos = XRMain.getCamera().position.clone();
			camPos.z -= 200;

			if(XRConfig.showPresent){
				p = presentGroup.position.clone();
				p.add(moverGroup.position);
				dist = p.distanceTo(camPos);
				if (dist < 200 && !presentGroup.collided){
					//GOT POINT
					presentGroup.collided = true;
					XRMain.onScorePoint();
				}
			}


			for(  i = 0; i < TREE_COUNT; i++) {

				p = trees[i].position.clone();
				p.y = 0; //ignore tree height
				p.add(moverGroup.position);

				//can only hit trees if they are in front of you
				if (p.z < camPos.z && p.z > camPos.z - 200){

					dist = p.distanceTo(camPos);
					if (dist < 200 && !trees[i].collided ){

						//GAME OVER
						trees[i].collided = true;
						onGameEnd();
					}		
				}
			}
		}

	}


	function startGame(isFirstGame){

		acceptInput = false;
		//if first game just start run
		if (isFirstGame){
			startRun();
			return;
		}

		//fade out
		TweenMax.fromTo(XRMain.fxParams,0.3,{brightness:0},{brightness:-1});
		TweenMax.delayedCall(0.3,resetField);
		TweenMax.fromTo(XRMain.fxParams,0.3,{brightness:-1},{brightness:0,delay:0.3});
		TweenMax.delayedCall(0.6,startRun);

	}

	function resetField(){
		
		var camPos = XRMain.getCamera().position;
		//put cam in middle
		camPos.x = 0;
		//set tilt to 0
		slideSpeed = 0;
		moverGroup.rotation.z = 0;
		//kill trees that are too close at the start
		for(  i = 0; i < TREE_COUNT; i++) {
			p = trees[i].position.clone();
			p.add(moverGroup.position);

			if (p.z < camPos.z && p.z > camPos.z - FLOOR_DEPTH/2){
				trees[i].collided = true;
				trees[i].visible = false;
			}
		}

	}

	function startRun(){
		playing = true;
		acceptInput = true;
	}

	function onAcceptInput(){
	 	acceptInput = true;
	}

	function onGameEnd(){
		moveSpeed = -1200;
		maxSpeed = START_MAX_SPEED;
		playing = false;
		acceptInput = false;
		//wait before re-enabling start game
		TweenMax.delayedCall(1,onAcceptInput);
		XRMain.onGameOver();
	
	}

	return {
		init:init,
		startGame:startGame,
		animate:animate,
		setRightDown: function (b){rightDown = b;},
		setLeftDown: function (b){leftDown = b;},
		getPlaying: function (){return playing;},
		getMoverGroup:function (){return moverGroup;},
		getSpeed: function() {return moveSpeed/FINAL_MAX_SPEED;},
		resetField:resetField,
		getAcceptInput:function (){return acceptInput;},
	};


}();

