varying float vAlpha;
varying vec3 vPos;
varying float vOpacity;

uniform sampler2D map;
uniform float globalAlpha;

float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    float oldRange = oldMax - oldMin;
    float newRange = newMax - newMin;
    return (((oldValue - oldMin) * newRange) / oldRange) + newMin;
}

float hue2rgb(float p, float q, float t) {
    if (t < 0.0) t += 1.0;
    if (t > 1.0) t -= 1.0;
    if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
    if (t < 1.0 / 2.0) return q;
    if (t < 2.0 / 3.0) return p + (q - p) * 6.0 * (2.0 / 3.0 - t);
    return p;
}

vec3 setHSL(vec3 c) {
    float h = c.x;
    float s = c.y;
    float l = c.z;
    
    float p = l <= 0.5 ? l * (1.0 + s) : l + s - (l * s);
    float q = (2.0 * l) - p;
    
    c.r = hue2rgb(q, p, h + 1.0 / 3.0);
    c.g = hue2rgb(q, p, h);
    c.b = hue2rgb(q, p, h - 1.0 / 3.0);
    
    return c;
}


void main() {
    vec4 texel = texture2D(map, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));
    texel.a *= vOpacity;
    texel.a *= vAlpha;
    texel.a *= globalAlpha;
    texel.a *= 0.03;
    
    float hue = 0.0 + range(vPos.x, 0.0, 1200.0, 0.0, 0.25);
    vec3 color = setHSL(vec3(hue, 0.7, 0.5));
    
    texel.rgb *= color;
    
    gl_FragColor = texel;
}