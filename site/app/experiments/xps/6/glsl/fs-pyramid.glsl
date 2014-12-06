precision mediump float;
 precision mediump sampler2D;
 uniform sampler2D uPyT;
 uniform float uSize;
 void main(void) {
     float k = 0.5 * uSize;
     vec2 position = floor(vec2(gl_FragCoord.x, gl_FragCoord.y)) * uSize;
     gl_FragColor = vec4(texture2D(uPyT,  position + vec2(0., 0.)).r + texture2D(uPyT,  position + vec2(0., k)).r + texture2D(uPyT,  position + vec2(k, 0.)).r + texture2D(uPyT,  position + vec2(k, k)).r);
 }