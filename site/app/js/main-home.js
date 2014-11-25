(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Home, Loading, loading;

Loading = require("home/Loading");

Home = require("home/Home");

loading = new Loading;

loading.on("complete", function() {
  var home;
  home = new Home();
  return loading.hide().then(function() {
    loading.dispose();
    return home.show();
  });
});

loading.start();



},{"home/Home":8,"home/Loading":9}],2:[function(require,module,exports){
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
        alpha: 0
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
        rotation: -r
      }
    });
    TweenLite.set(this._nodeA, {
      css: {
        rotation: r
      }
    });
    r = (Math.PI * .25 + (Math.random() * Math.PI * .3) - .15) * 180 / Math.PI;
    TweenLite.set(this._maskB, {
      css: {
        alpha: 0,
        rotation: -r
      }
    });
    TweenLite.set(this._nodeB, {
      css: {
        rotation: r
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
        rotationX: -20,
        rotationY: -20,
        x: -50,
        z: 60
      }
    });
    TweenLite.to(this._maskA, .05, {
      delay: delay,
      css: {
        alpha: .45,
        rotationX: -10,
        rotationY: -10,
        x: -35,
        z: 45
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._maskA, .15, {
      delay: delay + .05,
      css: {
        alpha: 1,
        rotationX: 0,
        rotationY: 0,
        x: 0,
        z: 0
      },
      ease: Quart.easeOut
    });
    TweenLite.set(this._maskB, {
      delay: delay,
      css: {
        alpha: .2,
        rotationX: 20,
        rotationY: 20,
        x: 50,
        z: 60
      }
    });
    TweenLite.to(this._maskB, .05, {
      delay: delay + .05,
      css: {
        alpha: .45,
        rotationX: 10,
        rotationY: 10,
        x: 35,
        z: 45
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._maskB, .15, {
      delay: delay + .1,
      css: {
        alpha: 1,
        rotationX: 0,
        rotationY: 0,
        x: 0,
        z: 0
      },
      ease: Quart.easeOut
    });
    TweenLite.set(this._domContent, {
      delay: delay,
      css: {
        rotationY: -20,
        z: 20,
        alpha: 0
      }
    });
    return TweenLite.to(this._domContent, .2, {
      delay: delay + .15,
      css: {
        rotationY: 0,
        z: 0,
        alpha: 1
      },
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
    TweenLite.to(this._domContent, .1, {
      delay: delay,
      css: {
        alpha: .85,
        rotationY: -7,
        z: 20
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._domContent, .05, {
      delay: delay + .1,
      css: {
        alpha: 0,
        rotationY: -20,
        z: 60
      },
      ease: Cubic.easeOut
    });
    TweenLite.to(this._maskA, .1, {
      delay: delay + .05,
      css: {
        alpha: .85,
        rotationY: -7,
        x: -15,
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
        z: 60
      },
      ease: Cubic.easeOut
    });
    TweenLite.to(this._maskB, .1, {
      delay: delay + .1 + .05,
      css: {
        alpha: .85,
        rotationY: 7,
        x: 15,
        z: 20
      },
      ease: Quad.easeIn
    });
    TweenLite.to(this._maskB, .1, {
      delay: delay + .1 + .1,
      css: {
        alpha: 0,
        rotationY: 20,
        x: 50,
        z: 60
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
        alpha: 1
      }
    });
  };

  return IceAnim;

})();

module.exports = IceAnim;



},{}],3:[function(require,module,exports){
var Interactions,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Interactions = (function() {
  function Interactions() {
    this._downs = {};
    this._moves = {};
    this._ups = {};
    this._clicks = {};
    this._interactions = [this._downs, this._moves, this._ups, this._clicks];
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
      if (this._isTouchDevice) {
        e.x = e.touches[0].clientX;
        e.y = e.touches[0].clientY;
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
    if (this._isTouchDevice) {
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



},{}],4:[function(require,module,exports){
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



},{}],5:[function(require,module,exports){
var About;

About = (function() {
  function About() {}

  About.prototype.show = function() {};

  About.prototype.hide = function() {
    return done(1000);
  };

  return About;

})();

module.exports = About;



},{}],6:[function(require,module,exports){
var Artists, IceAnim, interactions, nav;

interactions = require("common/interactions");

nav = require("common/nav");

IceAnim = require("common/anim/IceAnim");

Artists = (function() {
  function Artists() {
    this.dom = document.querySelector(".artists");
    this._domEntries = document.querySelector(".artists-entries");
    this._domEntriesHolders = this.dom.querySelectorAll(".artists-entry-holder");
    this._domBtClose = this.dom.querySelector(".bt-close-holder");
    interactions.on(this._domBtClose, "click", this._onBtClose);
  }

  Artists.prototype._onBtClose = function(e) {
    e.preventDefault();
    return nav.set("");
  };

  Artists.prototype.show = function() {
    var d, dAdd, dom, domEntriesHolders, domInfos, idx, _i, _j, _len, _len1, _results;
    this.dom.style.display = "block";
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
      d += .05;
    }
    d = 0;
    dAdd = .05;
    _results = [];
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
          y: 50,
          force3D: true
        }
      });
      TweenLite.to(dom, .1, {
        delay: .1 + d,
        css: {
          alpha: .325,
          y: 35,
          force3D: true
        },
        ease: Quad.easeIn
      });
      TweenLite.to(dom, .25, {
        delay: .1 + .1 + d,
        css: {
          alpha: 1,
          y: 0,
          force3D: true
        },
        ease: Quart.easeOut
      });
      d += dAdd;
      dAdd *= .9;
      if (dAdd < .025) {
        _results.push(dAdd = .025);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
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



},{"common/anim/IceAnim":2,"common/interactions":3,"common/nav":4}],7:[function(require,module,exports){
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
        x: -200
      }
    });
    TweenLite.to(this._domTitle, .1, {
      delay: .05,
      css: {
        alpha: .4,
        x: -130
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
          x: -200,
          force3D: true
        }
      });
      TweenLite.to(dom, .1, {
        delay: d,
        css: {
          alpha: .4,
          x: -130,
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



},{"common/interactions":3,"common/nav":4}],8:[function(require,module,exports){
var About, Artists, Home, Menu, nav,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

nav = require("common/nav");

Menu = require("home/Menu");

Artists = require("home/Artists");

About = require("home/About");

Home = (function() {
  function Home() {
    this.show = __bind(this.show, this);
    this._onNavChange = __bind(this._onNavChange, this);
    this.dom = document.querySelector(".home");
    TweenLite.set(this.dom, {
      css: {
        alpha: 0
      }
    });
    this.dom.style.display = "block";
    this._menu = new Menu;
    this._artists = new Artists;
    this._about = new About;
    this._currentModule = null;
    nav.on("change", this._onNavChange);
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



},{"common/nav":4,"home/About":5,"home/Artists":6,"home/Menu":10}],9:[function(require,module,exports){
var Loading,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
    TweenLite.to(this.dom, duration, {
      css: {
        alpha: 0
      }
    });
    return done(duration * .5 * 1000);
  };

  Loading.prototype.dispose = function() {
    console.log("dispose");
    return document.body.removeChild(this.dom);
  };

  return Loading;

})(Emitter);

module.exports = Loading;



},{}],10:[function(require,module,exports){
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
    var domBtAbout, domBtArtists, _i, _j, _len, _len1, _ref, _ref1;
    this.dom = document.querySelector(".menu");
    this._credits = new Credits;
    this._domMenuLight = document.querySelector(".menu--light");
    this._menuLightVisible = false;
    this._domBtsArtists = document.querySelectorAll(".menu-entry--artists a");
    this._domBtsAbout = document.querySelectorAll(".menu-entry--about a");
    this._domBtsCredits = document.querySelector(".menu-subentry a");
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
    interactions.on(this._domBtsCredits, "click", this._onBtCredits);
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



},{"common/anim/IceAnim":2,"common/interactions":3,"common/nav":4,"home/Credits":7}]},{},[1])