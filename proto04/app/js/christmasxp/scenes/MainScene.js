var MainScene,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MainScene = (function(_super) {
  __extends(MainScene, _super);

  function MainScene() {
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
    this.isReady = false;
    this.isImgReady = false;
    this.currentIndex = 1;
    this.mouse = new THREE.Vector2(0, 0);
    this.time = 0;
    this.useMap = true;
    this.shading = THREE.FlatShading;
    this.opacity = 1;
    this.fragments = [];
    this.hitboxs = [];
    this.maxDate = 13;
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

  MainScene.prototype.createCanvas = function() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 64;
    this.canvas.height = 64;
    this.ctx = this.canvas.getContext('2d');
    this.map = new THREE.Texture(this.canvas, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBFormat, THREE.UnsignedByteType, 1);
    this.envMap = new THREE.Texture([this.canvas, this.canvas, this.canvas, this.canvas, this.canvas, this.canvas], THREE.CubeRefractionMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBFormat, THREE.UnsignedByteType, 1);
  };

  MainScene.prototype.loadImagesLow = function() {
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

  MainScene.prototype.parseAtlas = function() {
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

  MainScene.prototype.loadImagesHight = function() {
    this.atlas = new Image();
    this.atlas.onload = (function(_this) {
      return function() {
        return _this.parseAtlas();
      };
    })(this);
    this.atlas.src = './3d/textures/atlas_low_2048.jpg';
  };

  MainScene.prototype.loadMesh = function() {
    var loader;
    loader = new THREE.JSONLoader();
    loader.load('./3d/json/crystal.js', this.onDiamondLoad);
    loader = new THREE.JSONLoader();
    loader.load('./3d/json/mirror.js', this.onMirrorLoad);
    loader = new THREE.SceneLoader();
    loader.load('./3d/json/fragments.js', this.onFragmentLoaded);
  };

  MainScene.prototype.createBackground = function() {
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

  MainScene.prototype.createCircles = function() {
    var image;
    image = new Image();
    image.onload = (function(_this) {
      return function() {
        var map, material, mesh;
        map = new THREE.Texture(image, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearMipMapLinearFilter, THREE.RGBFormat, THREE.UnsignedByteType, 1);
        material = new THREE.PointCloudMaterial({
          color: 0,
          size: 64,
          sizeAttenuation: false,
          fog: false
        });
        mesh = new THREE.PointCloud(_this.backgroundGeometry, material);
        return _this.container.add(mesh);
      };
    })(this);
    image.src = './3d/textures/circle.png';
  };

  MainScene.prototype.createLight = function() {
    this.ambientLight = new THREE.AmbientLight(0x333333);
    this.ambientLight2 = new THREE.AmbientLight(0xFFFFFF);
    this.cameraLight = new THREE.PointLight(0x221199, 2, 2000);
    this.cameraLight.position.set(0, -1000, 0);
    this.cameraLight3 = new THREE.PointLight(0x2233AA, 2, 2400);
    this.cameraLight3.position.set(1000, 0, 0);
    this.cameraLight2 = new THREE.PointLight(0x2211AA, 1, 2400);
    this.cameraLight2.position.set(-1500, 0, 0);
    this.cameraLight4 = new THREE.PointLight(0x222277, 2, 2400);
    this.cameraLight4.position.set(0, 1000, 0);
    this.cameraLight5 = new THREE.PointLight(0xFFFFFF, 1, 200);
    this.cameraLight5.position.set(0, 0, 0);
    Stage3d.add(this.ambientLight);
    Stage3d.add(this.cameraLight);
    Stage3d.add(this.cameraLight3);
    Stage3d.add(this.cameraLight2);
    Stage3d.add(this.cameraLight4);
    Stage3d.add(this.cameraLight5);
    Stage3d.add(this.ambientLight2, false);
  };

  MainScene.prototype.createGrids1 = function() {
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

  MainScene.prototype.createGrids2 = function() {
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

  MainScene.prototype.createGrids3 = function() {
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

  MainScene.prototype.createGrids4 = function() {
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

  MainScene.prototype.createPortraitPosition = function() {
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

  MainScene.prototype.createMobilePosition = function() {
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

  MainScene.prototype.addEvent = function() {
    window.addEventListener('mousemove', (function(_this) {
      return function(e) {
        _this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        return _this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
    })(this), false);
  };

  MainScene.prototype.onDiamondLoad = function(geometry) {
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

  MainScene.prototype.onMirrorLoad = function(geometry) {
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

  MainScene.prototype.onFragmentLoaded = function(scene) {
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

  MainScene.prototype.createGUI = function() {
    var frag, global, positions;
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
    this.movementScale = 1.1;
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
  };

  MainScene.prototype.tweenTo = function(positions) {
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

  MainScene.prototype.noGrid = function() {
    this.tweenTo(this.positions.base);
  };

  MainScene.prototype.grid1 = function() {
    this.tweenTo(this.positions.grid1);
  };

  MainScene.prototype.grid2 = function() {
    this.tweenTo(this.positions.grid2);
  };

  MainScene.prototype.grid3 = function() {
    this.tweenTo(this.positions.grid3);
  };

  MainScene.prototype.grid4 = function() {
    this.tweenTo(this.positions.grid4);
  };

  MainScene.prototype.portrait = function() {
    this.tweenTo(this.positions.portrait);
  };

  MainScene.prototype.mobile = function() {
    this.tweenTo(this.positions.mobile);
  };

  MainScene.prototype.addZero = function(number, minLength) {
    number = number + "";
    while (number.length < minLength) {
      number = "0" + number;
    }
    return number;
  };

  MainScene.prototype.computeGeometry = function(geometry) {
    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeTangents();
    geometry.computeMorphNormals();
    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
  };

  MainScene.prototype.showXP = function(index) {
    if (index === this.currentIndex || parseInt(index) > this.maxDate) {
      return;
    }
    this.currentIndex = index;
    this.globalAlpha = 0.01;
  };

  MainScene.prototype.pause = function() {};

  MainScene.prototype.resume = function() {};

  MainScene.prototype.update = function(dt) {
    var distance, dx, dy, dz, f, frag, geometry, i, idx, intersects, raycaster, s, speeds, t, v, vector, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
    this.time += dt;
    if (this.isImgReady) {
      this.ctx.globalAlpha = this.globalAlpha;
      this.globalAlpha += .01;
      idx = parseInt(this.currentIndex) - 1;
      if (idx <= 14) {
        this.ctx.drawImage(this.images[idx], 0, 0);
        this.map.needsUpdate = true;
        this.envMap.needsUpdate = true;
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

  return MainScene;

})(Scene);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNocmlzdG1hc3hwL3NjZW5lcy9NYWluU2NlbmUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsU0FBQTtFQUFBOztpU0FBQTs7QUFBQTtBQUVDLDhCQUFBLENBQUE7O0FBQVksRUFBQSxtQkFBQSxHQUFBO0FBRVgsaURBQUEsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSx1RUFBQSxDQUFBO0FBQUEsMkVBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEsdURBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEsbURBQUEsQ0FBQTtBQUFBLHlEQUFBLENBQUE7QUFBQSxRQUFBLEtBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FBWCxDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLEtBRGQsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsQ0FIaEIsQ0FBQTtBQUFBLElBS0EsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxFQUFnQixDQUFoQixDQUxiLENBQUE7QUFBQSxJQU1BLElBQUMsQ0FBQSxJQUFELEdBQVEsQ0FOUixDQUFBO0FBQUEsSUFPQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBUFYsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUFLLENBQUMsV0FSakIsQ0FBQTtBQUFBLElBU0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQVRYLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFWYixDQUFBO0FBQUEsSUFXQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBWFgsQ0FBQTtB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T0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBdkMsQ0FBQSxHQUEwQyxHQTFHdkUsQ0FGTTtFQUFBLENBM2hCUCxDQUFBOzttQkFBQTs7R0FGdUIsTUFBeEIsQ0FBQSIsImZpbGUiOiJjaHJpc3RtYXN4cC9zY2VuZXMvTWFpblNjZW5lLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTWFpblNjZW5lIGV4dGVuZHMgU2NlbmVcblxuXHRjb25zdHJ1Y3RvcjooKS0+XG5cblx0XHRAaXNSZWFkeSA9IGZhbHNlXG5cdFx0QGlzSW1nUmVhZHkgPSBmYWxzZVxuXG5cdFx0QGN1cnJlbnRJbmRleCA9IDFcblxuXHRcdEBtb3VzZSA9IG5ldyBUSFJFRS5WZWN0b3IyKDAsMClcblx0XHRAdGltZSA9IDBcblx0XHRAdXNlTWFwID0gdHJ1ZVxuXHRcdEBzaGFkaW5nID0gVEhSRUUuRmxhdFNoYWRpbmdcblx0XHRAb3BhY2l0eSA9IDFcblx0XHRAZnJhZ21lbnRzID0gW11cblx0XHRAaGl0Ym94cyA9IFtdXG5cdFx0QG1heERhdGUgPSAxM1xuXHRcdEBwb3NpdGlvbnMgPSB7fTtcblx0XHRAcG9zaXRpb25zLmJhc2UgPSB7XG5cdFx0XHRmcmFnbWVudHMgOiBbXVxuXHRcdFx0ZGlhbW9uZCA6IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRcdG1pcnJvciA6IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHR9XG5cblx0XHRAb2Zmc2V0WCA9IDBcblxuXHRcdEBjdXJyZW50UG9zaXRpb24gPSB7XG5cdFx0XHRmcmFnbWVudHMgOiBbXVxuXHRcdFx0ZGlhbW9uZCA6IG51bGxcblx0XHRcdG1pcnJvciA6IG51bGxcblx0XHR9XG5cblx0XHRAaW1hZ2VzID0gW11cblxuXHRcdGZvciBpIGluIFswLi4uMjRdIGJ5IDFcblx0XHRcdEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuXHRcdEBjdXJyZW50UG9zaXRpb24uZGlhbW9uZCA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRAY3VycmVudFBvc2l0aW9uLm1pcnJvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblxuXHRcdEBjb250YWluZXIgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblx0XHRTdGFnZTNkLmFkZChAY29udGFpbmVyLGZhbHNlKVxuXG5cdFx0QGxpZ2h0Q29udGFpbmVyID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cdFx0QGNvbnRhaW5lci5hZGQoQGxpZ2h0Q29udGFpbmVyKVxuXG5cdFx0QGNyZWF0ZUxpZ2h0KClcblx0XHRAY3JlYXRlQmFja2dyb3VuZCgpXG5cdFx0QGNyZWF0ZUNpcmNsZXMoKVxuXHRcdEBhZGRFdmVudCgpXG5cdFx0QGxvYWRJbWFnZXNMb3coKVxuXHRcdFxuXHRcdHJldHVyblxuXG5cblx0Y3JlYXRlQ2FudmFzOigpLT5cblx0XHRAY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcblx0XHRAY2FudmFzLndpZHRoID0gNjRcblx0XHRAY2FudmFzLmhlaWdodCA9IDY0XG5cdFx0QGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXHRcdEBtYXAgPSBuZXcgVEhSRUUuVGV4dHVyZSggQGNhbnZhcywgVEhSRUUuVVZNYXBwaW5nLCBUSFJFRS5DbGFtcFRvRWRnZVdyYXBwaW5nLCBUSFJFRS5DbGFtcFRvRWRnZVdyYXBwaW5nLCBUSFJFRS5MaW5lYXJGaWx0ZXIsIFRIUkVFLkxpbmVhck1pcE1hcExpbmVhckZpbHRlciwgVEhSRUUuUkdCRm9ybWF0LCBUSFJFRS5VbnNpZ25lZEJ5dGVUeXBlLCAxIClcblx0XHRAZW52TWFwID0gbmV3IFRIUkVFLlRleHR1cmUoIFtAY2FudmFzLEBjYW52YXMsQGNhbnZhcyxAY2FudmFzLEBjYW52YXMsQGNhbnZhc10sIFRIUkVFLkN1YmVSZWZyYWN0aW9uTWFwcGluZywgVEhSRUUuQ2xhbXBUb0VkZ2VXcmFwcGluZywgVEhSRUUuQ2xhbXBUb0VkZ2VXcmFwcGluZywgVEhSRUUuTGluZWFyRmlsdGVyLCBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXIsIFRIUkVFLlJHQkZvcm1hdCwgVEhSRUUuVW5zaWduZWRCeXRlVHlwZSwgMSApXG5cdFx0cmV0dXJuXG5cblx0bG9hZEltYWdlc0xvdzooKT0+XG5cdFx0QGF0bGFzID0gbmV3IEltYWdlKClcblx0XHRAYXRsYXMub25sb2FkID0gKCk9PlxuXHRcdFx0QHBhcnNlQXRsYXMoKVxuXHRcdFx0QGNyZWF0ZUNhbnZhcygpXG5cdFx0XHRAbG9hZE1lc2goKVxuXHRcdFx0QGNyZWF0ZUdVSSgpXG5cdFx0XHRAbG9hZEltYWdlc0hpZ2h0KClcblx0XHRAYXRsYXMuc3JjID0gJy4vM2QvdGV4dHVyZXMvYXRsYXNfbG93XzUxMi5qcGcnXG5cdFx0cmV0dXJuXG5cblx0cGFyc2VBdGxhczooKT0+XG5cdFx0c2l6ZSA9IEBhdGxhcy53aWR0aC84XG5cdFx0Zm9yIHkgaW4gWzAuLi44XSBieSAxXG5cdFx0XHRmb3IgeCBpbiBbMC4uLjhdIGJ5IDFcblx0XHRcdFx0ayA9IHgreSo4XG5cdFx0XHRcdGlmIGs+PTI0XG5cdFx0XHRcdFx0QGlzSW1nUmVhZHkgPSB0cnVlXG5cdFx0XHRcdFx0aWYoQGNhbnZhcylcblx0XHRcdFx0XHRcdEBjYW52YXMud2lkdGggPSBzaXplXG5cdFx0XHRcdFx0XHRAY2FudmFzLmhlaWdodCA9IHNpemVcblx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0XHRjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuXHRcdFx0XHRjYW52YXMud2lkdGggPSBzaXplXG5cdFx0XHRcdGNhbnZhcy5oZWlnaHQgPSBzaXplXG5cdFx0XHRcdGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cdFx0XHRcdGN0eC5kcmF3SW1hZ2UoQGF0bGFzLHgqc2l6ZSx5KnNpemUsc2l6ZSxzaXplLDAsMCxzaXplLHNpemUpXG5cdFx0XHRcdEBpbWFnZXNba10gPSBjYW52YXNcblx0XHRcdFx0IyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcylcblx0XHRyZXR1cm5cblxuXHRsb2FkSW1hZ2VzSGlnaHQ6KCk9PlxuXHRcdEBhdGxhcyA9IG5ldyBJbWFnZSgpXG5cdFx0QGF0bGFzLm9ubG9hZCA9ICgpPT5cblx0XHRcdEBwYXJzZUF0bGFzKClcblx0XHRAYXRsYXMuc3JjID0gJy4vM2QvdGV4dHVyZXMvYXRsYXNfbG93XzIwNDguanBnJ1xuXHRcdHJldHVyblxuXG5cdGxvYWRNZXNoOigpPT5cblxuXHRcdGxvYWRlciA9IG5ldyBUSFJFRS5KU09OTG9hZGVyKClcblx0XHRsb2FkZXIubG9hZCggJy4vM2QvanNvbi9jcnlzdGFsLmpzJywgQG9uRGlhbW9uZExvYWQgKVxuXG5cdFx0bG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIoKVxuXHRcdGxvYWRlci5sb2FkKCAnLi8zZC9qc29uL21pcnJvci5qcycsIEBvbk1pcnJvckxvYWQgKVxuXHRcdFxuXHRcdGxvYWRlciA9IG5ldyBUSFJFRS5TY2VuZUxvYWRlcigpXG5cdFx0bG9hZGVyLmxvYWQoICcuLzNkL2pzb24vZnJhZ21lbnRzLmpzJywgQG9uRnJhZ21lbnRMb2FkZWQgKVxuXHRcdHJldHVyblxuXG5cdGNyZWF0ZUJhY2tncm91bmQ6KCk9PlxuXHRcdG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyB3aXJlZnJhbWU6ZmFsc2UsY29sb3I6MHhGRkZGRkZ9KVxuXHRcdG1hdGVyaWFsLnNoYWRpbmcgPSBUSFJFRS5GbGF0U2hhZGluZ1xuXG5cdFx0Z2VvbWV0cnkgPSAgbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoNzAwMCwgNzAwMCwgOCwgOClcblx0XHRmb3IgaSBpbiBbMC4uLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aF0gYnkgMVxuXHRcdFx0diA9IGdlb21ldHJ5LnZlcnRpY2VzW2ldXG5cdFx0XHR2LnggKz0gKDEqTWF0aC5yYW5kb20oKS0uNSkqMzAwXG5cdFx0XHR2LnkgKz0gKDEqTWF0aC5yYW5kb20oKS0uNSkqMzAwXG5cdFx0XHR2LnogKz0gKDEqTWF0aC5yYW5kb20oKS0uNSkqMzAwXG5cdFx0Z2VvbWV0cnkuY29tcHV0ZVRhbmdlbnRzKCk7XG5cdFx0Z2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKVxuXHRcdGdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpXG5cdFx0IyBnZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKVxuXHRcdGdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKClcblx0XHRnZW9tZXRyeS5jb21wdXRlVGFuZ2VudHMoKVxuXHRcdCMgZ2VvbWV0cnkuY29tcHV0ZU1vcnBoTm9ybWFscygpXG5cdFx0Z2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZVxuXHRcdGdlb21ldHJ5Lm5vcm1hbHNOZWVkVXBkYXRlID0gdHJ1ZVxuXHRcdGdlb21ldHJ5LmVsZW1lbnRzTmVlZFVwZGF0ZSA9IHRydWU7XG5cdFx0Z2VvbWV0cnkudGFuZ2VudHNOZWVkVXBkYXRlID0gdHJ1ZTtcblxuXHRcdCMgYnVmZmVyR2VvbWV0cnkgPSBUSFJFRS5CdWZmZXJHZW9tZXRyeS5mcm9tR2VvbWV0cnkoZ2VvbWV0cnkpXG5cdFx0IyBidWZmZXJHZW9tZXRyeS5hdHRyaWJ1dGVzLnBvc2l0aW9ubmVlZHNVcGRhdGUgPSB0cnVlXG5cdFx0IyBidWZmZXJHZW9tZXRyeS5hdHRyaWJ1dGVzLm5vcm1hbC5uZWVkc1VwZGF0ZSA9IHRydWVcblx0XHQjIGJ1ZmZlckdlb21ldHJ5Lm5vcm1hbGl6ZU5vcm1hbHMoKVxuXHRcdCMgYnVmZmVyR2VvbWV0cnkgPSBnZW9tZXRyeVxuXG5cdFx0bWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbClcblx0XHRtZXNoLnBvc2l0aW9uLnogPSAtMTAwMFxuXHRcdFN0YWdlM2QuYWRkKG1lc2gpXG5cblx0XHRtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IHdpcmVmcmFtZTp0cnVlLGNvbG9yOjAsdHJhbnNwYXJlbnQ6dHJ1ZSxvcGFjaXR5Oi4xfSlcblx0XHRtYXRlcmlhbC5zaGFkaW5nID0gVEhSRUUuRmxhdFNoYWRpbmdcblx0XHRtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKVxuXHRcdG1lc2gucG9zaXRpb24ueiA9IC05NTBcblx0XHRtZXNoLnBvc2l0aW9uLnkgKz0gMTBcblx0XHRTdGFnZTNkLmFkZChtZXNoKVxuXG5cdFx0QGJhY2tncm91bmRHZW9tZXRyeSA9IGdlb21ldHJ5XG5cblx0XHRyZXR1cm5cblxuXHRjcmVhdGVDaXJjbGVzOigpLT5cblx0XHRpbWFnZSA9IG5ldyBJbWFnZSgpXG5cdFx0aW1hZ2Uub25sb2FkID0gKCk9PlxuXHRcdFx0bWFwID0gbmV3IFRIUkVFLlRleHR1cmUoIGltYWdlLCBUSFJFRS5VVk1hcHBpbmcsIFRIUkVFLkNsYW1wVG9FZGdlV3JhcHBpbmcsIFRIUkVFLkNsYW1wVG9FZGdlV3JhcHBpbmcsIFRIUkVFLkxpbmVhckZpbHRlciwgVEhSRUUuTGluZWFyTWlwTWFwTGluZWFyRmlsdGVyLCBUSFJFRS5SR0JGb3JtYXQsIFRIUkVFLlVuc2lnbmVkQnl0ZVR5cGUsIDEgKVxuXHRcdFx0bWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRDbG91ZE1hdGVyaWFsKHtjb2xvcjowLHNpemU6NjQsc2l6ZUF0dGVudWF0aW9uOmZhbHNlLGZvZzpmYWxzZX0pXG5cdFx0XHRtZXNoID0gbmV3IFRIUkVFLlBvaW50Q2xvdWQoQGJhY2tncm91bmRHZW9tZXRyeSxtYXRlcmlhbClcblxuXHRcdFx0QGNvbnRhaW5lci5hZGQobWVzaClcblx0XHRpbWFnZS5zcmMgPSAnLi8zZC90ZXh0dXJlcy9jaXJjbGUucG5nJ1xuXHRcdHJldHVyblxuXG5cdGNyZWF0ZUxpZ2h0OigpPT5cblx0XHRAYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDMzMzMzMylcblx0XHRAYW1iaWVudExpZ2h0MiA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhGRkZGRkYpXG5cdFx0XG5cdFx0QGNhbWVyYUxpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgyMjExOTksIDIsIDIwMDApXG5cdFx0QGNhbWVyYUxpZ2h0LnBvc2l0aW9uLnNldCggMCwgLTEwMDAsIDAgKTtcblxuXHRcdEBjYW1lcmFMaWdodDMgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDIyMzNBQSwgMiwgMjQwMClcblx0XHRAY2FtZXJhTGlnaHQzLnBvc2l0aW9uLnNldCggMTAwMCwgMCwgMCApO1xuXG5cdFx0QGNhbWVyYUxpZ2h0MiA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4MjIxMUFBLCAxLCAyNDAwKVxuXHRcdEBjYW1lcmFMaWdodDIucG9zaXRpb24uc2V0KCAtMTUwMCwgMCwgMCApO1xuXG5cdFx0QGNhbWVyYUxpZ2h0NCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4MjIyMjc3LCAyLCAyNDAwKVxuXHRcdEBjYW1lcmFMaWdodDQucG9zaXRpb24uc2V0KCAwLCAxMDAwLCAwICk7XG5cblx0XHRAY2FtZXJhTGlnaHQ1ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhGRkZGRkYsIDEsIDIwMClcblx0XHRAY2FtZXJhTGlnaHQ1LnBvc2l0aW9uLnNldCggMCwgMCwgMCApO1xuXG5cdFx0U3RhZ2UzZC5hZGQoQGFtYmllbnRMaWdodClcblx0XHRTdGFnZTNkLmFkZChAY2FtZXJhTGlnaHQpXG5cdFx0U3RhZ2UzZC5hZGQoQGNhbWVyYUxpZ2h0Mylcblx0XHRTdGFnZTNkLmFkZChAY2FtZXJhTGlnaHQyKVxuXHRcdFN0YWdlM2QuYWRkKEBjYW1lcmFMaWdodDQpXG5cdFx0U3RhZ2UzZC5hZGQoQGNhbWVyYUxpZ2h0NSlcblxuXHRcdFN0YWdlM2QuYWRkKEBhbWJpZW50TGlnaHQyLGZhbHNlKVxuXG5cdFx0cmV0dXJuXG5cblx0Y3JlYXRlR3JpZHMxOigpPT5cblx0XHRwID0gQHBvc2l0aW9ucy5ncmlkMSA9IHtcblx0XHRcdGZyYWdtZW50czpbXSBcblx0XHRcdGRpYW1vbmQ6QGRpYW1vbmQucG9zaXRpb24uY2xvbmUoKVxuXHRcdFx0bWlycm9yOkBtaXJyb3IucG9zaXRpb24uY2xvbmUoKVxuXHRcdH1cblx0XHRmb3IgaSBpbiBbMC4uLjI0XSBieSAxXG5cdFx0XHR2ID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuXHRcdFx0di54ID0gKC04KigoaSsxKSU1KSlcblx0XHRcdHYueSA9IE1hdGguZmxvb3IoKGkrMSkvNSkqOC0xNi41XG5cdFx0XHR2LnogPSAwXG5cdFx0XHRwLmZyYWdtZW50cy5wdXNoKHYpXG5cblx0XHRwLmRpYW1vbmQueCArPSAyMFxuXHRcdHAubWlycm9yLnggKz0gMjBcblx0XHRyZXR1cm5cblxuXHRjcmVhdGVHcmlkczI6KCk9PlxuXHRcdHAgPSBAcG9zaXRpb25zLmdyaWQyID0ge1xuXHRcdFx0ZnJhZ21lbnRzOltdIFxuXHRcdFx0ZGlhbW9uZDpAZGlhbW9uZC5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0XHRtaXJyb3I6QG1pcnJvci5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0fVxuXHRcdGZvciBpIGluIFswLi4uMjRdIGJ5IDFcblx0XHRcdHYgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG5cdFx0XHR2LnggPSAoLTgqKGklOCkpKzI4XG5cdFx0XHR2LnkgPSBNYXRoLmZsb29yKGkvOCkqOC0xMFxuXHRcdFx0di56ID0gMFxuXHRcdFx0cC5mcmFnbWVudHMucHVzaCh2KVxuXG5cdFx0cC5kaWFtb25kLnkgKz0gMTVcblx0XHRwLm1pcnJvci55ICs9IDE1XG5cdFx0cmV0dXJuXG5cblx0Y3JlYXRlR3JpZHMzOigpPT5cblx0XHRwID0gQHBvc2l0aW9ucy5ncmlkMyA9IHtcblx0XHRcdGZyYWdtZW50czpbXSBcblx0XHRcdGRpYW1vbmQ6QGRpYW1vbmQucG9zaXRpb24uY2xvbmUoKVxuXHRcdFx0bWlycm9yOkBtaXJyb3IucG9zaXRpb24uY2xvbmUoKVxuXHRcdH1cblx0XHRmb3IgaSBpbiBbMC4uLjI0XSBieSAxXG5cdFx0XHR2ID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuXHRcdFx0di54ID0gKC05KigoaSsxKSU1KSkrMTVcblx0XHRcdHYueSA9IE1hdGguZmxvb3IoKGkrMSkvNSkqOS0xNi41XG5cdFx0XHR2LnogPSAwXG5cdFx0XHRwLmZyYWdtZW50cy5wdXNoKHYpXG5cblx0XHQjIHAuZGlhbW9uZC54ICs9IDIwXG5cdFx0IyBwLm1pcnJvci54ICs9IDIwXG5cdFx0cmV0dXJuXG5cblx0Y3JlYXRlR3JpZHM0OigpPT5cblx0XHRwID0gQHBvc2l0aW9ucy5ncmlkNCA9IHtcblx0XHRcdGZyYWdtZW50czpbXSBcblx0XHRcdGRpYW1vbmQ6QGRpYW1vbmQucG9zaXRpb24uY2xvbmUoKVxuXHRcdFx0bWlycm9yOkBtaXJyb3IucG9zaXRpb24uY2xvbmUoKVxuXHRcdH1cblx0XHRhbmdsZSA9IE1hdGguUEkvMlxuXHRcdGFuZ2xlU3RlcCA9IE1hdGguUEkqMi8yNFxuXHRcdHJhZGl1cyA9IDIyXG5cdFx0Zm9yIGkgaW4gWzAuLi4yNF0gYnkgMVxuXHRcdFx0diA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRcdHYueCA9IE1hdGguY29zKGFuZ2xlKSoocmFkaXVzK01hdGguc2luKGFuZ2xlKjgpKjUpXG5cdFx0XHR2LnkgPSBNYXRoLnNpbihhbmdsZSkqKHJhZGl1cytNYXRoLnNpbihhbmdsZSo4KSo1KVxuXHRcdFx0di56ID0gMFxuXHRcdFx0YW5nbGUgKz0gYW5nbGVTdGVwXG5cdFx0XHRwLmZyYWdtZW50cy5wdXNoKHYpXG5cblx0XHRyZXR1cm5cblxuXHRjcmVhdGVQb3J0cmFpdFBvc2l0aW9uOigpPT5cblx0XHRwID0gQHBvc2l0aW9ucy5wb3J0cmFpdCA9IHtcblx0XHRcdGZyYWdtZW50czpbXSBcblx0XHRcdGRpYW1vbmQ6QGRpYW1vbmQucG9zaXRpb24uY2xvbmUoKVxuXHRcdFx0bWlycm9yOkBtaXJyb3IucG9zaXRpb24uY2xvbmUoKVxuXHRcdH1cblx0XHRmb3IgaSBpbiBbMC4uLjI0XSBieSAxXG5cdFx0XHR2ID0gQGZyYWdtZW50c1tpXS5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0XHR2LnggKj0gLjc1XG5cdFx0XHR2LnkgKj0gMS4zXG5cdFx0XHRwLmZyYWdtZW50cy5wdXNoKHYpXG5cdFx0cmV0dXJuXG5cblx0Y3JlYXRlTW9iaWxlUG9zaXRpb246KCk9PlxuXHRcdHAgPSBAcG9zaXRpb25zLm1vYmlsZSA9IHtcblx0XHRcdGZyYWdtZW50czpbXSBcblx0XHRcdGRpYW1vbmQ6QGRpYW1vbmQucG9zaXRpb24uY2xvbmUoKVxuXHRcdFx0bWlycm9yOkBtaXJyb3IucG9zaXRpb24uY2xvbmUoKVxuXHRcdH1cblx0XHRmb3IgaSBpbiBbMC4uLjI0XSBieSAxXG5cdFx0XHR2ID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuXHRcdFx0di54ID0gKDMwKigoaSsxKSUyKSktMTVcblx0XHRcdHYueSA9ICgxMi1NYXRoLmZsb29yKChpKS8yKSkqLTIwKzEwXG5cdFx0XHR2LnogPSAwXG5cdFx0XHRwLmZyYWdtZW50cy5wdXNoKHYpXG5cblx0XHRwLmRpYW1vbmQueSArPSAyMFxuXHRcdHAubWlycm9yLnkgKz0gMjBcblx0XHRyZXR1cm5cblxuXG5cdGFkZEV2ZW50OigpPT5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywoZSk9PlxuXHRcdFx0QG1vdXNlLnggPSAoZS5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGgpICogMiAtIDFcblx0XHRcdEBtb3VzZS55ID0gLShlLmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQpICogMiArIDFcblx0XHQsZmFsc2UpXG5cdFx0cmV0dXJuXG5cblx0b25EaWFtb25kTG9hZDooZ2VvbWV0cnkpPT5cblx0XHRAY29tcHV0ZUdlb21ldHJ5KGdlb21ldHJ5KVxuXG5cdFx0bWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IDB4ZmZmZmZmLCB0cmFuc3BhcmVudDp0cnVlLCBsaWdodDpmYWxzZSwgZW52TWFwOkBlbnZNYXAsIGRlcHRoV3JpdGU6dHJ1ZSwgZGVwdGhUZXN0OnRydWV9KVxuXHRcdFxuXHRcdG1hdGVyaWFsLm1hcCA9IEBtYXBcblx0XHRtYXRlcmlhbC5zaGFkaW5nID0gQHNoYWRpbmdcblx0XHRtYXRlcmlhbC5vcGFjaXR5ID0gLjY1XG5cdFx0bWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkRvdWJsZVNpZGVcblx0XHRtYXRlcmlhbC5jb21iaW5lID0gVEhSRUUuTWl4T3BlcmF0aW9uXG5cblx0XHRtYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpXG5cdFx0bWF0cml4Lm1ha2VTY2FsZSggLjIsIC4yLCAuMiApXG5cdFx0Z2VvbWV0cnkuYXBwbHlNYXRyaXggKCBtYXRyaXggKVxuXHRcdEBkaWFtb25kID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksbWF0ZXJpYWwpXG5cdFx0QGNvbnRhaW5lci5hZGQoQGRpYW1vbmQpXG5cblx0XHRmb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignZGlhbW9uZCcpXG5cdFx0Zm9sZGVyLmFkZChtYXRlcmlhbCwgJ2RlcHRoV3JpdGUnKVxuXHRcdGZvbGRlci5hZGQobWF0ZXJpYWwsICdkZXB0aFRlc3QnKVxuXHRcdGZvbGRlci5hZGQobWF0ZXJpYWwsICdvcGFjaXR5JywgMCwgMSlcblx0XHRmb2xkZXIuYWRkKG1hdGVyaWFsLCAncmVmbGVjdGl2aXR5JywwLDEpXG5cdFx0QGRpYW1vbmRDb2xvciA9IDB4ZmZmZmZmXG5cdFx0Zm9sZGVyLmFkZChAZGlhbW9uZC5tYXRlcmlhbCwgJ2NvbWJpbmUnLCB7bXVsdGlwbHk6VEhSRUUuTXVsdGlwbHksbWl4OlRIUkVFLk1peE9wZXJhdGlvbixhZGQ6VEhSRUUuQWRkT3BlcmF0aW9ufSlcblx0XHRmb2xkZXIuYWRkQ29sb3IoQCwgJ2RpYW1vbmRDb2xvcicpLm9uQ2hhbmdlKCgpPT5cblx0XHRcdEBkaWFtb25kLm1hdGVyaWFsLmNvbG9yLnNldEhleChAZGlhbW9uZENvbG9yKVxuXHRcdClcblxuXHRcdEBwb3NpdGlvbnMuYmFzZS5kaWFtb25kID0gQGRpYW1vbmQucG9zaXRpb24uY2xvbmUoKVxuXHRcdHJldHVyblxuXG5cdG9uTWlycm9yTG9hZDooZ2VvbWV0cnkpPT5cblx0XHRAY29tcHV0ZUdlb21ldHJ5KGdlb21ldHJ5KVxuXHRcdFxuXHRcdG1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KClcblx0XHRtYXRyaXgubWFrZVNjYWxlKCAuMiwgLjIsIC4yIClcblx0XHRnZW9tZXRyeS5hcHBseU1hdHJpeCAoIG1hdHJpeCApXG5cblx0XHRtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtjb2xvcjogMHhmZmZmZmYsIGxpZ2h0OmZhbHNlLCB0cmFuc3BhcmVudDp0cnVlLCBlbnZNYXA6QGVudk1hcCwgZGVwdGhXcml0ZTp0cnVlLCBkZXB0aFRlc3Q6dHJ1ZX0pXG5cdFx0bWF0ZXJpYWwubWFwID0gQG1hcFxuXHRcdG1hdGVyaWFsLnNoYWRpbmcgPSBAc2hhZGluZ1xuXHRcdG1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlXG5cdFx0bWF0ZXJpYWwuY29tYmluZSA9IFRIUkVFLkFkZE9wZXJhdGlvblxuXHRcdG1hdGVyaWFsLnJlZmxlY3Rpdml0eSA9IC40MVxuXHRcdG1hdGVyaWFsLm9wYWNpdHkgPSAwLjc3XG5cblx0XHRAbWlycm9yID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksbWF0ZXJpYWwpXG5cdFx0QGNvbnRhaW5lci5hZGQoQG1pcnJvcilcblxuXHRcdGZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdtaXJyb3InKVxuXHRcdGZvbGRlci5hZGQoQG1pcnJvci5tYXRlcmlhbCwgJ2RlcHRoV3JpdGUnKVxuXHRcdGZvbGRlci5hZGQoQG1pcnJvci5tYXRlcmlhbCwgJ2RlcHRoVGVzdCcpXG5cdFx0Zm9sZGVyLmFkZChAbWlycm9yLm1hdGVyaWFsLCAnb3BhY2l0eScsIDAsIDEpXG5cdFx0Zm9sZGVyLmFkZChAbWlycm9yLm1hdGVyaWFsLCAncmVmbGVjdGl2aXR5JywwLDEpXG5cblx0XHRAbWlycm9yQ29sb3IgPSAweGZmZmZmZlxuXHRcdGZvbGRlci5hZGQoQG1pcnJvci5tYXRlcmlhbCwgJ2NvbWJpbmUnLCB7bXVsdGlwbHk6VEhSRUUuTXVsdGlwbHksbWl4OlRIUkVFLk1peE9wZXJhdGlvbixhZGQ6VEhSRUUuQWRkT3BlcmF0aW9ufSlcblx0XHRmb2xkZXIuYWRkQ29sb3IoQCwgJ21pcnJvckNvbG9yJykub25DaGFuZ2UoKCk9PlxuXHRcdFx0QG1pcnJvci5tYXRlcmlhbC5jb2xvci5zZXRIZXgoQG1pcnJvckNvbG9yKVxuXHRcdClcblxuXHRcdEBwb3NpdGlvbnMuYmFzZS5taXJyb3IgPSBAbWlycm9yLnBvc2l0aW9uLmNsb25lKClcblx0XHRcblx0XHRyZXR1cm5cblxuXHRvbkZyYWdtZW50TG9hZGVkOihzY2VuZSk9PlxuXG5cdFx0QGZyYWdtZW50cyA9IFtdXG5cdFx0QGhpdGJveHMgPSBbXVxuXHRcdGhpdGJveEdlbyA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSg0KVxuXHRcdGhpdGJveE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjowLHdpcmVmcmFtZTp0cnVlLG9wYWNpdHk6LjMsdHJhbnNwYXJlbnQ6dHJ1ZX0pXG5cblx0XHRAYmFzZVBvc2l0aW9uID0gW11cblxuXHRcdGZvciBrLCB2IG9mIHNjZW5lLm9iamVjdHNcblxuXHRcdFx0byA9IHZcblx0XHRcdG8ubmFtZSA9IG8ubmFtZS5zdWJzdHJpbmcoby5uYW1lLmxlbmd0aC0yKVxuXG5cdFx0XHRAY29tcHV0ZUdlb21ldHJ5KG8uZ2VvbWV0cnkpXG5cdFx0XHRtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtjb2xvcjogMHhmZmZmZmYsIHRyYW5zcGFyZW50OnRydWUsIGVudk1hcDpAZW52TWFwLCBkZXB0aFdyaXRlOnRydWUsIGRlcHRoVGVzdDp0cnVlfSlcblx0XHRcdG1hdGVyaWFsLnNoYWRpbmcgPSBAc2hhZGluZ1xuXHRcdFx0bWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkRvdWJsZVNpZGVcblx0XHRcdG1hdGVyaWFsLmNvbWJpbmUgPSBUSFJFRS5BZGRPcGVyYXRpb25cblx0XHRcdG1hdGVyaWFsLnJlZmxlY3Rpdml0eSA9IC40MVxuXHRcdFx0bWF0ZXJpYWwub3BhY2l0eSA9IDAuOFxuXG5cdFx0XHRvLm1hdGVyaWFsID0gbWF0ZXJpYWxcblx0XHRcdG1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KClcblx0XHRcdG1hdHJpeC5tYWtlU2NhbGUoIC4yMywgLjIzLCAuMjMgKVxuXHRcdFx0by5nZW9tZXRyeS5hcHBseU1hdHJpeCggbWF0cml4IClcblx0XHRcdG8ucG9zaXRpb24ubXVsdGlwbHlTY2FsYXIoLjIxKVxuXHRcdFx0by5wb3NpdGlvbi55IC09IDIwXG5cdFx0XHRvLnBvc2l0aW9uLnogKz0gNVxuXHRcdFx0aWYgcGFyc2VJbnQoby5uYW1lKSA+IEBtYXhEYXRlXG5cdFx0XHRcdG8ubWF0ZXJpYWwub3BhY2l0eSA9IDAuM1xuXHRcdFx0IyBlbHNlXG5cdFx0XHQjIFx0bWF0ZXJpYWwubWFwID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZShcIi4vM2QvdGV4dHVyZXMvcHJldmlld1wiK28ubmFtZStcIi5qcGdcIilcblx0XHRcdFxuXHRcdFx0aGl0Ym94ID0gbmV3IFRIUkVFLk1lc2goaGl0Ym94R2VvLGhpdGJveE1hdGVyaWFsKVxuXHRcdFx0aGl0Ym94LnBvc2l0aW9uLmNvcHkoby5wb3NpdGlvbilcblx0XHRcdGhpdGJveC52aXNpYmxlID0gQGhpdGJveFZpc2libGVcblx0XHRcdGhpdGJveC5mcmFnbWVudCA9IG9cblx0XHRcdEBoaXRib3hzLnB1c2goaGl0Ym94KVxuXHRcdFx0U3RhZ2UzZC5hZGQoaGl0Ym94KVxuXG5cdFx0XHRAcG9zaXRpb25zLmJhc2UuZnJhZ21lbnRzLnB1c2goby5wb3NpdGlvbi5jbG9uZSgpKVxuXG5cdFx0XHRAY29tcHV0ZUdlb21ldHJ5KG8uZ2VvbWV0cnkpXG5cdFx0XHRAZnJhZ21lbnRzLnB1c2gobylcblx0XHRcdFN0YWdlM2QuYWRkKG8pXG5cdFx0XG5cdFx0Zm9yIGkgaW4gWzAuLi4yNF0gYnkgMVxuXHRcdFx0QGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0uY29weShAaGl0Ym94c1tpXS5wb3NpdGlvbilcblxuXHRcdEBwb3NpdGlvbiA9IEBiYXNlUG9zaXRpb25cblx0XHRAY3JlYXRlR3JpZHMxKClcblx0XHRAY3JlYXRlR3JpZHMyKClcblx0XHRAY3JlYXRlR3JpZHMzKClcblx0XHRAY3JlYXRlR3JpZHM0KClcblx0XHRAY3JlYXRlTW9iaWxlUG9zaXRpb24oKVxuXHRcdEBjcmVhdGVQb3J0cmFpdFBvc2l0aW9uKClcblx0XHRyZXR1cm5cblxuXHRjcmVhdGVHVUk6KCk9PlxuXHRcdEBndWkgPSBuZXcgZGF0LkdVSSgpXG5cdFx0QHRleHR1cmVzID0gbnVsbFxuXG5cdFx0QG1hcHMgPSBbXVxuXHRcdEBlbnZNYXBzID0gW11cblxuXHRcdGdsb2JhbCA9IEBndWkuYWRkRm9sZGVyKCdnbG9iYWwnKVxuXG5cdFx0QGdsb2JhbE9wYWNpdHkgPSAxXG5cdFx0Z2xvYmFsLmFkZChALCdnbG9iYWxPcGFjaXR5JywwLDEpLnN0ZXAoMC4wMSkub25DaGFuZ2UoKCk9PlxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlYmdsJykuc3R5bGUub3BhY2l0eSA9IEBnbG9iYWxPcGFjaXR5XG5cdFx0KVxuXG5cdFx0QGhpdGJveFZpc2libGUgPSBmYWxzZVxuXHRcdGdsb2JhbC5hZGQoQCwnb2Zmc2V0WCcsLTMwLDMwKS5zdGVwKDAuMSlcblxuXHRcdHBvc2l0aW9ucyA9IEBndWkuYWRkRm9sZGVyKCdwb3NpdGlvbnMnKVxuXHRcdHBvc2l0aW9ucy5hZGQoQCwnbm9HcmlkJylcblx0XHRwb3NpdGlvbnMuYWRkKEAsJ2dyaWQxJylcblx0XHRwb3NpdGlvbnMuYWRkKEAsJ2dyaWQyJylcblx0XHRwb3NpdGlvbnMuYWRkKEAsJ2dyaWQzJylcblx0XHRwb3NpdGlvbnMuYWRkKEAsJ2dyaWQ0Jylcblx0XHRwb3NpdGlvbnMuYWRkKEAsJ3BvcnRyYWl0Jylcblx0XHRwb3NpdGlvbnMuYWRkKEAsJ21vYmlsZScpXG5cblx0XHRmcmFnID0gQGd1aS5hZGRGb2xkZXIoJ2ZyYWdtZW50cycpXG5cdFx0QG1vdmVtZW50U2NhbGUgPSAxLjFcblx0XHRAc3BlZWRTY2FsZSA9IDAuMVxuXHRcdGZyYWcuYWRkKEAsJ21vdmVtZW50U2NhbGUnLDAsMilcblx0XHRmcmFnLmFkZChALCdzcGVlZFNjYWxlJywwLDIpXG5cdFx0ZnJhZy5hZGQoQCwnaGl0Ym94VmlzaWJsZScpLm9uQ2hhbmdlKChlKT0+XG5cdFx0XHRmb3IgaSBpbiBbMC4uLjI0XSBieSAxXG5cdFx0XHRcdEBoaXRib3hzW2ldLnZpc2libGUgPSBAaGl0Ym94VmlzaWJsZVxuXHRcdFx0XG5cdFx0KVxuXG5cdFx0IyBTdGFnZTNkLmluaXRQb3N0cHJvY2Vzc2luZyhAZ3VpKVxuXG5cdFx0cmV0dXJuXG5cblx0dHdlZW5UbzoocG9zaXRpb25zKS0+XG5cdFx0Zm9yIGkgaW4gWzAuLi4yNF0gYnkgMVxuXHRcdFx0diA9IEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldXG5cdFx0XHR2MiA9IHBvc2l0aW9ucy5mcmFnbWVudHNbaV1cblx0XHRcdFxuXHRcdFx0IyBkaWZmID0gdjIuY2xvbmUoKS5zdWIodilcblx0XHRcdFxuXHRcdFx0VHdlZW5MaXRlLnRvKHYsIC44K01hdGgucmFuZG9tKCkqLjMsIHt4OiB2Mi54LCB5OiB2Mi55LCB6OnYyLnosIGVhc2U6QmFjay5lYXNlT3V0fSlcblx0XHRUd2VlbkxpdGUudG8oQGN1cnJlbnRQb3NpdGlvbi5kaWFtb25kLDEuNCx7eDogcG9zaXRpb25zLmRpYW1vbmQueCwgeTogcG9zaXRpb25zLmRpYW1vbmQueSwgejpwb3NpdGlvbnMuZGlhbW9uZC56LCBlYXNlOkV4cG8uZWFzZU91dH0pXG5cdFx0VHdlZW5MaXRlLnRvKEBjdXJyZW50UG9zaXRpb24ubWlycm9yLDEuNCx7eDogcG9zaXRpb25zLm1pcnJvci54LCB5OiBwb3NpdGlvbnMubWlycm9yLnksIHo6cG9zaXRpb25zLm1pcnJvci56LCBlYXNlOkV4cG8uZWFzZU91dH0pXG5cdFx0cmV0dXJuXG5cblx0bm9HcmlkOigpLT5cblx0XHRAdHdlZW5UbyhAcG9zaXRpb25zLmJhc2UpXG5cdFx0cmV0dXJuXG5cblx0Z3JpZDE6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMuZ3JpZDEpXG5cdFx0cmV0dXJuXG5cblx0Z3JpZDI6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMuZ3JpZDIpXG5cdFx0cmV0dXJuXG5cblx0Z3JpZDM6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMuZ3JpZDMpXG5cdFx0cmV0dXJuXG5cblx0Z3JpZDQ6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMuZ3JpZDQpXG5cdFx0cmV0dXJuXG5cblx0cG9ydHJhaXQ6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMucG9ydHJhaXQpXG5cdFx0cmV0dXJuXG5cdFxuXHRtb2JpbGU6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMubW9iaWxlKVxuXHRcdHJldHVyblxuXG5cdGFkZFplcm86KG51bWJlcixtaW5MZW5ndGgpLT5cblx0XHRudW1iZXIgPSBudW1iZXIrXCJcIlxuXHRcdHdoaWxlKG51bWJlci5sZW5ndGg8bWluTGVuZ3RoKVxuXHRcdFx0bnVtYmVyID0gXCIwXCIrbnVtYmVyXG5cdFx0cmV0dXJuIG51bWJlclxuXG5cdGNvbXB1dGVHZW9tZXRyeTooZ2VvbWV0cnkpLT5cblx0XHQjIGNvbXB1dGUgdGhlIG1vZGVsXG5cdFx0Z2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKClcblx0XHRnZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKVxuXHRcdGdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKClcblx0XHRnZW9tZXRyeS5jb21wdXRlVGFuZ2VudHMoKVxuXHRcdGdlb21ldHJ5LmNvbXB1dGVNb3JwaE5vcm1hbHMoKVxuXHRcdGdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWVcblx0XHRnZW9tZXRyeS5ub3JtYWxzTmVlZFVwZGF0ZSA9IHRydWVcblx0XHRyZXR1cm5cblxuXHRzaG93WFA6KGluZGV4KS0+XG5cdFx0aWYoaW5kZXggPT0gQGN1cnJlbnRJbmRleCB8fCBwYXJzZUludChpbmRleCkgPiBAbWF4RGF0ZSlcblx0XHRcdHJldHVyblxuXHRcdEBjdXJyZW50SW5kZXggPSBpbmRleFxuXHRcdEBnbG9iYWxBbHBoYSA9IDAuMDFcblx0XHRyZXR1cm5cblxuXHRwYXVzZTooKS0+XG5cdFx0cmV0dXJuXG5cblx0cmVzdW1lOigpLT5cblx0XHRyZXR1cm5cblxuXHR1cGRhdGU6KGR0KS0+XG5cblx0XHRAdGltZSArPSBkdFxuXG5cdFx0aWYgKEBpc0ltZ1JlYWR5KVxuXHRcdFx0QGN0eC5nbG9iYWxBbHBoYSA9IEBnbG9iYWxBbHBoYVxuXHRcdFx0QGdsb2JhbEFscGhhICs9IC4wMVxuXHRcdFx0XG5cdFx0XHRpZHggPSBwYXJzZUludCggQGN1cnJlbnRJbmRleCApIC0gMVxuXHRcdFx0aWYgaWR4IDw9IDE0XG5cdFx0XHRcdEBjdHguZHJhd0ltYWdlKEBpbWFnZXNbaWR4XSwwLDApXG5cdFx0XHRcdEBtYXAubmVlZHNVcGRhdGUgPSB0cnVlXG5cdFx0XHRcdEBlbnZNYXAubmVlZHNVcGRhdGUgPSB0cnVlXG5cblx0XHR2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMyggQG1vdXNlLngsIEBtb3VzZS55LCAuNSApXG5cdFx0dmVjdG9yLnVucHJvamVjdCggU3RhZ2UzZC5jYW1lcmEgKVxuXHRcdHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIoIFN0YWdlM2QuY2FtZXJhLnBvc2l0aW9uLCB2ZWN0b3Iuc3ViKCBTdGFnZTNkLmNhbWVyYS5wb3NpdGlvbiApLm5vcm1hbGl6ZSgpIClcblx0XHR0ID0gQHRpbWVcblxuXHRcdGlmKEBkaWFtb25kICYmIEBjdXJyZW50UG9zaXRpb24uZGlhbW9uZClcblx0XHRcdEBkaWFtb25kLnBvc2l0aW9uLmNvcHkoQGN1cnJlbnRQb3NpdGlvbi5kaWFtb25kKVxuXHRcdFx0QGRpYW1vbmQucG9zaXRpb24ueCArPSBAb2Zmc2V0WFxuXHRcblx0XHRpZihAbWlycm9yICYmIEBjdXJyZW50UG9zaXRpb24ubWlycm9yKVxuXHRcdFx0QG1pcnJvci5wb3NpdGlvbi5jb3B5KEBjdXJyZW50UG9zaXRpb24ubWlycm9yKVxuXHRcdFx0QG1pcnJvci5wb3NpdGlvbi54ICs9IEBvZmZzZXRYXG5cblx0XHRpZihAbWlycm9yICYmIEBkaWFtb25kKVxuXHRcdFx0cyA9IDEgKyBNYXRoLmNvcyh0LzEyNTApKi4wMlxuXHRcdFx0QGRpYW1vbmQuc2NhbGUuc2V0KHMscyxzKVxuXHRcdFx0QGRpYW1vbmQucG9zaXRpb24ueSArPSBNYXRoLnNpbih0LzE1MDApKi41XG5cdFx0XHRAbWlycm9yLnNjYWxlLnNldChzLHMscylcblx0XHRcdEBtaXJyb3IucG9zaXRpb24ueSArPSBNYXRoLnNpbih0LzE1MDApKi41XG5cblx0XHRmb3IgaSBpbiBbMC4uLkBoaXRib3hzLmxlbmd0aF0gYnkgMVxuXHRcdFx0ZGlzdGFuY2UgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG5cdFx0XHRkeCA9IEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldLnggLSBAZGlhbW9uZC5wb3NpdGlvbi54XG5cdFx0XHRkeSA9IEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldLnkgLSBAZGlhbW9uZC5wb3NpdGlvbi55XG5cdFx0XHRkeiA9IEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldLnogLSBAZGlhbW9uZC5wb3NpdGlvbi56XG5cdFx0XHRkaXN0YW5jZS5zZXQoTWF0aC5zcXJ0KGR4KmR4KSxNYXRoLnNxcnQoZHkqZHkpLE1hdGguc3FydChkeipkeikpXG5cdFx0XHQjIEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldLnogPVxuXHRcdFx0QGhpdGJveHNbaV0ucG9zaXRpb24uY29weShAY3VycmVudFBvc2l0aW9uLmZyYWdtZW50c1tpXSApXG5cdFx0XHRpZihkaXN0YW5jZS54IDwgMTcuNSlcblx0XHRcdFx0QGhpdGJveHNbaV0ucG9zaXRpb24ueiA9IE1hdGgubWF4KEBoaXRib3hzW2ldLnBvc2l0aW9uLnosMTQpXG5cdFx0XHRlbHNlIGlmKGRpc3RhbmNlLnggPCAyOSlcblx0XHRcdFx0QGhpdGJveHNbaV0ucG9zaXRpb24ueiA9IE1hdGgubWF4KEBoaXRib3hzW2ldLnBvc2l0aW9uLnosKDEtKGRpc3RhbmNlLngtMTQpLzE1KSoxNCsyKVxuXHRcdFx0IyBAaGl0Ym94c1tpXS5wb3NpdGlvbi54ICs9IChAY3VycmVudFBvc2l0aW9uLmZyYWdtZW50c1tpXS54IC0gQGhpdGJveHNbaV0ucG9zaXRpb24ueCkqLjA1XG5cdFx0XHQjIEBoaXRib3hzW2ldLnBvc2l0aW9uLnkgKz0gKEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldLnkgLSBAaGl0Ym94c1tpXS5wb3NpdGlvbi55KSouMDVcblx0XHRcdCMgQGhpdGJveHNbaV0ucG9zaXRpb24ueiArPSAoQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0ueiAtIEBoaXRib3hzW2ldLnBvc2l0aW9uLnopKi4wNVxuXHRcdFx0QGhpdGJveHNbaV0ucG9zaXRpb24ueCArPSBAb2Zmc2V0WFxuXG5cdFx0dCA9IEB0aW1lXG5cdFx0Zm9yIGkgaW4gWzAuLi5AZnJhZ21lbnRzLmxlbmd0aF0gYnkgMVxuXHRcdFx0dCs9NzQ3XG5cdFx0XHRAZnJhZ21lbnRzW2ldLnBvc2l0aW9uLnkgPSBAaGl0Ym94c1tpXS5wb3NpdGlvbi55K01hdGguc2luKHQvMzUwKkBzcGVlZFNjYWxlKSoxLjEqQG1vdmVtZW50U2NhbGVcblx0XHRcdEBmcmFnbWVudHNbaV0ucG9zaXRpb24ueCA9IEBoaXRib3hzW2ldLnBvc2l0aW9uLngrTWF0aC5jb3ModC80NTAqQHNwZWVkU2NhbGUpKi41KkBtb3ZlbWVudFNjYWxlXG5cdFx0XHRAZnJhZ21lbnRzW2ldLnBvc2l0aW9uLnogPSBAaGl0Ym94c1tpXS5wb3NpdGlvbi56XG5cdFx0XG5cdFx0aWYoQGhpdGJveHMpXG5cdFx0XHRpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMoIEBoaXRib3hzLCBmYWxzZSApXG5cdFx0XHRpZiggaW50ZXJzZWN0cy5sZW5ndGggPiAwIClcblx0XHRcdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcidcblx0XHRcdFx0ZnJhZyA9IGludGVyc2VjdHNbMF0ub2JqZWN0LmZyYWdtZW50XG5cdFx0XHRcdEBjdXJyZW50RnJhZ21lbnQgPSBmcmFnXG5cdFx0XHRcdEBzaG93WFAoZnJhZy5uYW1lKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICdhdXRvJ1xuXHRcdFx0XHRAY3VycmVudEZyYWdtZW50ID0gbnVsbFxuXG5cdFx0aWYgQGN1cnJlbnRGcmFnbWVudFxuXHRcdFx0QGN1cnJlbnRGcmFnbWVudC5zY2FsZS54ICs9ICgxLjQtQGN1cnJlbnRGcmFnbWVudC5zY2FsZS54KSouMDVcblx0XHRcdEBjdXJyZW50RnJhZ21lbnQuc2NhbGUueSA9IEBjdXJyZW50RnJhZ21lbnQuc2NhbGUueFxuXHRcdFx0QGN1cnJlbnRGcmFnbWVudC5zY2FsZS56ID0gQGN1cnJlbnRGcmFnbWVudC5zY2FsZS54XG5cblx0XHRmb3IgaSBpbiBbMC4uLkBmcmFnbWVudHMubGVuZ3RoXSBieSAxXG5cdFx0XHRmID0gQGZyYWdtZW50c1tpXVxuXHRcdFx0aWYgZiAhPSBAY3VycmVudEZyYWdtZW50XG5cdFx0XHRcdGYuc2NhbGUueCArPSAoMS1mLnNjYWxlLngpKi4wOVxuXHRcdFx0XHRmLnNjYWxlLnkgPSBmLnNjYWxlLnhcblx0XHRcdFx0Zi5zY2FsZS56ID0gZi5zY2FsZS54XG5cblx0XHQjIEBjYW1lcmFMaWdodC5wb3NpdGlvbi54ID0gTWF0aC5jb3MoQHRpbWUqMC4wMDEpKjEwMFxuXHRcdCMgQGNhbWVyYUxpZ2h0Mi5wb3NpdGlvbi54ID0gTWF0aC5jb3MoQHRpbWUqMC4wMDE1KSoxMjBcblx0XHQjIEBjYW1lcmFMaWdodDIucG9zaXRpb24ueSA9IE1hdGguc2luKEB0aW1lKjAuMDAxNSkqMTIwXG5cdFx0IyBAY29udGFpbmVyLnJvdGF0aW9uLnkgKz0gKEBtb3VzZS54Kk1hdGguUEkvMTYgLSBAY29udGFpbmVyLnJvdGF0aW9uLnkpKi4wOVxuXHRcdCMgQGNvbnRhaW5lci5yb3RhdGlvbi54ICs9ICgtQG1vdXNlLnkqTWF0aC5QSS8xNiAtIEBjb250YWluZXIucm90YXRpb24ueCkqLjA5XG5cblx0XHRpZihAYmFja2dyb3VuZEdlb21ldHJ5KVxuXHRcdFx0Z2VvbWV0cnkgPSAgQGJhY2tncm91bmRHZW9tZXRyeVxuXHRcdFx0c3BlZWRzID0gWzgwMCw3MDAsMTIwMF1cblx0XHRcdGZvciBpIGluIFswLi4uZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoXSBieSAxXG5cdFx0XHRcdHYgPSBnZW9tZXRyeS52ZXJ0aWNlc1tpXVxuXHRcdFx0XHR2LnogKz0gTWF0aC5jb3MoQHRpbWUvc3BlZWRzW2klc3BlZWRzLmxlbmd0aF0rTWF0aC5QSS8xNippKSoyXG5cdFx0XHQjIGZvciBpIGluIFsxLi4uZ2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheS5sZW5ndGhdIGJ5IDNcblx0XHRcdCMgXHRnZW9tZXRyeS5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5W2krMl0gKz0gTWF0aC5jb3MoQHRpbWUvc3BlZWRzWyhpLzMpJXNwZWVkcy5sZW5ndGhdK01hdGguUEkvMTYqaSkqMlxuXHRcdFx0IyBnZW9tZXRyeS5hdHRyaWJ1dGVzLnBvc2l0aW9ubmVlZHNVcGRhdGUgPSB0cnVlXG5cdFx0XHQjIGdlb21ldHJ5LmF0dHJpYnV0ZXMubm9ybWFsLm5lZWRzVXBkYXRlID0gdHJ1ZVxuXHRcdFx0IyBnZW9tZXRyeS5ub3JtYWxpemVOb3JtYWxzKClcblx0XHRcdGdlb21ldHJ5LmNvbXB1dGVUYW5nZW50cygpO1xuXHRcdFx0Z2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKVxuXHRcdFx0Z2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKClcblx0XHRcdGdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKClcblx0XHRcdGdlb21ldHJ5LmNvbXB1dGVUYW5nZW50cygpXG5cdFx0XHRnZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlXG5cdFx0XHRnZW9tZXRyeS5ub3JtYWxzTmVlZFVwZGF0ZSA9IHRydWVcblx0XHRcdGdlb21ldHJ5LmVsZW1lbnRzTmVlZFVwZGF0ZSA9IHRydWU7XG5cdFx0XHRnZW9tZXRyeS50YW5nZW50c05lZWRVcGRhdGUgPSB0cnVlO1xuXG5cdFx0U3RhZ2UzZC5jYW1lcmEucG9zaXRpb24ueCArPSAoQG1vdXNlLngqMzAgLSBTdGFnZTNkLmNhbWVyYS5wb3NpdGlvbi54KSouMDNcblx0XHRcblx0XHQjIFN0YWdlM2QuY2FtZXJhLnBvc2l0aW9uLnkgKz0gKEBtb3VzZS55KjIrMjAgLSBTdGFnZTNkLmNhbWVyYS5wb3NpdGlvbi55KSouMDNcblx0XHQjIEBjb250YWluZXIucm90YXRpb24ueCArPSAoQG1vdXNlLnkqTWF0aC5QSS8xNiAtIEBjb250YWluZXIucm90YXRpb24ueCkqLjAzXG5cdFx0IyBAbGlnaHRDb250YWluZXIucm90YXRpb24ueCArPSAoQG1vdXNlLnkqTWF0aC5QSS8xNiAtIEBjb250YWluZXIucm90YXRpb24ueCkqLjAzXG5cdFx0cmV0dXJuXG4iXX0=