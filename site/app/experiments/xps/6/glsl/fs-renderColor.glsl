precision highp sampler2D;
precision highp float;

uniform vec3 uEye;
uniform sampler2D uPot;
uniform sampler2D uPotLow;

uniform sampler2D uTT;
uniform sampler2D uTN;

uniform sampler2D uExplosion;

uniform samplerCube uEnv;

varying vec3 vNor;
varying vec2 vIndex;
varying vec4 vColor;
varying vec3 vPos;
varying float vPrint;

uniform float uRefract;
uniform float uPow;
uniform bool uBreakAtFirst;

uniform vec3 uColor;
uniform vec3 uColorReflect;
uniform vec3 uColorRefract;

uniform int uMaxSteps;
uniform int uBounces;
uniform bool uUseRefractColor;

const float EPSILON = 0.000001;

vec2 index2D(vec3 pos) {
    return 0.00048828125 * (pos.xy + 128. * vec2(mod(pos.z, 16.), floor(pos.z * 0.0625)) + vec2(0.5));
}

vec3 lightShade(vec3 matColor, vec3 light, vec3 eye, vec3 norm) {
    return (0.7 * max((dot(light, norm)), 0.) * matColor + 1.2 * vec3(1.) * max(pow(dot(normalize(reflect(light, norm)), eye), 10.), 0.));
}

vec2 index2048(float index) {
    return 0.00048828125 * vec2(mod(index, 2048.) + 0.5, floor(index * 0.00048828125) + 0.5);
}

float triangleIntersect(float index, vec3 rayOrigin, vec3 rayDir, out float param) {
    param = -1.;
    vec3 v1 = texture2D(uTT, index2048(index)).rgb;
    vec3 v2 = texture2D(uTT, index2048(index + 1.)).rgb;
    vec3 v3 = texture2D(uTT, index2048(index + 2.)).rgb;
    vec3 e1 = v2 - v1;
    vec3 e2 = v3 - v1;
    vec3 p = cross(rayDir, e2);
    float det = dot(e1, p);
    float invDet = 1. / (sign(det) * max(abs(det), EPSILON));
    vec3 t = rayOrigin - v1;
    float u = dot(t, p) * invDet;
    vec3 q = cross(t, e1);
    float v = dot(rayDir, q) * invDet;
    float dist = dot(e2, q) * invDet;
    if(dist > EPSILON && abs(det) > EPSILON && u > 0. && u < 1. && v > 0. && u + v < 1.) {
        param = dist;
        return 1.;
    }
    return 0.;
}


void main(void) {
    vec3 eye = normalize(vPos - uEye);
    vec3 light = vec3(0.);
    vec3 mainColor = uColor;
    vec3 color = lightShade(uUseRefractColor ? uColorRefract : textureCube(uEnv, reflect(eye, vNor)).rgb, normalize(light - vPos), eye, vNor);
    int bounces = 0;

    vec3 dir = normalize(refract(eye, vNor, uRefract));

    vec3 reflectColor = lightShade(uUseRefractColor ? uColorRefract : textureCube(uEnv, reflect(eye, vNor)).rgb, normalize(light - vPos), eye, vNor);
    vec3 halfAng = normalize(light + eye);
    float r0 = (1. - uRefract) / (1. + uRefract);
    r0 *= r0;
    float R = r0 + (1. - r0) * pow((1. - max(dot(halfAng, eye), 0.)), uPow);

    vec3 deltaDist = abs(vec3(length(dir)) / dir);
    vec3 rayStep = sign(dir);

    vec3 initPos = vPos;
    vec3 pos = 128. * initPos;
    vec3 mapPos = floor(pos);
    vec3 sideDist = (rayStep * (mapPos - pos) + (rayStep * 0.5) + 0.5) * deltaDist;

    const int max = 192;
    bvec3 mask;
    for(int i = 0; i < max; i ++) {

        if(i > uMaxSteps) break;

        bvec3 b1 = lessThan(sideDist.xyz, sideDist.yzx);
        bvec3 b2 = lessThanEqual(sideDist.xyz, sideDist.zxy);
        mask.x = b1.x && b2.x;
        mask.y = b1.y && b2.y;
        mask.z = b1.z && b2.z;
        sideDist += vec3(mask) * deltaDist;
        mapPos += floor(vec3(mask) * rayStep);

        float voxelIndex = texture2D(uPot, index2D(mapPos)).r;
        if(length(dir) == 0. || uBounces == 0) break;

        if(voxelIndex > 0.)  {
            voxelIndex *= 12.;
            vec4 param = vec4(0.);
            vec4 t = vec4(triangleIntersect(voxelIndex, initPos, dir, param.x), triangleIntersect(voxelIndex + 3., initPos, dir, param.y), triangleIntersect(voxelIndex + 6., initPos, dir, param.z), triangleIntersect(voxelIndex + 9., initPos, dir, param.w));
            float comparator = dot(t, param);
            float index = voxelIndex + dot(t, vec4(0., 3., 6., 9.));

            if(comparator > 0.) {
                vec3 prevPos = initPos;
                initPos = initPos + dir * comparator;
                vec3 r1 = texture2D(uTT, index2048(index)).rgb;
                vec3 r2 = texture2D(uTT, index2048(index + 1.)).rgb;
                vec3 r3 = texture2D(uTT, index2048(index + 2.)).rgb;
                vec3 n1 = texture2D(uTN, index2048(index)).rgb;
                vec3 n2 = texture2D(uTN, index2048(index + 1.)).rgb;
                vec3 n3 = texture2D(uTN, index2048(index + 2.)).rgb;

                vec3 h0 = r3 - r1;
                vec3 h1 = r2 - r1;
                vec3 h2 = initPos - r1;
                float d00 = dot(h0, h0);
                float d01 = dot(h0, h1);
                float d11 = dot(h1, h1);
                float d20 = dot(h2, h0);
                float d21 = dot(h2, h1);
                float denom = 1. / (d00 * d11 - d01 * d01);
                float v = (d11 * d20 - d01 * d21) * denom;
                float w = (d00 * d21 - d01 * d20) * denom;
                float u = 1.0 - v - w;

                dir = normalize(u * n1 + w * n2 + v * n3);
                eye = normalize(initPos - uEye);
                vec3 tColor = R * reflectColor + (1. - R) * lightShade(uUseRefractColor ? uColorRefract : textureCube(uEnv, reflect(eye, dir)).rgb, normalize(light - initPos), eye, dir);

                color = mix(color, tColor, (3.5 - float(uBounces)) / 4.);

                dir = normalize(refract(initPos - prevPos, dir, uRefract));
                deltaDist = abs(vec3(length(dir)) / dir);
                rayStep = sign(dir);
                mapPos = floor(128. * initPos);
                sideDist = (rayStep * (mapPos - 128. * initPos) + (rayStep * 0.5) + 0.5) * deltaDist;

                bounces++;

                if(bounces >= uBounces) break;
            }
        }
    }

    color = vec3(pow(color.x, 0.4545), pow(color.y, 0.4545), pow(color.z, 0.4545));
    gl_FragColor = vec4(color, 1.);
}