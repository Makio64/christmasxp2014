uniform vec3 color0;
uniform vec3 color1;
uniform float radius;
uniform float opacity;

varying vec3 vPos;

void main() {
    float m = abs(vPos.y / (radius / 2.25));
    vec3 color = mix(color0, color1, m);
    gl_FragColor = vec4(color, opacity);
}