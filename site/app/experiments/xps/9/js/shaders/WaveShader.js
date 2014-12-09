THREE.WaveShader = {

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

		"void main() {",

			"float y = 0.7*sin((vUv.y + globalTime) * 4.0) * 0.038 + 0.3*sin((vUv.y + globalTime) * 8.0) * 0.010 +	0.05*sin((vUv.y + globalTime) * 40.0) * 0.05;",
			"float x = 0.5*sin((vUv.y + globalTime) * 5.0) * 0.1 + 0.2*sin((vUv.x + globalTime) * 10.0) * 0.05 + 0.2*sin((vUv.x + globalTime) * 30.0) * 0.02;",

			"gl_FragColor = texture2D(tDiffuse, 0.79*(vUv + vec2(y+0.11, x+0.11)*strength));",

		"}"

	].join("\n")

};
