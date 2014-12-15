(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Experiment, Loader, build, experiment, loader, start;

Loader = require("loader/Loader");

Experiment = require("experiment/Experiment");

experiment = null;

build = function() {
  experiment = new Experiment();
  return experiment.build(function() {
    return loader.selectQuality();
  });
};

start = function() {
  var sound;
  loader.hide();
  experiment.update();
  experiment.start(1.25);
  sound = soundManager.play("wind", {
    loops: 1000
  });
  return sound.setVolume(65);
};

loader = new Loader;

loader.on("complete", build);

loader.on("launch", start);

loader.load();



},{"experiment/Experiment":2,"loader/Loader":14}],2:[function(require,module,exports){
var Experiment, ExperimentUI, Scene,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Scene = require("experiment/engine/Scene");

ExperimentUI = require("experiment/ui/ExperimentUI");

Experiment = (function() {
  function Experiment() {
    this._update = __bind(this._update, this);
    this._resize = __bind(this._resize, this);
    this._hXP = 1450;
    this._updateDimensions();
    this._domScene = document.getElementById("scene");
    this._scene = new Scene(this._domScene, this._w, this._hXP);
    this._ui = new ExperimentUI;
    this._resize();
    window.addEventListener("resize", this._resize, false);
  }

  Experiment.prototype._updateDimensions = function() {
    this._w = window.innerWidth;
    return this._h = window.innerHeight;
  };

  Experiment.prototype._resize = function() {
    var h;
    this._updateDimensions();
    h = this._h < this._hXP ? this._hXP : this._h;
    this._scene.resize(this._w, h);
    return TweenLite.set(this._domScene, {
      css: {
        y: this._h - h >> 1,
        force3D: true
      }
    });
  };

  Experiment.prototype.build = function(cb) {
    this._scene.build();
    return setTimeout(function() {
      return cb();
    }, 1200);
  };

  Experiment.prototype.start = function(delay) {
    console.log("start");
    this._scene.start(delay);
    return this._ui.show();
  };

  Experiment.prototype.update = function() {
    return this._update();
  };

  Experiment.prototype._update = function() {
    this._scene.update();
    return requestAnimationFrame(this._update);
  };

  return Experiment;

})();

module.exports = Experiment;



},{"experiment/engine/Scene":6,"experiment/ui/ExperimentUI":11}],3:[function(require,module,exports){
module.exports = {
  isOBJ: false,
  quality: "lq"
};



},{}],4:[function(require,module,exports){
var Interactions,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Interactions = (function() {
  function Interactions() {
    this._downs = {};
    this._moves = {};
    this._ups = {};
    this._interactions = [this._downs, this._moves, this._ups];
    this._isTouchDevice = __indexOf.call(window, "ontouchstart") >= 0 || __indexOf.call(window, "onmsgesturechange") >= 0;
  }

  Interactions.prototype.on = function(elt, action, cb) {
    var evt, obj, proxy;
    evt = this._getEvent(action);
    if (evt === "") {
      return;
    }
    obj = this._getObj(action);
    if (!obj[elt]) {
      obj[elt] = [];
    }
    proxy = function(e) {
      var data;
      data = {};
      if (this._isTouchDevice) {
        data.x = e.touches[0].clientX;
        data.y = e.touches[0].clientY;
      } else {
        data.x = e.clientX;
        data.y = e.clientY;
      }
      return cb.call(this, {
        origin: e,
        x: data.x,
        y: data.y
      });
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
    if (this._isTouchDevice) {
      switch (action) {
        case "down":
          return evt = "touchstart";
        case "move":
          return evt = "touchmove";
        case "up":
          return evt = "touchend";
      }
    } else {
      switch (action) {
        case "down":
          return evt = "mousedown";
        case "move":
          return evt = "mousemove";
        case "up":
          return evt = "mouseup";
      }
    }
  };

  Interactions.prototype._getObj = function(action) {
    var obj;
    switch (action) {
      case "down":
        return obj = this._downs;
      case "move":
        return obj = this._moves;
      case "up":
        return obj = this._ups;
    }
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



},{}],5:[function(require,module,exports){
var CameraControls, interactions,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("experiment/core/interactions");

CameraControls = (function() {
  function CameraControls(camera) {
    this.camera = camera;
    this._updatePosition = __bind(this._updatePosition, this);
    this._onUp = __bind(this._onUp, this);
    this._onMove = __bind(this._onMove, this);
    this._onDown = __bind(this._onDown, this);
    this._vCenter = new THREE.Vector3(0, 80, 0);
    this._a = -0.08;
    this._toA = -0.08;
    this._updatePosition();
  }

  CameraControls.prototype._onDown = function(e) {
    this._lx = e.x;
    this._ly = e.y;
    interactions.on(window, "move", this._onMove);
    return interactions.on(window, "up", this._onUp);
  };

  CameraControls.prototype._onMove = function(e) {
    var dx, sign;
    dx = e.x - this._lx;
    this._lx = e.x;
    sign = dx < 0 ? -1 : 1;
    dx = Math.sqrt(dx * dx);
    if (dx > 15) {
      dx = 15;
    }
    dx *= sign;
    this._toA -= dx * .001;
    if (this._toA < -.73) {
      this._toA = -.73;
    }
    if (this._toA > 1.0035) {
      return this._toA = 1.0035;
    }
  };

  CameraControls.prototype._onUp = function(e) {
    interactions.off(window, "move", this._onMove);
    return interactions.off(window, "up", this._onUp);
  };

  CameraControls.prototype._updatePosition = function() {
    this.camera.position.x = Math.sin(this._a) * 90;
    this.camera.position.z = Math.cos(this._a) * 90;
    return this.camera.lookAt(this._vCenter);
  };

  CameraControls.prototype.start = function(delay) {
    return TweenLite.to(this._vCenter, 3, {
      delay: delay,
      y: 10,
      ease: Cubic.easeInOut,
      onUpdate: this._updatePosition,
      onComplete: (function(_this) {
        return function() {
          return interactions.on(window, "down", _this._onDown);
        };
      })(this)
    });
  };

  CameraControls.prototype.update = function() {
    var a;
    a = this._a;
    this._a += (this._toA - this._a) * .25;
    if (this._a - a === 0) {
      return;
    }
    return this._updatePosition();
  };

  CameraControls.prototype.getAngle = function() {
    return this._a;
  };

  return CameraControls;

})();

module.exports = CameraControls;



},{"experiment/core/interactions":4}],6:[function(require,module,exports){
var Bg, CameraControls, Grass, Rubans, Scene, Sky, Village, conf, overlayShader, seasonManager,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

CameraControls = require("experiment/engine/CameraControls");

Village = require("experiment/village/Village");

Rubans = require("experiment/village/Rubans");

Grass = require("experiment/landscape/Grass");

Sky = require("experiment/landscape/Sky");

Bg = require("experiment/landscape/Bg");

seasonManager = require("experiment/engine/seasonManager");

conf = require("experiment/core/conf");

overlayShader = require("shaders/OverlayShader");

Scene = (function() {
  function Scene(dom, _w, _h) {
    this.dom = dom;
    this._w = _w;
    this._h = _h;
    this._onSeasonChanging = __bind(this._onSeasonChanging, this);
    this._initEngine();
    this._initPostProcessing();
    this._initLights();
    this._domLayerAutumn = document.querySelector(".layer--autumn");
    this._domLayerWinter = document.querySelector(".layer--winter");
    seasonManager.on("changing", this._onSeasonChanging);
  }

  Scene.prototype._initEngine = function() {
    this.scene = new THREE.Scene;
    this.camera = new THREE.PerspectiveCamera(50, this._w / this._h, 1, 5000);
    this.camera.position.y = 12;
    this._cameraControls = new CameraControls(this.camera);
    this.renderer = new THREE.WebGLRenderer;
    this.renderer.setSize(this._w, this._h);
    this.renderer.setClearColor(0x037cba);
    return this.dom.appendChild(this.renderer.domElement);
  };

  Scene.prototype._initPostProcessing = function() {
    var pass;
    this._renderTarget = new THREE.WebGLRenderTarget(this._w * window.devicePixelRatio, this._h * window.devicePixelRatio, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    });
    this._composer = new THREE.EffectComposer(this.renderer, this._renderTarget);
    pass = new THREE.RenderPass(this.scene, this.camera);
    this._composer.addPass(pass);
    this._passFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    this._passFXAA.uniforms.resolution.value.x = 1 / this._w / window.devicePixelRatio;
    this._passFXAA.uniforms.resolution.value.y = 1 / this._h / window.devicePixelRatio;
    this._passFXAA.renderToScreen = true;
    return this._composer.addPass(this._passFXAA);
  };

  Scene.prototype._initLights = function() {
    this._lightAmbient = new THREE.AmbientLight(0xffffff);
    return this.scene.add(this._lightAmbient);
  };

  Scene.prototype._createScene = function() {};

  Scene.prototype.build = function() {
    this._sky = new Sky;
    this._sky.position.x = 7;
    this.scene.add(this._sky);
    this.renderer.render(this.scene, this.camera);
    setTimeout((function(_this) {
      return function() {
        _this._grass = new Grass;
        _this._grass.position.x = 7;
        _this.scene.add(_this._grass);
        return _this.renderer.render(_this.scene, _this.camera);
      };
    })(this), 100);
    setTimeout((function(_this) {
      return function() {
        _this._rubans = new Rubans;
        _this._rubans.position.x = 7;
        _this.scene.add(_this._rubans);
        return _this.renderer.render(_this.scene, _this.camera);
      };
    })(this), 300);
    setTimeout((function(_this) {
      return function() {
        _this._village = new Village;
        _this._village.position.x = 7;
        _this.scene.add(_this._village);
        return _this.renderer.render(_this.scene, _this.camera);
      };
    })(this), 500);
    return setTimeout((function(_this) {
      return function() {
        _this._bg = new Bg;
        _this._bg.position.x = 7;
        _this.scene.add(_this._bg);
        return _this.renderer.render(_this.scene, _this.camera);
      };
    })(this), 1000);
  };

  Scene.prototype.update = function(elements) {
    this._cameraControls.update();
    seasonManager.setAngle(this._cameraControls.getAngle());
    this._sky.update();
    this._grass.update();
    this._rubans.update();
    this._village.update();
    this._bg.update();
    if (conf.quality === "lq") {
      return this.renderer.render(this.scene, this.camera);
    } else {
      return this._composer.render();
    }
  };

  Scene.prototype.start = function(delay) {
    return this._cameraControls.start(delay);
  };

  Scene.prototype._onSeasonChanging = function(curr, to, percent, speed) {
    if (speed == null) {
      speed = .4;
    }
    if (curr === "summer" && to === "autumn") {
      return TweenLite.set(this._domLayerAutumn, {
        css: {
          alpha: percent
        }
      });
    } else if (curr === "autumn" && to === "summer") {
      return TweenLite.set(this._domLayerAutumn, {
        css: {
          alpha: 1 - percent
        }
      });
    } else if (curr === "summer" && to === "winter") {
      return TweenLite.set(this._domLayerWinter, {
        css: {
          alpha: percent
        }
      });
    } else if (curr === "spring" && to === "winter") {
      return TweenLite.set(this._domLayerWinter, {
        css: {
          alpha: percent
        }
      });
    } else if (curr === "winter" && to === "summer") {
      return TweenLite.set(this._domLayerWinter, {
        css: {
          alpha: 1 - percent
        }
      });
    } else if (curr === "winter" && to === "spring") {
      return TweenLite.set(this._domLayerWinter, {
        css: {
          alpha: 1 - percent
        }
      });
    }
  };

  Scene.prototype.resize = function(_w, _h) {
    this._w = _w;
    this._h = _h;
    this.renderer.setSize(this._w, this._h);
    this._composer.setSize(this._w * window.devicePixelRatio, this._h * window.devicePixelRatio);
    this.camera.aspect = this._w / this._h;
    this.camera.updateProjectionMatrix();
    this._passFXAA.uniforms.resolution.value.x = 1 / this._w / window.devicePixelRatio;
    return this._passFXAA.uniforms.resolution.value.y = 1 / this._h / window.devicePixelRatio;
  };

  return Scene;

})();

module.exports = Scene;



},{"experiment/core/conf":3,"experiment/engine/CameraControls":5,"experiment/engine/seasonManager":7,"experiment/landscape/Bg":8,"experiment/landscape/Grass":9,"experiment/landscape/Sky":10,"experiment/village/Rubans":12,"experiment/village/Village":13,"shaders/OverlayShader":27}],7:[function(require,module,exports){
var SeasonManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SeasonManager = (function(_super) {
  __extends(SeasonManager, _super);

  function SeasonManager() {
    SeasonManager.__super__.constructor.apply(this, arguments);
    this._a = 0;
    this._padding = 0.18;
    this.id = "summer";
  }

  SeasonManager.prototype.setAngle = function(a) {
    var id;
    this._checkDirection(a);
    this._a = a;
    id = "";
    if (a < -0.3) {
      id = "autumn";
    } else if (a >= -0.3 && a < 0.13) {
      id = "summer";
    } else if (a >= 0.13 && a < 0.56) {
      id = "winter";
    } else {
      id = "spring";
    }
    if (this.id !== id) {
      this.id = id;
      this.emit("change");
    }
  };

  SeasonManager.prototype._checkDirection = function(a) {
    var d, percent;
    percent = 0;
    d = a - this._a;
    if (d < 0) {
      if (a > -0.3 - this._padding && a < -0.3) {
        percent = this._getPercentLeft(-0.3, a);
        this.emit("changing", "autumn", "summer", this._setPercent(1 - percent), .02);
      } else if (a > 0.13 - this._padding && a < 0.13) {
        percent = this._getPercentLeft(0.13, a);
        this.emit("changing", "summer", "winter", this._setPercent(1 - percent), .02);
      } else if (a > 0.56 - this._padding && a < 0.56) {
        percent = this._getPercentLeft(0.56, a);
        this.emit("changing", "winter", "spring", this._setPercent(1 - percent), .02);
      }
      if (a < -0.3 + this._padding && a >= -0.3) {
        percent = this._getPercentLeft(-0.3, a);
        return this.emit("changing", "summer", "autumn", this._setPercent(percent));
      } else if (a < 0.13 + this._padding && a >= 0.13) {
        percent = this._getPercentLeft(0.13, a);
        return this.emit("changing", "winter", "summer", this._setPercent(percent));
      } else if (a < 0.56 + this._padding && a >= 0.56) {
        percent = this._getPercentLeft(0.56, a);
        return this.emit("changing", "spring", "winter", this._setPercent(percent));
      }
    } else {
      if (a < -0.3 + this._padding && a >= -0.3) {
        percent = this._getPercentRight(-0.3, a);
        this.emit("changing", "summer", "autumn", this._setPercent(1 - percent), .02);
      } else if (a < 0.13 + this._padding && a >= 0.13) {
        percent = this._getPercentRight(0.13, a);
        this.emit("changing", "winter", "summer", this._setPercent(1 - percent), .02);
      } else if (a < 0.56 + this._padding && a >= 0.56) {
        percent = this._getPercentRight(0.56, a);
        this.emit("changing", "spring", "winter", this._setPercent(1 - percent), .02);
      }
      if (a > -0.3 - this._padding && a < -0.3) {
        percent = this._getPercentRight(-0.3, a);
        return this.emit("changing", "autumn", "summer", this._setPercent(percent));
      } else if (a > 0.13 - this._padding && a < 0.13) {
        percent = this._getPercentRight(0.13, a);
        return this.emit("changing", "summer", "winter", this._setPercent(percent));
      } else if (a > 0.56 - this._padding && a < 0.56) {
        percent = this._getPercentRight(0.56, a);
        return this.emit("changing", "winter", "spring", this._setPercent(percent));
      }
    }
  };

  SeasonManager.prototype._setPercent = function(percent) {
    return Math.max(0, Math.min(percent, 1));
  };

  SeasonManager.prototype._getPercentLeft = function(from, a) {
    var curr, percent, start, total;
    start = from + this._padding;
    curr = a - start;
    total = from - start;
    percent = curr / total;
    return percent;
  };

  SeasonManager.prototype._getPercentRight = function(from, a) {
    var curr, percent, start, total;
    start = from - this._padding;
    curr = a - start;
    total = from - start;
    percent = curr / total;
    return percent;
  };

  return SeasonManager;

})(Emitter);

module.exports = new SeasonManager();



},{}],8:[function(require,module,exports){
var Bg, objs, seasonManager, shader, textures,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

objs = require("models/objs");

textures = require("models/textures");

seasonManager = require("experiment/engine/seasonManager");

shader = require("shaders/BgShader");

Bg = (function(_super) {
  __extends(Bg, _super);

  function Bg() {
    this._onSeasonChanging = __bind(this._onSeasonChanging, this);
    var data;
    Bg.__super__.constructor.apply(this, arguments);
    this._materialBg = new THREE.ShaderMaterial({
      uniforms: {
        alphaMap: {
          type: "t",
          value: textures.get("bgAlpha")
        },
        mapThreshold: {
          type: "t",
          value: textures.get("thresholdBg")
        },
        sharpness: {
          type: "f",
          value: .3
        },
        threshold: {
          type: "f",
          value: 1
        },
        "mapWinter": {
          type: "t",
          value: textures.get("bgWinter")
        },
        "mapSummer": {
          type: "t",
          value: textures.get("bgSummer")
        },
        "mapAutumn": {
          type: "t",
          value: textures.get("bgAutumn")
        },
        "mapSpring": {
          type: "t",
          value: textures.get("bgSpring")
        },
        "currWinter": {
          type: "f",
          value: 0
        },
        "currSummer": {
          type: "f",
          value: 1
        },
        "currSpring": {
          type: "f",
          value: 0
        },
        "currAutumn": {
          type: "f",
          value: 0
        },
        "toWinter": {
          type: "f",
          value: 0
        },
        "toSummer": {
          type: "f",
          value: 1
        },
        "toSpring": {
          type: "f",
          value: 0
        },
        "toAutumn": {
          type: "f",
          value: 0
        }
      },
      attributes: null,
      vertexShader: shader.vs,
      fragmentShader: shader.fs,
      depthWrite: false,
      transparent: true
    });
    data = objs.get("mountain");
    this._obj = new THREE.Mesh(data.geom, this._materialBg);
    this._obj.scale.set(.05, .05, .05);
    this.add(this._obj);
    seasonManager.on("changing", this._onSeasonChanging);
  }

  Bg.prototype._onSeasonChanging = function(curr, to, percent, speed) {
    if (speed == null) {
      speed = .4;
    }
    this._speed = speed;
    if (this._to !== to) {
      this._toPercent = 1;
      this._percent = 1;
      this._curr = curr;
      this._to = to;
      this._materialBg.uniforms.toWinter.value = 0;
      this._materialBg.uniforms.toSummer.value = 0;
      this._materialBg.uniforms.toSpring.value = 0;
      this._materialBg.uniforms.toAutumn.value = 0;
      this._materialBg.uniforms.currWinter.value = 0;
      this._materialBg.uniforms.currSummer.value = 0;
      this._materialBg.uniforms.currSpring.value = 0;
      this._materialBg.uniforms.currAutumn.value = 0;
      if (this._to === "summer") {
        this._materialBg.uniforms.toSummer.value = 1;
      } else if (this._to === "spring") {
        this._materialBg.uniforms.toSpring.value = 1;
      } else if (this._to === "winter") {
        this._materialBg.uniforms.toWinter.value = 1;
      } else if (this._to === "autumn") {
        this._materialBg.uniforms.toAutumn.value = 1;
      }
      if (this._curr === "summer") {
        this._materialBg.uniforms.currSummer.value = 1;
      } else if (this._curr === "spring") {
        this._materialBg.uniforms.currSpring.value = 1;
      } else if (this._curr === "winter") {
        this._materialBg.uniforms.currWinter.value = 1;
      } else if (this._curr === "autumn") {
        this._materialBg.uniforms.currAutumn.value = 1;
      }
    }
    this._materialBg.uniforms.threshold.value = .1 + (1 - percent) * 0.6;
    return this._toPercent = (1 - percent) * 0.7;
  };

  Bg.prototype.update = function() {
    this._percent += (this._toPercent - this._percent) * this._speed;
    return this._materialBg.uniforms.threshold.value = this._percent;
  };

  return Bg;

})(THREE.Object3D);

module.exports = Bg;



},{"experiment/engine/seasonManager":7,"models/objs":20,"models/textures":21,"shaders/BgShader":24}],9:[function(require,module,exports){
var Grass, conf, objs, seasonManager, shader, textures,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

objs = require("models/objs");

textures = require("models/textures");

conf = require("experiment/core/conf");

seasonManager = require("experiment/engine/seasonManager");

shader = require("shaders/Grass");

Grass = (function(_super) {
  __extends(Grass, _super);

  function Grass() {
    this._onSeasonChanging = __bind(this._onSeasonChanging, this);
    var data, obj;
    Grass.__super__.constructor.apply(this, arguments);
    this._percent = 1;
    this._toPercent = 1;
    this._time = 0;
    this._to = null;
    this._curr = null;
    this._speed = .1;
    this._hsl = new THREE.Vector3(1, 0, 1);
    this._materialShader = new THREE.ShaderMaterial({
      uniforms: {
        "mapStrength": {
          type: "t",
          value: textures.get("grassStrength")
        },
        "mapWind": {
          type: "t",
          value: textures.get("wind")
        },
        "mapWindSlashes": {
          type: "t",
          value: textures.get("windSlashes")
        },
        "mapThreshold": {
          type: "t",
          value: textures.get("threshold")
        },
        "sharpness": {
          type: "f",
          value: .3
        },
        "threshold": {
          type: "f",
          value: 1
        },
        "uTime": {
          type: "f",
          value: null
        },
        "hsl": {
          type: "v3",
          value: this._hsl
        },
        "mapWinter": {
          type: "t",
          value: textures.get("grassWinter")
        },
        "mapSummer": {
          type: "t",
          value: textures.get("grassSummer")
        },
        "mapAutumn": {
          type: "t",
          value: textures.get("grassAutumn")
        },
        "mapSpring": {
          type: "t",
          value: textures.get("grassSpring")
        },
        "currWinter": {
          type: "f",
          value: 0
        },
        "currSummer": {
          type: "f",
          value: 1
        },
        "currSpring": {
          type: "f",
          value: 0
        },
        "currAutumn": {
          type: "f",
          value: 0
        },
        "toWinter": {
          type: "f",
          value: 0
        },
        "toSummer": {
          type: "f",
          value: 1
        },
        "toSpring": {
          type: "f",
          value: 0
        },
        "toAutumn": {
          type: "f",
          value: 0
        }
      },
      attributes: null,
      vertexShader: shader.vs,
      fragmentShader: shader.fs
    });
    this._materialShader.minFilter = THREE.LinearFilter;
    this._materialShader.magFilter = THREE.LinearFilter;
    if (!conf.isOBJ) {
      data = objs.get("grass");
      obj = new THREE.Mesh(data.geom, this._materialShader);
    } else {
      obj = objs.get("grass").geom;
      obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          return child.material.side = THREE.DoubleSide;
        }
      });
    }
    obj.scale.set(.05, .05, .05);
    this.add(obj);
    seasonManager.on("changing", this._onSeasonChanging);
  }

  Grass.prototype._onSeasonChanging = function(curr, to, percent, speed) {
    if (speed == null) {
      speed = .4;
    }
    this._speed = speed;
    if (this._to !== to) {
      this._toPercent = 1;
      this._percent = 1;
      this._curr = curr;
      this._to = to;
      this._materialShader.uniforms.toWinter.value = 0;
      this._materialShader.uniforms.toSummer.value = 0;
      this._materialShader.uniforms.toSpring.value = 0;
      this._materialShader.uniforms.toAutumn.value = 0;
      this._materialShader.uniforms.currWinter.value = 0;
      this._materialShader.uniforms.currSummer.value = 0;
      this._materialShader.uniforms.currSpring.value = 0;
      this._materialShader.uniforms.currAutumn.value = 0;
      if (this._to === "summer") {
        this._materialShader.uniforms.toSummer.value = 1;
      } else if (this._to === "spring") {
        this._materialShader.uniforms.toSpring.value = 1;
      } else if (this._to === "winter") {
        this._materialShader.uniforms.toWinter.value = 1;
      } else if (this._to === "autumn") {
        this._materialShader.uniforms.toAutumn.value = 1;
      }
      if (this._curr === "summer") {
        this._materialShader.uniforms.currSummer.value = 1;
      } else if (this._curr === "spring") {
        this._materialShader.uniforms.currSpring.value = 1;
      } else if (this._curr === "winter") {
        this._materialShader.uniforms.currWinter.value = 1;
      } else if (this._curr === "autumn") {
        this._materialShader.uniforms.currAutumn.value = 1;
      }
    }
    return this._toPercent = (1 - percent) * 0.7;
  };

  Grass.prototype._ease = function(p) {
    return 1 - Math.pow(2, -10 * p);
  };

  Grass.prototype.update = function() {
    this._time++;
    this._percent += (this._toPercent - this._percent) * this._speed;
    this._materialShader.uniforms.threshold.value = this._percent;
    return this._materialShader.uniforms.uTime.value = this._time;
  };

  return Grass;

})(THREE.Object3D);

module.exports = Grass;



},{"experiment/core/conf":3,"experiment/engine/seasonManager":7,"models/objs":20,"models/textures":21,"shaders/Grass":25}],10:[function(require,module,exports){
var Sky, conf, interactions, objs, seasonManager, shader, textures,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

objs = require("models/objs");

textures = require("models/textures");

conf = require("experiment/core/conf");

interactions = require("experiment/core/interactions");

seasonManager = require("experiment/engine/seasonManager");

shader = require("shaders/HSLShader");

Sky = (function(_super) {
  __extends(Sky, _super);

  function Sky() {
    this._onSeasonChanging = __bind(this._onSeasonChanging, this);
    this._onUp = __bind(this._onUp, this);
    this._onMove = __bind(this._onMove, this);
    this._onDown = __bind(this._onDown, this);
    var data;
    Sky.__super__.constructor.apply(this, arguments);
    this._time = 0;
    this._a = 0;
    this._toA = 0;
    this._hsl = new THREE.Vector3(1, 0, 1);
    this._percent = 0;
    this._materialShader = new THREE.ShaderMaterial({
      uniforms: {
        map: {
          type: "t",
          value: null
        },
        hsl: {
          type: "v3",
          value: this._hsl
        },
        percent: {
          type: "f",
          value: 1
        }
      },
      attributes: null,
      vertexShader: shader.vs,
      fragmentShader: shader.fs
    });
    if (!conf.isOBJ) {
      data = objs.get("sky");
      this._materialShader.uniforms.map.value = textures.get(data.materials[0].name);
      this._obj = new THREE.Mesh(data.geom, this._materialShader);
    } else {
      this._obj = objs.get("sky").geom;
      this._obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          return child.material.side = THREE.DoubleSide;
        }
      });
    }
    this._obj.scale.set(.05, .05, .05);
    this.add(this._obj);
    interactions.on(window, "down", this._onDown);
    seasonManager.on("changing", this._onSeasonChanging);
  }

  Sky.prototype._onDown = function(e) {
    this._lx = e.x;
    this._ly = e.y;
    interactions.on(window, "move", this._onMove);
    return interactions.on(window, "up", this._onUp);
  };

  Sky.prototype._onMove = function(e) {
    var dx;
    dx = e.x - this._lx;
    this._lx = e.x;
    return this._toA -= dx * .05;
  };

  Sky.prototype._onUp = function(e) {
    interactions.off(window, "move", this._onMove);
    return interactions.off(window, "up", this._onUp);
  };

  Sky.prototype._onSeasonChanging = function(curr, to, percent, speed) {
    if (speed == null) {
      speed = .4;
    }
    if (curr === "summer" && to === "autumn") {
      this._hsl.x = 1;
      this._hsl.y = 1;
      this._hsl.z = 0;
      this._materialShader.uniforms.hsl.value = this._hsl;
      return this._percent = percent * .25;
    } else if (curr === "autumn" && to === "summer") {
      return this._percent = (1 - percent) * .25;
    } else if (curr === "summer" && to === "winter") {
      this._hsl.x = 80 / 255;
      this._hsl.y = 32 / 255;
      this._hsl.z = 177 / 255;
      this._materialShader.uniforms.hsl.value = this._hsl;
      return this._percent = percent * .5;
    } else if (curr === "spring" && to === "winter") {
      this._hsl.x = 80 / 255;
      this._hsl.y = 32 / 255;
      this._hsl.z = 177 / 255;
      this._materialShader.uniforms.hsl.value = this._hsl;
      return this._percent = percent * .5;
    } else if (curr === "winter" && to === "summer") {
      return this._percent = (1 - percent) * .5;
    } else if (curr === "winter" && to === "spring") {
      return this._percent = (1 - percent) * .5;
    }
  };

  Sky.prototype.update = function() {
    var a;
    this._toA += .000175;
    a = this._a;
    this._a += (this._toA - this._a) * .25;
    this.rotation.y = this._a;
    return this._materialShader.uniforms.percent.value = this._percent;
  };

  return Sky;

})(THREE.Object3D);

