#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

varying vec3 vPos;
varying float vSnowHeight;
varying float vOrb;
varying vec3 vViewPosition;
varying vec4 vmvPosition;
varying mat3 vNormalMatrix;
varying vec3 vWorldPos;

uniform vec3 ambient1;
uniform vec3 ambient2;
uniform vec3 light;
uniform float fogNear;
uniform float fogFar;
uniform vec3 fogColor;
uniform vec3 orbColor;
uniform float snowMult;
uniform float cameraZ;

void main() {
    vec3 color = vec3(0.0);
    
    vec3 tNormal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
    vec3 transformedNormal = vNormalMatrix * tNormal;
    vec4 lPosition = viewMatrix * vec4(light, 1.0);
    vec3 lVector = lPosition.xyz - vmvPosition.xyz;
    lVector = normalize(lVector);
    float lightDot = dot(normalize(transformedNormal), lVector);
    
    float lDot = lightDot;
    float volume = max(0.1, lDot);
    
    vec3 lightColor = mix(ambient1, ambient2, volume - 0.2);
    
    vec3 mixColor = lightColor * volume;
    
    color += mix(lightColor, mixColor, volume);
    
    if (vPos.y > vSnowHeight * snowMult) {
        color = lightColor;
        color = mix(color, vec3(1.0), 0.4);
    }
    
    color += orbColor * 1.1 * vOrb;
        
    float depth = abs(cameraZ - vWorldPos.z);
    float fogFactor = smoothstep(fogNear, fogFar, depth);
    
    gl_FragColor = vec4(color, 1.0);
    gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
}