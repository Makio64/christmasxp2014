Clouds = require "globe/Clouds"
CloudsLight = require "globe/CloudsLight"
Shadows = require "globe/Shadows"
conf = require "conf"

class Globe extends THREE.Object3D

    constructor: ->
        super

        @_tox = 0
        @_toy = 0
        @_rx = 0
        @_ry = 0

        texture = new THREE.ImageUtils.loadTexture "img/textures/#{conf.assets}/world.jpg"
        textureBump = new THREE.ImageUtils.loadTexture "img/textures/#{conf.assets}/world_bump.jpg"
        textureAlpha = new THREE.ImageUtils.loadTexture "img/textures/#{conf.assets}/world_alpha.jpg"

        geom = new THREE.SphereGeometry 5, 32, 32

        material1 = new THREE.MeshPhongMaterial { color: 0x164286, ambient: 0x000000, specular: 0x000000 }
        material1.shininess = 30

        material2 = new THREE.MeshPhongMaterial { color: 0xffffff, ambient: 0xdfe9cf, emissive: 0x8f8f8f, specular: 0x404040 }
        material2.shininess = 10
        material2.map = texture
        material2.lightMap = textureAlpha
        material2.specularMap = textureBump
        material2.bumpMap = textureBump
        material2.bumpScale = 0.175
        material2.metal = false
        material2.alphaMap = textureAlpha
        material2.transparent = true

        @_shadows = new Shadows
        @add @_shadows

        @_cloudsLight = new CloudsLight
        @add @_cloudsLight

        @_clouds = new Clouds
        @add @_clouds

        @mesh = THREE.SceneUtils.createMultiMaterialObject geom, [ material1, material2 ]
        @add @mesh

        @_quat = new THREE.Quaternion()

    rotate: ( mx, my ) ->
        @_tox += mx * .005
        @_toy += my * .005
        @_toy = 0.6 if @_toy > 0.6
        @_toy = -0.35 if @_toy < -0.35

    update: ->
        @_rx += ( @_toy - @_rx ) * .1
        @_ry += ( @_tox - @_ry ) * .1

        @mesh.rotation.x = @_rx
        @mesh.rotation.y = @_ry

        @_cloudsLight.rotation.x =
        @_clouds.rotation.x = @mesh.rotation.x
        @_cloudsLight.rotation.y =
        @_clouds.rotation.y = @mesh.rotation.y
        # @_cloudsLight.rotation.y += .00085
        # @_clouds.rotation.y += .001
        # @mesh.rotation.y += .00065

module.exports = Globe
