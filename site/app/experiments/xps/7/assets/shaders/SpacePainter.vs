uniform float size;

attribute float alpha;
attribute float scale;

varying float vAlpha;
varying vec3 vPos;

void main() {
    vPos = position;
    vAlpha = alpha;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (size * scale) * (1000.0 / length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
}