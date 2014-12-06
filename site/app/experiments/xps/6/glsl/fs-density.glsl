precision lowp float;
precision lowp sampler2D;
uniform sampler2D uPT;
uniform sampler2D uMPT;
uniform float uMass;
const float maxSearch = 0.02734375;
const float wDefault = 183340341007698.34;
varying vec2 vV2I;
void main(void) {
    vec3 pP = texture2D(uPT, vV2I).rgb;
    vec3 gPP= floor(128. * pP);
    float den = 0.0;
    for(int i = 0; i < 3; i++) {
        for(int j = 0; j < 3; j++) {
            for(int k = 0; k < 3; k++) {
                vec3 nGP = gPP + vec3(float(i) - 1., float(j) - 1., float(k) - 1.);
                vec4 nGD = texture2D(uMPT, 0.00048828125 * (nGP.xy + 128. * vec2(mod(nGP.z, 16.), floor(nGP.z * 0.0625)) + vec2(0.5)));
                nGD.rgb /= max(nGD.a, 1.);
                float r = length(pP - nGD.rgb);
                float rD = max(maxSearch * maxSearch - r * r, 0.);
                den += nGD.a * rD * rD * rD;
            }
        }
    }
    gl_FragColor = vec4(0., 0., 0., den * uMass * wDefault);
}