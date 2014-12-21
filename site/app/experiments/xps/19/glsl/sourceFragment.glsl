
uniform float fogDensity;
uniform float fogNear;
uniform float fogFar;
uniform vec3 fogColor;
varying vec3 vPos;
varying vec3 vNormale;
varying float vDist;

void main() {

	vec3 light = vec3(0.5, 0.2, 1.0);
	light = normalize(light);
	float dProd = max(0.2,dot(vNormale, light));
    
    float factor = smoothstep(0.,10.,vDist);
    vec3 color = mix(vec3(1.,1.,1.),vec3(.0,.0,.0),factor);
    // vec3 color = vec3(dProd,dProd,dProd);

    gl_FragColor = vec4( color+dProd*vec3(0.1,0.1,1.), .2 );

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