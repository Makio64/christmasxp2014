attribute float aVI;
 varying vec2 vText;
 void main(void) {
     float vI = aVI + 1.;
     vec2 xy = vec2(mod(vI, 2.) == 0. ? 1. : -1., -1. + 2. * step(-vI, -2.1));
     vText = xy * 0.5 + 0.5;
     gl_Position = vec4(xy, 0.0, 1.0);
 }