interactions = require "common/interactions"
Preview = require "experiments/Preview"

class Menu

    constructor: ->
        @_preview = new Preview

        @_domCnt = document.querySelector ".menu"
        @_domItems = document.querySelectorAll ".menu-item"
        @_domItemActivated = document.querySelector ".menu-item-activated"
        for domItem in @_domItems
            interactions.on domItem, "click", @_onClick 
            domItem.addEventListener "mouseenter", @_onOver, false
            domItem.addEventListener "mouseleave", @_onOut, false
    
    _onClick: ( e ) =>
        e.preventDefault()
        idx = @_indexOf e.currentTarget
        if idx == -1
            page( "/experiments/404" )
            return
        page( "/experiments/#{idx + 1}" )
        @_preview.hide()

    _onOver: ( e ) =>
        @_preview.update @_indexOf e.currentTarget
        @_preview.show()

    _onOut: ( e ) =>
        @_preview.hide()

    update: ( idx ) ->
        @_domSelected.classList.remove "activated" if @_domSelected
        @_domSelected = @_domItems[ idx - 1 ].querySelector "a"
        @_domSelected.classList.add "activated"

        @_domCnt.removeChild @_domItemActivated
        @_domCnt.insertBefore @_domItemActivated, @_domItems[ idx - 1 ]

    _indexOf: ( target ) ->
        for domItem, i in @_domItems
            return i if domItem == target
        -1

module.exports = Menu
