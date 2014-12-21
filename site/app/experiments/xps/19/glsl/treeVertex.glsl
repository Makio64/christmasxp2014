uniform float windForce;
varying float posY;

void main() {
	posY = position.y;
	float f = windForce * smoothstep(-10.0,200.,position.y);
	vec2 forceOrigin = vec2(0,0);
	float angle = atan(forceOrigin.y - position.z, forceOrigin.x - position.x);
	float fX = cos(angle) * f;
	float fZ = sin(angle) * f;
	vec4 pos = vec4(position.x + fX, position.y, position.z + fZ, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * pos;

}