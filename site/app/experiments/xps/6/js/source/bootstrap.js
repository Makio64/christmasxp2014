/**
 * Created by hector.arellano on 10/2/14.
 */

var model;
var view;
var controller;


define(['model', 'view', 'controller'], function() {
    return {
        initiate: function () {
            model = new Model(true);
            model.assetsLoaded.add(initMain);
        }
    }
})

//Function executed when the model is ready
function initMain() {
    model.assetsLoaded.remove(initMain);

    controller = new Controller(model);
    controller.reset.add(function() {view.reset()});

    view = new World3D(model, controller);

    window.onresize = resize;
    render();
}

//Render function.
function render() {
    requestAnimFrame(render);
    view.render();
}

//Funcion that controls the resize for each class
function resize(e) {
    view.resize(this.model.evalMode);
}


//Function to render the animation
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
        window.setTimeout(callback, 1000/60);
    };
})();
