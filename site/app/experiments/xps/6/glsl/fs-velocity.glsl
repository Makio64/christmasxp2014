precision lowp float;
precision lowp sampler2D;
uniform float uTension;
uniform float uK;
uniform float uViscosity;
uniform float uDeltaT;
uniform float uMass;
uniform float uMinPress;
uniform sampler2D uPT;
uniform sampler2D uVT;
uniform sampler2D uMPT;
uniform sampler2D uMVT;
uniform float uGravity;
uniform bool uBox;
varying vec2 vV2I;
const float maxSearch = 0.02734375;
const float divider = 0.00048828125;
const vec3 center = vec3(0.5, 0.5, 0.5);
const vec3 boxSize = vec3(0.49, 0.49, 0.49);
const float wForce = 34270006978.520275;
const float max2 = maxSearch * maxSearch;
void main(void) {
    vec3 pressureForce = vec3(0.0);
    vec3 viscosityForce = vec3(0.0);
    vec3 internalForces = vec3(0.0);
    vec3 surfaceTensionDirection = vec3(0.);
    float surfaceTensionMagnitude = 0.;
    vec4 particleData = texture2D(uPT, vV2I);
    vec3 particlePosition = particleData.rgb;
    vec4 readData = texture2D(uVT, vV2I);
    vec3 velocity = readData.rgb;
    float density = readData.a;
    vec3 gridParticlePosition = floor(particlePosition * 128.);
    float particlePressure = max(uK * (density - 1000.), uMinPress);
    for(int i = 0; i < 3; i++) {
        for(int j = 0; j < 3; j++) {
            for(int k = 0; k < 3; k++) {
                vec3 next = vec3(float(i) - 1., float(j) - 1., float(k) - 1.);
                vec3 nGridPosition = gridParticlePosition + next;
                vec2 nIndex2D = divider * (nGridPosition.xy + 128. * vec2(mod(nGridPosition.z, 16.), floor(nGridPosition.z * 0.0625)) + vec2(0.5));
                vec4 nParticlePosition = texture2D(uMPT, nIndex2D);
                float particles = nParticlePosition.a;
                float invParticles = 1. / max(particles, 1.);
                nParticlePosition.rgb *= invParticles;
                vec3 distance = nParticlePosition.rgb - particlePosition;
                float ratio = length(distance);
                vec4 nData = texture2D(uMVT, nIndex2D) * invParticles;
                float dif = max(maxSearch - ratio, 0.);
                float divider = max(length(distance), 0.0001);
                pressureForce += (0.001 * nParticlePosition.a * (max(uK * (nData.a - 1000.), uMinPress) + particlePressure) * dif * dif) * distance / divider;
                viscosityForce += (0.001 * nParticlePosition.a * dif) * (nData.rgb - velocity);
            }
        }
    }
    internalForces = 0.001 * uMass * wForce * (-0.5 * pressureForce + uViscosity * viscosityForce);
    velocity += uDeltaT * (vec3(0.0, uGravity, 0.0) + internalForces);
    particlePosition += velocity * uDeltaT;
    vec3 xLocal = particlePosition - center;
    vec3 contactPointLocal = min(boxSize, max(-boxSize, xLocal));
    vec3 normal = normalize(sign(contactPointLocal - xLocal));
    vec3 d = abs(particlePosition - center) - boxSize;
    float distance = min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
    float restitution = distance / max(uDeltaT * length(velocity), 0.001);
    if(distance > 0. && uBox) velocity -= ((1.0 + restitution) * dot(velocity, normal) * step(-length(velocity), 0.)) * normal;
    //velocity.z *= 0.9;
    gl_FragColor = vec4(velocity, 0.);
}