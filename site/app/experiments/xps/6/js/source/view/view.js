/**
 * Created by hector.arellano on 10/2/14.
 */

define(['camera', 'stats']);

//Constructor
var World3D = function(model, controller) {
    this.model = model;
    this.controller = controller;

    this.resize(this.model.evalMode);

    this.currentFrame = 0;
    this.explosionFrame = 0;
    this.geometryDirty = true;
    this.radius = 0;

    /*
    GENERATE ALL THE NEEDED TEXTURES
     */

    //Textures needed for the SPH
    this.tPosition = this.webGL_createTexture(2048., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);
    this.tVelDen = this.webGL_createTexture(2048., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);
    this.tCells1 = this.webGL_createTexture(2048., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);
    this.tCells2 = this.webGL_createTexture(2048., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);
    this.tCells3 = this.webGL_createTexture(2048., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);

    //Textures for the Marching Cubes
    this.tRead = this.webGL_createTexture(1., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.gl.UNSIGNED_BYTE, true);
    this.tCorners = this.webGL_createTexture(2048., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);
    this.tIndexes = this.webGL_createTexture(64., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);
    this.tInitPos = this.webGL_createTexture(2048., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);
    this.tLowRes = this.webGL_createTexture(256., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);

    this.tTriangles = this.webGL_createTexture(2048., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);
    this.tNormals = this.webGL_createTexture(2048., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);

    //This texture is used for sampling porpouses
    this.tScreen = this.webGL_createTexture(854., this.model.gl.RGBA, this.model.gl.LINEAR, this.model.gl.LINEAR, this.model.gl.UNSIGNED_BYTE, true);

    //This texture is used for sampling porpouses
    this.tRender = this.webGL_createTexture(854., this.model.gl.RGBA, this.model.gl.LINEAR, this.model.gl.LINEAR, this.model.gl.UNSIGNED_BYTE, true);

    //Initial random positions
    this.tInitRandomPos = this.webGL_createTexture(2048., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);

    //texture for the star
    this.tStar = this.webGL_createTexture(2048, this.model.gl.RGBA, this.model.gl.LINEAR, this.model.gl.LINEAR, this.model.gl.UNSIGNED_BYTE, true);

    //Texture for the explosion
    this.tExplosion = this.webGL_createTexture(854, this.model.gl.RGBA, this.model.gl.LINEAR, this.model.gl.LINEAR, this.model.gl.UNSIGNED_BYTE, true);

    //texture for the clouds
    this.tClouds = this.webGL_createTexture(854, this.model.gl.RGBA, this.model.gl.LINEAR, this.model.gl.LINEAR, this.model.gl.UNSIGNED_BYTE, true);

    //Framebuffers for the textures
    this.fbPosition = this.webGL_createFramebuffer(this.tPosition);
    this.fbVelocity = this.webGL_createFramebuffer(this.tVelDen);
    this.fbCells1 = this.webGL_createFramebuffer(this.tCells1);
    this.fbCells2 = this.webGL_createFramebuffer(this.tCells2);
    this.fbCells3 = this.webGL_createFramebuffer(this.tCells3);
    this.fbRead = this.webGL_createFramebuffer(this.tRead);
    this.fbIndexes = this.webGL_createFramebuffer(this.tIndexes);
    this.fbCorners = this.webGL_createFramebuffer(this.tCorners);
    this.fbInitPos = this.webGL_createFramebuffer(this.tInitPos);
    this.fbInitRandomPos = this.webGL_createFramebuffer(this.tInitRandomPos);

    this.fbTriangles = this.webGL_createFramebuffer(this.tTriangles);
    this.fbNormals = this.webGL_createFramebuffer(this.tNormals);

    this.fbStar = this.webGL_createFramebuffer(this.tStar);
    this.fbExplosion = this.webGL_createFramebuffer(this.tExplosion);
    this.fbLowRes = this.webGL_createFramebuffer(this.tLowRes);
    this.fbScreen = this.webGL_createFramebuffer(this.tScreen);

    this.fbRender = this.webGL_createFramebuffer(this.tRender);
    this.fbClouds = this.webGL_createFramebuffer(this.tClouds);

    //Textures and buffers for the histopyramid
    var i;
    this.tLevels = [];
    this.fbPyramid = [];
    this.tPyramid = this.webGL_createTexture(2048., this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true);
    for (i = 0; i < 11; i++) {
        this.tLevels.push(this.webGL_createTexture(Math.pow(2, i), this.model.gl.RGBA, this.model.gl.NEAREST, this.model.gl.NEAREST, this.model.ext, true));
        this.fbPyramid.push(this.webGL_createFramebuffer(this.tLevels[i]));
    }

    //Create the texture for the image loaded
    this.initialTexture = this.model.gl.createTexture();
    this.model.gl.bindTexture (this.model.gl.TEXTURE_2D, this.initialTexture);
    this.model.gl.texImage2D (this.model.gl.TEXTURE_2D, 0, this.model.gl.RGBA, this.model.gl.RGBA, this.model.gl.UNSIGNED_BYTE, this.model.positions);
    this.model.gl.texParameteri (this.model.gl.TEXTURE_2D, this.model.gl.TEXTURE_MAG_FILTER, this.model.gl.LINEAR);
    this.model.gl.texParameteri (this.model.gl.TEXTURE_2D, this.model.gl.TEXTURE_MIN_FILTER, this.model.gl.LINEAR_MIPMAP_NEAREST);
    this.model.gl.generateMipmap (this.model.gl.TEXTURE_2D);
    this.model.gl.bindTexture (this.model.gl.TEXTURE_2D, null);
    this.initialTexture.size = 2048;

    /*
    GENERATE ALL THE NEEDED BUFFERS
     */

    //Max vertices to generate
    this.max = 2 * 1024 * 1024;

    //Index buffer
    var arrayData = [];
    for (i = 0; i < this.max; i++) arrayData.push(i);
    this.bufferIndex = this.webGL_createArrayBuffer(arrayData);
    arrayData.length = 0;

    //Velocity Buffer
    for (i = 0; i < this.max; i++) arrayData.push(0, 0, 0, 0);
    this.bufferVelocity = this.webGL_createArrayBuffer(arrayData);
    arrayData.length = 0;

    //Noise position Buffer
    for (i = 0; i < this.max; i++) arrayData.push(Math.random() / 128, Math.random() / 128, Math.random() / 128, 0);
    this.bufferNoise = this.webGL_createArrayBuffer(arrayData);
    arrayData.length = 0;

    //2D Index Buffer
    var div = 0.00048828125;
    for(i = 0; i < this.max; i ++) arrayData.push(div * ((i % 2048.) + 0.5), div * (Math.floor(i * div) + 0.5));
    this.bufferIndex2D = this.webGL_createArrayBuffer(arrayData);
    arrayData.length = 0;

    //2D Index Buffer repeated each three values to read the triangles
    var j = 0;
    for(i = 0; i < this.max; i ++) {
        if(i % 3 == 0 && i!= 0.) j++;
        arrayData.push(div * ((j % 2048.) + 0.5), div * (Math.floor(j * div) + 0.5));
    }
    this.buffer2DRepet = this.webGL_createArrayBuffer(arrayData);
    arrayData.length = 0;

    //These buffers are used to create the texture for the indexes of the triangles
    div = 1 / 64.;
    for(i = 0; i < 4096; i++) arrayData.push(2. * div * ((i % 64) + 0.5) - 1, 2. * div * (Math.floor(i * div) + 0.5) - 1);
    this.buffer64 = this.webGL_createArrayBuffer(arrayData);
    arrayData.length = 0.;

    this.bufferTriangleIndex = this.webGL_createArrayBuffer(this.model.ti4);

    /*
    INITIATE THE TEXTURES THAT WONT CHANGE
    */

    //Generate the triangle index texture
    this.controller.setTriangleIndexProgram(this.bufferTriangleIndex, this.buffer64);
    this.webGL_drawVertices(this.fbIndexes.buffer, this.model.ti4.length, true, false);

    //Generate the star...
    this.controller.setStarProgram(this.bufferIndex, 1);
    this.model.gl.bindFramebuffer(this.model.gl.FRAMEBUFFER, this.fbStar.buffer);
    for(var i = 0; i < 16; i ++) {
        var scale = i / 8;
        if(i > 8) scale = (16 - i) / 8;
        this.model.programs[26].scale = 0.1;
        this.model.gl.uniform1f(this.model.programs[26].scaler, scale);

        if(i < 8) {
            this.model.gl.viewport(1024 - 128 * (i + 1) , 128 * (4), 128, 128);
        } else {
            this.model.gl.viewport(3072 - 128 * (i + 1), 128 * (3), 128, 128);
        }


        this.model.gl.drawArrays(this.model.gl.TRIANGLE_STRIP, 0, 4);
    }


    //Calculate the number of vertices needed.
    this.createPyramid(this.tStar, this.fbInitPos.buffer);
    this.totalParticles = this.activeCells;

    //Generate the random initial positions
    this.controller.setInitNoiseProgram(this.bufferIndex2D, this.bufferNoise, this.tInitPos, true);
    this.webGL_drawVertices(this.fbInitRandomPos.buffer, this.totalParticles, true, false);





    /*
    INITIATE THE CAMERA
     */

    this.camera = new Camera();

    /*
    RESET THE INITAL TEXTURES
     */

    this.reset();

    /*
    Stats to check the frame rate
     */

    this.stats = new Stats();
    this.stats.setMode(1);
    //document.body.appendChild(this.stats.domElement);

    var _this = this;
    this.controller.updateGeometry.add(function() {_this.geometryDirty = true});


    this.textureEnviroment = this.getEnviromentTexture();
}

