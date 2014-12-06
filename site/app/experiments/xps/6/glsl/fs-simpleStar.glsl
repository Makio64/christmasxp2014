precision highp float;

uniform float uScale;
uniform float uWidth;

varying vec2 vText;

#define PI	3.14159265359
#define PI2	( PI * 2.0 )

vec2 rotate( vec2 p, float t )
{
	return p * cos( -t ) + vec2( p.y, -p.x ) * sin( -t );
}

vec3 rotate( vec3 p, vec3 t )
{
    p.yz = rotate( p.yz, t.x );
    p.zx = rotate( p.zx, t.y );
	p.xy = rotate( p.xy, t.z );
    return p;
}

struct Mesh
{
    vec3 a;
    vec3 b;
    vec3 c;

};

float cross( vec2 a, vec2 b )
{
    return a.x * b.y - b.x * a.y;
}

int exist( Mesh m, vec2 p )
{
	float xa = cross( m.b.xy - m.a.xy, p - m.a.xy );
	float xb = cross( m.c.xy - m.b.xy, p - m.b.xy );
	float xc = cross( m.a.xy - m.c.xy, p - m.c.xy );
	return int(all(lessThan(vec3(xa, xb, xc), vec3(0.)))) - 1;
}


Mesh genMesh( int idx )
{
	float t = PI2 / 10.0;
    float i = float( idx );
    vec3 a;
    float t0, t1;

    a = vec3( 0.0, 0.0, 0.0 );
    t0 = t * i;
    t1 = t * ( i + 1.0 );
    float r0 = mod( i, 2.0 ) * 0.3 + 0.2;
    float r1 = mod( i + 1.0, 2.0 ) * 0.3 + 0.2;
	vec3 b = vec3( r0 * cos( t0 ), r0 * sin( t0 ), 0.0 );
	vec3 c = vec3( r1 * cos( t1 ), r1 * sin( t1 ), 0.0 );
    vec3 rot = vec3( 0.0, 0.0, 0.95);
    a = rotate(a, rot);
    b = rotate(b, rot);
    c = rotate(c, rot);


	return Mesh( a, c, b);
}

void main( void )
{
	vec2 p = 2. * vText - vec2(1.);

	vec3 col = vec3( 0.);
    for ( int i = 0; i < 10; i++ )
    {
        Mesh m = genMesh( i );
        float s = uScale;
        m.a.xy *= s;
        m.b.xy *= s;
        m.c.xy *= s;
        if ( exist( m , p ) == 0 ) col = vec3( 1.0 );

        s = uWidth;
        m.a.xy *= s;
        m.b.xy *= s;
        m.c.xy *= s;
        if ( exist( m , p ) == 0 ) col = vec3( 0. );
    }

    gl_FragColor = vec4( col, 1.0 );
}
