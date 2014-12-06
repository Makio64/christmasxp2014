/*
 Since float values can not be read in javascript, this shader packs the value in a unsigned byte format.
 This packing only works on 0 to 1 floating numbers, hence the final sum of the histopymirad has to be normalized
 using a max value. This max value is the total cells that could be active in one texture (uMax = 1. / textureSize * textureSize)
 */

 precision highp float;
 precision highp sampler2D;
 uniform sampler2D uPyT;

 //Max cells that could be active in a texture
 uniform float uMax;

 varying vec2 vTextureUV;
 void main(void) {
      vec4 enc = fract(vec4(1., 255., 65025., 160581375.) * texture2D(uPyT, vec2(0.)).r * uMax);
      enc -= enc.yzww * vec4(vec3(0.00392157), 0.);
      gl_FragColor = enc;
 }