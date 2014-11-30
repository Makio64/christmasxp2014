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
    this.debug = false;
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

  MainScene.prototype.createParticles = function() {};

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

  return MainScene;

})(Scene);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNocmlzdG1hc3hwL3NjZW5lcy9NYWluU2NlbmUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsU0FBQTtFQUFBOztpU0FBQTs7QUFBQTtBQUVDLDhCQUFBLENBQUE7O0FBQVksRUFBQSxtQkFBQSxHQUFBO0FBRVgsaURBQUEsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSx1RUFBQSxDQUFBO0FBQUEsMkVBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEsdURBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEsbURBQUEsQ0FBQTtBQUFBLHlEQUFBLENBQUE7QUFBQSxRQUFBLEtBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FBWCxDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLEtBRGQsQ0FBQTtBQUFBLElBRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUZULENBQUE7QUFBQSxJQUlBLElBQUMsQ0FBQSxZQUFELEdBQWdCLENBSmhCLENBQUE7QUFBQSxJQU1BLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFLLENBQUMsT0FBTixDQUFjLENBQWQsRUFBZ0IsQ0FBaEIsQ0FOYixDQUFBO0FBQUEsSUFPQSxJQUFDLENBQUEsSUFBRCxHQUFRLENBUFIsQ0FBQTtBQUFBLElBUUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQVJWLENBQUE7QUFBQSxJQVNBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FBSyxDQUFDLFdBVGpCLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxPQUFELEdBQVcsQ0FWWCxDQUFBO0FBQUEsSUFXQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBWGIsQ0FBQTtB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QUFBLE1BYUEsUUFBUSxDQUFDLG9CQUFULENBQUEsQ0FiQSxDQUFBO0FBQUEsTUFjQSxRQUFRLENBQUMsa0JBQVQsQ0FBQSxDQWRBLENBQUE7QUFBQSxNQWVBLFFBQVEsQ0FBQyxvQkFBVCxDQUFBLENBZkEsQ0FBQTtBQUFBLE1BZ0JBLFFBQVEsQ0FBQyxlQUFULENBQUEsQ0FoQkEsQ0FBQTtBQUFBLE1BaUJBLFFBQVEsQ0FBQyxrQkFBVCxHQUE4QixJQWpCOUIsQ0FBQTtBQUFBLE1Ba0JBLFFBQVEsQ0FBQyxpQkFBVCxHQUE2QixJQWxCN0IsQ0FBQTtBQUFBLE1BbUJBLFFBQVEsQ0FBQyxrQkFBVCxHQUE4QixJQW5COUIsQ0FBQTtBQUFBLE1Bb0JBLFFBQVEsQ0FBQyxrQkFBVCxHQUE4QixJQXBCOUIsQ0FERDtLQXJGQTtBQUFBLElBNEdBLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQXhCLElBQTZCLENBQUMsSUFBQyxDQUFBLEtBQUssQ0FBQyxDQUFQLEdBQVMsRUFBVCxHQUFjLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQXZDLENBQUEsR0FBMEMsR0E1R3ZFLENBRk07RUFBQSxDQXJpQlAsQ0FBQTs7bUJBQUE7O0dBRnVCLE1BQXhCLENBQUEiLCJmaWxlIjoiY2hyaXN0bWFzeHAvc2NlbmVzL01haW5TY2VuZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1haW5TY2VuZSBleHRlbmRzIFNjZW5lXG5cblx0Y29uc3RydWN0b3I6KCktPlxuXG5cdFx0QGlzUmVhZHkgPSBmYWxzZVxuXHRcdEBpc0ltZ1JlYWR5ID0gZmFsc2Vcblx0XHRAZGVidWcgPSBmYWxzZVxuXG5cdFx0QGN1cnJlbnRJbmRleCA9IDFcblxuXHRcdEBtb3VzZSA9IG5ldyBUSFJFRS5WZWN0b3IyKDAsMClcblx0XHRAdGltZSA9IDBcblx0XHRAdXNlTWFwID0gdHJ1ZVxuXHRcdEBzaGFkaW5nID0gVEhSRUUuRmxhdFNoYWRpbmdcblx0XHRAb3BhY2l0eSA9IDFcblx0XHRAZnJhZ21lbnRzID0gW11cblx0XHRAaGl0Ym94cyA9IFtdXG5cdFx0QG1heERhdGUgPSAxM1xuXHRcdEBwb3NpdGlvbnMgPSB7fTtcblx0XHRAcG9zaXRpb25zLmJhc2UgPSB7XG5cdFx0XHRmcmFnbWVudHMgOiBbXVxuXHRcdFx0ZGlhbW9uZCA6IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRcdG1pcnJvciA6IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHR9XG5cblx0XHRAb2Zmc2V0WCA9IDBcblxuXHRcdEBjdXJyZW50UG9zaXRpb24gPSB7XG5cdFx0XHRmcmFnbWVudHMgOiBbXVxuXHRcdFx0ZGlhbW9uZCA6IG51bGxcblx0XHRcdG1pcnJvciA6IG51bGxcblx0XHR9XG5cblx0XHRAaW1hZ2VzID0gW11cblxuXHRcdGZvciBpIGluIFswLi4uMjRdIGJ5IDFcblx0XHRcdEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuXHRcdEBjdXJyZW50UG9zaXRpb24uZGlhbW9uZCA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRAY3VycmVudFBvc2l0aW9uLm1pcnJvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblxuXHRcdEBjb250YWluZXIgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblx0XHRTdGFnZTNkLmFkZChAY29udGFpbmVyLGZhbHNlKVxuXG5cdFx0QGxpZ2h0Q29udGFpbmVyID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cdFx0QGNvbnRhaW5lci5hZGQoQGxpZ2h0Q29udGFpbmVyKVxuXG5cdFx0QGNyZWF0ZUxpZ2h0KClcblx0XHRAY3JlYXRlQmFja2dyb3VuZCgpXG5cdFx0QGNyZWF0ZUNpcmNsZXMoKVxuXHRcdEBhZGRFdmVudCgpXG5cdFx0QGxvYWRJbWFnZXNMb3coKVxuXHRcdFxuXHRcdHJldHVyblxuXG5cblx0Y3JlYXRlQ2FudmFzOigpLT5cblx0XHRAY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcblx0XHRAY2FudmFzLndpZHRoID0gNjRcblx0XHRAY2FudmFzLmhlaWdodCA9IDY0XG5cdFx0QGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuXHRcdEBtYXAgPSBuZXcgVEhSRUUuVGV4dHVyZSggQGNhbnZhcywgVEhSRUUuVVZNYXBwaW5nLCBUSFJFRS5DbGFtcFRvRWRnZVdyYXBwaW5nLCBUSFJFRS5DbGFtcFRvRWRnZVdyYXBwaW5nLCBUSFJFRS5MaW5lYXJGaWx0ZXIsIFRIUkVFLkxpbmVhck1pcE1hcExpbmVhckZpbHRlciwgVEhSRUUuUkdCRm9ybWF0LCBUSFJFRS5VbnNpZ25lZEJ5dGVUeXBlLCAxIClcblx0XHRAZW52TWFwID0gbmV3IFRIUkVFLlRleHR1cmUoIFtAY2FudmFzLEBjYW52YXMsQGNhbnZhcyxAY2FudmFzLEBjYW52YXMsQGNhbnZhc10sIFRIUkVFLkN1YmVSZWZyYWN0aW9uTWFwcGluZywgVEhSRUUuQ2xhbXBUb0VkZ2VXcmFwcGluZywgVEhSRUUuQ2xhbXBUb0VkZ2VXcmFwcGluZywgVEhSRUUuTGluZWFyRmlsdGVyLCBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXIsIFRIUkVFLlJHQkZvcm1hdCwgVEhSRUUuVW5zaWduZWRCeXRlVHlwZSwgMSApXG5cdFx0cmV0dXJuXG5cblx0bG9hZEltYWdlc0xvdzooKT0+XG5cdFx0QGF0bGFzID0gbmV3IEltYWdlKClcblx0XHRAYXRsYXMub25sb2FkID0gKCk9PlxuXHRcdFx0QHBhcnNlQXRsYXMoKVxuXHRcdFx0QGNyZWF0ZUNhbnZhcygpXG5cdFx0XHRAbG9hZE1lc2goKVxuXHRcdFx0QGNyZWF0ZUdVSSgpXG5cdFx0XHRAbG9hZEltYWdlc0hpZ2h0KClcblx0XHRAYXRsYXMuc3JjID0gJy4vM2QvdGV4dHVyZXMvYXRsYXNfbG93XzUxMi5qcGcnXG5cdFx0cmV0dXJuXG5cblx0cGFyc2VBdGxhczooKT0+XG5cdFx0c2l6ZSA9IEBhdGxhcy53aWR0aC84XG5cdFx0Zm9yIHkgaW4gWzAuLi44XSBieSAxXG5cdFx0XHRmb3IgeCBpbiBbMC4uLjhdIGJ5IDFcblx0XHRcdFx0ayA9IHgreSo4XG5cdFx0XHRcdGlmIGs+PTI0XG5cdFx0XHRcdFx0QGlzSW1nUmVhZHkgPSB0cnVlXG5cdFx0XHRcdFx0aWYoQGNhbnZhcylcblx0XHRcdFx0XHRcdEBjYW52YXMud2lkdGggPSBzaXplXG5cdFx0XHRcdFx0XHRAY2FudmFzLmhlaWdodCA9IHNpemVcblx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0XHRjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxuXHRcdFx0XHRjYW52YXMud2lkdGggPSBzaXplXG5cdFx0XHRcdGNhbnZhcy5oZWlnaHQgPSBzaXplXG5cdFx0XHRcdGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cdFx0XHRcdGN0eC5kcmF3SW1hZ2UoQGF0bGFzLHgqc2l6ZSx5KnNpemUsc2l6ZSxzaXplLDAsMCxzaXplLHNpemUpXG5cdFx0XHRcdEBpbWFnZXNba10gPSBjYW52YXNcblx0XHRcdFx0IyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcylcblx0XHRyZXR1cm5cblxuXHRsb2FkSW1hZ2VzSGlnaHQ6KCk9PlxuXHRcdEBhdGxhcyA9IG5ldyBJbWFnZSgpXG5cdFx0QGF0bGFzLm9ubG9hZCA9ICgpPT5cblx0XHRcdEBwYXJzZUF0bGFzKClcblx0XHRAYXRsYXMuc3JjID0gJy4vM2QvdGV4dHVyZXMvYXRsYXNfbG93XzIwNDguanBnJ1xuXHRcdHJldHVyblxuXG5cdGxvYWRNZXNoOigpPT5cblxuXHRcdGxvYWRlciA9IG5ldyBUSFJFRS5KU09OTG9hZGVyKClcblx0XHRsb2FkZXIubG9hZCggJy4vM2QvanNvbi9jcnlzdGFsLmpzJywgQG9uRGlhbW9uZExvYWQgKVxuXG5cdFx0bG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIoKVxuXHRcdGxvYWRlci5sb2FkKCAnLi8zZC9qc29uL21pcnJvci5qcycsIEBvbk1pcnJvckxvYWQgKVxuXHRcdFxuXHRcdGxvYWRlciA9IG5ldyBUSFJFRS5TY2VuZUxvYWRlcigpXG5cdFx0bG9hZGVyLmxvYWQoICcuLzNkL2pzb24vZnJhZ21lbnRzLmpzJywgQG9uRnJhZ21lbnRMb2FkZWQgKVxuXHRcdHJldHVyblxuXG5cdGNyZWF0ZUJhY2tncm91bmQ6KCk9PlxuXHRcdG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyB3aXJlZnJhbWU6ZmFsc2UsY29sb3I6MHhGRkZGRkZ9KVxuXHRcdG1hdGVyaWFsLnNoYWRpbmcgPSBUSFJFRS5GbGF0U2hhZGluZ1xuXG5cdFx0Z2VvbWV0cnkgPSAgbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoNzAwMCwgNzAwMCwgOCwgOClcblx0XHRmb3IgaSBpbiBbMC4uLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aF0gYnkgMVxuXHRcdFx0diA9IGdlb21ldHJ5LnZlcnRpY2VzW2ldXG5cdFx0XHR2LnggKz0gKDEqTWF0aC5yYW5kb20oKS0uNSkqMzAwXG5cdFx0XHR2LnkgKz0gKDEqTWF0aC5yYW5kb20oKS0uNSkqMzAwXG5cdFx0XHR2LnogKz0gKDEqTWF0aC5yYW5kb20oKS0uNSkqMzAwXG5cdFx0Z2VvbWV0cnkuY29tcHV0ZVRhbmdlbnRzKCk7XG5cdFx0Z2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKVxuXHRcdGdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpXG5cdFx0IyBnZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKVxuXHRcdGdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKClcblx0XHRnZW9tZXRyeS5jb21wdXRlVGFuZ2VudHMoKVxuXHRcdCMgZ2VvbWV0cnkuY29tcHV0ZU1vcnBoTm9ybWFscygpXG5cdFx0Z2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZVxuXHRcdGdlb21ldHJ5Lm5vcm1hbHNOZWVkVXBkYXRlID0gdHJ1ZVxuXHRcdGdlb21ldHJ5LmVsZW1lbnRzTmVlZFVwZGF0ZSA9IHRydWU7XG5cdFx0Z2VvbWV0cnkudGFuZ2VudHNOZWVkVXBkYXRlID0gdHJ1ZTtcblxuXHRcdCMgYnVmZmVyR2VvbWV0cnkgPSBUSFJFRS5CdWZmZXJHZW9tZXRyeS5mcm9tR2VvbWV0cnkoZ2VvbWV0cnkpXG5cdFx0IyBidWZmZXJHZW9tZXRyeS5hdHRyaWJ1dGVzLnBvc2l0aW9ubmVlZHNVcGRhdGUgPSB0cnVlXG5cdFx0IyBidWZmZXJHZW9tZXRyeS5hdHRyaWJ1dGVzLm5vcm1hbC5uZWVkc1VwZGF0ZSA9IHRydWVcblx0XHQjIGJ1ZmZlckdlb21ldHJ5Lm5vcm1hbGl6ZU5vcm1hbHMoKVxuXHRcdCMgYnVmZmVyR2VvbWV0cnkgPSBnZW9tZXRyeVxuXG5cdFx0bWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbClcblx0XHRtZXNoLnBvc2l0aW9uLnogPSAtMTAwMFxuXHRcdFN0YWdlM2QuYWRkKG1lc2gpXG5cblx0XHRtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IHdpcmVmcmFtZTp0cnVlLGNvbG9yOjAsdHJhbnNwYXJlbnQ6dHJ1ZSxvcGFjaXR5Oi4xfSlcblx0XHRtYXRlcmlhbC5zaGFkaW5nID0gVEhSRUUuRmxhdFNoYWRpbmdcblx0XHRtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKVxuXHRcdG1lc2gucG9zaXRpb24ueiA9IC05NTBcblx0XHRtZXNoLnBvc2l0aW9uLnkgKz0gMTBcblx0XHRTdGFnZTNkLmFkZChtZXNoKVxuXG5cdFx0QGJhY2tncm91bmRHZW9tZXRyeSA9IGdlb21ldHJ5XG5cblx0XHRyZXR1cm5cblxuXHRjcmVhdGVDaXJjbGVzOigpLT5cblx0XHRpbWFnZSA9IG5ldyBJbWFnZSgpXG5cdFx0aW1hZ2Uub25sb2FkID0gKCk9PlxuXHRcdFx0IyBub3Qgd29ya2luZyB0aGlzIHdheS4uIHRvZG86IG5vdCB1c2UgSW1hZ2VVdGlsc1xuXHRcdFx0IyBtYXAgPSBuZXcgVEhSRUUuVGV4dHVyZSggaW1hZ2UgKVxuXHRcdFx0bWFwID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSgnLi8zZC90ZXh0dXJlcy9jaXJjbGUucG5nJylcblx0XHRcdEBidWZmZXJHZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpXG5cdFx0XHRAYnVmZmVyR2VvbWV0cnkuZnJvbUdlb21ldHJ5KEBiYWNrZ3JvdW5kR2VvbWV0cnkpXG5cdFx0XHRtYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludENsb3VkTWF0ZXJpYWwoe2RlcHRoVGVzdDpmYWxzZSx0cmFuc3BhcmVudDp0cnVlLCBtYXA6bWFwLCBjb2xvcjoweEZGRkZGRixzaXplOjY0LHNpemVBdHRlbnVhdGlvbjp0cnVlLGZvZzpmYWxzZX0pXG5cdFx0XHRjb25zb2xlLmxvZyhtYXRlcmlhbClcblx0XHRcdEBwb2ludGNsb3VkID0gbmV3IFRIUkVFLlBvaW50Q2xvdWQoQGJ1ZmZlckdlb21ldHJ5LG1hdGVyaWFsKVxuXHRcdFx0QHBvaW50Y2xvdWQucG9zaXRpb24ueiAtPSA5NDUuOTk5XG5cdFx0XHRAcG9pbnRjbG91ZC5wb3NpdGlvbi55ICs9IDEwXG5cdFx0XHRAY29udGFpbmVyLmFkZChAcG9pbnRjbG91ZClcblx0XHRpbWFnZS5zcmMgPSAnLi8zZC90ZXh0dXJlcy9jaXJjbGUucG5nJ1xuXHRcdHJldHVyblxuXG5cdGNyZWF0ZVBhcnRpY2xlczooKS0+XG5cdFx0cmV0dXJuXG5cblx0Y3JlYXRlTGlnaHQ6KCk9PlxuXHRcdEBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4MzMzMzMzKVxuXHRcdEBhbWJpZW50TGlnaHQyID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweEZGRkZGRilcblx0XHRcblx0XHRAY2FtZXJhTGlnaHQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDIyMTE5OSwgMiwgMjAwMClcblx0XHRAY2FtZXJhTGlnaHQucG9zaXRpb24uc2V0KCAwLCAtMTAwMCwgMCApO1xuXG5cdFx0QGNhbWVyYUxpZ2h0MyA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4MjIzM0FBLCAyLCAyNDAwKVxuXHRcdEBjYW1lcmFMaWdodDMucG9zaXRpb24uc2V0KCAxMDAwLCAwLCAwICk7XG5cblx0XHRAY2FtZXJhTGlnaHQyID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgyMjExQUEsIDEsIDI0MDApXG5cdFx0QGNhbWVyYUxpZ2h0Mi5wb3NpdGlvbi5zZXQoIC0xNTAwLCAwLCAwICk7XG5cblx0XHRAY2FtZXJhTGlnaHQ0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgyMjIyNzcsIDIsIDI0MDApXG5cdFx0QGNhbWVyYUxpZ2h0NC5wb3NpdGlvbi5zZXQoIDAsIDEwMDAsIDAgKTtcblxuXHRcdEBjYW1lcmFMaWdodDUgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweEZGRkZGRiwgMSwgMjAwKVxuXHRcdEBjYW1lcmFMaWdodDUucG9zaXRpb24uc2V0KCAwLCAwLCAwICk7XG5cblx0XHRTdGFnZTNkLmFkZChAYW1iaWVudExpZ2h0KVxuXHRcdFN0YWdlM2QuYWRkKEBjYW1lcmFMaWdodClcblx0XHRTdGFnZTNkLmFkZChAY2FtZXJhTGlnaHQzKVxuXHRcdFN0YWdlM2QuYWRkKEBjYW1lcmFMaWdodDIpXG5cdFx0U3RhZ2UzZC5hZGQoQGNhbWVyYUxpZ2h0NClcblx0XHRTdGFnZTNkLmFkZChAY2FtZXJhTGlnaHQ1KVxuXG5cdFx0U3RhZ2UzZC5hZGQoQGFtYmllbnRMaWdodDIsZmFsc2UpXG5cblx0XHRyZXR1cm5cblxuXHRjcmVhdGVHcmlkczE6KCk9PlxuXHRcdHAgPSBAcG9zaXRpb25zLmdyaWQxID0ge1xuXHRcdFx0ZnJhZ21lbnRzOltdIFxuXHRcdFx0ZGlhbW9uZDpAZGlhbW9uZC5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0XHRtaXJyb3I6QG1pcnJvci5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0fVxuXHRcdGZvciBpIGluIFswLi4uMjRdIGJ5IDFcblx0XHRcdHYgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG5cdFx0XHR2LnggPSAoLTgqKChpKzEpJTUpKVxuXHRcdFx0di55ID0gTWF0aC5mbG9vcigoaSsxKS81KSo4LTE2LjVcblx0XHRcdHYueiA9IDBcblx0XHRcdHAuZnJhZ21lbnRzLnB1c2godilcblxuXHRcdHAuZGlhbW9uZC54ICs9IDIwXG5cdFx0cC5taXJyb3IueCArPSAyMFxuXHRcdHJldHVyblxuXG5cdGNyZWF0ZUdyaWRzMjooKT0+XG5cdFx0cCA9IEBwb3NpdGlvbnMuZ3JpZDIgPSB7XG5cdFx0XHRmcmFnbWVudHM6W10gXG5cdFx0XHRkaWFtb25kOkBkaWFtb25kLnBvc2l0aW9uLmNsb25lKClcblx0XHRcdG1pcnJvcjpAbWlycm9yLnBvc2l0aW9uLmNsb25lKClcblx0XHR9XG5cdFx0Zm9yIGkgaW4gWzAuLi4yNF0gYnkgMVxuXHRcdFx0diA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRcdHYueCA9ICgtOCooaSU4KSkrMjhcblx0XHRcdHYueSA9IE1hdGguZmxvb3IoaS84KSo4LTEwXG5cdFx0XHR2LnogPSAwXG5cdFx0XHRwLmZyYWdtZW50cy5wdXNoKHYpXG5cblx0XHRwLmRpYW1vbmQueSArPSAxNVxuXHRcdHAubWlycm9yLnkgKz0gMTVcblx0XHRyZXR1cm5cblxuXHRjcmVhdGVHcmlkczM6KCk9PlxuXHRcdHAgPSBAcG9zaXRpb25zLmdyaWQzID0ge1xuXHRcdFx0ZnJhZ21lbnRzOltdIFxuXHRcdFx0ZGlhbW9uZDpAZGlhbW9uZC5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0XHRtaXJyb3I6QG1pcnJvci5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0fVxuXHRcdGZvciBpIGluIFswLi4uMjRdIGJ5IDFcblx0XHRcdHYgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG5cdFx0XHR2LnggPSAoLTkqKChpKzEpJTUpKSsxNVxuXHRcdFx0di55ID0gTWF0aC5mbG9vcigoaSsxKS81KSo5LTE2LjVcblx0XHRcdHYueiA9IDBcblx0XHRcdHAuZnJhZ21lbnRzLnB1c2godilcblxuXHRcdCMgcC5kaWFtb25kLnggKz0gMjBcblx0XHQjIHAubWlycm9yLnggKz0gMjBcblx0XHRyZXR1cm5cblxuXHRjcmVhdGVHcmlkczQ6KCk9PlxuXHRcdHAgPSBAcG9zaXRpb25zLmdyaWQ0ID0ge1xuXHRcdFx0ZnJhZ21lbnRzOltdIFxuXHRcdFx0ZGlhbW9uZDpAZGlhbW9uZC5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0XHRtaXJyb3I6QG1pcnJvci5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0fVxuXHRcdGFuZ2xlID0gTWF0aC5QSS8yXG5cdFx0YW5nbGVTdGVwID0gTWF0aC5QSSoyLzI0XG5cdFx0cmFkaXVzID0gMjJcblx0XHRmb3IgaSBpbiBbMC4uLjI0XSBieSAxXG5cdFx0XHR2ID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuXHRcdFx0di54ID0gTWF0aC5jb3MoYW5nbGUpKihyYWRpdXMrTWF0aC5zaW4oYW5nbGUqOCkqNSlcblx0XHRcdHYueSA9IE1hdGguc2luKGFuZ2xlKSoocmFkaXVzK01hdGguc2luKGFuZ2xlKjgpKjUpXG5cdFx0XHR2LnogPSAwXG5cdFx0XHRhbmdsZSArPSBhbmdsZVN0ZXBcblx0XHRcdHAuZnJhZ21lbnRzLnB1c2godilcblxuXHRcdHJldHVyblxuXG5cdGNyZWF0ZVBvcnRyYWl0UG9zaXRpb246KCk9PlxuXHRcdHAgPSBAcG9zaXRpb25zLnBvcnRyYWl0ID0ge1xuXHRcdFx0ZnJhZ21lbnRzOltdIFxuXHRcdFx0ZGlhbW9uZDpAZGlhbW9uZC5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0XHRtaXJyb3I6QG1pcnJvci5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0fVxuXHRcdGZvciBpIGluIFswLi4uMjRdIGJ5IDFcblx0XHRcdHYgPSBAZnJhZ21lbnRzW2ldLnBvc2l0aW9uLmNsb25lKClcblx0XHRcdHYueCAqPSAuNzVcblx0XHRcdHYueSAqPSAxLjNcblx0XHRcdHAuZnJhZ21lbnRzLnB1c2godilcblx0XHRyZXR1cm5cblxuXHRjcmVhdGVNb2JpbGVQb3NpdGlvbjooKT0+XG5cdFx0cCA9IEBwb3NpdGlvbnMubW9iaWxlID0ge1xuXHRcdFx0ZnJhZ21lbnRzOltdIFxuXHRcdFx0ZGlhbW9uZDpAZGlhbW9uZC5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0XHRtaXJyb3I6QG1pcnJvci5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0fVxuXHRcdGZvciBpIGluIFswLi4uMjRdIGJ5IDFcblx0XHRcdHYgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG5cdFx0XHR2LnggPSAoMzAqKChpKzEpJTIpKS0xNVxuXHRcdFx0di55ID0gKDEyLU1hdGguZmxvb3IoKGkpLzIpKSotMjArMTBcblx0XHRcdHYueiA9IDBcblx0XHRcdHAuZnJhZ21lbnRzLnB1c2godilcblxuXHRcdHAuZGlhbW9uZC55ICs9IDIwXG5cdFx0cC5taXJyb3IueSArPSAyMFxuXHRcdHJldHVyblxuXG5cblx0YWRkRXZlbnQ6KCk9PlxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLChlKT0+XG5cdFx0XHRAbW91c2UueCA9IChlLmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiAyIC0gMVxuXHRcdFx0QG1vdXNlLnkgPSAtKGUuY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkgKiAyICsgMVxuXHRcdCxmYWxzZSlcblx0XHRyZXR1cm5cblxuXHRvbkRpYW1vbmRMb2FkOihnZW9tZXRyeSk9PlxuXHRcdEBjb21wdXRlR2VvbWV0cnkoZ2VvbWV0cnkpXG5cblx0XHRtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtjb2xvcjogMHhmZmZmZmYsIHRyYW5zcGFyZW50OnRydWUsIGxpZ2h0OmZhbHNlLCBlbnZNYXA6QGVudk1hcCwgZGVwdGhXcml0ZTp0cnVlLCBkZXB0aFRlc3Q6dHJ1ZX0pXG5cdFx0XG5cdFx0bWF0ZXJpYWwubWFwID0gQG1hcFxuXHRcdG1hdGVyaWFsLnNoYWRpbmcgPSBAc2hhZGluZ1xuXHRcdG1hdGVyaWFsLm9wYWNpdHkgPSAuNjVcblx0XHRtYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZVxuXHRcdG1hdGVyaWFsLmNvbWJpbmUgPSBUSFJFRS5NaXhPcGVyYXRpb25cblxuXHRcdG1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KClcblx0XHRtYXRyaXgubWFrZVNjYWxlKCAuMiwgLjIsIC4yIClcblx0XHRnZW9tZXRyeS5hcHBseU1hdHJpeCAoIG1hdHJpeCApXG5cdFx0QGRpYW1vbmQgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSxtYXRlcmlhbClcblx0XHRAY29udGFpbmVyLmFkZChAZGlhbW9uZClcblxuXHRcdGZvbGRlciA9IEBndWkuYWRkRm9sZGVyKCdkaWFtb25kJylcblx0XHRmb2xkZXIuYWRkKG1hdGVyaWFsLCAnZGVwdGhXcml0ZScpXG5cdFx0Zm9sZGVyLmFkZChtYXRlcmlhbCwgJ2RlcHRoVGVzdCcpXG5cdFx0Zm9sZGVyLmFkZChtYXRlcmlhbCwgJ29wYWNpdHknLCAwLCAxKVxuXHRcdGZvbGRlci5hZGQobWF0ZXJpYWwsICdyZWZsZWN0aXZpdHknLDAsMSlcblx0XHRAZGlhbW9uZENvbG9yID0gMHhmZmZmZmZcblx0XHRmb2xkZXIuYWRkKEBkaWFtb25kLm1hdGVyaWFsLCAnY29tYmluZScsIHttdWx0aXBseTpUSFJFRS5NdWx0aXBseSxtaXg6VEhSRUUuTWl4T3BlcmF0aW9uLGFkZDpUSFJFRS5BZGRPcGVyYXRpb259KVxuXHRcdGZvbGRlci5hZGRDb2xvcihALCAnZGlhbW9uZENvbG9yJykub25DaGFuZ2UoKCk9PlxuXHRcdFx0QGRpYW1vbmQubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KEBkaWFtb25kQ29sb3IpXG5cdFx0KVxuXG5cdFx0QHBvc2l0aW9ucy5iYXNlLmRpYW1vbmQgPSBAZGlhbW9uZC5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0cmV0dXJuXG5cblx0b25NaXJyb3JMb2FkOihnZW9tZXRyeSk9PlxuXHRcdEBjb21wdXRlR2VvbWV0cnkoZ2VvbWV0cnkpXG5cdFx0XG5cdFx0bWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKVxuXHRcdG1hdHJpeC5tYWtlU2NhbGUoIC4yLCAuMiwgLjIgKVxuXHRcdGdlb21ldHJ5LmFwcGx5TWF0cml4ICggbWF0cml4IClcblxuXHRcdG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe2NvbG9yOiAweGZmZmZmZiwgbGlnaHQ6ZmFsc2UsIHRyYW5zcGFyZW50OnRydWUsIGVudk1hcDpAZW52TWFwLCBkZXB0aFdyaXRlOnRydWUsIGRlcHRoVGVzdDp0cnVlfSlcblx0XHRtYXRlcmlhbC5tYXAgPSBAbWFwXG5cdFx0bWF0ZXJpYWwuc2hhZGluZyA9IEBzaGFkaW5nXG5cdFx0bWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkRvdWJsZVNpZGVcblx0XHRtYXRlcmlhbC5jb21iaW5lID0gVEhSRUUuQWRkT3BlcmF0aW9uXG5cdFx0bWF0ZXJpYWwucmVmbGVjdGl2aXR5ID0gLjQxXG5cdFx0bWF0ZXJpYWwub3BhY2l0eSA9IDAuNzdcblxuXHRcdEBtaXJyb3IgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSxtYXRlcmlhbClcblx0XHRAY29udGFpbmVyLmFkZChAbWlycm9yKVxuXG5cdFx0Zm9sZGVyID0gQGd1aS5hZGRGb2xkZXIoJ21pcnJvcicpXG5cdFx0Zm9sZGVyLmFkZChAbWlycm9yLm1hdGVyaWFsLCAnZGVwdGhXcml0ZScpXG5cdFx0Zm9sZGVyLmFkZChAbWlycm9yLm1hdGVyaWFsLCAnZGVwdGhUZXN0Jylcblx0XHRmb2xkZXIuYWRkKEBtaXJyb3IubWF0ZXJpYWwsICdvcGFjaXR5JywgMCwgMSlcblx0XHRmb2xkZXIuYWRkKEBtaXJyb3IubWF0ZXJpYWwsICdyZWZsZWN0aXZpdHknLDAsMSlcblxuXHRcdEBtaXJyb3JDb2xvciA9IDB4ZmZmZmZmXG5cdFx0Zm9sZGVyLmFkZChAbWlycm9yLm1hdGVyaWFsLCAnY29tYmluZScsIHttdWx0aXBseTpUSFJFRS5NdWx0aXBseSxtaXg6VEhSRUUuTWl4T3BlcmF0aW9uLGFkZDpUSFJFRS5BZGRPcGVyYXRpb259KVxuXHRcdGZvbGRlci5hZGRDb2xvcihALCAnbWlycm9yQ29sb3InKS5vbkNoYW5nZSgoKT0+XG5cdFx0XHRAbWlycm9yLm1hdGVyaWFsLmNvbG9yLnNldEhleChAbWlycm9yQ29sb3IpXG5cdFx0KVxuXG5cdFx0QHBvc2l0aW9ucy5iYXNlLm1pcnJvciA9IEBtaXJyb3IucG9zaXRpb24uY2xvbmUoKVxuXHRcdFxuXHRcdHJldHVyblxuXG5cdG9uRnJhZ21lbnRMb2FkZWQ6KHNjZW5lKT0+XG5cblx0XHRAZnJhZ21lbnRzID0gW11cblx0XHRAaGl0Ym94cyA9IFtdXG5cdFx0aGl0Ym94R2VvID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDQpXG5cdFx0aGl0Ym94TWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe2NvbG9yOjAsd2lyZWZyYW1lOnRydWUsb3BhY2l0eTouMyx0cmFuc3BhcmVudDp0cnVlfSlcblxuXHRcdEBiYXNlUG9zaXRpb24gPSBbXVxuXG5cdFx0Zm9yIGssIHYgb2Ygc2NlbmUub2JqZWN0c1xuXG5cdFx0XHRvID0gdlxuXHRcdFx0by5uYW1lID0gby5uYW1lLnN1YnN0cmluZyhvLm5hbWUubGVuZ3RoLTIpXG5cblx0XHRcdEBjb21wdXRlR2VvbWV0cnkoby5nZW9tZXRyeSlcblx0XHRcdG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe2NvbG9yOiAweGZmZmZmZiwgdHJhbnNwYXJlbnQ6dHJ1ZSwgZW52TWFwOkBlbnZNYXAsIGRlcHRoV3JpdGU6dHJ1ZSwgZGVwdGhUZXN0OnRydWV9KVxuXHRcdFx0bWF0ZXJpYWwuc2hhZGluZyA9IEBzaGFkaW5nXG5cdFx0XHRtYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZVxuXHRcdFx0bWF0ZXJpYWwuY29tYmluZSA9IFRIUkVFLkFkZE9wZXJhdGlvblxuXHRcdFx0bWF0ZXJpYWwucmVmbGVjdGl2aXR5ID0gLjQxXG5cdFx0XHRtYXRlcmlhbC5vcGFjaXR5ID0gMC44XG5cblx0XHRcdG8ubWF0ZXJpYWwgPSBtYXRlcmlhbFxuXHRcdFx0bWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKVxuXHRcdFx0bWF0cml4Lm1ha2VTY2FsZSggLjIzLCAuMjMsIC4yMyApXG5cdFx0XHRvLmdlb21ldHJ5LmFwcGx5TWF0cml4KCBtYXRyaXggKVxuXHRcdFx0by5wb3NpdGlvbi5tdWx0aXBseVNjYWxhciguMjEpXG5cdFx0XHRvLnBvc2l0aW9uLnkgLT0gMjBcblx0XHRcdG8ucG9zaXRpb24ueiArPSA1XG5cdFx0XHRpZiBwYXJzZUludChvLm5hbWUpID4gQG1heERhdGVcblx0XHRcdFx0by5tYXRlcmlhbC5vcGFjaXR5ID0gMC4zXG5cdFx0XHQjIGVsc2Vcblx0XHRcdCMgXHRtYXRlcmlhbC5tYXAgPSBUSFJFRS5JbWFnZVV0aWxzLmxvYWRUZXh0dXJlKFwiLi8zZC90ZXh0dXJlcy9wcmV2aWV3XCIrby5uYW1lK1wiLmpwZ1wiKVxuXHRcdFx0XG5cdFx0XHRoaXRib3ggPSBuZXcgVEhSRUUuTWVzaChoaXRib3hHZW8saGl0Ym94TWF0ZXJpYWwpXG5cdFx0XHRoaXRib3gucG9zaXRpb24uY29weShvLnBvc2l0aW9uKVxuXHRcdFx0aGl0Ym94LnZpc2libGUgPSBAaGl0Ym94VmlzaWJsZVxuXHRcdFx0aGl0Ym94LmZyYWdtZW50ID0gb1xuXHRcdFx0QGhpdGJveHMucHVzaChoaXRib3gpXG5cdFx0XHRTdGFnZTNkLmFkZChoaXRib3gpXG5cblx0XHRcdEBwb3NpdGlvbnMuYmFzZS5mcmFnbWVudHMucHVzaChvLnBvc2l0aW9uLmNsb25lKCkpXG5cblx0XHRcdEBjb21wdXRlR2VvbWV0cnkoby5nZW9tZXRyeSlcblx0XHRcdEBmcmFnbWVudHMucHVzaChvKVxuXHRcdFx0U3RhZ2UzZC5hZGQobylcblx0XHRcblx0XHRmb3IgaSBpbiBbMC4uLjI0XSBieSAxXG5cdFx0XHRAY3VycmVudFBvc2l0aW9uLmZyYWdtZW50c1tpXS5jb3B5KEBoaXRib3hzW2ldLnBvc2l0aW9uKVxuXG5cdFx0QHBvc2l0aW9uID0gQGJhc2VQb3NpdGlvblxuXHRcdEBjcmVhdGVHcmlkczEoKVxuXHRcdEBjcmVhdGVHcmlkczIoKVxuXHRcdEBjcmVhdGVHcmlkczMoKVxuXHRcdEBjcmVhdGVHcmlkczQoKVxuXHRcdEBjcmVhdGVNb2JpbGVQb3NpdGlvbigpXG5cdFx0QGNyZWF0ZVBvcnRyYWl0UG9zaXRpb24oKVxuXHRcdHJldHVyblxuXG5cdGNyZWF0ZUdVSTooKT0+XG5cdFx0QGd1aSA9IG5ldyBkYXQuR1VJKClcblx0XHRAdGV4dHVyZXMgPSBudWxsXG5cblx0XHRAbWFwcyA9IFtdXG5cdFx0QGVudk1hcHMgPSBbXVxuXG5cdFx0Z2xvYmFsID0gQGd1aS5hZGRGb2xkZXIoJ2dsb2JhbCcpXG5cblx0XHRAZ2xvYmFsT3BhY2l0eSA9IDFcblx0XHRnbG9iYWwuYWRkKEAsJ2dsb2JhbE9wYWNpdHknLDAsMSkuc3RlcCgwLjAxKS5vbkNoYW5nZSgoKT0+XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2ViZ2wnKS5zdHlsZS5vcGFjaXR5ID0gQGdsb2JhbE9wYWNpdHlcblx0XHQpXG5cblx0XHRAaGl0Ym94VmlzaWJsZSA9IGZhbHNlXG5cdFx0Z2xvYmFsLmFkZChALCdvZmZzZXRYJywtMzAsMzApLnN0ZXAoMC4xKVxuXG5cdFx0cG9zaXRpb25zID0gQGd1aS5hZGRGb2xkZXIoJ3Bvc2l0aW9ucycpXG5cdFx0cG9zaXRpb25zLmFkZChALCdub0dyaWQnKVxuXHRcdHBvc2l0aW9ucy5hZGQoQCwnZ3JpZDEnKVxuXHRcdHBvc2l0aW9ucy5hZGQoQCwnZ3JpZDInKVxuXHRcdHBvc2l0aW9ucy5hZGQoQCwnZ3JpZDMnKVxuXHRcdHBvc2l0aW9ucy5hZGQoQCwnZ3JpZDQnKVxuXHRcdHBvc2l0aW9ucy5hZGQoQCwncG9ydHJhaXQnKVxuXHRcdHBvc2l0aW9ucy5hZGQoQCwnbW9iaWxlJylcblxuXHRcdGZyYWcgPSBAZ3VpLmFkZEZvbGRlcignZnJhZ21lbnRzJylcblx0XHRAbW92ZW1lbnRTY2FsZSA9IDEuMVxuXHRcdEBzcGVlZFNjYWxlID0gMC4xXG5cdFx0ZnJhZy5hZGQoQCwnbW92ZW1lbnRTY2FsZScsMCwyKVxuXHRcdGZyYWcuYWRkKEAsJ3NwZWVkU2NhbGUnLDAsMilcblx0XHRmcmFnLmFkZChALCdoaXRib3hWaXNpYmxlJykub25DaGFuZ2UoKGUpPT5cblx0XHRcdGZvciBpIGluIFswLi4uMjRdIGJ5IDFcblx0XHRcdFx0QGhpdGJveHNbaV0udmlzaWJsZSA9IEBoaXRib3hWaXNpYmxlXG5cdFx0XHRcblx0XHQpXG5cblx0XHQjIFN0YWdlM2QuaW5pdFBvc3Rwcm9jZXNzaW5nKEBndWkpXG5cblx0XHRyZXR1cm5cblxuXHR0d2VlblRvOihwb3NpdGlvbnMpLT5cblx0XHRmb3IgaSBpbiBbMC4uLjI0XSBieSAxXG5cdFx0XHR2ID0gQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV1cblx0XHRcdHYyID0gcG9zaXRpb25zLmZyYWdtZW50c1tpXVxuXHRcdFx0XG5cdFx0XHQjIGRpZmYgPSB2Mi5jbG9uZSgpLnN1Yih2KVxuXHRcdFx0XG5cdFx0XHRUd2VlbkxpdGUudG8odiwgLjgrTWF0aC5yYW5kb20oKSouMywge3g6IHYyLngsIHk6IHYyLnksIHo6djIueiwgZWFzZTpCYWNrLmVhc2VPdXR9KVxuXHRcdFR3ZWVuTGl0ZS50byhAY3VycmVudFBvc2l0aW9uLmRpYW1vbmQsMS40LHt4OiBwb3NpdGlvbnMuZGlhbW9uZC54LCB5OiBwb3NpdGlvbnMuZGlhbW9uZC55LCB6OnBvc2l0aW9ucy5kaWFtb25kLnosIGVhc2U6RXhwby5lYXNlT3V0fSlcblx0XHRUd2VlbkxpdGUudG8oQGN1cnJlbnRQb3NpdGlvbi5taXJyb3IsMS40LHt4OiBwb3NpdGlvbnMubWlycm9yLngsIHk6IHBvc2l0aW9ucy5taXJyb3IueSwgejpwb3NpdGlvbnMubWlycm9yLnosIGVhc2U6RXhwby5lYXNlT3V0fSlcblx0XHRyZXR1cm5cblxuXHRub0dyaWQ6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMuYmFzZSlcblx0XHRyZXR1cm5cblxuXHRncmlkMTooKS0+XG5cdFx0QHR3ZWVuVG8oQHBvc2l0aW9ucy5ncmlkMSlcblx0XHRyZXR1cm5cblxuXHRncmlkMjooKS0+XG5cdFx0QHR3ZWVuVG8oQHBvc2l0aW9ucy5ncmlkMilcblx0XHRyZXR1cm5cblxuXHRncmlkMzooKS0+XG5cdFx0QHR3ZWVuVG8oQHBvc2l0aW9ucy5ncmlkMylcblx0XHRyZXR1cm5cblxuXHRncmlkNDooKS0+XG5cdFx0QHR3ZWVuVG8oQHBvc2l0aW9ucy5ncmlkNClcblx0XHRyZXR1cm5cblxuXHRwb3J0cmFpdDooKS0+XG5cdFx0QHR3ZWVuVG8oQHBvc2l0aW9ucy5wb3J0cmFpdClcblx0XHRyZXR1cm5cblx0XG5cdG1vYmlsZTooKS0+XG5cdFx0QHR3ZWVuVG8oQHBvc2l0aW9ucy5tb2JpbGUpXG5cdFx0cmV0dXJuXG5cblx0YWRkWmVybzoobnVtYmVyLG1pbkxlbmd0aCktPlxuXHRcdG51bWJlciA9IG51bWJlcitcIlwiXG5cdFx0d2hpbGUobnVtYmVyLmxlbmd0aDxtaW5MZW5ndGgpXG5cdFx0XHRudW1iZXIgPSBcIjBcIitudW1iZXJcblx0XHRyZXR1cm4gbnVtYmVyXG5cblx0Y29tcHV0ZUdlb21ldHJ5OihnZW9tZXRyeSktPlxuXHRcdCMgY29tcHV0ZSB0aGUgbW9kZWxcblx0XHRnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKVxuXHRcdGdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpXG5cdFx0Z2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKVxuXHRcdGdlb21ldHJ5LmNvbXB1dGVUYW5nZW50cygpXG5cdFx0Z2VvbWV0cnkuY29tcHV0ZU1vcnBoTm9ybWFscygpXG5cdFx0Z2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZVxuXHRcdGdlb21ldHJ5Lm5vcm1hbHNOZWVkVXBkYXRlID0gdHJ1ZVxuXHRcdHJldHVyblxuXG5cdHNob3dYUDooaW5kZXgpLT5cblx0XHRpZihpbmRleCA9PSBAY3VycmVudEluZGV4IHx8IHBhcnNlSW50KGluZGV4KSA+IEBtYXhEYXRlKVxuXHRcdFx0cmV0dXJuXG5cdFx0QGN1cnJlbnRJbmRleCA9IGluZGV4XG5cdFx0QGdsb2JhbEFscGhhID0gMC4wMVxuXHRcdHJldHVyblxuXG5cdHBhdXNlOigpLT5cblx0XHRyZXR1cm5cblxuXHRyZXN1bWU6KCktPlxuXHRcdHJldHVyblxuXG5cdHVwZGF0ZTooZHQpLT5cblxuXHRcdEB0aW1lICs9IGR0XG5cblx0XHRpZiAoQGlzSW1nUmVhZHkpXG5cdFx0XHRAY3R4Lmdsb2JhbEFscGhhID0gQGdsb2JhbEFscGhhXG5cdFx0XHRAZ2xvYmFsQWxwaGEgKz0gLjAxXG5cdFx0XHRcblx0XHRcdGlkeCA9IHBhcnNlSW50KCBAY3VycmVudEluZGV4ICkgLSAxXG5cdFx0XHRpZiBpZHggPD0gMTRcblx0XHRcdFx0QGN0eC5kcmF3SW1hZ2UoQGltYWdlc1tpZHhdLDAsMClcblx0XHRcdFx0QG1hcC5uZWVkc1VwZGF0ZSA9IHRydWVcblx0XHRcdFx0QGVudk1hcC5uZWVkc1VwZGF0ZSA9IHRydWVcblxuXHRcdHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCBAbW91c2UueCwgQG1vdXNlLnksIC41IClcblx0XHR2ZWN0b3IudW5wcm9qZWN0KCBTdGFnZTNkLmNhbWVyYSApXG5cdFx0cmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlciggU3RhZ2UzZC5jYW1lcmEucG9zaXRpb24sIHZlY3Rvci5zdWIoIFN0YWdlM2QuY2FtZXJhLnBvc2l0aW9uICkubm9ybWFsaXplKCkgKVxuXHRcdHQgPSBAdGltZVxuXG5cdFx0aWYoQGRpYW1vbmQgJiYgQGN1cnJlbnRQb3NpdGlvbi5kaWFtb25kKVxuXHRcdFx0QGRpYW1vbmQucG9zaXRpb24uY29weShAY3VycmVudFBvc2l0aW9uLmRpYW1vbmQpXG5cdFx0XHRAZGlhbW9uZC5wb3NpdGlvbi54ICs9IEBvZmZzZXRYXG5cdFxuXHRcdGlmKEBtaXJyb3IgJiYgQGN1cnJlbnRQb3NpdGlvbi5taXJyb3IpXG5cdFx0XHRAbWlycm9yLnBvc2l0aW9uLmNvcHkoQGN1cnJlbnRQb3NpdGlvbi5taXJyb3IpXG5cdFx0XHRAbWlycm9yLnBvc2l0aW9uLnggKz0gQG9mZnNldFhcblxuXHRcdGlmKEBtaXJyb3IgJiYgQGRpYW1vbmQpXG5cdFx0XHRzID0gMSArIE1hdGguY29zKHQvMTI1MCkqLjAyXG5cdFx0XHRAZGlhbW9uZC5zY2FsZS5zZXQocyxzLHMpXG5cdFx0XHRAZGlhbW9uZC5wb3NpdGlvbi55ICs9IE1hdGguc2luKHQvMTUwMCkqLjVcblx0XHRcdEBtaXJyb3Iuc2NhbGUuc2V0KHMscyxzKVxuXHRcdFx0QG1pcnJvci5wb3NpdGlvbi55ICs9IE1hdGguc2luKHQvMTUwMCkqLjVcblxuXHRcdGZvciBpIGluIFswLi4uQGhpdGJveHMubGVuZ3RoXSBieSAxXG5cdFx0XHRkaXN0YW5jZSA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRcdGR4ID0gQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0ueCAtIEBkaWFtb25kLnBvc2l0aW9uLnhcblx0XHRcdGR5ID0gQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0ueSAtIEBkaWFtb25kLnBvc2l0aW9uLnlcblx0XHRcdGR6ID0gQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0ueiAtIEBkaWFtb25kLnBvc2l0aW9uLnpcblx0XHRcdGRpc3RhbmNlLnNldChNYXRoLnNxcnQoZHgqZHgpLE1hdGguc3FydChkeSpkeSksTWF0aC5zcXJ0KGR6KmR6KSlcblx0XHRcdCMgQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0ueiA9XG5cdFx0XHRAaGl0Ym94c1tpXS5wb3NpdGlvbi5jb3B5KEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldIClcblx0XHRcdGlmKGRpc3RhbmNlLnggPCAxNy41KVxuXHRcdFx0XHRAaGl0Ym94c1tpXS5wb3NpdGlvbi56ID0gTWF0aC5tYXgoQGhpdGJveHNbaV0ucG9zaXRpb24ueiwxNClcblx0XHRcdGVsc2UgaWYoZGlzdGFuY2UueCA8IDI5KVxuXHRcdFx0XHRAaGl0Ym94c1tpXS5wb3NpdGlvbi56ID0gTWF0aC5tYXgoQGhpdGJveHNbaV0ucG9zaXRpb24ueiwoMS0oZGlzdGFuY2UueC0xNCkvMTUpKjE0KzIpXG5cdFx0XHQjIEBoaXRib3hzW2ldLnBvc2l0aW9uLnggKz0gKEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldLnggLSBAaGl0Ym94c1tpXS5wb3NpdGlvbi54KSouMDVcblx0XHRcdCMgQGhpdGJveHNbaV0ucG9zaXRpb24ueSArPSAoQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0ueSAtIEBoaXRib3hzW2ldLnBvc2l0aW9uLnkpKi4wNVxuXHRcdFx0IyBAaGl0Ym94c1tpXS5wb3NpdGlvbi56ICs9IChAY3VycmVudFBvc2l0aW9uLmZyYWdtZW50c1tpXS56IC0gQGhpdGJveHNbaV0ucG9zaXRpb24ueikqLjA1XG5cdFx0XHRAaGl0Ym94c1tpXS5wb3NpdGlvbi54ICs9IEBvZmZzZXRYXG5cblx0XHR0ID0gQHRpbWVcblx0XHRmb3IgaSBpbiBbMC4uLkBmcmFnbWVudHMubGVuZ3RoXSBieSAxXG5cdFx0XHR0Kz03NDdcblx0XHRcdEBmcmFnbWVudHNbaV0ucG9zaXRpb24ueSA9IEBoaXRib3hzW2ldLnBvc2l0aW9uLnkrTWF0aC5zaW4odC8zNTAqQHNwZWVkU2NhbGUpKjEuMSpAbW92ZW1lbnRTY2FsZVxuXHRcdFx0QGZyYWdtZW50c1tpXS5wb3NpdGlvbi54ID0gQGhpdGJveHNbaV0ucG9zaXRpb24ueCtNYXRoLmNvcyh0LzQ1MCpAc3BlZWRTY2FsZSkqLjUqQG1vdmVtZW50U2NhbGVcblx0XHRcdEBmcmFnbWVudHNbaV0ucG9zaXRpb24ueiA9IEBoaXRib3hzW2ldLnBvc2l0aW9uLnpcblx0XHRcblx0XHRpZihAaGl0Ym94cylcblx0XHRcdGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyggQGhpdGJveHMsIGZhbHNlIClcblx0XHRcdGlmKCBpbnRlcnNlY3RzLmxlbmd0aCA+IDAgKVxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJ1xuXHRcdFx0XHRmcmFnID0gaW50ZXJzZWN0c1swXS5vYmplY3QuZnJhZ21lbnRcblx0XHRcdFx0QGN1cnJlbnRGcmFnbWVudCA9IGZyYWdcblx0XHRcdFx0QHNob3dYUChmcmFnLm5hbWUpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ2F1dG8nXG5cdFx0XHRcdEBjdXJyZW50RnJhZ21lbnQgPSBudWxsXG5cblx0XHRpZiBAY3VycmVudEZyYWdtZW50XG5cdFx0XHRAY3VycmVudEZyYWdtZW50LnNjYWxlLnggKz0gKDEuNC1AY3VycmVudEZyYWdtZW50LnNjYWxlLngpKi4wNVxuXHRcdFx0QGN1cnJlbnRGcmFnbWVudC5zY2FsZS55ID0gQGN1cnJlbnRGcmFnbWVudC5zY2FsZS54XG5cdFx0XHRAY3VycmVudEZyYWdtZW50LnNjYWxlLnogPSBAY3VycmVudEZyYWdtZW50LnNjYWxlLnhcblxuXHRcdGZvciBpIGluIFswLi4uQGZyYWdtZW50cy5sZW5ndGhdIGJ5IDFcblx0XHRcdGYgPSBAZnJhZ21lbnRzW2ldXG5cdFx0XHRpZiBmICE9IEBjdXJyZW50RnJhZ21lbnRcblx0XHRcdFx0Zi5zY2FsZS54ICs9ICgxLWYuc2NhbGUueCkqLjA5XG5cdFx0XHRcdGYuc2NhbGUueSA9IGYuc2NhbGUueFxuXHRcdFx0XHRmLnNjYWxlLnogPSBmLnNjYWxlLnhcblxuXHRcdCMgQGNhbWVyYUxpZ2h0LnBvc2l0aW9uLnggPSBNYXRoLmNvcyhAdGltZSowLjAwMSkqMTAwXG5cdFx0IyBAY2FtZXJhTGlnaHQyLnBvc2l0aW9uLnggPSBNYXRoLmNvcyhAdGltZSowLjAwMTUpKjEyMFxuXHRcdCMgQGNhbWVyYUxpZ2h0Mi5wb3NpdGlvbi55ID0gTWF0aC5zaW4oQHRpbWUqMC4wMDE1KSoxMjBcblx0XHQjIEBjb250YWluZXIucm90YXRpb24ueSArPSAoQG1vdXNlLngqTWF0aC5QSS8xNiAtIEBjb250YWluZXIucm90YXRpb24ueSkqLjA5XG5cdFx0IyBAY29udGFpbmVyLnJvdGF0aW9uLnggKz0gKC1AbW91c2UueSpNYXRoLlBJLzE2IC0gQGNvbnRhaW5lci5yb3RhdGlvbi54KSouMDlcblxuXHRcdGlmKEBiYWNrZ3JvdW5kR2VvbWV0cnkpXG5cdFx0XHRnZW9tZXRyeSA9ICBAYmFja2dyb3VuZEdlb21ldHJ5XG5cdFx0XHRpZihAYnVmZmVyR2VvbWV0cnkpXG5cdFx0XHRcdEBidWZmZXJHZW9tZXRyeS5mcm9tR2VvbWV0cnkoQGJhY2tncm91bmRHZW9tZXRyeSlcblx0XHRcdHNwZWVkcyA9IFs4MDAsNzAwLDEyMDBdXG5cdFx0XHRmb3IgaSBpbiBbMC4uLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aF0gYnkgMVxuXHRcdFx0XHR2ID0gZ2VvbWV0cnkudmVydGljZXNbaV1cblx0XHRcdFx0di56ICs9IE1hdGguY29zKEB0aW1lL3NwZWVkc1tpJXNwZWVkcy5sZW5ndGhdK01hdGguUEkvMTYqaSkqMlxuXHRcdFx0IyBmb3IgaSBpbiBbMS4uLmdlb21ldHJ5LmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXkubGVuZ3RoXSBieSAzXG5cdFx0XHQjIFx0Z2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheVtpKzJdICs9IE1hdGguY29zKEB0aW1lL3NwZWVkc1soaS8zKSVzcGVlZHMubGVuZ3RoXStNYXRoLlBJLzE2KmkpKjJcblx0XHRcdCMgZ2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbm5lZWRzVXBkYXRlID0gdHJ1ZVxuXHRcdFx0IyBnZW9tZXRyeS5hdHRyaWJ1dGVzLm5vcm1hbC5uZWVkc1VwZGF0ZSA9IHRydWVcblx0XHRcdCMgZ2VvbWV0cnkubm9ybWFsaXplTm9ybWFscygpXG5cdFx0XHRnZW9tZXRyeS5jb21wdXRlVGFuZ2VudHMoKTtcblx0XHRcdGdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKClcblx0XHRcdGdlb21ldHJ5LmNvbXB1dGVGYWNlTm9ybWFscygpXG5cdFx0XHRnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpXG5cdFx0XHRnZW9tZXRyeS5jb21wdXRlVGFuZ2VudHMoKVxuXHRcdFx0Z2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZVxuXHRcdFx0Z2VvbWV0cnkubm9ybWFsc05lZWRVcGRhdGUgPSB0cnVlXG5cdFx0XHRnZW9tZXRyeS5lbGVtZW50c05lZWRVcGRhdGUgPSB0cnVlO1xuXHRcdFx0Z2VvbWV0cnkudGFuZ2VudHNOZWVkVXBkYXRlID0gdHJ1ZTtcblxuXHRcdFN0YWdlM2QuY2FtZXJhLnBvc2l0aW9uLnggKz0gKEBtb3VzZS54KjMwIC0gU3RhZ2UzZC5jYW1lcmEucG9zaXRpb24ueCkqLjAzXG5cdFx0XG5cdFx0IyBTdGFnZTNkLmNhbWVyYS5wb3NpdGlvbi55ICs9IChAbW91c2UueSoyKzIwIC0gU3RhZ2UzZC5jYW1lcmEucG9zaXRpb24ueSkqLjAzXG5cdFx0IyBAY29udGFpbmVyLnJvdGF0aW9uLnggKz0gKEBtb3VzZS55Kk1hdGguUEkvMTYgLSBAY29udGFpbmVyLnJvdGF0aW9uLngpKi4wM1xuXHRcdCMgQGxpZ2h0Q29udGFpbmVyLnJvdGF0aW9uLnggKz0gKEBtb3VzZS55Kk1hdGguUEkvMTYgLSBAY29udGFpbmVyLnJvdGF0aW9uLngpKi4wM1xuXHRcdHJldHVyblxuIl19