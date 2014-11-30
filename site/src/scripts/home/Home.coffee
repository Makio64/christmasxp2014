nav = require "common/nav"
getIndex = require "common/getIndex"
Menu = require "home/Menu"
Artists = require "home/Artists"
About = require "home/About"
xps = require "home/xps"
TitleAnim = require "home/TitleAnim"

class Home

    constructor:(scene3d)->
        @dom = document.querySelector ".home"
        TweenLite.set @dom,
            css:
                alpha: 0
        @dom.style.display = "block"
        
        domHomeDetails = document.querySelector( ".home-details-content" )
        @_domHomeDetails = domHomeDetails.cloneNode true
        domHomeDetails.parentNode.removeChild domHomeDetails
        @_titleAnim = null

        @_menu = new Menu

        # modules with show/hide
        @_artists = new Artists
        @_about = new About  

        @_currentModule = null

        # tmp: will be replaced with the cristal
        # for dom in document.querySelectorAll ".home-bt"
        #     dom.addEventListener "mouseover", @_onBtOver
        #     dom.addEventListener "mouseout", @_onBtOut

        nav.on "change", @_onNavChange
        scene3d.on "over", @_onXPOver
        scene3d.on "out", @_onXPOut

    _onNavChange: ( id ) =>
        if id != ""
            newModule = @[ "_#{id}" ]
            return if @_currentModule == newModule
            if @_currentModule
                @_currentModule.hide().then =>
                    @_currentModule = newModule
                    @_currentModule.show()
            else
                @_currentModule = newModule
                @_currentModule.show()
        else
            @_currentModule.hide()
            @_currentModule = null

    _onBtOver: ( e ) ->
        e.preventDefault()
        xps.over getIndex e.currentTarget

    _onBtOut: ( e ) ->
        e.preventDefault()
        xps.out()

    _onXPOver: ( idx ) =>
        # if @_titleAnim
        #     @_titleAnim.hide()
        @_titleAnim = new TitleAnim @_domHomeDetails.cloneNode( true ), idx
        @_titleAnim.show()        

    _onXPOut:=>
        if(@_titleAnim)
            @_titleAnim.hide()

    show: =>
        TweenLite.to @dom, .5,
            css:
                alpha: 1

    hide: ->

module.exports = Home
