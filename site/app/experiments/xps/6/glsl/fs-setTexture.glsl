precision highp sampler2D;
precision highp float;
uniform sampler2D uDT;
varying vec2 vText;
void main(void) {
    gl_FragColor = texture2D(uDT, vText);
}