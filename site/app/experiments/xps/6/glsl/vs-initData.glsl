attribute vec2 aV2I;
attribute vec4 aVD;
varying vec4 vD;
varying vec2 vV2I;

void main(void) {
 vD = aVD;
 vV2I = aV2I;
 gl_PointSize = 1.0;
 gl_Position = vec4(2. * aV2I - vec2(1.), 0.0, 1.0);
}