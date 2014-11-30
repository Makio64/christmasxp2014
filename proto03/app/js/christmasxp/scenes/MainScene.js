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
    var i, loader, _i;
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
    for (i = _i = 0; _i < 24; i = _i += 1) {
      this.currentPosition.fragments[i] = new THREE.Vector3();
    }
    this.currentPosition.diamond = new THREE.Vector3();
    this.currentPosition.mirror = new THREE.Vector3();
    this.container = new THREE.Object3D();
    Stage3d.add(this.container, false);
    this.lightContainer = new THREE.Object3D();
    this.container.add(this.lightContainer);
    this.map = THREE.ImageUtils.loadTexture("./3d/textures/preview01.jpg");
    this.envMap = THREE.ImageUtils.loadTextureCube(["./3d/textures/preview01.jpg", "./3d/textures/preview01.jpg", "./3d/textures/preview01.jpg", "./3d/textures/preview01.jpg", "./3d/textures/preview01.jpg", "./3d/textures/preview01.jpg"]);
    loader = new THREE.JSONLoader();
    loader.load('./3d/json/crystal.js', this.onDiamondLoad);
    loader = new THREE.JSONLoader();
    loader.load('./3d/json/mirror.js', this.onMirrorLoad);
    loader = new THREE.SceneLoader();
    loader.load('./3d/json/fragments.js', this.onFragmentLoaded);
    this.createLight();
    this.createBackground();
    this.createGUI();
    this.addEvent();
    return;
  }

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
      v.x += (1.1 * Math.random() - .55) * 300;
      v.y += (1.1 * Math.random() - .55) * 300;
      v.z += (1.1 * Math.random() - .55) * 300;
    }
    geometry.computeTangents();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeTangents();
    geometry.computeMorphNormals();
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
      } else {
        material.map = THREE.ImageUtils.loadTexture("./3d/textures/preview" + o.name + ".jpg");
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
    var positions;
    this.gui = new dat.GUI();
    this.textures = null;
    this.maps = [];
    this.envMaps = [];
    this.gui.add(this, 'textures', {
      xp1: '0',
      xp2: '1',
      xp3: '2'
    }).onChange((function(_this) {
      return function(e) {
        _this.mirror.material.map = _this.maps[_this.textures];
        _this.diamond.material.envMap = _this.envMaps[_this.textures];
        _this.mirror.material.envMaps = _this.envMaps[_this.textures];
        _this.mirror.material.needsUpdate = true;
        _this.diamond.material.needsUpdate = true;
      };
    })(this));
    this.hitboxVisible = false;
    this.gui.add(this, 'hitboxVisible').onChange((function(_this) {
      return function(e) {
        var i, _i, _results;
        _results = [];
        for (i = _i = 0; _i < 24; i = _i += 1) {
          _results.push(_this.hitboxs[i].visible = _this.hitboxVisible);
        }
        return _results;
      };
    })(this));
    this.globalOpacity = 1;
    this.gui.add(this, 'globalOpacity', 0, 1).step(0.01).onChange((function(_this) {
      return function() {
        return document.getElementById('webgl').style.opacity = _this.globalOpacity;
      };
    })(this));
    this.gui.add(this, 'offsetX', -30, 30).step(0.1);
    positions = this.gui.addFolder('positions');
    positions.add(this, 'noGrid');
    positions.add(this, 'grid1');
    positions.add(this, 'grid2');
    positions.add(this, 'grid3');
    positions.add(this, 'grid4');
    positions.add(this, 'portrait');
    positions.add(this, 'mobile');
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
    var texture, textureCube, url;
    if (index === this.currentIndex || parseInt(index) > this.maxDate) {
      return;
    }
    this.currentIndex = index;
    url = "./3d/textures/preview" + index + ".jpg";
    texture = THREE.ImageUtils.loadTexture(url);
    textureCube = THREE.ImageUtils.loadTextureCube([url, url, url, url, url, url]);
    textureCube.needsUpdate = true;
    this.mirror.material.map = texture;
    this.mirror.material.envMap = textureCube;
    console.log(this.mirror.material);
    console.log(this.diamond.material);
    this.diamond.material.envMap = textureCube;
    this.diamond.material.needsUpdate = true;
    this.mirror.material.needsUpdate = true;
  };

  MainScene.prototype.pause = function() {};

  MainScene.prototype.resume = function() {};

  MainScene.prototype.update = function(dt) {
    var distance, dx, dy, dz, f, frag, geometry, i, intersects, raycaster, s, speeds, t, v, vector, _i, _j, _k, _l, _ref, _ref1, _ref2, _ref3;
    this.time += dt;
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
      this.fragments[i].position.y = this.hitboxs[i].position.y + Math.sin(t / 350) * 1.1;
      this.fragments[i].position.x = this.hitboxs[i].position.x + Math.cos(t / 450) * .5;
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
      geometry.computeBoundingSphere();
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      geometry.computeTangents();
      geometry.computeMorphNormals();
      geometry.verticesNeedUpdate = true;
      geometry.normalsNeedUpdate = true;
      geometry.elementsNeedUpdate = true;
      geometry.tangentsNeedUpdate = true;
    }
    Stage3d.camera.position.x += (this.mouse.x * 30 - Stage3d.camera.position.x) * .03;
  };

  return MainScene;

})(Scene);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNocmlzdG1hc3hwL3NjZW5lcy9NYWluU2NlbmUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsU0FBQTtFQUFBOztpU0FBQTs7QUFBQTtBQUVDLDhCQUFBLENBQUE7O0FBQVksRUFBQSxtQkFBQSxHQUFBO0FBRVgsaURBQUEsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSx1RUFBQSxDQUFBO0FBQUEsMkVBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEsdURBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLFFBQUEsYUFBQTtBQUFBLElBQUEsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLEtBQUssQ0FBQyxPQUFOLENBQWMsQ0FBZCxFQUFnQixDQUFoQixDQUFiLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsQ0FEUixDQUFBO0FBQUEsSUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBRlYsQ0FBQTtBQUFBLElBR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUFLLENBQUMsV0FIakIsQ0FBQTtBQUFBLElBSUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUpYLENBQUE7QUFBQSxJQUtBLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFMYixDQUFBO0FBQUEsSUFNQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBTlgsQ0FBQTtBQUFBLElBT0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQVBYLENBQUE7QUFBQSxJQVFBLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFSYixDQUFBO0FBQUEsSUFTQSxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsR0FBa0I7QUFBQSxNQUNqQixTQUFBLEVBQVksRUFESztBQUFBLE1BRWpCLE9BQUEsRUFBYyxJQUFBLEtBQUssQ0FBQyxPQUFO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QyxDQUFQLEdBQVMsRUFBVCxHQUFjLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQXZDLENBQUEsR0FBMEMsR0FqR3ZFLENBRk07RUFBQSxDQXBlUCxDQUFBOzttQkFBQTs7R0FGdUIsTUFBeEIsQ0FBQSIsImZpbGUiOiJjaHJpc3RtYXN4cC9zY2VuZXMvTWFpblNjZW5lLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTWFpblNjZW5lIGV4dGVuZHMgU2NlbmVcblxuXHRjb25zdHJ1Y3RvcjooKS0+XG5cblx0XHRAbW91c2UgPSBuZXcgVEhSRUUuVmVjdG9yMigwLDApXG5cdFx0QHRpbWUgPSAwXG5cdFx0QHVzZU1hcCA9IHRydWVcblx0XHRAc2hhZGluZyA9IFRIUkVFLkZsYXRTaGFkaW5nXG5cdFx0QG9wYWNpdHkgPSAxXG5cdFx0QGZyYWdtZW50cyA9IFtdXG5cdFx0QGhpdGJveHMgPSBbXVxuXHRcdEBtYXhEYXRlID0gMTNcblx0XHRAcG9zaXRpb25zID0ge307XG5cdFx0QHBvc2l0aW9ucy5iYXNlID0ge1xuXHRcdFx0ZnJhZ21lbnRzIDogW11cblx0XHRcdGRpYW1vbmQgOiBuZXcgVEhSRUUuVmVjdG9yMygpXG5cdFx0XHRtaXJyb3IgOiBuZXcgVEhSRUUuVmVjdG9yMygpXG5cdFx0fVxuXG5cdFx0QG9mZnNldFggPSAwXG5cblx0XHRAY3VycmVudFBvc2l0aW9uID0ge1xuXHRcdFx0ZnJhZ21lbnRzIDogW11cblx0XHRcdGRpYW1vbmQgOiBudWxsXG5cdFx0XHRtaXJyb3IgOiBudWxsXG5cdFx0fVxuXHRcdGZvciBpIGluIFswLi4uMjRdIGJ5IDFcblx0XHRcdEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuXHRcdEBjdXJyZW50UG9zaXRpb24uZGlhbW9uZCA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRAY3VycmVudFBvc2l0aW9uLm1pcnJvciA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRcblxuXHRcdEBjb250YWluZXIgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblx0XHRTdGFnZTNkLmFkZChAY29udGFpbmVyLGZhbHNlKVxuXG5cblx0XHRAbGlnaHRDb250YWluZXIgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblx0XHRAY29udGFpbmVyLmFkZChAbGlnaHRDb250YWluZXIpXG5cblxuXHRcdEBtYXAgPSBUSFJFRS5JbWFnZVV0aWxzLmxvYWRUZXh0dXJlKFwiLi8zZC90ZXh0dXJlcy9wcmV2aWV3MDEuanBnXCIpXG5cdFx0QGVudk1hcCA9IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmVDdWJlKFtcIi4vM2QvdGV4dHVyZXMvcHJldmlldzAxLmpwZ1wiLFwiLi8zZC90ZXh0dXJlcy9wcmV2aWV3MDEuanBnXCJcblx0XHRcdCxcIi4vM2QvdGV4dHVyZXMvcHJldmlldzAxLmpwZ1wiLFwiLi8zZC90ZXh0dXJlcy9wcmV2aWV3MDEuanBnXCJcblx0XHRcdCxcIi4vM2QvdGV4dHVyZXMvcHJldmlldzAxLmpwZ1wiLFwiLi8zZC90ZXh0dXJlcy9wcmV2aWV3MDEuanBnXCJdKVxuXG5cdFx0bG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIoKVxuXHRcdGxvYWRlci5sb2FkKCAnLi8zZC9qc29uL2NyeXN0YWwuanMnLCBAb25EaWFtb25kTG9hZCApXG5cblx0XHRsb2FkZXIgPSBuZXcgVEhSRUUuSlNPTkxvYWRlcigpXG5cdFx0bG9hZGVyLmxvYWQoICcuLzNkL2pzb24vbWlycm9yLmpzJywgQG9uTWlycm9yTG9hZCApXG5cdFx0XG5cdFx0bG9hZGVyID0gbmV3IFRIUkVFLlNjZW5lTG9hZGVyKClcblx0XHRsb2FkZXIubG9hZCggJy4vM2QvanNvbi9mcmFnbWVudHMuanMnLCBAb25GcmFnbWVudExvYWRlZCApXG5cblx0XHRAY3JlYXRlTGlnaHQoKVxuXHRcdEBjcmVhdGVCYWNrZ3JvdW5kKClcblx0XHRAY3JlYXRlR1VJKClcblx0XHRAYWRkRXZlbnQoKVxuXHRcdHJldHVyblxuXG5cdGNyZWF0ZUJhY2tncm91bmQ6KCk9PlxuXHRcdG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyB3aXJlZnJhbWU6ZmFsc2UsY29sb3I6MHhGRkZGRkZ9KVxuXHRcdG1hdGVyaWFsLnNoYWRpbmcgPSBUSFJFRS5GbGF0U2hhZGluZ1xuXG5cdFx0Z2VvbWV0cnkgPSAgbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoNzAwMCwgNzAwMCwgOCwgOClcblx0XHRmb3IgaSBpbiBbMC4uLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aF0gYnkgMVxuXHRcdFx0diA9IGdlb21ldHJ5LnZlcnRpY2VzW2ldXG5cdFx0XHR2LnggKz0gKDEuMSpNYXRoLnJhbmRvbSgpLS41NSkqMzAwXG5cdFx0XHR2LnkgKz0gKDEuMSpNYXRoLnJhbmRvbSgpLS41NSkqMzAwXG5cdFx0XHR2LnogKz0gKDEuMSpNYXRoLnJhbmRvbSgpLS41NSkqMzAwXG5cdFx0IyBmb3IgaSBpbiBbMS4uLmdlb21ldHJ5LmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXkubGVuZ3RoXSBieSAzXG5cdFx0IyBcdGdlb21ldHJ5LmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXlbaSsyXSArPSA1MDAqTWF0aC5yYW5kb20oKVxuXHRcdCMgZ2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbm5lZWRzVXBkYXRlID0gdHJ1ZVxuXHRcdCMgZ2VvbWV0cnkuYXR0cmlidXRlcy5ub3JtYWwubmVlZHNVcGRhdGUgPSB0cnVlXG5cdFx0Z2VvbWV0cnkuY29tcHV0ZVRhbmdlbnRzKCk7XG5cdFx0Z2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKVxuXHRcdGdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpXG5cdFx0Z2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKClcblx0XHRnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpXG5cdFx0Z2VvbWV0cnkuY29tcHV0ZVRhbmdlbnRzKClcblx0XHRnZW9tZXRyeS5jb21wdXRlTW9ycGhOb3JtYWxzKClcblx0XHRnZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlXG5cdFx0Z2VvbWV0cnkubm9ybWFsc05lZWRVcGRhdGUgPSB0cnVlXG5cdFx0Z2VvbWV0cnkuZWxlbWVudHNOZWVkVXBkYXRlID0gdHJ1ZTtcblx0XHRnZW9tZXRyeS50YW5nZW50c05lZWRVcGRhdGUgPSB0cnVlO1xuXG5cdFx0bWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbClcblx0XHRtZXNoLnBvc2l0aW9uLnogPSAtMTAwMFxuXHRcdFN0YWdlM2QuYWRkKG1lc2gpXG5cblx0XHRtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IHdpcmVmcmFtZTp0cnVlLGNvbG9yOjAsdHJhbnNwYXJlbnQ6dHJ1ZSxvcGFjaXR5Oi4xfSlcblx0XHRtYXRlcmlhbC5zaGFkaW5nID0gVEhSRUUuRmxhdFNoYWRpbmdcblx0XHRtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKVxuXHRcdG1lc2gucG9zaXRpb24ueiA9IC05NTBcblx0XHRtZXNoLnBvc2l0aW9uLnkgKz0gMTBcblx0XHRTdGFnZTNkLmFkZChtZXNoKVxuXG5cdFx0QGJhY2tncm91bmRHZW9tZXRyeSA9IGdlb21ldHJ5XG5cblx0XHRyZXR1cm5cblxuXHRjcmVhdGVMaWdodDooKT0+XG5cdFx0QGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHgzMzMzMzMpXG5cdFx0QGFtYmllbnRMaWdodDIgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4RkZGRkZGKVxuXHRcdFxuXHRcdEBjYW1lcmFMaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4MjIxMTk5LCAyLCAyMDAwKVxuXHRcdEBjYW1lcmFMaWdodC5wb3NpdGlvbi5zZXQoIDAsIC0xMDAwLCAwICk7XG5cblx0XHRAY2FtZXJhTGlnaHQzID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHgyMjMzQUEsIDIsIDI0MDApXG5cdFx0QGNhbWVyYUxpZ2h0My5wb3NpdGlvbi5zZXQoIDEwMDAsIDAsIDAgKTtcblxuXHRcdEBjYW1lcmFMaWdodDIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDIyMTFBQSwgMSwgMjQwMClcblx0XHRAY2FtZXJhTGlnaHQyLnBvc2l0aW9uLnNldCggLTE1MDAsIDAsIDAgKTtcblxuXHRcdEBjYW1lcmFMaWdodDQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDIyMjI3NywgMiwgMjQwMClcblx0XHRAY2FtZXJhTGlnaHQ0LnBvc2l0aW9uLnNldCggMCwgMTAwMCwgMCApO1xuXG5cdFx0QGNhbWVyYUxpZ2h0NSA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4RkZGRkZGLCAxLCAyMDApXG5cdFx0QGNhbWVyYUxpZ2h0NS5wb3NpdGlvbi5zZXQoIDAsIDAsIDAgKTtcblxuXHRcdFN0YWdlM2QuYWRkKEBhbWJpZW50TGlnaHQpXG5cdFx0U3RhZ2UzZC5hZGQoQGNhbWVyYUxpZ2h0KVxuXHRcdFN0YWdlM2QuYWRkKEBjYW1lcmFMaWdodDMpXG5cdFx0U3RhZ2UzZC5hZGQoQGNhbWVyYUxpZ2h0Milcblx0XHRTdGFnZTNkLmFkZChAY2FtZXJhTGlnaHQ0KVxuXHRcdFN0YWdlM2QuYWRkKEBjYW1lcmFMaWdodDUpXG5cblx0XHRTdGFnZTNkLmFkZChAYW1iaWVudExpZ2h0MixmYWxzZSlcblxuXHRcdHJldHVyblxuXG5cdGNyZWF0ZUdyaWRzMTooKT0+XG5cdFx0cCA9IEBwb3NpdGlvbnMuZ3JpZDEgPSB7XG5cdFx0XHRmcmFnbWVudHM6W10gXG5cdFx0XHRkaWFtb25kOkBkaWFtb25kLnBvc2l0aW9uLmNsb25lKClcblx0XHRcdG1pcnJvcjpAbWlycm9yLnBvc2l0aW9uLmNsb25lKClcblx0XHR9XG5cdFx0Zm9yIGkgaW4gWzAuLi4yNF0gYnkgMVxuXHRcdFx0diA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRcdHYueCA9ICgtOCooKGkrMSklNSkpXG5cdFx0XHR2LnkgPSBNYXRoLmZsb29yKChpKzEpLzUpKjgtMTYuNVxuXHRcdFx0di56ID0gMFxuXHRcdFx0cC5mcmFnbWVudHMucHVzaCh2KVxuXG5cdFx0cC5kaWFtb25kLnggKz0gMjBcblx0XHRwLm1pcnJvci54ICs9IDIwXG5cdFx0cmV0dXJuXG5cblx0Y3JlYXRlR3JpZHMyOigpPT5cblx0XHRwID0gQHBvc2l0aW9ucy5ncmlkMiA9IHtcblx0XHRcdGZyYWdtZW50czpbXSBcblx0XHRcdGRpYW1vbmQ6QGRpYW1vbmQucG9zaXRpb24uY2xvbmUoKVxuXHRcdFx0bWlycm9yOkBtaXJyb3IucG9zaXRpb24uY2xvbmUoKVxuXHRcdH1cblx0XHRmb3IgaSBpbiBbMC4uLjI0XSBieSAxXG5cdFx0XHR2ID0gbmV3IFRIUkVFLlZlY3RvcjMoKVxuXHRcdFx0di54ID0gKC04KihpJTgpKSsyOFxuXHRcdFx0di55ID0gTWF0aC5mbG9vcihpLzgpKjgtMTBcblx0XHRcdHYueiA9IDBcblx0XHRcdHAuZnJhZ21lbnRzLnB1c2godilcblxuXHRcdHAuZGlhbW9uZC55ICs9IDE1XG5cdFx0cC5taXJyb3IueSArPSAxNVxuXHRcdHJldHVyblxuXG5cdGNyZWF0ZUdyaWRzMzooKT0+XG5cdFx0cCA9IEBwb3NpdGlvbnMuZ3JpZDMgPSB7XG5cdFx0XHRmcmFnbWVudHM6W10gXG5cdFx0XHRkaWFtb25kOkBkaWFtb25kLnBvc2l0aW9uLmNsb25lKClcblx0XHRcdG1pcnJvcjpAbWlycm9yLnBvc2l0aW9uLmNsb25lKClcblx0XHR9XG5cdFx0Zm9yIGkgaW4gWzAuLi4yNF0gYnkgMVxuXHRcdFx0diA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRcdHYueCA9ICgtOSooKGkrMSklNSkpKzE1XG5cdFx0XHR2LnkgPSBNYXRoLmZsb29yKChpKzEpLzUpKjktMTYuNVxuXHRcdFx0di56ID0gMFxuXHRcdFx0cC5mcmFnbWVudHMucHVzaCh2KVxuXG5cdFx0IyBwLmRpYW1vbmQueCArPSAyMFxuXHRcdCMgcC5taXJyb3IueCArPSAyMFxuXHRcdHJldHVyblxuXG5cdGNyZWF0ZUdyaWRzNDooKT0+XG5cdFx0cCA9IEBwb3NpdGlvbnMuZ3JpZDQgPSB7XG5cdFx0XHRmcmFnbWVudHM6W10gXG5cdFx0XHRkaWFtb25kOkBkaWFtb25kLnBvc2l0aW9uLmNsb25lKClcblx0XHRcdG1pcnJvcjpAbWlycm9yLnBvc2l0aW9uLmNsb25lKClcblx0XHR9XG5cdFx0YW5nbGUgPSBNYXRoLlBJLzJcblx0XHRhbmdsZVN0ZXAgPSBNYXRoLlBJKjIvMjRcblx0XHRyYWRpdXMgPSAyMlxuXHRcdGZvciBpIGluIFswLi4uMjRdIGJ5IDFcblx0XHRcdHYgPSBuZXcgVEhSRUUuVmVjdG9yMygpXG5cdFx0XHR2LnggPSBNYXRoLmNvcyhhbmdsZSkqKHJhZGl1cytNYXRoLnNpbihhbmdsZSo4KSo1KVxuXHRcdFx0di55ID0gTWF0aC5zaW4oYW5nbGUpKihyYWRpdXMrTWF0aC5zaW4oYW5nbGUqOCkqNSlcblx0XHRcdHYueiA9IDBcblx0XHRcdGFuZ2xlICs9IGFuZ2xlU3RlcFxuXHRcdFx0cC5mcmFnbWVudHMucHVzaCh2KVxuXG5cdFx0cmV0dXJuXG5cblx0Y3JlYXRlUG9ydHJhaXRQb3NpdGlvbjooKT0+XG5cdFx0cCA9IEBwb3NpdGlvbnMucG9ydHJhaXQgPSB7XG5cdFx0XHRmcmFnbWVudHM6W10gXG5cdFx0XHRkaWFtb25kOkBkaWFtb25kLnBvc2l0aW9uLmNsb25lKClcblx0XHRcdG1pcnJvcjpAbWlycm9yLnBvc2l0aW9uLmNsb25lKClcblx0XHR9XG5cdFx0Zm9yIGkgaW4gWzAuLi4yNF0gYnkgMVxuXHRcdFx0diA9IEBmcmFnbWVudHNbaV0ucG9zaXRpb24uY2xvbmUoKVxuXHRcdFx0di54ICo9IC43NVxuXHRcdFx0di55ICo9IDEuM1xuXHRcdFx0cC5mcmFnbWVudHMucHVzaCh2KVxuXHRcdHJldHVyblxuXG5cdGNyZWF0ZU1vYmlsZVBvc2l0aW9uOigpPT5cblx0XHRwID0gQHBvc2l0aW9ucy5tb2JpbGUgPSB7XG5cdFx0XHRmcmFnbWVudHM6W10gXG5cdFx0XHRkaWFtb25kOkBkaWFtb25kLnBvc2l0aW9uLmNsb25lKClcblx0XHRcdG1pcnJvcjpAbWlycm9yLnBvc2l0aW9uLmNsb25lKClcblx0XHR9XG5cdFx0Zm9yIGkgaW4gWzAuLi4yNF0gYnkgMVxuXHRcdFx0diA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRcdHYueCA9ICgzMCooKGkrMSklMikpLTE1XG5cdFx0XHR2LnkgPSAoMTItTWF0aC5mbG9vcigoaSkvMikpKi0yMCsxMFxuXHRcdFx0di56ID0gMFxuXHRcdFx0cC5mcmFnbWVudHMucHVzaCh2KVxuXG5cdFx0cC5kaWFtb25kLnkgKz0gMjBcblx0XHRwLm1pcnJvci55ICs9IDIwXG5cdFx0cmV0dXJuXG5cblxuXHRhZGRFdmVudDooKT0+XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsKGUpPT5cblx0XHRcdEBtb3VzZS54ID0gKGUuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIDIgLSAxXG5cdFx0XHRAbW91c2UueSA9IC0oZS5jbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0KSAqIDIgKyAxXG5cdFx0LGZhbHNlKVxuXHRcdHJldHVyblxuXG5cdG9uRGlhbW9uZExvYWQ6KGdlb21ldHJ5KT0+XG5cdFx0QGNvbXB1dGVHZW9tZXRyeShnZW9tZXRyeSlcblxuXHRcdG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe2NvbG9yOiAweGZmZmZmZiwgdHJhbnNwYXJlbnQ6dHJ1ZSwgbGlnaHQ6ZmFsc2UsIGVudk1hcDpAZW52TWFwLCBkZXB0aFdyaXRlOnRydWUsIGRlcHRoVGVzdDp0cnVlfSlcblx0XHRcblx0XHRtYXRlcmlhbC5tYXAgPSBAbWFwXG5cdFx0bWF0ZXJpYWwuc2hhZGluZyA9IEBzaGFkaW5nXG5cdFx0bWF0ZXJpYWwub3BhY2l0eSA9IC42NVxuXHRcdG1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlXG5cdFx0bWF0ZXJpYWwuY29tYmluZSA9IFRIUkVFLk1peE9wZXJhdGlvblxuXG5cdFx0bWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKVxuXHRcdG1hdHJpeC5tYWtlU2NhbGUoIC4yLCAuMiwgLjIgKVxuXHRcdGdlb21ldHJ5LmFwcGx5TWF0cml4ICggbWF0cml4IClcblx0XHRAZGlhbW9uZCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LG1hdGVyaWFsKVxuXHRcdEBjb250YWluZXIuYWRkKEBkaWFtb25kKVxuXG5cdFx0Zm9sZGVyID0gQGd1aS5hZGRGb2xkZXIoJ2RpYW1vbmQnKVxuXHRcdGZvbGRlci5hZGQobWF0ZXJpYWwsICdkZXB0aFdyaXRlJylcblx0XHRmb2xkZXIuYWRkKG1hdGVyaWFsLCAnZGVwdGhUZXN0Jylcblx0XHRmb2xkZXIuYWRkKG1hdGVyaWFsLCAnb3BhY2l0eScsIDAsIDEpXG5cdFx0Zm9sZGVyLmFkZChtYXRlcmlhbCwgJ3JlZmxlY3Rpdml0eScsMCwxKVxuXHRcdEBkaWFtb25kQ29sb3IgPSAweGZmZmZmZlxuXHRcdGZvbGRlci5hZGQoQGRpYW1vbmQubWF0ZXJpYWwsICdjb21iaW5lJywge211bHRpcGx5OlRIUkVFLk11bHRpcGx5LG1peDpUSFJFRS5NaXhPcGVyYXRpb24sYWRkOlRIUkVFLkFkZE9wZXJhdGlvbn0pXG5cdFx0Zm9sZGVyLmFkZENvbG9yKEAsICdkaWFtb25kQ29sb3InKS5vbkNoYW5nZSgoKT0+XG5cdFx0XHRAZGlhbW9uZC5tYXRlcmlhbC5jb2xvci5zZXRIZXgoQGRpYW1vbmRDb2xvcilcblx0XHQpXG5cblx0XHRAcG9zaXRpb25zLmJhc2UuZGlhbW9uZCA9IEBkaWFtb25kLnBvc2l0aW9uLmNsb25lKClcblx0XHRyZXR1cm5cblxuXHRvbk1pcnJvckxvYWQ6KGdlb21ldHJ5KT0+XG5cdFx0QGNvbXB1dGVHZW9tZXRyeShnZW9tZXRyeSlcblx0XHRcblx0XHRtYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpXG5cdFx0bWF0cml4Lm1ha2VTY2FsZSggLjIsIC4yLCAuMiApXG5cdFx0Z2VvbWV0cnkuYXBwbHlNYXRyaXggKCBtYXRyaXggKVxuXG5cdFx0bWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IDB4ZmZmZmZmLCBsaWdodDpmYWxzZSwgdHJhbnNwYXJlbnQ6dHJ1ZSwgZW52TWFwOkBlbnZNYXAsIGRlcHRoV3JpdGU6dHJ1ZSwgZGVwdGhUZXN0OnRydWV9KVxuXHRcdG1hdGVyaWFsLm1hcCA9IEBtYXBcblx0XHRtYXRlcmlhbC5zaGFkaW5nID0gQHNoYWRpbmdcblx0XHRtYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZVxuXHRcdG1hdGVyaWFsLmNvbWJpbmUgPSBUSFJFRS5BZGRPcGVyYXRpb25cblx0XHRtYXRlcmlhbC5yZWZsZWN0aXZpdHkgPSAuNDFcblx0XHRtYXRlcmlhbC5vcGFjaXR5ID0gMC43N1xuXG5cdFx0QG1pcnJvciA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LG1hdGVyaWFsKVxuXHRcdEBjb250YWluZXIuYWRkKEBtaXJyb3IpXG5cblx0XHRmb2xkZXIgPSBAZ3VpLmFkZEZvbGRlcignbWlycm9yJylcblx0XHRmb2xkZXIuYWRkKEBtaXJyb3IubWF0ZXJpYWwsICdkZXB0aFdyaXRlJylcblx0XHRmb2xkZXIuYWRkKEBtaXJyb3IubWF0ZXJpYWwsICdkZXB0aFRlc3QnKVxuXHRcdGZvbGRlci5hZGQoQG1pcnJvci5tYXRlcmlhbCwgJ29wYWNpdHknLCAwLCAxKVxuXHRcdGZvbGRlci5hZGQoQG1pcnJvci5tYXRlcmlhbCwgJ3JlZmxlY3Rpdml0eScsMCwxKVxuXG5cdFx0QG1pcnJvckNvbG9yID0gMHhmZmZmZmZcblx0XHRmb2xkZXIuYWRkKEBtaXJyb3IubWF0ZXJpYWwsICdjb21iaW5lJywge211bHRpcGx5OlRIUkVFLk11bHRpcGx5LG1peDpUSFJFRS5NaXhPcGVyYXRpb24sYWRkOlRIUkVFLkFkZE9wZXJhdGlvbn0pXG5cdFx0Zm9sZGVyLmFkZENvbG9yKEAsICdtaXJyb3JDb2xvcicpLm9uQ2hhbmdlKCgpPT5cblx0XHRcdEBtaXJyb3IubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KEBtaXJyb3JDb2xvcilcblx0XHQpXG5cblx0XHRAcG9zaXRpb25zLmJhc2UubWlycm9yID0gQG1pcnJvci5wb3NpdGlvbi5jbG9uZSgpXG5cdFx0XG5cdFx0cmV0dXJuXG5cblx0b25GcmFnbWVudExvYWRlZDooc2NlbmUpPT5cblxuXHRcdEBmcmFnbWVudHMgPSBbXVxuXHRcdEBoaXRib3hzID0gW11cblx0XHRoaXRib3hHZW8gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoNClcblx0XHRoaXRib3hNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6MCx3aXJlZnJhbWU6dHJ1ZSxvcGFjaXR5Oi4zLHRyYW5zcGFyZW50OnRydWV9KVxuXG5cdFx0QGJhc2VQb3NpdGlvbiA9IFtdXG5cblx0XHRmb3IgaywgdiBvZiBzY2VuZS5vYmplY3RzXG5cblx0XHRcdG8gPSB2XG5cdFx0XHRvLm5hbWUgPSBvLm5hbWUuc3Vic3RyaW5nKG8ubmFtZS5sZW5ndGgtMilcblxuXHRcdFx0QGNvbXB1dGVHZW9tZXRyeShvLmdlb21ldHJ5KVxuXHRcdFx0bWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IDB4ZmZmZmZmLCB0cmFuc3BhcmVudDp0cnVlLCBlbnZNYXA6QGVudk1hcCwgZGVwdGhXcml0ZTp0cnVlLCBkZXB0aFRlc3Q6dHJ1ZX0pXG5cdFx0XHRtYXRlcmlhbC5zaGFkaW5nID0gQHNoYWRpbmdcblx0XHRcdG1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlXG5cdFx0XHRtYXRlcmlhbC5jb21iaW5lID0gVEhSRUUuQWRkT3BlcmF0aW9uXG5cdFx0XHRtYXRlcmlhbC5yZWZsZWN0aXZpdHkgPSAuNDFcblx0XHRcdG1hdGVyaWFsLm9wYWNpdHkgPSAwLjhcblxuXHRcdFx0by5tYXRlcmlhbCA9IG1hdGVyaWFsXG5cdFx0XHRtYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpXG5cdFx0XHRtYXRyaXgubWFrZVNjYWxlKCAuMjMsIC4yMywgLjIzIClcblx0XHRcdG8uZ2VvbWV0cnkuYXBwbHlNYXRyaXgoIG1hdHJpeCApXG5cdFx0XHRvLnBvc2l0aW9uLm11bHRpcGx5U2NhbGFyKC4yMSlcblx0XHRcdG8ucG9zaXRpb24ueSAtPSAyMFxuXHRcdFx0by5wb3NpdGlvbi56ICs9IDVcblx0XHRcdGlmIHBhcnNlSW50KG8ubmFtZSkgPiBAbWF4RGF0ZVxuXHRcdFx0XHRvLm1hdGVyaWFsLm9wYWNpdHkgPSAwLjNcblx0XHRcdGVsc2Vcblx0XHRcdFx0bWF0ZXJpYWwubWFwID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZShcIi4vM2QvdGV4dHVyZXMvcHJldmlld1wiK28ubmFtZStcIi5qcGdcIilcblx0XHRcdFxuXHRcdFx0aGl0Ym94ID0gbmV3IFRIUkVFLk1lc2goaGl0Ym94R2VvLGhpdGJveE1hdGVyaWFsKVxuXHRcdFx0aGl0Ym94LnBvc2l0aW9uLmNvcHkoby5wb3NpdGlvbilcblx0XHRcdGhpdGJveC52aXNpYmxlID0gQGhpdGJveFZpc2libGVcblx0XHRcdGhpdGJveC5mcmFnbWVudCA9IG9cblx0XHRcdEBoaXRib3hzLnB1c2goaGl0Ym94KVxuXHRcdFx0U3RhZ2UzZC5hZGQoaGl0Ym94KVxuXG5cdFx0XHRAcG9zaXRpb25zLmJhc2UuZnJhZ21lbnRzLnB1c2goby5wb3NpdGlvbi5jbG9uZSgpKVxuXG5cdFx0XHRAY29tcHV0ZUdlb21ldHJ5KG8uZ2VvbWV0cnkpXG5cdFx0XHRAZnJhZ21lbnRzLnB1c2gobylcblx0XHRcdFN0YWdlM2QuYWRkKG8pXG5cdFx0XG5cdFx0Zm9yIGkgaW4gWzAuLi4yNF0gYnkgMVxuXHRcdFx0QGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0uY29weShAaGl0Ym94c1tpXS5wb3NpdGlvbilcblxuXHRcdEBwb3NpdGlvbiA9IEBiYXNlUG9zaXRpb25cblx0XHRAY3JlYXRlR3JpZHMxKClcblx0XHRAY3JlYXRlR3JpZHMyKClcblx0XHRAY3JlYXRlR3JpZHMzKClcblx0XHRAY3JlYXRlR3JpZHM0KClcblx0XHRAY3JlYXRlTW9iaWxlUG9zaXRpb24oKVxuXHRcdEBjcmVhdGVQb3J0cmFpdFBvc2l0aW9uKClcblx0XHRyZXR1cm5cblxuXHRjcmVhdGVHVUk6KCk9PlxuXHRcdEBndWkgPSBuZXcgZGF0LkdVSSgpXG5cdFx0QHRleHR1cmVzID0gbnVsbFxuXG5cdFx0QG1hcHMgPSBbXVxuXHRcdEBlbnZNYXBzID0gW11cblxuXHRcdEBndWkuYWRkKEAsJ3RleHR1cmVzJyx7eHAxOicwJyx4cDI6JzEnLHhwMzonMid9KS5vbkNoYW5nZSgoZSk9PlxuXHRcdFx0QG1pcnJvci5tYXRlcmlhbC5tYXAgPSBAbWFwc1tAdGV4dHVyZXNdXG5cdFx0XHRAZGlhbW9uZC5tYXRlcmlhbC5lbnZNYXAgPSBAZW52TWFwc1tAdGV4dHVyZXNdXG5cdFx0XHRAbWlycm9yLm1hdGVyaWFsLmVudk1hcHMgPSBAZW52TWFwc1tAdGV4dHVyZXNdXG5cdFx0XHRAbWlycm9yLm1hdGVyaWFsLm5lZWRzVXBkYXRlID0gdHJ1ZVxuXHRcdFx0QGRpYW1vbmQubWF0ZXJpYWwubmVlZHNVcGRhdGUgPSB0cnVlXG5cdFx0XHRyZXR1cm5cblx0XHQpXG5cdFx0QGhpdGJveFZpc2libGUgPSBmYWxzZVxuXG5cdFx0QGd1aS5hZGQoQCwnaGl0Ym94VmlzaWJsZScpLm9uQ2hhbmdlKChlKT0+XG5cdFx0XHRmb3IgaSBpbiBbMC4uLjI0XSBieSAxXG5cdFx0XHRcdEBoaXRib3hzW2ldLnZpc2libGUgPSBAaGl0Ym94VmlzaWJsZVxuXHRcdFx0XG5cdFx0KVxuXG5cdFx0QGdsb2JhbE9wYWNpdHkgPSAxXG5cdFx0QGd1aS5hZGQoQCwnZ2xvYmFsT3BhY2l0eScsMCwxKS5zdGVwKDAuMDEpLm9uQ2hhbmdlKCgpPT5cblx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWJnbCcpLnN0eWxlLm9wYWNpdHkgPSBAZ2xvYmFsT3BhY2l0eVxuXHRcdClcblxuXHRcdEBndWkuYWRkKEAsJ29mZnNldFgnLC0zMCwzMCkuc3RlcCgwLjEpXG5cblx0XHRwb3NpdGlvbnMgPSBAZ3VpLmFkZEZvbGRlcigncG9zaXRpb25zJylcblx0XHRwb3NpdGlvbnMuYWRkKEAsJ25vR3JpZCcpXG5cdFx0cG9zaXRpb25zLmFkZChALCdncmlkMScpXG5cdFx0cG9zaXRpb25zLmFkZChALCdncmlkMicpXG5cdFx0cG9zaXRpb25zLmFkZChALCdncmlkMycpXG5cdFx0cG9zaXRpb25zLmFkZChALCdncmlkNCcpXG5cdFx0cG9zaXRpb25zLmFkZChALCdwb3J0cmFpdCcpXG5cdFx0cG9zaXRpb25zLmFkZChALCdtb2JpbGUnKVxuXG5cdFx0IyBTdGFnZTNkLmluaXRQb3N0cHJvY2Vzc2luZyhAZ3VpKVxuXG5cdFx0cmV0dXJuXG5cblx0dHdlZW5UbzoocG9zaXRpb25zKS0+XG5cdFx0Zm9yIGkgaW4gWzAuLi4yNF0gYnkgMVxuXHRcdFx0diA9IEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldXG5cdFx0XHR2MiA9IHBvc2l0aW9ucy5mcmFnbWVudHNbaV1cblx0XHRcdFxuXHRcdFx0IyBkaWZmID0gdjIuY2xvbmUoKS5zdWIodilcblx0XHRcdFxuXHRcdFx0VHdlZW5MaXRlLnRvKHYsIC44K01hdGgucmFuZG9tKCkqLjMsIHt4OiB2Mi54LCB5OiB2Mi55LCB6OnYyLnosIGVhc2U6QmFjay5lYXNlT3V0fSlcblx0XHRUd2VlbkxpdGUudG8oQGN1cnJlbnRQb3NpdGlvbi5kaWFtb25kLDEuNCx7eDogcG9zaXRpb25zLmRpYW1vbmQueCwgeTogcG9zaXRpb25zLmRpYW1vbmQueSwgejpwb3NpdGlvbnMuZGlhbW9uZC56LCBlYXNlOkV4cG8uZWFzZU91dH0pXG5cdFx0VHdlZW5MaXRlLnRvKEBjdXJyZW50UG9zaXRpb24ubWlycm9yLDEuNCx7eDogcG9zaXRpb25zLm1pcnJvci54LCB5OiBwb3NpdGlvbnMubWlycm9yLnksIHo6cG9zaXRpb25zLm1pcnJvci56LCBlYXNlOkV4cG8uZWFzZU91dH0pXG5cdFx0cmV0dXJuXG5cblx0bm9HcmlkOigpLT5cblx0XHRAdHdlZW5UbyhAcG9zaXRpb25zLmJhc2UpXG5cdFx0cmV0dXJuXG5cblx0Z3JpZDE6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMuZ3JpZDEpXG5cdFx0cmV0dXJuXG5cblx0Z3JpZDI6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMuZ3JpZDIpXG5cdFx0cmV0dXJuXG5cblx0Z3JpZDM6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMuZ3JpZDMpXG5cdFx0cmV0dXJuXG5cblx0Z3JpZDQ6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMuZ3JpZDQpXG5cdFx0cmV0dXJuXG5cblx0cG9ydHJhaXQ6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMucG9ydHJhaXQpXG5cdFx0cmV0dXJuXG5cdFxuXHRtb2JpbGU6KCktPlxuXHRcdEB0d2VlblRvKEBwb3NpdGlvbnMubW9iaWxlKVxuXHRcdHJldHVyblxuXG5cdGFkZFplcm86KG51bWJlcixtaW5MZW5ndGgpLT5cblx0XHRudW1iZXIgPSBudW1iZXIrXCJcIlxuXHRcdHdoaWxlKG51bWJlci5sZW5ndGg8bWluTGVuZ3RoKVxuXHRcdFx0bnVtYmVyID0gXCIwXCIrbnVtYmVyXG5cdFx0cmV0dXJuIG51bWJlclxuXG5cdGNvbXB1dGVHZW9tZXRyeTooZ2VvbWV0cnkpLT5cblx0XHQjIGNvbXB1dGUgdGhlIG1vZGVsXG5cdFx0Z2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKClcblx0XHRnZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKVxuXHRcdGdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKClcblx0XHRnZW9tZXRyeS5jb21wdXRlVGFuZ2VudHMoKVxuXHRcdGdlb21ldHJ5LmNvbXB1dGVNb3JwaE5vcm1hbHMoKVxuXHRcdGdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWVcblx0XHRnZW9tZXRyeS5ub3JtYWxzTmVlZFVwZGF0ZSA9IHRydWVcblx0XHRyZXR1cm5cblxuXHRzaG93WFA6KGluZGV4KS0+XG5cdFx0aWYoaW5kZXggPT0gQGN1cnJlbnRJbmRleCB8fCBwYXJzZUludChpbmRleCkgPiBAbWF4RGF0ZSlcblx0XHRcdHJldHVyblxuXHRcdEBjdXJyZW50SW5kZXggPSBpbmRleFxuXHRcdHVybCA9IFwiLi8zZC90ZXh0dXJlcy9wcmV2aWV3XCIraW5kZXgrXCIuanBnXCJcblx0XHR0ZXh0dXJlID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSh1cmwpXG5cdFx0dGV4dHVyZUN1YmUgPSBUSFJFRS5JbWFnZVV0aWxzLmxvYWRUZXh0dXJlQ3ViZShbdXJsLHVybCx1cmwsdXJsLHVybCx1cmxdKVxuXHRcdHRleHR1cmVDdWJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0XHRAbWlycm9yLm1hdGVyaWFsLm1hcCA9IHRleHR1cmVcblx0XHRAbWlycm9yLm1hdGVyaWFsLmVudk1hcCA9IHRleHR1cmVDdWJlXG5cdFx0Y29uc29sZS5sb2coQG1pcnJvci5tYXRlcmlhbClcblx0XHRjb25zb2xlLmxvZyhAZGlhbW9uZC5tYXRlcmlhbClcblx0XHRAZGlhbW9uZC5tYXRlcmlhbC5lbnZNYXAgPSB0ZXh0dXJlQ3ViZVxuXHRcdEBkaWFtb25kLm1hdGVyaWFsLm5lZWRzVXBkYXRlID0gdHJ1ZVxuXHRcdEBtaXJyb3IubWF0ZXJpYWwubmVlZHNVcGRhdGUgPSB0cnVlXG5cdFx0cmV0dXJuXG5cblx0cGF1c2U6KCktPlxuXHRcdHJldHVyblxuXG5cdHJlc3VtZTooKS0+XG5cdFx0cmV0dXJuXG5cblx0dXBkYXRlOihkdCktPlxuXG5cdFx0QHRpbWUgKz0gZHRcblxuXHRcdHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCBAbW91c2UueCwgQG1vdXNlLnksIC41IClcblx0XHR2ZWN0b3IudW5wcm9qZWN0KCBTdGFnZTNkLmNhbWVyYSApXG5cdFx0cmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlciggU3RhZ2UzZC5jYW1lcmEucG9zaXRpb24sIHZlY3Rvci5zdWIoIFN0YWdlM2QuY2FtZXJhLnBvc2l0aW9uICkubm9ybWFsaXplKCkgKVxuXHRcdHQgPSBAdGltZVxuXG5cdFx0aWYoQGRpYW1vbmQgJiYgQGN1cnJlbnRQb3NpdGlvbi5kaWFtb25kKVxuXHRcdFx0QGRpYW1vbmQucG9zaXRpb24uY29weShAY3VycmVudFBvc2l0aW9uLmRpYW1vbmQpXG5cdFx0XHRAZGlhbW9uZC5wb3NpdGlvbi54ICs9IEBvZmZzZXRYXG5cdFxuXHRcdGlmKEBtaXJyb3IgJiYgQGN1cnJlbnRQb3NpdGlvbi5taXJyb3IpXG5cdFx0XHRAbWlycm9yLnBvc2l0aW9uLmNvcHkoQGN1cnJlbnRQb3NpdGlvbi5taXJyb3IpXG5cdFx0XHRAbWlycm9yLnBvc2l0aW9uLnggKz0gQG9mZnNldFhcblxuXHRcdGlmKEBtaXJyb3IgJiYgQGRpYW1vbmQpXG5cdFx0XHRzID0gMSArIE1hdGguY29zKHQvMTI1MCkqLjAyXG5cdFx0XHRAZGlhbW9uZC5zY2FsZS5zZXQocyxzLHMpXG5cdFx0XHRAZGlhbW9uZC5wb3NpdGlvbi55ICs9IE1hdGguc2luKHQvMTUwMCkqLjVcblx0XHRcdEBtaXJyb3Iuc2NhbGUuc2V0KHMscyxzKVxuXHRcdFx0QG1pcnJvci5wb3NpdGlvbi55ICs9IE1hdGguc2luKHQvMTUwMCkqLjVcblxuXHRcdGZvciBpIGluIFswLi4uQGhpdGJveHMubGVuZ3RoXSBieSAxXG5cdFx0XHRkaXN0YW5jZSA9IG5ldyBUSFJFRS5WZWN0b3IzKClcblx0XHRcdGR4ID0gQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0ueCAtIEBkaWFtb25kLnBvc2l0aW9uLnhcblx0XHRcdGR5ID0gQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0ueSAtIEBkaWFtb25kLnBvc2l0aW9uLnlcblx0XHRcdGR6ID0gQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0ueiAtIEBkaWFtb25kLnBvc2l0aW9uLnpcblx0XHRcdGRpc3RhbmNlLnNldChNYXRoLnNxcnQoZHgqZHgpLE1hdGguc3FydChkeSpkeSksTWF0aC5zcXJ0KGR6KmR6KSlcblx0XHRcdCMgQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0ueiA9XG5cdFx0XHRAaGl0Ym94c1tpXS5wb3NpdGlvbi5jb3B5KEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldIClcblx0XHRcdGlmKGRpc3RhbmNlLnggPCAxNy41KVxuXHRcdFx0XHRAaGl0Ym94c1tpXS5wb3NpdGlvbi56ID0gTWF0aC5tYXgoQGhpdGJveHNbaV0ucG9zaXRpb24ueiwxNClcblx0XHRcdGVsc2UgaWYoZGlzdGFuY2UueCA8IDI5KVxuXHRcdFx0XHRAaGl0Ym94c1tpXS5wb3NpdGlvbi56ID0gTWF0aC5tYXgoQGhpdGJveHNbaV0ucG9zaXRpb24ueiwoMS0oZGlzdGFuY2UueC0xNCkvMTUpKjE0KzIpXG5cdFx0XHQjIEBoaXRib3hzW2ldLnBvc2l0aW9uLnggKz0gKEBjdXJyZW50UG9zaXRpb24uZnJhZ21lbnRzW2ldLnggLSBAaGl0Ym94c1tpXS5wb3NpdGlvbi54KSouMDVcblx0XHRcdCMgQGhpdGJveHNbaV0ucG9zaXRpb24ueSArPSAoQGN1cnJlbnRQb3NpdGlvbi5mcmFnbWVudHNbaV0ueSAtIEBoaXRib3hzW2ldLnBvc2l0aW9uLnkpKi4wNVxuXHRcdFx0IyBAaGl0Ym94c1tpXS5wb3NpdGlvbi56ICs9IChAY3VycmVudFBvc2l0aW9uLmZyYWdtZW50c1tpXS56IC0gQGhpdGJveHNbaV0ucG9zaXRpb24ueikqLjA1XG5cdFx0XHRAaGl0Ym94c1tpXS5wb3NpdGlvbi54ICs9IEBvZmZzZXRYXG5cblx0XHR0ID0gQHRpbWVcblx0XHRmb3IgaSBpbiBbMC4uLkBmcmFnbWVudHMubGVuZ3RoXSBieSAxXG5cdFx0XHR0Kz03NDdcblx0XHRcdEBmcmFnbWVudHNbaV0ucG9zaXRpb24ueSA9IEBoaXRib3hzW2ldLnBvc2l0aW9uLnkrTWF0aC5zaW4odC8zNTApKjEuMVxuXHRcdFx0QGZyYWdtZW50c1tpXS5wb3NpdGlvbi54ID0gQGhpdGJveHNbaV0ucG9zaXRpb24ueCtNYXRoLmNvcyh0LzQ1MCkqLjVcblx0XHRcdEBmcmFnbWVudHNbaV0ucG9zaXRpb24ueiA9IEBoaXRib3hzW2ldLnBvc2l0aW9uLnpcblx0XHRcblx0XHRpZihAaGl0Ym94cylcblx0XHRcdGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyggQGhpdGJveHMsIGZhbHNlIClcblx0XHRcdGlmKCBpbnRlcnNlY3RzLmxlbmd0aCA+IDAgKVxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJ1xuXHRcdFx0XHRmcmFnID0gaW50ZXJzZWN0c1swXS5vYmplY3QuZnJhZ21lbnRcblx0XHRcdFx0QGN1cnJlbnRGcmFnbWVudCA9IGZyYWdcblx0XHRcdFx0QHNob3dYUChmcmFnLm5hbWUpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ2F1dG8nXG5cdFx0XHRcdEBjdXJyZW50RnJhZ21lbnQgPSBudWxsXG5cblx0XHRpZiBAY3VycmVudEZyYWdtZW50XG5cdFx0XHRAY3VycmVudEZyYWdtZW50LnNjYWxlLnggKz0gKDEuNC1AY3VycmVudEZyYWdtZW50LnNjYWxlLngpKi4wNVxuXHRcdFx0QGN1cnJlbnRGcmFnbWVudC5zY2FsZS55ID0gQGN1cnJlbnRGcmFnbWVudC5zY2FsZS54XG5cdFx0XHRAY3VycmVudEZyYWdtZW50LnNjYWxlLnogPSBAY3VycmVudEZyYWdtZW50LnNjYWxlLnhcblxuXHRcdGZvciBpIGluIFswLi4uQGZyYWdtZW50cy5sZW5ndGhdIGJ5IDFcblx0XHRcdGYgPSBAZnJhZ21lbnRzW2ldXG5cdFx0XHRpZiBmICE9IEBjdXJyZW50RnJhZ21lbnRcblx0XHRcdFx0Zi5zY2FsZS54ICs9ICgxLWYuc2NhbGUueCkqLjA5XG5cdFx0XHRcdGYuc2NhbGUueSA9IGYuc2NhbGUueFxuXHRcdFx0XHRmLnNjYWxlLnogPSBmLnNjYWxlLnhcblxuXHRcdCMgQGNhbWVyYUxpZ2h0LnBvc2l0aW9uLnggPSBNYXRoLmNvcyhAdGltZSowLjAwMSkqMTAwXG5cdFx0IyBAY2FtZXJhTGlnaHQyLnBvc2l0aW9uLnggPSBNYXRoLmNvcyhAdGltZSowLjAwMTUpKjEyMFxuXHRcdCMgQGNhbWVyYUxpZ2h0Mi5wb3NpdGlvbi55ID0gTWF0aC5zaW4oQHRpbWUqMC4wMDE1KSoxMjBcblx0XHQjIEBjb250YWluZXIucm90YXRpb24ueSArPSAoQG1vdXNlLngqTWF0aC5QSS8xNiAtIEBjb250YWluZXIucm90YXRpb24ueSkqLjA5XG5cdFx0IyBAY29udGFpbmVyLnJvdGF0aW9uLnggKz0gKC1AbW91c2UueSpNYXRoLlBJLzE2IC0gQGNvbnRhaW5lci5yb3RhdGlvbi54KSouMDlcblxuXHRcdGlmKEBiYWNrZ3JvdW5kR2VvbWV0cnkpXG5cdFx0XHRnZW9tZXRyeSA9ICBAYmFja2dyb3VuZEdlb21ldHJ5XG5cdFx0XHRzcGVlZHMgPSBbODAwLDcwMCwxMjAwXVxuXHRcdFx0Zm9yIGkgaW4gWzAuLi5nZW9tZXRyeS52ZXJ0aWNlcy5sZW5ndGhdIGJ5IDFcblx0XHRcdFx0diA9IGdlb21ldHJ5LnZlcnRpY2VzW2ldXG5cdFx0XHRcdHYueiArPSBNYXRoLmNvcyhAdGltZS9zcGVlZHNbaSVzcGVlZHMubGVuZ3RoXStNYXRoLlBJLzE2KmkpKjJcblx0XHRcdCMgZm9yIGkgaW4gWzEuLi5nZW9tZXRyeS5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5Lmxlbmd0aF0gYnkgM1xuXHRcdFx0IyBcdGdlb21ldHJ5LmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXlbaSsyXSArPSA1MDAqTWF0aC5yYW5kb20oKVxuXHRcdFx0IyBnZW9tZXRyeS5hdHRyaWJ1dGVzLnBvc2l0aW9ubmVlZHNVcGRhdGUgPSB0cnVlXG5cdFx0XHQjIGdlb21ldHJ5LmF0dHJpYnV0ZXMubm9ybWFsLm5lZWRzVXBkYXRlID0gdHJ1ZVxuXHRcdFx0Z2VvbWV0cnkuY29tcHV0ZVRhbmdlbnRzKCk7XG5cdFx0XHRnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpXG5cdFx0XHRnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKVxuXHRcdFx0Z2VvbWV0cnkuY29tcHV0ZUZhY2VOb3JtYWxzKClcblx0XHRcdGdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKClcblx0XHRcdGdlb21ldHJ5LmNvbXB1dGVUYW5nZW50cygpXG5cdFx0XHRnZW9tZXRyeS5jb21wdXRlTW9ycGhOb3JtYWxzKClcblx0XHRcdGdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWVcblx0XHRcdGdlb21ldHJ5Lm5vcm1hbHNOZWVkVXBkYXRlID0gdHJ1ZVxuXHRcdFx0Z2VvbWV0cnkuZWxlbWVudHNOZWVkVXBkYXRlID0gdHJ1ZTtcblx0XHRcdGdlb21ldHJ5LnRhbmdlbnRzTmVlZFVwZGF0ZSA9IHRydWU7XG5cblx0XHRTdGFnZTNkLmNhbWVyYS5wb3NpdGlvbi54ICs9IChAbW91c2UueCozMCAtIFN0YWdlM2QuY2FtZXJhLnBvc2l0aW9uLngpKi4wM1xuXHRcdHJldHVyblxuIl19