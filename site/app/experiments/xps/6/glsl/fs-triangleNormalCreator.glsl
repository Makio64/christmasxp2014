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
 void main(void) {
     float marchVI = floor(vVI * 0.08333333333);
     vec4 data = texture2D(marchTex, vec2(mod(marchVI, 2048.) + 0.5, 0.5 + floor(marchVI * div)) * div);
     float mcIndex = 12. * data.a + mod(vVI, 12.);
     mcIndex = texture2D(uTI, 0.015625 * vec2(mod(mcIndex, 64.) + 0.5, floor(mcIndex * 0.015625) + 0.5)).r;
     bvec4 mask1 = equal(vec4(mcIndex), vec4(0., 1., 2., 3.));
     bvec4 mask2 = equal(vec4(mcIndex), vec4(4., 5., 6., 7.));
     bvec4 mask3 = equal(vec4(mcIndex), vec4(8., 9., 10., 11.));
     vec4 m1 = vec4(mask1);
     vec4 m2 = vec4(mask2);
     vec4 m3 = vec4(mask3);
     vec3 b0 = data.rgb + m1.y * vec3(k, 0., 0.) + m1.z * vec3(k, k, 0.) + m1.w * vec3(0., k, 0.) + m2.x * vec3(0., 0., k) + m2.y * vec3(k, 0., k) + m2.z * vec3(k, k, k) + m2.w * vec3(0., k, k) + m3.x * vec3(0., 0., 0.) + m3.y * vec3(k, 0., 0.) + m3.z * vec3(k, k, 0.) + m3.w * vec3(0., k, 0.);
     vec3 b1 = data.rgb + m1.x * vec3(k, 0., 0.) + m1.y * vec3(k, k, 0.) + m1.z * vec3(0., k, 0.) + m2.x * vec3(k, 0., k) + m2.y * vec3(k, k, k) + m2.z * vec3(0., k, k) + m2.w * vec3(0., 0., k) + m3.x * vec3(0., 0., k) + m3.y * vec3(k, 0., k) + m3.z * vec3(k, k, k) + m3.w * vec3(0., k, k);
     float n0 = texture2D(uPot, index2D(128. * b0)).r;
     float n1 = texture2D(uPot, index2D(128. * b1)).r;
     vec2 deltaX = index2D(128. * (b0 + vec3(k, 0., 0.)));
     vec2 deltaY = index2D(128. * (b0 + vec3(0., k, 0.)));
     vec2 deltaZ = index2D(128. * (b0 + vec3(0., 0., k)));
     vec3 normal = normalize(vec3(n0 - texture2D(uPot, deltaX).r, n0 - texture2D(uPot, deltaY).r, n0 - texture2D(uPot, deltaZ).r));
     deltaX = index2D(128. * (b1 + vec3(k, 0., 0.)));
     deltaY = index2D(128. * (b1 + vec3(0., k, 0.)));
     deltaZ = index2D(128. * (b1 + vec3(0., 0., k)));
     vec3 normal1 = normalize(vec3(n1 - texture2D(uPot, deltaX).r, n1 - texture2D(uPot, deltaY).r, n1 - texture2D(uPot, deltaZ).r));
     gl_FragColor = vec4((n0 * normal + n1 * normal1) / (n0 + n1), mcIndex);
 }