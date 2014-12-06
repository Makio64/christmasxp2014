
attribute vec2 aV2I;
uniform highp sampler2D uPot;

varying vec4 vColor;

vec2 index2D(vec3 pos) {
    return 0.0078125 * (pos.xy + 32. * vec2(mod(pos.z, 4.), floor(pos.z * 0.25)) + vec2(0.5));
}

void main() {
    gl_Position = vec4(index2D(floor(texture2D(uPot, aV2I).rgb * 32.)), 0., 1.);
    gl_PointSize = 1.;
    vColor = vec4(1.);
}