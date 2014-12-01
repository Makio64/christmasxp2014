interactions = require "common/interactions"

class Share

    constructor: ->
        @_domShareFb = document.querySelector ".share--fb"
        @_domShareTwitter = document.querySelector ".share--twitter"

        interactions.on @_domShareFb, "click", @_onFB
        interactions.on @_domShareTwitter, "click", @_onTwitter

    update: ( @_data ) ->

    _onFB: ( e ) =>
        e.preventDefault()
        url = "https://www.facebook.com/sharer/sharer.php"
        url += "?u=" + encodeURIComponent( "http://christmasexperiments/experiments/#{@_data.idx}" )
        url += "&message=" + encodeURIComponent( "Come and discover this Christmas Experiment!" )
        @_openPopup url

    _onTwitter: ( e ) =>
        e.preventDefault()
        url = "https://twitter.com/share?"
        url += "text="  + encodeURIComponent( "Come and discover this Christmas Experiment!" )
        url += "&url=" + encodeURIComponent( "http://christmasexperiments/experiments/#{@_data.idx}" ) + "/"
        @_openPopup url

    _openPopup: ( url ) ->
        window.open( url, "", "top=100, left=200, width=600, height = 500" );

module.exports = Share
