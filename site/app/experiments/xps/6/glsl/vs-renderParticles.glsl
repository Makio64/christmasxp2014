attribute vec2 aV2I;
uniform mat4 uCameraMatrix;
uniform mat4 uPMatrix;
uniform highp sampler2D uPT;
uniform float uIntensity;
uniform float uSize;
varying vec4 vColor;
void main(void) {
    vec4 data = texture2D(uPT, aV2I);
    vec4 pos = vec4(data.rgb, 1.);
    vColor = vec4(vec3(uIntensity), 1.);
    gl_Position = uPMatrix * uCameraMatrix * pos;
    gl_PointSize = uSize;
}