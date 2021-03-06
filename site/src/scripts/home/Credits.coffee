interactions = require "common/interactions"
nav = require "common/nav"

class Credits

    constructor: ->
        @dom = document.querySelector ".credits"
        @_domBtClose = @dom.querySelector ".bt-close-holder"

        @_domTitle = @dom.querySelector ".credits-title"
        @_domEntries = @dom.querySelectorAll ".credits-entry"

        interactions.on @_domBtClose, "click", @_onBtClose
        interactions.on @dom, "mouseleave", @_onBtClose

    _onBtClose: ( e ) =>
        e.preventDefault()
        @hide()

    show: ->
        if window.innerWidth <= 640

            @dom.style.display = 'block'

            if ( @_transitionTimer ) then clearInterval( @_transitionTimer )

            @_transitionTimer = setTimeout =>
              @dom.classList.add 'transitionIn'
            , 200

            return

        TweenLite.to @dom, .4,
            css:
                x: 198
            ease: Cubic.easeOut

        TweenLite.set @_domTitle,
            css:
                alpha: 0
                x: -50
        TweenLite.to @_domTitle, .1,
            delay: .05
            css:
                alpha: .4
                x: -30
            ease: Sine.easeIn
        TweenLite.to @_domTitle, .25,
            delay: .05 + .1
            css:
                alpha: 1
                x: 0
            ease: Back.easeOut
            easeParams: [ 1.25 ]

        d = .05 + .1
        dAdd = .05 * .9
        for dom in @_domEntries
            TweenLite.set dom,
                css:
                    alpha: 0
                    x: -50
                    force3D: true
            TweenLite.to dom, .1,
                delay: d
                css:
                    alpha: .4
                    x: -30
                    force3D: true
                ease: Sine.easeIn
            TweenLite.to dom, .25,
                delay: d + .1
                css:
                    alpha: 1
                    x: 0
                    force3D: true
                ease: Back.easeOut
                easeParams: [ 1.25 ]

            d += dAdd
            dAdd *= .9
            dAdd = .02 if dAdd < .02

    hide: ->
        if( window.innerWidth <= 640 )
            @dom.classList.remove 'transitionIn'

            if ( @_transitionTimer ) then clearInterval( @_transitionTimer )

            @_transitionTimer = setTimeout =>
              @dom.style.display = 'none'
            , 1300

            return
        duration = .25

        TweenLite.to @dom, duration,
            css:
                x: 0
            ease: Cubic.easeOut

        done duration * 1000

module.exports = Credits
