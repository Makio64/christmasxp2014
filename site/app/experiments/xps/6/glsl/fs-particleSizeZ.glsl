precision highp float;
precision highp sampler2D;
uniform sampler2D uDT;
const float k = 0.00048828125;
const vec2 jump = vec2(1920., -128.);
const vec2 axis = vec2(128., 0.);
varying vec2 vText;
void main(void) {
    vec2 position = floor(vText * 2048.);
    vec2 leftPos = position - axis;
    leftPos += (position + jump - leftPos) * step(leftPos.x, 0.);
    float blend = texture2D(uDT, position * k).r;
    blend += texture2D(uDT, leftPos * k).r * step(-leftPos.x, 0.) * step(-leftPos.y, 0.);
    gl_FragColor = vec4(step(-blend, -0.1), 0., 0., 1.);
}