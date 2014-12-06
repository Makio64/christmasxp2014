#extension GL_EXT_draw_buffers : require
precision highp float;
precision highp sampler2D;
uniform sampler2D uPot;
uniform sampler2D marchTex;
uniform sampler2D uTI;
uniform float uRange;
uniform float uLimit;
varying float vVI;
const float k = 0.0078125;
const float div = 0.00048828125;

vec2 index2D(vec3 pos) {
    return div * (pos.xy + 128. * vec2(mod(pos.z, 16.), floor(pos.z * 0.0625)) + vec2(0.5));
}

void triangleData(in float index, in vec3 voxelPosition, out vec3 position, out vec3 normal, out float mcIndex) {
        mcIndex = texture2D(uTI, 0.015625 * vec2(mod(index, 64.) + 0.5, floor(index * 0.015625) + 0.5)).r;
        bvec4 mask1 = equal(vec4(mcIndex), vec4(0., 1., 2., 3.));
        bvec4 mask2 = equal(vec4(mcIndex), vec4(4., 5., 6., 7.));
        bvec4 mask3 = equal(vec4(mcIndex), vec4(8., 9., 10., 11.));
        vec4 m1 = vec4(mask1);
        vec4 m2 = vec4(mask2);
        vec4 m3 = vec4(mask3);
        vec3 b0 = voxelPosition + m1.y * vec3(k, 0., 0.) + m1.z * vec3(k, k, 0.) + m1.w * vec3(0., k, 0.) + m2.x * vec3(0., 0., k) + m2.y * vec3(k, 0., k) + m2.z * vec3(k, k, k) + m2.w * vec3(0., k, k) + m3.x * vec3(0., 0., 0.) + m3.y * vec3(k, 0., 0.) + m3.z * vec3(k, k, 0.) + m3.w * vec3(0., k, 0.);
        vec3 b1 = voxelPosition + m1.x * vec3(k, 0., 0.) + m1.y * vec3(k, k, 0.) + m1.z * vec3(0., k, 0.) + m2.x * vec3(k, 0., k) + m2.y * vec3(k, k, k) + m2.z * vec3(0., k, k) + m2.w * vec3(0., 0., k) + m3.x * vec3(0., 0., k) + m3.y * vec3(k, 0., k) + m3.z * vec3(k, k, k) + m3.w * vec3(0., k, k);
        float n0 = texture2D(uPot, index2D(128. * b0)).r;
        float n1 = texture2D(uPot, index2D(128. * b1)).r;
        vec2 diff = vec2(uRange - n0, n1 - n0);
        bvec3 mask4 = lessThan(abs(vec3(diff.x, uRange - n1, -diff.y)), vec3(uLimit));
        vec3 mult = vec3(mask4);
        position = mult.x * b0 + mult.y * b1 + mult.z * b0 + (1. - dot(mult, mult)) * mix(b0, b1, (diff.x) / (diff.y));
        vec2 deltaX = index2D(128. * (b0 + vec3(k, 0., 0.)));
        vec2 deltaY = index2D(128. * (b0 + vec3(0., k, 0.)));
        vec2 deltaZ = index2D(128. * (b0 + vec3(0., 0., k)));
        normal = normalize(vec3(n0 - texture2D(uPot, deltaX).r, n0 - texture2D(uPot, deltaY).r, n0 - texture2D(uPot, deltaZ).r));
        deltaX = index2D(128. * (b1 + vec3(k, 0., 0.)));
        deltaY = index2D(128. * (b1 + vec3(0., k, 0.)));
        deltaZ = index2D(128. * (b1 + vec3(0., 0., k)));
        vec3 normal1 = normalize(vec3(n1 - texture2D(uPot, deltaX).r, n1 - texture2D(uPot, deltaY).r, n1 - texture2D(uPot, deltaZ).r));
        normal = (n0 * normal + n1 * normal1) / (n0 + n1);
}

void main(void) {

    float marchVI = floor(vVI * 0.25);
    vec4 data = texture2D(marchTex, vec2(mod(marchVI, 2048.) + 0.5, 0.5 + floor(marchVI * div)) * div);
    float initIndex = 12. * data.a + 3. * mod(vVI, 4.);

    float mcIndex = 0.;
    vec3 position = vec3(0.);
    vec3 normal = vec3(0.);

    triangleData(initIndex, data.rgb, position, normal, mcIndex);
    gl_FragData[0] = vec4(position, mcIndex);
    gl_FragData[3] = vec4(normal, 1.);

    triangleData(initIndex + 1., data.rgb, position, normal, mcIndex);
    gl_FragData[1] = vec4(position, 1.);
    gl_FragData[4] = vec4(normal, 1.);

    triangleData(initIndex + 2., data.rgb, position, normal, mcIndex);
    gl_FragData[2] = vec4(position, 1.);
    gl_FragData[5] = vec4(normal, 1.);
 }