//Function used to render the scene
World3D.prototype.reset = function() {

    //Initiate the velocity texture
    this.initData(this.fbVelocity.buffer, this.bufferVelocity, this.totalParticles);

    //reset the position texture
    this.webGL_drawTextureTo(this.tInitRandomPos, this.fbPosition.buffer);
    this.geometryDirty = true;
    this.currentFrame = 0;
    this.explosionFrame = 0;
    this.radius = 0;
}

//Function that executes the rendering process
World3D.prototype.render = function() {

    /*
     * This is the simulation process, here is where the velocity
     * and position for the particles are updated
     * using the SPH simulator.
     * */

    this.stats.begin();
    var mass = 0.00095367 * this.controller.mass;

    if(this.controller.dt > 0 || this.currentFrame == 0) {

        //Evaluate the median of the particles positions inside each cell
        this.controller.setMedianDataProgram(this.bufferIndex2D, 1, this.tPosition, this.tPosition);
        this.webGL_drawVertices(this.fbCells1.buffer, this.totalParticles, true, true);

        //Evaluate the median of the particles velocities inside each cell
        this.controller.setMedianDataProgram(this.bufferIndex2D, 0, this.tPosition, this.tVelDen);
        this.webGL_drawVertices(this.fbCells2.buffer, this.totalParticles, true, true);

        //Evaluate the density of each particle
        this.controller.setDensityProgram(this.bufferIndex2D, mass, this.tPosition, this.tCells1);
        this.webGL_drawVertices(this.fbVelocity.buffer, this.totalParticles, false, true);

        //Evaluate the median density of each bucket
        this.controller.setMedianDensityProgram(this.bufferIndex2D, this.tPosition, this.tVelDen);
        this.webGL_drawVertices(this.fbCells2.buffer, this.totalParticles, false, true);

        //Calculate the velocity of each particle
        this.controller.setVelocityProgram(this.bufferIndex2D, mass, this.tPosition, this.tVelDen, this.tCells1, this.tCells2);
        this.webGL_drawVertices(this.fbCells3.buffer, this.totalParticles, true, false);
        this.webGL_copyTextureTo(this.tVelDen);

        //Calculate the position of each particle
        this.controller.setPositionProgram(this.bufferIndex2D, this.tPosition, this.tVelDen);
        this.webGL_drawVertices(this.fbCells3.buffer, this.totalParticles, true, false);
        this.webGL_copyTextureTo(this.tPosition);

        this.geometryDirty = true;
        this.explosionFrame ++;

    }

    /*
     This is the rendering part, here there are two choices, one is to render
     the particles as point sprites, the other is to use marching cubes to
     create a mesh.
     */

    this.camera.updateCamera(this.controller.FOV);

    if (this.geometryDirty && this.controller.renderOptions != 0) {

        //Active cells evaluation
        this.controller.setPotentialProgram(this.bufferIndex2D, this.tPosition);
        this.webGL_drawVertices(this.fbCells1.buffer, this.totalParticles, true, false);

        //Spread the cells around the neighbors using a 3D blur
        this.spreadCells(this.controller.spread);


        //Evaluate the corners values for the potentials
        this.controller.setQuadProgram(12, this.bufferIndex, this.tCells1);
        this.webGL_drawQuad(this.fbCorners.buffer);


        //this.webGL_copyTextureTo(this.tCorners);

        //Evaluate the cells active for the marching cubes
        this.controller.setMarchCaseProgram(this.bufferIndex, this.tCorners);
        this.webGL_drawQuad(this.fbCells2.buffer);

        //Generate a pyramid to compact the active cells
        this.createPyramid(this.tCells2, this.fbCells1.buffer);

        //Generate the positions and normals for the triangles.
        this.controller.setTriangleDataProgram(this.bufferIndex, this.bufferIndex2D, this.tCells1, this.tIndexes, this.tCorners);
        this.webGL_drawVertices(this.fbTriangles.buffer, 12 * this.activeCells, true, false);

        this.controller.setNormalDataProgram(this.bufferIndex, this.bufferIndex2D, this.tCells1, this.tIndexes, this.tCorners);
        this.webGL_drawVertices(this.fbNormals.buffer, 12 * this.activeCells, true, false);

        //Generate the final voxels texture for the ray tracing
        this.controller.setIndexVoxes(this.bufferIndex, this.bufferIndex2D, this.tCells1);
        this.webGL_drawVertices(this.fbCells2.buffer, this.activeCells, true, false);

        this.geometryDirty = false;

    }

    if(this.controller.renderOptions == 0) {

        //In this case the particles are rendered as simple point sprites
        this.controller.setRenderParticlesProgram(this.bufferIndex2D, this.camera, this.tPosition);
        this.webGL_drawVertices(null, this.totalParticles, true, true);

    } else {

        //Render the triangles inside a texture.
        this.model.gl.bindFramebuffer(this.model.gl.FRAMEBUFFER, this.fbScreen.buffer);
        this.model.gl.viewport(0, 0, 854, 854);
        this.model.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.model.gl.clear(this.model.gl.COLOR_BUFFER_BIT | this.model.gl.DEPTH_BUFFER_BIT);
        this.controller.setRenderTrianglesProgram(this.bufferIndex, this.bufferIndex2D, this.camera, this.tTriangles, this.tNormals, this.tCells2, this.tLowRes, this.textureEnviroment, this.tExplosion);
        this.model.gl.enable(this.model.gl.DEPTH_TEST);
        this.model.gl.depthFunc(this.model.gl.LESS);
        this.model.gl.enable(this.model.gl.CULL_FACE);
        this.model.gl.cullFace(this.model.gl.FRONT);
        this.model.gl.drawArrays(this.model.gl.TRIANGLES, 0, 12 * this.activeCells);
        this.model.gl.disable(this.model.gl.DEPTH_TEST);
        this.model.gl.disable(this.model.gl.CULL_FACE);

        if(this.controller.renderOptions == 2) {
            this.controller.setRenderParticlesProgram(this.bufferIndex2D, this.camera, this.tPosition);
            this.webGL_drawVertices(this.fbScreen.buffer, this.totalParticles, false, true, 854);
            this.webGL_drawVertices(this.fbExplosion.buffer, this.totalParticles, false, true, 854);
        }

        this.controller.setGradientProgram(this.bufferIndex, this.tScreen);
        this.webGL_drawQuad(this.fbRender.buffer, 854);


        //depending on the current frame a use a texture or somehitng else

/*
        if(Math.min(this.explosionFrame * this.controller.dt * 10, 8.) < 8) {
            this.controller.setExplosionProgram(this.bufferIndex, this.currentFrame, this.initialTexture, Math.min(this.explosionFrame * this.controller.dt * 10, 7.));

        } else {
            this.controller.setCloudsProgram(this.bufferIndex, this.currentFrame * 0.05, this.initialTexture);
        }
        this.webGL_drawQuad(null, 854);
        */

        /*
        this.model.gl.enable(this.model.gl.SCISSOR_TEST);
        this.model.gl.scissor(0, 2 * 119, 854, 119);
        this.webGL_drawTextureTo(this.tExplosion, null, 854, true);

        this.model.gl.scissor(0, 3 * 119, 854, 119);
        this.webGL_drawTextureTo(this.tRender, null, 854, true);

        this.model.gl.scissor(0, 4 * 119, 854, 119);
        this.webGL_drawTextureTo(this.tExplosion, null, 854, true);

        this.model.gl.scissor(0, 5 * 119, 854, 119);
        this.webGL_drawTextureTo(this.tRender, null, 854, true);


        this.model.gl.disable(this.model.gl.SCISSOR_TEST);

*/

        //this.evalMaxRadius();
        //console.log(this.radius);


        this.model.gl.enable(this.model.gl.SCISSOR_TEST);
        this.model.gl.scissor(0, 1.7 * 119, 854, 4 * 119);
       // this.controller.setExplosionProgram(this.bufferIndex, this.currentFrame, this.initialTexture, this.radius, this.tRender);
       // this.webGL_drawQuad(null, 854);
        this.webGL_drawTextureTo(this.tRender, null, 854);
        this.model.gl.disable(this.model.gl.SCISSOR_TEST);

        //this.webGL_drawTextureTo(this.tStar, null, 854);
    }




    this.stats.end();
    this.currentFrame ++;

}

