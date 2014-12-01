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
        # url = "https://www.facebook.com/sharer/sharer.php"
        # url += "?u=" + encodeURIComponent( "http://christmasexperiments.com/" )
        # url += "&message=" + encodeURIComponent( "Christmas Experiments 2014, discover the best experiments of the winter!" )
        # @_openPopup url
        FB.ui
            method: 'feed',
            name: "Christmas Experiments - 2014",
            caption: "Christmas Experiments 2014, discover the best experiments of the winter!",
            redirect_uri: "http://christmasexperiments.com/",
            link: "http://christmasexperiments.com/"
            picture: "http://christmasexperiments.com/share.jpg"
        , ( response ) ->
        return

    _onTwitter: ( e ) =>
        e.preventDefault()
        url = "https://twitter.com/share?"
        url += "text="  + encodeURIComponent( "Christmas Experiments 2014, discover the best experiments of the winter!" )
        url += "&url=" + encodeURIComponent( "http://christmasexperiments.com/" )
        @_openPopup url
        return

    _openPopup: ( url ) ->
        window.open( url, "", "top=100, left=200, width=600, height = 500" );
        return

module.exports = Share
