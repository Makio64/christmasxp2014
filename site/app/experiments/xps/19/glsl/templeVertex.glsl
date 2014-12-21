varying vec2 vUv;
varying float vY;
uniform sampler2D bumpMap;
uniform float bumpScale;

void main() {

	vUv = uv;
	vec3 pos = position;
	pos.y += bumpScale * texture2D( bumpMap, uv ).r;
	vY = pos.y;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);

}