interactions = require "common/interactions"
nav = require "common/nav"
IceAnim = require "common/anim/IceAnim"

class About

    constructor: ->
        @dom = document.querySelector ".about"

        @_domBtClose = @dom.querySelector ".bt-close-holder"

        interactions.on @_domBtClose, "click", @_onBtClose

    _onBtClose: ( e ) ->
        e.preventDefault()
        nav.set ""

    show: ->
        @dom.style.display = "block"

        @_iceAnim = new IceAnim @dom, @dom.offsetWidth, @dom.offsetHeight
        @_iceAnim.show .1

        domInfos = document.querySelectorAll ".about-infos"
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

module.exports = About
