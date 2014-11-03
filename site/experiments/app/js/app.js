(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var addMouseListeners, domGlobeLayer, lx, ly, mx, my, onMouseDown, onMouseMove, onMouseUp, removeMouseListeners, scene, update;

scene = new (require("Scene"))(document.getElementById("scene"));

domGlobeLayer = document.querySelector(".globe-layer");

lx = 0;

ly = 0;

mx = 0;

my = 0;

onMouseDown = function(e) {
  e.preventDefault();
  addMouseListeners();
  lx = e.clientX;
  return ly = e.clientY;
};

onMouseMove = function(e) {
  e.preventDefault();
  mx = e.clientX - lx;
  my = e.clientY - ly;
  lx = e.clientX;
  ly = e.clientY;
  return scene.rotate(mx, my);
};

onMouseUp = function(e) {
  e.preventDefault();
  return removeMouseListeners();
};

addMouseListeners = function() {
  document.addEventListener("mousemove", onMouseMove, false);
  return document.addEventListener("mouseup", onMouseUp, false);
};

removeMouseListeners = function() {
  document.removeEventListener("mousemove", onMouseMove, false);
  return document.removeEventListener("mouseup", onMouseUp, false);
};

domGlobeLayer.addEventListener("mousedown", onMouseDown, false);

update = function() {
  scene.update();
  return requestAnimationFrame(update);
};

update();



},{"Scene":2}],2:[function(require,module,exports){
var Globe, Scene;

Globe = require("globe/Globe");

Scene = (function() {
  function Scene(dom) {
    this.dom = dom;
    this._size = 600;
    this._create();
    this._createPostProcessing();
    this._createLight();
    this._createGlobe();
  }

  Scene.prototype._create = function() {
    this.scene = new THREE.Scene;
    this.camera = new THREE.PerspectiveCamera(25, this._size / this._size, 0.1, 1000);
    this.camera.position.z = 25;
    this.renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    this.renderer.setSize(this._size, this._size);
    return this.dom.appendChild(this.renderer.domElement);
  };

  Scene.prototype._createPostProcessing = function() {
    var pass, renderTarget;
    renderTarget = new THREE.WebGLRenderTarget(this._size * 2, this._size * 2, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    });
    this._composer = new THREE.EffectComposer(this.renderer, renderTarget);
    pass = new THREE.RenderPass(this.scene, this.camera);
    this._composer.addPass(pass);
    THREE.FXAAShader.uniforms.resolution.value.x = 1 / this._size / window.devicePixelRatio;
    THREE.FXAAShader.uniforms.resolution.value.y = 1 / this._size / window.devicePixelRatio;
    pass = new THREE.ShaderPass(THREE.FXAAShader);
    pass.renderToScreen = true;
    return this._composer.addPass(pass);
  };

  Scene.prototype._createLight = function() {
    var spotLight;
    this._light = new THREE.AmbientLight(0x404040);
    this._light.intensity = .75;
    this.scene.add(this._light);
    this._lightPoint = new THREE.PointLight(0xeeeeee);
    this._lightPoint.position.z = 1000;
    this.scene.add(this._lightPoint);
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 100, 10);
    this.scene.add(spotLight);
    spotLight = new THREE.SpotLight(0x000000);
    spotLight.position.set(-100, -100, -10);
    return this.scene.add(spotLight);
  };

  Scene.prototype._createGlobe = function() {
    this._globe = new Globe;
    return this.scene.add(this._globe);
  };

  Scene.prototype.rotate = function(mx, my) {
    return this._globe.rotate(mx, my);
  };

  Scene.prototype.update = function() {
    this._globe.update();
    return this._composer.render();
  };

  return Scene;

})();

module.exports = Scene;



},{"globe/Globe":6}],3:[function(require,module,exports){
module.exports.assets = "medium";



},{}],4:[function(require,module,exports){
var Clouds, MeshCloudsMaterial, cloudsShader, conf,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

conf = require("conf");

cloudsShader = require("shaders/cloudsShader");

MeshCloudsMaterial = require("shaders/MeshCloudsMaterial.js");

Clouds = (function(_super) {
  __extends(Clouds, _super);

  function Clouds() {
    var geom, material, texture;
    Clouds.__super__.constructor.apply(this, arguments);
    texture = new THREE.ImageUtils.loadTexture("img/textures/" + conf.assets + "/clouds.jpg");
    geom = new THREE.SphereGeometry(5.05, 32, 32);
    material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      ambient: 0x404040,
      specular: 0xffffff
    });
    material.map = texture;
    material.alphaMap = texture;
    material.bumpMap = texture;
    material.bumpScale = 0.025;
    material.shininess = 5;
    material.metal = false;
    material.transparent = true;
    this.mesh = new THREE.Mesh(geom, material);
    this.add(this.mesh);
  }

  return Clouds;

})(THREE.Object3D);

