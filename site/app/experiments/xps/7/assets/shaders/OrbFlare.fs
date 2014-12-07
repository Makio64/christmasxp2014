varying vec2 vUv;

uniform sampler2D map;
uniform vec3 color;
uniform float opacity;

void main() {
    vec4 texel = texture2D(map, vUv);
    texel.a *= opacity;
    
    gl_FragColor = texel;
}