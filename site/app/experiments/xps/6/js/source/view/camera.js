/**
 * Created by hector.arellano on 10/2/14.
 */

define(['glMatrix']);

var Camera = function() {
    var _this = this;
    this.position = vec3.create();
    this.target = vec3.create();

    this.down = false;

    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.currentMouseX = 0;
    this.currentMouseY = 0;
    this.ratio = 3.5;

    this.alpha = 0.9 * Math.PI * 0.5;
    this.beta = 1. * Math.PI;
    this._alpha = this.alpha;
    this._beta = this.beta;

    this.init = true;

    this.perspectiveMatrix = mat4.create();
    this.cameraTransformMatrix = mat4.create();

    function onMouseMove(e) {
        _this.currentMouseX = e.clientX;
        _this.currentMouseY = e.clientY;
    }

    function onMouseDown(e) {
        _this.down = true;
    }

    function onMouseUp(e) {
        _this.down = false;
    }

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);
}


//This function updates the camera
Camera.prototype.updateCamera = function(perspective) {
    mat4.perspective(perspective, 1, 0.001, 6.0, this.perspectiveMatrix);
    if (this.down || this.init) {
        this.alpha -= 0.1 * (this.currentMouseY - this.prevMouseY) * Math.PI / 180;
        this.beta += 0.1 * (this.currentMouseX - this.prevMouseX) * Math.PI / 180;
        if (this.alpha <= 0) this.alpha = 0.001;
        if (this.alpha >= 1.05 *  Math.PI / 2) this.alpha = 1.05 * Math.PI / 2;
    }
    if (this._alpha != this.alpha || this._beta != this.beta || this.init) {
        this._alpha += (this.alpha - this._alpha) / 7;
        this._beta += (this.beta - this._beta) / 7;
        this.target = [ 0.5, 0.5, 0.5 ];
        this.position[0] = this.ratio * Math.sin(this._alpha) * Math.sin(this._beta) + this.target[0];
        this.position[1] = this.ratio * Math.cos(this._alpha) + this.target[1];
        this.position[2] = this.ratio * Math.sin(this._alpha) * Math.cos(this._beta) + this.target[2];
        this.cameraTransformMatrix = this.defineTransformMatrix(this.position, this.target);
        this.init = false;
    }
    this.prevMouseX = this.currentMouseX;
    this.prevMouseY = this.currentMouseY;
}

//This function makes matrix transformations
Camera.prototype.defineTransformMatrix = function(objectVector, targetVector) {
    var matrix = mat4.create();
    var eyeVector = vec3.create();
    var normalVector = vec3.create();
    var upVector = vec3.create();
    var rightVector = vec3.create();
    var yVector = vec3.create();
    yVector[0] = 0;
    yVector[1] = 1;
    yVector[2] = 0;
    vec3.subtract(objectVector, targetVector, eyeVector);
    vec3.normalize(eyeVector, normalVector);
    var reference = vec3.dot(normalVector, yVector);
    var reference2 = vec3.create;
    vec3.scale(normalVector, reference, reference2);
    vec3.subtract(yVector, reference2, upVector);
    vec3.normalize(upVector, upVector);
    vec3.cross(normalVector, upVector, rightVector);
    matrix[0] = rightVector[0];
    matrix[1] = upVector[0];
    matrix[2] = normalVector[0];
    matrix[3] = 0;
    matrix[4] = rightVector[1];
    matrix[5] = upVector[1];
    matrix[6] = normalVector[1];
    matrix[7] = 0;
    matrix[8] = rightVector[2];
    matrix[9] = upVector[2];
    matrix[10] = normalVector[2];
    matrix[11] = 0;
    matrix[12] = -vec3.dot(objectVector, rightVector);
    matrix[13] = -vec3.dot(objectVector, upVector);
    matrix[14] = -vec3.dot(objectVector, normalVector);
    matrix[15] = 1;
    return matrix;
}