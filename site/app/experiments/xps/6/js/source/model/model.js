/**
 * Created by hector.arellano on 10/2/14.
 */

define(['shaderLoader']);

var Model = function(forceFullFloat, evalMode) {

    //Fixed window size to evaluate textures
    this.evalMode = evalMode;

    //Indexes for the marching cubes
    this.ti4 = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,9,-1,-1,-1,-1,-1,-1,10,1,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,0,1,2,10,-1,-1,-1,-1,-1,-1,9,0,2,9,2,10,-1,-1,-1,-1,-1,-1,3,2,8,2,10,8,8,10,9,-1,-1,-1,11,2,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,2,0,11,0,8,-1,-1,-1,-1,-1,-1,11,2,3,0,1,9,-1,-1,-1,-1,-1,-1,2,1,11,1,9,11,11,9,8,-1,-1,-1,10,1,3,10,3,11,-1,-1,-1,-1,-1,-1,1,0,10,0,8,10,10,8,11,-1,-1,-1,0,3,9,3,11,9,9,11,10,-1,-1,-1,8,10,9,8,11,10,-1,-1,-1,-1,-1,-1,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,4,3,4,7,-1,-1,-1,-1,-1,-1,1,9,0,8,4,7,-1,-1,-1,-1,-1,-1,9,4,1,4,7,1,1,7,3,-1,-1,-1,10,1,2,8,4,7,-1,-1,-1,-1,-1,-1,2,10,1,0,4,7,0,7,3,-1,-1,-1,4,7,8,0,2,10,0,10,9,-1,-1,-1,2,7,3,2,9,7,7,9,4,2,10,9,2,3,11,7,8,4,-1,-1,-1,-1,-1,-1,7,11,4,11,2,4,4,2,0,-1,-1,-1,3,11,2,4,7,8,9,0,1,-1,-1,-1,2,7,11,2,1,7,1,4,7,1,9,4,8,4,7,11,10,1,11,1,3,-1,-1,-1,11,4,7,1,4,11,1,11,10,1,0,4,3,8,0,7,11,4,11,9,4,11,10,9,7,11,4,4,11,9,11,10,9,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,4,9,5,-1,-1,-1,-1,-1,-1,5,4,0,5,0,1,-1,-1,-1,-1,-1,-1,4,8,5,8,3,5,5,3,1,-1,-1,-1,2,10,1,9,5,4,-1,-1,-1,-1,-1,-1,0,8,3,5,4,9,10,1,2,-1,-1,-1,10,5,2,5,4,2,2,4,0,-1,-1,-1,3,4,8,3,2,4,2,5,4,2,10,5,11,2,3,9,5,4,-1,-1,-1,-1,-1,-1,9,5,4,8,11,2,8,2,0,-1,-1,-1,3,11,2,1,5,4,1,4,0,-1,-1,-1,8,5,4,2,5,8,2,8,11,2,1,5,5,4,9,1,3,11,1,11,10,-1,-1,-1,0,9,1,4,8,5,8,10,5,8,11,10,3,4,0,3,10,4,4,10,5,3,11,10,4,8,5,5,8,10,8,11,10,-1,-1,-1,9,5,7,9,7,8,-1,-1,-1,-1,-1,-1,0,9,3,9,5,3,3,5,7,-1,-1,-1,8,0,7,0,1,7,7,1,5,-1,-1,-1,1,7,3,1,5,7,-1,-1,-1,-1,-1,-1,1,2,10,5,7,8,5,8,9,-1,-1,-1,9,1,0,10,5,2,5,3,2,5,7,3,5,2,10,8,2,5,8,5,7,8,0,2,10,5,2,2,5,3,5,7,3,-1,-1,-1,11,2,3,8,9,5,8,5,7,-1,-1,-1,9,2,0,9,7,2,2,7,11,9,5,7,0,3,8,2,1,11,1,7,11,1,5,7,2,1,11,11,1,7,1,5,7,-1,-1,-1,3,9,1,3,8,9,7,11,10,7,10,5,9,1,0,10,7,11,10,5,7,-1,-1,-1,3,8,0,7,10,5,7,11,10,-1,-1,-1,11,5,7,11,10,5,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,0,10,6,5,-1,-1,-1,-1,-1,-1,0,1,9,5,10,6,-1,-1,-1,-1,-1,-1,10,6,5,9,8,3,9,3,1,-1,-1,-1,1,2,6,1,6,5,-1,-1,-1,-1,-1,-1,0,8,3,2,6,5,2,5,1,-1,-1,-1,5,9,6,9,0,6,6,0,2,-1,-1,-1,9,6,5,3,6,9,3,9,8,3,2,6,3,11,2,10,6,5,-1,-1,-1,-1,-1,-1,6,5,10,2,0,8,2,8,11,-1,-1,-1,1,9,0,6,5,10,11,2,3,-1,-1,-1,1,10,2,5,9,6,9,11,6,9,8,11,11,6,3,6,5,3,3,5,1,-1,-1,-1,0,5,1,0,11,5,5,11,6,0,8,11,0,5,9,0,3,5,3,6,5,3,11,6,5,9,6,6,9,11,9,8,11,-1,-1,-1,10,6,5,4,7,8,-1,-1,-1,-1,-1,-1,5,10,6,7,3,0,7,0,4,-1,-1,-1,5,10,6,0,1,9,8,4,7,-1,-1,-1,4,5,9,6,7,10,7,1,10,7,3,1,7,8,4,5,1,2,5,2,6,-1,-1,-1,4,1,0,4,5,1,6,7,3,6,3,2,9,4,5,8,0,7,0,6,7,0,2,6,4,5,9,6,3,2,6,7,3,-1,-1,-1,7,8,4,2,3,11,10,6,5,-1,-1,-1,11,6,7,10,2,5,2,4,5,2,0,4,11,6,7,8,0,3,1,10,2,9,4,5,6,7,11,1,10,2,9,4,5,-1,-1,-1,6,7,11,4,5,8,5,3,8,5,1,3,6,7,11,4,1,0,4,5,1,-1,-1,-1,4,5,9,3,8,0,11,6,7,-1,-1,-1,9,4,5,7,11,6,-1,-1,-1,-1,-1,-1,10,6,4,10,4,9,-1,-1,-1,-1,-1,-1,8,3,0,9,10,6,9,6,4,-1,-1,-1,1,10,0,10,6,0,0,6,4,-1,-1,-1,8,6,4,8,1,6,6,1,10,8,3,1,9,1,4,1,2,4,4,2,6,-1,-1,-1,1,0,9,3,2,8,2,4,8,2,6,4,2,4,0,2,6,4,-1,-1,-1,-1,-1,-1,3,2,8,8,2,4,2,6,4,-1,-1,-1,2,3,11,6,4,9,6,9,10,-1,-1,-1,0,10,2,0,9,10,4,8,11,4,11,6,10,2,1,11,6,3,6,0,3,6,4,0,10,2,1,11,4,8,11,6,4,-1,-1,-1,1,4,9,11,4,1,11,1,3,11,6,4,0,9,1,4,11,6,4,8,11,-1,-1,-1,11,6,3,3,6,0,6,4,0,-1,-1,-1,8,6,4,8,11,6,-1,-1,-1,-1,-1,-1,6,7,10,7,8,10,10,8,9,-1,-1,-1,9,3,0,6,3,9,6,9,10,6,7,3,6,1,10,6,7,1,7,0,1,7,8,0,6,7,10,10,7,1,7,3,1,-1,-1,-1,7,2,6,7,9,2,2,9,1,7,8,9,1,0,9,3,6,7,3,2,6,-1,-1,-1,8,0,7,7,0,6,0,2,6,-1,-1,-1,2,7,3,2,6,7,-1,-1,-1,-1,-1,-1,7,11,6,3,8,2,8,10,2,8,9,10,11,6,7,10,0,9,10,2,0,-1,-1,-1,2,1,10,7,11,6,8,0,3,-1,-1,-1,1,10,2,6,7,11,-1,-1,-1,-1,-1,-1,7,11,6,3,9,1,3,8,9,-1,-1,-1,9,1,0,11,6,7,-1,-1,-1,-1,-1,-1,0,3,8,11,6,7,-1,-1,-1,-1,-1,-1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,11,7,6,-1,-1,-1,-1,-1,-1,9,0,1,11,7,6,-1,-1,-1,-1,-1,-1,7,6,11,3,1,9,3,9,8,-1,-1,-1,1,2,10,6,11,7,-1,-1,-1,-1,-1,-1,2,10,1,7,6,11,8,3,0,-1,-1,-1,11,7,6,10,9,0,10,0,2,-1,-1,-1,7,6,11,3,2,8,8,2,10,8,10,9,2,3,7,2,7,6,-1,-1,-1,-1,-1,-1,8,7,0,7,6,0,0,6,2,-1,-1,-1,1,9,0,3,7,6,3,6,2,-1,-1,-1,7,6,2,7,2,9,2,1,9,7,9,8,6,10,7,10,1,7,7,1,3,-1,-1,-1,6,10,1,6,1,7,7,1,0,7,0,8,9,0,3,6,9,3,6,10,9,6,3,7,6,10,7,7,10,8,10,9,8,-1,-1,-1,8,4,6,8,6,11,-1,-1,-1,-1,-1,-1,11,3,6,3,0,6,6,0,4,-1,-1,-1,0,1,9,4,6,11,4,11,8,-1,-1,-1,1,9,4,11,1,4,11,3,1,11,4,6,10,1,2,11,8,4,11,4,6,-1,-1,-1,10,1,2,11,3,6,6,3,0,6,0,4,0,2,10,0,10,9,4,11,8,4,6,11,2,11,3,6,9,4,6,10,9,-1,-1,-1,3,8,2,8,4,2,2,4,6,-1,-1,-1,2,0,4,2,4,6,-1,-1,-1,-1,-1,-1,1,9,0,3,8,2,2,8,4,2,4,6,9,4,1,1,4,2,4,6,2,-1,-1,-1,8,4,6,8,6,1,6,10,1,8,1,3,1,0,10,10,0,6,0,4,6,-1,-1,-1,8,0,3,9,6,10,9,4,6,-1,-1,-1,10,4,6,10,9,4,-1,-1,-1,-1,-1,-1,9,5,4,7,6,11,-1,-1,-1,-1,-1,-1,4,9,5,3,0,8,11,7,6,-1,-1,-1,6,11,7,4,0,1,4,1,5,-1,-1,-1,6,11,7,4,8,5,5,8,3,5,3,1,6,11,7,1,2,10,9,5,4,-1,-1,-1,11,7,6,8,3,0,1,2,10,9,5,4,11,7,6,10,5,2,2,5,4,2,4,0,7,4,8,2,11,3,10,5,6,-1,-1,-1,4,9,5,6,2,3,6,3,7,-1,-1,-1,9,5,4,8,7,0,0,7,6,0,6,2,4,0,1,4,1,5,6,3,7,6,2,3,7,4,8,5,2,1,5,6,2,-1,-1,-1,4,9,5,6,10,7,7,10,1,7,1,3,5,6,10,0,9,1,8,7,4,-1,-1,-1,5,6,10,7,0,3,7,4,0,-1,-1,-1,10,5,6,4,8,7,-1,-1,-1,-1,-1,-1,5,6,9,6,11,9,9,11,8,-1,-1,-1,0,9,5,0,5,3,3,5,6,3,6,11,0,1,5,0,5,11,5,6,11,0,11,8,11,3,6,6,3,5,3,1,5,-1,-1,-1,1,2,10,5,6,9,9,6,11,9,11,8,1,0,9,6,10,5,11,3,2,-1,-1,-1,6,10,5,2,8,0,2,11,8,-1,-1,-1,3,2,11,10,5,6,-1,-1,-1,-1,-1,-1,9,5,6,3,9,6,3,8,9,3,6,2,5,6,9,9,6,0,6,2,0,-1,-1,-1,0,3,8,2,5,6,2,1,5,-1,-1,-1,1,6,2,1,5,6,-1,-1,-1,-1,-1,-1,10,5,6,9,3,8,9,1,3,-1,-1,-1,0,9,1,5,6,10,-1,-1,-1,-1,-1,-1,8,0,3,10,5,6,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,7,5,11,5,10,-1,-1,-1,-1,-1,-1,3,0,8,7,5,10,7,10,11,-1,-1,-1,9,0,1,10,11,7,10,7,5,-1,-1,-1,3,1,9,3,9,8,7,10,11,7,5,10,2,11,1,11,7,1,1,7,5,-1,-1,-1,0,8,3,2,11,1,1,11,7,1,7,5,9,0,2,9,2,7,2,11,7,9,7,5,11,3,2,8,5,9,8,7,5,-1,-1,-1,10,2,5,2,3,5,5,3,7,-1,-1,-1,5,10,2,8,5,2,8,7,5,8,2,0,9,0,1,10,2,5,5,2,3,5,3,7,1,10,2,5,8,7,5,9,8,-1,-1,-1,1,3,7,1,7,5,-1,-1,-1,-1,-1,-1,8,7,0,0,7,1,7,5,1,-1,-1,-1,0,3,9,9,3,5,3,7,5,-1,-1,-1,9,7,5,9,8,7,-1,-1,-1,-1,-1,-1,4,5,8,5,10,8,8,10,11,-1,-1,-1,3,0,4,3,4,10,4,5,10,3,10,11,0,1,9,4,5,8,8,5,10,8,10,11,5,9,4,1,11,3,1,10,11,-1,-1,-1,8,4,5,2,8,5,2,11,8,2,5,1,3,2,11,1,4,5,1,0,4,-1,-1,-1,9,4,5,8,2,11,8,0,2,-1,-1,-1,11,3,2,9,4,5,-1,-1,-1,-1,-1,-1,3,8,4,3,4,2,2,4,5,2,5,10,10,2,5,5,2,4,2,0,4,-1,-1,-1,0,3,8,5,9,4,10,2,1,-1,-1,-1,2,1,10,9,4,5,-1,-1,-1,-1,-1,-1,4,5,8,8,5,3,5,1,3,-1,-1,-1,5,0,4,5,1,0,-1,-1,-1,-1,-1,-1,3,8,0,4,5,9,-1,-1,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,4,11,4,9,11,11,9,10,-1,-1,-1,3,0,8,7,4,11,11,4,9,11,9,10,11,7,4,1,11,4,1,10,11,1,4,0,8,7,4,11,1,10,11,3,1,-1,-1,-1,2,11,7,2,7,1,1,7,4,1,4,9,3,2,11,4,8,7,9,1,0,-1,-1,-1,7,4,11,11,4,2,4,0,2,-1,-1,-1,2,11,3,7,4,8,-1,-1,-1,-1,-1,-1,2,3,7,2,7,9,7,4,9,2,9,10,4,8,7,0,10,2,0,9,10,-1,-1,-1,2,1,10,0,7,4,0,3,7,-1,-1,-1,10,2,1,8,7,4,-1,-1,-1,-1,-1,-1,9,1,4,4,1,7,1,3,7,-1,-1,-1,1,0,9,8,7,4,-1,-1,-1,-1,-1,-1,3,4,0,3,7,4,-1,-1,-1,-1,-1,-1,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,9,10,8,10,11,-1,-1,-1,-1,-1,-1,0,9,3,3,9,11,9,10,11,-1,-1,-1,1,10,0,0,10,8,10,11,8,-1,-1,-1,10,3,1,10,11,3,-1,-1,-1,-1,-1,-1,2,11,1,1,11,9,11,8,9,-1,-1,-1,11,3,2,0,9,1,-1,-1,-1,-1,-1,-1,11,0,2,11,8,0,-1,-1,-1,-1,-1,-1,11,3,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,8,2,2,8,10,8,9,10,-1,-1,-1,9,2,0,9,10,2,-1,-1,-1,-1,-1,-1,8,0,3,1,10,2,-1,-1,-1,-1,-1,-1,10,2,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,9,1,-1,-1,-1,-1,-1,-1,9,1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,0,3,-1,-1,-1,-1,-1,-1,-1,-1,-1];


    //Get the canvas for the 3D context
    this.canvas = document.getElementById("canvas3D");

    //Get the 3D context.
    try {
        this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        this.gl.viewportWidth = this.canvas.width;
        this.gl.viewportHeight = this.canvas.height;
    } catch (e) {
        alert("Sad world :( you have no webGL");
    }

    try {

        //Float extension
        if(forceFullFloat) {
            this.floatExt = this.gl.getExtension('OES_texture_float');
            this.ext = this.gl.FLOAT;
        } else {
            this.floatExt = this.gl.getExtension('OES_texture_half_float');
            this.ext = this.floatExt.HALF_FLOAT_OES;
        }
        
    }
    catch (e) {
        try {
            this.floatExt = this.gl.getExtension('OES_texture_half_float');
            this.ext = this.floatExt.HALF_FLOAT_OES;
        }
        catch (e) {
            alert("The FLOAT extension is not available");
        }
    }

    //initial positions texture
    this.positions = new Image();
    this.totalAssets = 0;

    this.programs = [];
    this.shaders = [
        ["vs-simplePlane", "fs-setTexture"],
        ["vs-initData", "fs-initData"],
        ["vs-index3D", "fs-medianData"],
        ["vs-index2D", "fs-density"],
        ["vs-index3D", "fs-mDensity"],
        ["vs-index2D", "fs-velocity"],
        ["vs-index2D", "fs-position"],
        ["vs-renderParticles", "fs-simpleColor"],
        ["vs-index3D", "fs-whiteColor"],
        ["vs-simplePlane", "fs-particleSizeZ"],
        ["vs-simplePlane", "fs-blurZ"],
        ["vs-simplePlane", "fs-blur2D"],
        ["vs-simplePlane", "fs-getCorners"],
        ["vs-simplePlane", "fs-marchCase"],
        ["vs-simplePlane", "fs-pyramid"],
        ["vs-simplePlane", "fs-pack"],
        ["vs-index2D-1D", "fs-parsePyramid"],
        ["vs-trianglesIndexes", "fs-simpleColor"],
        ["vs-index2D-1D", "fs-trianglePositionCreator"],
        ["vs-index3D-1D", "fs-trianglesToVoxels"],
        ["vs-render", "fs-renderColor"],
        ["vs-initData", "fs-noisePosition"],
        ["vs-simplePlane", "fs-comparator"],
        ["vs-lowResVoxels", "fs-simpleColor"],
        ["vs-simplePlane", "fs-upsample"],
        ["vs-index2D-1D", "fs-triangleNormalCreator"],
        ['vs-simplePlane', 'fs-simpleStar'],
        ['vs-simplePlane', 'fs-explosion'],
        ['vs-simplePlane', 'fs-clouds'],
        ["vs-simplePlane", "fs-lengthEvaluator"]


    ];

    //Shaders used for the 3d world
    this.textShaders = new ShaderLoader();
    this.textShaders.add('fs-blur2D', 'glsl/fs-blur2D.glsl');
    this.textShaders.add('fs-blurZ', 'glsl/fs-blurZ.glsl');
    this.textShaders.add('vs-blur2D', 'glsl/vs-blur2D.glsl');
    this.textShaders.add('fs-comparator', 'glsl/fs-comparator.glsl');
    this.textShaders.add('fs-density', 'glsl/fs-density.glsl');
    this.textShaders.add('fs-getCorners', 'glsl/fs-getCorners.glsl');
    this.textShaders.add('fs-initData', 'glsl/fs-initData.glsl');
    this.textShaders.add('fs-marchCase', 'glsl/fs-marchCase.glsl');
    this.textShaders.add('fs-mDensity', 'glsl/fs-mDensity.glsl');
    this.textShaders.add('fs-medianData', 'glsl/fs-medianData.glsl');
    this.textShaders.add('fs-noisePosition', 'glsl/fs-noisePosition.glsl');
    this.textShaders.add('fs-pack', 'glsl/fs-pack.glsl');
    this.textShaders.add('fs-parsePyramid', 'glsl/fs-parsePyramid.glsl');
    this.textShaders.add('fs-particleSizeZ', 'glsl/fs-particleSizeZ.glsl');
    this.textShaders.add('fs-position', 'glsl/fs-position.glsl');
    this.textShaders.add('fs-pyramid', 'glsl/fs-pyramid.glsl');
    this.textShaders.add('fs-renderColor', 'glsl/fs-renderColor.glsl');
    this.textShaders.add('fs-setTexture', 'glsl/fs-setTexture.glsl');
    this.textShaders.add('fs-simpleColor', 'glsl/fs-simpleColor.glsl');
    this.textShaders.add('fs-velocity', 'glsl/fs-velocity.glsl');
    this.textShaders.add('fs-whiteColor', 'glsl/fs-whiteColor.glsl');
    this.textShaders.add('vs-index2D', 'glsl/vs-index2D.glsl');
    this.textShaders.add('vs-index2D-1D', 'glsl/vs-index2D-1D.glsl');
    this.textShaders.add('vs-index3D', 'glsl/vs-index3D.glsl');
    this.textShaders.add('vs-index3D-1D', 'glsl/vs-index3D-1D.glsl');
    this.textShaders.add('vs-initData', 'glsl/vs-initData.glsl');
    this.textShaders.add('vs-initWithNoise', 'glsl/vs-initWithNoise.glsl');
    this.textShaders.add('vs-lowResVoxels', 'glsl/vs-lowResVoxels.glsl');
    this.textShaders.add('vs-render', 'glsl/vs-render.glsl');
    this.textShaders.add('vs-renderParticles', 'glsl/vs-renderParticles.glsl');
    this.textShaders.add('vs-simplePlane', 'glsl/vs-simplePlane.glsl');
    this.textShaders.add('fs-triangleNormalCreator', 'glsl/fs-triangleNormalCreator.glsl');
    this.textShaders.add('fs-trianglePositionCreator', 'glsl/fs-trianglePositionCreator.glsl');
    this.textShaders.add('vs-trianglesIndexes', 'glsl/vs-trianglesIndexes.glsl');
    this.textShaders.add('fs-trianglesToVoxels', 'glsl/fs-trianglesToVoxels.glsl');
    this.textShaders.add('fs-upsample', 'glsl/fs-upsample.glsl');
    this.textShaders.add('fs-simpleStar', 'glsl/fs-simpleStar.glsl');
    this.textShaders.add('fs-explosion', 'glsl/fs-explosion.glsl');
    this.textShaders.add('fs-clouds', 'glsl/fs-clouds.glsl');
    this.textShaders.add('fs-lengthEvaluator', 'glsl/fs-lengthEvaluator.glsl');


    //Event that allows to know the full load of the assets.
    this.assetsLoaded = new signals.Signal();

    //Read the shaders
    var callback = this.itemLoaded;
    this.textShaders.onLoaded(callback.bind(this));
    this.textShaders.load();

}