module.exports = Sky;



},{"experiment/core/conf":3,"experiment/core/interactions":4,"experiment/engine/seasonManager":7,"models/objs":20,"models/textures":21,"shaders/HSLShader":26}],11:[function(require,module,exports){
var ExperimentUI, seasonManager,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

seasonManager = require("experiment/engine/seasonManager");

ExperimentUI = (function() {
  function ExperimentUI() {
    this._onSeasonChange = __bind(this._onSeasonChange, this);
    this._dom = document.querySelector(".experiment-anims");
    this._domSummer = document.querySelector(".experiment-anim--summer");
    this._domWinter = document.querySelector(".experiment-anim--winter");
    this._domSpring = document.querySelector(".experiment-anim--spring");
    this._domAutumn = document.querySelector(".experiment-anim--autumn");
    this._current = this._domSummer;
    TweenLite.set(this._current, {
      css: {
        alpha: 0,
        rotationY: 180
      }
    });
    TweenLite.set(this._dom, {
      css: {
        scale: .4,
        rotationY: -45
      }
    });
    seasonManager.on("change", this._onSeasonChange);
  }

  ExperimentUI.prototype.show = function() {
    TweenLite.to(this._dom, .8, {
      delay: 1,
      css: {
        scale: 1,
        alpha: 1,
        rotationY: 0,
        force3D: true
      },
      ease: Back.easeInOut
    });
    return TweenLite.to(this._current, .8, {
      delay: 1.2,
      css: {
        alpha: 1,
        rotationY: 0,
        force3D: true
      },
      ease: Back.easeInOut
    });
  };

  ExperimentUI.prototype._onSeasonChange = function() {
    TweenLite.to(this._current, .8, {
      css: {
        rotationY: -180,
        alpha: 0,
        force3D: true
      },
      ease: Back.easeInOut
    });
    if (seasonManager.id === "summer") {
      this._current = this._domSummer;
    } else if (seasonManager.id === "spring") {
      this._current = this._domSpring;
    } else if (seasonManager.id === "winter") {
      this._current = this._domWinter;
    } else if (seasonManager.id === "autumn") {
      this._current = this._domAutumn;
    }
    TweenLite.set(this._current, {
      css: {
        rotationY: 180,
        alpha: 0,
        force3D: true
      },
      ease: Back.easeInOut
    });
    return TweenLite.to(this._current, .8, {
      css: {
        rotationY: 0,
        alpha: 1,
        force3D: true
      },
      ease: Back.easeInOut
    });
  };

  return ExperimentUI;

})();

module.exports = ExperimentUI;



},{"experiment/engine/seasonManager":7}],12:[function(require,module,exports){
var Rubans, conf, objs, shader, textures,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

objs = require("models/objs");

textures = require("models/textures");

conf = require("experiment/core/conf");

shader = require("shaders/Ruban");

Rubans = (function(_super) {
  __extends(Rubans, _super);

  function Rubans() {
    var data, mat, material, obj, _i, _len, _ref;
    Rubans.__super__.constructor.apply(this, arguments);
    this._time = 0;
    this._materials = [];
    if (!conf.isOBJ) {
      data = objs.get("rubans");
      console.log(data.materials);
      material = this._getMaterial(data.materials[0].name, textures.get("ruban2motion"));
      data.materials[0] = material;
      this._materials.push(material);
      material = this._getMaterial(data.materials[1].name, textures.get("ruban1motion"));
      data.materials[1] = material;
      this._materials.push(material);
      material = this._getMaterial(data.materials[2].name, textures.get("ruban3motion"));
      data.materials[2] = material;
      this._materials.push(material);
      _ref = data.materials;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mat = _ref[_i];
        mat.side = THREE.DoubleSide;
      }
      obj = new THREE.Mesh(data.geom, new THREE.MeshFaceMaterial(data.materials));
    } else {
      obj = objs.get("rubans").geom;
      obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          return child.material.side = THREE.DoubleSide;
        }
      });
    }
    obj.scale.set(.05, .05, .05);
    this.add(obj);
  }

  Rubans.prototype._getMaterial = function(name, mapStrength) {
    var material;
    return material = new THREE.ShaderMaterial({
      uniforms: {
        "map": {
          type: "t",
          value: textures.get(name)
        },
        "mapStrength": {
          type: "t",
          value: mapStrength
        },
        "uTime": {
          type: "f",
          value: null
        }
      },
      attributes: null,
      vertexShader: shader.vs,
      fragmentShader: shader.fs
    });
  };

  Rubans.prototype.update = function() {
    var material, _i, _len, _ref;
    this._time++;
    _ref = this._materials;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      material = _ref[_i];
      material.uniforms.uTime.value = this._time;
    }
  };

  return Rubans;

})(THREE.Object3D);

