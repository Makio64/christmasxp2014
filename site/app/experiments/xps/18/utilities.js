var MIN_ELEVATION = 1;
var MAX_ELEVATION = Math.PI / 2.0;

var ProgramWrapper = function (gl, vertexShader, fragmentShader, attributeLocations) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    for (var attributeName in attributeLocations) {
        gl.bindAttribLocation(program, attributeLocations[attributeName], attributeName);
    }
    gl.linkProgram(program);
    var uniformLocations = {};
    var numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < numberOfUniforms; i += 1) {
        var activeUniform = gl.getActiveUniform(program, i),
            uniformLocation = gl.getUniformLocation(program, activeUniform.name);
        uniformLocations[activeUniform.name] = uniformLocation;
    }

    this.getUniformLocation = function (name) {
        return uniformLocations[name];
    };

    this.getProgram = function () {
        return program;
    }
};

var buildShader = function (gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    console.log(gl.getShaderInfoLog(shader));
    return shader;
};

var buildTexture = function (gl, unit, format, type, width, height, data, wrapS, wrapT, minFilter, magFilter) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, type, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    return texture;
};

var buildTextureFromImage = function (gl, unit, format, type, image, wrapS, wrapT, minFilter, magFilter) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, type, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);

    return texture;
};

var buildFramebuffer = function (gl, attachment) {
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, attachment, 0);
    return framebuffer;
};

var buildBuffer = function (gl, target, data, usage) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, usage);
    return buffer;
};


var makeIdentityMatrix = function (matrix) {
    matrix[0] = 1.0;
    matrix[1] = 0.0;
    matrix[2] = 0.0;
    matrix[3] = 0.0;
    matrix[4] = 0.0;
    matrix[5] = 1.0;
    matrix[6] = 0.0;
    matrix[7] = 0.0;
    matrix[8] = 0.0;
    matrix[9] = 0.0;
    matrix[10] = 1.0;
    matrix[11] = 0.0;
    matrix[12] = 0.0;
    matrix[13] = 0.0;
    matrix[14] = 0.0;
    matrix[15] = 1.0;
    return matrix;
};

var premultiplyMatrix = function (out, matrixA, matrixB) { //out = matrixB * matrixA
    var b0 = matrixB[0], b4 = matrixB[4], b8 = matrixB[8], b12 = matrixB[12],
        b1 = matrixB[1], b5 = matrixB[5], b9 = matrixB[9], b13 = matrixB[13],
        b2 = matrixB[2], b6 = matrixB[6], b10 = matrixB[10], b14 = matrixB[14],
        b3 = matrixB[3], b7 = matrixB[7], b11 = matrixB[11], b15 = matrixB[15],

        aX = matrixA[0], aY = matrixA[1], aZ = matrixA[2], aW = matrixA[3];
    out[0] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
    out[1] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
    out[2] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
    out[3] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

    aX = matrixA[4], aY = matrixA[5], aZ = matrixA[6], aW = matrixA[7];
    out[4] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
    out[5] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
    out[6] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
    out[7] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

    aX = matrixA[8], aY = matrixA[9], aZ = matrixA[10], aW = matrixA[11];
    out[8] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
    out[9] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
    out[10] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
    out[11] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

    aX = matrixA[12], aY = matrixA[13], aZ = matrixA[14], aW = matrixA[15];
    out[12] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
    out[13] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
    out[14] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
    out[15] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

    return out;
};

var makeXRotationMatrix = function (matrix, angle) {
    matrix[0] = 1.0;
    matrix[1] = 0.0;
    matrix[2] = 0.0;
    matrix[3] = 0.0;
    matrix[4] = 0.0;
    matrix[5] = Math.cos(angle);
    matrix[6] = Math.sin(angle);
    matrix[7] = 0.0;
    matrix[8] = 0.0;
    matrix[9] = -Math.sin(angle);
    matrix[10] = Math.cos(angle);
    matrix[11] = 0.0;
    matrix[12] = 0.0;
    matrix[13] = 0.0;
    matrix[14] = 0.0;
    matrix[15] = 1.0;
    return matrix;
};

var makeYRotationMatrix = function (matrix, angle) {
    matrix[0] = Math.cos(angle);
    matrix[1] = 0.0
    matrix[2] = -Math.sin(angle);
    matrix[3] = 0.0
    matrix[4] = 0.0
    matrix[5] = 1.0
    matrix[6] = 0.0;
    matrix[7] = 0.0;
    matrix[8] = Math.sin(angle);
    matrix[9] = 0.0
    matrix[10] = Math.cos(angle);
    matrix[11] = 0.0;
    matrix[12] = 0.0;
    matrix[13] = 0.0;
    matrix[14] = 0.0;
    matrix[15] = 1.0;
    return matrix;
};

var makePerspectiveMatrix = function (matrix, fov, aspect, near, far) {
    var f = Math.tan(0.5 * (Math.PI - fov)),
        range = near - far;

    matrix[0] = f / aspect;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = 0;
    matrix[5] = f;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = 0;
    matrix[9] = 0;
    matrix[10] = far / range;
    matrix[11] = -1;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = (near * far) / range;
    matrix[15] = 0.0;

    return matrix;
};

var getMousePosition = function (event, element) {
    var boundingRect = element.getBoundingClientRect();
    return {
        x: event.clientX - boundingRect.left,
        y: event.clientY - boundingRect.top
    };
};


