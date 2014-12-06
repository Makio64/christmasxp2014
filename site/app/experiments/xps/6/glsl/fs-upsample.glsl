
precision highp sampler2D;
precision highp float;

uniform sampler2D uDT;
uniform float uSize;

varying vec2 vText;

void main(void){
    vec4 color = texture2D(uDT, vText);

    float dist = clamp(length(vText - vec2(0.5)), 0., 1.);
    dist = pow(dist, 0.15);
    vec4 gradient = mix(vec4(1.), vec4(0.), dist);

	gl_FragColor = (color + gradient) * vec4(0.8, 0.9, 0.98, 1.);
}