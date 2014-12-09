THREE.FilmGrainShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"size":    { type: "v2", value: new THREE.Vector2( 512, 512 ) },
		"globalTime":{ type: "f", value: 0.0 },
		"amount":{ type: "f", value: 0.13 },
		"colored":{ type: "i", value: 0 },

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform vec2 size;",
		"uniform sampler2D tDiffuse;",
		"uniform float globalTime;",
		"uniform float amount;",
		"uniform int colored;",

		"varying vec2 vUv;",

		"const float permTexUnit = 1.0/256.0;",		// Perm texture texel-size
		"const float permTexUnitHalf = 0.5/256.0;",	// Half perm texture texel-size

		//a random texture generator, but you can also use a pre-computed perturbation texture
		"vec4 rnm(in vec2 tc) {",
		    "float noise =  sin(dot(tc + vec2(globalTime,globalTime),vec2(12.9898,78.233))) * 43758.5453;",

			"float noiseR =  fract(noise)*2.0-1.0;",
			"float noiseG =  fract(noise*1.2154)*2.0-1.0;",
			"float noiseB =  fract(noise*1.3453)*2.0-1.0;",
			"float noiseA =  fract(noise*1.3647)*2.0-1.0;",
			
			"return vec4(noiseR,noiseG,noiseB,noiseA);",
		"}",

		"float fade(in float t) {",
			"return t*t*t*(t*(t*6.0-15.0)+10.0);",
		"}",

		"float pnoise3D(in vec3 p) {",
			"vec3 pi = permTexUnit*floor(p)+permTexUnitHalf;", // Integer part, scaled so +1 moves permTexUnit texel
			// and offset 1/2 texel to sample texel centers
			"vec3 pf = fract(p);",     // Fractional part for interpolation

			// Noise contributions from (x=0, y=0), z=0 and z=1
			"float perm00 = rnm(pi.xy).a;",
			"vec3  grad000 = rnm(vec2(perm00, pi.z)).rgb * 4.0 - 1.0;",
			"float n000 = dot(grad000, pf);",
			"vec3  grad001 = rnm(vec2(perm00, pi.z + permTexUnit)).rgb * 4.0 - 1.0;",
			"float n001 = dot(grad001, pf - vec3(0.0, 0.0, 1.0));",

			// Noise contributions from (x=0, y=1), z=0 and z=1
			"float perm01 = rnm(pi.xy + vec2(0.0, permTexUnit)).a;",
			"vec3  grad010 = rnm(vec2(perm01, pi.z)).rgb * 4.0 - 1.0;",
			"float n010 = dot(grad010, pf - vec3(0.0, 1.0, 0.0));",
			"vec3  grad011 = rnm(vec2(perm01, pi.z + permTexUnit)).rgb * 4.0 - 1.0;",
			"float n011 = dot(grad011, pf - vec3(0.0, 1.0, 1.0));",

			// Noise contributions from (x=1, y=0), z=0 and z=1
			"float perm10 = rnm(pi.xy + vec2(permTexUnit, 0.0)).a;",
			"vec3  grad100 = rnm(vec2(perm10, pi.z)).rgb * 4.0 - 1.0;",
			"float n100 = dot(grad100, pf - vec3(1.0, 0.0, 0.0));",
			"vec3  grad101 = rnm(vec2(perm10, pi.z + permTexUnit)).rgb * 4.0 - 1.0;",
			"float n101 = dot(grad101, pf - vec3(1.0, 0.0, 1.0));",

			// Noise contributions from (x=1, y=1), z=0 and z=1
			"float perm11 = rnm(pi.xy + vec2(permTexUnit, permTexUnit)).a;",
			"vec3  grad110 = rnm(vec2(perm11, pi.z)).rgb * 4.0 - 1.0;",
			"float n110 = dot(grad110, pf - vec3(1.0, 1.0, 0.0));",
			"vec3  grad111 = rnm(vec2(perm11, pi.z + permTexUnit)).rgb * 4.0 - 1.0;",
			"float n111 = dot(grad111, pf - vec3(1.0, 1.0, 1.0));",

			// Blend contributions along x
			"vec4 n_x = mix(vec4(n000, n001, n010, n011), vec4(n100, n101, n110, n111), fade(pf.x));",

			// Blend contributions along y
			"vec2 n_xy = mix(n_x.xy, n_x.zw, fade(pf.y));",

			// Blend contributions along z
			"float n_xyz = mix(n_xy.x, n_xy.y, fade(pf.z));",

			// We're done, return the final noise value.
			"return n_xyz;",
		"}",


		"void main() {",

			"vec3 noise = vec3(pnoise3D(vec3(vUv*vec2(size.x,size.y),0.0)));",
		  
			"if (colored == 1) {",
				"noise.g = pnoise3D(vec3(vUv*vec2(size.x,size.y),1.0));",
				"noise.b = pnoise3D(vec3(vUv*vec2(size.x,size.y),2.0));",
			"}",
			"vec3 col = texture2D(tDiffuse, vUv).rgb;",
		  
			"col = col+noise*amount;",
		   
			"gl_FragColor =  vec4(col,1.0);",
			
		"}"

	].join("\n")

};
