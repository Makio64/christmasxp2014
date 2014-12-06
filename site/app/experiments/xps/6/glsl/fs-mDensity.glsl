precision highp float;
uniform highp sampler2D uDT;
varying vec2 vV2I;
void main(void) {
    gl_FragColor = vec4(0., 0., 0., texture2D(uDT, vV2I).a);
}