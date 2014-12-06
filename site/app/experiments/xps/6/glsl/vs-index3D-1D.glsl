precision highp float;
precision highp sampler2D;
attribute vec2 aV2I;
attribute float aVI;
uniform highp sampler2D uPT;
uniform float uSize;
varying float vVI;
void main(void) {
    vVI = aVI;
    vec3 gPP = floor(texture2D(uPT, aV2I).rgb * 128.);
    vec2 gP =  0.0009765625 * (gPP.xy + 128. * vec2(mod(gPP.z, 16.), floor(gPP.z * 0.0625)) + vec2(0.5)) - vec2(1.);
    gl_PointSize = 1.;
    gl_Position = vec4(gP, 0., 1.0);
}