module.exports = Clouds;



},{"conf":3,"shaders/MeshCloudsMaterial.js":8,"shaders/cloudsShader":9}],5:[function(require,module,exports){
var CloudsLight, conf,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

conf = require("conf");

CloudsLight = (function(_super) {
  __extends(CloudsLight, _super);

  function CloudsLight() {
    var geom, material, material2, texture, texture2;
    CloudsLight.__super__.constructor.apply(this, arguments);
    texture = new THREE.ImageUtils.loadTexture("img/textures/" + conf.assets + "/clouds_2.jpg");
    texture2 = new THREE.ImageUtils.loadTexture("img/textures/" + conf.assets + "/clouds_3.jpg");
    geom = new THREE.SphereGeometry(5.03, 32, 32);
    material = new THREE.MeshLambertMaterial({
      color: 0x444444,
      ambient: 0xffffff
    });
    material.map = texture;
    material.alphaMap = texture;
    material.transparent = true;
    material.opacity = .15;
    material2 = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      ambient: 0x404040
    });
    material2.map = texture2;
    material2.alphaMap = texture2;
    material2.transparent = true;
    material2.opacity = .35;
    this.mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [material, material2]);
    this.add(this.mesh);
  }

  return CloudsLight;

})(THREE.Object3D);

module.exports = CloudsLight;



},{"conf":3}],6:[function(require,module,exports){
var Clouds, CloudsLight, Globe, Shadows, conf,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Clouds = require("globe/Clouds");

CloudsLight = require("globe/CloudsLight");

Shadows = require("globe/Shadows");

conf = require("conf");

Globe = (function(_super) {
  __extends(Globe, _super);

  function Globe() {
    var geom, material1, material2, texture, textureAlpha, textureBump;
    Globe.__super__.constructor.apply(this, arguments);
    this._tox = 0;
    this._toy = 0;
    this._rx = 0;
    this._ry = 0;
    texture = new THREE.ImageUtils.loadTexture("img/textures/" + conf.assets + "/world.jpg");
    textureBump = new THREE.ImageUtils.loadTexture("img/textures/" + conf.assets + "/world_bump.jpg");
    textureAlpha = new THREE.ImageUtils.loadTexture("img/textures/" + conf.assets + "/world_alpha.jpg");
    geom = new THREE.SphereGeometry(5, 32, 32);
    material1 = new THREE.MeshPhongMaterial({
      color: 0x164286,
      ambient: 0x000000,
      specular: 0x000000
    });
    material1.shininess = 30;
    material2 = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      ambient: 0xdfe9cf,
      emissive: 0x8f8f8f,
      specular: 0x404040
    });
    material2.shininess = 10;
    material2.map = texture;
    material2.lightMap = textureAlpha;
    material2.specularMap = textureBump;
    material2.bumpMap = textureBump;
    material2.bumpScale = 0.175;
    material2.metal = false;
    material2.alphaMap = textureAlpha;
    material2.transparent = true;
    this._shadows = new Shadows;
    this.add(this._shadows);
    this._cloudsLight = new CloudsLight;
    this.add(this._cloudsLight);
    this._clouds = new Clouds;
    this.add(this._clouds);
    this.mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [material1, material2]);
    this.add(this.mesh);
    this._quat = new THREE.Quaternion();
  }

  Globe.prototype.rotate = function(mx, my) {
    this._tox += mx * .005;
    this._toy += my * .005;
    if (this._toy > 0.6) {
      this._toy = 0.6;
    }
    if (this._toy < -0.35) {
      return this._toy = -0.35;
    }
  };

  Globe.prototype.update = function() {
    this._rx += (this._toy - this._rx) * .1;
    this._ry += (this._tox - this._ry) * .1;
    this.mesh.rotation.x = this._rx;
    this.mesh.rotation.y = this._ry;
    this._cloudsLight.rotation.x = this._clouds.rotation.x = this.mesh.rotation.x;
    return this._cloudsLight.rotation.y = this._clouds.rotation.y = this.mesh.rotation.y;
  };

  return Globe;

})(THREE.Object3D);

