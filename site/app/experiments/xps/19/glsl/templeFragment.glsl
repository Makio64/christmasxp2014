varying vec2 vUv;
varying float vY;
uniform sampler2D bumpMap;
uniform sampler2D map;
uniform float fogDensity;
uniform float fogNear;
uniform float fogFar;
uniform vec3 fogColor;

void main() {
	vec3 color = texture2D( map, vUv ).rgb;
	if(vY == 0.){
		discard;
	}
    gl_FragColor = vec4( color, 1. );

	#ifdef USE_FOG

		#ifdef USE_LOGDEPTHBUF_EXT

			float depth = gl_FragDepthEXT / gl_FragCoord.w;

		#else

			float depth = gl_FragCoord.z / gl_FragCoord.w;

		#endif

		#ifdef FOG_EXP2

			const float LOG2 = 1.442695;
			float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
			fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );

		#else

			float fogFactor = smoothstep( fogNear, fogFar, depth );

		#endif
		
		gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

	#endif
}