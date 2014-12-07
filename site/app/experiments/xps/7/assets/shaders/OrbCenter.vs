varying vec3 vColor;

uniform float radius;

vec3 desaturate(vec3 color, float amount) {
    vec3 gray = vec3(dot(vec3(0.2126,0.7152,0.0722), color));
    return vec3(mix(color, gray, amount));
}

void main() {
    vec3 mag = abs(normalize(position));
    mag = max(vec3(0.1), mag);
    vColor = desaturate(mag, 1.0) * 0.6;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}