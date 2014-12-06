precision highp float;
precision highp sampler2D;
varying float vVI;
void main() {
    //This defines if the voxel has information (it will never be cero)
    gl_FragColor = vec4(vVI);
}