precision mediump float;
precision mediump sampler2D;
uniform sampler2D uDT;
uniform float uSR;
const float k = 0.00048828125;
const vec2 jump = vec2(1920., -128.);
const vec2 axis = vec2(128., 0.);
varying vec2 vText;


/*

REVISAR ESTO PARA VER SI PUEDO UTILIZAR EL EFECTO DE PRECALCULAR POSICIONES COMO EN LA TEXTURA 2D.

*/




void main(void) {
    vec2 position = floor(gl_FragCoord.xy);
    vec2 leftPos = position - axis;
    vec2 rightPos = position + axis;
    leftPos += (position + jump - leftPos) * step(leftPos.x, 0.);
    rightPos += (position - jump - rightPos) * step(-rightPos.x, -2047.);
    float blend = texture2D(uDT, leftPos * k).r * step(-leftPos.x, 0.) * step(-leftPos.y, 0.);
    blend += uSR * texture2D(uDT, position * k).r;
    blend += texture2D(uDT, rightPos * k).r * step(rightPos.y, 2047.) * step(rightPos.x, 2047.);
    blend /= (2. + uSR);
    blend -= blend * step(mod(leftPos.x + 2., 128.), 4.);
    blend -= blend * step(mod(rightPos.y + 8., 128.), 9.);
    gl_FragColor = vec4(blend, 0., 0., 1.);
}