precision mediump float;
precision mediump sampler2D;
uniform sampler2D uDT;
uniform float uSR;
uniform vec3 uAxis;
varying vec2 vText;
void main(void) {
    vec3 blend = texture2D(uDT, vText - uAxis.xy).rgb;
    blend += uSR * texture2D(uDT, vText).rgb;
    blend += texture2D(uDT, vText + uAxis.xy).rgb;
    blend /= (2. +  uSR);
    gl_FragColor = vec4(blend, 1.);
}