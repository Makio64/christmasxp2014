datas = require( "data.json" ).experiments

class Preview

    constructor: ->
        @_dom = document.querySelector ".preview"
        @_domTitle = @_dom.querySelector ".preview-title"
        @_domAuthor = @_dom.querySelector ".preview-author"

    update: ( idx ) ->
        data = datas[ idx ]
        @_domTitle.innerHTML = if data.isAvailable then data.title else "NOT RELEASED YET"
        @_domAuthor.innerHTML = data.author

    show: ->
        TweenLite.to @_dom, .5,
            css:
                autoAlpha: 1
            ease: Cubic.easeInOut

    hide: ->
        TweenLite.to @_dom, .5,
            css:
                autoAlpha: 0
            ease: Cubic.easeInOut


module.exports = Preview
