# 
# Stage3d for three.js with every basics you need
# @author David Ronai / Makiopolis.com / @Makio64 
# 
class Stage3d

	@camera = null
	@cameraTarget = null
	@scene = null
	@renderer = null

	@init = (options)->
		w = window.innerWidth
		h = window.innerHeight

		@camera = new THREE.PerspectiveCamera( 45, w / h, 1, 10000 )
		@camera.position.set(0,20,100)

		@scene = new THREE.Scene()
		@sceneNoLight = new THREE.Scene()

		transparent = options.transparent||false
		antialias = options.antialias||false
		@bgColor = 0x000000
		@sunColor = 0xFF00FF
		@godRayIntensity = .15
		
		@renderer = new THREE.WebGLRenderer({alpha:true,antialias:antialias})
		@renderer.setSize( w, h )
		@renderer.autoClear = false;
		@renderer.sortObjects = false;
		@renderer.setClearColor( @bgColor, 0 );
		@renderer.domElement.id = 'webgl'

		document.body.appendChild(@renderer.domElement)
		return

	@add = (obj,light=true)->
		if light
			@scene.add(obj)
		else
			@sceneNoLight.add(obj)
		return

	@remove = (obj)->
		@scene.remove(obj)
		return

	@render = ()->
		@camera.lookAt(new THREE.Vector3(0,@camera.position.y-20,0))
		if @postprocessing
			@renderer.setClearColor( @bgColor, 1 );
			@postprocessing.godraysFakeSunUniforms.bgColor.value.setHex( @bgColor );
			@postprocessing.godraysFakeSunUniforms.sunColor.value.setHex( @sunColor );
			@postprocessing.godrayCombineUniforms.fGodRayIntensity.value = @godRayIntensity;

			@screenSpacePosition.copy( @sunPosition ).project( @camera );
			@screenSpacePosition.x = ( @screenSpacePosition.x + 1 ) / 2;
			@screenSpacePosition.y = ( @screenSpacePosition.y + 1 ) / 2;

			@postprocessing.godrayGenUniforms[ "vSunPositionScreenSpace" ].value.x = @screenSpacePosition.x;
			@postprocessing.godrayGenUniforms[ "vSunPositionScreenSpace" ].value.y = @screenSpacePosition.y;
			@postprocessing.godraysFakeSunUniforms[ "vSunPositionScreenSpace" ].value.x = @screenSpacePosition.x;
			@postprocessing.godraysFakeSunUniforms[ "vSunPositionScreenSpace" ].value.y = @screenSpacePosition.y;

			@renderer.clearTarget( @postprocessing.rtTextureColors, true, true, false );

			sunsqH = 0.84 * window.innerHeight;
			sunsqW = 0.84 * window.innerHeight;

			@screenSpacePosition.x *= window.innerWidth;
			@screenSpacePosition.y *= window.innerHeight;

			@renderer.setScissor( @screenSpacePosition.x - sunsqW / 2, @screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH );
			# @renderer.enableScissorTest( true );

			@postprocessing.godraysFakeSunUniforms[ "fAspect" ].value = window.innerWidth / window.innerHeight;

			@postprocessing.scene.overrideMaterial = @postprocessing.materialGodraysFakeSun;
			@renderer.render( @postprocessing.scene, @postprocessing.camera, @postprocessing.rtTextureColors );

			@renderer.enableScissorTest( false );

			@scene.overrideMaterial = null;
			@renderer.render( @scene, @camera, @postprocessing.rtTextureColors );

			@scene.overrideMaterial = @materialDepth;
			@renderer.render( @scene, @camera, @postprocessing.rtTextureDepth, true );

			filterLen = 1.0;

			TAPS_PER_PASS = 6.0;

			pass = 1.0;
			stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

			@postprocessing.godrayGenUniforms[ "fStepSize" ].value = stepLen;
			@postprocessing.godrayGenUniforms[ "tInput" ].value = @postprocessing.rtTextureDepth;

			@postprocessing.scene.overrideMaterial = @postprocessing.materialGodraysGenerate;

			@renderer.render( @postprocessing.scene, @postprocessing.camera, @postprocessing.rtTextureGodRays2 );

			pass = 2.0;
			stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

			@postprocessing.godrayGenUniforms[ "fStepSize" ].value = stepLen;
			@postprocessing.godrayGenUniforms[ "tInput" ].value = @postprocessing.rtTextureGodRays2;

			@renderer.render( @postprocessing.scene, @postprocessing.camera, @postprocessing.rtTextureGodRays1  );

			pass = 3.0;
			stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

			@postprocessing.godrayGenUniforms[ "fStepSize" ].value = stepLen;
			@postprocessing.godrayGenUniforms[ "tInput" ].value = @postprocessing.rtTextureGodRays1;

			@renderer.render( @postprocessing.scene, @postprocessing.camera , @postprocessing.rtTextureGodRays2  );

			@postprocessing.godrayCombineUniforms["tColors"].value = @postprocessing.rtTextureColors;
			@postprocessing.godrayCombineUniforms["tGodRays"].value = @postprocessing.rtTextureGodRays2;

			@postprocessing.scene.overrideMaterial = @postprocessing.materialGodraysCombine;

			@renderer.render( @postprocessing.scene, @postprocessing.camera );
			@postprocessing.scene.overrideMaterial = null;
		else
			@renderer.clear();
			Stage3d.renderer.render(@scene, @camera)
			Stage3d.renderer.render(@sceneNoLight, @camera)

		return

	@initPostprocessing:(gui)=>

		@materialDepth = new THREE.MeshDepthMaterial();
		@sunPosition = new THREE.Vector3( 0, -10, -100 );
		@screenSpacePosition = new THREE.Vector3();

		@postprocessing = {enabled:false}
		@postprocessing.scene = new THREE.Scene();
		@postprocessing.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2,  window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
		@postprocessing.camera.position.z = 100;
		@postprocessing.scene.add( @postprocessing.camera );

		pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
		@postprocessing.rtTextureColors = new THREE.WebGLRenderTarget( window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, pars );

		@postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, pars );

		w = window.innerWidth / 2.0;
		h = window.innerHeight / 2.0;
		@postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget( w, h, pars );
		@postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget( w, h, pars );

		godraysGenShader = THREE.ShaderGodRays[ "godrays_generate" ];
		@postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone( godraysGenShader.uniforms );
		@postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial( {
			uniforms: @postprocessing.godrayGenUniforms,
			vertexShader: godraysGenShader.vertexShader,
			fragmentShader: godraysGenShader.fragmentShader
		} );

		godraysCombineShader = THREE.ShaderGodRays[ "godrays_combine" ];
		@postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone( godraysCombineShader.uniforms );
		@postprocessing.materialGodraysCombine = new THREE.ShaderMaterial( {

			uniforms: @postprocessing.godrayCombineUniforms,
			vertexShader: godraysCombineShader.vertexShader,
			fragmentShader: godraysCombineShader.fragmentShader

		} );

		godraysFakeSunShader = THREE.ShaderGodRays[ "godrays_fake_sun" ];
		@postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone( godraysFakeSunShader.uniforms );
		@postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial( {

			uniforms: @postprocessing.godraysFakeSunUniforms,
			vertexShader: godraysFakeSunShader.vertexShader,
			fragmentShader: godraysFakeSunShader.fragmentShader

		} );

		@postprocessing.quad = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight ),
			@postprocessing.materialGodraysGenerate
		);
		@postprocessing.quad.position.z = -9900;
		@postprocessing.scene.add( @postprocessing.quad );

		godray = gui.addFolder('godrays')
		godray.addColor(@,'bgColor')
		godray.addColor(@,'sunColor')
		godray.add(@,'godRayIntensity',0,2)
		return

	@resize = ()->
		if @renderer
			@camera.aspect = window.innerWidth / window.innerHeight
			@camera.updateProjectionMatrix()
			@renderer.setSize( window.innerWidth, window.innerHeight )
		return