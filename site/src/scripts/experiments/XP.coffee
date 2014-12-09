webGLDetector = require "common/webGLDetector"

class XP

    constructor: ( @_data ) ->
        @_domCnt = document.querySelector ".experiment-holder"
        @_createXP()
        window.onresize = ()=>
            w = window.innerWidth
            h = window.innerHeight
            if(w > 640)
                w -= 40
            if( isMobile.apple.device ) 
               w -= 1
               h -= 2
            @iframe.style.height = h + 'px'
            @iframe.style.width = w + 'px'
            @iframe.contentWindow.innerWidth = w
            @iframe.contentWindow.innerHeight = h
            @iframe.contentWindow.resizeTo(w,h)
            return

    _createXP: ->
        document.win
        @_domXP = document.createElement "div"
        @_domXP.classList.add "experiment-entry"

        if @_data.isAvailable
            @_createIframe()
        #     if @_data.isWebGL 
        #         if webGLDetector.isAvailable()
        #             @_createIframe()
        #         else
        #             @_createNoWebGL()
        #     else
        #         @_createIframe()
        else
            @_createNotReleased()

    _createIframe: ->
        @iframe = document.createElement "iframe"

        # Fix ios
        if( isMobile.apple.device ) 
            console.log(isMobile.apple.device.device)
            @iframe.addEventListener( 'load', ( event )->
                @iframe.contentWindow.innerWidth -= 1
                @iframe.contentWindow.innerHeight -= 2
            )

        @iframe.src = "./xps/#{@_data.idx}/"
        @_domXP.appendChild @iframe

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
