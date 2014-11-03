conf = require "conf"

class CloudsLight extends THREE.Object3D

    constructor: ->
        super

        texture = new THREE.ImageUtils.loadTexture "img/textures/#{conf.assets}/clouds_2.jpg"
        texture2 = new THREE.ImageUtils.loadTexture "img/textures/#{conf.assets}/clouds_3.jpg"

        geom = new THREE.SphereGeometry 5.03, 32, 32

        material = new THREE.MeshLambertMaterial { color: 0x444444, ambient: 0xffffff }
        material.map = texture
        material.alphaMap = texture
        material.transparent = true
        material.opacity = .15

        material2 = new THREE.MeshLambertMaterial { color: 0xffffff, ambient: 0x404040 }
        material2.map = texture2
        material2.alphaMap = texture2
        material2.transparent = true
        material2.opacity = .35

        # @mesh = new THREE.Mesh geom, material
        @mesh = THREE.SceneUtils.createMultiMaterialObject geom, [ material, material2 ]
        @add @mesh

module.exports = CloudsLight
