attribute float aVI;
attribute vec2 aVJ;

uniform mat4 uCameraMatrix;
uniform mat4 uPMatrix;
uniform highp sampler2D uTT;
uniform highp sampler2D uTN;
uniform float uTransparency;
varying vec3 vPos;
varying vec3 vNor;
varying float vVI;
varying float vPrint;

void main(void) {
    vPrint = 1.;
    vPos = texture2D(uTT, aVJ).rgb;
    vNor = texture2D(uTN, aVJ).rgb;
    gl_Position = uPMatrix * uCameraMatrix * vec4(vPos, 1.0);
}