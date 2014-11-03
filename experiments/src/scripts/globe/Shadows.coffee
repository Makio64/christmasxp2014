class Shadows extends THREE.Object3D

    constructor: ->
        super

        geom = new THREE.SphereGeometry 5.1, 32, 32

        material = new THREE.MeshPhongMaterial { color: 0x000000, ambient: 0xffffff, specular: 0xffffff }
        material.shininess = 10
        material.transparent = true
        material.opacity = .2
        @mesh = new THREE.Mesh geom, material
        @add @mesh

module.exports = Shadows
