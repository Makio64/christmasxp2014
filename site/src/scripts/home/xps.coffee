class Xps extends Emitter

    constructor: ->
        super

    over: ( idx ) ->
        @emit "over", idx

    out: ( idx ) ->
        @emit "out"

module.exports = new Xps
