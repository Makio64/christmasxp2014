class XP

    constructor: ( @_data ) ->
        @_domCnt = document.querySelector ".experiment-holder"
        @_createXP()

    _createXP: ->
        @_domXP = document.createElement "div"
        @_domXP.classList.add "experiment-entry"

        if @_data.isAvailable
            if @_data.isWebGL 
                if window.WebGLRenderingContext
                    @_createIframe()
                else
                    @_createNoWebGL()
            else
                @_createIframe()
        else
            @_createNotReleased()

    _createIframe: ->
        dom = document.createElement "iframe"
        dom.src = "./xps/#{@_data.idx}/"
        @_domXP.appendChild dom

    _createNoWebGL: ->
        dom = document.querySelector( ".error.no-webgl" ).cloneNode true
        dom.classList.add "visible"
        @_domXP.appendChild dom

    _createNotReleased: ->
        dom = document.querySelector( ".not-released" ).cloneNode true
        dom.classList.add "visible"
        dom.querySelector( ".not-released-author" ).innerHTML = @_data.author
        @_domXP.appendChild dom

    show: ( animated = false ) ->
        if !animated
            @_domCnt.appendChild @_domXP
        else
            console.log document.body.offsetWidth
            TweenLite.set @_domXP,
                css:
                    x: -document.body.offsetWidth
                    force3D: true
            TweenLite.to @_domXP, .6,
                css:
                    x: 0
                    force3D: true
                ease: Cubic.easeInOut
            @_domCnt.appendChild @_domXP

    hide: ->
        TweenLite.to @_domXP, .6,
            css:
                x: document.body.offsetWidth
                force3D: true
            ease: Cubic.easeInOut
            onComplete: =>
                @_domCnt.removeChild @_domXP

module.exports = XP
