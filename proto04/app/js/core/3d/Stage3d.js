var Stage3d;

Stage3d = (function() {
  function Stage3d() {}

  Stage3d.camera = null;

  Stage3d.cameraTarget = null;

  Stage3d.scene = null;

  Stage3d.renderer = null;

  Stage3d.init = function(options) {
    var antialias, h, transparent, w;
    w = window.innerWidth;
    h = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000);
    this.camera.position.set(0, 20, 100);
    this.scene = new THREE.Scene();
    this.sceneNoLight = new THREE.Scene();
    transparent = options.transparent || false;
    antialias = options.antialias || false;
    this.bgColor = 0x000000;
    this.sunColor = 0xFF00FF;
    this.godRayIntensity = .15;
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: antialias
    });
    this.renderer.setSize(w, h);
    this.renderer.autoClear = false;
    this.renderer.sortObjects = false;
    this.renderer.setClearColor(this.bgColor, 0);
    this.renderer.domElement.id = 'webgl';
    document.body.appendChild(this.renderer.domElement);
  };

  Stage3d.add = function(obj, light) {
    if (light == null) {
      light = true;
    }
    if (light) {
      this.scene.add(obj);
    } else {
      this.sceneNoLight.add(obj);
    }
  };

  Stage3d.remove = function(obj) {
    this.scene.remove(obj);
  };

  Stage3d.render = function() {
    var TAPS_PER_PASS, filterLen, pass, stepLen, sunsqH, sunsqW;
    this.camera.lookAt(new THREE.Vector3(0, this.camera.position.y - 20, 0));
    if (this.postprocessing) {
      this.renderer.setClearColor(this.bgColor, 1);
      this.postprocessing.godraysFakeSunUniforms.bgColor.value.setHex(this.bgColor);
      this.postprocessing.godraysFakeSunUniforms.sunColor.value.setHex(this.sunColor);
      this.postprocessing.godrayCombineUniforms.fGodRayIntensity.value = this.godRayIntensity;
      this.screenSpacePosition.copy(this.sunPosition).project(this.camera);
      this.screenSpacePosition.x = (this.screenSpacePosition.x + 1) / 2;
      this.screenSpacePosition.y = (this.screenSpacePosition.y + 1) / 2;
      this.postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.x = this.screenSpacePosition.x;
      this.postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.y = this.screenSpacePosition.y;
      this.postprocessing.godraysFakeSunUniforms["vSunPositionScreenSpace"].value.x = this.screenSpacePosition.x;
      this.postprocessing.godraysFakeSunUniforms["vSunPositionScreenSpace"].value.y = this.screenSpacePosition.y;
      this.renderer.clearTarget(this.postprocessing.rtTextureColors, true, true, false);
      sunsqH = 0.84 * window.innerHeight;
      sunsqW = 0.84 * window.innerHeight;
      this.screenSpacePosition.x *= window.innerWidth;
      this.screenSpacePosition.y *= window.innerHeight;
      this.renderer.setScissor(this.screenSpacePosition.x - sunsqW / 2, this.screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH);
      this.postprocessing.godraysFakeSunUniforms["fAspect"].value = window.innerWidth / window.innerHeight;
      this.postprocessing.scene.overrideMaterial = this.postprocessing.materialGodraysFakeSun;
      this.renderer.render(this.postprocessing.scene, this.postprocessing.camera, this.postprocessing.rtTextureColors);
      this.renderer.enableScissorTest(false);
      this.scene.overrideMaterial = null;
      this.renderer.render(this.scene, this.camera, this.postprocessing.rtTextureColors);
      this.scene.overrideMaterial = this.materialDepth;
      this.renderer.render(this.scene, this.camera, this.postprocessing.rtTextureDepth, true);
      filterLen = 1.0;
      TAPS_PER_PASS = 6.0;
      pass = 1.0;
      stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);
      this.postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
      this.postprocessing.godrayGenUniforms["tInput"].value = this.postprocessing.rtTextureDepth;
      this.postprocessing.scene.overrideMaterial = this.postprocessing.materialGodraysGenerate;
      this.renderer.render(this.postprocessing.scene, this.postprocessing.camera, this.postprocessing.rtTextureGodRays2);
      pass = 2.0;
      stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);
      this.postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
      this.postprocessing.godrayGenUniforms["tInput"].value = this.postprocessing.rtTextureGodRays2;
      this.renderer.render(this.postprocessing.scene, this.postprocessing.camera, this.postprocessing.rtTextureGodRays1);
      pass = 3.0;
      stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);
      this.postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
      this.postprocessing.godrayGenUniforms["tInput"].value = this.postprocessing.rtTextureGodRays1;
      this.renderer.render(this.postprocessing.scene, this.postprocessing.camera, this.postprocessing.rtTextureGodRays2);
      this.postprocessing.godrayCombineUniforms["tColors"].value = this.postprocessing.rtTextureColors;
      this.postprocessing.godrayCombineUniforms["tGodRays"].value = this.postprocessing.rtTextureGodRays2;
      this.postprocessing.scene.overrideMaterial = this.postprocessing.materialGodraysCombine;
      this.renderer.render(this.postprocessing.scene, this.postprocessing.camera);
      this.postprocessing.scene.overrideMaterial = null;
    } else {
      this.renderer.clear();
      Stage3d.renderer.render(this.scene, this.camera);
      Stage3d.renderer.render(this.sceneNoLight, this.camera);
    }
  };

  Stage3d.initPostprocessing = function(gui) {
    var godray, godraysCombineShader, godraysFakeSunShader, godraysGenShader, h, pars, w;
    Stage3d.materialDepth = new THREE.MeshDepthMaterial();
    Stage3d.sunPosition = new THREE.Vector3(0, -10, -100);
    Stage3d.screenSpacePosition = new THREE.Vector3();
    Stage3d.postprocessing = {
      enabled: false
    };
    Stage3d.postprocessing.scene = new THREE.Scene();
    Stage3d.postprocessing.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10000, 10000);
    Stage3d.postprocessing.camera.position.z = 100;
    Stage3d.postprocessing.scene.add(Stage3d.postprocessing.camera);
    pars = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    };
    Stage3d.postprocessing.rtTextureColors = new THREE.WebGLRenderTarget(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, pars);
    Stage3d.postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, pars);
    w = window.innerWidth / 2.0;
    h = window.innerHeight / 2.0;
    Stage3d.postprocessing.rtTextureGodRays1 = new THREE.WebGLRenderTarget(w, h, pars);
    Stage3d.postprocessing.rtTextureGodRays2 = new THREE.WebGLRenderTarget(w, h, pars);
    godraysGenShader = THREE.ShaderGodRays["godrays_generate"];
    Stage3d.postprocessing.godrayGenUniforms = THREE.UniformsUtils.clone(godraysGenShader.uniforms);
    Stage3d.postprocessing.materialGodraysGenerate = new THREE.ShaderMaterial({
      uniforms: Stage3d.postprocessing.godrayGenUniforms,
      vertexShader: godraysGenShader.vertexShader,
      fragmentShader: godraysGenShader.fragmentShader
    });
    godraysCombineShader = THREE.ShaderGodRays["godrays_combine"];
    Stage3d.postprocessing.godrayCombineUniforms = THREE.UniformsUtils.clone(godraysCombineShader.uniforms);
    Stage3d.postprocessing.materialGodraysCombine = new THREE.ShaderMaterial({
      uniforms: Stage3d.postprocessing.godrayCombineUniforms,
      vertexShader: godraysCombineShader.vertexShader,
      fragmentShader: godraysCombineShader.fragmentShader
    });
    godraysFakeSunShader = THREE.ShaderGodRays["godrays_fake_sun"];
    Stage3d.postprocessing.godraysFakeSunUniforms = THREE.UniformsUtils.clone(godraysFakeSunShader.uniforms);
    Stage3d.postprocessing.materialGodraysFakeSun = new THREE.ShaderMaterial({
      uniforms: Stage3d.postprocessing.godraysFakeSunUniforms,
      vertexShader: godraysFakeSunShader.vertexShader,
      fragmentShader: godraysFakeSunShader.fragmentShader
    });
    Stage3d.postprocessing.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight), Stage3d.postprocessing.materialGodraysGenerate);
    Stage3d.postprocessing.quad.position.z = -9900;
    Stage3d.postprocessing.scene.add(Stage3d.postprocessing.quad);
    godray = gui.addFolder('godrays');
    godray.addColor(Stage3d, 'bgColor');
    godray.addColor(Stage3d, 'sunColor');
    godray.add(Stage3d, 'godRayIntensity', 0, 2);
  };

  Stage3d.resize = function() {
    if (this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  };

  return Stage3d;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvM2QvU3RhZ2UzZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsSUFBQSxPQUFBOztBQUFBO3VCQUVDOztBQUFBLEVBQUEsT0FBQyxDQUFBLE1BQUQsR0FBVSxJQUFWLENBQUE7O0FBQUEsRUFDQSxPQUFDLENBQUEsWUFBRCxHQUFnQixJQURoQixDQUFBOztBQUFBLEVBRUEsT0FBQyxDQUFBLEtBQUQsR0FBUyxJQUZULENBQUE7O0FBQUEsRUFHQSxPQUFDLENBQUEsUUFBRCxHQUFZLElBSFosQ0FBQTs7QUFBQSxFQUtBLE9BQUMsQ0FBQSxJQUFELEdBQVEsU0FBQyxPQUFELEdBQUE7QUFDUCxRQUFBLDRCQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksTUFBTSxDQUFDLFVBQVgsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxXQURYLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxLQUFLLENBQUMsaUJBQU4sQ0FBeUIsRUFBekIsRUFBNkIsQ0FBQSxHQUFJLENBQWpDLEVBQW9DLENBQXBDLEVBQXVDLEtBQXZDLENBSGQsQ0FBQTtBQUFBLElBSUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBakIsQ0FBcUIsQ0FBckIsRUFBdUIsRUFBdkIsRUFBMEIsR0FBMUIsQ0FKQSxDQUFBO0FBQUEsSUFNQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQU5iLENBQUE7QUFBQSxJQU9BLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQVBwQixDQUFBO0FBQUEsSUFTQSxXQUFBLEdBQWMsT0FBTyxDQUFDLFdBQVIsSUFBcUIsS0FUbkMsQ0FBQTtBQUFBLElBVUEsU0FBQSxHQUFZLE9BQU8sQ0FBQyxTQUFSLElBQW1CLEtBVi9CLENBQUE7QUFBQSxJQVdBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFYWCxDQUFBO0FBQUEs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QUEsSUFxREEsT0FBQyxDQUFBLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBdEIsQ0FBMkIsT0FBQyxDQUFBLGNBQWMsQ0FBQyxJQUEzQyxDQXJEQSxDQUFBO0FBQUEsSUF1REEsTUFBQSxHQUFTLEdBQUcsQ0FBQyxTQUFKLENBQWMsU0FBZCxDQXZEVCxDQUFBO0FBQUEsSUF3REEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsT0FBaEIsRUFBa0IsU0FBbEIsQ0F4REEsQ0FBQTtBQUFBLElBeURBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLE9BQWhCLEVBQWtCLFVBQWxCLENBekRBLENBQUE7QUFBQSxJQTBEQSxNQUFNLENBQUMsR0FBUCxDQUFXLE9BQVgsRUFBYSxpQkFBYixFQUErQixDQUEvQixFQUFpQyxDQUFqQyxDQTFEQSxDQUZtQjtFQUFBLENBL0hwQixDQUFBOztBQUFBLEVBOExBLE9BQUMsQ0FBQSxNQUFELEdBQVUsU0FBQSxHQUFBO0FBQ1QsSUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFKO0FBQ0MsTUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsTUFBTSxDQUFDLFVBQVAsR0FBb0IsTUFBTSxDQUFDLFdBQTVDLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFtQixNQUFNLENBQUMsVUFBMUIsRUFBc0MsTUFBTSxDQUFDLFdBQTdDLENBRkEsQ0FERDtLQURTO0VBQUEsQ0E5TFYsQ0FBQTs7aUJBQUE7O0lBRkQsQ0FBQSIsImZpbGUiOiJjb3JlLzNkL1N0YWdlM2QuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyIjIFxuIyBTdGFnZTNkIGZvciB0aHJlZS5qcyB3aXRoIGV2ZXJ5IGJhc2ljcyB5b3UgbmVlZFxuIyBAYXV0aG9yIERhdmlkIFJvbmFpIC8gTWFraW9wb2xpcy5jb20gLyBATWFraW82NCBcbiMgXG5jbGFzcyBTdGFnZTNkXG5cblx0QGNhbWVyYSA9IG51bGxcblx0QGNhbWVyYVRhcmdldCA9IG51bGxcblx0QHNjZW5lID0gbnVsbFxuXHRAcmVuZGVyZXIgPSBudWxsXG5cblx0QGluaXQgPSAob3B0aW9ucyktPlxuXHRcdHcgPSB3aW5kb3cuaW5uZXJXaWR0aFxuXHRcdGggPSB3aW5kb3cuaW5uZXJIZWlnaHRcblxuXHRcdEBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoIDQ1LCB3IC8gaCwgMSwgMTAwMDAgKVxuXHRcdEBjYW1lcmEucG9zaXRpb24uc2V0KDAsMjAsMTAwKVxuXG5cdFx0QHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKClcblx0XHRAc2NlbmVOb0xpZ2h0ID0gbmV3IFRIUkVFLlNjZW5lKClcblxuXHRcdHRyYW5zcGFyZW50ID0gb3B0aW9ucy50cmFuc3BhcmVudHx8ZmFsc2Vcblx0XHRhbnRpYWxpYXMgPSBvcHRpb25zLmFudGlhbGlhc3x8ZmFsc2Vcblx0XHRAYmdDb2xvciA9IDB4MDAwMDAwXG5cdFx0QHN1bkNvbG9yID0gMHhGRjAwRkZcblx0XHRAZ29kUmF5SW50ZW5zaXR5ID0gLjE1XG5cdFx0XG5cdFx0QHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe2FscGhhOnRydWUsYW50aWFsaWFzOmFudGlhbGlhc30pXG5cdFx0QHJlbmRlcmVyLnNldFNpemUoIHcsIGggKVxuXHRcdEByZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZTtcblx0XHRAcmVuZGVyZXIuc29ydE9iamVjdHMgPSBmYWxzZTtcblx0XHRAcmVuZGVyZXIuc2V0Q2xlYXJDb2xvciggQGJnQ29sb3IsIDAgKTtcblx0XHRAcmVuZGVyZXIuZG9tRWxlbWVudC5pZCA9ICd3ZWJnbCdcblxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoQHJlbmRlcmVyLmRvbUVsZW1lbnQpXG5cdFx0cmV0dXJuXG5cblx0QGFkZCA9IChvYmosbGlnaHQ9dHJ1ZSktPlxuXHRcdGlmIGxpZ2h0XG5cdFx0XHRAc2NlbmUuYWRkKG9iailcblx0XHRlbHNlXG5cdFx0XHRAc2NlbmVOb0xpZ2h0LmFkZChvYmopXG5cdFx0cmV0dXJuXG5cblx0QHJlbW92ZSA9IChvYmopLT5cblx0XHRAc2NlbmUucmVtb3ZlKG9iailcblx0XHRyZXR1cm5cblxuXHRAcmVuZGVyID0gKCktPlxuXHRcdEBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsQGNhbWVyYS5wb3NpdGlvbi55LTIwLDApKVxuXHRcdGlmIEBwb3N0cHJvY2Vzc2luZ1xuXHRcdFx0QHJlbmRlcmVyLnNldENsZWFyQ29sb3IoIEBiZ0NvbG9yLCAxICk7XG5cdFx0XHRAcG9zdHByb2Nlc3NpbmcuZ29kcmF5c0Zha2VTdW5Vbmlmb3Jtcy5iZ0NvbG9yLnZhbHVlLnNldEhleCggQGJnQ29sb3IgKTtcblx0XHRcdEBwb3N0cHJvY2Vzc2luZy5nb2RyYXlzRmFrZVN1blVuaWZvcm1zLnN1bkNvbG9yLnZhbHVlLnNldEhleCggQHN1bkNvbG9yICk7XG5cdFx0XHRAcG9zdHByb2Nlc3NpbmcuZ29kcmF5Q29tYmluZVVuaWZvcm1zLmZHb2RSYXlJbnRlbnNpdHkudmFsdWUgPSBAZ29kUmF5SW50ZW5zaXR5O1xuXG5cdFx0XHRAc2NyZWVuU3BhY2VQb3NpdGlvbi5jb3B5KCBAc3VuUG9zaXRpb24gKS5wcm9qZWN0KCBAY2FtZXJhICk7XG5cdFx0XHRAc2NyZWVuU3BhY2VQb3NpdGlvbi54ID0gKCBAc2NyZWVuU3BhY2VQb3NpdGlvbi54ICsgMSApIC8gMjtcblx0XHRcdEBzY3JlZW5TcGFjZVBvc2l0aW9uLnkgPSAoIEBzY3JlZW5TcGFjZVBvc2l0aW9uLnkgKyAxICkgLyAyO1xuXG5cdFx0XHRAcG9zdHByb2Nlc3NpbmcuZ29kcmF5R2VuVW5pZm9ybXNbIFwidlN1blBvc2l0aW9uU2NyZWVuU3BhY2VcIiBdLnZhbHVlLnggPSBAc2NyZWVuU3BhY2VQb3NpdGlvbi54O1xuXHRcdFx0QHBvc3Rwcm9jZXNzaW5nLmdvZHJheUdlblVuaWZvcm1zWyBcInZTdW5Qb3NpdGlvblNjcmVlblNwYWNlXCIgXS52YWx1ZS55ID0gQHNjcmVlblNwYWNlUG9zaXRpb24ueTtcblx0XHRcdEBwb3N0cHJvY2Vzc2luZy5nb2RyYXlzRmFrZVN1blVuaWZvcm1zWyBcInZTdW5Qb3NpdGlvblNjcmVlblNwYWNlXCIgXS52YWx1ZS54ID0gQHNjcmVlblNwYWNlUG9zaXRpb24ueDtcblx0XHRcdEBwb3N0cHJvY2Vzc2luZy5nb2RyYXlzRmFrZVN1blVuaWZvcm1zWyBcInZTdW5Qb3NpdGlvblNjcmVlblNwYWNlXCIgXS52YWx1ZS55ID0gQHNjcmVlblNwYWNlUG9zaXRpb24ueTtcblxuXHRcdFx0QHJlbmRlcmVyLmNsZWFyVGFyZ2V0KCBAcG9zdHByb2Nlc3NpbmcucnRUZXh0dXJlQ29sb3JzLCB0cnVlLCB0cnVlLCBmYWxzZSApO1xuXG5cdFx0XHRzdW5zcUggPSAwLjg0ICogd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdFx0c3Vuc3FXID0gMC44NCAqIHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHRcdFx0QHNjcmVlblNwYWNlUG9zaXRpb24ueCAqPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHRcdEBzY3JlZW5TcGFjZVBvc2l0aW9uLnkgKj0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdFx0XHRAcmVuZGVyZXIuc2V0U2Npc3NvciggQHNjcmVlblNwYWNlUG9zaXRpb24ueCAtIHN1bnNxVyAvIDIsIEBzY3JlZW5TcGFjZVBvc2l0aW9uLnkgLSBzdW5zcUggLyAyLCBzdW5zcVcsIHN1bnNxSCApO1xuXHRcdFx0IyBAcmVuZGVyZXIuZW5hYmxlU2Npc3NvclRlc3QoIHRydWUgKTtcblxuXHRcdFx0QHBvc3Rwcm9jZXNzaW5nLmdvZHJheXNGYWtlU3VuVW5pZm9ybXNbIFwiZkFzcGVjdFwiIF0udmFsdWUgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHRcdFx0QHBvc3Rwcm9jZXNzaW5nLnNjZW5lLm92ZXJyaWRlTWF0ZXJpYWwgPSBAcG9zdHByb2Nlc3NpbmcubWF0ZXJpYWxHb2RyYXlzRmFrZVN1bjtcblx0XHRcdEByZW5kZXJlci5yZW5kZXIoIEBwb3N0cHJvY2Vzc2luZy5zY2VuZSwgQHBvc3Rwcm9jZXNzaW5nLmNhbWVyYSwgQHBvc3Rwcm9jZXNzaW5nLnJ0VGV4dHVyZUNvbG9ycyApO1xuXG5cdFx0XHRAcmVuZGVyZXIuZW5hYmxlU2Npc3NvclRlc3QoIGZhbHNlICk7XG5cblx0XHRcdEBzY2VuZS5vdmVycmlkZU1hdGVyaWFsID0gbnVsbDtcblx0XHRcdEByZW5kZXJlci5yZW5kZXIoIEBzY2VuZSwgQGNhbWVyYSwgQHBvc3Rwcm9jZXNzaW5nLnJ0VGV4dHVyZUNvbG9ycyApO1xuXG5cdFx0XHRAc2NlbmUub3ZlcnJpZGVNYXRlcmlhbCA9IEBtYXRlcmlhbERlcHRoO1xuXHRcdFx0QHJlbmRlcmVyLnJlbmRlciggQHNjZW5lLCBAY2FtZXJhLCBAcG9zdHByb2Nlc3NpbmcucnRUZXh0dXJlRGVwdGgsIHRydWUgKTtcblxuXHRcdFx0ZmlsdGVyTGVuID0gMS4wO1xuXG5cdFx0XHRUQVBTX1BFUl9QQVNTID0gNi4wO1xuXG5cdFx0XHRwYXNzID0gMS4wO1xuXHRcdFx0c3RlcExlbiA9IGZpbHRlckxlbiAqIE1hdGgucG93KCBUQVBTX1BFUl9QQVNTLCAtcGFzcyApO1xuXG5cdFx0XHRAcG9zdHByb2Nlc3NpbmcuZ29kcmF5R2VuVW5pZm9ybXNbIFwiZlN0ZXBTaXplXCIgXS52YWx1ZSA9IHN0ZXBMZW47XG5cdFx0XHRAcG9zdHByb2Nlc3NpbmcuZ29kcmF5R2VuVW5pZm9ybXNbIFwidElucHV0XCIgXS52YWx1ZSA9IEBwb3N0cHJvY2Vzc2luZy5ydFRleHR1cmVEZXB0aDtcblxuXHRcdFx0QHBvc3Rwcm9jZXNzaW5nLnNjZW5lLm92ZXJyaWRlTWF0ZXJpYWwgPSBAcG9zdHByb2Nlc3NpbmcubWF0ZXJpYWxHb2RyYXlzR2VuZXJhdGU7XG5cblx0XHRcdEByZW5kZXJlci5yZW5kZXIoIEBwb3N0cHJvY2Vzc2luZy5zY2VuZSwgQHBvc3Rwcm9jZXNzaW5nLmNhbWVyYSwgQHBvc3Rwcm9jZXNzaW5nLnJ0VGV4dHVyZUdvZFJheXMyICk7XG5cblx0XHRcdHBhc3MgPSAyLjA7XG5cdFx0XHRzdGVwTGVuID0gZmlsdGVyTGVuICogTWF0aC5wb3coIFRBUFNfUEVSX1BBU1MsIC1wYXNzICk7XG5cblx0XHRcdEBwb3N0cHJvY2Vzc2luZy5nb2RyYXlHZW5Vbmlmb3Jtc1sgXCJmU3RlcFNpemVcIiBdLnZhbHVlID0gc3RlcExlbjtcblx0XHRcdEBwb3N0cHJvY2Vzc2luZy5nb2RyYXlHZW5Vbmlmb3Jtc1sgXCJ0SW5wdXRcIiBdLnZhbHVlID0gQHBvc3Rwcm9jZXNzaW5nLnJ0VGV4dHVyZUdvZFJheXMyO1xuXG5cdFx0XHRAcmVuZGVyZXIucmVuZGVyKCBAcG9zdHByb2Nlc3Npbmcuc2NlbmUsIEBwb3N0cHJvY2Vzc2luZy5jYW1lcmEsIEBwb3N0cHJvY2Vzc2luZy5ydFRleHR1cmVHb2RSYXlzMSAgKTtcblxuXHRcdFx0cGFzcyA9IDMuMDtcblx0XHRcdHN0ZXBMZW4gPSBmaWx0ZXJMZW4gKiBNYXRoLnBvdyggVEFQU19QRVJfUEFTUywgLXBhc3MgKTtcblxuXHRcdFx0QHBvc3Rwcm9jZXNzaW5nLmdvZHJheUdlblVuaWZvcm1zWyBcImZTdGVwU2l6ZVwiIF0udmFsdWUgPSBzdGVwTGVuO1xuXHRcdFx0QHBvc3Rwcm9jZXNzaW5nLmdvZHJheUdlblVuaWZvcm1zWyBcInRJbnB1dFwiIF0udmFsdWUgPSBAcG9zdHByb2Nlc3NpbmcucnRUZXh0dXJlR29kUmF5czE7XG5cblx0XHRcdEByZW5kZXJlci5yZW5kZXIoIEBwb3N0cHJvY2Vzc2luZy5zY2VuZSwgQHBvc3Rwcm9jZXNzaW5nLmNhbWVyYSAsIEBwb3N0cHJvY2Vzc2luZy5ydFRleHR1cmVHb2RSYXlzMiAgKTtcblxuXHRcdFx0QHBvc3Rwcm9jZXNzaW5nLmdvZHJheUNvbWJpbmVVbmlmb3Jtc1tcInRDb2xvcnNcIl0udmFsdWUgPSBAcG9zdHByb2Nlc3NpbmcucnRUZXh0dXJlQ29sb3JzO1xuXHRcdFx0QHBvc3Rwcm9jZXNzaW5nLmdvZHJheUNvbWJpbmVVbmlmb3Jtc1tcInRHb2RSYXlzXCJdLnZhbHVlID0gQHBvc3Rwcm9jZXNzaW5nLnJ0VGV4dHVyZUdvZFJheXMyO1xuXG5cdFx0XHRAcG9zdHByb2Nlc3Npbmcuc2NlbmUub3ZlcnJpZGVNYXRlcmlhbCA9IEBwb3N0cHJvY2Vzc2luZy5tYXRlcmlhbEdvZHJheXNDb21iaW5lO1xuXG5cdFx0XHRAcmVuZGVyZXIucmVuZGVyKCBAcG9zdHByb2Nlc3Npbmcuc2NlbmUsIEBwb3N0cHJvY2Vzc2luZy5jYW1lcmEgKTtcblx0XHRcdEBwb3N0cHJvY2Vzc2luZy5zY2VuZS5vdmVycmlkZU1hdGVyaWFsID0gbnVsbDtcblx0XHRlbHNlXG5cdFx0XHRAcmVuZGVyZXIuY2xlYXIoKTtcblx0XHRcdFN0YWdlM2QucmVuZGVyZXIucmVuZGVyKEBzY2VuZSwgQGNhbWVyYSlcblx0XHRcdFN0YWdlM2QucmVuZGVyZXIucmVuZGVyKEBzY2VuZU5vTGlnaHQsIEBjYW1lcmEpXG5cblx0XHRyZXR1cm5cblxuXHRAaW5pdFBvc3Rwcm9jZXNzaW5nOihndWkpPT5cblxuXHRcdEBtYXRlcmlhbERlcHRoID0gbmV3IFRIUkVFLk1lc2hEZXB0aE1hdGVyaWFsKCk7XG5cdFx0QHN1blBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoIDAsIC0xMCwgLTEwMCApO1xuXHRcdEBzY3JlZW5TcGFjZVBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuXHRcdEBwb3N0cHJvY2Vzc2luZyA9IHtlbmFibGVkOmZhbHNlfVxuXHRcdEBwb3N0cHJvY2Vzc2luZy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXHRcdEBwb3N0cHJvY2Vzc2luZy5jYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKCB3aW5kb3cuaW5uZXJXaWR0aCAvIC0gMiwgd2luZG93LmlubmVyV2lkdGggLyAyLCAgd2luZG93LmlubmVySGVpZ2h0IC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gLSAyLCAtMTAwMDAsIDEwMDAwICk7XG5cdFx0QHBvc3Rwcm9jZXNzaW5nLmNhbWVyYS5wb3NpdGlvbi56ID0gMTAwO1xuXHRcdEBwb3N0cHJvY2Vzc2luZy5zY2VuZS5hZGQoIEBwb3N0cHJvY2Vzc2luZy5jYW1lcmEgKTtcblxuXHRcdHBhcnMgPSB7IG1pbkZpbHRlcjogVEhSRUUuTGluZWFyRmlsdGVyLCBtYWdGaWx0ZXI6IFRIUkVFLkxpbmVhckZpbHRlciwgZm9ybWF0OiBUSFJFRS5SR0JGb3JtYXQgfTtcblx0XHRAcG9zdHByb2Nlc3NpbmcucnRUZXh0dXJlQ29sb3JzID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KCB3aW5kb3cuaW5uZXJXaWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCB3aW5kb3cuaW5uZXJIZWlnaHQgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbywgcGFycyApO1xuXG5cdFx0QHBvc3Rwcm9jZXNzaW5nLnJ0VGV4dHVyZURlcHRoID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KCB3aW5kb3cuaW5uZXJXaWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCB3aW5kb3cuaW5uZXJIZWlnaHQgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbywgcGFycyApO1xuXG5cdFx0dyA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMi4wO1xuXHRcdGggPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyLjA7XG5cdFx0QHBvc3Rwcm9jZXNzaW5nLnJ0VGV4dHVyZUdvZFJheXMxID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KCB3LCBoLCBwYXJzICk7XG5cdFx0QHBvc3Rwcm9jZXNzaW5nLnJ0VGV4dHVyZUdvZFJheXMyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KCB3LCBoLCBwYXJzICk7XG5cblx0XHRnb2RyYXlzR2VuU2hhZGVyID0gVEhSRUUuU2hhZGVyR29kUmF5c1sgXCJnb2RyYXlzX2dlbmVyYXRlXCIgXTtcblx0XHRAcG9zdHByb2Nlc3NpbmcuZ29kcmF5R2VuVW5pZm9ybXMgPSBUSFJFRS5Vbmlmb3Jtc1V0aWxzLmNsb25lKCBnb2RyYXlzR2VuU2hhZGVyLnVuaWZvcm1zICk7XG5cdFx0QHBvc3Rwcm9jZXNzaW5nLm1hdGVyaWFsR29kcmF5c0dlbmVyYXRlID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKCB7XG5cdFx0XHR1bmlmb3JtczogQHBvc3Rwcm9jZXNzaW5nLmdvZHJheUdlblVuaWZvcm1zLFxuXHRcdFx0dmVydGV4U2hhZGVyOiBnb2RyYXlzR2VuU2hhZGVyLnZlcnRleFNoYWRlcixcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBnb2RyYXlzR2VuU2hhZGVyLmZyYWdtZW50U2hhZGVyXG5cdFx0fSApO1xuXG5cdFx0Z29kcmF5c0NvbWJpbmVTaGFkZXIgPSBUSFJFRS5TaGFkZXJHb2RSYXlzWyBcImdvZHJheXNfY29tYmluZVwiIF07XG5cdFx0QHBvc3Rwcm9jZXNzaW5nLmdvZHJheUNvbWJpbmVVbmlmb3JtcyA9IFRIUkVFLlVuaWZvcm1zVXRpbHMuY2xvbmUoIGdvZHJheXNDb21iaW5lU2hhZGVyLnVuaWZvcm1zICk7XG5cdFx0QHBvc3Rwcm9jZXNzaW5nLm1hdGVyaWFsR29kcmF5c0NvbWJpbmUgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoIHtcblxuXHRcdFx0dW5pZm9ybXM6IEBwb3N0cHJvY2Vzc2luZy5nb2RyYXlDb21iaW5lVW5pZm9ybXMsXG5cdFx0XHR2ZXJ0ZXhTaGFkZXI6IGdvZHJheXNDb21iaW5lU2hhZGVyLnZlcnRleFNoYWRlcixcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBnb2RyYXlzQ29tYmluZVNoYWRlci5mcmFnbWVudFNoYWRlclxuXG5cdFx0fSApO1xuXG5cdFx0Z29kcmF5c0Zha2VTdW5TaGFkZXIgPSBUSFJFRS5TaGFkZXJHb2RSYXlzWyBcImdvZHJheXNfZmFrZV9zdW5cIiBdO1xuXHRcdEBwb3N0cHJvY2Vzc2luZy5nb2RyYXlzRmFrZVN1blVuaWZvcm1zID0gVEhSRUUuVW5pZm9ybXNVdGlscy5jbG9uZSggZ29kcmF5c0Zha2VTdW5TaGFkZXIudW5pZm9ybXMgKTtcblx0XHRAcG9zdHByb2Nlc3NpbmcubWF0ZXJpYWxHb2RyYXlzRmFrZVN1biA9IG5ldyBUSFJFRS5TaGFkZXJNYXRlcmlhbCgge1xuXG5cdFx0XHR1bmlmb3JtczogQHBvc3Rwcm9jZXNzaW5nLmdvZHJheXNGYWtlU3VuVW5pZm9ybXMsXG5cdFx0XHR2ZXJ0ZXhTaGFkZXI6IGdvZHJheXNGYWtlU3VuU2hhZGVyLnZlcnRleFNoYWRlcixcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBnb2RyYXlzRmFrZVN1blNoYWRlci5mcmFnbWVudFNoYWRlclxuXG5cdFx0fSApO1xuXG5cdFx0QHBvc3Rwcm9jZXNzaW5nLnF1YWQgPSBuZXcgVEhSRUUuTWVzaChcblx0XHRcdG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICksXG5cdFx0XHRAcG9zdHByb2Nlc3NpbmcubWF0ZXJpYWxHb2RyYXlzR2VuZXJhdGVcblx0XHQpO1xuXHRcdEBwb3N0cHJvY2Vzc2luZy5xdWFkLnBvc2l0aW9uLnogPSAtOTkwMDtcblx0XHRAcG9zdHByb2Nlc3Npbmcuc2NlbmUuYWRkKCBAcG9zdHByb2Nlc3NpbmcucXVhZCApO1xuXG5cdFx0Z29kcmF5ID0gZ3VpLmFkZEZvbGRlcignZ29kcmF5cycpXG5cdFx0Z29kcmF5LmFkZENvbG9yKEAsJ2JnQ29sb3InKVxuXHRcdGdvZHJheS5hZGRDb2xvcihALCdzdW5Db2xvcicpXG5cdFx0Z29kcmF5LmFkZChALCdnb2RSYXlJbnRlbnNpdHknLDAsMilcblx0XHRyZXR1cm5cblxuXHRAcmVzaXplID0gKCktPlxuXHRcdGlmIEByZW5kZXJlclxuXHRcdFx0QGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodFxuXHRcdFx0QGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KClcblx0XHRcdEByZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0IClcblx0XHRyZXR1cm4iXX0=