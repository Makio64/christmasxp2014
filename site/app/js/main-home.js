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



},{"home/Home":7,"home/Loading":8}],2:[function(require,module,exports){
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



},{}],3:[function(require,module,exports){
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



},{}],4:[function(require,module,exports){
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



},{}],5:[function(require,module,exports){
var Artists;

Artists = (function() {
  function Artists() {}

  Artists.prototype.show = function() {};

  Artists.prototype.hide = function() {
    return done(1000);
  };

  return Artists;

})();

module.exports = Artists;



},{}],6:[function(require,module,exports){
var Credits;

Credits = (function() {
  function Credits() {}

  Credits.prototype.show = function() {};

  Credits.prototype.hide = function() {
    return done(1000);
  };

  return Credits;

})();

module.exports = Credits;



},{}],7:[function(require,module,exports){
var About, Artists, Credits, Home, Menu, nav,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

nav = require("common/nav");

Menu = require("home/Menu");

Artists = require("home/Artists");

About = require("home/About");

Credits = require("home/Credits");

Home = (function() {
  function Home() {
    this.show = __bind(this.show, this);
    this._onNavChange = __bind(this._onNavChange, this);
    this.dom = document.querySelector(".home");
    this._menu = new Menu;
    this._artists = new Artists;
    this._about = new About;
    this._credits = new Credits;
    this._currentModule = null;
    nav.on("change", this._onNavChange);
  }

  Home.prototype._onNavChange = function(id) {
    var newModule;
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
  };

  Home.prototype.show = function() {
    this.dom.style.display = "block";
    TweenLite.set(this.dom, {
      css: {
        alpha: 0
      }
    });
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



},{"common/nav":3,"home/About":4,"home/Artists":5,"home/Credits":6,"home/Menu":9}],8:[function(require,module,exports){
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
    this._domPercent.innerHTML = this.percent;
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



},{}],9:[function(require,module,exports){
var Menu, interactions, nav,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

nav = require("common/nav");

Menu = (function() {
  function Menu() {
    this._onBtCredits = __bind(this._onBtCredits, this);
    this._onBtAbout = __bind(this._onBtAbout, this);
    this._onBtArtists = __bind(this._onBtArtists, this);
    var domBtAbout, domBtArtists, _i, _j, _len, _len1, _ref, _ref1;
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
  }

  Menu.prototype._onBtArtists = function(e) {
    e.origin.preventDefault();
    return nav.set("artists");
  };

  Menu.prototype._onBtAbout = function(e) {
    e.origin.preventDefault();
    return nav.set("about");
  };

  Menu.prototype._onBtCredits = function(e) {
    e.origin.preventDefault();
    return nav.set("credits");
  };

  return Menu;

})();

module.exports = Menu;



},{"common/interactions":2,"common/nav":3}]},{},[1])