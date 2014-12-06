/**
 * Created by hector.arellano on 10/3/14.
 */

require.config({
    paths: {
        //Path for the libraries
        stats: 'libs/stats/stats',
        datGui : 'libs/datGui/dat.gui',
        glMatrix: 'libs/glMatrix/glMatrix-0.9.5.min',

        //Paths for the fluid Typo code
        bootstrap: 'source/bootstrap',
        model: 'source/model/model',
        view: 'source/view/view',
        controller: 'source/controller/controller',
        shaderLoader: 'source/model/shaderLoader',
        camera: 'source/view/camera'
    }
});

require(['bootstrap'], function(bootstrap) {bootstrap.initiate();});