//Resize function for the window
World3D.prototype.resize = function(evalMode) {

    if(evalMode) {
        this.windowSize = 1024;
    } else {
        this.windowSize = window.innerHeight / window.innerWidth < 1 ? window.innerHeight : window.innerWidth;
        document.getElementById("container").style.width = this.windowSize;
        document.getElementById("container").style.left = 0;
        document.getElementById("container").style.top = 0;
    }

    this.model.canvas.width = 854;
    this.model.canvas.height = 854;
}

//Function used to create pyramids
World3D.prototype.createPyramid = function(initialTexture, buffer) {

    //This part set the levels
    var levels = Math.ceil(Math.log(initialTexture.size) / Math.log(2));
    var offset = 0;
    for (var i = 0; i < levels; i++) {
        this.model.gl.bindFramebuffer(this.model.gl.FRAMEBUFFER, this.fbPyramid[levels - i - 1].buffer);
        this.model.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.model.gl.clear(this.model.gl.COLOR_BUFFER_BIT | this.model.gl.DEPTH_BUFFER_BIT);
        var size = Math.pow(2, levels - 1 - i);
        this.model.gl.viewport(0, 0, size, size);
        this.controller.setPyramidProgram(this.bufferIndex, i == 0 ? initialTexture : this.tLevels[levels - i], i, initialTexture.size);
        if(size > 1){
            this.model.gl.enable(this.model.gl.SCISSOR_TEST);
            this.model.gl.scissor(0, 0, size, size * 0.5);
        }
        this.model.gl.drawArrays(this.model.gl.TRIANGLE_STRIP, 0, 4);

        this.model.gl.bindTexture(this.model.gl.TEXTURE_2D, this.tPyramid);
        this.model.gl.copyTexSubImage2D(this.model.gl.TEXTURE_2D, 0, offset, 0, 0, 0, Math.pow(2, levels - 1 - i), Math.pow(2, levels - 1 - i));
        offset += Math.pow(2, levels - 1 - i);
        this.model.gl.bindTexture(this.model.gl.TEXTURE_2D, null);

        this.model.gl.disable(this.model.gl.SCISSOR_TEST);
    }

    //This part reads the total active cells
    this.model.gl.bindFramebuffer(this.model.gl.FRAMEBUFFER, this.fbRead.buffer);
    this.controller.setActiveCellsProgram(this.bufferIndex, this.tLevels[0], 1. / Math.pow(initialTexture.size, 2));
    this.model.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.model.gl.clear(this.model.gl.COLOR_BUFFER_BIT | this.model.gl.DEPTH_BUFFER_BIT);
    this.model.gl.viewport(0, 0, 1, 1);
    this.model.gl.drawArrays(this.model.gl.TRIANGLE_STRIP, 0, 4);

    var pixels = new Uint8Array(4);
    this.model.gl.readPixels(0, 0, 1, 1, this.model.gl.RGBA, this.model.gl.UNSIGNED_BYTE, pixels);
    this.activeCells = (pixels[0]  + pixels[1] / 255 + pixels[2] / 65025 + pixels[3] / 160581375);
    this.activeCells *= (Math.pow(initialTexture.size, 2.) / 255);
    this.activeCells = Math.round(this.activeCells);

    //This part parses the pyramid for compaction
    this.controller.setParsePyramidProgram(this.bufferIndex, this.bufferIndex2D, this.tPyramid, initialTexture);
    this.model.gl.bindFramebuffer(this.model.gl.FRAMEBUFFER, buffer);
    this.model.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.model.gl.clear(this.model.gl.COLOR_BUFFER_BIT | this.model.gl.DEPTH_BUFFER_BIT);
    this.model.gl.viewport(0, 0, initialTexture.size, initialTexture.size);
    this.model.gl.drawArrays(this.model.gl.POINTS, 0, this.activeCells);
}

