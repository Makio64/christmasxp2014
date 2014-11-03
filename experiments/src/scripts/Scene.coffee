Globe = require "globe/Globe"

class Scene

    constructor: ( @dom ) ->
        @_size = 600

        @_create()
        @_createPostProcessing()
        @_createLight()
        @_createGlobe()

    _create: ->
        @scene = new THREE.Scene
        @camera = new THREE.PerspectiveCamera 25, @_size / @_size, 0.1, 1000
        @camera.position.z = 25

        @renderer = new THREE.WebGLRenderer { alpha: true }
        @renderer.setSize @_size, @_size

        @dom.appendChild @renderer.domElement

    _createPostProcessing: ->
        renderTarget = new THREE.WebGLRenderTarget @_size * 2, @_size * 2,
            minFilter: THREE.LinearFilter
            magFilter: THREE.LinearFilter
            format: THREE.RGBAFormat
            stencilBuffer: false

        @_composer = new THREE.EffectComposer @renderer, renderTarget

        pass = new THREE.RenderPass @scene, @camera
        @_composer.addPass pass

        THREE.FXAAShader.uniforms.resolution.value.x = 1 / @_size / window.devicePixelRatio
        THREE.FXAAShader.uniforms.resolution.value.y = 1 / @_size / window.devicePixelRatio

        pass = new THREE.ShaderPass THREE.FXAAShader
        pass.renderToScreen = true
        @_composer.addPass pass

    _createLight: ->
        @_light = new THREE.AmbientLight 0x404040
        @_light.intensity = .75
        @scene.add @_light

        @_lightPoint = new THREE.PointLight 0xeeeeee
        @_lightPoint.position.z = 1000
        @scene.add @_lightPoint

        spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 100, 100, 10 );
        @scene.add( spotLight );

        spotLight = new THREE.SpotLight( 0x000000 );
        spotLight.position.set( -100, -100, -10 );
        @scene.add( spotLight );

    _createGlobe: ->
        @_globe = new Globe
        @scene.add @_globe

    rotate: ( mx, my ) ->
        @_globe.rotate mx, my

    update: ->
        @_globe.update()
        # @renderer.render @scene, @camera

        @_composer.render()        

module.exports = Scene
