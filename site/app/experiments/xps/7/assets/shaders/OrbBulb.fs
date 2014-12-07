varying vec3 vPos;

uniform float radius;
uniform vec3 color;

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

float findMax(vec3 c) {
    float v = 0.0;
    if (c.r > v) v = c.r;
    if (c.g > v) v = c.g;
    if (c.b > v) v = c.b;
    return v;
}

float findMin(vec3 c) {
    float v = 9999.0;
    if (c.r < v) v = c.r;
    if (c.g < v) v = c.g;
    if (c.b < v) v = c.b;
    return v;
}

vec3 rgbToHSL(vec3 c) {
    float maxV = findMax(c);
    float minV = findMin(c);
    
    float h = (maxV + minV) / 2.0;
    float s = h;
    float l = h;
    
    if (maxV == minV) {
        h = 0.0;
        s = 0.0;
    } else {
        float d = maxV - minV;
        s = l > 0.5 ? d / (2.0 - maxV - minV) : d / (maxV + minV);
        if (maxV == c.r) h = (c.g - c.b) / d + (c.g < c.b ? 6.0 : 0.0);
        if (maxV == c.g) h = (c.b - c.r) / d + 2.0;
        if (maxV == c.b) h = (c.r - c.g) / d + 4.0;
        h /= 6.0;
    }
    
    return vec3(h, s, l);
}

void main() {
    
    vec3 hsl = rgbToHSL(color);
    hsl.y += abs(normalize(vPos).x) * 0.3;
    hsl.z -= abs(normalize(vPos).y) * 0.1;
    hsl.x += abs(normalize(vPos).z) * 0.05;
    
    float alpha = 1.0 * range(abs(vPos.y), 0.0, radius, 0.85, 0.9);
    
    
    gl_FragColor = vec4(setHSL(hsl), alpha);
}