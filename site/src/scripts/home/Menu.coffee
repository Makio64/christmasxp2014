interactions = require "common/interactions"
nav = require "common/nav"

class Menu

    constructor: ->
        @_domBtsArtists = document.querySelectorAll ".menu-entry--artists a"
        @_domBtsAbout = document.querySelectorAll ".menu-entry--about a"
        @_domBtsCredits = document.querySelector ".menu-subentry a"

        interactions.on domBtArtists, "click", @_onBtArtists for domBtArtists in @_domBtsArtists
        interactions.on domBtAbout, "click", @_onBtAbout for domBtAbout in @_domBtsAbout
        interactions.on @_domBtsCredits, "click", @_onBtCredits

    _onBtArtists: ( e ) =>
        e.origin.preventDefault()
        nav.set "artists"

    _onBtAbout: ( e ) =>
        e.origin.preventDefault()
        nav.set "about"

    _onBtCredits: ( e ) =>
        e.origin.preventDefault()
        nav.set "credits"

module.exports = Menu
