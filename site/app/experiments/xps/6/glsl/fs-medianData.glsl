precision highp float;
uniform highp sampler2D uDT;
uniform float uAlpha;
varying vec2 vV2I;
void main(void) {
    gl_FragColor = vec4(texture2D(uDT, vV2I).rgb, uAlpha);
}