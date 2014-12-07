uniform sampler2D map;
uniform float opacity;
uniform vec3 color;

varying float vMix;
varying float vAlpha;

void main() {
    vec4 texel = texture2D(map, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));
    vec3 texColor = texel.rgb;
    
    float alpha = texel.a;
    alpha *= opacity;
    alpha *= vAlpha;

    vec3 c = mix(texColor, color, vMix);

    gl_FragColor = vec4(c, alpha);
}