module.exports = Rubans;



},{"experiment/core/conf":3,"models/objs":20,"models/textures":21,"shaders/Ruban":28}],13:[function(require,module,exports){
var Village, conf, objs, seasonManager, shader, shaderAlpha, shaderBg, shaderSeason, textures,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

objs = require("models/objs");

textures = require("models/textures");

conf = require("experiment/core/conf");

seasonManager = require("experiment/engine/seasonManager");

shader = require("shaders/BasicShader");

shaderAlpha = require("shaders/AlphaShader");

shaderSeason = require("shaders/SeasonShader");

shaderBg = require("shaders/BgShader");

Village = (function(_super) {
  __extends(Village, _super);

  function Village() {
    this._onSeasonChanging = __bind(this._onSeasonChanging, this);
    var baseMaterial, data, i, material, obj, _i, _len, _ref;
    Village.__super__.constructor.apply(this, arguments);
    this._percent = 1;
    this._toPercent = 1;
    this._materials = [];
    if (!conf.isOBJ) {
      data = objs.get("village");
      _ref = data.materials;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        baseMaterial = _ref[i];
        if (baseMaterial.name === "grass" || baseMaterial.name === "grass2") {
          if (!this._materialFloor) {
            material = this._materialFloor = new THREE.ShaderMaterial({
              uniforms: {
                mapThreshold: {
                  type: "t",
                  value: textures.get("threshold")
                },
                sharpness: {
                  type: "f",
                  value: .3
                },
                threshold: {
                  type: "f",
                  value: 1
                },
                "mapWinter": {
                  type: "t",
                  value: textures.get("floorWinter")
                },
                "mapSummer": {
                  type: "t",
                  value: textures.get("floorSummer")
                },
                "mapAutumn": {
                  type: "t",
                  value: textures.get("floorAutumn")
                },
                "mapSpring": {
                  type: "t",
                  value: textures.get("floorSpring")
                },
                "currWinter": {
                  type: "f",
                  value: 0
                },
                "currSummer": {
                  type: "f",
                  value: 1
                },
                "currSpring": {
                  type: "f",
                  value: 0
                },
                "currAutumn": {
                  type: "f",
                  value: 0
                },
                "toWinter": {
                  type: "f",
                  value: 0
                },
                "toSummer": {
                  type: "f",
                  value: 1
                },
                "toSpring": {
                  type: "f",
                  value: 0
                },
                "toAutumn": {
                  type: "f",
                  value: 0
                }
              },
              attributes: null,
              vertexShader: shaderSeason.vs,
              fragmentShader: shaderSeason.fs
            });
          } else {
            material = this._materialFloor;
          }
        } else {
          material = new THREE.ShaderMaterial({
            uniforms: {
              map: {
                type: "t",
                value: textures.get(baseMaterial.name)
              }
            },
            attributes: null,
            vertexShader: shader.vs,
            fragmentShader: shader.fs
          });
          if (baseMaterial.name === "housebird") {
            material.side = THREE.DoubleSide;
          }
        }
        data.materials[i] = material;
      }
      obj = new THREE.Mesh(data.geom, new THREE.MeshFaceMaterial(data.materials));
      this._materials = data.materials;
    } else {
      obj = objs.get("village").geom;
      obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          return child.material.side = THREE.DoubleSide;
        }
      });
    }
    obj.scale.set(.05, .05, .05);
    this.add(obj);
    seasonManager.on("changing", this._onSeasonChanging);
  }

  Village.prototype._onSeasonChanging = function(curr, to, percent, speed) {
    if (speed == null) {
      speed = .4;
    }
    this._speed = speed;
    if (this._to !== to) {
      this._toPercent = 1;
      this._percent = 1;
      this._curr = curr;
      this._to = to;
      this._materialFloor.uniforms.toWinter.value = 0;
      this._materialFloor.uniforms.toSummer.value = 0;
      this._materialFloor.uniforms.toSpring.value = 0;
      this._materialFloor.uniforms.toAutumn.value = 0;
      this._materialFloor.uniforms.currWinter.value = 0;
      this._materialFloor.uniforms.currSummer.value = 0;
      this._materialFloor.uniforms.currSpring.value = 0;
      this._materialFloor.uniforms.currAutumn.value = 0;
      if (this._to === "summer") {
        this._materialFloor.uniforms.toSummer.value = 1;
      } else if (this._to === "spring") {
        this._materialFloor.uniforms.toSpring.value = 1;
      } else if (this._to === "winter") {
        this._materialFloor.uniforms.toWinter.value = 1;
      } else if (this._to === "autumn") {
        this._materialFloor.uniforms.toAutumn.value = 1;
      }
      if (this._curr === "summer") {
        this._materialFloor.uniforms.currSummer.value = 1;
      } else if (this._curr === "spring") {
        this._materialFloor.uniforms.currSpring.value = 1;
      } else if (this._curr === "winter") {
        this._materialFloor.uniforms.currWinter.value = 1;
      } else if (this._curr === "autumn") {
        this._materialFloor.uniforms.currAutumn.value = 1;
      }
    }
    this._materialFloor.uniforms.threshold.value = .1 + (1 - percent) * 0.6;
    return this._toPercent = (1 - percent) * 0.7;
  };

  Village.prototype.update = function() {
    this._percent += (this._toPercent - this._percent) * this._speed;
    return this._materialFloor.uniforms.threshold.value = this._percent;
  };

  return Village;

})(THREE.Object3D);

