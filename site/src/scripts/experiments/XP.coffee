class XP

    constructor: ( @_data ) ->
        @_domCnt = document.querySelector ".experiment-iframe-holder"
        @_createIframe()

    _createIframe: ->
        @_domIframe = document.createElement "iframe"
        @_domIframe.src = "./#{@_data.idx}/"

    show: ( animated = false ) ->
        if !animated
            @_domCnt.appendChild @_domIframe
        else
            TweenLite.set @_domIframe,
                css:
                    x: -document.body.offsetWidth
                    force3D: true
            TweenLite.to @_domIframe, .6,
                css:
                    x: 0
                    force3D: true
                ease: Cubic.easeInOut
            @_domCnt.appendChild @_domIframe

    hide: ->
        TweenLite.to @_domIframe, .6,
            css:
                x: document.body.offsetWidth
                force3D: true
            ease: Cubic.easeInOut
            onComplete: =>
                @_domCnt.removeChild @_domIframe




module.exports = XP
