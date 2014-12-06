precision highp float;
precision highp sampler2D;

uniform float uSize;
uniform float uRatio;
uniform sampler2D uNoise;

uniform sampler2D uStar;

varying vec2 vText;


float noise( in vec3 x )
{
    vec3 f = fract(x);
    vec3 p = x - f;
    f = f*f*(3.0-2.0*f);
    vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy + vec2(uSize* 0.02, 0.);
    vec2 rg = texture2D(uNoise, (uv + 0.5)/256.0, -100.0 ).yx;
    return mix(rg.x, rg.y, f.z );
}

vec3 computeColour( float density, float radius )
{
    float den = clamp(density, 0., 1.);
    vec3 innerColor = mix(vec3(0.6117, 0.827, 1.), vec3(1.), den);
    vec3 outerColor = mix(vec3(0.2784, 0.1254, 0.3451), vec3(0.), 1. - den);
	vec3 result = mix(outerColor, innerColor, density);
	return result;
}

float densityFn( in vec3 p, in float r, out float rawDens, in float rayAlpha )
{

    float den = (clamp(uRatio, 0., 6.) - r);
    float f;
    vec3 q = p;  f  = 0.50000 * noise( q );
	q = q * 2.02; f += 0.25000 * noise( q );
	q = q * 2.03; f += 0.12500 * noise( q );
	q = q * 2.01; f += 0.06250 * noise( q );
	q = q * 2.05; f += 0.03125 * noise( q );

	rawDens = den - 6. * f;

    den = clamp(rawDens, 0., 1.);

	return den;
}

vec4 raymarch( in vec3 rayo, in vec3 rayd)
{
    vec4 sum = vec4( 0.0 );

    float step = 0.05;

	vec3 pos = rayo + rayd * (step *  texture2D(uNoise, vText).x);

    for( int i=0; i< 128; i++ )
    {
        if( sum.a > 0.99 ) continue;
		float radiusFromExpCenter = length(pos - vec3(0.0));
		float dens, rawDens;
        dens = densityFn( pos, radiusFromExpCenter, rawDens, sum.a );
		vec4 col = vec4( computeColour(dens,radiusFromExpCenter), dens );
		col.a *= 0.6;
		col.rgb *= col.a;
		sum += col * (1.0 - sum.a);
		pos += rayd * step;
    }

    return clamp( sum, 0.0, 1.0 );
}

vec3 computePixelRay( in vec2 p, out vec3 cameraPos )
{

    float camRadius = 3.5;

	float theta = -(vText.x) / 80.;
    float xoff = camRadius * cos(theta);
    float zoff = camRadius * sin(theta);
    cameraPos = vec3(xoff,0.,zoff);


    vec3 target = vec3(0.,0.,0.);

    vec3 fo = normalize(target-cameraPos);
    vec3 ri = normalize(vec3(fo.z, 0., -fo.x ));
    vec3 up = normalize(cross(fo,ri));

    float fov = .37;

    vec3 rayDir = normalize(fo + fov*p.x*ri + fov*p.y*up);

	return rayDir;
}

void main(void)
{
    vec2 p = -1.0 + 2.0 * vText;

	vec3 rayDir, cameraPos;

    rayDir = computePixelRay( p, cameraPos );

	vec4 col = vec4(0.);

	col = raymarch( cameraPos, rayDir);

    gl_FragColor.xyz = vec3(0.);

    vec3 starColor = 1.5 * texture2D(uStar, vText).rgb * max(gl_FragColor.rgb, vec3(0.55));
    gl_FragColor *= 0.9;
    gl_FragColor.xyz += starColor;
}