//Function that initiates the data
World3D.prototype.initData = function(buffer, vertexBuffer, numVertex) {
    this.controller.setBufferDataProgram(1, this.bufferIndex2D, vertexBuffer);
    this.model.gl.bindFramebuffer(this.model.gl.FRAMEBUFFER, buffer);
    this.model.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.model.gl.clear(this.model.gl.COLOR_BUFFER_BIT | this.model.gl.DEPTH_BUFFER_BIT);
    var side = buffer.size || this.windowSize;
    this.model.gl.viewport(0, 0, side, side);
    this.model.gl.drawArrays(this.model.gl.POINTS, 0, numVertex);
}

//Function that calculates a 3D blur for a texture3D
World3D.prototype.spreadCells = function(n) {
    var k = 1 / 2048;
    var double = Math.floor(n * 0.5);
    for(var i = 0; i < double; i++) {
        this.blurZ(this.fbCells2.buffer, this.tCells1);
        this.blurXY(this.fbCells1.buffer, this.tCells2, [k, 0, k]);
        this.blurXY(this.fbCells2.buffer, this.tCells1, [0, k, k]);
        this.blurZ(this.fbCells1.buffer, this.tCells2);
        this.blurXY(this.fbCells2.buffer, this.tCells1, [k, 0, k]);
        this.blurXY(this.fbCells1.buffer, this.tCells2, [0, k, k]);
    }

    var simple = (n == 1) ? 1 : n % 2;
    if(simple > 0) {
        this.blurZ(this.fbCells2.buffer, this.tCells1);
        this.blurXY(this.fbCells1.buffer, this.tCells2, [k, 0, k]);
        this.blurXY(this.fbCells2.buffer, this.tCells1, [0, k, k]);
        this.webGL_copyTextureTo(this.tCells1);
    }
}

