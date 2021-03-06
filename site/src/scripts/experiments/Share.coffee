interactions = require "common/interactions"

class Share

    constructor: ->
        @_domShareFb = document.querySelectorAll ".share--fb"
        @_domShareTwitter = document.querySelectorAll ".share--twitter"

        interactions.on dom, "click", @_onFB for dom in @_domShareFb
        interactions.on dom, "click", @_onTwitter for dom in @_domShareTwitter
        return

    update: ( @_data ) ->
        return

    _onFB: ( e ) =>
        e.preventDefault()
        
        if !@_data
            @_data={}
            @_data.idx = 1
        
        # url = "https://www.facebook.com/sharer/sharer.php"
        # url += "?u=" + encodeURIComponent( "http://christmasexperiments.com/experiments/#{@_data.idx}" )
        # url += "&message=" + encodeURIComponent( "Polar a beautiful experiments by @superguigui for @christmasxp" )
        # @_openPopup url
        FB.ui
            method: 'feed'
            name: "Christmas Experiments - 2014"
            caption: @_data.title
            desc: @_data.desc
            # redirect_uri: "http://christmasexperiments.com/"
            link: "http://christmasexperiments.com/"
            picture: "http://christmasexperiments.com/experiments/xps/#{@_data.idx}/share.jpg"
        , ( response ) ->

    _onTwitter: ( e ) =>
        e.preventDefault()
        
        if !@_data
            @_data={}
            @_data.idx = 1

        url = "https://twitter.com/share?"
        url += "text="  + encodeURIComponent( @_data.msgTwitter )
        url += "&url=" + encodeURIComponent( "http://christmasexperiments.com/experiments/"+@_data.idx+"/" )
        @_openPopup url

    _openPopup: ( url ) ->
        window.open( url, "", "top=100, left=200, width=600, height = 500" );

module.exports = Share
