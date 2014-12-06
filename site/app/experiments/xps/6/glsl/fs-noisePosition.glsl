precision highp float;
varying vec4 vD;
varying vec2 vV2I;
uniform sampler2D uPT;
uniform bool uSetRot;


mat3 rotX(float angle) {
    angle = radians(angle);
    return mat3(1.0, 0.0, 0.0,
                0.0, cos(angle), -sin(angle),
                0.0, sin(angle), cos(angle));
}

void main(void) {
    vec3 position = texture2D(uPT, vV2I).rgb;

    if(uSetRot) {
        position *= rotX(0.);
        //position += vD.rgb - vec3(0., -0.94, 0.);
        position += vD.rgb;
    } else {
        position += vD.rgb;
    }

    gl_FragColor = vec4(position, 0.);
}