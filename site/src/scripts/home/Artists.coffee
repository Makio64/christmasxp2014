interactions = require "common/interactions"
nav = require "common/nav"
IceAnim = require "common/anim/IceAnim"

class Artists

    constructor: ->
        @dom = document.querySelector ".artists"

        @_domEntries = document.querySelector ".artists-entries"
        @_domEntriesHolders = @dom.querySelectorAll ".artists-entry-holder"
        @_domBtClose = @dom.querySelector ".bt-close-holder"

        interactions.on @_domBtClose, "click", @_onBtClose

    _onBtClose: ( e ) ->
        e.preventDefault()
        nav.set ""

    show: ->
        @dom.style.display = "block"

        @_iceAnim = new IceAnim @dom, @dom.offsetWidth, @dom.offsetHeight
        @_iceAnim.show .1

        domEntriesHolders = document.querySelectorAll ".artists-entry"
        domInfos = document.querySelectorAll ".artists-infos"

        d = 0
        for dom in domInfos
            TweenLite.set dom,
                css:
                    alpha: 0
                    y: 50
                    force3D: true
            TweenLite.to dom, .1,
                delay: .15 + d
                css:
                    alpha: .325
                    y: 35
                    force3D: true
                ease: Quad.easeIn
            TweenLite.to dom, .25,
                delay: .15 + .1 + d
                css:
                    alpha: 1
                    y: 0
                    force3D: true
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
                    force3D: true
            TweenLite.to dom, .1,
                delay: .1 + d
                css:
                    alpha: .325
                    y: 35
                    force3D: true
                ease: Quad.easeIn
            TweenLite.to dom, .25,
                delay: .1 + .1 + d
                css:
                    alpha: 1
                    y: 0
                    force3D: true
                ease: Quart.easeOut

            d += dAdd
            dAdd *= .9
            dAdd = .025 if dAdd < .025

    _getIndex: ( node ) ->
        i = 1
        while node = node.previousElementSibling
            if node.nodeType == 1
                i++
        i

    hide: ->
        done @_iceAnim.hide() * 1000, =>
            @dom.style.display = "none"
            @_iceAnim.dispose()

module.exports = Artists
