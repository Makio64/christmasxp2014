attribute float alpha;

varying float vAlpha;

uniform float size;

void main() {
    vAlpha = alpha;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (4000.0 / length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
}