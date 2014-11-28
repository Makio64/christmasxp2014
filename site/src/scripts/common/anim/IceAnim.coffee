class IceAnim

    constructor: ( @_node, @_w, @_h ) ->
        @_domContent = @_node.querySelector ".ice-content"

        @_nodeA = @_domContent.cloneNode true
        @_nodeB = @_domContent.cloneNode true
        @_initNode @_nodeA, @_w, @_h
        @_initNode @_nodeB, @_w, @_h

        TweenLite.set @_domContent, { css: { alpha: 0, force3D: true } }

        @_masks = {}

        @_createMasks()

    _initNode: ( node, w, h ) ->
        node.style.width = w + "px"
        node.style.height = h + "px"

    _createMasks: ->
        @_maskA = @_createMaskDiv @_w, @_h
        @_maskB = @_createMaskDiv @_w, @_h

        @_maskA.appendChild @_nodeA
        @_maskB.appendChild @_nodeB

        
        TweenLite.set @_maskA, { css: { transformOrigin: "0% 0%" } }
        TweenLite.set @_maskB, { css: { transformOrigin: "100% 100%" } }
        TweenLite.set @_nodeB, { css: { transformOrigin: "100% 100%" } }

        r = ( Math.PI * .25 + ( Math.random() * Math.PI * .2 ) - .1 ) * 180 / Math.PI
        TweenLite.set @_maskA,
            css:
                alpha: 0
                rotation: -r
                force3D: true
        TweenLite.set @_nodeA,
            css:
                rotation: r
                force3D: true

        r = ( Math.PI * .25 + ( Math.random() * Math.PI * .3 ) - .15) * 180 / Math.PI
        TweenLite.set @_maskB,
            css:
                alpha: 0
                rotation: -r
                force3D: true
        TweenLite.set @_nodeB,
            css:
                rotation: r
                force3D: true

        @_node.appendChild @_maskA
        @_node.appendChild @_maskB

    _createMaskDiv: ( w, h ) ->
        div = document.createElement "div"
        div.style.position = "absolute"
        div.style.top = 0
        div.style.left = 0
        div.style.width = w + "px"
        div.style.height = h + "px"
        div.style.overflow = "hidden"
        div

    show: ( delay = 0 ) ->
        TweenLite.set @_maskA,
            delay: delay
            css:
                alpha: .2
                # rotationX: -20
                rotationY: -20
                x: -50
                z: 60
                force3D: true
        TweenLite.to @_maskA, .05,
            delay: delay
            css:
                alpha: .45
                # rotationX: -10
                rotationY: -10
                x: -35
                z: 45
                force3D: true
            ease: Quad.easeIn
        TweenLite.to @_maskA, .15,
            delay: delay + .05
            css: 
                alpha: 1
                # rotationX: 0
                rotationY: 0
                x: 0
                z: 0
                force3D: true
            ease: Quart.easeOut

        TweenLite.set @_maskB,
            delay: delay
            css:
                alpha: .2
                # rotationX: 20
                rotationY: 20
                x: 50
                z: 60
                force3D: true
        TweenLite.to @_maskB, .05,
            delay: delay + .05
            css:
                alpha: .45
                # rotationX: 10
                rotationY: 10
                x: 35
                z: 45
                force3D: true
            ease: Quad.easeIn
        TweenLite.to @_maskB, .15,
            delay: delay + .1
            css: 
                alpha: 1
                # rotationX: 0
                rotationY: 0
                x: 0
                z: 0
                force3D: true
            ease: Quart.easeOut

        TweenLite.set @_domContent, 
            delay: delay
            css: 
                rotationY: -20
                z: 20
                force3D: true
                alpha: 0
        TweenLite.to @_domContent, .4, 
            delay: delay + .15, 
            css: 
                rotationY: 0
                z: 0
                alpha: 1
                force3D: true
            ease: Expo.easeInOut
            onComplete: @_removeIce

    _removeIce: =>
        @_node.removeChild @_maskA
        @_node.removeChild @_maskB

    hide: ( delay = 0 ) ->
        @_node.appendChild @_maskA
        @_node.appendChild @_maskB

        TweenLite.set @_maskA,
            css: 
                alpha: 1
                # rotationX: 0
                rotationY: 0
                x: 0
                z: 0
                force3D: true
        TweenLite.set @_maskB,
            css: 
                alpha: 1
                # rotationX: 0
                rotationY: 0
                x: 0
                z: 0
                force3D: true
        TweenLite.set @_domContent,
            css: 
                rotationY: 0
                z: 0
                alpha: 1
                force3D: true

        TweenLite.to @_domContent, .1,
            delay: delay
            css:
                alpha: .85
                rotationY: -7
                z: 20
                force3D: true
            ease: Quad.easeIn
        TweenLite.to @_domContent, .05,
            delay: delay + .1
            css: 
                alpha: 0
                rotationY: -20
                z: 60
                force3D: true
            ease: Cubic.easeOut

        TweenLite.to @_maskA, .1,
            delay: delay + .05
            css:
                alpha: .85
                # rotationX: -7
                rotationY: -7
                x: -15
                force3D: true
                z: 20
            ease: Quad.easeIn
        TweenLite.to @_maskA, .1,
            delay: delay + .05 + .1
            css: 
                alpha: 0
                # rotationX: -20
                rotationY: -20
                x: -50
                z: 60
                force3D: true
            ease: Cubic.easeOut

        TweenLite.to @_maskB, .1,
            delay: delay + .1 + .05
            css:
                alpha: .85
                # rotationX: 7
                rotationY: 7
                x: 15
                z: 20
                force3D: true
            ease: Quad.easeIn
        TweenLite.to @_maskB, .1,
            delay: delay + .1 + .1
            css: 
                alpha: 0
                # rotationX: 20
                rotationY: 20
                x: 50
                z: 60
                force3D: true
            ease: Cubic.easeOut

        .4 + delay

    dispose: =>
        @_removeIce()
        TweenLite.set @_domContent,
            css:
                rotationY: 0
                z: 0
                alpha: 1
                force3D: true


module.exports = IceAnim
