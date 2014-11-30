class Nav extends Emitter

    constructor: ->
        super
        @id = ""

    set: ( id ) ->
        return if @id == id
        @id = id
        @emit "change", @id

module.exports = new Nav