//Kernel function for the blurZ
World3D.prototype.blurZ = function(buffer, texture) {
    this.controller.setZBlurProgram(this.bufferIndex, texture);
    this.webGL_drawQuad(buffer);
}

//Kernel function for the blurXY
World3D.prototype.blurXY = function(buffer, texture, axis) {
    this.controller.setXYBlurProgram(this.bufferIndex, texture, axis);
    this.webGL_drawQuad(buffer);
}



//Function used to create obtain the max radius on each frame of the explosion
World3D.prototype.evalMaxRadius = function() {

    var initialTexture = this.tPosition;

    //This part set the levels
    var levels = Math.ceil(Math.log(initialTexture.size) / Math.log(2));
    for (var i = 0; i < levels; i++) {
        this.model.gl.bindFramebuffer(this.model.gl.FRAMEBUFFER, this.fbPyramid[levels - i - 1].buffer);
        this.model.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.model.gl.clear(this.model.gl.COLOR_BUFFER_BIT | this.model.gl.DEPTH_BUFFER_BIT);
        var size = Math.pow(2, levels - 1 - i);
        this.model.gl.viewport(0, 0, size, size);
        this.controller.setRadiusProgram(this.bufferIndex, i == 0 ? initialTexture : this.tLevels[levels - i], i, initialTexture.size);
        if(size > 1){
            this.model.gl.enable(this.model.gl.SCISSOR_TEST);

            //Since there are few particles I should only evaluate 25 rows from the image (25 * 2048 = 51200 particles...)
            this.model.gl.scissor(0, 0, size, 40);
        }
        this.model.gl.drawArrays(this.model.gl.TRIANGLE_STRIP, 0, 4);
        this.model.gl.disable(this.model.gl.SCISSOR_TEST);
    }

    //This part reads the total active cells
    this.model.gl.bindFramebuffer(this.model.gl.FRAMEBUFFER, this.fbRead.buffer);
    this.controller.setActiveCellsProgram(this.bufferIndex, this.tLevels[0], 1. / Math.pow(initialTexture.size, 2));
    this.model.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.model.gl.clear(this.model.gl.COLOR_BUFFER_BIT | this.model.gl.DEPTH_BUFFER_BIT);
    this.model.gl.viewport(0, 0, 1, 1);
    this.model.gl.drawArrays(this.model.gl.TRIANGLE_STRIP, 0, 4);

    var pixels = new Uint8Array(4);
    this.model.gl.readPixels(0, 0, 1, 1, this.model.gl.RGBA, this.model.gl.UNSIGNED_BYTE, pixels);
    var partial = (pixels[0]  + pixels[1] / 255 + pixels[2] / 65025 + pixels[3] / 160581375)
    partial *= (Math.pow(initialTexture.size, 2.) / 255);
    partial /= 1000.;
    this.radius = Math.max(this.radius, partial);
}


