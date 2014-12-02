interactions = require "common/interactions"

class Infos

    constructor: ->
        @_dom = document.querySelector ".infos"
        @_domLayer = document.querySelector ".infos-layer"
        @_domBtOpen = document.querySelector ".experiment-nav-entry--infos"
        @_domBtClose = @_dom.querySelector ".bt-close-holder"
        interactions.on @_domBtOpen, "click", @_onOpen
        interactions.on @_domBtClose, "click", @_onClose
        interactions.on @_dom, "mouseleave", @_onClose

        @_domIdx = document.querySelector ".infos-idx"
        @_domTitle = document.querySelector ".infos-title"
        @_domAuthor = document.querySelector ".infos-author"
        @_domSubtitle = document.querySelector ".infos-subtitle"
        @_domDesc = document.querySelector ".infos-desc"
        @_domParts = document.querySelector ".infos-parts"

        @_domExperiment = document.querySelector ".experiment"

    _onOpen: ( e ) =>
        e.preventDefault()
        @show()

    _onClose: ( e ) =>
        e.preventDefault()
        @hide()

    update: ( data ) ->
        if data.idx < 10
            @_domIdx.innerHTML = "0" + data.idx
        else 
            @_domIdx.innerHTML = data.idx
        @_domTitle.innerHTML = data.title
        @_domAuthor.innerHTML = data.author
        @_domAuthor.href = data.site
        @_domSubtitle.innerHTML = data.subtitle
        @_domDesc.innerHTML = data.desc

        @_domParts.removeChild @_domParts.firstChild while @_domParts.firstChild

        fragment = document.createDocumentFragment()
        for detail in data.details
            dom = document.createElement "li"
            domTitle = document.createElement "h3"
            domTitle.innerHTML = detail.title
            dom.appendChild domTitle
            domDesc = document.createElement "span"
            domDesc.innerHTML = detail.desc
            dom.appendChild domDesc
            fragment.appendChild dom

        @_domParts.appendChild fragment

    show: ->
        TweenLite.to @_dom, .5,
            css:
                x: 360
                force3D: true
            ease: Cubic.easeInOut

        TweenLite.to @_domExperiment, .5,
            css:
                x: 230
                force3D: true
            ease: Cubic.easeInOut

        TweenLite.to @_domLayer, .5,
            css:
                autoAlpha: .5
                force3D: true
            ease: Cubic.easeInOut

    hide: ->
        TweenLite.to @_dom, .5,
            css:
                x: 0
                force3D: true
            ease: Cubic.easeInOut

        TweenLite.to @_domExperiment, .5,
            css:
                x: 0
                force3D: true
            ease: Cubic.easeInOut

        TweenLite.to @_domLayer, .5,
            css:
                autoAlpha: 0
                force3D: true
            ease: Cubic.easeInOut


module.exports = Infos
