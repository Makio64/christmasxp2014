precision highp float;
uniform highp sampler2D uPT;
uniform highp sampler2D uVT;
uniform float uDeltaT;
varying vec2 vV2I;
void main(void) {
    vec4 vel = texture2D(uVT, vV2I);
    vec3 nPP = texture2D(uPT, vV2I).rgb + uDeltaT * vel.rgb;
    gl_FragColor = vec4(nPP , 1000. * length(nPP.xy - vec2(0.5)));
}