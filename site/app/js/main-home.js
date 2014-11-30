(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Home, Loading, Main3d, MobileMenu, loading;

Loading = require("home/Loading");

Home = require("home/Home");

Main3d = require("3d/Main3d");

MobileMenu = require("home/MobileMenu");

loading = new Loading;

loading.on("complete", function() {
  var home, main, mobileMenu;
  if (window.innerWidth <= 640) {
    mobileMenu = new MobileMenu();
  }
  main = new Main3d();
  home = new Home(main.scene);
  return loading.hide().then(function() {
    loading.dispose();
    return home.show();
  });
});

loading.start();



},{"3d/Main3d":3,"home/Home":13,"home/Loading":14,"home/MobileMenu":16}],2:[function(require,module,exports){
module.exports={
    "experiments": [
        {
            "author": "David Ronai",
            "bio": "Lorem ipsum",
            "title": "PACK THE FUN",
            "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "desc": "Etiam neque ex, lobortis quis magna sed, varius lacinia lectus. Quisque auctor justo justo, eu suscipit nisi congue vitae. Nulla rhoncus a lacus vel pretium. Praesent sit amet elit ullamcorper diam ornare rhoncus. Integer efficitur maximus justo sed dictum.",
            "site": "http://www.makiopolis.com",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "left/right to navigate<br />space to pause"
                }
            ]
        },
        {
            "author": "Florian Zumbrunn",
            "bio": "Lorem ipsum",
            "title": "PACK THE FUN 2",
            "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "desc": "Etiam neque ex, lobortis quis magna sed, varius lacinia lectus. Quisque auctor justo justo, eu suscipit nisi congue vitae. Nulla rhoncus a lacus vel pretium. Praesent sit amet elit ullamcorper diam ornare rhoncus. Integer efficitur maximus justo sed dictum.",
            "site": "http://www.makiopolis.com",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "left/right to navigate<br />space to pause"
                }
            ]
        },
        {
            "author": "Florian Zumbrunn",
            "bio": "Lorem ipsum",
            "title": "PACK THE FUN 2",
            "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "desc": "Etiam neque ex, lobortis quis magna sed, varius lacinia lectus. Quisque auctor justo justo, eu suscipit nisi congue vitae. Nulla rhoncus a lacus vel pretium. Praesent sit amet elit ullamcorper diam ornare rhoncus. Integer efficitur maximus justo sed dictum.",
            "site": "http://www.makiopolis.com",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "left/right to navigate<br />space to pause"
                }
            ]
        },
        {
            "author": "Florian Zumbrunn",
            "bio": "Lorem ipsum",
            "title": "PACK THE FUN 2",
            "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "desc": "Etiam neque ex, lobortis quis magna sed, varius lacinia lectus. Quisque auctor justo justo, eu suscipit nisi congue vitae. Nulla rhoncus a lacus vel pretium. Praesent sit amet elit ullamcorper diam ornare rhoncus. Integer efficitur maximus justo sed dictum.",
            "site": "http://www.makiopolis.com",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "left/right to navigate<br />space to pause"
                }
            ]
        },
        {
            "author": "Florian Zumbrunn",
            "bio": "Lorem ipsum",
            "title": "PACK THE FUN 2",
            "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "desc": "Etiam neque ex, lobortis quis magna sed, varius lacinia lectus. Quisque auctor justo justo, eu suscipit nisi congue vitae. Nulla rhoncus a lacus vel pretium. Praesent sit amet elit ullamcorper diam ornare rhoncus. Integer efficitur maximus justo sed dictum.",
            "site": "http://www.makiopolis.com",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "left/right to navigate<br />space to pause"
                }
            ]
        },
        {
            "author": "Florian Zumbrunn",
            "bio": "Lorem ipsum",
            "title": "PACK THE FUN 2",
            "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "desc": "Etiam neque ex, lobortis quis magna sed, varius lacinia lectus. Quisque auctor justo justo, eu suscipit nisi congue vitae. Nulla rhoncus a lacus vel pretium. Praesent sit amet elit ullamcorper diam ornare rhoncus. Integer efficitur maximus justo sed dictum.",
            "site": "http://www.makiopolis.com",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "left/right to navigate<br />space to pause"
                }
            ]
        },
        {
            "author": "Florian Zumbrunn",
            "bio": "Lorem ipsum",
            "title": "PACK THE FUN 2",
            "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "desc": "Etiam neque ex, lobortis quis magna sed, varius lacinia lectus. Quisque auctor justo justo, eu suscipit nisi congue vitae. Nulla rhoncus a lacus vel pretium. Praesent sit amet elit ullamcorper diam ornare rhoncus. Integer efficitur maximus justo sed dictum.",
            "site": "http://www.makiopolis.com",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "left/right to navigate<br />space to pause"
                }
            ]
        },
        {
            "author": "Florian Zumbrunn",
            "bio": "Lorem ipsum",
            "title": "PACK THE FUN 2",
            "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "desc": "Etiam neque ex, lobortis quis magna sed, varius lacinia lectus. Quisque auctor justo justo, eu suscipit nisi congue vitae. Nulla rhoncus a lacus vel pretium. Praesent sit amet elit ullamcorper diam ornare rhoncus. Integer efficitur maximus justo sed dictum.",
            "site": "http://www.makiopolis.com",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "left/right to navigate<br />space to pause"
                }
            ]
        },
        {
            "author": "Florian Zumbrunn",
            "bio": "Lorem ipsum",
            "title": "PACK THE FUN 2",
            "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "desc": "Etiam neque ex, lobortis quis magna sed, varius lacinia lectus. Quisque auctor justo justo, eu suscipit nisi congue vitae. Nulla rhoncus a lacus vel pretium. Praesent sit amet elit ullamcorper diam ornare rhoncus. Integer efficitur maximus justo sed dictum.",
            "site": "http://www.makiopolis.com",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "left/right to navigate<br />space to pause"
                }
            ]
        },
        {
            "author": "Florian Zumbrunn",
            "bio": "Lorem ipsum",
            "title": "PACK THE FUN 2",
            "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "desc": "Etiam neque ex, lobortis quis magna sed, varius lacinia lectus. Quisque auctor justo justo, eu suscipit nisi congue vitae. Nulla rhoncus a lacus vel pretium. Praesent sit amet elit ullamcorper diam ornare rhoncus. Integer efficitur maximus justo sed dictum.",
            "site": "http://www.makiopolis.com",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "left/right to navigate<br />space to pause"
                }
            ]
        },
        {
            "author": "Florian Zumbrunn",
            "bio": "Lorem ipsum",
            "title": "PACK THE FUN 2",
            "subtitle": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "desc": "Etiam neque ex, lobortis quis magna sed, varius lacinia lectus. Quisque auctor justo justo, eu suscipit nisi congue vitae. Nulla rhoncus a lacus vel pretium. Praesent sit amet elit ullamcorper diam ornare rhoncus. Integer efficitur maximus justo sed dictum.",
            "site": "http://www.makiopolis.com",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "left/right to navigate<br />space to pause"
                }
            ]
        }
    ],
    "tpl": {
        "author": "",
        "title": "",
        "subtitle": "",
        "desc": "",
        "site": "#",
        "isWebGL": false,
        "isMobile": false,
        "details": []
    }
}

},{}],3:[function(require,module,exports){
var Main3d, Scene3d, Stage3d,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Stage3d = require("3d/Stage3d");

Scene3d = require("3d/Scene3d");

Main3d = (function() {
  Main3d.prototype.dt = 0;

  Main3d.prototype.lastTime = 0;

  Main3d.prototype.pause = false;

  Main3d.prototype.scene = null;

  function Main3d() {
    this.resize = __bind(this.resize, this);
    this.update = __bind(this.update, this);
    this.pause = false;
    this.lastTime = Date.now();
    window.onblur = (function(_this) {
      return function(e) {
        _this.pause = true;
        cancelAnimationFrame(_this.update);
      };
    })(this);
    window.onfocus = (function(_this) {
      return function() {
        requestAnimationFrame(_this.update);
        _this.lastTime = Date.now();
        _this.pause = false;
      };
    })(this);
    window.onresize = (function(_this) {
      return function() {
        _this.resize();
      };
    })(this);
    Stage3d.init({
      transparent: false,
      antialias: false,
      background: 0xFFFFFF
    });
    this.scene = new Scene3d();
    requestAnimationFrame(this.update);
    return;
  }

  Main3d.prototype.update = function() {
    var dt, t;
    t = Date.now();
    dt = t - this.lastTime;
    this.lastTime = t;
    if (this.pause) {
      return;
    }
    this.scene.update(dt);
    Stage3d.render();
    requestAnimationFrame(this.update);
  };

  Main3d.prototype.resize = function() {
    var height, width;
    width = window.innerWidth;
    height = window.innerHeight;
    this.scene.resize();
    Stage3d.resize();
  };

  return Main3d;

})();

module.exports = Main3d;



},{"3d/Scene3d":4,"3d/Stage3d":5}],4:[function(require,module,exports){
var Scene3d, Stage3d,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Stage3d = require("3d/Stage3d");

Scene3d = (function(_super) {
  __extends(Scene3d, _super);

  function Scene3d() {
    this.showXP = __bind(this.showXP, this);
    this.createGUI = __bind(this.createGUI, this);
    this.onFragmentLoaded = __bind(this.onFragmentLoaded, this);
    this.onMirrorLoad = __bind(this.onMirrorLoad, this);
    this.onDiamondLoad = __bind(this.onDiamondLoad, this);
    this.addEvent = __bind(this.addEvent, this);
    this.createMobilePosition = __bind(this.createMobilePosition, this);
    this.createPortraitPosition = __bind(this.createPortraitPosition, this);
    this.createGrids4 = __bind(this.createGrids4, this);
    this.createGrids3 = __bind(this.createGrids3, this);
    this.createGrids2 = __bind(this.createGrids2, this);
    this.createGrids1 = __bind(this.createGrids1, this);
    this.createLight = __bind(this.createLight, this);
    this.createBackground = __bind(this.createBackground, this);
    this.loadMesh = __bind(this.loadMesh, this);
    this.loadImagesHight = __bind(this.loadImagesHight, this);
    this.parseAtlas = __bind(this.parseAtlas, this);
    this.loadImagesLow = __bind(this.loadImagesLow, this);
    var i, _i;
    Scene3d.__super__.constructor.apply(this, arguments);
    this.isOver = false;
    this.isReady = false;
    this.isImgReady = false;
    this.debug = true;
    this.currentIndex = 1;
    this.globalAlpha = 0;
    this.mouse = new THREE.Vector2(0, 0);
    this.time = 0;
    this.useMap = true;
    this.shading = THREE.FlatShading;
    this.opacity = 1;
    this.fragments = [];
    this.hitboxs = [];
    this.maxDate = 2;
    this.positions = {};
    this.positions.base = {
      fragments: [],
      diamond: new THREE.Vector3(),
      mirror: new THREE.Vector3()
    };
    this.offsetX = 0;
    this.currentPosition = {
      fragments: [],
      diamond: null,
      mirror: null
    };
    this.images = [];
    for (i = _i = 0; _i < 24; i = _i += 1) {
      this.currentPosition.fragments[i] = new THREE.Vector3();
    }
    this.currentPosition.diamond = new THREE.Vector3();
    this.currentPosition.mirror = new THREE.Vector3();
    this.container = new THREE.Object3D();
    Stage3d.add(this.container, false);
    this.lightContainer = new THREE.Object3D();
    this.container.add(this.lightContainer);
    this.createLight();
    this.createBackground();
    this.createCircles();
    this.addEvent();
    this.loadImagesLow();
    return;
  }

  Scene3d.prototype.createCanvas = function() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 64;
    this.canvas.height = 64;
    this.ctx = this.canvas.getContext('2d');
    this.map = new THREE.Texture(this.canvas, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBFormat, THREE.UnsignedByteType, 1);
    this.envMap = new THREE.Texture([this.canvas, this.canvas, this.canvas, this.canvas, this.canvas, this.canvas], THREE.CubeRefractionMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBFormat, THREE.UnsignedByteType, 1);
  };

  Scene3d.prototype.loadImagesLow = function() {
    this.atlas = new Image();
    this.atlas.onload = (function(_this) {
      return function() {
        _this.parseAtlas();
        _this.createCanvas();
        _this.loadMesh();
        _this.createGUI();
        return _this.loadImagesHight();
      };
    })(this);
    this.atlas.src = './3d/textures/atlas_low_512.jpg';
  };

  Scene3d.prototype.parseAtlas = function() {
    var canvas, ctx, k, size, x, y, _i, _j;
    size = this.atlas.width / 8;
    for (y = _i = 0; _i < 8; y = _i += 1) {
      for (x = _j = 0; _j < 8; x = _j += 1) {
        k = x + y * 8;
        if (k >= 24) {
          this.isImgReady = true;
          if (this.canvas) {
            this.canvas.width = size;
            this.canvas.height = size;
          }
          return;
        }
        canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        ctx = canvas.getContext('2d');
        ctx.drawImage(this.atlas, x * size, y * size, size, size, 0, 0, size, size);
        this.images[k] = canvas;
      }
    }
  };

  Scene3d.prototype.loadImagesHight = function() {
    this.atlas = new Image();
    this.atlas.onload = (function(_this) {
      return function() {
        return _this.parseAtlas();
      };
    })(this);
    this.atlas.src = './3d/textures/atlas_low_2048.jpg';
  };

  Scene3d.prototype.loadMesh = function() {
    var loader;
    loader = new THREE.JSONLoader();
    loader.load('./3d/json/crystal.js', this.onDiamondLoad);
    loader = new THREE.JSONLoader();
    loader.load('./3d/json/mirror.js', this.onMirrorLoad);
    loader = new THREE.SceneLoader();
    loader.load('./3d/json/fragments.js', this.onFragmentLoaded);
  };

  Scene3d.prototype.createBackground = function() {
    var geometry, i, material, mesh, v, _i, _ref;
    material = new THREE.MeshLambertMaterial({
      wireframe: false,
      color: 0xFFFFFF
    });
    material.shading = THREE.FlatShading;
    geometry = new THREE.PlaneGeometry(7000, 7000, 8, 8);
    for (i = _i = 0, _ref = geometry.vertices.length; _i < _ref; i = _i += 1) {
      v = geometry.vertices[i];
      v.x += (1 * Math.random() - .5) * 300;
      v.y += (1 * Math.random() - .5) * 300;
      v.z += (1 * Math.random() - .5) * 300;
    }
    geometry.computeTangents();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.computeVertexNormals();
    geometry.computeTangents();
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.tangentsNeedUpdate = true;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -1000;
    Stage3d.add(mesh);
    material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0,
      transparent: true,
      opacity: .1
    });
    material.shading = THREE.FlatShading;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -950;
    mesh.position.y += 10;
    Stage3d.add(mesh);
    this.backgroundGeometry = geometry;
  };

  Scene3d.prototype.createCircles = function() {
    var image;
    image = new Image();
    image.onload = (function(_this) {
      return function() {
        var map, material;
        map = THREE.ImageUtils.loadTexture('./3d/textures/circle.png');
        _this.bufferGeometry = new THREE.BufferGeometry();
        _this.bufferGeometry.fromGeometry(_this.backgroundGeometry);
        material = new THREE.PointCloudMaterial({
          depthTest: false,
          transparent: true,
          map: map,
          color: 0xFFFFFF,
          size: 64,
          sizeAttenuation: true,
          fog: false
        });
        console.log(material);
        _this.pointcloud = new THREE.PointCloud(_this.bufferGeometry, material);
        _this.pointcloud.position.z -= 945.999;
        _this.pointcloud.position.y += 10;
        return _this.container.add(_this.pointcloud);
      };
    })(this);
    image.src = './3d/textures/circle.png';
  };

  Scene3d.prototype.createParticles = function() {};

  Scene3d.prototype.createLight = function() {
    this.ambientLight = new THREE.AmbientLight(0);
    this.ambientLight2 = new THREE.AmbientLight(0xFFFFFF);
    this.cameraLight = new THREE.PointLight(0x221199, 2, 2000);
    this.cameraLight.position.set(0, -1000, 0);
    this.cameraLight2 = new THREE.PointLight(0x2211AA, 1, 2400);
    this.cameraLight2.position.set(-1500, 0, 0);
    this.cameraLight3 = new THREE.PointLight(0x2233AA, 2, 2400);
    this.cameraLight3.position.set(1000, 0, 0);
    this.cameraLight4 = new THREE.PointLight(0x222277, 2, 2400);
    this.cameraLight4.position.set(0, 1000, 0);
    Stage3d.add(this.ambientLight);
    Stage3d.add(this.cameraLight);
    Stage3d.add(this.cameraLight2);
    Stage3d.add(this.cameraLight3);
    Stage3d.add(this.cameraLight4);
    Stage3d.add(this.ambientLight2, false);
  };

  Scene3d.prototype.createGrids1 = function() {
    var i, p, v, _i;
    p = this.positions.grid1 = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = new THREE.Vector3();
      v.x = -8 * ((i + 1) % 5);
      v.y = Math.floor((i + 1) / 5) * 8 - 16.5;
      v.z = 0;
      p.fragments.push(v);
    }
    p.diamond.x += 20;
    p.mirror.x += 20;
  };

  Scene3d.prototype.createGrids2 = function() {
    var i, p, v, _i;
    p = this.positions.grid2 = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = new THREE.Vector3();
      v.x = (-8 * (i % 8)) + 28;
      v.y = Math.floor(i / 8) * 8 - 10;
      v.z = 0;
      p.fragments.push(v);
    }
    p.diamond.y += 15;
    p.mirror.y += 15;
  };

  Scene3d.prototype.createGrids3 = function() {
    var i, p, v, _i;
    p = this.positions.grid3 = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = new THREE.Vector3();
      v.x = (-9 * ((i + 1) % 5)) + 15;
      v.y = Math.floor((i + 1) / 5) * 9 - 16.5;
      v.z = 0;
      p.fragments.push(v);
    }
  };

  Scene3d.prototype.createGrids4 = function() {
    var angle, angleStep, i, p, radius, v, _i;
    p = this.positions.grid4 = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    angle = Math.PI / 2;
    angleStep = Math.PI * 2 / 24;
    radius = 22;
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = new THREE.Vector3();
      v.x = Math.cos(angle) * (radius + Math.sin(angle * 8) * 5);
      v.y = Math.sin(angle) * (radius + Math.sin(angle * 8) * 5);
      v.z = 0;
      angle += angleStep;
      p.fragments.push(v);
    }
  };

  Scene3d.prototype.createPortraitPosition = function() {
    var i, p, v, _i;
    p = this.positions.portrait = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = this.fragments[i].position.clone();
      v.x *= .75;
      v.y *= 1.3;
      p.fragments.push(v);
    }
  };

  Scene3d.prototype.createMobilePosition = function() {
    var i, p, v, _i;
    p = this.positions.mobile = {
      fragments: [],
      diamond: this.diamond.position.clone(),
      mirror: this.mirror.position.clone()
    };
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = new THREE.Vector3();
      v.x = (30 * ((i + 1) % 2)) - 15;
      v.y = (12 - Math.floor(i / 2)) * -20 + 10;
      v.z = 0;
      p.fragments.push(v);
    }
    p.diamond.y += 20;
    p.mirror.y += 20;
  };

  Scene3d.prototype.addEvent = function() {
    window.addEventListener('mousemove', (function(_this) {
      return function(e) {
        _this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        return _this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
    })(this), false);
  };

  Scene3d.prototype.onDiamondLoad = function(geometry) {
    var folder, material, matrix;
    this.computeGeometry(geometry);
    material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      light: false,
      envMap: this.envMap,
      depthWrite: true,
      depthTest: true
    });
    material.map = this.map;
    material.shading = this.shading;
    material.opacity = .65;
    material.side = THREE.DoubleSide;
    material.combine = THREE.MixOperation;
    matrix = new THREE.Matrix4();
    matrix.makeScale(.2, .2, .2);
    geometry.applyMatrix(matrix);
    this.diamond = new THREE.Mesh(geometry, material);
    this.container.add(this.diamond);
    folder = this.gui.addFolder('diamond');
    folder.add(material, 'depthWrite');
    folder.add(material, 'depthTest');
    folder.add(material, 'opacity', 0, 1);
    folder.add(material, 'reflectivity', 0, 1);
    this.diamondColor = 0xffffff;
    folder.add(this.diamond.material, 'combine', {
      multiply: THREE.Multiply,
      mix: THREE.MixOperation,
      add: THREE.AddOperation
    });
    folder.addColor(this, 'diamondColor').onChange((function(_this) {
      return function() {
        return _this.diamond.material.color.setHex(_this.diamondColor);
      };
    })(this));
    this.positions.base.diamond = this.diamond.position.clone();
  };

  Scene3d.prototype.onMirrorLoad = function(geometry) {
    var folder, material, matrix;
    this.computeGeometry(geometry);
    matrix = new THREE.Matrix4();
    matrix.makeScale(.2, .2, .2);
    geometry.applyMatrix(matrix);
    material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      light: false,
      transparent: true,
      envMap: this.envMap,
      depthWrite: true,
      depthTest: true
    });
    material.map = this.map;
    material.shading = this.shading;
    material.side = THREE.DoubleSide;
    material.combine = THREE.AddOperation;
    material.reflectivity = .41;
    material.opacity = 0.77;
    this.mirror = new THREE.Mesh(geometry, material);
    this.container.add(this.mirror);
    folder = this.gui.addFolder('mirror');
    folder.add(this.mirror.material, 'depthWrite');
    folder.add(this.mirror.material, 'depthTest');
    folder.add(this.mirror.material, 'opacity', 0, 1);
    folder.add(this.mirror.material, 'reflectivity', 0, 1);
    this.mirrorColor = 0xffffff;
    folder.add(this.mirror.material, 'combine', {
      multiply: THREE.Multiply,
      mix: THREE.MixOperation,
      add: THREE.AddOperation
    });
    folder.addColor(this, 'mirrorColor').onChange((function(_this) {
      return function() {
        return _this.mirror.material.color.setHex(_this.mirrorColor);
      };
    })(this));
    this.positions.base.mirror = this.mirror.position.clone();
  };

  Scene3d.prototype.onFragmentLoaded = function(scene) {
    var hitbox, hitboxGeo, hitboxMaterial, i, k, material, matrix, o, v, _i, _ref;
    this.fragments = [];
    this.hitboxs = [];
    hitboxGeo = new THREE.SphereGeometry(4);
    hitboxMaterial = new THREE.MeshBasicMaterial({
      color: 0,
      wireframe: true,
      opacity: .3,
      transparent: true
    });
    this.basePosition = [];
    _ref = scene.objects;
    for (k in _ref) {
      v = _ref[k];
      o = v;
      o.name = o.name.substring(o.name.length - 2);
      this.computeGeometry(o.geometry);
      material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        envMap: this.envMap,
        depthWrite: true,
        depthTest: true
      });
      material.shading = this.shading;
      material.side = THREE.DoubleSide;
      material.combine = THREE.AddOperation;
      material.reflectivity = .41;
      material.opacity = 0.8;
      o.material = material;
      matrix = new THREE.Matrix4();
      matrix.makeScale(.23, .23, .23);
      o.geometry.applyMatrix(matrix);
      o.position.multiplyScalar(.21);
      o.position.y -= 20;
      o.position.z += 5;
      if (parseInt(o.name) > this.maxDate) {
        o.material.opacity = 0.3;
      }
      hitbox = new THREE.Mesh(hitboxGeo, hitboxMaterial);
      hitbox.position.copy(o.position);
      hitbox.visible = this.hitboxVisible;
      hitbox.fragment = o;
      this.hitboxs.push(hitbox);
      Stage3d.add(hitbox);
      this.positions.base.fragments.push(o.position.clone());
      this.computeGeometry(o.geometry);
      this.fragments.push(o);
      Stage3d.add(o);
    }
    for (i = _i = 0; _i < 24; i = _i += 1) {
      this.currentPosition.fragments[i].copy(this.hitboxs[i].position);
    }
    this.position = this.basePosition;
    this.createGrids1();
    this.createGrids2();
    this.createGrids3();
    this.createGrids4();
    this.createMobilePosition();
    this.createPortraitPosition();
  };

  Scene3d.prototype.createGUI = function() {
    var frag, global, lights, positions;
    this.gui = new dat.GUI();
    this.textures = null;
    this.maps = [];
    this.envMaps = [];
    global = this.gui.addFolder('global');
    this.globalOpacity = 1;
    global.add(this, 'globalOpacity', 0, 1).step(0.01).onChange((function(_this) {
      return function() {
        return document.getElementById('webgl').style.opacity = _this.globalOpacity;
      };
    })(this));
    this.hitboxVisible = false;
    global.add(this, 'offsetX', -30, 30).step(0.1);
    positions = this.gui.addFolder('positions');
    positions.add(this, 'noGrid');
    positions.add(this, 'grid1');
    positions.add(this, 'grid2');
    positions.add(this, 'grid3');
    positions.add(this, 'grid4');
    positions.add(this, 'portrait');
    positions.add(this, 'mobile');
    frag = this.gui.addFolder('fragments');
    this.movementScale = 1.3;
    this.speedScale = 0.1;
    frag.add(this, 'movementScale', 0, 2);
    frag.add(this, 'speedScale', 0, 2);
    frag.add(this, 'hitboxVisible').onChange((function(_this) {
      return function(e) {
        var i, _i, _results;
        _results = [];
        for (i = _i = 0; _i < 24; i = _i += 1) {
          _results.push(_this.hitboxs[i].visible = _this.hitboxVisible);
        }
        return _results;
      };
    })(this));
    lights = this.gui.addFolder('lights');
    this.colorAmbient = this.ambientLight.color.getHex();
    lights.addColor(this, 'colorAmbient').onChange((function(_this) {
      return function() {
        return _this.ambientLight.color.setHex(_this.colorAmbient);
      };
    })(this));
    this.light1 = this.cameraLight.color.getHex();
    lights.addColor(this, 'light1').onChange((function(_this) {
      return function() {
        return _this.cameraLight.color.setHex(_this.light1);
      };
    })(this));
    console.log(this.cameraLight);
    lights.add(this.cameraLight, 'intensity', 0, 3).step(0.01).name('intensity 1');
    this.light2 = this.cameraLight2.color.getHex();
    lights.addColor(this, 'light2').onChange((function(_this) {
      return function() {
        return _this.cameraLight2.color.setHex(_this.light2);
      };
    })(this));
    lights.add(this.cameraLight2, 'intensity', 0, 3).step(0.01).name('intensity 2');
    this.light3 = this.cameraLight3.color.getHex();
    lights.addColor(this, 'light3').onChange((function(_this) {
      return function() {
        return _this.cameraLight3.color.setHex(_this.light3);
      };
    })(this));
    lights.add(this.cameraLight3, 'intensity', 0, 3).step(0.01).name('intensity 3');
    this.light4 = this.cameraLight4.color.getHex();
    lights.addColor(this, 'light4').onChange((function(_this) {
      return function() {
        return _this.cameraLight4.color.setHex(_this.light4);
      };
    })(this));
    lights.add(this.cameraLight4, 'intensity', 0, 3).step(0.01).name('intensity 4');
    lights.open();
  };

  Scene3d.prototype.tweenTo = function(positions) {
    var i, v, v2, _i;
    for (i = _i = 0; _i < 24; i = _i += 1) {
      v = this.currentPosition.fragments[i];
      v2 = positions.fragments[i];
      TweenLite.to(v, .8 + Math.random() * .3, {
        x: v2.x,
        y: v2.y,
        z: v2.z,
        ease: Back.easeOut
      });
    }
    TweenLite.to(this.currentPosition.diamond, 1.4, {
      x: positions.diamond.x,
      y: positions.diamond.y,
      z: positions.diamond.z,
      ease: Expo.easeOut
    });
    TweenLite.to(this.currentPosition.mirror, 1.4, {
      x: positions.mirror.x,
      y: positions.mirror.y,
      z: positions.mirror.z,
      ease: Expo.easeOut
    });
  };

  Scene3d.prototype.noGrid = function() {
    this.tweenTo(this.positions.base);
  };

  Scene3d.prototype.grid1 = function() {
    this.tweenTo(this.positions.grid1);
  };

  Scene3d.prototype.grid2 = function() {
    this.tweenTo(this.positions.grid2);
  };

  Scene3d.prototype.grid3 = function() {
    this.tweenTo(this.positions.grid3);
  };

  Scene3d.prototype.grid4 = function() {
    this.tweenTo(this.positions.grid4);
  };

  Scene3d.prototype.portrait = function() {
    this.tweenTo(this.positions.portrait);
  };

  Scene3d.prototype.mobile = function() {
    this.tweenTo(this.positions.mobile);
  };

  Scene3d.prototype.addZero = function(number, minLength) {
    number = number + "";
    while (number.length < minLength) {
      number = "0" + number;
    }
    return number;
  };

  Scene3d.prototype.computeGeometry = function(geometry) {
    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeTangents();
    geometry.computeMorphNormals();
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
  };

  Scene3d.prototype.showXP = function(index) {
    if (parseInt(index) > this.maxDate) {
      return;
    }
    if (!this.isOver) {
      this.isOver = true;
      this.emit("over", parseInt(index));
    }
    if (index === this.currentIndex) {
      return;
    }
    this.currentIndex = index;
    this.globalAlpha = 0.01;
  };

  Scene3d.prototype.pause = function() {};

  Scene3d.prototype.resume = function() {};

  Scene3d.prototype.update = function(dt) {
    var distance, dx, dy, dz, f, frag, geometry, i, idx, intersects, raycaster, s, speeds, t, v, vector, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
    this.time += dt;
    if (this.isImgReady) {
      this.ctx.globalAlpha = this.globalAlpha;
      this.globalAlpha += .01;
      if (this.globalAlpha < 1.1) {
        idx = parseInt(this.currentIndex) - 1;
        if (idx <= this.maxDate) {
          this.ctx.drawImage(this.images[idx], 0, 0);
          this.map.needsUpdate = true;
          this.envMap.needsUpdate = true;
        }
      }
    }
    vector = new THREE.Vector3(this.mouse.x, this.mouse.y, .5);
    vector.unproject(Stage3d.camera);
    raycaster = new THREE.Raycaster(Stage3d.camera.position, vector.sub(Stage3d.camera.position).normalize());
    t = this.time;
    if (this.diamond && this.currentPosition.diamond) {
      this.diamond.position.copy(this.currentPosition.diamond);
      this.diamond.position.x += this.offsetX;
    }
    if (this.mirror && this.currentPosition.mirror) {
      this.mirror.position.copy(this.currentPosition.mirror);
      this.mirror.position.x += this.offsetX;
    }
    if (this.mirror && this.diamond) {
      s = 1 + Math.cos(t / 1250) * .02;
      this.diamond.scale.set(s, s, s);
      this.diamond.position.y += Math.sin(t / 1500) * .5;
      this.mirror.scale.set(s, s, s);
      this.mirror.position.y += Math.sin(t / 1500) * .5;
    }
    for (i = _i = 0, _ref = this.hitboxs.length; _i < _ref; i = _i += 1) {
      distance = new THREE.Vector3();
      dx = this.currentPosition.fragments[i].x - this.diamond.position.x;
      dy = this.currentPosition.fragments[i].y - this.diamond.position.y;
      dz = this.currentPosition.fragments[i].z - this.diamond.position.z;
      distance.set(Math.sqrt(dx * dx), Math.sqrt(dy * dy), Math.sqrt(dz * dz));
      this.hitboxs[i].position.copy(this.currentPosition.fragments[i]);
      if (distance.x < 17.5) {
        this.hitboxs[i].position.z = Math.max(this.hitboxs[i].position.z, 14);
      } else if (distance.x < 29) {
        this.hitboxs[i].position.z = Math.max(this.hitboxs[i].position.z, (1 - (distance.x - 14) / 15) * 14 + 2);
      }
      this.hitboxs[i].position.x += this.offsetX;
    }
    t = this.time;
    for (i = _j = 0, _ref1 = this.fragments.length; _j < _ref1; i = _j += 1) {
      t += 747;
      this.fragments[i].position.y = this.hitboxs[i].position.y + Math.sin(t / 350 * this.speedScale) * 1.1 * this.movementScale;
      this.fragments[i].position.x = this.hitboxs[i].position.x + Math.cos(t / 450 * this.speedScale) * .5 * this.movementScale;
      this.fragments[i].position.z = this.hitboxs[i].position.z;
    }
    if (this.hitboxs) {
      intersects = raycaster.intersectObjects(this.hitboxs, false);
      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        frag = intersects[0].object.fragment;
        this.currentFragment = frag;
        this.showXP(frag.name);
      } else {
        if (this.isOver) {
          this.isOver = false;
          this.emit("out");
        }
        document.body.style.cursor = 'auto';
        this.currentFragment = null;
      }
    }
    if (this.currentFragment) {
      this.currentFragment.scale.x += (1.4 - this.currentFragment.scale.x) * .05;
      this.currentFragment.scale.y = this.currentFragment.scale.x;
      this.currentFragment.scale.z = this.currentFragment.scale.x;
    }
    for (i = _k = 0, _ref2 = this.fragments.length; _k < _ref2; i = _k += 1) {
      f = this.fragments[i];
      if (f !== this.currentFragment) {
        f.scale.x += (1 - f.scale.x) * .09;
        f.scale.y = f.scale.x;
        f.scale.z = f.scale.x;
      }
    }
    if (this.backgroundGeometry) {
      geometry = this.backgroundGeometry;
      if (this.bufferGeometry) {
        this.bufferGeometry.fromGeometry(this.backgroundGeometry);
      }
      speeds = [800, 700, 1200];
      for (i = _l = 0, _ref3 = geometry.vertices.length; _l < _ref3; i = _l += 1) {
        v = geometry.vertices[i];
        v.z += Math.cos(this.time / speeds[i % speeds.length] + Math.PI / 16 * i) * 2;
      }
      geometry.computeTangents();
      geometry.computeVertexNormals();
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      geometry.computeTangents();
      geometry.verticesNeedUpdate = true;
      geometry.normalsNeedUpdate = true;
      geometry.elementsNeedUpdate = true;
      geometry.tangentsNeedUpdate = true;
    }
    Stage3d.camera.position.x += (this.mouse.x * 30 - Stage3d.camera.position.x) * .03;
  };

  return Scene3d;

})(Emitter);

