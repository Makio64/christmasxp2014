attribute float range;
attribute float speed;
attribute float startAngle;
attribute float interact;

uniform float distort;
uniform float time;
uniform mat4 textureMatrix;

varying vec3 vViewPosition;
varying vec4 vMirrorCoord;
varying float vInteract;
varying vec3 vPos;

void main() {
    vec3 deform = position;
    vec3 pos = position;
    pos.y = sin(startAngle + (time * speed)) * range;
    deform.y = -2000.0;
    
    if (distort > 0.1) pos = mix(pos, deform, interact);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vMirrorCoord = textureMatrix * worldPosition;
    
    vInteract = interact;
    vPos = worldPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
}