attribute float aVI;
attribute vec2 aV2I;
varying vec4 vColor;
void main(void) {
    vColor = vec4(aVI);
    gl_PointSize = 1.0;
    gl_Position = vec4(aV2I, 0.0, 1.0);
}