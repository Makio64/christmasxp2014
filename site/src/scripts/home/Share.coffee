interactions = require "common/interactions"

class Share

    constructor: ->
        @_domShareFb = document.querySelectorAll ".share--fb"
        @_domShareTwitter = document.querySelectorAll ".share--twitter"

        interactions.on dom, "click", @_onFB for dom in @_domShareFb
        interactions.on dom, "click", @_onTwitter for dom in @_domShareTwitter
        return

        
    _onFB: ( e ) =>
        e.preventDefault()
        url = "https://www.facebook.com/sharer/sharer.php"
        url += "?u=" + encodeURIComponent( "http://christmasexperiments/" )
        url += "&message=" + encodeURIComponent( "Discover Christmas Experiments 2014" )
        @_openPopup url
        return

    _onTwitter: ( e ) =>
        e.preventDefault()
        url = "https://twitter.com/share?"
        url += "text="  + encodeURIComponent( "Discover Christmas Experiments 2014" )
        url += "&url=" + encodeURIComponent( "http://christmasexperiments/" ) + "/"
        @_openPopup url
        return

    _openPopup: ( url ) ->
        window.open( url, "", "top=100, left=200, width=600, height = 500" );
        return

module.exports = Share
