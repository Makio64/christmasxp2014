class Loading extends Emitter

    constructor: ->
        super

        @dom = document.querySelector ".loading"
        @_domPercent = document.querySelector ".loading-percent"

        @_percent = 0 # @_percent is between 0 and 1
        @percent = 0

    start: ->
        TweenLite.to @, 1,
            _percent: 1
            onUpdate: @_updatePercent
            ease: Linear.easeNone

    _updatePercent: =>
        @percent = @_percent * 24 >> 0
        if @percent < 10
            @_domPercent.innerHTML = "0" + @percent
        else
            @_domPercent.innerHTML = @percent
        if @_percent == 1
            @_onComplete()

    _onComplete: ->
        @emit "complete"

    hide: ->
        duration = .5

        TweenLite.to @dom, duration,
            css: 
                alpha: 0

        done duration * .5 * 1000

    dispose: ->
        console.log "dispose"
        document.body.removeChild @dom

module.exports = Loading
