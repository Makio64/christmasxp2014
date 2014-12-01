interactions = require "common/interactions"

class MobileMenu 

  dom: null

  domNavbar : null
  _domMenuCTA : null
  _domCloseBtn: null

  _isVisible: false
  _transitionTimer: null

  constructor: ->
    @dom    = document.querySelector '.mobile-menu'
    @domNavbar = document.querySelector '.mobile-navbar'

    @_domMenuCTA = @domNavbar.querySelector '.menuCTA'
    @_domCloseBtn = @dom.querySelector '.bt-close-holder'

    interactions.on @_domMenuCTA, 'click', @_show
    interactions.on @_domCloseBtn, 'click', @_hide

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
    , 1300
    
    null


module.exports = MobileMenu
