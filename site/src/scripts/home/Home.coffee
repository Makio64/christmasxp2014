nav = require "common/nav"
Menu = require "home/Menu"
Artists = require "home/Artists"
About = require "home/About"
Credits = require "home/Credits"

class Home

    constructor: ->
        @dom = document.querySelector ".home"
        
        @_menu = new Menu    

        @_artists = new Artists
        @_about = new About
        @_credits = new Credits
        @_currentModule = null

        nav.on "change", @_onNavChange

    _onNavChange: ( id ) =>
        newModule = @[ "_#{id}" ]
        return if @_currentModule == newModule
        if @_currentModule
            @_currentModule.hide().then =>
                @_currentModule = newModule
                @_currentModule.show()
        else
            @_currentModule = newModule
            @_currentModule.show()

    show: =>
        @dom.style.display = "block"
        TweenLite.set @dom,
            css:
                alpha: 0
        TweenLite.to @dom, .5,
            css:
                alpha: 1

    hide: ->

module.exports = Home
