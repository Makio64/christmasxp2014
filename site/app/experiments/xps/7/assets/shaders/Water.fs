#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

uniform sampler2D reflection;
uniform vec3 ambient1;
uniform vec3 ambient2;
uniform vec3 light;
uniform vec3 sun;
uniform float time;
uniform float fogNear;
uniform float fogFar;
uniform float disableRefl;
uniform vec3 fogColor;
uniform vec3 orbColor;

varying vec3 vViewPosition;
varying vec4 vMirrorCoord;
varying float vInteract;
varying vec3 vPos;

float range(float oldValue, float oldMin, float oldMax, float newMin, float newMax) {
    float oldRange = oldMax - oldMin;
    float newRange = newMax - newMin;
    return (((oldValue - oldMin) * newRange) / oldRange) + newMin;
}

void main() {
    vec3 color = vec3(0.0);
    
    vec4 mirrorCoord = vMirrorCoord;
    vec3 texel = vec3(0.0);
    
    vec3 normal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
    vec3 lightPos = normalize(light);
    float lDot = dot(normal, lightPos);
    float volume = max(0.0, lDot);
    
    vec3 lightColor = mix(ambient1, ambient2, volume);
    
    if (disableRefl < 0.2) {
        texel = texture2DProj(reflection, mirrorCoord).rgb;
        vec3 mixColor = mix(lightColor, texel, length(texel));
        lightColor = mix(lightColor, mixColor, 0.25);
    }
    
    float depth = abs(2500.0 - vPos.z);
    float fogFactor = smoothstep(fogNear, fogFar, depth);
    
    lightColor += orbColor * (vInteract * 0.9);
    
    gl_FragColor = vec4(lightColor, 1.0);
    gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
}