/*
THSE ARE WEBGL DRAWING FUNCTION CALLS FOR QUADS AND VERTICES
it also have a specific function used to copy textures from
the current framebuffer.
 */

//Function used to evaluate textures
World3D.prototype.webGL_drawTextureTo = function(texture, buffer, size, noClear) {
    this.controller.setQuadProgram(0, this.bufferIndex, texture);
    this.webGL_drawQuad(buffer, size, noClear);
}

//Function used to draw a Quad
World3D.prototype.webGL_drawQuad = function(buffer, size, noClear) {
    this.model.gl.bindFramebuffer(this.model.gl.FRAMEBUFFER, buffer);
    var side = buffer != null ? buffer.size : this.windowSize;
    if(size) side = size;
    this.model.gl.viewport(0, 0, side, side);

    if(noClear) {

    } else {
        this.model.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.model.gl.clear(this.model.gl.COLOR_BUFFER_BIT | this.model.gl.DEPTH_BUFFER_BIT);
    }

    if(buffer != null) {
        this.model.gl.enable(this.model.gl.SCISSOR_TEST);
        this.model.gl.scissor(0, 0, 2048, 1024);
    }

    this.model.gl.drawArrays(this.model.gl.TRIANGLE_STRIP, 0, 4);
    if(buffer != null) this.model.gl.disable(this.model.gl.SCISSOR_TEST);
}

