(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Experiments, experiments;

Experiments = require("experiments/Experiments");

experiments = new Experiments();



},{"experiments/Experiments":4}],2:[function(require,module,exports){
module.exports={
    "experiments": [
        {
            "idx": 1,
            "isAvailable": true,
            "author": "Guillaume Gouessan",
            "bio": "Interactive Developer @hellohikimori",
            "title": "Polar",
            "subtitle": "",
            "desc": "Hop aboard the Polar Express. Travel through windy plains covered in snow, enter the tunnel to switch from Polar to Solar.",
            "site": "https://twitter.com/superguigui",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "Click and drag to clear the window"
                }
            ]
        },
        {
            "idx": 2,
            "isAvailable": false,
            "author": "Guillaume Gouessan",
            "bio": "Interactive Developer @hellohikimori",
            "title": "Polar",
            "subtitle": "",
            "desc": "Hop aboard the Polar Express. Travel through windy plains covered in snow, enter the tunnel to switch from Polar to Solar.",
            "site": "https://twitter.com/superguigui",
            "isWebGL": true,
            "isMobile": false,
            "details": [
                {
                    "title": "controls",
                    "desc": "Click and drag to clear the window"
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



},{}],4:[function(require,module,exports){
var Experiments, Infos, Menu, XP, datas,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Menu = require("experiments/Menu");

XP = require("experiments/XP");

Infos = require("experiments/Infos");

datas = require("data.json").experiments;

Experiments = (function() {
  function Experiments() {
    this._showPage = __bind(this._showPage, this);
    this._xp = null;
    this._infos = new Infos();
    page("/experiments/", this._showPage);
    page("/experiments/:id", this._showPage);
    page("/experiments/404", this._show404);
    page();
    this._menu = new Menu();
  }

  Experiments.prototype._showPage = function(data) {
    if (!data.params.id) {
      page("/experiments/1");
      return;
    }
    return this._showXP(data.params.id);
  };

  Experiments.prototype._showXP = function(idx) {
    var data;
    data = datas[idx - 1];
    this._infos.update(data);
    if (this._xp) {
      this._xp.hide();
      this._xp = new XP(data);
      return this._xp.show(true);
    } else {
      this._xp = new XP(data);
      return this._xp.show();
    }
  };

  Experiments.prototype._show404 = function() {};

  return Experiments;

})();

module.exports = Experiments;



},{"data.json":2,"experiments/Infos":5,"experiments/Menu":6,"experiments/XP":7}],5:[function(require,module,exports){
var Infos, interactions,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

Infos = (function() {
  function Infos() {
    this._onClose = __bind(this._onClose, this);
    this._onOpen = __bind(this._onOpen, this);
    this._dom = document.querySelector(".infos");
    this._domBtOpen = document.querySelector(".experiment-nav-entry--infos");
    this._domBtClose = this._dom.querySelector(".bt-close");
    interactions.on(this._domBtOpen, "click", this._onOpen);
    interactions.on(this._domBtClose, "click", this._onClose);
    this._domIdx = document.querySelector(".infos-idx");
    this._domTitle = document.querySelector(".infos-title");
    this._domAuthor = document.querySelector(".infos-author");
    this._domSubtitle = document.querySelector(".infos-subtitle");
    this._domDesc = document.querySelector(".infos-desc");
    this._domParts = document.querySelector(".infos-parts");
  }

  Infos.prototype._onOpen = function(e) {
    e.preventDefault();
    return this.show();
  };

  Infos.prototype._onClose = function(e) {
    e.preventDefault();
    return this.hide();
  };

  Infos.prototype.update = function(data) {
    var detail, dom, domDesc, domTitle, fragment, _i, _len, _ref;
    if (data.idx < 10) {
      this._domIdx.innerHTML = "0" + data.idx;
    } else {
      this._domIdx.innerHTML = data.idx;
    }
    this._domTitle.innerHTML = data.title;
    this._domAuthor.innerHTML = data.author;
    this._domSubtitle.innerHTML = data.subtitle;
    this._domDesc.innerHTML = data.desc;
    while (this._domParts.firstChild) {
      this._domParts.removeChild(this._domParts.firstChild);
    }
    fragment = document.createDocumentFragment();
    _ref = data.details;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      detail = _ref[_i];
      dom = document.createElement("li");
      domTitle = document.createElement("h3");
      domTitle.innerHTML = detail.title;
      dom.appendChild(domTitle);
      domDesc = document.createElement("span");
      domDesc.innerHTML = detail.desc;
      dom.appendChild(domDesc);
      fragment.appendChild(dom);
    }
    return this._domParts.appendChild(fragment);
  };

  Infos.prototype.show = function() {
    return TweenLite.to(this._dom, .5, {
      css: {
        x: 360,
        force3D: true
      },
      ease: Cubic.easeInOut
    });
  };

  Infos.prototype.hide = function() {
    return TweenLite.to(this._dom, .5, {
      css: {
        x: 0,
        force3D: true
      },
      ease: Cubic.easeInOut
    });
  };

  return Infos;

})();

module.exports = Infos;



},{"common/interactions":3}],6:[function(require,module,exports){
var Menu, interactions,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

interactions = require("common/interactions");

Menu = (function() {
  function Menu() {
    this._onClick = __bind(this._onClick, this);
    var domItem, _i, _len, _ref;
    this._domItems = document.querySelectorAll(".menu-item");
    _ref = this._domItems;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      domItem = _ref[_i];
      interactions.on(domItem, "click", this._onClick);
    }
  }

  Menu.prototype._onClick = function(e) {
    var idx;
    e.preventDefault();
    idx = this._indexOf(e.currentTarget);
    if (idx === -1) {
      page("/experiments/404");
      return;
    }
    return page("/experiments/" + (idx + 1));
  };

  Menu.prototype._indexOf = function(target) {
    var domItem, i, _i, _len, _ref;
    _ref = this._domItems;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      domItem = _ref[i];
      if (domItem === target) {
        return i;
      }
    }
    return -1;
  };

  return Menu;

})();

module.exports = Menu;



},{"common/interactions":3}],7:[function(require,module,exports){
var XP;

XP = (function() {
  function XP(_data) {
    this._data = _data;
    this._domCnt = document.querySelector(".experiment-iframe-holder");
    this._createIframe();
  }

  XP.prototype._createIframe = function() {
    this._domIframe = document.createElement("iframe");
    return this._domIframe.src = "./" + this._data.idx + "/";
  };

  XP.prototype.show = function(animated) {
    if (animated == null) {
      animated = false;
    }
    if (!animated) {
      return this._domCnt.appendChild(this._domIframe);
    } else {
      TweenLite.set(this._domIframe, {
        css: {
          x: -document.body.offsetWidth,
          force3D: true
        }
      });
      TweenLite.to(this._domIframe, .6, {
        css: {
          x: 0,
          force3D: true
        },
        ease: Cubic.easeInOut
      });
      return this._domCnt.appendChild(this._domIframe);
    }
  };

  XP.prototype.hide = function() {
    return TweenLite.to(this._domIframe, .6, {
      css: {
        x: document.body.offsetWidth,
        force3D: true
      },
      ease: Cubic.easeInOut,
      onComplete: (function(_this) {
        return function() {
          return _this._domCnt.removeChild(_this._domIframe);
        };
      })(this)
    });
  };

  return XP;

})();

module.exports = XP;



},{}]},{},[1])