datas = require( "data.json" ).experiments

class Preview

    constructor: ->
        @_dom = document.querySelector ".preview"
        @_domTitle = @_dom.querySelector ".preview-title"
        @_domAuthor = @_dom.querySelector ".preview-author"
        @_domImage = @_dom.querySelector ".preview-image"

    update: ( idx ) ->
        data = datas[ idx ]
        @_domTitle.innerHTML = if data.isAvailable then data.title else "NOT RELEASED YET"
        @_domAuthor.innerHTML = data.author

        @_url = "/img/experiments/#{idx + 1}/preview.png"

        # @_image = new Image()
        # @_image.onload = @_onPreviewLoaded
        # @_image.src = @_url

    _onPreviewLoaded: =>
        console.log( "yo" );
        @_domImage.src = @_url

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
