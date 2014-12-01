interactions = require "common/interactions"

class Menu

    constructor: ->
        @_domCnt = document.querySelector ".menu"
        @_domItems = document.querySelectorAll ".menu-item"
        @_domItemActivated = document.querySelector ".menu-item-activated"
        interactions.on domItem, "click", @_onClick for domItem in @_domItems

    _onClick: ( e ) =>
        e.preventDefault()
        idx = @_indexOf e.currentTarget
        if idx == -1
            page( "/experiments/404" )
            return
        page( "/experiments/#{idx + 1}" )

    update: ( idx ) ->
        @_domCnt.removeChild @_domItemActivated
        @_domCnt.insertBefore @_domItemActivated, @_domItems[ idx - 1 ]

    _indexOf: ( target ) ->
        for domItem, i in @_domItems
            return i if domItem == target
        -1

module.exports = Menu