var Camera = function (element, distance, orbitPoint) {
    var azimuth = 0.0,
        elevation = 1;

    var lastMouseX = 0,
        lastMouseY = 0;

    var mouseDown = false;

    var viewMatrix = new Float32Array(16);

    this.getViewMatrix = function () {
        return viewMatrix;
    };

    this.getViewMatrixWithoutAzimuth = function () {
        var viewMatrix = new Float32Array(16);

        var xRotationMatrix = new Float32Array(16),
            yRotationMatrix = new Float32Array(16),
            distanceTranslationMatrix = makeIdentityMatrix(new Float32Array(16)),
            orbitTranslationMatrix = makeIdentityMatrix(new Float32Array(16));

        makeIdentityMatrix(viewMatrix);

        makeXRotationMatrix(xRotationMatrix, elevation);
        makeYRotationMatrix(yRotationMatrix, 0);
        distanceTranslationMatrix[14] = -distance;
        orbitTranslationMatrix[12] = -orbitPoint[0];
        orbitTranslationMatrix[13] = -orbitPoint[1];
        orbitTranslationMatrix[14] = -orbitPoint[2];

        premultiplyMatrix(viewMatrix, viewMatrix, orbitTranslationMatrix);
        premultiplyMatrix(viewMatrix, viewMatrix, yRotationMatrix);
        premultiplyMatrix(viewMatrix, viewMatrix, xRotationMatrix);
        premultiplyMatrix(viewMatrix, viewMatrix, distanceTranslationMatrix);

        return viewMatrix;
    };

    this.getPosition = function () {
        var cameraPosition = new Float32Array(3);
        cameraPosition[0] = distance * Math.sin(Math.PI / 2 - elevation) * Math.sin(-azimuth) + orbitPoint[0];
        cameraPosition[1] = distance * Math.cos(Math.PI / 2 - elevation) + orbitPoint[1];
        cameraPosition[2] = distance * Math.sin(Math.PI / 2 - elevation) * Math.cos(-azimuth) + orbitPoint[2];

        return cameraPosition;
    };

    this.getViewDirection = function () {
        var viewDirection = new Float32Array(3);
        viewDirection[0] = -Math.sin(Math.PI / 2 - elevation) * Math.sin(-azimuth);
        viewDirection[1] = -Math.cos(Math.PI / 2 - elevation);
        viewDirection[2] = -Math.sin(Math.PI / 2 - elevation) * Math.cos(-azimuth);

        return viewDirection;
    };

    var onDown = function (x, y) {
        mouseDown = true;
        lastMouseX = x;
        lastMouseY = y;
    };

    var onMove = function (x, y) {
        if (mouseDown) {
            var deltaAzimuth = (x - lastMouseX) * 0.005;
            var deltaElevation = (y - lastMouseY) * 0.005;

            azimuth += deltaAzimuth;
            elevation += deltaElevation;

            if (elevation < MIN_ELEVATION) {
                elevation = MIN_ELEVATION;
            } else if (elevation > MAX_ELEVATION) {
                elevation = MAX_ELEVATION;
            }

            recomputeViewMatrix();

            lastMouseX = x;
            lastMouseY = y;

            element.style.cursor = '-webkit-grabbing';
            element.style.cursor = '-moz-grabbing';
            element.style.cursor = 'grabbing';
        } else {
            element.style.cursor = '-webkit-grab';
            element.style.cursor = '-moz-grab';
            element.style.cursor = 'grab';
        }
    }

    var onUp = function () {
        mouseDown = false;
    };

    element.addEventListener('mousedown', function (event) {
        event.preventDefault();
        onDown(getMousePosition(event, element).x, getMousePosition(event, element).y);
    });

    document.addEventListener('mouseup', function (event) {
        event.preventDefault();
        onUp();
    });

    element.addEventListener('mousemove', function (event) {
        event.preventDefault();
        onMove(getMousePosition(event, element).x, getMousePosition(event, element).y);
    });

    element.addEventListener('touchstart', function (event) {
        event.preventDefault();
        var touchObject = event.changedTouches[0];
        onDown(touchObject.clientX, touchObject.clientY);
    }, false);

    element.addEventListener('touchmove', function (event) {
        event.preventDefault();
        var touchObject = event.changedTouches[0];
        onMove(touchObject.clientX, touchObject.clientY);
    }, false);

    document.addEventListener('touchend', function (event) {
        event.preventDefault();
        onUp();
    }, false);

    var recomputeViewMatrix = function () {
        var xRotationMatrix = new Float32Array(16),
            yRotationMatrix = new Float32Array(16),
            distanceTranslationMatrix = makeIdentityMatrix(new Float32Array(16)),
            orbitTranslationMatrix = makeIdentityMatrix(new Float32Array(16));

        makeIdentityMatrix(viewMatrix);

        makeXRotationMatrix(xRotationMatrix, elevation);
        makeYRotationMatrix(yRotationMatrix, azimuth);
        distanceTranslationMatrix[14] = -distance;
        orbitTranslationMatrix[12] = -orbitPoint[0];
        orbitTranslationMatrix[13] = -orbitPoint[1];
        orbitTranslationMatrix[14] = -orbitPoint[2];

        premultiplyMatrix(viewMatrix, viewMatrix, orbitTranslationMatrix);
        premultiplyMatrix(viewMatrix, viewMatrix, yRotationMatrix);
        premultiplyMatrix(viewMatrix, viewMatrix, xRotationMatrix);
        premultiplyMatrix(viewMatrix, viewMatrix, distanceTranslationMatrix);
    };

    recomputeViewMatrix();
};