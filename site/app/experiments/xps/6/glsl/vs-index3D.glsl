attribute vec2 aV2I;
uniform highp sampler2D uPT;
uniform float uSize;
varying vec2 vV2I;
varying vec3 vPos;
void main(void) {
    vV2I = aV2I;
    vPos = texture2D(uPT, aV2I).rgb;
    vec3 gPP = floor(vPos * 128.);
    gPP *= step(-gPP.y, 0.) * step(gPP.y, 128.);
    vec2 gP =  0.0009765625 * (gPP.xy + 128. * vec2(mod(gPP.z, 16.), floor(gPP.z * 0.0625)) + vec2(0.5)) - vec2(1.);
    gl_PointSize = uSize;
    gl_Position = vec4(gP, 0., 1.0);
}