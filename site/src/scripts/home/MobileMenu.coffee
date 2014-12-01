interactions = require "common/interactions"
nav = require "common/nav"
Credits = require "home/Credits"

class MobileMenu 

  dom: null

  domNavbar : null
  _domMenuCTA : null
  _domCloseBtn: null

  _isVisible: false
  _transitionTimer: null

  _domArtistsBtn: null
  _domAboutBtn: null
  _domCreditsBtn: null

  constructor: ->
    @dom    = document.querySelector '.mobile-menu'
    @domNavbar = document.querySelector '.mobile-navbar'

    @_domMenuCTA = @domNavbar.querySelector '.menuCTA'
    @_domCloseBtn = @dom.querySelector '.bt-close-holder'

    @_domHomeBtn = @dom.querySelectorAll('.menu-entry')[0]
    @_domArtistsBtn = @dom.querySelectorAll('.menu-entry')[1]
    @_domAboutBtn = @dom.querySelectorAll('.menu-entry')[2]
    @_domCreditsBtn = @dom.querySelector('.menu-subentry--credits')

    

    interactions.on @_domMenuCTA, 'click', @_show
    interactions.on @_domCloseBtn, 'click', @_hide

    interactions.on @_domHomeBtn, 'click', @_navigateToHome
    interactions.on @_domArtistsBtn, 'click', @_navigateToArtists
    interactions.on @_domAboutBtn, 'click', @_navigateToAbout
    interactions.on @_domCreditsBtn, 'click', @_navigateToCredits

    nav.on "change", @_onNavChange

    null


  _onNavChange: =>
    console.log 'plop'
    null


  _toggleMenu: =>
    @_isVisible = !@_isVisible

    if @_isVisible then @_show() else @_hide()

    null


  _show: ( evt ) =>
    if ( evt ) then evt.preventDefault()

    @dom.style.display = 'table'

    if ( @_transitionTimer ) then clearInterval( @_transitionTimer )

    @_transitionTimer = setTimeout =>
      @dom.classList.add 'transitionIn'
      document.body.scrollTop = 200
    , 100

    null


  _hide: ( evt ) =>
    
    if ( evt ) then evt.preventDefault()

    @dom.classList.add 'transitionOut'

    if ( @_transitionTimer ) then clearInterval( @_transitionTimer )

    @_transitionTimer = setTimeout =>
      @dom.classList.remove 'transitionIn'
      @dom.classList.remove 'transitionOut'
      @dom.style.display = 'none'
    , 1500
    
    null


  _navigateToHome: =>
    nav.set ""
    @_hide()

    null


  _navigateToArtists: =>
    nav.set "artists"
    @_hide()

    null


  _navigateToAbout: =>
    nav.set "about"
    @_hide()

    null


  _navigateToCredits: =>
    nav.set "credits"
    @_hide()

    null


module.exports = MobileMenu
