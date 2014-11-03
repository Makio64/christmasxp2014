conf = require "conf"
cloudsShader = require "shaders/cloudsShader"
MeshCloudsMaterial = require "shaders/MeshCloudsMaterial.js"

class Clouds extends THREE.Object3D

    constructor: ->
        super

        texture = new THREE.ImageUtils.loadTexture "img/textures/#{conf.assets}/clouds.jpg"

        geom = new THREE.SphereGeometry 5.05, 32, 32


        material = new THREE.MeshPhongMaterial { color: 0xffffff, ambient: 0x404040, specular: 0xffffff }
        # material = new THREE.MeshCloudsMaterial { color: 0xffffff, ambient: 0x404040, specular: 0xffffff }
        # material.uniforms = cloudsShader.uniforms
        # material.vertexShader = cloudsShader.vertexShader
        # material.fragmentShader = cloudsShader.fragmentShader
        material.map = texture
        material.alphaMap = texture
        material.bumpMap = texture
        material.bumpScale = 0.025
        material.shininess = 5
        material.metal = false
        material.transparent = true

        # material = new THREE.ShaderMaterial
        #     uniforms: cloudsShader.uniforms
        #     vertexShader: cloudsShader.vertexShader
        #     fragmentShader: cloudsShader.fragmentShader

        @mesh = new THREE.Mesh geom, material
        @add @mesh

module.exports = Clouds
