interactions = require "common/interactions"
nav = require "common/nav"
IceAnim = require "common/anim/IceAnim"
Credits = require "home/Credits"

class Menu

    constructor: ->
        @dom = document.querySelector ".menu"

        @_credits = new Credits

        @_domMenuLight = document.querySelector ".menu--light"
        @_menuLightVisible = false

        @_domBtsArtists = document.querySelectorAll ".menu-entry--artists a"
        @_domBtsAbout = document.querySelectorAll ".menu-entry--about a"
        @_domBtsCredits = document.querySelectorAll ".menu-subentry--credits a"

        interactions.on domBtArtists, "click", @_onBtArtists for domBtArtists in @_domBtsArtists
        interactions.on domBtAbout, "click", @_onBtAbout for domBtAbout in @_domBtsAbout
        interactions.on domBtCredits, "click", @_onBtCredits for domBtCredits in @_domBtsCredits

        nav.on "change", @_onNavChange

    _onBtArtists: ( e ) =>
        e.preventDefault()
        nav.set "artists"

    _onBtAbout: ( e ) =>
        e.preventDefault()
        nav.set "about"

    _onBtCredits: ( e ) =>
        e.preventDefault()
        @_credits.show()

    _onNavChange: ( id ) =>
        if id != "" && id != "credits"
            if id == "artists"
                @_activate ".menu-entry--artists"
            else
                @_activate ".menu-entry--about"
            @_showMenuLight()
        else
            @_hideMenuLight()

    _activate: ( c ) ->
        @_deactivate()
        for dom in @_domMenuLight.querySelectorAll c
            dom.classList.add "activated"

    _deactivate: ->
        dom.classList.remove "activated" for dom in @_domMenuLight.querySelectorAll ".activated"

    _showMenuLight: ->
        return if @_menuLightVisible
        @_menuLightVisible = true

        @_domMenuLight.style.display = "block"

        @_iceAnim = new IceAnim @_domMenuLight, @dom.offsetWidth, @dom.offsetHeight
        @_iceAnim.show()

    _hideMenuLight: ->
        return if !@_menuLightVisible
        @_menuLightVisible = false

        done @_iceAnim.hide( .15 ) * 1000, =>
            @_domMenuLight.style.display = "none"
            @_iceAnim.dispose()

module.exports = Menu
