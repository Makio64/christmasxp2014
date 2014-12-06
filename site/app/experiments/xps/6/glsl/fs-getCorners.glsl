precision highp float;
precision highp sampler2D;
uniform sampler2D uDT;
uniform float uRange;
const float k = 0.0078125;
varying vec2 vText;
vec2 index2D(vec3 pos) {
    return 0.00048828125 * (pos.xy + 128. * vec2(mod(pos.z, 16.), floor(pos.z * 0.0625)) + vec2(0.5));
}
void main(void) {
    vec2 position = floor(2048. * vText);
    vec3 pos3D = vec3(mod(position.x, 128.), mod(position.y, 128.), 16. * floor(position.y * k) + floor(position.x * k));
    float c = 0.125 * (texture2D(uDT, index2D(pos3D + vec3(-1., -1., -1.))).r + texture2D(uDT, index2D(pos3D + vec3(0., -1., -1.))).r + texture2D(uDT, index2D(pos3D + vec3(0., 0., -1.))).r + texture2D(uDT, index2D(pos3D + vec3(-1., 0., -1))).r + texture2D(uDT, index2D(pos3D + vec3(-1., -1., 0.))).r + texture2D(uDT, index2D(pos3D + vec3(0., -1., 0.))).r + texture2D(uDT, index2D(pos3D + vec3(0., 0., 0.))).r + texture2D(uDT, index2D(pos3D + vec3(-1., 0., 0.))).r);
    gl_FragColor = vec4(c, 0., 0., 1.);
}