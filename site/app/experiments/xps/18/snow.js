var CAMERA_ORBIT_POINT = [50, 0, 50];
var CAMERA_DISTANCE = 25;
var GRID_LENGTH = 100.0;
var HEIGHTFIELD_RESOLUTION = 1024;
var SNOW_COUNT = 5000;
var SIMULATION_ITERATIONS = 2;
var DESIRED_ASPECT = 16 / 9;
var MIN_SNOW_SPEED = 0.1;
var SNOW_SPEED_RANGE = 0.1;
var FOV = 60;
var NEAR = 0.01
var FAR = 100.0;

var main = function (skyImage, snowImage) {
    var canvas = document.getElementsByTagName('canvas')[0];
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    gl.getExtension('OES_texture_float');
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var camera = new Camera(canvas, CAMERA_DISTANCE, CAMERA_ORBIT_POINT);

    var addProgramWrapper = new ProgramWrapper(gl, 
        buildShader(gl, gl.VERTEX_SHADER, ADD_VERTEX_SHADER_SOURCE),
        buildShader(gl, gl.FRAGMENT_SHADER, ADD_FRAGMENT_SHADER_SOURCE),
        { 'a_position': 0 }
    );

    var simulationProgramWrapper = new ProgramWrapper(gl, 
        buildShader(gl, gl.VERTEX_SHADER, SIMULATION_VERTEX_SHADER_SOURCE),
        buildShader(gl, gl.FRAGMENT_SHADER, SIMULATION_FRAGMENT_SHADER_SOURCE),
        { 'a_position': 0 }
    );

    var normalsProgramWrapper = new ProgramWrapper(gl, 
        buildShader(gl, gl.VERTEX_SHADER, NORMALS_VERTEX_SHADER_SOURCE),
        buildShader(gl, gl.FRAGMENT_SHADER, NORMALS_FRAGMENT_SHADER_SOURCE),
        { 'a_coordinates': 0 }
    );

    var renderProgramWrapper = new ProgramWrapper(gl, 
        buildShader(gl, gl.VERTEX_SHADER, RENDER_VERTEX_SHADER_SOURCE),
        buildShader(gl, gl.FRAGMENT_SHADER, RENDER_FRAGMENT_SHADER_SOURCE),
        { 'a_coordinates': 0 }
    );

    var snowProgramWrapper = new ProgramWrapper(gl,
        buildShader(gl, gl.VERTEX_SHADER, SNOW_VERTEX_SHADER_SOURCE),
        buildShader(gl, gl.FRAGMENT_SHADER, SNOW_FRAGMENT_SHADER_SOURCE),
        { 'a_position': 0 }
    );

    var quadVertexBuffer = buildBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);

    var snowSpeeds = [];
    for (var i = 0; i < SNOW_COUNT; ++i) {
        snowSpeeds[i] = Math.random() * SNOW_SPEED_RANGE + MIN_SNOW_SPEED;
    }

    var snowPositions = new Float32Array(SNOW_COUNT * 3);
    for (var i = 0; i < SNOW_COUNT; ++i) {
        snowPositions[i * 3] = Math.random() * GRID_LENGTH;
        snowPositions[i * 3 + 1] = Math.random() * CAMERA_DISTANCE;
        snowPositions[i * 3 + 2] = Math.random() * GRID_LENGTH;
    }
    var snowVertexBuffer = buildBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(snowPositions), gl.DYNAMIC_DRAW);

    var addVertexBuffer = gl.createBuffer();

    var initialHeightfieldData = new Float32Array(HEIGHTFIELD_RESOLUTION * HEIGHTFIELD_RESOLUTION * 4);
    for (var i = 0; i < HEIGHTFIELD_RESOLUTION * HEIGHTFIELD_RESOLUTION * 4; ++i) {
        initialHeightfieldData[i] = 0;
    }

    var heightfieldTextureA = buildTexture(gl, 0, gl.RGBA, gl.FLOAT, HEIGHTFIELD_RESOLUTION, HEIGHTFIELD_RESOLUTION, initialHeightfieldData, gl.REPEAT, gl.REPEAT, gl.NEAREST, gl.NEAREST);
    var heightfieldTextureB = buildTexture(gl, 0, gl.RGBA, gl.FLOAT, HEIGHTFIELD_RESOLUTION, HEIGHTFIELD_RESOLUTION, null, gl.REPEAT, gl.REPEAT, gl.NEAREST, gl.NEAREST);

    var normalsTexture = buildTexture(gl, 0, gl.RGBA, gl.UNSIGNED_BYTE, HEIGHTFIELD_RESOLUTION, HEIGHTFIELD_RESOLUTION, null, gl.REPEAT, gl.REPEAT, gl.LINEAR, gl.LINEAR);

    var simulationFramebuffer = gl.createFramebuffer();

    var projectionMatrix = makePerspectiveMatrix(new Float32Array(16), (60 / 180) * Math.PI, canvas.width / canvas.height, NEAR, FAR);

    var skyTexture = buildTextureFromImage(gl, 0, gl.RGB, gl.UNSIGNED_BYTE, skyImage, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR);
    var snowTexture = buildTextureFromImage(gl, 0, gl.RGBA, gl.UNSIGNED_BYTE, snowImage, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR);

    gl.enableVertexAttribArray(0);

    var update = function update () {
        var dropPositions = [];

        for (var i = 0; i < SNOW_COUNT; ++i) {
            snowPositions[i * 3 + 1] -= snowSpeeds[i];
            if (snowPositions[i * 3 + 1] < 0.0) {
                dropPositions.push(snowPositions[i * 3] / GRID_LENGTH);
                dropPositions.push(snowPositions[i * 3 + 2] / GRID_LENGTH);
                snowPositions[i * 3 + 1] = CAMERA_DISTANCE;
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, snowVertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, snowPositions);

        gl.useProgram(addProgramWrapper.getProgram());

        gl.bindBuffer(gl.ARRAY_BUFFER, addVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dropPositions), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, simulationFramebuffer);
        
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, heightfieldTextureA, 0);
        

        gl.viewport(0, 0, HEIGHTFIELD_RESOLUTION, HEIGHTFIELD_RESOLUTION);

        if (dropPositions.length > 0) {
            gl.drawArrays(gl.POINTS, 0, dropPositions.length / 2);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, quadVertexBuffer);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);


        for (var j = 0; j < SIMULATION_ITERATIONS; ++j) {
            gl.useProgram(simulationProgramWrapper.getProgram());

            gl.uniform1f(simulationProgramWrapper.getUniformLocation('u_heightfieldResolution'), HEIGHTFIELD_RESOLUTION);
            gl.uniform1f(simulationProgramWrapper.getUniformLocation('u_gridLength'), GRID_LENGTH);

            gl.uniform1i(simulationProgramWrapper.getUniformLocation('u_heightfieldTexture'), 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, heightfieldTextureA);

            gl.bindFramebuffer(gl.FRAMEBUFFER, simulationFramebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, heightfieldTextureB, 0);

            gl.viewport(0, 0, HEIGHTFIELD_RESOLUTION, HEIGHTFIELD_RESOLUTION);

            //render from A -> B then swap

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            var temp = heightfieldTextureA;
            heightfieldTextureA = heightfieldTextureB;
            heightfieldTextureB = temp;
        }

        gl.useProgram(normalsProgramWrapper.getProgram());
        

        gl.uniform1i(normalsProgramWrapper.getUniformLocation('u_heightfieldTexture'), 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, heightfieldTextureA);

        gl.uniform1f(normalsProgramWrapper.getUniformLocation('u_heightfieldResolution'), HEIGHTFIELD_RESOLUTION);
        gl.uniform1f(normalsProgramWrapper.getUniformLocation('u_gridLength'), GRID_LENGTH);

        gl.bindFramebuffer(gl.FRAMEBUFFER, simulationFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, normalsTexture, 0);

        gl.viewport(0, 0, HEIGHTFIELD_RESOLUTION, HEIGHTFIELD_RESOLUTION);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.useProgram(renderProgramWrapper.getProgram());

        gl.uniform1i(renderProgramWrapper.getUniformLocation('u_normalsTexture'), 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, normalsTexture);

        gl.uniform1i(renderProgramWrapper.getUniformLocation('u_skyTexture'), 1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, skyTexture);

        gl.uniform1f(renderProgramWrapper.getUniformLocation('u_gridLength'), GRID_LENGTH);

        gl.uniform3fv(renderProgramWrapper.getUniformLocation('u_cameraPosition'), camera.getPosition());

        gl.uniformMatrix4fv(renderProgramWrapper.getUniformLocation('u_projectionMatrix'), false, projectionMatrix);
        gl.uniformMatrix4fv(renderProgramWrapper.getUniformLocation('u_viewMatrix'), false, camera.getViewMatrix());

        gl.bindBuffer(gl.ARRAY_BUFFER, quadVertexBuffer);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.useProgram(snowProgramWrapper.getProgram());

        gl.uniform1i(snowProgramWrapper.getUniformLocation("u_texture"), 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, snowTexture);

        gl.uniformMatrix4fv(snowProgramWrapper.getUniformLocation('u_projectionMatrix'), false, projectionMatrix);
        gl.uniformMatrix4fv(snowProgramWrapper.getUniformLocation('u_viewMatrix'), false, camera.getViewMatrix());

        gl.bindBuffer(gl.ARRAY_BUFFER, snowVertexBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.drawArrays(gl.POINTS, 0, SNOW_COUNT);

        gl.disable(gl.BLEND);
        

        requestAnimationFrame(update);

    };

    var onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (window.innerWidth / DESIRED_ASPECT < window.innerHeight) { //too tall
            makePerspectiveMatrix(projectionMatrix, (FOV / 180) * Math.PI, window.innerWidth / window.innerHeight, NEAR, FAR);
        } else { //too wide
            var desiredHorizontalAspect = (FOV / 180) * Math.PI * DESIRED_ASPECT;
            makePerspectiveMatrix(projectionMatrix, desiredHorizontalAspect * window.innerHeight / window.innerWidth, window.innerWidth / window.innerHeight, 0.01, 100.0);
        }
    };
    window.addEventListener('resize', onresize);

    onresize();

    update();
}

var snowImageLoaded = false;
var skyImageLoaded = false;

var skyImage = new Image();
skyImage.onload = function () {
    skyImageLoaded = true;
    if (snowImageLoaded) {
        main(skyImage, snowImage);
    }
};
skyImage.src = 'sky.jpg';

var snowImage = new Image();
snowImage.onload = function () {
    snowImageLoaded = true;
    if (skyImageLoaded) {
        main(skyImage, snowImage);
    }
};
snowImage.src = 'snow.png';