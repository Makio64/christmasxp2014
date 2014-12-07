uniform float size;

attribute float alpha;
attribute float scale;
attribute float mixValue;

varying float vAlpha;
varying float vMix;

void main() {
    vAlpha = alpha;
    vMix = mixValue;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * scale;
    gl_Position = projectionMatrix * mvPosition;
}