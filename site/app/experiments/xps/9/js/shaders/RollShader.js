THREE.RollShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"globalTime": { type: "f", value: 0.0 },
		"strength": { type: "f", value: 1.0 },

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform float globalTime;",
		"uniform float strength;",
		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"vec3 getVideo(vec2 uv) {",
			"vec2 look = uv;",
			"float window = 1.0/(1.0+20.0*(look.y-mod(globalTime/4.0,1.0))*(look.y-mod(globalTime/4.0,1.0)));",
			"look.x = look.x + sin(look.y*10.0 + globalTime)/50.0*strength*(1.0+cos(globalTime*80.0))*window;",
			"float vShift = 0.4*strength*(sin(globalTime)*sin(globalTime*20.0) + (0.5 + 0.1*sin(globalTime*200.0)*cos(globalTime)));",
			"look.y = mod(look.y + vShift, 1.0);",
			"vec3 video = vec3(texture2D(tDiffuse,look));",
			"return video;",
		"}",

		"void main() {",

			"gl_FragColor = vec4(getVideo(vUv),1.0);",

		"}"

	].join("\n")

};