//function that loads the image.
Model.prototype.itemLoaded = function() {
    this.totalAssets ++;

    //Start parsing the shaders...
    if(this.totalAssets == 1) {
        for(var i = 0; i  < model.shaders.length; i++) {
            var vertexShader = this.getShader(this.textShaders.get(this.shaders[i][0]), 0);
            var fragmentShader = this.getShader(this.textShaders.get(this.shaders[i][1]), 1);
            this.programs[i] = this.gl.createProgram();
            this.gl.attachShader(this.programs[i], vertexShader);
            this.gl.attachShader(this.programs[i], fragmentShader);
            this.gl.linkProgram(this.programs[i]);
            if (!this.gl.getProgramParameter(this.programs[i], this.gl.LINK_STATUS)) {
                alert("Could not init shaders in the program number: " + String(i));
            }
            this.gl.getProgramInfoLog(this.programs[i]);
        }
        for(var i = 0; i < model.shaders.length; i++) this.initShader(i);

        this.assetsLoaded.dispatch();
    }
}

//Shader parser
Model.prototype.getShader = function(str, type) {
    var shader;
    if (type == 1) {
        shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    } else  {
        shader = this.gl.createShader(this.gl.VERTEX_SHADER);
    }
    this.gl.shaderSource(shader, str);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        alert(this.gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

//Shader initializar...
Model.prototype.initShader = function(n) {
    switch (n) {
        case 0:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].dataTexture = this.gl.getUniformLocation(this.programs[n], "uDT");
            break;
        case 1:
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].vertexData = this.gl.getAttribLocation(this.programs[n], "aVD");
            this.gl.enableVertexAttribArray(this.programs[n].vertexData);
            break;
        case 2:
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].positionTexture = this.gl.getUniformLocation(this.programs[n], "uPT");
            this.programs[n].dataTexture = this.gl.getUniformLocation(this.programs[n], "uDT");
            this.programs[n].alpha = this.gl.getUniformLocation(this.programs[n], "uAlpha");
            this.programs[n].particleSize = this.gl.getUniformLocation(this.programs[n], "uSize");
            break;
        case 3:
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].mass = this.gl.getUniformLocation(this.programs[n], "uMass");
            this.programs[n].positionTexture = this.gl.getUniformLocation(this.programs[n], "uPT");
            this.programs[n].medianPositionTexture = this.gl.getUniformLocation(this.programs[n], "uMPT");
            break;
        case 4:
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].positionTexture = this.gl.getUniformLocation(this.programs[n], "uPT");
            this.programs[n].densityTexture = this.gl.getUniformLocation(this.programs[n], "uDT");
            this.programs[n].particleSize = this.gl.getUniformLocation(this.programs[n], "uSize");
            break;
        case 5:
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].mass = this.gl.getUniformLocation(this.programs[n], "uMass");
            this.programs[n].k = this.gl.getUniformLocation(this.programs[n], "uK");
            this.programs[n].viscosity = this.gl.getUniformLocation(this.programs[n], "uViscosity");
            this.programs[n].dt = this.gl.getUniformLocation(this.programs[n], "uDeltaT");
            this.programs[n].positionTexture = this.gl.getUniformLocation(this.programs[n], "uPT");
            this.programs[n].velocityTexture = this.gl.getUniformLocation(this.programs[n], "uVT");
            this.programs[n].medianVelocityTexture = this.gl.getUniformLocation(this.programs[n], "uMVT");
            this.programs[n].medianPositionTexture = this.gl.getUniformLocation(this.programs[n], "uMPT");
            this.programs[n].minPress = this.gl.getUniformLocation(this.programs[n], "uMinPress");
            this.programs[n].gravity = this.gl.getUniformLocation(this.programs[n], "uGravity");
            this.programs[n].useBox = this.gl.getUniformLocation(this.programs[n], "uBox");
            break;
        case 6:
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].positionTexture = this.gl.getUniformLocation(this.programs[n], "uPT");
            this.programs[n].velocityTexture = this.gl.getUniformLocation(this.programs[n], "uVT");
            this.programs[n].dt = this.gl.getUniformLocation(this.programs[n], "uDeltaT");
            break;
        case 7:
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].intensity = this.gl.getUniformLocation(this.programs[n], "uIntensity");
            this.programs[n].particleSize = this.gl.getUniformLocation(this.programs[n], "uSize");
            this.programs[n].positionTexture = this.gl.getUniformLocation(this.programs[n], "uPT");
            this.programs[n].cameraMatrix = this.gl.getUniformLocation(this.programs[n], "uCameraMatrix");
            this.programs[n].perspectiveMatrix = this.gl.getUniformLocation(this.programs[n], "uPMatrix");
            break;
        case 8:
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].positionTexture = this.gl.getUniformLocation(this.programs[n], "uPT");
            this.programs[n].particleSize = this.gl.getUniformLocation(this.programs[n], "uSize");
            break;
        case 9:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].dataTexture = this.gl.getUniformLocation(this.programs[n], "uDT");
            break;
        case 10:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].dataTexture = this.gl.getUniformLocation(this.programs[n], "uDT");
            this.programs[n].spreadRange = this.gl.getUniformLocation(this.programs[n], "uSR");
            break;
        case 11:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].dataTexture = this.gl.getUniformLocation(this.programs[n], "uDT");
            this.programs[n].axis = this.gl.getUniformLocation(this.programs[n], "uAxis");
            this.programs[n].spreadRange = this.gl.getUniformLocation(this.programs[n], "uSR");
            break;
        case 12:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].dataTexture = this.gl.getUniformLocation(this.programs[n], "uDT");
            break;
        case 13:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].dataTexture = this.gl.getUniformLocation(this.programs[n], "uDT");
            this.programs[n].range = this.gl.getUniformLocation(this.programs[n], "uRange");
            break;
        case 14:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].potentialTexture = this.gl.getUniformLocation(this.programs[n], "uPyT");
            this.programs[n].size = this.gl.getUniformLocation(this.programs[n], "uSize");
            break;
        case 15:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].maxData = this.gl.getUniformLocation(this.programs[n], "uMax");
            this.programs[n].readPixelTexture = this.gl.getUniformLocation(this.programs[n], "uPyT");
            break;
        case 16:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].pyramid = this.gl.getUniformLocation(this.programs[n], "uPyramid");
            this.programs[n].base = this.gl.getUniformLocation(this.programs[n], "uBase");
            break;
        case 17:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            break;
        case 18:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].marchingTexture = this.gl.getUniformLocation(this.programs[n], "marchTex");
            this.programs[n].potentialTexture = this.gl.getUniformLocation(this.programs[n], "uPot");
            this.programs[n].tiTexture = this.gl.getUniformLocation(this.programs[n], "uTI");
            this.programs[n].range = this.gl.getUniformLocation(this.programs[n], "uRange");
            this.programs[n].limit = this.gl.getUniformLocation(this.programs[n], "uLimit");
            break;
        case 19:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].positionTexture = this.gl.getUniformLocation(this.programs[n], "uPT");
            break;
        case 20:
            this.programs[n].vertexRepet = this.gl.getAttribLocation(this.programs[n], "aVJ");
            this.gl.enableVertexAttribArray(this.programs[n].vertexRepet);
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].cameraMatrix = this.gl.getUniformLocation(this.programs[n], "uCameraMatrix");
            this.programs[n].perspectiveMatrix = this.gl.getUniformLocation(this.programs[n], "uPMatrix");
            this.programs[n].textureTriangles = this.gl.getUniformLocation(this.programs[n], "uTT");
            this.programs[n].textureNormals = this.gl.getUniformLocation(this.programs[n], "uTN");
            this.programs[n].enviroment = this.gl.getUniformLocation(this.programs[n], "uEnv");

            this.programs[n].iterations = this.gl.getUniformLocation(this.programs[n], "uMaxSteps");
            this.programs[n].bounces = this.gl.getUniformLocation(this.programs[n], "uBounces");
            this.programs[n].refract = this.gl.getUniformLocation(this.programs[n], "uRefract");
            this.programs[n].fresnellPower = this.gl.getUniformLocation(this.programs[n], 'uPow');
            this.programs[n].breakAtFirst = this.gl.getUniformLocation(this.programs[n], 'uBreakAtFirst');
            this.programs[n].materialColor = this.gl.getUniformLocation(this.programs[n], 'uColor');
            this.programs[n].useRefractColor = this.gl.getUniformLocation(this.programs[n], 'uUseRefractColor');
            this.programs[n].refractColor = this.gl.getUniformLocation(this.programs[n], 'uColorRefract');

            this.programs[n].potentialTextureLow = this.gl.getUniformLocation(this.programs[n], "uPotLow");
            this.programs[n].potentialTexture = this.gl.getUniformLocation(this.programs[n], "uPot");
            this.programs[n].transparency = this.gl.getUniformLocation(this.programs[n], "uTransparency");
            this.programs[n].eyeVector = this.gl.getUniformLocation(this.programs[n], "uEye");

            this.programs[n].explosion = this.gl.getUniformLocation(this.programs[n], 'uExplosion');
            break;
        case 21:
            this.programs[n].vertex2D = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2D);
            this.programs[n].vertexData = this.gl.getAttribLocation(this.programs[n], "aVD");
            this.gl.enableVertexAttribArray(this.programs[n].vertexData);
            this.programs[n].useRotation = this.gl.getUniformLocation(this.programs[n], "uSetRot");
            this.programs[n].positionTexture = this.gl.getUniformLocation(this.programs[n], "uPT");
            break;
        case 22:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].textureVertex1 = this.gl.getUniformLocation(this.programs[n], "uTV1");
            this.programs[n].textureVertex2 = this.gl.getUniformLocation(this.programs[n], "uTV2");
            this.programs[n].textureVertex3 = this.gl.getUniformLocation(this.programs[n], "uTV3");
            break;
        case 23:
            this.programs[n].vertex2D = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2D);
            this.programs[n].potentialTexture = this.gl.getUniformLocation(this.programs[n], "uPot");
            break;
        case 24:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].dataTexture = this.gl.getUniformLocation(this.programs[n], "uDT");
            this.programs[n].size = this.gl.getUniformLocation(this.programs[n], "uSize");
            break;
        case 25:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].vertex2DIndex = this.gl.getAttribLocation(this.programs[n], "aV2I");
            this.gl.enableVertexAttribArray(this.programs[n].vertex2DIndex);
            this.programs[n].marchingTexture = this.gl.getUniformLocation(this.programs[n], "marchTex");
            this.programs[n].potentialTexture = this.gl.getUniformLocation(this.programs[n], "uPot");
            this.programs[n].tiTexture = this.gl.getUniformLocation(this.programs[n], "uTI");
            this.programs[n].range = this.gl.getUniformLocation(this.programs[n], "uRange");
            this.programs[n].limit = this.gl.getUniformLocation(this.programs[n], "uLimit");
            break;
        case 26:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].scaler = this.gl.getUniformLocation(this.programs[n], "uScale");
            this.programs[n].width = this.gl.getUniformLocation(this.programs[n], "uWidth");
            break;
        case 27:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].size = this.gl.getUniformLocation(this.programs[n], "uSize");
            this.programs[n].radius = this.gl.getUniformLocation(this.programs[n], "uRatio");
            this.programs[n].noise = this.gl.getUniformLocation(this.programs[n], "uNoise");
            this.programs[n].star = this.gl.getUniformLocation(this.programs[n], "uStar");
            break;
        case 28:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].currentFrame = this.gl.getUniformLocation(this.programs[n], "uFrame");
            this.programs[n].noise = this.gl.getUniformLocation(this.programs[n], "uNoise");
            break;
        case 29:
            this.programs[n].vertexIndex = this.gl.getAttribLocation(this.programs[n], "aVI");
            this.gl.enableVertexAttribArray(this.programs[n].vertexIndex);
            this.programs[n].potentialTexture = this.gl.getUniformLocation(this.programs[n], "uPyT");
            this.programs[n].size = this.gl.getUniformLocation(this.programs[n], "uSize");
            break;
    }
}


