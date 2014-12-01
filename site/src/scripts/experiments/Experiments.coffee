Menu = require "experiments/Menu"
XP = require "experiments/XP"
Infos = require "experiments/Infos"
Share = require "experiments/Share"
datas = require( "data.json" ).experiments

class Experiments

    constructor: ->
        @_xp = null

        @_infos = new Infos()
        @_menu = new Menu()
        @_share = new Share()

        page( "/experiments/", @_showPage )
        page( "/experiments/:id", @_showPage )
        page( "/2014/experiments/", @_showPage )
        page( "/2014/experiments/:id", @_showPage )
        page( "/2014_/experiments/", @_showPage )
        page( "/2014_/experiments/:id", @_showPage )
        # page( "/experiments/404", @_show404 )
        page()

    _showPage: ( data ) =>
        if !data.params.id || data.params.id < 1 || data.params.id > 24
            page "/experiments/1"
            return

        @_showXP data.params.id

    _showXP: ( idx ) ->
        data = datas[ idx - 1 ]

        @_infos.update data
        @_menu.update idx

        if @_xp 
            @_xp.hide()
            @_xp = new XP data
            @_xp.show true
        else
            @_xp = new XP data
            @_xp.show()

    _show404: ->

        

module.exports = Experiments
