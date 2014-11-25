nav = require "common/nav"
Menu = require "home/Menu"
Artists = require "home/Artists"
About = require "home/About"

class Home

    constructor: ->
        @dom = document.querySelector ".home"
        TweenLite.set @dom,
            css:
                alpha: 0
        @dom.style.display = "block"
        
        @_menu = new Menu    

        # modules with show/hide
        @_artists = new Artists
        @_about = new About        

        @_currentModule = null

        nav.on "change", @_onNavChange

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

    show: =>
        TweenLite.to @dom, .5,
            css:
                alpha: 1

    hide: ->

module.exports = Home
