// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

precision highp float;
precision highp sampler2D;

uniform float uFrame;
uniform sampler2D uNoise;

varying vec2 vText;


float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);

	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = texture2D( uNoise, (uv+ 0.5)/256.0, -100.0 ).yx;
	return mix( rg.x, rg.y, f.z );
}


vec4 map( in vec3 p )
{
	float d = 1.0 - 2.6 * p.y;

	vec3 q = p - vec3(1.0,0.1,0.0)* uFrame;
	float f;
    f  = 0.5000*noise( q ); q = q*2.02;
    f += 0.2500*noise( q ); q = q*2.03;
    f += 0.1250*noise( q ); q = q*2.01;
    f += 0.0625*noise( q );

	d += 6.0 * f;

	d = clamp( d, 0., 1.0);

	vec4 res = vec4( d );

	res.xyz = mix( 1.15*vec3(1.0,0.95,0.8), vec3(0.8), res.x );

	return res;
}


vec3 sundir = vec3(-1.0,0.0,0.0);


vec4 raymarch( in vec3 ro, in vec3 rd )
{
	vec4 sum = vec4(0, 0, 0, 0);

	float t = 0.0;
	for(int i=0; i<32; i++)
	{
		if( sum.a > 0.99 ) continue;

		vec3 pos = ro + t*rd;
		vec4 col = map( pos );

		#if 1
		float dif =  clamp((col.w - map(pos + 0.3*sundir).w)/0.9, 0.0, 1.0 );

        vec3 lin = vec3(0.65,0.68,0.7) * 1.35 + 0.5*vec3(0.7, 0.5, 0.3)*dif;
		col.xyz *= lin;
		#endif

		col.a *= 0.2;
		col.rgb *= col.a;

		sum = sum + col*(1.0 - sum.a);


		t += 0.1;

	}

	sum.xyz /= (0.001+sum.w);

	return clamp( sum, 0.0, 1.0 );
}

void main(void)
{
	vec2 q = vText;
    vec2 p = -1.0 + 2.0*q;

    // camera
    vec3 ro = 4.0*normalize(vec3(cos(0.5), 0.5, sin(0.5)));
	vec3 ta = vec3(0.0, 1.0, 0.0);
    vec3 ww = normalize( ta - ro);
    vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));
    vec3 vv = normalize(cross(ww,uu));
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );


    vec4 res = raymarch( ro, rd );

	float sun = clamp( dot(sundir,rd), 0.0, 1.0 );
	vec3 col = vec3(80., 90., 130.)/255. - rd.y * 0.1 * vec3(1.0,0.5,1.0) + 0.15*0.5;
	col *= 0.95;
	col = mix( col, res.xyz, res.w );


    gl_FragColor = vec4( col, 1.0 );
}
