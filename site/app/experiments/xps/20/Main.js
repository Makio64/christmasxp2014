(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Signal = require("./Signal");
require("./polyfills");


function Loop(callback, scope, autoPlay)
{
  this.onUpdate = new Signal();
  if(callback)
  {
    this.onUpdate.add(callback, scope);
    if(autoPlay || autoPlay === undefined)
      this.play();
  }
}

Loop.prototype = {

  isPaused : true,

  play : function()
  {
    if(!this.isPaused) return;
    this.isPaused = false;
    this._onUpdate();
  },

  _onUpdate : function()
  {
    //can cause the loop to be paused
    this.onUpdate.dispatch();
    if(!this.isPaused)
      this._requestFrame = requestAnimationFrame(this._onUpdate.bind(this));
  },

  pause : function()
  {
    this.isPaused = true;
    cancelAnimationFrame(this._requestFrame);
  },
  
  dispose : function()
  {
    this.onUpdate.dispose();
    pause();
  }
};


module.exports = Loop;

},{"./Signal":4,"./polyfills":13}],2:[function(require,module,exports){
function Matrix4()
{
  this.data = new Float32Array(16);
  this.identity();
}


Matrix4.prototype = {

  identity : function()
  {
    var t = this.data;
    t[0] = t[5] = t[10] = t[15] = 1;
    t[1] = t[2] = t[3] = t[4] = t[6] = t[7] = t[8] = t[9] = t[11] = t[12] = t[13] = t[14] = 0;
  },


  transformVector : function(v, out)
  {
    if(out === undefined) {
      out = v;
    }
    var t = this.data;
    var x = v.x, y = v.y, z = v.z, w = v.w;
    out.x = t[0] * x + t[1] * y + t[2] * z + t[3] * w;
    out.y = t[4] * x + t[5] * y + t[6] * z + t[7] * w;
    out.z = t[8] * x + t[9] * y + t[10] * z + t[11] * w;
    out.w = t[12] * x + t[13] * y + t[14] * z + t[15] * w;
  },

    
  appendTransform : function(mat)
  {
    var t = mat.data;
    this.append(
      t[0], t[1], t[2], t[3], 
      t[4], t[5], t[6], t[7], 
      t[8], t[9], t[10], t[11], 
      t[12], t[13], t[14], t[15]
    );
  },


  scale : function(sx, sy, sz)
  {
    this.append(
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1
    );
  },


  translate : function(tx, ty, tz)
  {
    this.append(
      1, 0, 0, tx,
      0, 1, 0, ty,
      0, 0, 1, tz,
      0, 0, 0, 1
    );
  },


  //http://jeux.developpez.com/faq/math/?page=quaternions
  rotate : function(x, y, z, angle)
  {
    angle *= 0.5;
    var sin = Math.sin(angle);

    x *= sin; y *= sin; z *= sin;
    w = Math.cos(angle);

    var len2 = x * x + y * y + z * z + w * w;
    if(len2 === 0) {
      X = len2 = 1;
    }
    var r = 1 / len2;

    var xx = x * x * r, xy = x * y * r;
    var xz = x * z * r, xw = x * w * r;
    var yy = y * y * r, yz = y * z * r;
    var yw = y * w * r;
    var zz = z * z * r, zw = z * w * r;

    var a = 1 - 2 * (yy + zz), b = 2 * (xy + zw), c = 2 * (xz - yw);
    var e = 2 * (xy - zw), f = 1 - 2 * (xx + zz), g = 2 * (yz + xw);
    var i = 2 * (xz + yw), j = 2 * (yz - xw), k = 1 - 2 * (xx + yy);

    var t = this.data;
    var d0 = t[0], d1 = t[1], d2 = t[2], d3 = t[3];
    var d4 = t[4], d5 = t[5], d6 = t[6], d7 = t[7];
    var d8 = t[8], d9 = t[9], d10 = t[10], d11 = t[11];
    var d12 = t[12], d13 = t[13], d14 = t[14], d15 = t[15];

    t[0] = a * d0 + e * d1 + i * d2;
    t[1] = b * d0 + f * d1 + j * d2;
    t[2] = c * d0 + g * d1 + k * d2;

    t[4] = a * d4 + e * d5 + i * d6;
    t[5] = b * d4 + f * d5 + j * d6;
    t[6] = c * d4 + g * d5 + k * d6;

    t[8] = a * d8 + e * d9 + i * d10;
    t[9] = b * d8 + f * d9 + j * d10;
    t[10] = c * d8 + g * d9 + k * d10;

    t[12] = a * d12 + e * d13 + i * d14;
    t[13] = b * d12 + f * d13 + j * d14;
    t[14] = c * d12 + g * d13 + k * d14;
  },


  append : function (a, b, c, d, e, f, g, h, i, j , k, l, m, n, o, p)
  {
    var t = this.data;
    var a1 = t[0], b1 = t[1], c1 = t[2], d1 = t[3];
    var e1 = t[4], f1 = t[5], g1 = t[6], h1 = t[7];
    var i1 = t[8], j1 = t[9], k1 = t[10], l1 = t[11];
    var m1 = t[12], n1 = t[13], o1 = t[14], p1 = t[15];

    t[0] = a * a1 + b * e1 + c * i1 + d * m1;
    t[1] = a * b1 + b * f1 + c * j1 + d * n1;
    t[2] = a * c1 + b * g1 + c * k1 + d * o1;
    t[3] = a * d1 + b * h1 + c * l1 + d * p1;
    
    t[4] = e * a1 + f * e1 + g * i1 + h * m1;
    t[5] = e * b1 + f * f1 + g * j1 + h * n1;
    t[6] = e * c1 + f * g1 + g * k1 + h * o1;
    t[7] = e * d1 + f * h1 + g * l1 + h * p1;
    
    t[8] = i * a1 + j * e1 + k * i1 + l * m1;
    t[9] = i * b1 + j * f1 + k * j1 + l * n1;
    t[10] = i * c1 + j * g1 + k * k1 + l * o1;
    t[11] = i * d1 + j * h1 + k * l1 + l * p1;
    
    t[12] = m * a1 + n * e1 + o * i1 + p * m1;
    t[13] = m * b1 + n * f1 + o * j1 + p * n1;
    t[14] = m * c1 + n * g1 + o * k1 + p * o1;
    t[15] = m * d1 + n * h1 + o * l1 + p * p1;
  },

  
  toString : function()
  {
    var t = this.data;
    var str = "";
    str += t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + "\n";
    str += t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + "\n";
    str += t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + "\n";
    str += t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + "\n";
    return str;
  },


  clone : function()
  {
    var clone = new Matrix4();
    for(var i = 0; i < 16; i++) {
      clone.data[i] = this.data[i];
    }
  }
};


//http://www.songho.ca/opengl/gl_projectionmatrix.html
Matrix4.projection = function(fov, aspect, near, far)
{
  var d = 1 / Math.tan( 0.5 * fov);
  var proj = new Matrix4();
  var t = proj.data;
  
  var inf = 1 / (far - near);
  t[0] = d / aspect;
  t[5] = d;
  t[10] = far * inf;
  t[11] = -near * far * inf;
  t[14] = 1;
  t[15] = 0;
  return proj;
};

  
Matrix4.getToScreen = function(width, height, sx, sy)
{
  var mat = new Matrix4();
  var t = mat.data;
  var d = 1;
  t[0] = 0.5 * width;
  t[3] = 0.5 * width + sx;
  t[5] = -0.5 * height;
  t[7] = 0.5 * height + sy;
  t[10] = t[11] = 0.5 * d;
  return mat;
};


module.exports = Matrix4;

},{}],3:[function(require,module,exports){
var Signal = require("./Signal");

function getNumericStyleProperty(style, prop)
{
    return parseInt(style.getPropertyValue(prop), 10);
}

function elementPosition(e)
{
  var x = 0, y = 0;
  var inner = true ;
  do {
    x += e.offsetLeft;
    y += e.offsetTop;
    var style = getComputedStyle(e,null) ;
    var borderTop = getNumericStyleProperty(style,"border-top-width") ;
    var borderLeft = getNumericStyleProperty(style,"border-left-width") ;
    y += borderTop ;
    x += borderLeft ;
    if (inner){
      var paddingTop = getNumericStyleProperty(style,"padding-top") ;
      var paddingLeft = getNumericStyleProperty(style,"padding-left") ;
      y += paddingTop ;
      x += paddingLeft ;
    }
    inner = false ;
    } while (e = e.offsetParent);
    return { x: x, y: y };
}

function Mouse(target)
{
  this.x = this.y = 0;
  this.oldX = this.oldY = 0;
  this.isDown = false;
  this.target = target || document;
  
  this.onDown = new Signal();
  this.onUp = new Signal();
  this.onMove = new Signal();

  this._moveBind = this._onMouseMove.bind(this);
  this._downBind = this._onMouseDown.bind(this);
  this._upBind = this._onMouseUp.bind(this);
  this.target.onmousemove = this._moveBind;
  this.target.onmousedown = this._downBind;
  this.target.onmouseup = this._upBind;
}

Mouse.prototype = {

  _onMouseMove : function(e)
  {
    this.savePos();
    
    var p = elementPosition(e.target);
    this.x = e.pageX - p.x;
    this.y = e.pageY - p.y;
    this.onMove.dispatch();
  },

  _onMouseDown : function(e)
  {
    this.isDown = true;
    this.savePos();
    this.onDown.dispatch();
  },

  _onMouseUp : function(e)
  {
    this.isDown = false;
    this.savePos();
    this.onUp.dispatch();
  },

  savePos : function()
  {
    this.oldX = this.x;
    this.oldY = this.y;
  },
  
  point : function(pt)
  {
    pt = pt || {};
    pt.x = this.x;
    pt.y = this.y;
    return pt;
  },

  showHand : function()
  {
    this.target.style.cursor = "hand";
  },

  hideHand : function()
  {
    this.target.style.cursor = "default";
  },
  
  dispose : function()
  {
    this.onDown.dispose();
    this.onUp.dispose();
    this.onMove.dispose();

    if(this.target.onmousemove == this._moveBind)
      this.target.onmousemove = null;
    if(this.target.onmousedown == this._downBind)
      this.target.onmousedown = null;
    if(this.target.onmouseup == this._upBind)
      this.target.onmouseup = null;
  }
};

module.exports = Mouse;

},{"./Signal":4}],4:[function(require,module,exports){
if(!Function.prototype.bind)
{
  Function.prototype.bind = function(scope)
  {
    if(!method) throw new Error("no method specified");
    var args = Array.prototype.slice.call(arguments, 2);
    return function()
      {
        var params = Array.prototype.slice.call(arguments);
        method.apply(scope, params.concat(args));
      };
  };
}



function Signal(){ this.listeners = []; }

Signal.prototype = {

  add : function(callback, scope)
  {
    if(!callback) throw new Error("no callback specified");
    var args = Array.prototype.slice.call(arguments, 2);
    var n = this.listeners.length;
    var listener;
    for(var i = 0; i < n; i++)
    {
      listener = this.listeners[i];
      if(listener.callback == callback && listener.scope == scope)
      {
        listener.args = args;
        return listener;
      }
    }
    listener = {callback:callback, scope:scope, args:args};
    this.listeners.push(listener);
    return listener;
  },


  addOnce : function(callback, scope)
  {
    var listener = this.add.apply(this, arguments);
    listener.once = true;
    return listener;
  },

  
  remove : function(callback, scope)
  {
    var n = this.listeners.length;
    for(var i = 0; i < n; i++)
    {
      var listener = this.listeners[i];
      if(listener.callback == callback && listener.scope == scope)
      {
        this.listeners.splice(i, 1);
        return;
      }
    }
  },
  
  dispatch : function()
  {
    var args = Array.prototype.slice.call(arguments);
    var n = this.listeners.length;
    for(var i = 0; i < n; i++)
    {
      var listener = this.listeners[i];
      listener.callback.apply(listener.scope, args.concat(listener.args));
      if(listener.once)
      {
        this.listeners.splice(i, 1);
        n--;
        i--;
      }
    }
  },
  
  dispose : function() { this.listeners = []; }
};

module.exports = Signal;

},{}],5:[function(require,module,exports){
function Vector4(x, y, z, w)
{
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  this.w = w || 1;
}

Vector4.prototype = {
  normalize : function()
  {
    var ratio = 1 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    this.x *= ratio;
    this.y *= ratio;
    this.z *= ratio;
  },


  cloneTo : function(target)
  {
    if(target === undefined) {
      target = new Vector4();
    }
    target.x = this.x;
    target.y = this.y;
    target.z = this.z;
    target.w = this.w;
    return target;
  },


  reciprocalDivide : function()
  {
    var ratio = 1 / this.w;
    this.x = this.x *= ratio;
    this.y = this.y *= ratio;
    this.z = this.z *= ratio;
    this.w = 1;
  },


  scale : function(scale)
  {
    this.x *= scale;
    this.y *= scale;
    this.z *= scale;
    this.w *= scale;
  },


  toString : function()
  {
    return "[Vector4 x:" + this.x + " y:" + this.y +" z:" + this.z + " w:" + this.w + "]";
  }
};


module.exports = Vector4;

},{}],6:[function(require,module,exports){
var DisplayObject = require("./DisplayObject");

function Container()
{
  this.display = new DisplayObject();
  this.display.render = this.render.bind(this);
  this.children = [];
}

Container.prototype = {
  addChildAt :function(child, id)
  {
    if(child.parent)
      child.parent.removeChild(child);
    child.parent = this;
    this.children.splice(id, 0, child);
  },

  setChildIndex :function(child, id)
  {
    var currentId = this.getChildIndex(child);
    if(currentId == -1)
    {
      throw(new Error("node is not a child of current object"));
    }
    if(currentId == id) return;
    this.children.splice(currentId, 1);
    this.children.splice(id, 0, child);
  },

  addChild :function(child)
  {
    if(child.parent)
      child.parent.removeChild(child);
    child.parent = this;
    this.children.push(child);
  },


  removeChild :function(child)
  {
    var id = this.getChildIndex(child);
    if(id == -1) return;
    this.children.splice(id, 1);
    child.parent = null;
  },


  hasChild :function(child)
  {
    return this.getChildIndex(child) != -1;
  },


  getChildIndex :function(child)
  {
    return this.children.indexOf(child);
  },


  render :function(output)
  {
    if(this.stopRender)return;
    var n = this.children.length;
    for(var i = 0; i < n; i++)
    {
      if(!this.children[i]._render)
        console.log(this.children[i]);
      this.children[i]._render(output);
    }
  }
};

module.exports = Container;

},{"./DisplayObject":8}],7:[function(require,module,exports){
DisplayList = {
  Stage : require("./Stage"),
  Sprite : require("./Sprite"),
  SpriteSheet : require("./SpriteSheet"),
  Container : require("./Container"),
  DisplayObject : require("./DisplayObject")
};


module.exports = DisplayList;

},{"./Container":6,"./DisplayObject":8,"./Sprite":10,"./SpriteSheet":11,"./Stage":12}],8:[function(require,module,exports){
function DisplayObject()
{
  this.x = this.y = 0;
  this.scaleX = this.scaleY = 1;
  this.rotation = 0;
  this.visible = true;
  this.blendMode = "source-over";
}

DisplayObject.prototype = {
  _render : function (out)
  {
    if(!this.visible) return;
    out.save();
    out.globalCompositeOperation = this.blendMode;
    out.translate(this.x, this.y);
    out.scale(this.scaleX, this.scaleY);
    var TWO_PI = 2 * Math.PI;
    out.rotate(((this.rotation % TWO_PI) + TWO_PI ) % TWO_PI);
    this.render(out);
    out.restore();
  }
};

module.exports = DisplayObject;

},{}],9:[function(require,module,exports){
module.exports=require(8)
},{}],10:[function(require,module,exports){
var DisplayObject = require("./DisplayoBject");


function Sprite(spriteSheet)
{
  this.display = new DisplayObject();
  this.display.render = this.render.bind(this);

  this.spriteSheet = spriteSheet;

  this.isPlaying = true;
  this.currentFrame = 0;
  this._lastRefresh = 0;

  this.setFramerate(31);

  this.loop = false;

  this.completeCallback = undefined;

  this.setState(this.spriteSheet.defaultState);
}


Sprite.prototype = {

  render : function(output)
  {
    if(this.isPlaying) {
      var time = new Date().getTime();
      var elapsedTime = time - this._lastRefresh;
      if(elapsedTime > this.timeByFrame) {
        this._updateFrame();
      }
    }

    output.rotate(-this.angle);
    output.translate(-this.dx, -this.dy);
    output.rotate(-this.angle);
    this.spriteSheet.drawFrame(output, this.currentState, this.currentFrame);
  },


  _updateFrame : function()
  {
    this.currentFrame = Math.floor(this.currentFrame + 1);
    if(this.currentFrame < 0) this.currentFrame = 0;
    else if(this.currentFrame >= this.totalFrames) {
      if(this.loop) {
        this.currentFrame = 0;
      }
      else {
        this.currentFrame = this.totalFrames - 1;
        this.isPlaying = false;
      }
      if(this.completeCallback) {
        this.completeCallback();
      }
    }

    this._lastRefresh = new Date().getTime();
    this.frameInfos = null;
  },


  setState : function(stateName)
  {
    this.currentState = stateName;
    var infos = this.spriteSheet.getAnimationInfos(this.currentState);
    this.totalFrames = infos.totalFrames;
    this.currentFrame = 0;
    this.frameInfos = null;
  },


  playAnim : function(animName, loop)
  {
    this.setState(animName);
    this.play(loop);
  },


  stopAnim : function(animName)
  {
    this.setState(animName);
    this.stop();
  },


  play : function(loop)
  {
    this.isPlaying = true;
    this.loop = Boolean(loop);
  },


  stop : function()
  {
    this.isPlaying = false;
  },


  goto : function(frameId)
  {
    this.currentFrame = Math.max(Math.min(frameId, this.totalFrames - 1), 0);
    this.frameInfos = null;
  },


  gotoRatio : function(frameRatio)
  {
    this.goto(Math.floor(frameRatio * (this.totalFrames - 1)));
  },


  setFramerate : function(framerate)
  {
    this.timeByFrame = 1000 / framerate;
  },


  getFrameInfos : function()
  {
    return this.spriteSheet.getFrameInfos(this.currentState, this.currentFrame);
  },


  getAnimationInfos : function()
  {
    return this.spriteSheet.getAnimationInfos(this.currentState);
  },


  onComplete : function(callback)
  {
    this.completeCallback = callback;
  }
};

module.exports = Sprite;

},{"./DisplayoBject":9}],11:[function(require,module,exports){
function SpriteSheet(img, data)
{
  this.trace = false;
  this.dataSize = 7; //x,y,w,h,r,px,py
  this.data = data;
  this.img = img;
  for(var k in this.data)
  {
    this.defaultState = k;
    break;
  }
}


SpriteSheet.prototype = {

  drawFrame : function(ctx, animation, id)
  {
    var data = this.data[animation];
    var dataId = id * this.dataSize;
    ctx.save();
    ctx.translate(data[dataId + 5], data[dataId + 6]);
    var w = data[dataId + 2];
    var h = data[dataId + 3];
    if(data[dataId + 4])
    {
      ctx.translate(0, data[dataId + 3]);
      ctx.rotate(-0.5 * Math.PI);
      w = data[dataId + 3];
      h = data[dataId + 2];
    }
    ctx.drawImage(this.img, data[dataId], data[dataId + 1], w, h, 0, 0, w, h);
    ctx.restore();
  },


  getFrameInfos : function(animation, id)
  {
    var data = this.data[animation];
    var dataId = id * this.dataSize;
    return {
      x:data[dataId],
      y:data[dataId + 1],
      w:data[dataId + 2],
      h:data[dataId + 3],
      dx:data[dataId + 5],
      dy:data[dataId + 6]
    };
  },


  getAnimationInfos : function(animation)
  {
    var totalFrames = this.data[animation].length / this.dataSize;
    return {totalFrames:totalFrames};
  }
};


module.exports = SpriteSheet;

},{}],12:[function(require,module,exports){
var DisplayObject = require("./DisplayObject");
var Container = require("./Container");
var Loop = require("../Loop");


function Stage(w, h, canvas)
{
  this.canvas = canvas || document.createElement("canvas");
  this.canvas.width = this.width = w;
  this.canvas.height = this.height = h;

  this.ctx = this.canvas.getContext("2d");
  this.root = new Container();

  this.loop = new Loop(this._update, this, false);
}

Stage.prototype = {

  init : function(domElement)
  {
    if(domElement)
    {
      domElement.appendChild(this.canvas);
    }
    this.loop.play();
  },


  _update : function()
  {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.root.display._render(this.ctx);
  },

  pause : function()
  {
    this.loop.pause();
  },

  dispose : function()
  {
    this.loop.dispose();
  },


  resize : function(width, height)
  {
    this.width = width;
    this.height = height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
};

module.exports = Stage;

},{"../Loop":1,"./Container":6,"./DisplayObject":8}],13:[function(require,module,exports){
//
window.requestAnimationFrame = window.requestAnimationFrame || 
              window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame || 
              window.msRequestAnimationFrame || 
              function(fn){return setTimeout(fn, 50/3);};

//
window.cancelAnimationFrame = window.cancelAnimationFrame || 
               window.mozCancelAnimationFrame || 
               window.webkitCancelAnimationFrame || 
               function(id){clearTimeout(id);};

//
if(!Function.prototype.bind)
{
  Function.prototype.bind = function(scope) 
  {
    if(!method) throw new Error("no method specified");
    var args = Array.prototype.slice.call(arguments, 2);
    return function() 
    {
        var params = Array.prototype.slice.call(arguments);
        method.apply(scope, params.concat(args));
      };
  };
}

},{}],14:[function(require,module,exports){
var Signal = require("../Signal");
function GroupLoader()
{
  this.onComplete = new Signal();
  this.onError = new Signal();
  this.onProgress = new Signal();
  this.data = {};
  this.loaders = {};
  this._queue = undefined;
  this._currentID = undefined;
  this._queueLength = 3;
  this.loaded = 0;
  this.loadedRatio = undefined;
}

GroupLoader.prototype = {

  load : function(scope, completeCallback, errorCallback, progressCallback)
  {
    if(completeCallback !== undefined)
      this.onComplete.add(completeCallback, scope);
    if(errorCallback !== undefined)
      this.onError.add(errorCallback, scope);
    if(progressCallback !== undefined)
      this.onProgress.add(progressCallback, scope);
    this._queue = [];
    this._currentID = 0;
    this.loaded = 0;
    for(var name in this.loaders)
    {
      var loader = this.loaders[name];
      this._queue.push(loader);
      loader.onComplete.add(this._onLoaderComplete, this, name);
    }
    var n = Math.min(this._queueLength, this._queue.length);
    for(var i = 0; i < n; i++) this._loadNext();
  },


  _loadNext : function()
  {
    var nextLoader = this._queue[this._currentID];
    this._currentID++;
    nextLoader.load(this, undefined, this._onError, this._onProgress);
  },


  _onLoaderComplete : function(data, name)
  {
    this.loaded++;
    this.loadedRatio = this.loaded / this._queue.length;
    this.data[name] = data;
    if(this._currentID < this._queue.length) this._loadNext();
    else if(this.loaded == this._queue.length) this.onComplete.dispatch(this.data);
  },


  _onError : function(errors)
  {
    this.errors = errors;
    this.onError.dispatch(this.errors);
  },


  _onProgress : function()
  {
    this.onProgress.dispatch(this);
  }
};

module.exports = GroupLoader;

},{"../Signal":4}],15:[function(require,module,exports){
var Signal = require("../Signal");
function ImageLoader(url)
{
  this.url = url;
  this.onComplete = new Signal();
  this.onProgress = new Signal();
  this.onError = new Signal();

  this.image = new Image();

  this._addListener("progress", this._onProgress);
  this._addListener("load", this._onData);
  this._addListener("error", this._onError);
  this._addListener("abort", this._onError);
}

ImageLoader.prototype = {

  errors : [],
  responseType : "text",

  _addListener : function(type, listener)
  {
    this.image.addEventListener(type, listener.bind(this));
  },


  load : function(scope, completeCallback, errorCallback, progressCallback)
  {
    if(completeCallback !== undefined) {
      this.onComplete.add(completeCallback, scope);
    }
    if(errorCallback !== undefined) {
      this.onError.add(errorCallback, scope);
    }
    if(progressCallback !== undefined) {
      this.onError.add(progressCallback, scope);
    }

    this.image.src = this.url;
  },


  _urlAppendVars : function(url, vars)
  {
    return url + ((/\?/).test(url) ? "&" : "?") + vars;
  },


  _onProgress : function () { this.onProgress.dispatch(this); },


  _onData : function() { this.onComplete.dispatch(this.image); },


  _onError : function() { this.onError.dispatch(this.errors); },


  _varsToString : function(vars)
  {
    var str = "";
    var i = 0;
    for(var key in vars)
    {
      if(i++)str += "&";
      str += key + "=" + vars[key];
    }
    return str;
  },
};

module.exports = ImageLoader;

},{"../Signal":4}],16:[function(require,module,exports){
var Vector4 = require("../grgrdvrt/Vector4");

function Ball(x, y, z, radius)
{
  this.targetPosition = new Vector4(0, 0, 0, 1);
  this.position = new Vector4(x, y, z, 1);
  this.radius = radius;
}

Ball.prototype = {
};

module.exports = Ball;

},{"../grgrdvrt/Vector4":5}],17:[function(require,module,exports){
var DisplayList = require("../grgrdvrt/displayList/DisplayList");
var Vector4 = require("../grgrdvrt/Vector4");

function BallView(ball, spriteSheet)
{
  this.rotation = Math.random() * 2 * Math.PI;
  this.ball = ball;
  this.proj = new Vector4();
  this.sprite = new DisplayList.Sprite(spriteSheet);
  this.sprite.stopAnim("anim");
  this.container = new DisplayList.Container();
  this.container.addChild(this.sprite.display);
  var animInfos = this.sprite.spriteSheet.data.animSize;
  this.sprite.display.x = -0.5 * animInfos.w;
  this.sprite.display.y = -0.5 * animInfos.h;
}

BallView.prototype = {
   play : function()
   {
     this.ball.position.scale(7);
     this.ball.position.w = 1;
     var target = this.ball.targetPosition;
     TweenLite.to(this.ball.position, 1, {
       x:target.x,
       y:target.y,
       z:target.z,
       ease:Power2.easeIn,
     });
   },

  update : function(rotation)
  {
    var display = this.container.display;
    //display.scaleX = display.scaleY = 1.1 * 80 * this.ball.radius * (1 - this.proj.z);
    display.scaleX = display.scaleY = 1.1 * 1 * this.ball.radius * (1 - this.proj.z);
    display.x = this.proj.x;
    display.y = this.proj.y;
    display.visible = this.proj.w > 0 || this.proj.z > 1;
    var angle = rotation + this.rotation;
    //var angle = Math.atan2(this.ball.position.z, this.ball.position.x) + rotation + this.rotation;
    this.sprite.gotoRatio((angle / (2 * Math.PI)) % 1);
  }
};

module.exports = BallView;

},{"../grgrdvrt/Vector4":5,"../grgrdvrt/displayList/DisplayList":7}],18:[function(require,module,exports){
var Ball = require("./Ball");

function DLA(balls)
{
  this.balls = balls;

  var ballInit = new Ball(0, 0, 0, 0.5 + 0.5 * Math.random());
  this.balls.push(ballInit);
}

DLA.prototype = {
  addBall : function()
  {
    var bbox = this.computeBBox();
    var ball = new Ball(
      bbox.minX + Math.random() * (bbox.maxX - bbox.minX),
      bbox.minY + Math.random() * (bbox.maxY - bbox.minY),
      bbox.minZ + Math.random() * (bbox.maxZ - bbox.minZ),
      0.5 + 0.5 * Math.random()
    );

    this.setPositionOutsideBBox(ball, bbox);

    var closest = this.getClosest(ball);
    this.setBallTarget(ball, closest);

    //console.log(ball.position.toString());
    this.balls.push(ball);

    return ball;
  },


  setPositionOutsideBBox : function(ball, bbox)
  {
    var rand = Math.floor(Math.random() * 3);
    switch(rand) {
      case 0 : 
        if(ball.position.x < 0.5 * (bbox.minX + bbox.maxX)) {
          ball.position.x = bbox.minX - ball.radius;
        } 
        else { ball.position.x = bbox.maxX + ball.radius; }
        break;
      case 1 : 
        if(ball.position.y < 0.5 * (bbox.minY + bbox.maxY)) {
          ball.position.y = bbox.minY - ball.radius;
        } 
        else { ball.position.y = bbox.maxY + ball.radius; }
        break;
      case 2 : 
        if(ball.position.z < 0.5 * (bbox.minZ + bbox.maxZ)) {
          ball.position.z = bbox.minZ - ball.radius;
        } 
        else { ball.position.z = bbox.maxZ + ball.radius; }
        break;
      default : break;
    }
  },


  checkCollision : function(ball)
  {
    var collisions = this.balls.filter(function(b) {
      var bPos = b.targetPosition;
      var dx = bPos.x - ball.position.x;
      var dy = bPos.y - ball.position.y;
      var dz = bPos.z - ball.position.z;
      var dist2 = dx * dx + dy * dy + dz * dz;
      var minDist = ball.radius + b.radius;
      return dist2 < minDist * minDist;
    });
    return collisions.length > 0;
  },


  getClosest : function(ball)
  {
    var closest = this.balls.reduce(function(closest, b) {
      var bPos = b.targetPosition;
      var dx = bPos.x - ball.position.x;
      var dy = bPos.y - ball.position.y;
      var dz = bPos.z - ball.position.z;
      var dist = dx * dx + dy * dy + dz * dz;
      if(dist < closest.dist) {
        closest.dist = dist;
        closest.ball = b;
      }
      return closest;
    }, {dist:Number.MAX_VALUE, ball:undefined});
    return closest.ball;
  },


  setBallTarget : function(ball, target)
  {
    var targetPos = target.targetPosition;
    var dx = targetPos.x - ball.position.x;
    var dy = targetPos.y - ball.position.y;
    var dz = targetPos.z - ball.position.z;

    var dist = ball.radius + target.radius;
    var ratio = dist / Math.sqrt(dx * dx + dy * dy + dz * dz);
    ball.targetPosition.x = targetPos.x - dx * ratio;
    ball.targetPosition.y = targetPos.y - dy * ratio;
    ball.targetPosition.z = targetPos.z - dz * ratio;
    ball.target = target;
  },


  computeBBox : function()
  {
    var max = Number.MAX_VALUE;
    return this.balls.reduce(function(bbox, ball) {
      var bPos = ball.targetPosition;
      var minX = bPos.x - ball.radius;
      var maxX = bPos.x + ball.radius;
      var minY = bPos.y - ball.radius;
      var maxY = bPos.y + ball.radius;
      var minZ = bPos.z - ball.radius;
      var maxZ = bPos.z + ball.radius;

      if(minX < bbox.minX) bbox.minX = minX;
      if(maxX > bbox.maxX) bbox.maxX = maxX;
      if(minY < bbox.minY) bbox.minY = minY;
      if(maxY > bbox.maxY) bbox.maxY = maxY;
      if(minZ < bbox.minZ) bbox.minZ = minZ;
      if(maxZ > bbox.maxZ) bbox.maxZ = maxZ;
      return bbox;
    }, {
      minX : max,
      maxX : -max,
      minY : max,
      maxY : -max,
      minZ : max,
      maxZ : -max
    });
  }
};

module.exports = DLA;

},{"./Ball":16}],19:[function(require,module,exports){
function Frost(mouse)
{
  this.canvas = document.createElement("canvas");
  this.ctx = this.canvas.getContext("2d");

  this.mouse = mouse;
  
  
  this.pixels = [];
		
}

Frost.prototype = {

  initPixels : function()
  {
    this.pixels.length = 0;
    var n = Math.pow(Math.random() * Math.random(), 2) * 200;
    for(var i = 0; i < n; i++) {
      this.pixels[i] = {
        x:Math.random() * this.width,
        y:Math.random() * this.height
      };
    }
  },


  update : function()
  {
    var n = this.pixels.length;
    for(var i = 0; i < 200 && n < 100000; i++) {
      this.addPixel();
      n++;
    }

    this.erasePixels();
  },


  erasePixels : function()
  {
    var dMin = 40;
    var n = this.pixels.length;
    for(var i = 0; i < n; i++) {
      var p = this.pixels[i];
      var dx = this.mouse.x - p.x;
      var dy = this.mouse.y - p.y;
      if(dx * dx + dy * dy < dMin * dMin) {
        this.pixels[i] = this.pixels[n - 1];
        n--;
        i--;
      }
    }
    this.ctx.save();
    this.ctx.fillStyle = "lightBlue";
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.beginPath();
    this.ctx.moveTo(this.mouse.x + dMin, this.mouse.y);
    this.ctx.arc(this.mouse.x, this.mouse.y, dMin, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.restore();
    this.pixels.length = n;
  },
  
  
  addPixel : function()
  {
    var p = {
      x : Math.random() * this.width,
      y : Math.random() * this.height
    };
  
    var pRef, dxRef, dyRef;
    var dRef = Number.MAX_VALUE;

    if(p.x < dRef) {
      pRef = {x:0, y:p.y};
      dxRef = -p.x;
      dyRef = 0;
      dRef = p.x;
    }
    if(this.width - p.x < dRef) {
      pRef = {x:this.width, y:p.y};
      dxRef = this.width - p.x;
      dyRef = 0;
      dRef = this.width - p.x;
    }
    if(p.y < dRef) {
      pRef = {x:p.x, y:0};
      dxRef = 0;
      dyRef = -p.y;
      dRef = p.y;
    }
    if(this.height - p.y < dRef) {
      pRef = {x:p.x, y:this.height};
      dxRef = 0;
      dRef = dyRef = this.height - p.y;
      dRef = this.height - p.y;
    }
    dRef *= 30;


    var n = this.pixels.length;
    for(var i = 0; i < n; i++) {
      var p2 = this.pixels[i];
      var dx = p2.x - p.x;
      var dy = p2.y - p.y;
      var d = dx * dx + dy * dy;
      if(d < dRef) {
        dxRef = dx;
        dyRef = dy;
        dRef = d;
        pRef = p2;
      }
    }
  
    if(pRef) {
      var ratio = 1 / Math.sqrt(dRef);
      p.x = pRef.x - ratio * dxRef;
      p.y = pRef.y - ratio * dyRef;
    }
  
    this.pixels.push(p);
  
    this.ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
  },

  resize : function(width, height)
  {
    this.width = width;
    this.height = height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.1";
    this.initPixels();
  }
};


module.exports = Frost;


		
	

},{}],20:[function(require,module,exports){
var Matrix4 = require("../grgrdvrt/Matrix4");
var Loop = require("../grgrdvrt/Loop");
var BallView = require("./BallView");
var spritesData = require("./spritesData");
var DisplayList = require("../grgrdvrt/displayList/DisplayList");

function View(spritesSrc)
{

  this.rotationSpeed = 0;
  this.rotationAcceleration = 0;
  this.maxRotationSpeed = 0.05;

  this.translationSpeed = 0;
  this.minTranslation = 0.6;
  this.maxTranslation = 4;
  this.translationValue = this.minTranslation;

  this.spriteSheets = [];
  for(var spriteId in spritesSrc) {
    var spriteSrc = spritesSrc[spriteId];
    var spriteData = spritesData[spriteId];
    var spriteSheet = new DisplayList.SpriteSheet(spriteSrc, spriteData);
    this.spriteSheets.push(spriteSheet);
  }

  this.width = 700;
  this.height = 700;

  this.canvas = document.createElement("canvas");
  this.stage = new DisplayList.Stage(800, 600, this.canvas);
  //this.stage.init();

  this.scale = 0.05;
  
  this.preRenderer = new Matrix4();
  
  this.renderer = new Matrix4();
  this.initRenderer();

  this.rotationAngle = 0;
  this.rotation = new Matrix4();
  this.transform = new Matrix4();

  this.ballsViews = [];
}


View.prototype = {

  addBall : function(ball, assetId)
  {
    if(assetId === undefined) {
      assetId = Math.floor(Math.random() * this.spriteSheets.length);
      if(Math.random() < 0.5) {
        assetId = 0;
      }
    }
    var spriteSheet = this.spriteSheets[assetId];
    var ballView = new BallView(ball, spriteSheet);
    this.stage.root.addChild(ballView.container.display);
    this.ballsViews.push(ballView);
    return ballView;
  },


  update : function()
  {
    this.rotationSpeed += this.rotationAcceleration;
    if(this.rotationSpeed < 0) {
      this.rotationSpeed = 0;
    }
    else if(this.rotationSpeed > this.maxRotationSpeed) {
      this.rotationSpeed = this.maxRotationSpeed;
    }
    this.rotationAngle += this.rotationSpeed;
    this.rotation.identity();
    this.rotation.rotate(0, 1, 0, this.rotationAngle);

    this.translationSpeed += 0.05 * this.rotationAcceleration;
    this.translationValue += this.translationSpeed;
    if(this.translationValue < this.minTranslation) {
      this.translationValue = this.minTranslation;
    }
    else if(this.translationValue > this.maxTranslation) {
      this.translationValue = this.maxTranslation;
    }
  
    this.preRenderer.identity();
    this.preRenderer.scale(this.scale, this.scale, this.scale);
    this.preRenderer.translate(0, 0, this.translationValue);

    this.transform.identity();
    this.transform.appendTransform(this.rotation);
    this.transform.appendTransform(this.preRenderer);
    this.transform.appendTransform(this.renderer);

    this.ballsViews.forEach(function(ballView) {
      this.transform.transformVector(ballView.ball.position, ballView.proj);
      ballView.proj.reciprocalDivide();
    }, this);

    var sortedBalls = this.ballsViews.sort(function(ballA, ballB) {
      return ballB.proj.z - ballA.proj.z;
    });

    sortedBalls.forEach(function(ballView) {
      ballView.update(this.rotationAngle);
      this.stage.root.addChild(ballView.container.display);
    }, this);


    this.stage._update();

  },


  resize : function(width, height)
  {
    this.width = width;
    this.height = height;
    this.stage.resize(this.width, this.height);
    this.initRenderer();
  },


  initRenderer : function()
  {
    this.renderer.identity();
    this.renderer.appendTransform(Matrix4.projection(70, this.width / this.height, 1, 1000));
    this.renderer.appendTransform(Matrix4.getToScreen(this.width, this.height, 0, 0));
  }
};

module.exports = View;

},{"../grgrdvrt/Loop":1,"../grgrdvrt/Matrix4":2,"../grgrdvrt/displayList/DisplayList":7,"./BallView":17,"./spritesData":22}],21:[function(require,module,exports){
var ImageLoader = require("../grgrdvrt/services/ImageLoader");
var GroupLoader = require("../grgrdvrt/services/GroupLoader");

var Loop = require("../grgrdvrt/Loop");
var Mouse = require("../grgrdvrt/Mouse");
var DLA = require("./DLA");
var View = require("./View");
var Frost = require("./Frost");


function Main()
{
  this.isStarted = false;
  var imagesIds = ["snowball", "nose", "scarf", "eyes", "buttons", "arms"];
  this.quantityId = 0;
  this.quantities = [1, 3, 6, 10, 20];

  this.width = undefined;
  this.height = undefined;

  this.canvas = document.querySelector(".mainCanvas");
  this.ctx = this.canvas.getContext("2d");

  var groupLoader = new GroupLoader();
  imagesIds.forEach(function(id) {
    var loader = new ImageLoader("img/" + id + ".png");
    groupLoader.loaders[id] = loader;
  }, this);
  groupLoader.load(this, this.start);

  this.mouse = new Mouse(this.canvas);
  this.frost = new Frost(this.mouse);

  this.checkSize();
  new Loop(this.update, this);

}


Main.prototype = {


  start : function(spritesSrc)
  {
    this.balls = [];
    this.dla = new DLA(this.balls);
    this.view = new View(spritesSrc);

    this.view.addBall(this.balls[0], 0);

    this.mouse.onUp.add(this.addSomeBalls, this);
    this.resize(this.width, this.height);
  },


  addSomeBalls : function()
  {
    this.isStarted = true;
    var quantity = this.quantities[this.quantityId];
    for(var i = 0; i < quantity; i++) {
      setTimeout(this.addBall.bind(this), 100 * i);
    }
    this.quantityId++;
    if(this.quantityId === this.quantities.length) {
      this.mouse.onUp.remove(this.addSomeBalls, this);
      this.mouse.onUp.add(this.toggleFrenzy, this);
    }
  },


  toggleFrenzy : function()
  {
    if(this.frenzyTimeout !== undefined) {
      this.view.rotationAcceleration = -0.0001;
      clearTimeout(this.frenzyTimeout);
      this.frenzyTimeout = undefined;
    }
    else {
      this.view.rotationAcceleration = 0.0001;
      this.frenzy();
    }
  },


  frenzy : function()
  {
    this.addBall();
    this.frenzyTimeout = setTimeout(this.frenzy.bind(this), 50);
  },


  addBall : function()
  {
    var ball = this.dla.addBall();
    var ballView = this.view.addBall(ball);
    ballView.play();
  },


  ballAddedHandler : function()
  {
    this.addBall();
  },


  update : function()
  {
    this.checkSize();
    if(this.view !== undefined) {
      this.view.update();
    }
    if(!this.isStarted) {
      this.frost.update();
    }

    this.ctx.fillStyle = "lightblue";
    this.ctx.fillRect(0, 0, this.width, this.height);
    if(this.view !== undefined) {
      this.drawCanvas(this.view.canvas);
    }
    this.drawCanvas(this.frost.canvas);
  },


  drawCanvas : function(canvas)
  {
    this.ctx.drawImage(canvas, 0, 0, this.width, this.height);
  },


  checkSize : function()
  {
    var width = window.innerWidth;
    var height = window.innerHeight;
    if(width !== this.width || height !== this.height) {
      this.resize(width, height);
    }
  },


  resize : function(width, height)
  {
    this.width = width;
    this.height = height;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if(this.view !== undefined) {
      this.view.resize(this.width, this.height);
    }
    this.frost.resize(this.width, this.height);
  }

};


new Main();

},{"../grgrdvrt/Loop":1,"../grgrdvrt/Mouse":3,"../grgrdvrt/services/GroupLoader":14,"../grgrdvrt/services/ImageLoader":15,"./DLA":18,"./Frost":19,"./View":20}],22:[function(require,module,exports){
module.exports = {
"snowball":{"anim":[2,2,203,204,0,0,0],"animSize":{"w":203,"h":204}},
"scarf":{"anim":[2,2,219,204,0,6,0,223,2,221,204,0,3,0,446,2,220,204,0,4,0,668,2,213,204,0,5,0,883,2,213,204,0,4,0,1098,2,208,204,0,5,0,1308,2,209,204,0,4,0,1519,2,211,204,0,3,0,1732,2,211,204,0,3,0,1945,2,210,204,0,4,0,2157,2,211,204,0,3,0,2370,2,209,204,0,5,0,2581,2,210,204,0,3,0,2793,2,212,204,0,2,0,2,208,209,204,0,4,0,213,208,209,204,0,3,0,424,208,208,204,0,4,0,634,208,211,204,0,3,0,847,208,210,204,0,4,0,1059,208,209,204,0,3,0,1270,208,211,204,0,2,0,1483,208,209,204,0,3,0,1694,208,212,204,0,2,0,1908,208,211,204,0,3,0,2121,208,209,204,0,3,0,2332,208,209,204,0,3,0,2543,208,208,204,0,5,0,3007,2,207,204,0,5,0,2753,208,207,204,0,5,0,1922,414,210,205,0,4,0,2134,414,212,206,0,0,0,2962,208,214,204,0,0,0,2348,414,211,207,0,2,0,2,414,212,204,0,0,0,216,414,210,204,0,2,0,428,414,209,204,0,3,0,2561,414,209,207,0,3,0,2,620,213,209,0,2,0,217,620,210,209,0,2,0,429,620,209,209,0,3,0,639,414,210,204,0,2,0,2125,622,210,215,0,2,0,1276,620,210,214,0,3,0,1488,620,211,214,0,3,0,2760,623,209,219,0,4,0,2337,623,210,215,0,3,0,2971,623,209,219,0,3,0,1701,620,210,214,0,4,0,1913,621,210,214,0,3,0,2549,623,209,215,0,4,0,851,414,210,204,0,4,0,640,620,208,209,0,5,0,850,620,209,209,0,5,0,1061,620,213,209,0,1,0,2772,414,208,207,0,5,0,1063,414,207,204,0,6,0,1272,414,216,204,0,4,0,1490,414,214,204,0,8,0,2982,414,212,207,0,7,0,1706,414,214,204,0,8,0],"animSize":{"w":225,"h":219}},
"nose":{"anim":[273,2,266,204,0,65,0,273,208,266,204,0,65,0,541,414,263,204,0,65,0,1071,414,258,204,0,65,0,1332,2,252,204,0,65,0,1586,208,245,204,0,65,0,1835,414,237,204,0,65,0,2320,2,224,204,0,65,0,2756,414,212,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2757,208,204,204,0,65,0,2539,414,215,204,0,54,0,2080,208,228,204,0,41,0,1836,2,240,204,0,29,0,1585,414,248,204,0,21,0,1072,208,255,204,0,14,0,809,2,261,204,0,8,0,273,414,266,204,0,3,0,2,2,269,204,0,0,0,2,208,269,204,0,0,0,2,414,269,204,0,0,0,541,2,266,204,0,3,0,809,208,261,204,0,8,0,1329,208,255,204,0,14,0,1586,2,248,204,0,21,0,2078,2,240,204,0,29,0,2310,208,228,204,0,41,0,2540,208,215,204,0,54,0,2760,2,204,204,0,65,0,2963,208,204,204,0,65,0,2970,414,204,204,0,65,0,2966,2,204,204,0,65,0,3169,208,204,204,0,65,0,3176,414,204,204,0,65,0,3172,2,204,204,0,65,0,3375,208,204,204,0,65,0,3382,414,204,204,0,65,0,3378,2,204,204,0,65,0,3581,208,204,204,0,65,0,3588,414,204,204,0,65,0,3584,2,204,204,0,65,0,2546,2,212,204,0,65,0,2313,414,224,204,0,65,0,2074,414,237,204,0,65,0,1833,208,245,204,0,65,0,1331,414,252,204,0,65,0,1072,2,258,204,0,65,0,806,414,263,204,0,65,0,541,208,266,204,0,65,0],"animSize":{"w":331,"h":204}},
"eyes":{"anim":[2,2,203,204,0,0,0,2,208,203,204,0,0,0,2,414,203,204,0,0,0,2,620,203,204,0,0,0,2,826,203,204,0,0,0,2,1032,203,204,0,0,0,207,2,203,204,0,0,0,207,208,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,414,203,204,0,0,0,207,620,203,204,0,0,0,207,826,203,204,0,0,0,207,1032,203,204,0,0,0,207,414,203,204,0,0,0,412,2,203,204,0,0,0,617,2,203,204,0,0,0,822,2,203,204,0,0,0,1027,2,203,204,0,0,0,1232,2,203,204,0,0,0,1437,2,203,204,0,0,0,412,208,203,204,0,0,0,412,414,203,204,0,0,0,412,620,203,204,0,0,0,412,826,203,204,0,0,0,412,1032,203,204,0,0,0,617,208,203,204,0,0,0,822,208,203,204,0,0,0,1027,208,203,204,0,0,0,1232,208,203,204,0,0,0,1437,208,203,204,0,0,0,617,414,203,204,0,0,0,617,620,203,204,0,0,0,617,826,203,204,0,0,0,617,1032,203,204,0,0,0,822,414,203,204,0,0,0,1027,414,203,204,0,0,0,1232,414,203,204,0,0,0,1437,414,203,204,0,0,0,822,620,203,204,0,0,0,822,826,203,204,0,0,0,822,1032,203,204,0,0,0,1027,620,203,204,0,0,0,1232,620,203,204,0,0,0,1437,620,203,204,0,0,0,1027,826,203,204,0,0,0,1027,1032,203,204,0,0,0,1232,826,203,204,0,0,0,1232,1032,203,204,0,0,0,1437,826,203,204,0,0,0],"animSize":{"w":203,"h":204}},
"buttons":{"anim":[2,208,204,204,0,3,0,208,208,204,204,0,3,0,414,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,620,208,204,204,0,3,0,826,208,204,204,0,3,0,420,2,206,204,0,1,0,2,2,207,204,0,0,0,211,2,207,204,0,0,0,628,2,206,204,0,1,0,2,414,204,204,0,3,0,208,414,204,204,0,3,0,414,414,204,204,0,3,0,620,414,204,204,0,3,0,826,414,204,204,0,3,0,2,620,204,204,0,3,0,2,826,204,204,0,3,0,2,1032,204,204,0,3,0,2,1238,204,204,0,3,0,2,1444,204,204,0,3,0,208,620,204,204,0,3,0,414,620,204,204,0,3,0,620,620,204,204,0,3,0,826,620,204,204,0,3,0,208,826,204,204,0,3,0,208,1032,204,204,0,3,0,208,1238,204,204,0,3,0,208,1444,204,204,0,3,0,414,826,204,204,0,3,0,620,826,204,204,0,3,0,826,826,204,204,0,3,0,414,1032,204,204,0,3,0,414,1238,204,204,0,3,0,414,1444,204,204,0,3,0,620,1032,204,204,0,3,0,826,1032,204,204,0,3,0,620,1238,204,204,0,3,0,620,1444,204,204,0,3,0],"animSize":{"w":207,"h":204}},
"arms":{"anim":[417,826,412,204,0,0,0,420,2,407,204,0,2,0,829,2,399,204,0,4,0,829,414,391,204,0,10,0,1612,620,378,204,0,14,0,1613,414,357,204,0,25,0,1972,414,335,204,0,34,0,2309,414,311,204,0,43,0,2293,826,291,204,0,53,0,2622,414,262,204,0,69,0,2624,208,228,204,0,85,0,3066,2,207,204,0,103,0,3116,414,204,204,0,106,0,3293,208,204,204,0,106,0,3484,2,204,204,0,106,0,3130,620,204,204,0,106,0,3322,414,204,204,0,106,0,3499,208,204,204,0,106,0,3084,208,207,204,0,103,0,2626,2,228,204,0,86,0,2873,826,258,204,0,73,0,1994,826,297,204,0,54,0,2294,208,328,204,0,35,0,1950,2,347,204,0,32,0,1230,2,365,204,0,21,0,1229,620,381,204,0,12,0,827,620,400,204,0,2,0,418,620,407,204,0,5,0,2,2,416,204,0,1,0,2,414,414,204,0,0,0,2,826,413,204,0,2,0,419,208,408,204,0,4,0,829,208,399,204,0,10,0,1222,414,389,204,0,14,0,1616,826,376,204,0,25,0,1593,208,358,204,0,34,0,1953,208,339,204,0,43,0,1992,620,316,204,0,53,0,2586,826,285,204,0,69,0,2869,620,259,204,0,85,0,2854,208,228,204,0,103,0,3275,2,207,204,0,106,0,3133,826,204,204,0,106,0,3336,620,204,204,0,106,0,3528,414,204,204,0,106,0,3339,826,204,204,0,106,0,3542,620,204,204,0,106,0,3545,826,204,204,0,106,0,2856,2,208,204,0,106,0,2886,414,228,204,0,103,0,2602,620,265,204,0,86,0,2310,620,290,204,0,73,0,2299,2,325,204,0,54,0,1597,2,351,204,0,35,0,1230,208,361,204,0,32,0,1233,826,381,204,0,21,0,831,826,400,204,0,12,0,2,208,415,204,0,2,0,418,414,409,204,0,5,0,2,620,414,204,0,1,0],"animSize":{"w":417,"h":204}}
};

},{}]},{},[21])