module.exports = Scene3d;



},{"3d/Stage3d":5}],5:[function(require,module,exports){
var Scene3d, Stage3d;

Scene3d = require("home/Home");

Stage3d = (function() {
  function Stage3d() {}

  Stage3d.camera = null;

  Stage3d.cameraTarget = null;

  Stage3d.scene = null;

  Stage3d.renderer = null;

  Stage3d.init = function(options) {
    var antialias, h, transparent, w;
    console.log('init');
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
      antialias: antialias,
      transparent: false
    });
    this.renderer.setSize(w, h);
    this.renderer.autoClear = false;
    this.renderer.sortObjects = false;
    this.renderer.setClearColor(this.bgColor, 0);
    this.renderer.domElement.className = 'home3d';
    document.body.appendChild(this.renderer.domElement);
  };

  Stage3d.add = function(obj, light) {
    if (light == null) {
      light = true;
    }
    if (light) {
      Stage3d.scene.add(obj);
    } else {
      Stage3d.sceneNoLight.add(obj);
    }
  };

  Stage3d.remove = function(obj) {
    Stage3d.scene.remove(obj);
  };

  Stage3d.render = function() {
    var TAPS_PER_PASS, filterLen, pass, stepLen, sunsqH, sunsqW;
    Stage3d.camera.lookAt(new THREE.Vector3(0, Stage3d.camera.position.y - 20, 0));
    if (Stage3d.postprocessing) {
      Stage3d.renderer.setClearColor(Stage3d.bgColor, 1);
      Stage3d.postprocessing.godraysFakeSunUniforms.bgColor.value.setHex(Stage3d.bgColor);
      Stage3d.postprocessing.godraysFakeSunUniforms.sunColor.value.setHex(Stage3d.sunColor);
      Stage3d.postprocessing.godrayCombineUniforms.fGodRayIntensity.value = Stage3d.godRayIntensity;
      Stage3d.screenSpacePosition.copy(Stage3d.sunPosition).project(Stage3d.camera);
      Stage3d.screenSpacePosition.x = (Stage3d.screenSpacePosition.x + 1) / 2;
      Stage3d.screenSpacePosition.y = (Stage3d.screenSpacePosition.y + 1) / 2;
      Stage3d.postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.x = Stage3d.screenSpacePosition.x;
      Stage3d.postprocessing.godrayGenUniforms["vSunPositionScreenSpace"].value.y = Stage3d.screenSpacePosition.y;
      Stage3d.postprocessing.godraysFakeSunUniforms["vSunPositionScreenSpace"].value.x = Stage3d.screenSpacePosition.x;
      Stage3d.postprocessing.godraysFakeSunUniforms["vSunPositionScreenSpace"].value.y = Stage3d.screenSpacePosition.y;
      Stage3d.renderer.clearTarget(Stage3d.postprocessing.rtTextureColors, true, true, false);
      sunsqH = 0.84 * window.innerHeight;
      sunsqW = 0.84 * window.innerHeight;
      Stage3d.screenSpacePosition.x *= window.innerWidth;
      Stage3d.screenSpacePosition.y *= window.innerHeight;
      Stage3d.renderer.setScissor(Stage3d.screenSpacePosition.x - sunsqW / 2, Stage3d.screenSpacePosition.y - sunsqH / 2, sunsqW, sunsqH);
      Stage3d.postprocessing.godraysFakeSunUniforms["fAspect"].value = window.innerWidth / window.innerHeight;
      Stage3d.postprocessing.scene.overrideMaterial = Stage3d.postprocessing.materialGodraysFakeSun;
      Stage3d.renderer.render(Stage3d.postprocessing.scene, Stage3d.postprocessing.camera, Stage3d.postprocessing.rtTextureColors);
      Stage3d.renderer.enableScissorTest(false);
      Stage3d.scene.overrideMaterial = null;
      Stage3d.renderer.render(Stage3d.scene, Stage3d.camera, Stage3d.postprocessing.rtTextureColors);
      Stage3d.scene.overrideMaterial = Stage3d.materialDepth;
      Stage3d.renderer.render(Stage3d.scene, Stage3d.camera, Stage3d.postprocessing.rtTextureDepth, true);
      filterLen = 1.0;
      TAPS_PER_PASS = 6.0;
      pass = 1.0;
      stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);
      Stage3d.postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
      Stage3d.postprocessing.godrayGenUniforms["tInput"].value = Stage3d.postprocessing.rtTextureDepth;
      Stage3d.postprocessing.scene.overrideMaterial = Stage3d.postprocessing.materialGodraysGenerate;
      Stage3d.renderer.render(Stage3d.postprocessing.scene, Stage3d.postprocessing.camera, Stage3d.postprocessing.rtTextureGodRays2);
      pass = 2.0;
      stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);
      Stage3d.postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
      Stage3d.postprocessing.godrayGenUniforms["tInput"].value = Stage3d.postprocessing.rtTextureGodRays2;
      Stage3d.renderer.render(Stage3d.postprocessing.scene, Stage3d.postprocessing.camera, Stage3d.postprocessing.rtTextureGodRays1);
      pass = 3.0;
      stepLen = filterLen * Math.pow(TAPS_PER_PASS, -pass);
      Stage3d.postprocessing.godrayGenUniforms["fStepSize"].value = stepLen;
      Stage3d.postprocessing.godrayGenUniforms["tInput"].value = Stage3d.postprocessing.rtTextureGodRays1;
      Stage3d.renderer.render(Stage3d.postprocessing.scene, Stage3d.postprocessing.camera, Stage3d.postprocessing.rtTextureGodRays2);
      Stage3d.postprocessing.godrayCombineUniforms["tColors"].value = Stage3d.postprocessing.rtTextureColors;
      Stage3d.postprocessing.godrayCombineUniforms["tGodRays"].value = Stage3d.postprocessing.rtTextureGodRays2;
      Stage3d.postprocessing.scene.overrideMaterial = Stage3d.postprocessing.materialGodraysCombine;
      Stage3d.renderer.render(Stage3d.postprocessing.scene, Stage3d.postprocessing.camera);
      Stage3d.postprocessing.scene.overrideMaterial = null;
    } else {
      Stage3d.renderer.clear();
      Stage3d.renderer.render(Stage3d.scene, Stage3d.camera);
      Stage3d.renderer.render(Stage3d.sceneNoLight, Stage3d.camera);
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

module.exports = Stage3d;



},{"home/Home":13}],6:[function(require,module,exports){
var IceAnim,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

IceAnim = (function() {
  function IceAnim(_node, _w, _h) {
    this._node = _node;
    this._w = _w;
    this._h = _h;
    this.dispose = __bind(this.dispose, this);
    this._removeIce = __bind(this._removeIce, this);
    this._domContent = this._node.querySelector(".ice-content");
    this._nodeA = this._domContent.cloneNode(true);
    this._nodeB = this._domContent.cloneNode(true);
    this._initNode(this._nodeA, this._w, this._h);
    this._initNode(this._nodeB, this._w, this._h);
    TweenLite.set(this._domContent, {
      css: {
        alpha: 0,
        force3D: true
      }
    });
    this._masks = {};
    this._createMasks();
  }

  IceAnim.prototype._initNode = function(node, w, h) {
    node.style.width = w + "px";
    return node.style.height = h + "px";
  };

  IceAnim.prototype._createMasks = function() {
    var r;
    this._maskA = this._createMaskDiv(this._w, this._h);
    this._maskB = this._createMaskDiv(this._w, this._h);
    this._maskA.appendChild(this._nodeA);
    this._maskB.appendChild(this._nodeB);
    TweenLite.set(this._maskA, {
      css: {
        transformOrigin: "0% 0%"
      }
    });
    TweenLite.set(this._maskB, {
      css: {
        transformOrigin: "100% 100%"
      }
    });
    TweenLite.set(this._nodeB, {
      css: {
        transformOrigin: "100% 100%"
      }
    });
    r = (Math.PI * .25 + (Math.random() * Math.PI * .2) - .1) * 180 / Math.PI;
    TweenLite.set(this._maskA, {
      css: {
        alpha: 0,
        rotation: -r,
        force3D: true
      }
    });
    TweenLite.set(this._nodeA, {
      css: {
        rotation: r,
        force3D: true
      }
    });
    r = (Math.PI * .25 + (Math.random() * Math.PI * .3) - .15) * 180 / Math.PI;
    TweenLite.set(this._maskB, {
      css: {
        alpha: 0,
        rotation: -r,
        force3D: true
      }
    });
    TweenLite.set(this._nodeB, {
      css: {
        rotation: r,
        force3D: true
      }
    });
    this._node.appendChild(this._maskA);
    return this._node.appendChild(this._maskB);
  };

  IceAnim.prototype._createMaskDiv = function(w, h) {
    var div;
    div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = 0;
    div.style.left = 0;
    div.style.width = w + "px";
    div.style.height = h + "px";
    div.style.overflow = "hidden";
    return div;
  };

  IceAnim.prototype.show = function(delay) {
    if (delay == null) {
      delay = 0;
    }
    TweenLite.set(this._maskA, {
      delay: delay,
      css: {
        alpha: .2,
        rotationY: -20,
        x: -50,
        z: 60,
        force3D: true
      }
    });
    TweenLite.to(this._maskA, .05, {
      delay: delay,
      css: {
        alpha: .45,
        rotationY: -10,
        x: -35,
        z: 45,
        force3D: true
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._maskA, .15, {
      delay: delay + .05,
      css: {
        alpha: 1,
        rotationY: 0,
        x: 0,
        z: 0,
        force3D: true
      },
      ease: Quart.easeOut
    });
    TweenLite.set(this._maskB, {
      delay: delay,
      css: {
        alpha: .2,
        rotationY: 20,
        x: 50,
        z: 60,
        force3D: true
      }
    });
    TweenLite.to(this._maskB, .05, {
      delay: delay + .05,
      css: {
        alpha: .45,
        rotationY: 10,
        x: 35,
        z: 45,
        force3D: true
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._maskB, .15, {
      delay: delay + .1,
      css: {
        alpha: 1,
        rotationY: 0,
        x: 0,
        z: 0,
        force3D: true
      },
      ease: Quart.easeOut
    });
    TweenLite.set(this._domContent, {
      delay: delay,
      css: {
        rotationY: -20,
        z: 20,
        force3D: true,
        alpha: 0
      }
    });
    return TweenLite.to(this._domContent, .4, {
      delay: delay + .15,
      css: {
        rotationY: 0,
        z: 0,
        alpha: 1,
        force3D: true
      },
      ease: Expo.easeInOut,
      onComplete: this._removeIce
    });
  };

  IceAnim.prototype._removeIce = function() {
    this._node.removeChild(this._maskA);
    return this._node.removeChild(this._maskB);
  };

  IceAnim.prototype.hide = function(delay) {
    if (delay == null) {
      delay = 0;
    }
    this._node.appendChild(this._maskA);
    this._node.appendChild(this._maskB);
    TweenLite.set(this._maskA, {
      css: {
        alpha: 1,
        rotationY: 0,
        x: 0,
        z: 0,
        force3D: true
      }
    });
    TweenLite.set(this._maskB, {
      css: {
        alpha: 1,
        rotationY: 0,
        x: 0,
        z: 0,
        force3D: true
      }
    });
    TweenLite.set(this._domContent, {
      css: {
        rotationY: 0,
        z: 0,
        alpha: 1,
        force3D: true
      }
    });
    TweenLite.to(this._domContent, .1, {
      delay: delay,
      css: {
        alpha: .85,
        rotationY: -7,
        z: 20,
        force3D: true
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._domContent, .05, {
      delay: delay + .1,
      css: {
        alpha: 0,
        rotationY: -20,
        z: 60,
        force3D: true
      },
      ease: Cubic.easeOut
    });
    TweenLite.to(this._maskA, .1, {
      delay: delay + .05,
      css: {
        alpha: .85,
        rotationY: -7,
        x: -15,
        force3D: true,
        z: 20
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._maskA, .1, {
      delay: delay + .05 + .1,
      css: {
        alpha: 0,
        rotationY: -20,
        x: -50,
        z: 60,
        force3D: true
      },
      ease: Cubic.easeOut
    });
    TweenLite.to(this._maskB, .1, {
      delay: delay + .1 + .05,
      css: {
        alpha: .85,
        rotationY: 7,
        x: 15,
        z: 20,
        force3D: true
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._maskB, .1, {
      delay: delay + .1 + .1,
      css: {
        alpha: 0,
        rotationY: 20,
        x: 50,
        z: 60,
        force3D: true
      },
      ease: Cubic.easeOut
    });
    return .4 + delay;
  };

  IceAnim.prototype.dispose = function() {
    this._removeIce();
    return TweenLite.set(this._domContent, {
      css: {
        rotationY: 0,
        z: 0,
        alpha: 1,
        force3D: true
      }
    });
  };

  return IceAnim;

})();

module.exports = IceAnim;



},{}],7:[function(require,module,exports){
module.exports = function(node) {
  var i;
  i = 1;
  while (node = node.previousElementSibling) {
    if (node.nodeType === 1) {
      i++;
    }
  }
  return i;
};



},{}],8:[function(require,module,exports){
var Interactions;

Interactions = (function() {
  function Interactions() {
    this._downs = {};
    this._moves = {};
    this._ups = {};
    this._clicks = {};
    this._interactions = [this._downs, this._moves, this._ups, this._clicks];
    this.isTouchDevice = "ontouchstart" in window || "onmsgesturechange" in window;
  }

  Interactions.prototype.on = function(elt, action, cb) {
    var evt, isTouchDevice, obj, proxy;
    evt = this._getEvent(action);
    if (evt === "") {
      return;
    }
    obj = this._getObj(action);
    if (!obj[elt]) {
      obj[elt] = [];
    }
    isTouchDevice = this.isTouchDevice;
    proxy = function(e) {
      var touch;
      if (isTouchDevice) {
        touch = e.touches[0];
        if (touch) {
          e.x = touch.clientX;
          e.y = touch.clientY;
        }
      } else {
        e.x = e.clientX;
        e.y = e.clientY;
      }
      return cb.call(this, e);
    };
    obj[elt].push({
      cb: cb,
      proxy: proxy
    });
    return elt.addEventListener(evt, proxy, false);
  };

  Interactions.prototype.off = function(elt, action, cb) {
    var data, datas, evt, obj, result, _i, _len;
    evt = this._getEvent(action);
    if (evt === "") {
      return;
    }
    obj = this._getObj(action);
    if (!obj[elt]) {
      return;
    }
    datas = obj[elt];
    if (cb) {
      result = this._find(cb, datas);
      if (!result) {
        return;
      }
      elt.removeEventListener(evt, result.data.proxy, false);
      datas.splice(result.idx, 1);
    } else {
      for (_i = 0, _len = datas.length; _i < _len; _i++) {
        data = datas[_i];
        elt.removeEventListener(evt, data.proxy, false);
      }
      obj[elt] = [];
    }
  };

  Interactions.prototype.dispose = function(elt) {
    var interaction, _i, _len, _ref;
    _ref = this._interactions;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      interaction = _ref[_i];
      if (interaction[elt]) {
        interaction[elt] = null;
        delete interaction[elt];
      }
    }
  };

  Interactions.prototype._getEvent = function(action) {
    var evt;
    evt = "";
    if (this.isTouchDevice) {
      switch (action) {
        case "down":
          return evt = "touchstart";
        case "move":
          return evt = "touchmove";
        case "up":
          return evt = "touchend";
        case "click":
          return evt = "touchstart";
      }
    } else {
      switch (action) {
        case "down":
          return evt = "mousedown";
        case "move":
          return evt = "mousemove";
        case "up":
          return evt = "mouseup";
        case "click":
          return evt = "click";
      }
    }
  };

  Interactions.prototype._getObj = function(action) {
    var obj;
    return obj = this["_" + action + "s"];
  };

  Interactions.prototype._find = function(cb, datas) {
    var data, idx, _i, _len;
    for (idx = _i = 0, _len = datas.length; _i < _len; idx = ++_i) {
      data = datas[idx];
      if (data.cb === cb) {
        return {
          data: data,
          idx: idx
        };
      }
    }
    return null;
  };

  return Interactions;

})();

module.exports = new Interactions;



},{}],9:[function(require,module,exports){
var Nav,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Nav = (function(_super) {
  __extends(Nav, _super);

  function Nav() {
    Nav.__super__.constructor.apply(this, arguments);
    this.id = "";
  }

  Nav.prototype.set = function(id) {
    if (this.id === id) {
      return;
    }
    this.id = id;
    return this.emit("change", this.id);
  };

  return Nav;

})(Emitter);

module.exports = new Nav;



},{}],10:[function(require,module,exports){
var About, IceAnim, interactions, nav;

interactions = require("common/interactions");

nav = require("common/nav");

IceAnim = require("common/anim/IceAnim");

About = (function() {
  function About() {
    this.dom = document.querySelector(".about");
    this._domBtClose = this.dom.querySelector(".bt-close-holder");
    interactions.on(this._domBtClose, "click", this._onBtClose);
  }

  About.prototype._onBtClose = function(e) {
    e.preventDefault();
    return nav.set("");
  };

  About.prototype.show = function() {
    var d, dom, domInfos, _i, _len, _results;
    this.dom.style.display = "block";
    this._iceAnim = new IceAnim(this.dom, this.dom.offsetWidth, this.dom.offsetHeight);
    this._iceAnim.show(.1);
    domInfos = document.querySelectorAll(".about-infos");
    d = 0;
    _results = [];
    for (_i = 0, _len = domInfos.length; _i < _len; _i++) {
      dom = domInfos[_i];
      TweenLite.set(dom, {
        css: {
          alpha: 0,
          y: 50,
          force3D: true
        }
      });
      TweenLite.to(dom, .1, {
        delay: .15 + d,
        css: {
          alpha: .325,
          y: 35,
          force3D: true
        },
        ease: Quad.easeIn
      });
      TweenLite.to(dom, .25, {
        delay: .15 + .1 + d,
        css: {
          alpha: 1,
          y: 0,
          force3D: true
        },
        ease: Quart.easeOut
      });
      _results.push(d += .05);
    }
    return _results;
  };

  About.prototype._getIndex = function(node) {
    var i;
    i = 1;
    while (node = node.previousElementSibling) {
      if (node.nodeType === 1) {
        i++;
      }
    }
    return i;
  };

  About.prototype.hide = function() {
    return done(this._iceAnim.hide() * 1000, (function(_this) {
      return function() {
        _this.dom.style.display = "none";
        return _this._iceAnim.dispose();
      };
    })(this));
  };

  return About;

})();

module.exports = About;



},{"common/anim/IceAnim":6,"common/interactions":8,"common/nav":9}],11:[function(require,module,exports){
var Artists, IceAnim, interactions, nav,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

nav = require("common/nav");

IceAnim = require("common/anim/IceAnim");

Artists = (function() {
  function Artists() {
    this._update = __bind(this._update, this);
    this._onResize = __bind(this._onResize, this);
    this._onMouseWheel = __bind(this._onMouseWheel, this);
    this._onDragStop = __bind(this._onDragStop, this);
    this._onDragMove = __bind(this._onDragMove, this);
    this._onDragStart = __bind(this._onDragStart, this);
    this.dom = document.querySelector(".artists");
    this._domEntries = document.querySelector(".artists-entries");
    this._domEntriesItems = document.querySelectorAll(".artists-entry");
    this._domEntriesHolders = this.dom.querySelectorAll(".artists-entry-holder");
    this._domBtClose = this.dom.querySelector(".bt-close-holder");
    this._countEntries = this._domEntriesItems.length;
    this._domEntries.addEventListener("mousewheel", this._onMouseWheel, false);
    if (interactions.isTouchDevice) {
      interactions.on(this._domEntries, "down", this._onDragStart, false);
    }
    this._py = 0;
    this._pyCurrent = 0;
    this._yMaxRelative = Math.round(this._countEntries / 6);
    this._yMax = -this._yMaxRelative * (document.body.offsetHeight * .5) >> 0;
    this._lastY = 0;
    this._idRaf = -1;
    interactions.on(this._domBtClose, "click", this._onBtClose);
    window.addEventListener("resize", this._onResize, false);
  }

  Artists.prototype._onDragStart = function(e) {
    e.preventDefault();
    this._lastY = e.y;
    interactions.on(this._domEntries, "move", this._onDragMove, false);
    return interactions.on(this._domEntries, "up", this._onDragStop, false);
  };

  Artists.prototype._onDragMove = function(e) {
    var dy;
    e.preventDefault();
    dy = e.y - this._lastY;
    this._py += dy;
    this._lastY = e.y;
    return this._onEntriesScroll();
  };

  Artists.prototype._onDragStop = function(e) {
    e.preventDefault();
    interactions.off(this._domEntries, "move", this._onDragMove, false);
    return interactions.off(this._domEntries, "up", this._onDragStop, false);
  };

  Artists.prototype._onMouseWheel = function(e) {
    this._py += e.wheelDeltaY;
    return this._onEntriesScroll();
  };

  Artists.prototype._onEntriesScroll = function() {
    if (this._py > 0) {
      this._py = 0;
    }
    if (this._py < this._yMax) {
      return this._py = this._yMax;
    }
  };

  Artists.prototype._onResize = function(e) {
    var h;
    h = document.body.offsetHeight;
    this._yMax = -this._yMaxRelative * (h * .5) >> 0;
    return this._onEntriesScroll();
  };

  Artists.prototype._onBtClose = function(e) {
    e.preventDefault();
    return nav.set("");
  };

  Artists.prototype.show = function() {
    var d, dAdd, dom, domEntriesHolders, domInfos, idx, _i, _j, _len, _len1;
    this.dom.style.display = "block";
    this._py = 0;
    this._pyCurrent = 0;
    TweenLite.set(this._domEntries, {
      css: {
        y: 0,
        force3D: true
      }
    });
    this._iceAnim = new IceAnim(this.dom, this.dom.offsetWidth, this.dom.offsetHeight);
    this._iceAnim.show(.1);
    domEntriesHolders = document.querySelectorAll(".artists-entry");
    domInfos = document.querySelectorAll(".artists-infos");
    d = 0;
    for (_i = 0, _len = domInfos.length; _i < _len; _i++) {
      dom = domInfos[_i];
      TweenLite.set(dom, {
        css: {
          alpha: 0,
          y: 50
        }
      });
      TweenLite.to(dom, .1, {
        delay: .15 + d,
        css: {
          alpha: .325,
          y: 35
        },
        ease: Quad.easeIn
      });
      TweenLite.to(dom, .25, {
        delay: .15 + .1 + d,
        css: {
          alpha: 1,
          y: 0
        },
        ease: Quart.easeOut
      });
      d += .05;
    }
    d = 0;
    dAdd = .05;
    for (_j = 0, _len1 = domEntriesHolders.length; _j < _len1; _j++) {
      dom = domEntriesHolders[_j];
      idx = this._getIndex(dom);
      if (idx > 6) {
        d = 0;
        dAdd = .05;
        continue;
      }
      TweenLite.set(dom, {
        css: {
          alpha: 0,
          y: 50
        }
      });
      TweenLite.to(dom, .1, {
        delay: .1 + d,
        css: {
          alpha: .325,
          y: 35
        },
        ease: Quad.easeIn
      });
      TweenLite.to(dom, .25, {
        delay: .1 + .1 + d,
        css: {
          alpha: 1,
          y: 0
        },
        ease: Quart.easeOut
      });
      d += dAdd;
      dAdd *= .9;
      if (dAdd < .025) {
        dAdd = .025;
      }
    }
    return this._idTimeout = setTimeout(this._update, 2000);
  };

  Artists.prototype._update = function() {
    this._pyCurrent += (this._py - this._pyCurrent) * .1;
    TweenLite.set(this._domEntries, {
      css: {
        y: this._pyCurrent
      }
    });
    return this._idRaf = requestAnimationFrame(this._update);
  };

  Artists.prototype._getIndex = function(node) {
    var i;
    i = 1;
    while (node = node.previousElementSibling) {
      if (node.nodeType === 1) {
        i++;
      }
    }
    return i;
  };

  Artists.prototype.hide = function() {
    clearTimeout(this._idTimeout);
    cancelAnimationFrame(this._idRaf);
    return done(this._iceAnim.hide() * 1000, (function(_this) {
      return function() {
        _this.dom.style.display = "none";
        return _this._iceAnim.dispose();
      };
    })(this));
  };

  return Artists;

})();

module.exports = Artists;



},{"common/anim/IceAnim":6,"common/interactions":8,"common/nav":9}],12:[function(require,module,exports){
var Credits, interactions, nav,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

nav = require("common/nav");

Credits = (function() {
  function Credits() {
    this._onBtClose = __bind(this._onBtClose, this);
    this.dom = document.querySelector(".credits");
    this._domBtClose = this.dom.querySelector(".bt-close-holder");
    this._domTitle = this.dom.querySelector(".credits-title");
    this._domEntries = this.dom.querySelectorAll(".credits-entry");
    interactions.on(this._domBtClose, "click", this._onBtClose);
  }

  Credits.prototype._onBtClose = function(e) {
    e.preventDefault();
    return this.hide();
  };

  Credits.prototype.show = function() {
    var d, dAdd, dom, _i, _len, _ref, _results;
    TweenLite.to(this.dom, .4, {
      css: {
        x: 198
      },
      ease: Cubic.easeOut
    });
    TweenLite.set(this._domTitle, {
      css: {
        alpha: 0,
        x: -50
      }
    });
    TweenLite.to(this._domTitle, .1, {
      delay: .05,
      css: {
        alpha: .4,
        x: -30
      },
      ease: Sine.easeIn
    });
    TweenLite.to(this._domTitle, .25, {
      delay: .05 + .1,
      css: {
        alpha: 1,
        x: 0
      },
      ease: Back.easeOut,
      easeParams: [1.25]
    });
    d = .05 + .1;
    dAdd = .05 * .9;
    _ref = this._domEntries;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dom = _ref[_i];
      TweenLite.set(dom, {
        css: {
          alpha: 0,
          x: -50,
          force3D: true
        }
      });
      TweenLite.to(dom, .1, {
        delay: d,
        css: {
          alpha: .4,
          x: -30,
          force3D: true
        },
        ease: Sine.easeIn
      });
      TweenLite.to(dom, .25, {
        delay: d + .1,
        css: {
          alpha: 1,
          x: 0,
          force3D: true
        },
        ease: Back.easeOut,
        easeParams: [1.25]
      });
      d += dAdd;
      dAdd *= .9;
      if (dAdd < .02) {
        _results.push(dAdd = .02);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Credits.prototype.hide = function() {
    var duration;
    duration = .25;
    TweenLite.to(this.dom, duration, {
      css: {
        x: 0
      },
      ease: Cubic.easeOut
    });
    return done(duration * 1000);
  };

  return Credits;

})();

module.exports = Credits;



},{"common/interactions":8,"common/nav":9}],13:[function(require,module,exports){
var About, Artists, Home, Menu, TitleAnim, getIndex, nav, xps,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

nav = require("common/nav");

getIndex = require("common/getIndex");

Menu = require("home/Menu");

Artists = require("home/Artists");

About = require("home/About");

xps = require("home/xps");

TitleAnim = require("home/TitleAnim");

Home = (function() {
  function Home(scene3d) {
    this.show = __bind(this.show, this);
    this._onXPOut = __bind(this._onXPOut, this);
    this._onXPOver = __bind(this._onXPOver, this);
    this._onNavChange = __bind(this._onNavChange, this);
    var domHomeDetails;
    this.dom = document.querySelector(".home");
    TweenLite.set(this.dom, {
      css: {
        alpha: 0
      }
    });
    this.dom.style.display = "block";
    domHomeDetails = document.querySelector(".home-details-content");
    this._domHomeDetails = domHomeDetails.cloneNode(true);
    domHomeDetails.parentNode.removeChild(domHomeDetails);
    this._titleAnim = null;
    this._menu = new Menu;
    this._artists = new Artists;
    this._about = new About;
    this._currentModule = null;
    nav.on("change", this._onNavChange);
    scene3d.on("over", this._onXPOver);
    scene3d.on("out", this._onXPOut);
  }

  Home.prototype._onNavChange = function(id) {
    var newModule;
    if (id !== "") {
      newModule = this["_" + id];
      if (this._currentModule === newModule) {
        return;
      }
      if (this._currentModule) {
        return this._currentModule.hide().then((function(_this) {
          return function() {
            _this._currentModule = newModule;
            return _this._currentModule.show();
          };
        })(this));
      } else {
        this._currentModule = newModule;
        return this._currentModule.show();
      }
    } else {
      this._currentModule.hide();
      return this._currentModule = null;
    }
  };

  Home.prototype._onBtOver = function(e) {
    e.preventDefault();
    return xps.over(getIndex(e.currentTarget));
  };

  Home.prototype._onBtOut = function(e) {
    e.preventDefault();
    return xps.out();
  };

  Home.prototype._onXPOver = function(idx) {
    this._titleAnim = new TitleAnim(this._domHomeDetails.cloneNode(true), idx);
    return this._titleAnim.show();
  };

  Home.prototype._onXPOut = function() {
    if (this._titleAnim) {
      return this._titleAnim.hide();
    }
  };

  Home.prototype.show = function() {
    return TweenLite.to(this.dom, .5, {
      css: {
        alpha: 1
      }
    });
  };

  Home.prototype.hide = function() {};

  return Home;

})();

module.exports = Home;



},{"common/getIndex":7,"common/nav":9,"home/About":10,"home/Artists":11,"home/Menu":15,"home/TitleAnim":17,"home/xps":18}],14:[function(require,module,exports){
var IceAnim, Loading,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

IceAnim = require("common/anim/IceAnim");

Loading = (function(_super) {
  __extends(Loading, _super);

  function Loading() {
    this._updatePercent = __bind(this._updatePercent, this);
    Loading.__super__.constructor.apply(this, arguments);
    this.dom = document.querySelector(".loading");
    this._domPercent = document.querySelector(".loading-percent");
    this._percent = 0;
    this.percent = 0;
  }

  Loading.prototype.start = function() {
    return TweenLite.to(this, 1, {
      _percent: 1,
      onUpdate: this._updatePercent,
      ease: Linear.easeNone
    });
  };

  Loading.prototype._updatePercent = function() {
    this.percent = this._percent * 24 >> 0;
    if (this.percent < 10) {
      this._domPercent.innerHTML = "0" + this.percent;
    } else {
      this._domPercent.innerHTML = this.percent;
    }
    if (this._percent === 1) {
      return this._onComplete();
    }
  };

  Loading.prototype._onComplete = function() {
    return this.emit("complete");
  };

  Loading.prototype.hide = function() {
    var duration;
    duration = .5;
    this._iceAnim = new IceAnim(this.dom, document.body.offsetWidth, document.body.offsetHeight);
    this._iceAnim.hide();
    return done(200);
  };

  Loading.prototype.dispose = function() {
    console.log("dispose");
    return document.body.removeChild(this.dom);
  };

  return Loading;

})(Emitter);

module.exports = Loading;



},{"common/anim/IceAnim":6}],15:[function(require,module,exports){
var Credits, IceAnim, Menu, interactions, nav,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

nav = require("common/nav");

IceAnim = require("common/anim/IceAnim");

Credits = require("home/Credits");

Menu = (function() {
  function Menu() {
    this._onNavChange = __bind(this._onNavChange, this);
    this._onBtCredits = __bind(this._onBtCredits, this);
    this._onBtAbout = __bind(this._onBtAbout, this);
    this._onBtArtists = __bind(this._onBtArtists, this);
    var domBtAbout, domBtArtists, domBtCredits, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    this.dom = document.querySelector(".menu");
    this._credits = new Credits;
    this._domMenuLight = document.querySelector(".menu--light");
    this._menuLightVisible = false;
    this._domBtsArtists = document.querySelectorAll(".menu-entry--artists a");
    this._domBtsAbout = document.querySelectorAll(".menu-entry--about a");
    this._domBtsCredits = document.querySelectorAll(".menu-subentry--credits a");
    _ref = this._domBtsArtists;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      domBtArtists = _ref[_i];
      interactions.on(domBtArtists, "click", this._onBtArtists);
    }
    _ref1 = this._domBtsAbout;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      domBtAbout = _ref1[_j];
      interactions.on(domBtAbout, "click", this._onBtAbout);
    }
    _ref2 = this._domBtsCredits;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      domBtCredits = _ref2[_k];
      interactions.on(domBtCredits, "click", this._onBtCredits);
    }
    nav.on("change", this._onNavChange);
  }

  Menu.prototype._onBtArtists = function(e) {
    e.preventDefault();
    return nav.set("artists");
  };

  Menu.prototype._onBtAbout = function(e) {
    e.preventDefault();
    return nav.set("about");
  };

  Menu.prototype._onBtCredits = function(e) {
    e.preventDefault();
    return this._credits.show();
  };

  Menu.prototype._onNavChange = function(id) {
    if (id !== "" && id !== "credits") {
      if (id === "artists") {
        this._activate(".menu-entry--artists");
      } else {
        this._activate(".menu-entry--about");
      }
      return this._showMenuLight();
    } else {
      return this._hideMenuLight();
    }
  };

  Menu.prototype._activate = function(c) {
    var dom, _i, _len, _ref, _results;
    this._deactivate();
    _ref = this._domMenuLight.querySelectorAll(c);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dom = _ref[_i];
      _results.push(dom.classList.add("activated"));
    }
    return _results;
  };

  Menu.prototype._deactivate = function() {
    var dom, _i, _len, _ref, _results;
    _ref = this._domMenuLight.querySelectorAll(".activated");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dom = _ref[_i];
      _results.push(dom.classList.remove("activated"));
    }
    return _results;
  };

  Menu.prototype._showMenuLight = function() {
    if (this._menuLightVisible) {
      return;
    }
    this._menuLightVisible = true;
    this._domMenuLight.style.display = "block";
    this._iceAnim = new IceAnim(this._domMenuLight, this.dom.offsetWidth, this.dom.offsetHeight);
    return this._iceAnim.show();
  };

  Menu.prototype._hideMenuLight = function() {
    if (!this._menuLightVisible) {
      return;
    }
    this._menuLightVisible = false;
    return done(this._iceAnim.hide(.15) * 1000, (function(_this) {
      return function() {
        _this._domMenuLight.style.display = "none";
        return _this._iceAnim.dispose();
      };
    })(this));
  };

  return Menu;

})();

module.exports = Menu;



},{"common/anim/IceAnim":6,"common/interactions":8,"common/nav":9,"home/Credits":12}],16:[function(require,module,exports){
var MobileMenu, interactions,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

MobileMenu = (function() {
  MobileMenu.prototype.dom = null;

  MobileMenu.prototype.domNavbar = null;

  MobileMenu.prototype._domMenuCTA = null;

  MobileMenu.prototype._domCloseBtn = null;

  MobileMenu.prototype._isVisible = false;

  MobileMenu.prototype._transitionTimer = null;

  function MobileMenu() {
    this._hide = __bind(this._hide, this);
    this._show = __bind(this._show, this);
    this._toggleMenu = __bind(this._toggleMenu, this);
    console.log('[MobileMenu constructor]');
    this.dom = document.querySelector('.mobile-menu');
    this.domNavbar = document.querySelector('.mobile-navbar');
    this._domMenuCTA = this.domNavbar.querySelector('.menuCTA');
    this._domCloseBtn = this.dom.querySelector('.bt-close-holder');
    console.log(this.dom.querySelector('.bt-close-holder'));
    interactions.on(this._domMenuCTA, 'click', this._show);
    interactions.on(this._domCloseBtn, 'click', this._hide);
    null;
  }

  MobileMenu.prototype._toggleMenu = function() {
    this._isVisible = !this._isVisible;
    if (this._isVisible) {
      this._show();
    } else {
      this._hide();
    }
    return null;
  };

  MobileMenu.prototype._show = function(evt) {
    if (evt) {
      evt.preventDefault();
    }
    this.dom.style.display = 'table';
    this._transitionTimer = setTimeout((function(_this) {
      return function() {
        return _this.dom.classList.add('transitionIn');
      };
    })(this), 100);
    return null;
  };

  MobileMenu.prototype._hide = function(evt) {
    if (evt) {
      evt.preventDefault();
    }
    this.dom.classList.add('transitionOut');
    this._transitionTimer = setTimeout((function(_this) {
      return function() {
        _this.dom.classList.remove('transitionIn');
        _this.dom.classList.remove('transitionOut');
        return _this.dom.style.display = 'none';
      };
    })(this), 1500);
    return null;
  };

  return MobileMenu;

})();

module.exports = MobileMenu;



},{"common/interactions":8}],17:[function(require,module,exports){
var IceAnim, TitleAnim, datas;

IceAnim = require("common/anim/IceAnim");

datas = require("data.json").experiments;

TitleAnim = (function() {
  function TitleAnim(_node, idx) {
    var data, day;
    this._node = _node;
    this.dom = document.querySelector(".home-details-cnt");
    this._w = 300;
    this._h = 140;
    data = datas[idx];
    day = idx;
    if (idx < 10) {
      day = "0" + day;
    }
    this._node.querySelector(".home-details-day").innerHTML = day;
    this._node.querySelector(".home-details-title").innerHTML = data.title;
    this._node.querySelector(".home-details-author").innerHTML = data.author;
  }

  TitleAnim.prototype.show = function() {
    this.dom.appendChild(this._node);
    TweenLite.set(this._node, {
      css: {
        alpha: 0
      }
    });
    return TweenLite.to(this._node, .25, {
      css: {
        alpha: 1
      }
    });
  };

  TitleAnim.prototype.hide = function() {
    return TweenLite.to(this._node, .25, {
      css: {
        alpha: 0
      },
      onComplete: (function(_this) {
        return function() {
          console.log("yup");
          return _this.dom.removeChild(_this._node);
        };
      })(this)
    });
  };

  return TitleAnim;

})();

module.exports = TitleAnim;



},{"common/anim/IceAnim":6,"data.json":2}],18:[function(require,module,exports){
var Xps,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Xps = (function(_super) {
  __extends(Xps, _super);

  function Xps() {
    Xps.__super__.constructor.apply(this, arguments);
  }

  Xps.prototype.over = function(idx) {
    return this.emit("over", idx);
  };

  Xps.prototype.out = function(idx) {
    return this.emit("out");
  };

  return Xps;

})(Emitter);

module.exports = new Xps;



},{}]},{},[1])