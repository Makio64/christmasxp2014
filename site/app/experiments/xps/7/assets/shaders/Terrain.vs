varying vec3 vPos;
varying float vSnowHeight;
varying float vOrb;
varying vec3 vViewPosition;
varying vec4 vmvPosition;
varying mat3 vNormalMatrix;
varying vec3 vWorldPos;

attribute float snowHeight;
attribute float interact;

uniform vec3 light;
uniform vec3 orbPosition;

void main() {
    vPos = position;
    vSnowHeight = snowHeight;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vmvPosition = mvPosition;
    vNormalMatrix = normalMatrix;
    
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    
    vOrb = interact;
    
    gl_Position = projectionMatrix * mvPosition;
}