//Function that evaluates the change in the vertices/particles status in a texture
World3D.prototype.webGL_drawVertices = function(buffer, numVertex, clear,  add) {
    this.model.gl.bindFramebuffer (this.model.gl.FRAMEBUFFER, buffer);
    if(clear) {
        this.model.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.model.gl.clear(this.model.gl.COLOR_BUFFER_BIT | this.model.gl.DEPTH_BUFFER_BIT);
    }
    var side = buffer != null ? buffer.size : 854;
    this.model.gl.viewport(0, 0, side, side);
    if(add) {
        this.model.gl.enable(this.model.gl.BLEND);
        this.model.gl.blendEquation (this.model.gl.FUNC_ADD);
        this.model.gl.blendFuncSeparate (this.model.gl.ONE, this.model.gl.ONE, this.model.gl.ONE, this.model.gl.ONE);
    }
    this.model.gl.drawArrays(this.model.gl.POINTS, 0, numVertex);
    if(add) this.model.gl.disable (this.model.gl.BLEND);
}

//Function used to copy one texture in another one
World3D.prototype.webGL_copyTextureTo = function(texture) {
    this.model.gl.bindTexture(this.model.gl.TEXTURE_2D, texture);
    this.model.gl.copyTexSubImage2D(this.model.gl.TEXTURE_2D, 0, 0, 0, 0, 0, texture.size, texture.size);
    this.model.gl.bindTexture(this.model.gl.TEXTURE_2D, null);
}

/*
THESE ARE WEBGL GENERIC FUNCTIONS USED TO CREATE:
- Textures
- Frambuffers and MRTs Framebuffers
- Vertex Array buffers
 */

//Fuction used to create textures
World3D.prototype.webGL_createTexture = function(textureSize, format, maxFilter, minFilter, type, unBind) {
    var texture = this.model.gl.createTexture();
    texture.size = textureSize;
    this.model.gl.bindTexture(this.model.gl.TEXTURE_2D, texture);
    this.model.gl.texImage2D(this.model.gl.TEXTURE_2D, 0, format, textureSize, textureSize, 0, format, type, null);
    this.model.gl.texParameteri(this.model.gl.TEXTURE_2D, this.model.gl.TEXTURE_MAG_FILTER, maxFilter);
    this.model.gl.texParameteri(this.model.gl.TEXTURE_2D, this.model.gl.TEXTURE_MIN_FILTER, minFilter);
    this.model.gl.texParameteri(this.model.gl.TEXTURE_2D, this.model.gl.TEXTURE_WRAP_S, this.model.gl.CLAMP_TO_EDGE);
    this.model.gl.texParameteri(this.model.gl.TEXTURE_2D, this.model.gl.TEXTURE_WRAP_T, this.model.gl.CLAMP_TO_EDGE);
    if (unBind) this.model.gl.bindTexture(this.model.gl.TEXTURE_2D, null);

    return texture;
}

