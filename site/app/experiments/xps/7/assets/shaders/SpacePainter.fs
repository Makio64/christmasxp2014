uniform sampler2D map;
uniform sampler2D palette;
uniform float area;
uniform float opacity;

varying vec3 vPos;
varying float vAlpha;

float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    float oldRange = oldMax - oldMin;
    float newRange = newMax - newMin;
    return (((oldValue - oldMin) * newRange) / oldRange) + newMin;
}

vec3 desaturate(vec3 color, float amount) {
    vec3 gray = vec3(dot(vec3(0.2126,0.7152,0.0722), color));
    return vec3(mix(color, gray, amount));
}

vec2 getUV() {
    vec2 uv = vec2(0.0);
    uv.x = clamp(range(vPos.x, -area, area, 0.0, 1.0), 0.0, 1.0);
    uv.y = clamp(range(vPos.y, area, -area, 1.0, 0.0), 0.0, 1.0);
    return uv;
}

void main() {
    
    vec3 color = texture2D(palette, getUV()).rgb;
    
    float desat = clamp((abs(vPos.z) / 20000.0), 0.0, 0.7);
    
    vec4 texel = texture2D(map, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));
    texel.rgb *= color;
    
    texel.a *= opacity;
    texel.a *= vAlpha;
    
    texel.a *= 1.0 + desat;
    texel.a = clamp(texel.a, 0.0, 0.9);
    
    if (length(color) < 0.4) texel.rgb *= 3.0;
    
    gl_FragColor = texel;
}