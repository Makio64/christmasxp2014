interactions = require "common/interactions"
nav = require "common/nav"
IceAnim = require "common/anim/IceAnim"
Credits = require "home/Credits"

class Menu

    constructor:(@scene3d) ->
        @dom = document.querySelector ".menu"

        @_credits = new Credits

        @_domMenuLight = document.querySelector ".menu--light"
        @_menuLightVisible = false

        @gridActivate = false
        @_domBtsGrid = document.querySelectorAll ".gridButton"
        @_domBtsLogo = document.querySelectorAll ".menu-top"
        @_domBtsArtists = document.querySelectorAll ".menu-entry--artists a"
        @_domBtsAbout = document.querySelectorAll ".menu-entry--about a"
        @_domBtsCredits = document.querySelectorAll ".menu-subentry--credits a"

        interactions.on domBtsGrid, "click", @_onBtGrid for domBtsGrid in @_domBtsGrid
        interactions.on domBtLogo, "click", @_onBtLogo for domBtLogo in @_domBtsLogo
        interactions.on domBtArtists, "click", @_onBtArtists for domBtArtists in @_domBtsArtists
        interactions.on domBtAbout, "click", @_onBtAbout for domBtAbout in @_domBtsAbout
        interactions.on domBtCredits, "click", @_onBtCredits for domBtCredits in @_domBtsCredits

        nav.on "change", @_onNavChange

    _onBtGrid: ( e ) =>
        console.log('hihi')
        @gridActivate = !@gridActivate
        @scene3d.setGrid(@gridActivate)
        e.preventDefault()
        nav.set ""

    _onBtArtists: ( e ) =>
        e.preventDefault()
        nav.set "artists"

    _onBtAbout: ( e ) =>
        e.preventDefault()
        nav.set "about"

    _onBtCredits: ( e ) =>
        e.preventDefault()
        @_credits.show()

    _onBtLogo: ( e ) =>
        e.preventDefault()
        nav.set ""
        

    _onNavChange: ( id ) =>
        if id != "credits"
            @_credits.hide()

        if id != "" && id != "credits"
            if id == "artists"
                @_activate ".menu-entry--artists"
                # @_credits.hide()
            else
                @_activate ".menu-entry--about"
                # @_credits.hide()
            @_showMenuLight() if ( window.innerWidth > 640 )
        else
            @_hideMenuLight() if ( window.innerWidth > 640 )


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
