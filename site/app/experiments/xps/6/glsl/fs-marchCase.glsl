precision mediump float;
precision mediump sampler2D;
uniform sampler2D uDT;
uniform float uRange;
const float k = 0.0078125;
varying vec2 vText;
vec2 index2D(vec3 pos) {
    return 0.00048828125 * (pos.xy + 128. * vec2(mod(pos.z, 16.), floor(pos.z * 0.0625)) + vec2(0.5));
}
void main(void) {
    vec2 position = floor(2048. * vText);;
    vec3 pos3D = vec3(mod(position.x, 128.), mod(position.y, 128.), 16. * floor(position.y * k) + floor(position.x * k));
    float c = step(texture2D(uDT, index2D(pos3D)).r, uRange) + 2. * step(texture2D(uDT, index2D(pos3D + vec3(1, 0., 0.))).r, uRange) + 4. * step(texture2D(uDT, index2D(pos3D + vec3(1, 1, 0.))).r, uRange) + 8. * step(texture2D(uDT, index2D(pos3D + vec3(0., 1, 0.))).r, uRange) + 16. * step(texture2D(uDT, index2D(pos3D + vec3(0., 0., 1))).r, uRange) + 32. * step(texture2D(uDT, index2D(pos3D + vec3(1, 0., 1))).r, uRange) + 64. * step(texture2D(uDT, index2D(pos3D + vec3(1, 1, 1))).r, uRange) + 128. * step(texture2D(uDT, index2D(pos3D + vec3(0., 1, 1))).r, uRange);
    c *= step(c, 254.);
    gl_FragColor = vec4(step(-c, -0.5) * vec3(1.), c);
}