//Function used to create framebuffers
World3D.prototype.webGL_createFramebuffer = function(texture) {
    var frameData = {};
    frameData.buffer = this.model.gl.createFramebuffer();
    this.model.gl.bindFramebuffer(this.model.gl.FRAMEBUFFER, frameData.buffer);
    frameData.buffer.size = texture.size;
    var renderbuffer = this.model.gl.createRenderbuffer();
    this.model.gl.bindRenderbuffer(this.model.gl.RENDERBUFFER, renderbuffer);
    this.model.gl.renderbufferStorage(this.model.gl.RENDERBUFFER, this.model.gl.DEPTH_COMPONENT16, texture.size, texture.size);
    this.model.gl.framebufferTexture2D(this.model.gl.FRAMEBUFFER, this.model.gl.COLOR_ATTACHMENT0, this.model.gl.TEXTURE_2D, texture, 0);
    this.model.gl.framebufferRenderbuffer(this.model.gl.FRAMEBUFFER, this.model.gl.DEPTH_ATTACHMENT, this.model.gl.RENDERBUFFER, renderbuffer);
    this.model.gl.bindTexture(this.model.gl.TEXTURE_2D, null);
    this.model.gl.bindRenderbuffer(this.model.gl.RENDERBUFFER, null);
    this.model.gl.bindFramebuffer(this.model.gl.FRAMEBUFFER, null);
    return frameData;
}

World3D.prototype.webGL_createArrayBuffer = function(data) {
    var buffer = this.model.gl.createBuffer();
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, buffer);
    this.model.gl.bufferData(this.model.gl.ARRAY_BUFFER, new Float32Array(data), this.model.gl.STATIC_DRAW);
    return buffer;
}

//Function used to obtain the enviroment texture
World3D.prototype.getEnviromentTexture = function() {
    var texture = this.model.gl.createTexture();
    var _this = this;
    this.model.gl.bindTexture(this.model.gl.TEXTURE_CUBE_MAP, texture);
    this.model.gl.texParameteri(this.model.gl.TEXTURE_CUBE_MAP, this.model.gl.TEXTURE_WRAP_S, this.model.gl.CLAMP_TO_EDGE);
    this.model.gl.texParameteri(this.model.gl.TEXTURE_CUBE_MAP, this.model.gl.TEXTURE_WRAP_T, this.model.gl.CLAMP_TO_EDGE);
    this.model.gl.texParameteri(this.model.gl.TEXTURE_CUBE_MAP, this.model.gl.TEXTURE_MIN_FILTER, this.model.gl.LINEAR);
    this.model.gl.texParameteri(this.model.gl.TEXTURE_CUBE_MAP, this.model.gl.TEXTURE_MAG_FILTER, this.model.gl.LINEAR);

    var faces = [["images/cubeSide2.jpg", this.model.gl.TEXTURE_CUBE_MAP_POSITIVE_X],
        ["images/cubeSide4.jpg", this.model.gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
        ["images/cubeTop.jpg", this.model.gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
        ["images/cubeBottom.jpg", this.model.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
        ["images/cubeSide1.jpg", this.model.gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
        ["images/cubeSide3.jpg", this.model.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]];
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i][1];
        var image = new Image();
        image.onload = function(texture, face, image) {
            return function() {
                _this.model.gl.bindTexture(_this.model.gl.TEXTURE_CUBE_MAP, texture);
                _this.model.gl.pixelStorei(_this.model.gl.UNPACK_FLIP_Y_WEBGL, false);
                _this.model.gl.texImage2D(face, 0, _this.model.gl.RGBA, _this.model.gl.RGBA, _this.model.gl.UNSIGNED_BYTE, image);
            }
        } (texture, face, image);
        image.src = faces[i][0];
    }

    return texture;
}

