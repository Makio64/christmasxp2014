IceAnim = require "common/anim/IceAnim"
datas = require( "data.json" ).experiments

class TitleAnim

    constructor: ( @_node, idx ) ->
        @dom = document.querySelector ".home-details-cnt"
        @_w = 300
        @_h = 140

        data = datas[ idx ]
        day = idx
        if idx < 10
            day = "0" + day
        @_node.querySelector( ".home-details-day" ).innerHTML = day
        @_node.querySelector( ".home-details-title" ).innerHTML = data.title
        @_node.querySelector( ".home-details-author" ).innerHTML = data.author

    show: ->
        @dom.appendChild @_node
        TweenLite.set @_node, { css: { alpha: 0 } }
        TweenLite.to @_node, .25,
            css:
                alpha: 1

    hide: ->
        TweenLite.to @_node, .25,
            css:
                alpha: 0
            onComplete: =>
                console.log "yup"
                @dom.removeChild @_node

module.exports = TitleAnim