module.exports = Village;



},{"experiment/core/conf":3,"experiment/engine/seasonManager":7,"models/objs":20,"models/textures":21,"shaders/AlphaShader":22,"shaders/BasicShader":23,"shaders/BgShader":24,"shaders/SeasonShader":29}],14:[function(require,module,exports){
var Anims, CircleProgress, Loader, Loader3D, LoaderImg, LoaderSound, conf,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Loader3D = require("loader/Loader3D");

LoaderImg = require("loader/LoaderImg");

LoaderSound = require("loader/LoaderSound");

Anims = require("loader/ui/Anims");

CircleProgress = require("loader/ui/CircleProgress");

conf = require("experiment/core/conf");

Loader = (function(_super) {
  __extends(Loader, _super);

  function Loader() {
    this._hide = __bind(this._hide, this);
    this._onLoadSoundComplete = __bind(this._onLoadSoundComplete, this);
    this._onLoadSoundProgress = __bind(this._onLoadSoundProgress, this);
    this._onLoadImgComplete = __bind(this._onLoadImgComplete, this);
    this._onLoadImgProgress = __bind(this._onLoadImgProgress, this);
    this._onLoad3DComplete = __bind(this._onLoad3DComplete, this);
    this._onLoad3DProgress = __bind(this._onLoad3DProgress, this);
    Loader.__super__.constructor.apply(this, arguments);
    this._progress = 0;
    this._progress3D = 0;
    this._progressTextures = 0;
    this._progressSound = 0;
    this._dom = document.querySelector(".loading");
    this._domTitle = document.querySelector(".loading-title");
    this._domContent = document.querySelector(".loading-content");
    this._domBeforeQualities = document.querySelector(".loading-before-qualities");
    this._domQualities = document.querySelector(".loading-qualities");
    this._domCredits = document.querySelector(".loading-credits");
    this._domBtLQ = document.querySelector(".loading-quality-bt--lq");
    this._domBtHQ = document.querySelector(".loading-quality-bt--hq");
    this._domBtLQ.addEventListener("click", (function(_this) {
      return function() {
        conf.quality = "lq";
        return _this._hide();
      };
    })(this), false);
    this._domBtHQ.addEventListener("click", (function(_this) {
      return function() {
        conf.quality = "hq";
        return _this._hide();
      };
    })(this), false);
    this._anims = new Anims;
    this._anims.start();
    this._circle = new CircleProgress(document.querySelector(".loading-percent-progress"));
    this._loader3D = new Loader3D;
    this._loader3D.on("progress", this._onLoad3DProgress);
    this._loader3D.once("complete", this._onLoad3DComplete);
    this._loaderImg = new LoaderImg;
    this._loaderImg.on("progress", this._onLoadImgProgress);
    this._loaderImg.once("complete", this._onLoadImgComplete);
    this._loaderSound = new LoaderSound;
    this._loaderSound.on("progress", this._onLoadSoundProgress);
    this._loaderSound.once("complete", this._onLoadSoundComplete);
    this._idx = 0;
  }

  Loader.prototype.load = function() {
    this._loader3D.load();
    return this._loaderImg.load();
  };

  Loader.prototype._onLoad3DProgress = function(value) {
    this._progress3D = value * .175;
    return this._updateProgress();
  };

  Loader.prototype._updateProgress = function() {
    return this._circle.setPercent(this._progress3D + this._progressTextures + this._progressSound);
  };

  Loader.prototype._onLoad3DComplete = function() {
    return this._onComplete();
  };

  Loader.prototype._onLoadImgProgress = function(value) {
    this._progressTextures = value * .7;
    return this._updateProgress();
  };

  Loader.prototype._onLoadImgComplete = function() {
    return this._onComplete();
  };

  Loader.prototype._onLoadSoundProgress = function(value) {
    return this._progressSound = value * .125;
  };

  Loader.prototype._onLoadSoundComplete = function() {
    return this._onComplete();
  };

  Loader.prototype._onComplete = function() {
    this._idx++;
    if (this._idx < 3) {
      return;
    }
    return this.emit("complete");
  };

  Loader.prototype.selectQuality = function() {
    TweenLite.to(this._domBeforeQualities, 1, {
      css: {
        alpha: 0
      },
      ease: Cubic.easeInOut
    });
    return TweenLite.to(this._domQualities, 1, {
      delay: .2,
      css: {
        alpha: 1
      },
      ease: Cubic.easeInOut,
      onComplete: function() {
        var sound;
        sound = soundManager.play("bg", {
          loops: 1000
        });
        return sound.setVolume(65);
      }
    });
  };

  Loader.prototype._hide = function() {
    console.log("hide");
    this._dom.style.pointerEvents = "none";
    return this.emit("launch");
  };

  Loader.prototype.hide = function() {
    this._circle.setPercent(1);
    TweenLite.to(this._domTitle, 2, {
      css: {
        y: -200,
        alpha: 0,
        force3D: true
      },
      ease: Cubic.easeIn
    });
    TweenLite.to(this._domContent, 2, {
      delay: .15,
      css: {
        y: -200,
        alpha: 0,
        force3D: true
      },
      ease: Cubic.easeIn
    });
    TweenLite.to(this._domCredits, 2, {
      delay: .3,
      css: {
        y: -200,
        alpha: 0,
        force3D: true
      },
      ease: Cubic.easeIn
    });
    return TweenLite.to(this._dom, 2, {
      delay: 1.5,
      css: {
        alpha: 0
      },
      ease: Cubic.easeIn,
      onComplete: (function(_this) {
        return function() {
          _this._anims.stop();
          return document.body.removeChild(document.querySelector(".loading"));
        };
      })(this)
    });
  };

  return Loader;

})(Emitter);

module.exports = Loader;



},{"experiment/core/conf":3,"loader/Loader3D":15,"loader/LoaderImg":16,"loader/LoaderSound":17,"loader/ui/Anims":18,"loader/ui/CircleProgress":19}],15:[function(require,module,exports){
var Loader, Loader3D, conf, objs,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

objs = require("models/objs");

conf = require("experiment/core/conf");

Loader = (function(_super) {
  __extends(Loader, _super);

  function Loader(id, manager) {
    var loader;
    Loader.__super__.constructor.apply(this, arguments);
    loader = new THREE.JSONLoader(true);
    if (!conf.isOBJ) {
      loader.load("obj/" + id + ".js", (function(_this) {
        return function(obj, materials) {
          objs.register(id, obj, materials);
          return _this.emit("complete");
        };
      })(this));
    } else {
      loader = new THREE.OBJMTLLoader(manager);
      loader.load("obj/" + id + ".obj", "obj/" + id + ".mtl", function(obj) {
        return objs.register(id, obj, null);
      });
    }
  }

  return Loader;

})(Emitter);

Loader3D = (function(_super) {
  __extends(Loader3D, _super);

  function Loader3D() {
    this._onLoadingProgress = __bind(this._onLoadingProgress, this);
    Loader3D.__super__.constructor.apply(this, arguments);
    this._manager = new THREE.LoadingManager;
    this._manager.onProgress = this._onLoadingProgress;
    this._ids = ["village", "grass", "rubans", "sky", "mountain"];
    this._idxLoaded = 0;
  }

  Loader3D.prototype.load = function() {
    var id, loader, _i, _len, _ref;
    _ref = this._ids;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      loader = new Loader(id, this._manager);
      loader.on("complete", this._onLoadingProgress);
    }
  };

  Loader3D.prototype._onLoadingProgress = function(item, loaded, total) {
    if (!conf.isOBJ) {
      this._idxLoaded++;
      this.emit("progress", this._idxLoaded / this._ids.length);
      if (this._idxLoaded === this._ids.length) {
        return this.emit("complete");
      }
    } else {
      if (loaded === total) {
        return this.emit("complete");
      }
    }
  };

  return Loader3D;

})(Emitter);

module.exports = Loader3D;



},{"experiment/core/conf":3,"models/objs":20}],16:[function(require,module,exports){
var LoaderImg, textures,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

textures = require("models/textures");

LoaderImg = (function(_super) {
  __extends(LoaderImg, _super);

  function LoaderImg() {
    this._onComplete = __bind(this._onComplete, this);
    this._onTextureLoaded = __bind(this._onTextureLoaded, this);
    LoaderImg.__super__.constructor.apply(this, arguments);
    this._urls = [];
    this._urls.push({
      id: "grassStrength",
      url: "obj/mapgrassSurface_falloff.jpg"
    });
    this._urls.push({
      id: "ruban1motion",
      url: "obj/ruban1motionSurface_Color.png"
    });
    this._urls.push({
      id: "ruban2motion",
      url: "obj/ruban2motionSurface_Color.png"
    });
    this._urls.push({
      id: "ruban3motion",
      url: "obj/ruban3motionSurface_Color.png"
    });
    this._urls.push({
      id: "wind",
      url: "obj/wind.jpg"
    });
    this._urls.push({
      id: "windSlashes",
      url: "obj/wind-slashes.png"
    });
    this._urls.push({
      id: "bgAlpha",
      url: "obj/backgroundSurface_Color-alpha.png"
    });
    this._urls.push({
      id: "grassWinter",
      url: "obj/grasstopSurface_Color-hivers.png"
    });
    this._urls.push({
      id: "grassSummer",
      url: "obj/grasstopSurface_Color-summer.png"
    });
    this._urls.push({
      id: "grassAutumn",
      url: "obj/grasstopSurface_Color-autumn.png"
    });
    this._urls.push({
      id: "grassSpring",
      url: "obj/grasstopSurface_Color-spring.png"
    });
    this._urls.push({
      id: "floorWinter",
      url: "obj/grassSurface_Color-winter.png"
    });
    this._urls.push({
      id: "floorSummer",
      url: "obj/grassSurface_Color-summer.png"
    });
    this._urls.push({
      id: "floorAutumn",
      url: "obj/grassSurface_Color-autumn.png"
    });
    this._urls.push({
      id: "floorSpring",
      url: "obj/grassSurface_Color-spring.png"
    });
    this._urls.push({
      id: "bgWinter",
      url: "obj/backgroundSurface_Color-winter.png"
    });
    this._urls.push({
      id: "bgSummer",
      url: "obj/backgroundSurface_Color-summer.png"
    });
    this._urls.push({
      id: "bgAutumn",
      url: "obj/backgroundSurface_Color-autumn.png"
    });
    this._urls.push({
      id: "bgSpring",
      url: "obj/backgroundSurface_Color-spring.png"
    });
    this._urls.push({
      id: "threshold",
      url: "obj/threshold.png"
    });
    this._urls.push({
      id: "thresholdBg",
      url: "obj/threshold-bg.png"
    });
    this._urls.push({
      id: "pierre",
      url: "obj/pierreSurface_Color.png"
    });
    this._urls.push({
      id: "gift2",
      url: "obj/gift2Surface_Color.png"
    });
    this._urls.push({
      id: "machine",
      url: "obj/machineSurface_Color.png"
    });
    this._urls.push({
      id: "tonneau4",
      url: "obj/tonneau4Surface_Color.png"
    });
    this._urls.push({
      id: "tonneau3",
      url: "obj/tonneau3Surface_Color.png"
    });
    this._urls.push({
      id: "tonneau2",
      url: "obj/tonneau2Surface_Color.png"
    });
    this._urls.push({
      id: "tonneau1",
      url: "obj/tonneau1Surface_Color.png"
    });
    this._urls.push({
      id: "tonneau0",
      url: "obj/tonneau0Surface_Color.png"
    });
    this._urls.push({
      id: "towerwest",
      url: "obj/towerwestSurface_Color.png"
    });
    this._urls.push({
      id: "gift1",
      url: "obj/gift1Surface_Color.png"
    });
    this._urls.push({
      id: "sucre1",
      url: "obj/sucre1Surface_Color.png"
    });
    this._urls.push({
      id: "sucre2",
      url: "obj/sucre2Surface_Color.png"
    });
    this._urls.push({
      id: "housebird",
      url: "obj/housebirdSurface_Color.png"
    });
    this._urls.push({
      id: "smoke1",
      url: "obj/smoke1Surface_Color.png"
    });
    this._urls.push({
      id: "glass1",
      url: "obj/glass1Surface_Color.png"
    });
    this._urls.push({
      id: "scope1",
      url: "obj/scope1Surface_Color.png"
    });
    this._urls.push({
      id: "glass2",
      url: "obj/glass2Surface_Color.png"
    });
    this._urls.push({
      id: "glass3",
      url: "obj/glass3Surface_Color.png"
    });
    this._urls.push({
      id: "domenorth",
      url: "obj/domenorthSurface_Color.png"
    });
    this._urls.push({
      id: "domesouth",
      url: "obj/domesouthSurface_Color.png"
    });
    this._urls.push({
      id: "smoke2",
      url: "obj/smoke2Surface_Color.png"
    });
    this._urls.push({
      id: "linelight2",
      url: "obj/linelight2Surface_Color.png"
    });
    this._urls.push({
      id: "linelight1",
      url: "obj/linelight1Surface_Color.png"
    });
    this._urls.push({
      id: "portenain",
      url: "obj/portenainSurface_Color.png"
    });
    this._urls.push({
      id: "basewall",
      url: "obj/basewallSurface_Color.png"
    });
    this._urls.push({
      id: "smoke3",
      url: "obj/smoke3Surface_Color.png"
    });
    this._urls.push({
      id: "sidedoor",
      url: "obj/sidedoorSurface_Color.png"
    });
    this._urls.push({
      id: "fences",
      url: "obj/fencesSurface_Color.png"
    });
    this._urls.push({
      id: "sky",
      url: "obj/skySurface_Color.png"
    });
    this._urls.push({
      id: "ruban2",
      url: "obj/ruban2Surface_Color.png"
    });
    this._urls.push({
      id: "ruban1",
      url: "obj/ruban1Surface_Color.png"
    });
    this._urls.push({
      id: "ruban3",
      url: "obj/ruban3Surface_Color.png"
    });
    this._idx = 0;
  }

  LoaderImg.prototype.load = function() {
    var data, _i, _len, _ref, _results;
    _ref = this._urls;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      data = _ref[_i];
      _results.push(textures.register(data.id, THREE.ImageUtils.loadTexture(data.url, void 0, this._onTextureLoaded)));
    }
    return _results;
  };

  LoaderImg.prototype._onTextureLoaded = function() {
    this._idx++;
    this.emit("progress", this._idx / this._urls.length);
    if (this._idx < this._urls.length) {
      return;
    }
    return this._onComplete();
  };

  LoaderImg.prototype._onComplete = function() {
    return this.emit("complete");
  };

  return LoaderImg;

})(Emitter);

module.exports = LoaderImg;



},{"models/textures":21}],17:[function(require,module,exports){
var LoaderSound,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

LoaderSound = (function(_super) {
  __extends(LoaderSound, _super);

  function LoaderSound() {
    this._onComplete = __bind(this._onComplete, this);
    this._onProgress = __bind(this._onProgress, this);
    LoaderSound.__super__.constructor.apply(this, arguments);
    this._loader = new PxLoader();
    this._loader.addProgressListener(this._onProgress);
    this._loader.addCompletionListener(this._onComplete);
    soundManager.useHighPerformance = true;
    soundManager.onready((function(_this) {
      return function() {
        _this._loader.addSound("bg", "sound/background_sound.mp3");
        _this._loader.addSound("wind", "sound/wind.mp3");
        return _this._loader.start();
      };
    })(this));
    this._idx = 0;
  }

  LoaderSound.prototype._onProgress = function() {
    this._idx++;
    return this.emit("progress", this._idx / 2);
  };

  LoaderSound.prototype._onComplete = function() {
    return this.emit("complete");
  };

  return LoaderSound;

})(Emitter);

module.exports = LoaderSound;



},{}],18:[function(require,module,exports){
var Anims,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Anims = (function() {
  function Anims() {
    this._animateNext = __bind(this._animateNext, this);
    this._domAnims = document.querySelectorAll(".loading-anim");
    this._idx = -1;
  }

  Anims.prototype.start = function() {
    return this._animateNext();
  };

  Anims.prototype._animateNext = function() {
    var nextIdx;
    nextIdx = this._idx + 1;
    if (nextIdx > 3) {
      nextIdx = 0;
    }
    if (this._idx > -1) {
      TweenLite.to(this._domAnims[this._idx], .8, {
        css: {
          rotationY: -180,
          alpha: 0,
          force3D: true
        },
        ease: Back.easeInOut
      });
    }
    TweenLite.set(this._domAnims[nextIdx], {
      css: {
        rotationY: 180,
        force3D: true
      }
    });
    TweenLite.to(this._domAnims[nextIdx], .8, {
      css: {
        rotationY: 0,
        alpha: 1,
        force3D: true
      },
      ease: Back.easeInOut
    });
    this._idx = nextIdx;
    return TweenLite.delayedCall(2.6, this._animateNext);
  };

  Anims.prototype.stop = function() {
    return TweenLite.killTweensOf(this._animateNext);
  };

  return Anims;

})();

module.exports = Anims;



},{}],19:[function(require,module,exports){
var CircleProgress;

CircleProgress = (function() {
  function CircleProgress(dom) {
    this._canvas = document.createElement("canvas");
    dom.appendChild(this._canvas);
    this._ctx = this._canvas.getContext("2d");
    this._canvas.width = 384;
    this._canvas.height = 384;
  }

  CircleProgress.prototype.setPercent = function(percent) {
    var a, aStep, i, n, _i;
    this._ctx.clearRect(0, 0, 364, 364);
    this._ctx.strokeStyle = "#fff";
    this._ctx.lineWidth = 2;
    a = -Math.PI * .5;
    this._ctx.moveTo(182 + Math.cos(a) * 181, 182 + Math.sin(a) * 181);
    n = 40;
    aStep = Math.PI * 2 * percent / n;
    for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
      this._ctx.lineTo(182 + Math.cos(a) * 181, 182 + Math.sin(a) * 181);
      a += aStep;
    }
    return this._ctx.stroke();
  };

  return CircleProgress;

})();

module.exports = CircleProgress;



},{}],20:[function(require,module,exports){
var Objs;

Objs = (function() {
  function Objs() {
    this._objsById = {};
  }

  Objs.prototype.register = function(id, geom, materials) {
    return this._objsById[id] = {
      geom: geom,
      materials: materials
    };
  };

  Objs.prototype.get = function(id) {
    return this._objsById[id];
  };

  return Objs;

})();

module.exports = new Objs;



},{}],21:[function(require,module,exports){
var Textures;

Textures = (function() {
  function Textures() {
    this._textureByIds = {};
  }

  Textures.prototype.register = function(id, texture) {
    return this._textureByIds[id] = texture;
  };

  Textures.prototype.get = function(id) {
    return this._textureByIds[id];
  };

  return Textures;

})();

module.exports = new Textures;



},{}],22:[function(require,module,exports){
module.exports.vs = ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n");

module.exports.fs = ["varying vec2 vUv;", "uniform sampler2D map;", "uniform sampler2D alphaMap;", "void main() {", "vec4 color = texture2D( map, vUv );", "color.a *= texture2D( alphaMap, vUv ).g;", "gl_FragColor = color;", "}"].join("\n");



},{}],23:[function(require,module,exports){
module.exports.vs = ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n");

module.exports.fs = ["varying vec2 vUv;", "uniform sampler2D map;", "void main() {", "gl_FragColor = texture2D( map, vUv );", "}"].join("\n");



},{}],24:[function(require,module,exports){
module.exports.vs = ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n");

module.exports.fs = ["varying vec2 vUv;", "uniform sampler2D alphaMap;", "uniform sampler2D mapThreshold;", 'uniform float sharpness;', 'uniform float threshold;', "uniform sampler2D mapWinter;", "uniform sampler2D mapSummer;", "uniform sampler2D mapSpring;", "uniform sampler2D mapAutumn;", "uniform float currWinter;", "uniform float currSummer;", "uniform float currSpring;", "uniform float currAutumn;", "uniform float toWinter;", "uniform float toSummer;", "uniform float toSpring;", "uniform float toAutumn;", "void main() {", "vec4 colorWinter = texture2D( mapWinter, vUv );", "vec4 colorSummer = texture2D( mapSummer, vUv );", "vec4 colorSpring = texture2D( mapSpring, vUv );", "vec4 colorAutumn = texture2D( mapAutumn, vUv );", "vec4 currColor = colorWinter * currWinter + colorAutumn * currAutumn + colorSpring * currSpring + colorSummer * currSummer;", "vec4 toColor = colorWinter * toWinter + colorAutumn * toAutumn + colorSpring * toSpring + colorSummer * toSummer;", "vec4 mask = texture2D( mapThreshold, vUv );", "float r = threshold * ( 1.0 + sharpness * 2.0 ) - sharpness;", "float maskOpacity = clamp( ( mask.r - r ) * ( 1.0 / sharpness ), 0.0, 1.0 );", "vec4 color = currColor * ( 1.0 - maskOpacity );", "color += toColor * maskOpacity;", "color.a *= texture2D( alphaMap, vUv ).g;", "gl_FragColor = color;", "}"].join("\n");



},{}],25:[function(require,module,exports){
module.exports.vs = ["varying vec2 vUv;", "uniform sampler2D mapStrength;", "uniform sampler2D mapWind;", "uniform float uTime;", "vec3 mod289(vec3 x)", "{", "return x - floor(x * (1.0 / 289.0)) * 289.0;", "}", "vec4 mod289(vec4 x)", "{", "return x - floor(x * (1.0 / 289.0)) * 289.0;", "}", "vec4 permute(vec4 x)", "{", "return mod289(((x*34.0)+1.0)*x);", "}", "vec4 taylorInvSqrt(vec4 r)", "{", "return 1.79284291400159 - 0.85373472095314 * r;", "}", "vec3 fade(vec3 t) {", "return t*t*t*(t*(t*6.0-15.0)+10.0);", "}", "float cnoise(vec3 P)", "{", "vec3 Pi0 = floor(P); // Integer part for indexing", "vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1", "Pi0 = mod289(Pi0);", "Pi1 = mod289(Pi1);", "vec3 Pf0 = fract(P); // Fractional part for interpolation", "vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0", "vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);", "vec4 iy = vec4(Pi0.yy, Pi1.yy);", "vec4 iz0 = Pi0.zzzz;", "vec4 iz1 = Pi1.zzzz;", "vec4 ixy = permute(permute(ix) + iy);", "vec4 ixy0 = permute(ixy + iz0);", "vec4 ixy1 = permute(ixy + iz1);", "vec4 gx0 = ixy0 * (1.0 / 7.0);", "vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;", "gx0 = fract(gx0);", "vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);", "vec4 sz0 = step(gz0, vec4(0.0));", "gx0 -= sz0 * (step(0.0, gx0) - 0.5);", "gy0 -= sz0 * (step(0.0, gy0) - 0.5);", "vec4 gx1 = ixy1 * (1.0 / 7.0);", "vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;", "gx1 = fract(gx1);", "vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);", "vec4 sz1 = step(gz1, vec4(0.0));", "gx1 -= sz1 * (step(0.0, gx1) - 0.5);", "gy1 -= sz1 * (step(0.0, gy1) - 0.5);", "vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);", "vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);", "vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);", "vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);", "vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);", "vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);", "vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);", "vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);", "vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));", "g000 *= norm0.x;", "g010 *= norm0.y;", "g100 *= norm0.z;", "g110 *= norm0.w;", "vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));", "g001 *= norm1.x;", "g011 *= norm1.y;", "g101 *= norm1.z;", "g111 *= norm1.w;", "float n000 = dot(g000, Pf0);", "float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));", "float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));", "float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));", "float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));", "float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));", "float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));", "float n111 = dot(g111, Pf1);", "vec3 fade_xyz = fade(Pf0);", "vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);", "vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);", "float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);", "return 2.2 * n_xyz;", "}", "float pnoise(vec3 P, vec3 rep)", "{", "vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period", "vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period", "Pi0 = mod289(Pi0);", "Pi1 = mod289(Pi1);", "vec3 Pf0 = fract(P); // Fractional part for interpolation", "vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0", "vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);", "vec4 iy = vec4(Pi0.yy, Pi1.yy);", "vec4 iz0 = Pi0.zzzz;", "vec4 iz1 = Pi1.zzzz;", "vec4 ixy = permute(permute(ix) + iy);", "vec4 ixy0 = permute(ixy + iz0);", "vec4 ixy1 = permute(ixy + iz1);", "vec4 gx0 = ixy0 * (1.0 / 7.0);", "vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;", "gx0 = fract(gx0);", "vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);", "vec4 sz0 = step(gz0, vec4(0.0));", "gx0 -= sz0 * (step(0.0, gx0) - 0.5);", "gy0 -= sz0 * (step(0.0, gy0) - 0.5);", "vec4 gx1 = ixy1 * (1.0 / 7.0);", "vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;", "gx1 = fract(gx1);", "vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);", "vec4 sz1 = step(gz1, vec4(0.0));", "gx1 -= sz1 * (step(0.0, gx1) - 0.5);", "gy1 -= sz1 * (step(0.0, gy1) - 0.5);", "vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);", "vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);", "vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);", "vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);", "vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);", "vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);", "vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);", "vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);", "vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));", "g000 *= norm0.x;", "g010 *= norm0.y;", "g100 *= norm0.z;", "g110 *= norm0.w;", "vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));", "g001 *= norm1.x;", "g011 *= norm1.y;", "g101 *= norm1.z;", "g111 *= norm1.w;", "float n000 = dot(g000, Pf0);", "float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));", "float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));", "float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));", "float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));", "float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));", "float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));", "float n111 = dot(g111, Pf1);", "vec3 fade_xyz = fade(Pf0);", "vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);", "vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);", "float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);", "return 2.2 * n_xyz;", "}", "float turbulence( vec3 p ) {", "float w = 200.0;", "float t = -.5;", "for (float f = 1.0 ; f <= 10.0 ; f++ ){", "float power = pow( 2.0, f );", "t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );", "}", "return t;", "}", "varying vec2 vUvDisplacement;", "void main() {", "vUv = uv;", "float strength = texture2D( mapStrength, uv ).r;", "float time = uTime * 0.005;", "float noise = cnoise( vec3( 1.0 ) * time ) * 6.0 * -.10;", "float b = 2.0 * cnoise( normal + vec3( 4.0 * time ) );", "float result = -noise + b;", "time = uTime * 5.0;", "float displacement = -0.5 + time / 2048.0 - floor( time / 2048.0 );", "vUvDisplacement = vec2( vUv.x + displacement, vUv.y - displacement );", "float wind = texture2D( mapWind, vUvDisplacement ).r;", "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "mvPosition.x += result * strength * .2 + wind * .1 * strength;", "mvPosition.y += result * strength * .025 - wind * .1 * strength;", "gl_Position = projectionMatrix * mvPosition;", "}"].join("\n");

module.exports.fs = ["varying vec2 vUv;", "varying vec2 vUvDisplacement;", "uniform sampler2D mapWind;", "uniform sampler2D mapWindSlashes;", "uniform sampler2D mapThreshold;", "uniform float uTime;", 'uniform float sharpness;', 'uniform float threshold;', "uniform sampler2D mapWinter;", "uniform sampler2D mapSummer;", "uniform sampler2D mapSpring;", "uniform sampler2D mapAutumn;", "uniform float currWinter;", "uniform float currSummer;", "uniform float currSpring;", "uniform float currAutumn;", "uniform float toWinter;", "uniform float toSummer;", "uniform float toSpring;", "uniform float toAutumn;", "void main() {", "vec4 colorWind = texture2D( mapWind, vUvDisplacement );", "vec4 colorWindSlashes = texture2D( mapWindSlashes, vec2( vUv.x - cos( uTime * .1) * .0009, vUv.y + cos( uTime * .1 ) * .001 ) );", "vec4 colorSlashes = colorWindSlashes * colorWind * .5 + colorWind * 0.00505;", "vec4 colorWinter = texture2D( mapWinter, vUv );", "vec4 colorSummer = texture2D( mapSummer, vUv );", "vec4 colorSpring = texture2D( mapSpring, vUv );", "vec4 colorAutumn = texture2D( mapAutumn, vUv );", "vec4 currColor = colorWinter * currWinter + colorAutumn * currAutumn + colorSpring * currSpring + colorSummer * currSummer;", "vec4 toColor = colorWinter * toWinter + colorAutumn * toAutumn + colorSpring * toSpring + colorSummer * toSummer;", "vec4 mask = texture2D( mapThreshold, vUv );", "float r = threshold * ( 1.0 + sharpness * 2.0 ) - sharpness;", "float maskOpacity = clamp( ( mask.r - r ) * ( 1.0 / sharpness ), 0.0, 1.0 );", "vec4 color = currColor * ( 1.0 - maskOpacity );", "color += toColor * maskOpacity;", "color += colorSlashes;", "gl_FragColor = color;", "}"].join("\n");



},{}],26:[function(require,module,exports){
module.exports.vs = ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n");

module.exports.fs = ["varying vec2 vUv;", "uniform vec3 hsl;", "uniform sampler2D map;", "uniform float percent;", "vec3 hsv2rgb( vec3 c ) {", "vec4 K = vec4( 1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0 );", "vec3 p = abs( fract( c.xxx + K.xyz ) * 6.0 - K.www );", "return c.z * mix( K.xxx, clamp( p - K.xxx, 0.0, 1.0 ), c.y );", "}", "void main() {", "vec4 color = texture2D( map, vUv );", "gl_FragColor = vec4(mix(color.rgb, hsl, percent), 1.0);", "}"].join("\n");



},{}],27:[function(require,module,exports){
module.exports = {
  uniforms: {
    "tDiffuse": {
      type: "t",
      value: null
    },
    "overlayColor": {
      type: "v3",
      value: new THREE.Vector3(0.76, .87, 1)
    },
    "alpha": {
      type: "f",
      value: 0
    }
  },
  vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
  fragmentShader: ["uniform sampler2D tDiffuse;", "uniform vec3 overlayColor;", "uniform float alpha;", "varying vec2 vUv;", "void main() {", "vec4 color = texture2D( tDiffuse, vUv );", "gl_FragColor = vec4(mix(color.rgb, overlayColor, alpha), 1.0);", "}"].join("\n")
};



},{}],28:[function(require,module,exports){
module.exports.vs = ["varying vec2 vUv;", "uniform sampler2D mapStrength;", "uniform float uTime;", "vec3 mod289(vec3 x)", "{", "return x - floor(x * (1.0 / 289.0)) * 289.0;", "}", "vec4 mod289(vec4 x)", "{", "return x - floor(x * (1.0 / 289.0)) * 289.0;", "}", "vec4 permute(vec4 x)", "{", "return mod289(((x*34.0)+1.0)*x);", "}", "vec4 taylorInvSqrt(vec4 r)", "{", "return 1.79284291400159 - 0.85373472095314 * r;", "}", "vec3 fade(vec3 t) {", "return t*t*t*(t*(t*6.0-15.0)+10.0);", "}", "float cnoise(vec3 P)", "{", "vec3 Pi0 = floor(P); // Integer part for indexing", "vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1", "Pi0 = mod289(Pi0);", "Pi1 = mod289(Pi1);", "vec3 Pf0 = fract(P); // Fractional part for interpolation", "vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0", "vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);", "vec4 iy = vec4(Pi0.yy, Pi1.yy);", "vec4 iz0 = Pi0.zzzz;", "vec4 iz1 = Pi1.zzzz;", "vec4 ixy = permute(permute(ix) + iy);", "vec4 ixy0 = permute(ixy + iz0);", "vec4 ixy1 = permute(ixy + iz1);", "vec4 gx0 = ixy0 * (1.0 / 7.0);", "vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;", "gx0 = fract(gx0);", "vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);", "vec4 sz0 = step(gz0, vec4(0.0));", "gx0 -= sz0 * (step(0.0, gx0) - 0.5);", "gy0 -= sz0 * (step(0.0, gy0) - 0.5);", "vec4 gx1 = ixy1 * (1.0 / 7.0);", "vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;", "gx1 = fract(gx1);", "vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);", "vec4 sz1 = step(gz1, vec4(0.0));", "gx1 -= sz1 * (step(0.0, gx1) - 0.5);", "gy1 -= sz1 * (step(0.0, gy1) - 0.5);", "vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);", "vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);", "vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);", "vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);", "vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);", "vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);", "vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);", "vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);", "vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));", "g000 *= norm0.x;", "g010 *= norm0.y;", "g100 *= norm0.z;", "g110 *= norm0.w;", "vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));", "g001 *= norm1.x;", "g011 *= norm1.y;", "g101 *= norm1.z;", "g111 *= norm1.w;", "float n000 = dot(g000, Pf0);", "float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));", "float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));", "float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));", "float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));", "float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));", "float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));", "float n111 = dot(g111, Pf1);", "vec3 fade_xyz = fade(Pf0);", "vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);", "vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);", "float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);", "return 2.2 * n_xyz;", "}", "float pnoise(vec3 P, vec3 rep)", "{", "vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period", "vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period", "Pi0 = mod289(Pi0);", "Pi1 = mod289(Pi1);", "vec3 Pf0 = fract(P); // Fractional part for interpolation", "vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0", "vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);", "vec4 iy = vec4(Pi0.yy, Pi1.yy);", "vec4 iz0 = Pi0.zzzz;", "vec4 iz1 = Pi1.zzzz;", "vec4 ixy = permute(permute(ix) + iy);", "vec4 ixy0 = permute(ixy + iz0);", "vec4 ixy1 = permute(ixy + iz1);", "vec4 gx0 = ixy0 * (1.0 / 7.0);", "vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;", "gx0 = fract(gx0);", "vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);", "vec4 sz0 = step(gz0, vec4(0.0));", "gx0 -= sz0 * (step(0.0, gx0) - 0.5);", "gy0 -= sz0 * (step(0.0, gy0) - 0.5);", "vec4 gx1 = ixy1 * (1.0 / 7.0);", "vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;", "gx1 = fract(gx1);", "vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);", "vec4 sz1 = step(gz1, vec4(0.0));", "gx1 -= sz1 * (step(0.0, gx1) - 0.5);", "gy1 -= sz1 * (step(0.0, gy1) - 0.5);", "vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);", "vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);", "vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);", "vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);", "vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);", "vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);", "vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);", "vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);", "vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));", "g000 *= norm0.x;", "g010 *= norm0.y;", "g100 *= norm0.z;", "g110 *= norm0.w;", "vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));", "g001 *= norm1.x;", "g011 *= norm1.y;", "g101 *= norm1.z;", "g111 *= norm1.w;", "float n000 = dot(g000, Pf0);", "float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));", "float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));", "float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));", "float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));", "float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));", "float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));", "float n111 = dot(g111, Pf1);", "vec3 fade_xyz = fade(Pf0);", "vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);", "vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);", "float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);", "return 2.2 * n_xyz;", "}", "float turbulence( vec3 p ) {", "float w = 200.0;", "float t = -.5;", "for (float f = 1.0 ; f <= 10.0 ; f++ ){", "float power = pow( 2.0, f );", "t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );", "}", "return t;", "}", "void main() {", "vUv = uv;", "float strength = texture2D( mapStrength, uv ).r;", "float time = uTime * 0.005;", "float noise = cnoise( vec3( 1.0 ) * time ) * 6.0 * -.10;", "float b = 2.0 * cnoise( normal + vec3( 4.0 * time ) );", "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "mvPosition.y += ( -noise + b ) * strength * .2;", "mvPosition.z += ( -noise + b ) * strength * .2;", "gl_Position = projectionMatrix * mvPosition;", "}"].join("\n");

module.exports.fs = ["varying vec2 vUv;", "uniform sampler2D map;", "void main() {", "gl_FragColor = texture2D( map, vUv );", "}"].join("\n");



},{}],29:[function(require,module,exports){
module.exports.vs = ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n");

module.exports.fs = ["varying vec2 vUv;", "uniform sampler2D mapThreshold;", "uniform sampler2D mapWinter;", "uniform sampler2D mapSummer;", "uniform sampler2D mapSpring;", "uniform sampler2D mapAutumn;", "uniform float currWinter;", "uniform float currSummer;", "uniform float currSpring;", "uniform float currAutumn;", "uniform float toWinter;", "uniform float toSummer;", "uniform float toSpring;", "uniform float toAutumn;", 'uniform float sharpness;', 'uniform float threshold;', "void main() {", "vec4 colorWinter = texture2D( mapWinter, vUv );", "vec4 colorSummer = texture2D( mapSummer, vUv );", "vec4 colorSpring = texture2D( mapSpring, vUv );", "vec4 colorAutumn = texture2D( mapAutumn, vUv );", "vec4 currColor = colorWinter * currWinter + colorAutumn * currAutumn + colorSpring * currSpring + colorSummer * currSummer;", "vec4 toColor = colorWinter * toWinter + colorAutumn * toAutumn + colorSpring * toSpring + colorSummer * toSummer;", "vec4 mask = texture2D( mapThreshold, vUv );", "float r = threshold * ( 1.0 + sharpness * 2.0 ) - sharpness;", "float maskOpacity = clamp( ( mask.r - r ) * ( 1.0 / sharpness ), 0.0, 1.0 );", "vec4 color = currColor * ( 1.0 - maskOpacity );", "color += toColor * maskOpacity;", "gl_FragColor = color;", "}"].join("\n");



},{}]},{},[1])