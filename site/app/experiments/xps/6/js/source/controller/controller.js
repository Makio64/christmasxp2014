/**
 * Created by hector.arellano on 10/2/14.
 */

define(['datGui']);

//Constructor
var Controller = function(model) {
    this.model = model;
    this.mass = 1.8;
    this.pressureK = 6.7;
    this.minPress = 278;
    this.viscosity = 4.1;
    this.gravity = 0;
    this.dt = 0.004;
    this.particleSize = 2.;
    this.particleRenderSize = 2.;
    this.intensity = 0.2;
    this.spread = 1;
    this.spreadRange = 1.07;
    this.range = 0.29;
    this.transparency = 1;
    this.focus = 0.;
    this.useBoxContainer = false;
    this.renderOptions = 2;
    this.FOV = 16;
    this.gui = new dat.GUI({ autoPlace: false });
    this.fresnellPower = 5;
    this.refraction = 1.1;
    this.maxIterations = 80.;
    this.maxBounces = 1;
    this.useRefractColor = false;
    this.reset = new signals.Signal();
    this.width = 0;
    this.updateGeometry = new signals.Signal();
    this.restart = function() {
        this.reset.dispatch();
    }
    this.materialColor = [0, 0, 0]; // RGB with alpha
    this.reflectColor = [0, 0, 0]; // RGB with alpha
    this.refractColor = [132, 116, 96]; // RGB with alpha

    var customContainer = document.getElementById('my-gui-container');
    customContainer.appendChild(this.gui.domElement);

    this.setupMenu();
}

//Function used to modify the values of the Controller for the animation.
Controller.prototype.setupMenu = function() {
    this.gui.width = 280;
    this.gui.add(this, "restart");
    var simulationFolder = this.gui.addFolder('SPH Particle Simulation');
    simulationFolder.add(this, "mass",0.1, 2).step(0.1).name("mass multiplier").listen();
    simulationFolder.add(this, "pressureK", 1, 10).step(0.1).name("pressure multiplier");
    simulationFolder.add(this, "viscosity", 1, 10).step(0.1).name("viscosity nultiplier");
    simulationFolder.add(this, "minPress", 0, 1000, 1).name("compressibility");
    simulationFolder.add(this, "gravity", -10, 10).step(1.);
    simulationFolder.add(this, "dt", 0.00, 0.01, 0.0001).name("simulation speed");

    var meshing = this.gui.addFolder('Marching Cubes mesh generation');
    var geom0 = meshing.add(this, 'particleSize', 1, 4).name('particle size').step(1);
    var geom1 = meshing.add(this, "spread", 0, 6).step(1).name("surface smoothness").listen();
    var geom2 = meshing.add(this, "spreadRange", 0.01, 10, 0.1).name("droplets resolution");
    var geom3 = meshing.add(this, "range", 0.2, 1, 0.01).name("isosurface range");

    var rendering = this.gui.addFolder('Ray Trace rendering');
    rendering.add(this, 'renderOptions', {'particles' : 0, 'mesh' : 1, 'mesh + particles' : 2}).name('render style');
    rendering.add(this, 'particleRenderSize', 1, 4).name('particle size').step(1);
    rendering.add(this, 'FOV', 2, 40, 1).name('field of view');
    rendering.add(this, 'intensity', 0, 1).name('particle intensity');
    rendering.add(this, 'fresnellPower', 0, 6, 1).name('fresnell power');
    rendering.add(this, 'refraction', 1.0, 5., 0.01);
    rendering.add(this, "maxIterations", 0, 192).step(1).name("max ray steps");
    rendering.add(this, 'maxBounces',0, 3).name('max ray bounces').step(1);
    var control2 = simulationFolder.add(this, "useBoxContainer").name("use box container");
    //rendering.addColor(this, 'materialColor').name('material color');
    //rendering.addColor(this, 'reflectColor').name('reflection color');
    var colorChange = rendering.add(this, 'useRefractColor').name('toggle for map');
    rendering.addColor(this, 'refractColor').name('rays color');

    var _this = this;
    control2.onChange(function() {if(_this.useBoxContainer == true) _this.reset.dispatch();});

    geom0.onChange(function() { _this.updateGeometry.dispatch();});
    geom1.onChange(function() { _this.updateGeometry.dispatch();});
    geom2.onChange(function() { _this.updateGeometry.dispatch();});
    geom3.onChange(function() { _this.updateGeometry.dispatch();});

    colorChange.onChange(function() {if(_this.useRefractColor)colorChange.name('toggle for cube map'); else colorChange.name('toggle for color below')});
}

