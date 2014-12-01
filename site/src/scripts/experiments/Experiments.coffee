Menu = require "experiments/Menu"
XP = require "experiments/XP"
Infos = require "experiments/Infos"
datas = require( "data.json" ).experiments

class Experiments

    constructor: ->
        @_xp = null

        @_infos = new Infos()

        page( "/experiments/", @_showPage )
        page( "/experiments/:id", @_showPage )
        page( "/experiments/404", @_show404 )
        page()

        @_menu = new Menu()

    _showPage: ( data ) =>
        if !data.params.id
            page "/experiments/1"
            return

        @_showXP data.params.id

    _showXP: ( idx ) ->
        data = datas[ idx - 1 ]

        @_infos.update data

        if @_xp 
            @_xp.hide()
            @_xp = new XP data
            @_xp.show true
        else
            @_xp = new XP data
            @_xp.show()

    _show404: ->

        

module.exports = Experiments
