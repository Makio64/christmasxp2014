class WebGLDetector

    constructor: ->
        @_canvasDetector = document.createElement "canvas"
        @_isAvailable = @_check()

    _check: ->
        try
            return !!window.WebGLRenderingContext && ( @_canvasDetector.getContext( "webgl" ) || @_canvasDetector.getContext( "experimental-webgl" ) )
        catch e
            return false

    isAvailable: -> @_isAvailable

module.exports = new WebGLDetector
