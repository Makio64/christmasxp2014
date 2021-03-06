class Interactions

    constructor: ->
        @_downs = {}
        @_moves = {}
        @_ups = {}
        @_clicks = {}
        @_mouseleaves = {}
        
        @_interactions = [ @_downs, @_moves, @_ups, @_clicks ]

        @isTouchDevice = "ontouchstart" of window || "onmsgesturechange" of window

    on: ( elt, action, cb ) ->
        evt = @_getEvent action
        return if evt == ""

        obj = @_getObj action
        if !obj[ elt ]
            obj[ elt ] = []

        isTouchDevice = @isTouchDevice
        proxy = ( e ) ->
            if isTouchDevice
                touch = e.touches[ 0 ]
                if touch
                    e.x = touch.clientX
                    e.y = touch.clientY
            else
                e.x = e.clientX
                e.y = e.clientY

            cb.call @, e

        obj[ elt ].push
            cb: cb
            proxy: proxy

        elt.addEventListener evt, proxy, false

    off: ( elt, action, cb ) ->
        evt = @_getEvent action
        return if evt == ""

        obj = @_getObj action
        return if !obj[ elt ]

        datas = obj[ elt ]
        if cb
            result = @_find cb, datas
            return if !result
            elt.removeEventListener evt, result.data.proxy, false
            datas.splice result.idx, 1
        else
            for data in datas
                elt.removeEventListener evt, data.proxy, false
            obj[ elt ] = []

        return

    dispose: ( elt ) ->
        for interaction in @_interactions
            if interaction[ elt ]
                interaction[ elt ] = null
                delete interaction[ elt ]

        return

    _getEvent: ( action ) ->
        evt = ""
        if @isTouchDevice
            switch action
                when "down" then evt = "touchstart"
                when "move" then evt = "touchmove"
                when "up" then evt = "touchend"
                when "click" then evt = "touchstart"
                when "mouseleave" then evt = "mouseleave"
        else
            switch action
                when "down" then evt = "mousedown"
                when "move" then evt = "mousemove"
                when "up" then evt = "mouseup"
                when "click" then evt = "click"
                when "mouseleave" then evt = "mouseleave"
        return evt

    _getObj: ( action ) ->
        obj = @[ "_#{action}s" ]

    _find: ( cb, datas ) ->
        for data, idx in datas
            return { data: data, idx: idx } if data.cb == cb
        return null
            

module.exports = new Interactions
    
