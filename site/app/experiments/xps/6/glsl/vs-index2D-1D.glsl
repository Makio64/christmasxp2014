attribute vec2 aV2I;
attribute float aVI;
varying float vVI;
void main(void) {
    vVI = aVI;
    gl_PointSize = 1.0;
    gl_Position = vec4(2. * aV2I - vec2(1.), 0.0, 1.0);
}