module.exports = Globe;



},{"conf":3,"globe/Clouds":4,"globe/CloudsLight":5,"globe/Shadows":7}],7:[function(require,module,exports){
var Shadows,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Shadows = (function(_super) {
  __extends(Shadows, _super);

  function Shadows() {
    var geom, material;
    Shadows.__super__.constructor.apply(this, arguments);
    geom = new THREE.SphereGeometry(5.1, 32, 32);
    material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      ambient: 0xffffff,
      specular: 0xffffff
    });
    material.shininess = 10;
    material.transparent = true;
    material.opacity = .2;
    this.mesh = new THREE.Mesh(geom, material);
    this.add(this.mesh);
  }

  return Shadows;

})(THREE.Object3D);

module.exports = Shadows;



},{}],8:[function(require,module,exports){
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  ambient: <hex>,
 *  emissive: <hex>,
 *  specular: <hex>,
 *  shininess: <float>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *
 *  bumpMap: new THREE.Texture( <Image> ),
 *  bumpScale: <float>,
 *
 *  normalMap: new THREE.Texture( <Image> ),
 *  normalScale: <Vector2>,
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *  fog: <bool>
 * }
 */

THREE.MeshCloudsMaterial = function ( parameters ) {

  THREE.Material.call( this );

  this.type = 'MeshCloudsMaterial';

  this.color = new THREE.Color( 0xffffff ); // diffuse
  this.ambient = new THREE.Color( 0xffffff );
  this.emissive = new THREE.Color( 0x000000 );
  this.specular = new THREE.Color( 0x111111 );
  this.shininess = 30;

  this.metal = false;

  this.wrapAround = false;
  this.wrapRGB = new THREE.Vector3( 1, 1, 1 );

  this.map = null;

  this.lightMap = null;

  this.bumpMap = null;
  this.bumpScale = 1;

  this.normalMap = null;
  this.normalScale = new THREE.Vector2( 1, 1 );

  this.specularMap = null;

  this.alphaMap = null;

  this.envMap = null;
  this.combine = THREE.MultiplyOperation;
  this.reflectivity = 1;
  this.refractionRatio = 0.98;

  this.fog = true;

  this.shading = THREE.SmoothShading;

  this.wireframe = false;
  this.wireframeLinewidth = 1;
  this.wireframeLinecap = 'round';
  this.wireframeLinejoin = 'round';

  this.vertexColors = THREE.NoColors;

  this.skinning = false;
  this.morphTargets = false;
  this.morphNormals = false;

  this.setValues( parameters );

};

THREE.MeshCloudsMaterial.prototype = Object.create( THREE.Material.prototype );

THREE.MeshCloudsMaterial.prototype.clone = function () {

  var material = new THREE.MeshCloudsMaterial();

  THREE.Material.prototype.clone.call( this, material );

  material.color.copy( this.color );
  material.ambient.copy( this.ambient );
  material.emissive.copy( this.emissive );
  material.specular.copy( this.specular );
  material.shininess = this.shininess;

  material.metal = this.metal;

  material.wrapAround = this.wrapAround;
  material.wrapRGB.copy( this.wrapRGB );

  material.map = this.map;

  material.lightMap = this.lightMap;

  material.bumpMap = this.bumpMap;
  material.bumpScale = this.bumpScale;

  material.normalMap = this.normalMap;
  material.normalScale.copy( this.normalScale );

  material.specularMap = this.specularMap;

  material.alphaMap = this.alphaMap;

  material.envMap = this.envMap;
  material.combine = this.combine;
  material.reflectivity = this.reflectivity;
  material.refractionRatio = this.refractionRatio;

  material.fog = this.fog;

  material.shading = this.shading;

  material.wireframe = this.wireframe;
  material.wireframeLinewidth = this.wireframeLinewidth;
  material.wireframeLinecap = this.wireframeLinecap;
  material.wireframeLinejoin = this.wireframeLinejoin;

  material.vertexColors = this.vertexColors;

  material.skinning = this.skinning;
  material.morphTargets = this.morphTargets;
  material.morphNormals = this.morphNormals;

  return material;

};

},{}],9:[function(require,module,exports){
module.exports.uniforms = THREE.UniformsUtils.merge([
  THREE.UniformsLib["common"], THREE.UniformsLib["bump"], THREE.UniformsLib["normalmap"], THREE.UniformsLib["fog"], THREE.UniformsLib["lights"], THREE.UniformsLib["shadowmap"], {
    "ambient": {
      type: "c",
      value: new THREE.Color(0xffffff)
    },
    "emissive": {
      type: "c",
      value: new THREE.Color(0x000000)
    },
    "specular": {
      type: "c",
      value: new THREE.Color(0x111111)
    },
    "shininess": {
      type: "f",
      value: 30
    },
    "wrapRGB": {
      type: "v3",
      value: new THREE.Vector3(1, 1, 1)
    }
  }
]);

module.exports.vertexShader = ["#define PHONG", "varying vec3 vViewPosition;", "varying vec3 vNormal;", THREE.ShaderChunk["map_pars_vertex"], THREE.ShaderChunk["lightmap_pars_vertex"], THREE.ShaderChunk["envmap_pars_vertex"], THREE.ShaderChunk["lights_phong_pars_vertex"], THREE.ShaderChunk["color_pars_vertex"], THREE.ShaderChunk["morphtarget_pars_vertex"], THREE.ShaderChunk["skinning_pars_vertex"], THREE.ShaderChunk["shadowmap_pars_vertex"], THREE.ShaderChunk["logdepthbuf_pars_vertex"], "void main() {", THREE.ShaderChunk["map_vertex"], THREE.ShaderChunk["lightmap_vertex"], THREE.ShaderChunk["color_vertex"], THREE.ShaderChunk["morphnormal_vertex"], THREE.ShaderChunk["skinbase_vertex"], THREE.ShaderChunk["skinnormal_vertex"], THREE.ShaderChunk["defaultnormal_vertex"], "   vNormal = normalize( transformedNormal );", THREE.ShaderChunk["morphtarget_vertex"], THREE.ShaderChunk["skinning_vertex"], THREE.ShaderChunk["default_vertex"], THREE.ShaderChunk["logdepthbuf_vertex"], "   vViewPosition = -mvPosition.xyz;", THREE.ShaderChunk["worldpos_vertex"], THREE.ShaderChunk["envmap_vertex"], THREE.ShaderChunk["lights_phong_vertex"], THREE.ShaderChunk["shadowmap_vertex"], "}"].join("\n");

module.exports.fragmentShader = ["#define PHONG", "uniform vec3 diffuse;", "uniform float opacity;", "uniform vec3 ambient;", "uniform vec3 emissive;", "uniform vec3 specular;", "uniform float shininess;", THREE.ShaderChunk["color_pars_fragment"], THREE.ShaderChunk["map_pars_fragment"], THREE.ShaderChunk["alphamap_pars_fragment"], THREE.ShaderChunk["lightmap_pars_fragment"], THREE.ShaderChunk["envmap_pars_fragment"], THREE.ShaderChunk["fog_pars_fragment"], THREE.ShaderChunk["lights_phong_pars_fragment"], THREE.ShaderChunk["shadowmap_pars_fragment"], THREE.ShaderChunk["bumpmap_pars_fragment"], THREE.ShaderChunk["normalmap_pars_fragment"], THREE.ShaderChunk["specularmap_pars_fragment"], THREE.ShaderChunk["logdepthbuf_pars_fragment"], "void main() {", "   gl_FragColor = vec4( vec3( 1.0 ), opacity );", THREE.ShaderChunk["logdepthbuf_fragment"], THREE.ShaderChunk["map_fragment"], THREE.ShaderChunk["alphamap_fragment"], THREE.ShaderChunk["alphatest_fragment"], THREE.ShaderChunk["specularmap_fragment"], THREE.ShaderChunk["lights_phong_fragment"], THREE.ShaderChunk["lightmap_fragment"], THREE.ShaderChunk["color_fragment"], THREE.ShaderChunk["envmap_fragment"], THREE.ShaderChunk["shadowmap_fragment"], THREE.ShaderChunk["linear_to_gamma_fragment"], THREE.ShaderChunk["fog_fragment"], "}"].join("\n");



},{}]},{},[1])