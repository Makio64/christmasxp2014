attribute float alpha;
attribute float opacity;

varying float vOpacity;
varying float vAlpha;
varying vec3 vPos;

uniform float size;

void main() {
    vPos = position;
    vAlpha = alpha;
    vOpacity = opacity;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (4000.0 / length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
}