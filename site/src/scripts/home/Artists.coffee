interactions = require "common/interactions"
nav = require "common/nav"
IceAnim = require "common/anim/IceAnim"

class Artists

    constructor: ->
        @dom = document.querySelector ".artists"
        @domNoMobile = @dom.querySelector ".artists-content.no-mobile"

        @_domEntries = @domNoMobile.querySelector ".artists-entries"
        @_domEntriesHolder = @domNoMobile.querySelector ".artists-entries-holder"
        @_domEntriesItems = @domNoMobile.querySelectorAll ".artists-entry"
        @_domEntriesHolders = @domNoMobile.querySelectorAll ".artists-entry-holder"
        @_domBtClose = @domNoMobile.querySelector ".bt-close-holder"

        @_countEntries = @_domEntriesItems.length
        @dom.addEventListener "mousewheel", @_onMouseWheel, false
        if interactions.isTouchDevice
            interactions.on @_domEntries, "down", @_onDragStart, false
        @_py = 0
        @_pyCurrent = 0
        @_yMaxRelative = Math.ceil( @_countEntries / 6 ) + 2
        @_yMax = -@_yMaxRelative * ( document.body.offsetHeight * .5 ) >> 0
        @_lastY = 0

        @_idRaf = -1

        interactions.on @_domBtClose, "click", @_onBtClose

        window.addEventListener "resize", @_onResize, false

    _onDragStart: ( e ) =>
        if ( window.innerWidth <= 640 ) then return
        e.preventDefault() 
        @_lastY = e.y
        interactions.on @_domEntries, "move", @_onDragMove, false
        interactions.on @_domEntries, "up", @_onDragStop, false

    _onDragMove: ( e ) =>
        e.preventDefault()
        dy = e.y - @_lastY
        @_py += dy
        @_lastY = e.y
        @_onEntriesScroll()

    _onDragStop: ( e ) =>
        e.preventDefault()
        interactions.off @_domEntries, "move", @_onDragMove, false
        interactions.off @_domEntries, "up", @_onDragStop, false

    _onMouseWheel: ( e ) =>
        @_py += e.wheelDeltaY
        @_onEntriesScroll()

    _onEntriesScroll: ->
        @_py = 0 if @_py > 0
        @_py = @_yMax if @_py < @_yMax
        # TweenLite.to @_domEntries, .25, { css: { y: @_py, force3D: true } }

    _onResize: ( e ) =>
        h = document.body.offsetHeight
        @_yMax = -@_yMaxRelative * ( h * .5 ) >> 0
        @_onEntriesScroll()

    _onBtClose: ( e ) ->
        e.preventDefault()
        nav.set ""

    show: ->
        @dom.style.display = "block"

        @_py = 0
        @_pyCurrent = 0
        TweenLite.set @_domEntries, { css: { y: 0, force3D: true } }

        @_iceAnim = new IceAnim @dom, @dom.offsetWidth, @dom.offsetHeight
        @_iceAnim.show .1
        # return

        domEntriesHolders = document.querySelectorAll ".artists-entry"
        domInfos = document.querySelectorAll ".artists-infos"

        d = 0
        for dom in domInfos
            TweenLite.set dom,
                css:
                    alpha: 0
                    y: 50
                    # force3D: true
            TweenLite.to dom, .1,
                delay: .15 + d
                css:
                    alpha: .325
                    y: 35
                    # force3D: true
                ease: Quad.easeIn
            TweenLite.to dom, .25,
                delay: .15 + .1 + d
                css:
                    alpha: 1
                    y: 0
                    # force3D: true
                ease: Quart.easeOut
            d += .05

        d = 0
        dAdd = .05
        for dom in domEntriesHolders
            idx = @_getIndex dom
            if idx > 6
                d = 0
                dAdd = .05
                continue
            TweenLite.set dom,
                css:
                    alpha: 0
                    y: 50
                    # force3D: true
            TweenLite.to dom, .1,
                delay: .1 + d
                css:
                    alpha: .325
                    y: 35
                    # force3D: true
                ease: Quad.easeIn
            TweenLite.to dom, .25,
                delay: .1 + .1 + d
                css:
                    alpha: 1
                    y: 0
                    # force3D: true
                ease: Quart.easeOut

            d += dAdd
            dAdd *= .9
            dAdd = .025 if dAdd < .025

        @_idTimeout = setTimeout @_update, 500

    _update: =>
        @_pyCurrent += ( @_py - @_pyCurrent ) * .1
        TweenLite.set @_domEntries, { css: { y: @_pyCurrent } }
        @_idRaf = requestAnimationFrame @_update

    _getIndex: ( node ) ->
        i = 1
        while node = node.previousElementSibling
            if node.nodeType == 1
                i++
        i

    hide: ->
        clearTimeout @_idTimeout
        cancelAnimationFrame @_idRaf
        done @_iceAnim.hide() * 1000, =>
            @dom.style.display = "none"
            @_iceAnim.dispose()

module.exports = Artists