//Function modifier for the print texture program. Used in programs 0, 9, 12
Controller.prototype.setQuadProgram = function(n, bufferIndex, textureData) {
    this.model.gl.useProgram(this.model.programs[n]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[n].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.bindTexture(this.model.programs[n].dataTexture, textureData, 0);
}

//Function modifier for the initData program. Used for shader 1 and 21
Controller.prototype.setBufferDataProgram = function(n, bufferIndex2D, bufferData) {
    this.model.gl.useProgram(this.model.programs[n]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[n].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferData);
    this.model.gl.vertexAttribPointer(this.model.programs[n].vertexData, 4, this.model.gl.FLOAT, false, 0, 0);
}

//Function modified for the median data program.
Controller.prototype.setMedianDataProgram = function(bufferIndex2D, alpha, texturePosition, textureData) {
    this.model.gl.useProgram(this.model.programs[2]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[2].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[2].particleSize, 1);
    this.model.gl.uniform1f(this.model.programs[2].alpha, alpha);
    this.bindTexture(this.model.programs[2].positionTexture, texturePosition, 0);
    this.bindTexture(this.model.programs[2].dataTexture, textureData, 1);
}

//Function modifier for the density program.
Controller.prototype.setDensityProgram = function(bufferIndex2D, particleMass, texturePosition, medianTexturePosition) {
    this.model.gl.useProgram(this.model.programs[3]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[3].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[3].mass, particleMass);
    this.bindTexture(this.model.programs[3].positionTexture, texturePosition, 0);
    this.bindTexture(this.model.programs[3].medianPositionTexture, medianTexturePosition, 1);
}

//Function modifier for the median density program
Controller.prototype.setMedianDensityProgram = function(bufferIndex2D, texturePosition, textureDensity) {
    this.model.gl.useProgram(this.model.programs[4]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[4].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[4].particleSize, 1);
    this.bindTexture(this.model.programs[4].positionTexture, texturePosition, 0);
    this.bindTexture(this.model.programs[4].densityTexture, textureDensity, 1);
}

//Function modifier for the velocity program
Controller.prototype.setVelocityProgram = function(bufferIndex2D, particleMass, texturePosition, textureVelocity, textureMedianPosition, textureMedianVelocity) {
    this.model.gl.useProgram(this.model.programs[5]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[5].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[5].mass, particleMass);
    this.model.gl.uniform1f(this.model.programs[5].k, this.pressureK);
    this.model.gl.uniform1f(this.model.programs[5].viscosity, this.viscosity);
    this.model.gl.uniform1f(this.model.programs[5].dt, this.dt);
    this.model.gl.uniform1f(this.model.programs[5].minPress, -this.minPress);
    this.model.gl.uniform1f(this.model.programs[5].gravity, this.gravity);
    this.model.gl.uniform1i(this.model.programs[5].useBox, this.useBoxContainer);
    this.bindTexture(this.model.programs[5].positionTexture, texturePosition, 0);
    this.bindTexture(this.model.programs[5].velocityTexture, textureVelocity, 1);
    this.bindTexture(this.model.programs[5].medianPositionTexture, textureMedianPosition, 2);
    this.bindTexture(this.model.programs[5].medianVelocityTexture, textureMedianVelocity, 3);
}

//Function modifier for the position program
Controller.prototype.setPositionProgram = function(bufferIndex2D, texturePosition, textureVelocity) {
    this.model.gl.useProgram(this.model.programs[6]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[6].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[6].dt, this.dt);
    this.bindTexture(this.model.programs[6].positionTexture, texturePosition, 0);
    this.bindTexture(this.model.programs[6].velocityTexture, textureVelocity, 1);
}

//Function modifier for the render particles program.
Controller.prototype.setRenderParticlesProgram = function(bufferIndex2D, camera, texturePosition) {
    this.model.gl.useProgram(this.model.programs[7]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[7].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[7].intensity, this.intensity);
    this.model.gl.uniform1f(this.model.programs[7].particleSize, this.particleRenderSize);
    this.model.gl.uniformMatrix4fv(this.model.programs[7].cameraMatrix, false, camera.cameraTransformMatrix);
    this.model.gl.uniformMatrix4fv(this.model.programs[7].perspectiveMatrix, false, camera.perspectiveMatrix);
    this.bindTexture(this.model.programs[7].positionTexture, texturePosition, 0);
}

//Function modifier for the binary potential program.
Controller.prototype.setPotentialProgram = function(bufferIndex2D, texturePosition) {
    this.model.gl.useProgram(this.model.programs[8]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[8].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[8].particleSize, this.particleSize);
    this.bindTexture(this.model.programs[8].positionTexture, texturePosition, 0);
}

//Function modifier for the ZBlur program.
Controller.prototype.setZBlurProgram = function(bufferIndex, textureData) {
    this.model.gl.useProgram(this.model.programs[10]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[10].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[10].spreadRange, this.spreadRange);
    this.bindTexture(this.model.programs[10].dataTexture, textureData, 0);
}

//Function modifier for the XYBlur program.
Controller.prototype.setXYBlurProgram = function(bufferIndex, textureData, axis) {
    this.model.gl.useProgram(this.model.programs[11]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[11].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform3f(this.model.programs[11].axis, axis[0], axis[1], axis[2]);
    this.model.gl.uniform1f(this.model.programs[11].spreadRange, this.spreadRange);
    this.bindTexture(this.model.programs[11].dataTexture, textureData, 0);
}

//Function modifier for the isosurface program.
Controller.prototype.setMarchCaseProgram = function(bufferIndex, textureData) {
    this.model.gl.useProgram(this.model.programs[13]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[13].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[13].range, this.range);
    this.bindTexture(this.model.programs[13].dataTexture, textureData, 0);
}

//Function modifier for the pyramid program
Controller.prototype.setPyramidProgram = function(bufferIndex, texturePotential, level, initialSize) {
    if(level == 0) {
        this.model.gl.useProgram(this.model.programs[14]);
        this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
        this.model.gl.vertexAttribPointer(this.model.programs[14].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    }
    var size = Math.pow(2, level + 1) / initialSize;
    this.model.gl.uniform1f(this.model.programs[14].size, size);
    this.bindTexture(this.model.programs[14].potentialTexture, texturePotential, 0);
}

//Function modifier activeCells program
Controller.prototype.setActiveCellsProgram = function(bufferIndex, textureActiveCells, maxCells) {
    this.model.gl.useProgram(this.model.programs[15]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[15].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[15].maxData, maxCells);
    this.bindTexture(this.model.programs[15].readPixelTexture, textureActiveCells, 0);
}

//Function modifier for the parse pyramid program
Controller.prototype.setParsePyramidProgram = function(bufferIndex, bufferIndex2D, texturePyramid, textureBase) {
    this.model.gl.useProgram(this.model.programs[16]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[16].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[16].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.bindTexture(this.model.programs[16].pyramid, texturePyramid, 0);
    this.bindTexture(this.model.programs[16].base, textureBase, 1);
}

//Function modifier for the trianglesIndexes program
Controller.prototype.setTriangleIndexProgram = function(bufferIndexTriangles, bufferIndex64) {
    this.model.gl.useProgram(this.model.programs[17]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndexTriangles);
    this.model.gl.vertexAttribPointer(this.model.programs[17].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex64);
    this.model.gl.vertexAttribPointer(this.model.programs[17].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
}

//Function modifier for the triangle data program
Controller.prototype.setTriangleDataProgram = function(bufferIndex, bufferIndex2D, textureMarching, textureIndexes, textureCorners) {
    this.model.gl.useProgram(this.model.programs[18]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[18].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[18].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[18].range, this.range);
    this.model.gl.uniform1f(this.model.programs[18].limit, this.limit);
    this.bindTexture(this.model.programs[18].marchingTexture, textureMarching, 0);
    this.bindTexture(this.model.programs[18].tiTexture, textureIndexes, 1);
    this.bindTexture(this.model.programs[18].potentialTexture, textureCorners, 2);
}

//Function that defines the voxels indexes relative to the triangles
Controller.prototype.setIndexVoxes = function(bufferIndex, bufferIndex2D, texturePosition) {
    this.model.gl.useProgram(this.model.programs[19]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[19].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[19].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.bindTexture(this.model.programs[19].positionTexture, texturePosition, 0);
}

//Function modifier for the render program
Controller.prototype.setRenderTrianglesProgram = function(bufferIndex, bufferIndex2D, camera, tTriangles, tNormals, texturePotential, texturePotentialLow, textureEnviroment, textureExplosion) {
    this.model.gl.useProgram(this.model.programs[20]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[20].vertexRepet, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[20].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniformMatrix4fv(this.model.programs[20].cameraMatrix, false, camera.cameraTransformMatrix);
    this.model.gl.uniformMatrix4fv(this.model.programs[20].perspectiveMatrix, false, camera.perspectiveMatrix);
    this.model.gl.uniform1f(this.model.programs[20].transparency, this.transparency);
    this.model.gl.uniform3f(this.model.programs[20].eyeVector, camera.position[0], camera.position[1], camera.position[2]);
    this.model.gl.uniform1f(this.model.programs[20].refract, this.refraction);
    this.model.gl.uniform1f(this.model.programs[20].fresnellPower, this.fresnellPower);
    this.model.gl.uniform1i(this.model.programs[20].iterations, this.maxIterations);
    this.model.gl.uniform1i(this.model.programs[20].bounces, this.maxBounces);
    this.model.gl.uniform1i(this.model.programs[20].useRefractColor, this.useRefractColor);
    this.model.gl.uniform3f(this.model.programs[20].materialColor, this.materialColor[0] / 255, this.materialColor[1] / 255, this.materialColor[2] / 255);
    this.model.gl.uniform3f(this.model.programs[20].reflectColor, this.reflectColor[0] / 255, this.reflectColor[1] / 255, this.reflectColor[2] / 255);
    this.model.gl.uniform3f(this.model.programs[20].refractColor, this.refractColor[0] / 255, this.refractColor[1] / 255, this.refractColor[2] / 255);
    this.bindTexture(this.model.programs[20].textureTriangles, tTriangles, 0);
    this.bindTexture(this.model.programs[20].textureNormals, tNormals, 1);
    this.bindTexture(this.model.programs[20].potentialTexture, texturePotential, 2);
    this.bindTexture(this.model.programs[20].potentialTextureLow, texturePotentialLow, 3);
    this.bindTexture(this.model.programs[20].explosion, textureExplosion, 4);
    this.bindTexture(this.model.programs[20].enviroment, textureEnviroment, 5, true);

}

//Function modifier for the initNoise program
Controller.prototype.setInitNoiseProgram = function(bufferIndex2D, bufferNoise, texturePosition, useRotation) {
    this.model.gl.useProgram(this.model.programs[21]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[21].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferNoise);
    this.model.gl.vertexAttribPointer(this.model.programs[21].vertexData, 4, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1i(this.model.programs[21].useRotation, useRotation)
    this.bindTexture(this.model.programs[21].positionTexture, texturePosition, 0);
}

//Function used for texture binding
Controller.prototype.bindTexture = function(programData, texture, texturePos, isCubeTexture) {
    var textures = [this.model.gl.TEXTURE0, this.model.gl.TEXTURE1, this.model.gl.TEXTURE2, this.model.gl.TEXTURE3, this.model.gl.TEXTURE4, this.model.gl.TEXTURE5, this.model.gl.TEXTURE6, this.model.gl.TEXTURE7, this.model.gl.TEXTURE8, this.model.gl.TEXTURE9, this.model.gl.TEXTURE10, this.model.gl.TEXTURE11, this.model.gl.TEXTURE12, this.model.gl.TEXTURE13, this.model.gl.TEXTURE14];
    this.model.gl.activeTexture(textures[texturePos]);
    if(!isCubeTexture) {
        this.model.gl.bindTexture(this.model.gl.TEXTURE_2D, null);
        this.model.gl.bindTexture(this.model.gl.TEXTURE_2D, texture);
    }
    else {
        this.model.gl.bindTexture(this.model.gl.TEXTURE_CUBE_MAP, null);
        this.model.gl.bindTexture(this.model.gl.TEXTURE_CUBE_MAP, texture);
    }

    this.model.gl.uniform1i(programData, texturePos);
}

//This function is used to compare texture results
Controller.prototype.compare = function(bufferIndex, tVertex1, tVertex2, tVertex3) {
    this.model.gl.useProgram(this.model.programs[22]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[22].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.bindTexture(this.model.programs[22].textureVertex1, tVertex1, 0);
    this.bindTexture(this.model.programs[22].textureVertex2, tVertex2, 1);
    this.bindTexture(this.model.programs[22].textureVertex3, tVertex3, 2);
}

//This function creates the small resolution voxels texture3D
Controller.prototype.setLowResVoxels = function(bufferIndex2D, tPotential) {
    this.model.gl.useProgram(this.model.programs[23]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[23].vertex2D, 2, this.model.gl.FLOAT, false, 0, 0);
    this.bindTexture(this.model.programs[23].potentialTexture, tPotential, 0);
}

//This function upsamples the resolution of the renderer image
Controller.prototype.setGradientProgram = function(bufferIndex, tRender, size) {
    this.model.gl.useProgram(this.model.programs[24]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[24].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.bindTexture(this.model.programs[24].dataTexture, tRender, 0);
}

//Function modifier for the triangle data program
Controller.prototype.setNormalDataProgram = function(bufferIndex, bufferIndex2D, textureMarching, textureIndexes, textureCorners) {
    this.model.gl.useProgram(this.model.programs[25]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[25].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex2D);
    this.model.gl.vertexAttribPointer(this.model.programs[25].vertex2DIndex, 2, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[25].range, this.range);
    this.model.gl.uniform1f(this.model.programs[25].limit, this.limit);
    this.bindTexture(this.model.programs[25].marchingTexture, textureMarching, 0);
    this.bindTexture(this.model.programs[25].tiTexture, textureIndexes, 1);
    this.bindTexture(this.model.programs[25].potentialTexture, textureCorners, 2);
}

//Function used to draw stars
Controller.prototype.setStarProgram = function(bufferIndex) {
    this.model.gl.useProgram(this.model.programs[26]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[26].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[26].width, this.width);
}

//Function that controls the explosion
Controller.prototype.setExplosionProgram = function(bufferIndex, size, textureNoise, radius, textureStar) {
    this.model.gl.useProgram(this.model.programs[27]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[27].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[27].size, size);
    this.model.gl.uniform1f(this.model.programs[27].radius, radius);
    this.bindTexture(this.model.programs[27].marchingTexture, textureNoise, 0);
    this.bindTexture(this.model.programs[27].star, textureStar, 1);
}

//Function that controls the clouds
Controller.prototype.setCloudsProgram = function(bufferIndex, frame, textureNoise) {
    this.model.gl.useProgram(this.model.programs[28]);
    this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
    this.model.gl.vertexAttribPointer(this.model.programs[28].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    this.model.gl.uniform1f(this.model.programs[28].currentFrame, frame);
    this.bindTexture(this.model.programs[28].marchingTexture, textureNoise, 0);
}

//Function used to evaluate the max ratio of the explosion
//Function modifier for the pyramid program
Controller.prototype.setRadiusProgram = function(bufferIndex, texturePotential, level, initialSize) {
    if(level == 0) {
        this.model.gl.useProgram(this.model.programs[29]);
        this.model.gl.bindBuffer(this.model.gl.ARRAY_BUFFER, bufferIndex);
        this.model.gl.vertexAttribPointer(this.model.programs[29].vertexIndex, 1, this.model.gl.FLOAT, false, 0, 0);
    }
    var size = Math.pow(2, level + 1) / initialSize;
    this.model.gl.uniform1f(this.model.programs[29].size, size);
    this.bindTexture(this.model.programs[29].potentialTexture, texturePotential, 0);
}
