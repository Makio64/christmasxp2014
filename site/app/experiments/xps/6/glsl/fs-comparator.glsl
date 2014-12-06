precision highp float;
precision highp sampler2D;

uniform sampler2D uTV1;
uniform sampler2D uTV2;
uniform sampler2D uTV3;

void main() {

    vec2 position = floor(gl_FragCoord.xy) / 1024.;
    vec3 vertex1 = texture2D(uTV1, position).rgb;
    vec3 vertex2 = texture2D(uTV2, position).rgb;
    vec3 vertex3 = texture2D(uTV3, position).rgb;

    bvec3 compare1 = equal(vertex1, vertex2);
    bvec3 compare2 = equal(vertex1, vertex3);
    compare1.x = compare1.x && compare2.x;
    compare1.y = compare1.y && compare2.y;
    compare1.z = compare1.z && compare2.z;

    vec3 result = vec3(compare1);

    gl_FragColor = vec4(vec3(1.) - result, 1.);
}