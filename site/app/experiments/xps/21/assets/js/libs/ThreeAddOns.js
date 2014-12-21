
//goog.provide( 'green.THREEAddOns' );

var decalCubeMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true } );
var all = new THREE.Vector3( 1, 1, 1 );

function createDecal( mesh, position, rotation, dimensions, check ) {

	if( check === undefined ) check = all;

    var geometry = new THREE.Geometry();
	var uvs = [];

	var cube = new THREE.Mesh( new THREE.CubeGeometry( dimensions.x, dimensions.y, dimensions.z ), decalCubeMaterial );
	cube.rotation.set( rotation.x, rotation.y, rotation.z );
	cube.position.set( position.x, position.y, position.z );
	cube.scale.set( 1, 1, 1 );
	cube.updateMatrix();

    var iCubeMatrix = (new THREE.Matrix4()).getInverse( cube.matrix );

    var faceIndices = [ 'a', 'b', 'c', 'd' ];

    function clipFace( inVertices, plane ) {

    	var size = .5 * Math.abs( ( dimensions.clone() ).dot( plane ) );

    	if( inVertices.length === 0 ) return [];
    	var outVertices = [];

    	for( var j = 0; j < inVertices.length; j += 3 ) {

    	var v1Out, v2Out, v3Out, total = 0;

			var d1 = inVertices[ j ].dot( plane ) - size,
				d2 = inVertices[ j + 1 ].dot( plane ) - size,
				d3 = inVertices[ j + 2 ].dot( plane ) - size;

			v1Out = d1 > 0;
			v2Out = d2 > 0;
			v3Out = d3 > 0;

		    function clip( v0, v1, p ) {

		    	var d0 = v0.dot( plane ) - size,
					d1 = v1.dot( plane ) - size;

				var s = d0 / ( d0 - d1 );
				var v = new THREE.Vector3(
					v0.x + s * ( v1.x - v0.x ),
					v0.y + s * ( v1.y - v0.y ),
					v0.z + s * ( v1.z - v0.z )
				);

				// need to clip more values (texture coordinates)? do it this way:
				//intersectpoint.value = a.value + s*(b.value-a.value);

				return v;

		    }

	    	total = ( v1Out?1:0 ) + ( v2Out?1:0 ) + ( v3Out?1:0 );

	    	switch( total ) {
	    		case 0:{
					outVertices.push( inVertices[ j ] );
					outVertices.push( inVertices[ j + 1 ] );
					outVertices.push( inVertices[ j + 2 ] );
		    		break;
		    	}
	    		case 1:{
	    			var nV1, nV2, nV3;
					if( v1Out ) {
						nV1 = inVertices[ j + 1 ];
						nV2 = inVertices[ j + 2 ];
						nV3 = clip( inVertices[ j ], nV1, plane );
						nV4 = clip( inVertices[ j ], nV2, plane );
					}
		    		if( v2Out ) {
						nV1 = inVertices[ j ];
						nV2 = inVertices[ j + 2 ];
						nV3 = clip( inVertices[ j + 1 ], nV1, plane );
						nV4 = clip( inVertices[ j + 1 ], nV2, plane );

						outVertices.push( nV3 );
						outVertices.push( nV2.clone() );
						outVertices.push( nV1.clone() );

						outVertices.push( nV2.clone() );
						outVertices.push( nV3.clone() );
						outVertices.push( nV4 );
						break;
					}
		    		if( v3Out ) {
						nV1 = inVertices[ j ];
						nV2 = inVertices[ j + 1 ];
						nV3 = clip( inVertices[ j + 2 ], nV1, plane );
						nV4 = clip( inVertices[ j + 2 ], nV2, plane );
					}

					outVertices.push( nV1.clone() );
					outVertices.push( nV2.clone() );
					outVertices.push( nV3 );

					outVertices.push( nV4 );
					outVertices.push( nV3.clone() );
					outVertices.push( nV2.clone() );

		    		break;
		    	}
		    	case 2: {
		    		var nV1, nV2, nV3;
		    		if( !v1Out ) {
		    			nV1 = inVertices[ j ].clone();
		    			nV2 = clip( nV1, inVertices[ j + 1 ], plane );
		    			nV3 = clip( nV1, inVertices[ j + 2 ], plane );
						outVertices.push( nV1 );
						outVertices.push( nV2 );
						outVertices.push( nV3 );
		    		}
		    		if( !v2Out ) {
		    			nV1 = inVertices[ j + 1 ].clone();
		    			nV2 = clip( nV1, inVertices[ j + 2 ], plane );
		    			nV3 = clip( nV1, inVertices[ j ], plane );
						outVertices.push( nV1 );
						outVertices.push( nV2 );
						outVertices.push( nV3 );
					}
		    		if( !v3Out ) {
		    			nV1 = inVertices[ j + 2 ].clone();
		    			nV2 = clip( nV1, inVertices[ j ], plane );
		    			nV3 = clip( nV1, inVertices[ j + 1 ], plane );
		    			outVertices.push( nV1 );
		    			outVertices.push( nV2 );
		    			outVertices.push( nV3 );
					}

		    		break;
		    	}
		    	case 3: {
		    		break;
		    	}
	    	}

	    }

    	return outVertices;

    }

    for( var i = 0; i < mesh.geometry.faces.length; i++ ) {

        var f = mesh.geometry.faces[ i ];
        var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
        var vertices = [];

        function pushVertex( id ){

        	v = mesh.geometry.vertices[ id ].clone();
            v.applyMatrix4( mesh.matrix );
            v.applyMatrix4( iCubeMatrix );
            vertices.push( v );

        }

        if( n === 3 ) {

            pushVertex( f[ faceIndices[ 0 ] ] );
            pushVertex( f[ faceIndices[ 1 ] ] );
            pushVertex( f[ faceIndices[ 2 ] ] );

        } else {

            pushVertex( f[ faceIndices[ 0 ] ] );
            pushVertex( f[ faceIndices[ 1 ] ] );
            pushVertex( f[ faceIndices[ 2 ] ] );

            pushVertex( f[ faceIndices[ 3 ] ] );
            pushVertex( f[ faceIndices[ 0 ] ] );
            pushVertex( f[ faceIndices[ 2 ] ] );

        }

        if( check.x ) {
        	vertices = clipFace( vertices, new THREE.Vector3( 1, 0, 0 ) );
        	//vertices = clipFace( vertices, new THREE.Vector3( -1, 0, 0 ) );
        }
        if( check.y ) {
	       	vertices = clipFace( vertices, new THREE.Vector3( 0, 1, 0 ) );
	       	vertices = clipFace( vertices, new THREE.Vector3( 0, -1, 0 ) );
	    }
	    if( check.z ) {
	        vertices = clipFace( vertices, new THREE.Vector3( 0, 0, 1 ) );
	        vertices = clipFace( vertices, new THREE.Vector3( 0, 0, -1 ) );
	    }

        for( var j = 0; j < vertices.length; j++ ) {

			var v = vertices[ j ];

			uvs.push( new THREE.Vector2(
				.5 + ( vertices[ j ].x / dimensions.x ),
				.5 + ( vertices[ j ].y / dimensions.y )
			) );

			vertices[ j ].applyMatrix4( cube.matrix );

        }

		if( vertices.length === 0 ) continue;

		geometry.vertices = geometry.vertices.concat( vertices );

    }

    for( var k = 0; k < geometry.vertices.length; k += 3 ) {

        geometry.faces.push(
            new THREE.Face3(
                k,
                k + 1,
                k + 2
            )
        );
        var uv = [];
        uv.push( uvs[ k ] );
		uv.push( uvs[ k + 1 ] );
		uv.push( uvs[ k + 2 ] );
		geometry.faceVertexUvs[ 0 ].push( uv );

	}

    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
   	geometry.uvsNeedUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeFaceNormals();

    return { geometry: geometry, helper: cube };

}

function createBufferGeometryDecal( mesh, position, rotation, dimensions, check ) {

	if( check === undefined ) check = all;

    var geometry = new THREE.Geometry();
	var uvs = [];

	var cube = new THREE.Mesh( new THREE.CubeGeometry( dimensions.x, dimensions.y, dimensions.z ), decalCubeMaterial );
	cube.rotation.set( rotation.x, rotation.y, rotation.z );
	cube.position.set( position.x, position.y, position.z );
	cube.scale.set( 1, 1, 1 );
	cube.updateMatrix();

    var iCubeMatrix = ( new THREE.Matrix4() ).getInverse( cube.matrix );
    var dimensionsTmp = new THREE.Vector3();

    function clipFace( inVertices, plane ) {

    	if( inVertices.length === 0 ) return [];

    	dimensionsTmp.set( dimensions.x, dimensions.y, dimensions.z );
    	var size = .5 * Math.abs( dimensionsTmp.dot( plane ) );

    	var outVertices = [];

    	for( var j = 0; j < inVertices.length; j += 3 ) {

    	var v1Out, v2Out, v3Out, total = 0;

			var d1 = inVertices[ j ].dot( plane ) - size,
				d2 = inVertices[ j + 1 ].dot( plane ) - size,
				d3 = inVertices[ j + 2 ].dot( plane ) - size;

			v1Out = d1 > 0;
			v2Out = d2 > 0;
			v3Out = d3 > 0;

		    function clip( v0, v1, p ) {

		    	var d0 = v0.dot( plane ) - size,
					d1 = v1.dot( plane ) - size;

				var s = d0 / ( d0 - d1 );
				var v = new THREE.Vector3(
					v0.x + s * ( v1.x - v0.x ),
					v0.y + s * ( v1.y - v0.y ),
					v0.z + s * ( v1.z - v0.z )
				);

				// need to clip more values (texture coordinates)? do it this way:
				//intersectpoint.value = a.value + s*(b.value-a.value);

				return v;

		    }

	    	total = ( v1Out?1:0 ) + ( v2Out?1:0 ) + ( v3Out?1:0 );

	    	switch( total ) {
	    		case 0:{

	    			outVertices.push( inVertices[ j ] );
					outVertices.push( inVertices[ j + 1 ] );
					outVertices.push( inVertices[ j + 2 ] );
		    		break;

		    	}
	    		case 1:{

	    			var nV1, nV2, nV3;
					if( v1Out ) {
						nV1 = inVertices[ j + 1 ];
						nV2 = inVertices[ j + 2 ];
						nV3 = clip( inVertices[ j ], nV1, plane );
						nV4 = clip( inVertices[ j ], nV2, plane );
					}
		    		if( v2Out ) {
						nV1 = inVertices[ j ];
						nV2 = inVertices[ j + 2 ];
						nV3 = clip( inVertices[ j + 1 ], nV1, plane );
						nV4 = clip( inVertices[ j + 1 ], nV2, plane );

						outVertices.push( nV3 );
						outVertices.push( nV2.clone() );
						outVertices.push( nV1.clone() );

						outVertices.push( nV2.clone() );
						outVertices.push( nV3.clone() );
						outVertices.push( nV4 );
						break;
					}
		    		if( v3Out ) {
						nV1 = inVertices[ j ];
						nV2 = inVertices[ j + 1 ];
						nV3 = clip( inVertices[ j + 2 ], nV1, plane );
						nV4 = clip( inVertices[ j + 2 ], nV2, plane );
					}

					outVertices.push( nV1.clone() );
					outVertices.push( nV2.clone() );
					outVertices.push( nV3 );

					outVertices.push( nV4 );
					outVertices.push( nV3.clone() );
					outVertices.push( nV2.clone() );

		    		break;
		    	}
		    	case 2: {

		    		var nV1, nV2, nV3;
		    		if( !v1Out ) {
		    			nV1 = inVertices[ j ].clone();
		    			nV2 = clip( nV1, inVertices[ j + 1 ], plane );
		    			nV3 = clip( nV1, inVertices[ j + 2 ], plane );
						outVertices.push( nV1 );
						outVertices.push( nV2 );
						outVertices.push( nV3 );
		    		}
		    		if( !v2Out ) {
		    			nV1 = inVertices[ j + 1 ].clone();
		    			nV2 = clip( nV1, inVertices[ j + 2 ], plane );
		    			nV3 = clip( nV1, inVertices[ j ], plane );
						outVertices.push( nV1 );
						outVertices.push( nV2 );
						outVertices.push( nV3 );
					}
		    		if( !v3Out ) {
		    			nV1 = inVertices[ j + 2 ].clone();
		    			nV2 = clip( nV1, inVertices[ j ], plane );
		    			nV3 = clip( nV1, inVertices[ j + 1 ], plane );
		    			outVertices.push( nV1 );
		    			outVertices.push( nV2 );
		    			outVertices.push( nV3 );
					}

		    		break;
		    	}
		    	case 3: {
		    		break;
		    	}
	    	}

	    }

	    return outVertices;

    }

    var a = mesh.geometry.attributes.position.array;

    for( var i = 0; i < a.length; i += 9 ) {

	    var v1 = new THREE.Vector3(),
	    	v2 = new THREE.Vector3(),
	    	v3 = new THREE.Vector3();

        var vertices = [];

        function pushVertex( v ){

            v.applyMatrix4( mesh.matrix );
            v.applyMatrix4( iCubeMatrix );
            vertices.push( v );

        }

        v1.set( a[ i ], a[ i + 1 ], a [ i + 2 ] );
        v2.set( a[ i + 3 ], a[ i + 4 ], a [ i + 5 ] );
        v3.set( a[ i + 6 ], a[ i + 7 ], a [ i + 8 ] );

		pushVertex( v1 );
		pushVertex( v2 );
		pushVertex( v3 );

        if( check.x ) {
        	vertices = clipFace( vertices, new THREE.Vector3( 1, 0, 0 ) );
        	vertices = clipFace( vertices, new THREE.Vector3( -1, 0, 0 ) );
        }
        if( check.y ) {
	       	vertices = clipFace( vertices, new THREE.Vector3( 0, 1, 0 ) );
	       	vertices = clipFace( vertices, new THREE.Vector3( 0, -1, 0 ) );
	    }
	    if( check.z ) {
	        vertices = clipFace( vertices, new THREE.Vector3( 0, 0, 1 ) );
	        vertices = clipFace( vertices, new THREE.Vector3( 0, 0, -1 ) );
	    }

        for( var j = 0; j < vertices.length; j++ ) {

			var v = vertices[ j ];

			uvs.push( new THREE.Vector2(
				.5 + ( vertices[ j ].x / dimensions.x ),
				.5 + ( vertices[ j ].y / dimensions.y )
			) );

			vertices[ j ].applyMatrix4( cube.matrix );

        }

		if( vertices.length === 0 ) continue;

		geometry.vertices = geometry.vertices.concat( vertices );

    }

    for( var k = 0; k < geometry.vertices.length; k += 3 ) {

        geometry.faces.push(
            new THREE.Face3(
                k,
                k + 1,
                k + 2
            )
        );
        var uv = [];
        uv.push( uvs[ k ] );
		uv.push( uvs[ k + 1 ] );
		uv.push( uvs[ k + 2 ] );
		geometry.faceVertexUvs[ 0 ].push( uv );

	}

    geometry.verticesNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
   	geometry.uvsNeedUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeFaceNormals();

    return { geometry: geometry, helper: cube };

}

function memcpy( dst, dstOffset, src, srcOffset, length ) {
	//console.time( '- create array view' );
	var dstU8 = new Uint8Array( dst, dstOffset, length );
	var srcU8 = new Uint8Array( src, srcOffset, length );
	//console.timeEnd( '- create array view' );
	//console.time( '- copy' );
	dstU8.set( srcU8 );
	//console.timeEnd( '- copy' );
};

function mergeBufferGeometries( g1, g2 ) {

	var faces = g1.attributes.index.numItems / 3 + g2.attributes.index.numItems / 3;

	var geometry = prepareGeometryForMerge( faces, {
		setNormals: g1.attributes.normal && g2.attributes.normal,
		setUVs: g1.attributes.uv && g2.attributes.uv,
		setVertexColors: g1.attributes.color && g2.attributes.color
	} );

	memcpy( geometry.attributes.position.array.buffer, 0, g1.attributes.position.array.buffer, 0, g1.attributes.position.array.byteLength );
	memcpy( geometry.attributes.position.array.buffer, g1.attributes.position.array.byteLength, g2.attributes.position.array.buffer, 0, g2.attributes.position.array.byteLength );

	if( g1.attributes.normal && g2.attributes.normal ) {
		memcpy( geometry.attributes.normal.array.buffer, 0, g1.attributes.normal.array.buffer, 0, g1.attributes.normal.array.byteLength );
		memcpy( geometry.attributes.normal.array.buffer, g1.attributes.normal.array.byteLength, g2.attributes.normal.array.buffer, 0, g2.attributes.normal.array.byteLength );
	}

	if( g1.attributes.uv && g2.attributes.uv ) {
		memcpy( geometry.attributes.uv.array.buffer, 0, g1.attributes.uv.array.buffer, 0, g1.attributes.uv.array.byteLength );
		memcpy( geometry.attributes.uv.array.buffer, g1.attributes.uv.array.byteLength, g2.attributes.uv.array.buffer, 0, g2.attributes.uv.array.byteLength );
	}

	if( g1.attributes.color && g2.attributes.color ) {
		memcpy( geometry.attributes.color.array.buffer, 0, g1.attributes.color.array.buffer, 0, g1.attributes.color.array.byteLength );
		memcpy( geometry.attributes.color.array.buffer, g1.attributes.color.array.byteLength, g2.attributes.color.array.buffer, 0, g2.attributes.color.array.byteLength );
	}

	geometry.computeBoundingSphere();

	return geometry;

}

function mergeBufferGeometry( g1, g2 ) {

	memcpy( g1.attributes.position.array.buffer, g1.faceIndex * 9, g2.attributes.position.array.buffer, 0, g2.attributes.position.array.byteLength );
	// memcpy( g1.attributes.normal.array.buffer, g1.faceIndex * 9, g2.attributes.normal.array.buffer, 0, g2.attributes.normal.array.byteLength );
	memcpy( g1.attributes.uv.array.buffer, g1.faceIndex * 6, g2.attributes.uv.array.buffer, 0, g2.attributes.uv.array.byteLength );
	// memcpy( g1.attributes.color.array.buffer, g1.faceIndex * 9, g2.attributes.color.array.buffer, 0, g2.attributes.color.array.byteLength );

	g1.faceIndex += ( g2.attributes.position.numItems / 9 ) * 4;

}

/*function geometryToBufferGeometry ( baseGeometry, settings ) {

	var setNormals		= ( settings )? settings.setNormals : true,
		setUVs			= ( settings )? settings.setUVs : true,
		setVertexColors	= ( settings )? settings.setVertexColors : false;

	var faces = 0;
	for ( var j = 0; j < baseGeometry.faces.length; j++ ) {

		var f = baseGeometry.faces[ j ];
		if ( f instanceof THREE.Face3 ) faces += 1; else faces += 2;
	}

	var geometry = prepareGeometryForMerge( faces, { setNormals: setNormals, setUVs: setUVs, setVertexColors: setVertexColors } );

	var positions = geometry.attributes.position.array;
	if ( setNormals ) var normals = geometry.attributes.normal.array;
	if ( setUVs ) var uv = geometry.attributes.uv.array;
	if ( setVertexColors ) var colors = geometry.attributes.color.array;

	var ptr = 0, ptr2 = 0;
	for ( var i = 0; i < baseGeometry.faces.length; i++ ) {

		var f = baseGeometry.faces[ i ];
		if( f instanceof THREE.Face3 ) {

			var a = baseGeometry.vertices[ f.a ],
				b = baseGeometry.vertices[ f.b ],
				c = baseGeometry.vertices[ f.c ];

			positions[ ptr     ] = a.x;
			positions[ ptr + 1 ] = a.y;
			positions[ ptr + 2 ] = a.z;

			positions[ ptr + 3 ] = b.x;
			positions[ ptr + 4 ] = b.y;
			positions[ ptr + 5 ] = b.z;

			positions[ ptr + 6 ] = c.x;
			positions[ ptr + 7 ] = c.y;
			positions[ ptr + 8 ] = c.z;

			if( setNormals ) {

				var na = f.vertexNormals[ 0 ],
					nb = f.vertexNormals[ 1 ],
					nc = f.vertexNormals[ 2 ];

				normals[ ptr ]     = na.x;
				normals[ ptr + 1 ] = na.y;
				normals[ ptr + 2 ] = na.z;

				normals[ ptr + 3 ] = nb.x;
				normals[ ptr + 4 ] = nb.y;
				normals[ ptr + 5 ] = nb.z;

				normals[ ptr + 6 ] = nc.x;
				normals[ ptr + 7 ] = nc.y;
				normals[ ptr + 8 ] = nc.z;

			}

			if( setUVs ) {

				var uva = baseGeometry.faceVertexUvs[ 0 ][ i ][ 0 ],
					uvb = baseGeometry.faceVertexUvs[ 0 ][ i ][ 1 ],
					uvc = baseGeometry.faceVertexUvs[ 0 ][ i ][ 2 ];

				uv[ ptr2     ] = uva.x;
				uv[ ptr2 + 1 ] = uva.y;

				uv[ ptr2 + 2 ] = uvb.x;
				uv[ ptr2 + 3 ] = uvb.y;

				uv[ ptr2 + 4 ] = uvc.x;
				uv[ ptr2 + 5 ] = uvc.y;

			}

			if( setVertexColors ) {

				var ca = f.vertexColors[ 0 ],
					cb = f.vertexColors[ 1 ],
					cc = f.vertexColors[ 2 ];

				colors[ ptr ]     = ca.r;
				colors[ ptr + 1 ] = ca.g;
				colors[ ptr + 2 ] = ca.b;

				colors[ ptr + 3 ] = cb.r;
				colors[ ptr + 4 ] = cb.g;
				colors[ ptr + 5 ] = cb.b;

				colors[ ptr + 6 ] = cc.r;
				colors[ ptr + 7 ] = cc.g;
				colors[ ptr + 8 ] = cc.b;

			}

			ptr += 9;
			ptr2 += 6;

		} else {

			var a = baseGeometry.vertices[ f.a ],
				b = baseGeometry.vertices[ f.b ],
				c = baseGeometry.vertices[ f.c ],
				d = baseGeometry.vertices[ f.d ];

			positions[ ptr     ] = a.x;
			positions[ ptr + 1 ] = a.y;
			positions[ ptr + 2 ] = a.z;

			positions[ ptr + 3 ] = b.x;
			positions[ ptr + 4 ] = b.y;
			positions[ ptr + 5 ] = b.z;

			positions[ ptr + 6 ] = c.x;
			positions[ ptr + 7 ] = c.y;
			positions[ ptr + 8 ] = c.z;

			if( setNormals ) {

			var na = f.vertexNormals[ 0 ],
				nb = f.vertexNormals[ 1 ],
				nc = f.vertexNormals[ 2 ],
				nd = f.vertexNormals[ 3 ];

				normals[ ptr ]     = na.x;
				normals[ ptr + 1 ] = na.y;
				normals[ ptr + 2 ] = na.z;

				normals[ ptr + 3 ] = nb.x;
				normals[ ptr + 4 ] = nb.y;
				normals[ ptr + 5 ] = nb.z;

				normals[ ptr + 6 ] = nc.x;
				normals[ ptr + 7 ] = nc.y;
				normals[ ptr + 8 ] = nc.z;

			}

			if( setUVs ) {

				var uva = baseGeometry.faceVertexUvs[ 0 ][ i ][ 0 ],
					uvb = baseGeometry.faceVertexUvs[ 0 ][ i ][ 1 ],
					uvc = baseGeometry.faceVertexUvs[ 0 ][ i ][ 2 ],
					uvd = baseGeometry.faceVertexUvs[ 0 ][ i ][ 3 ];

				uv[ ptr2     ] = uva.x;
				uv[ ptr2 + 1 ] = uva.y;

				uv[ ptr2 + 2 ] = uvb.x;
				uv[ ptr2 + 3 ] = uvb.y;

				uv[ ptr2 + 4 ] = uvc.x;
				uv[ ptr2 + 5 ] = uvc.y;

			}

			ptr += 9;
			ptr2 += 6;

			positions[ ptr     ] = a.x;
			positions[ ptr + 1 ] = a.y;
			positions[ ptr + 2 ] = a.z;

			positions[ ptr + 3 ] = c.x;
			positions[ ptr + 4 ] = c.y;
			positions[ ptr + 5 ] = c.z;

			positions[ ptr + 6 ] = d.x;
			positions[ ptr + 7 ] = d.y;
			positions[ ptr + 8 ] = d.z;

			if( setNormals ) {

			var na = f.vertexNormals[ 0 ],
				nb = f.vertexNormals[ 1 ],
				nc = f.vertexNormals[ 2 ],
				nd = f.vertexNormals[ 3 ];

				normals[ ptr ]     = na.x;
				normals[ ptr + 1 ] = na.y;
				normals[ ptr + 2 ] = na.z;

				normals[ ptr + 3 ] = nc.x;
				normals[ ptr + 4 ] = nc.y;
				normals[ ptr + 5 ] = nc.z;

				normals[ ptr + 6 ] = nd.x;
				normals[ ptr + 7 ] = nd.y;
				normals[ ptr + 8 ] = nd.z;

			}

			if( setUVs ) {

				var uva = baseGeometry.faceVertexUvs[ 0 ][ i ][ 0 ],
					uvb = baseGeometry.faceVertexUvs[ 0 ][ i ][ 1 ],
					uvc = baseGeometry.faceVertexUvs[ 0 ][ i ][ 2 ],
					uvd = baseGeometry.faceVertexUvs[ 0 ][ i ][ 3 ];

				uv[ ptr2     ] = uva.x;
				uv[ ptr2 + 1 ] = uva.y;

				uv[ ptr2 + 2 ] = uvc.x;
				uv[ ptr2 + 3 ] = uvc.y;

				uv[ ptr2 + 4 ] = uvd.x;
				uv[ ptr2 + 5 ] = uvd.y;

			}

			ptr += 9;
			ptr2 += 6;

		}

	}

	geometry.computeBoundingSphere();

	return geometry;

}*/

function geometryToBufferGeometry ( baseGeometry, settings ) {

	var setNormals		= ( settings )? settings.setNormals : true,
		setUVs			= ( settings )? settings.setUVs : true,
		setVertexColors	= ( settings )? settings.setVertexColors : false;

	// var setNormals = true, setUVs = false, setVertexColors = baseGeometry.faces[ 0 ].vertexColors.length > 0;

	var faces = 0;
	for( var j = 0; j < baseGeometry.faces.length; j++ ) {
		var f = baseGeometry.faces[ j ];
		if( f instanceof THREE.Face3 ) faces += 1; else faces += 2;
	}

	//console.log( faces );

	var geometry = prepareGeometryForMerge( faces, settings );

	var positions = geometry.attributes.position.array;
	if ( setNormals ) var normals = geometry.attributes.normal.array;
	if ( setUVs ) var uv = geometry.attributes.uv.array;
	if ( setVertexColors ) var colors = geometry.attributes.color.array;

	var ptr = 0, ptr2 = 0;
	for ( var i = 0; i < baseGeometry.faces.length; i++ ) {

		var f = baseGeometry.faces[ i ];
		if( f instanceof THREE.Face3 ) {

			var a = baseGeometry.vertices[ f.a ],
				b = baseGeometry.vertices[ f.b ],
				c = baseGeometry.vertices[ f.c ];

			positions[ ptr     ] = a.x;
			positions[ ptr + 1 ] = a.y;
			positions[ ptr + 2 ] = a.z;

			positions[ ptr + 3 ] = b.x;
			positions[ ptr + 4 ] = b.y;
			positions[ ptr + 5 ] = b.z;

			positions[ ptr + 6 ] = c.x;
			positions[ ptr + 7 ] = c.y;
			positions[ ptr + 8 ] = c.z;

			if( setNormals ) {

				var na = f.vertexNormals[ 0 ],
					nb = f.vertexNormals[ 1 ],
					nc = f.vertexNormals[ 2 ];

				normals[ ptr ]     = na.x;
				normals[ ptr + 1 ] = na.y;
				normals[ ptr + 2 ] = na.z;

				normals[ ptr + 3 ] = nb.x;
				normals[ ptr + 4 ] = nb.y;
				normals[ ptr + 5 ] = nb.z;

				normals[ ptr + 6 ] = nc.x;
				normals[ ptr + 7 ] = nc.y;
				normals[ ptr + 8 ] = nc.z;

			}

			if( setUVs ) {

				var uva = baseGeometry.faceVertexUvs[ 0 ][ i ][ 0 ],
					uvb = baseGeometry.faceVertexUvs[ 0 ][ i ][ 1 ],
					uvc = baseGeometry.faceVertexUvs[ 0 ][ i ][ 2 ];

				uv[ ptr2     ] = uva.x;
				uv[ ptr2 + 1 ] = uva.y;

				uv[ ptr2 + 2 ] = uvb.x;
				uv[ ptr2 + 3 ] = uvb.y;

				uv[ ptr2 + 4 ] = uvc.x;
				uv[ ptr2 + 5 ] = uvc.y;

			}

			if( setVertexColors ) {

				var ca = f.vertexColors[ 0 ],
					cb = f.vertexColors[ 1 ],
					cc = f.vertexColors[ 2 ];

				colors[ ptr ]     = ca.r;
				colors[ ptr + 1 ] = ca.g;
				colors[ ptr + 2 ] = ca.b;

				colors[ ptr + 3 ] = cb.r;
				colors[ ptr + 4 ] = cb.g;
				colors[ ptr + 5 ] = cb.b;

				colors[ ptr + 6 ] = cc.r;
				colors[ ptr + 7 ] = cc.g;
				colors[ ptr + 8 ] = cc.b;

			}

			ptr += 9;
			ptr2 += 6;

		} else {

			var a = baseGeometry.vertices[ f.a ],
				b = baseGeometry.vertices[ f.b ],
				c = baseGeometry.vertices[ f.c ],
				d = baseGeometry.vertices[ f.d ];

			positions[ ptr     ] = a.x;
			positions[ ptr + 1 ] = a.y;
			positions[ ptr + 2 ] = a.z;

			positions[ ptr + 3 ] = b.x;
			positions[ ptr + 4 ] = b.y;
			positions[ ptr + 5 ] = b.z;

			positions[ ptr + 6 ] = c.x;
			positions[ ptr + 7 ] = c.y;
			positions[ ptr + 8 ] = c.z;

			if( setNormals ) {

			var na = f.vertexNormals[ 0 ],
				nb = f.vertexNormals[ 1 ],
				nc = f.vertexNormals[ 2 ],
				nd = f.vertexNormals[ 3 ];

				normals[ ptr ]     = na.x;
				normals[ ptr + 1 ] = na.y;
				normals[ ptr + 2 ] = na.z;

				normals[ ptr + 3 ] = nb.x;
				normals[ ptr + 4 ] = nb.y;
				normals[ ptr + 5 ] = nb.z;

				normals[ ptr + 6 ] = nc.x;
				normals[ ptr + 7 ] = nc.y;
				normals[ ptr + 8 ] = nc.z;

			}

			if( setUVs ) {

				var uva = baseGeometry.faceVertexUvs[ 0 ][ i ][ 0 ],
					uvb = baseGeometry.faceVertexUvs[ 0 ][ i ][ 1 ],
					uvc = baseGeometry.faceVertexUvs[ 0 ][ i ][ 2 ],
					uvd = baseGeometry.faceVertexUvs[ 0 ][ i ][ 3 ];

				uv[ ptr2     ] = uva.x;
				uv[ ptr2 + 1 ] = uva.y;

				uv[ ptr2 + 2 ] = uvb.x;
				uv[ ptr2 + 3 ] = uvb.y;

				uv[ ptr2 + 4 ] = uvc.x;
				uv[ ptr2 + 5 ] = uvc.y;

			}

			if( setVertexColors ) {

				var ca = f.vertexColors[ 0 ],
					cb = f.vertexColors[ 1 ],
					cc = f.vertexColors[ 2 ],
					cd = f.vertexColors[ 3 ];

				colors[ ptr ]     = ca.r;
				colors[ ptr + 1 ] = ca.g;
				colors[ ptr + 2 ] = ca.b;

				colors[ ptr + 3 ] = cb.r;
				colors[ ptr + 4 ] = cb.g;
				colors[ ptr + 5 ] = cb.b;

				colors[ ptr + 6 ] = cc.r;
				colors[ ptr + 7 ] = cc.g;
				colors[ ptr + 8 ] = cc.b;

			}

			ptr += 9;
			ptr2 += 6;

			positions[ ptr     ] = a.x;
			positions[ ptr + 1 ] = a.y;
			positions[ ptr + 2 ] = a.z;

			positions[ ptr + 3 ] = c.x;
			positions[ ptr + 4 ] = c.y;
			positions[ ptr + 5 ] = c.z;

			positions[ ptr + 6 ] = d.x;
			positions[ ptr + 7 ] = d.y;
			positions[ ptr + 8 ] = d.z;

			if( setNormals ) {

			var na = f.vertexNormals[ 0 ],
				nb = f.vertexNormals[ 1 ],
				nc = f.vertexNormals[ 2 ],
				nd = f.vertexNormals[ 3 ];

				normals[ ptr ]     = na.x;
				normals[ ptr + 1 ] = na.y;
				normals[ ptr + 2 ] = na.z;

				normals[ ptr + 3 ] = nc.x;
				normals[ ptr + 4 ] = nc.y;
				normals[ ptr + 5 ] = nc.z;

				normals[ ptr + 6 ] = nd.x;
				normals[ ptr + 7 ] = nd.y;
				normals[ ptr + 8 ] = nd.z;

			}

			if( setUVs ) {

				var uva = baseGeometry.faceVertexUvs[ 0 ][ i ][ 0 ],
					uvb = baseGeometry.faceVertexUvs[ 0 ][ i ][ 1 ],
					uvc = baseGeometry.faceVertexUvs[ 0 ][ i ][ 2 ],
					uvd = baseGeometry.faceVertexUvs[ 0 ][ i ][ 3 ];

				uv[ ptr2     ] = uva.x;
				uv[ ptr2 + 1 ] = uva.y;

				uv[ ptr2 + 2 ] = uvc.x;
				uv[ ptr2 + 3 ] = uvc.y;

				uv[ ptr2 + 4 ] = uvd.x;
				uv[ ptr2 + 5 ] = uvd.y;

			}

			if( setVertexColors ) {

				var ca = f.vertexColors[ 0 ],
					cb = f.vertexColors[ 1 ],
					cc = f.vertexColors[ 2 ],
					cd = f.vertexColors[ 3 ];

				colors[ ptr ]     = ca.r;
				colors[ ptr + 1 ] = ca.g;
				colors[ ptr + 2 ] = ca.b;

				colors[ ptr + 3 ] = cc.r;
				colors[ ptr + 4 ] = cc.g;
				colors[ ptr + 5 ] = cc.b;

				colors[ ptr + 6 ] = cd.r;
				colors[ ptr + 7 ] = cd.g;
				colors[ ptr + 8 ] = cd.b;

			}

			ptr += 9;
			ptr2 += 6;

		}

	}

	geometry.computeBoundingSphere();

	return geometry;
}

function prepareGeometryForMerge( faces, settings ) {

	//console.time( '- creating bg' );
	var geometry = new THREE.BufferGeometry();
	//console.timeEnd( '- creating bg' );
	geometry.faceIndex = 0;
	//console.time( '- creating bg buffers' );

	geometry.attributes = {
		index: {
			itemSize: 1,
			array: new Uint16Array( faces * 3 ),
			numItems: faces * 3
		},
		position: {
			itemSize: 3,
			array: new Float32Array( faces * 3 * 3 ),
			numItems: faces * 3 * 3
		}
	}

	if( settings.setNormals ) {
		geometry.attributes.normal = {
			itemSize: 3,
			array: new Float32Array( faces * 3 * 3 ),
			numItems: faces * 3 * 3
		};
		var normals = geometry.attributes.normal.array;
	}

	if( settings.setUVs ) {
		geometry.attributes.uv = {
			itemSize: 2,
			array: new Float32Array( faces * 3 * 2 ),
			numItems: faces * 3 * 2
		};
		var uv = geometry.attributes.uv.array;
	}

	if( settings.setVertexColors ) {
		geometry.attributes.color = {
			itemSize: 3,
			array: new Float32Array( faces * 3 * 3 ),
			numItems: faces * 3 * 3
		};
		var colors = geometry.attributes.color.array;
	}

	//console.timeEnd( '- creating bg buffers' );

	//console.time( '- setting indices' );
	var chunkSize = 21845;
	var indices = geometry.attributes.index.array;
	//var p = new DataView( geometry.attributes.index.array.buffer );
	var s = ( 3 * chunkSize );
	for ( var i = 0, m = indices.length; i < m; i ++ ) {
		indices[ i ] = i % s;
		//p.setUint16( 2 * i, i % s, true );
	}
	//console.timeEnd( '- setting indices' );

	//console.time( '- setting offsets' );

	geometry.offsets = [];
	var offsets = faces / chunkSize;
	for ( var i = 0; i < offsets; i ++ ) {

		var offset = {
			start: i * chunkSize * 3,
			index: i * chunkSize * 3,
			count: Math.min( faces - ( i * chunkSize ), chunkSize ) * 3
		};

		geometry.offsets.push( offset );

	}
	//console.timeEnd( '- setting offsets' );

	return geometry;

}

function saveGeometry ( g, name, settings ) {

	var headerSpace	= 1;
	if ( settings.setNormals ) {

		if ( g.attributes.normal === undefined ) { console.log( 'No normals for ' + name ); return; }
		headerSpace++;
	}
	if ( settings.setUVs ) {

		if ( g.attributes.uv === undefined ) { console.log( 'No uvs for ' + name ); return; }
		headerSpace++;
	}
	if ( settings.setVertexColors ) {

		if ( g.attributes.color === undefined ) { console.log( 'No colors for ' + name ); return; }
		headerSpace++;
	}

	var header		= new Uint8Array( headerSpace * 8 ),
		p			= new DataView( header.buffer ),
		blobData	= [ header ],
		pos			= 0;

	// positions
	blobData.push( g.attributes.position.array );
	p.setFloat64( pos, g.attributes.position.array.byteLength );
	pos += 8;

	// uvs
	if ( settings.setUVs ) {

		blobData.push( g.attributes.uv.array );
		p.setFloat64( pos, g.attributes.uv.array.byteLength );
		pos += 8;
	}

	// normals
	if ( settings.setNormals ) {

		blobData.push( g.attributes.normal.array );
		p.setFloat64( pos, g.attributes.normal.array.byteLength );
		pos += 8;
	}

	// vertexColors
	if ( settings.setVertexColors ) {

		blobData.push( g.attributes.color.array );
		p.setFloat64( pos, g.attributes.color.array.byteLength );
		pos += 8;
	}

	var mimetype	= 'application/octet-stream',
		blob		= new Blob( blobData, { type: mimetype } );

	var name = name || 'noname';
		name += '.bin';

	var url			= window.webkitURL.createObjectURL( blob );
		downloader	= document.getElementById( 'downloader' );

	var a = document.createElement( 'a' );
		a.setAttribute( 'download', name );
		a.setAttribute( 'href', url );
		a.textContent = 'Download ' + name;

	var li = document.createElement( 'li' );
		li.appendChild( a );

	downloader.appendChild( li );
}

function loadGeometry ( file, settings, callback ) {

	var xhr = new XMLHttpRequest();
	xhr.addEventListener( 'load', function( e ) {

		var offsetSpace		= 1,
			uvPosition		= 0,
			normalPosition	= 0,
			colorPosition	= 0,
			position		= 8;

		if ( settings.setUVs ) {

			uvPosition = position;
			position += 8;
			offsetSpace++;
		}
		if ( settings.setNormals ) {

			normalPosition = position;
			position += 8;
			offsetSpace++;
		}
		if ( settings.setVertexColors ) {

			colorPosition = position;
			position += 8;
			offsetSpace++;
		}

		var p				= new DataView( this.response ),
			type			= p.getUint8( 0 ),
			positionLength	= p.getFloat64( 0 ),
			uvLength		= ( settings.setUVs )? p.getFloat64( uvPosition ) : 0,
			normalLength	= ( settings.setNormals )? p.getFloat64( normalPosition ) : 0,
			colorLength		= ( settings.setVertexColors )? p.getFloat64( colorPosition ) : 0,
			offset			= offsetSpace * 8;

		var geometry = prepareGeometryForMerge( positionLength / 36, settings );

		memcpy( geometry.attributes.position.array.buffer, 0, this.response, offset, positionLength );
		offset += positionLength;

		if ( settings.setUVs ) {

			memcpy( geometry.attributes.uv.array.buffer, 0, this.response, offset, uvLength );
			offset += uvLength;
		}
		if ( settings.setNormals ) {

			memcpy( geometry.attributes.normal.array.buffer, 0, this.response, offset, normalLength );
			offset += normalLength;
		}
		if ( settings.setVertexColors ) {

			memcpy( geometry.attributes.color.array.buffer, 0, this.response, offset, colorLength );
			offset += colorLength;
		}

		geometry.computeBoundingSphere();

		if( callback ) callback( geometry );
	} );

	xhr.open( 'get', file, true );
	xhr.responseType = 'arraybuffer';
	xhr.send();

}


function saveGeometries ( gs, name, settings ) {

	var generalPos	= 0,
		blobData	= [],
		i

	// calc headerSpace needed
	var headerSpace			= 0;

	for ( i = 0; i < gs.length; i++ ) {

		var g = gs[ i ];

		headerSpace++;	// for the positions

		if ( settings.setNormals ) {

			if ( g.attributes.normal === undefined ) { console.log( 'No normals for ' + name ); return; }
			headerSpace++;
		}
		if ( settings.setUVs ) {

			if ( g.attributes.uv === undefined ) { console.log( 'No uvs for ' + name ); return; }
			headerSpace++;
		}
		if ( settings.setVertexColors ) {

			if ( g.attributes.color === undefined ) { console.log( 'No colors for ' + name ); return; }
			headerSpace++;
		}
	}


	var header		= new Uint8Array( headerSpace * 8 ),
		p			= new DataView( header.buffer );

		blobData.push ( header );

		var pos = 0;



	for ( i = 0; i < gs.length; i++ ) {

		var g = gs[ i ];

		// var pos			= 0,
		// 	headerInt	= new Uint8Array( headerSpaces[ i ] * 8 ),
		// 	p			= new DataView( headerInt.buffer );

		// blobData.push ( headerInt );

		// var pos = generalPos;

		// positions
		blobData.push( g.attributes.position.array );
		p.setFloat64( pos, g.attributes.position.array.byteLength );
		pos += 8;

		// uvs
		if ( settings.setUVs ) {

			blobData.push( g.attributes.uv.array );
			p.setFloat64( pos, g.attributes.uv.array.byteLength );
			pos += 8;
		}

		// normals
		if ( settings.setNormals ) {

			blobData.push( g.attributes.normal.array );
			p.setFloat64( pos, g.attributes.normal.array.byteLength );
			pos += 8;
		}

		// vertexColors
		if ( settings.setVertexColors ) {

			blobData.push( g.attributes.color.array );
			p.setFloat64( pos, g.attributes.color.array.byteLength );
			pos += 8;
		}

		// generalPos = pos;
	}

	var mimetype	= 'application/octet-stream',
		blob		= new Blob( blobData, { type: mimetype } );

	var name = name || 'noname';
		name += '.bin';

	var url			= window.webkitURL.createObjectURL( blob );
		downloader	= document.getElementById( 'downloader' );

	var a = document.createElement( 'a' );
		a.setAttribute( 'download', name );
		a.setAttribute( 'href', url );
		a.textContent = 'Download ' + name;

	var li = document.createElement( 'li' );
		li.appendChild( a );

	downloader.appendChild( li );
}



function loadGeometries ( file, numFiles, settings, callback ) {

	var xhr = new XMLHttpRequest();
	xhr.addEventListener( 'load', function( e ) {

		var p					= new DataView( this.response ),
			position			= 0,
			offset				= 0,
			positionPosition	= 0,
			uvPosition			= 0,
			normalPosition		= 0,
			colorPosition		= 0,
			i;

		// calc total offset of the header

		for ( i = 0; i < numFiles; i++ ) {

			offset++;
			if ( settings.setUVs ) offset++;
			if ( settings.setNormals ) offset++;
			if ( settings.setVertexColors ) offset++;
		}
		offset *= 8;

		for ( var i = 0; i < numFiles; i++ ) {

			positionPosition = position;
			position += 8;

			if ( settings.setUVs ) {

				uvPosition = position;
				position += 8;
			}
			if ( settings.setNormals ) {

				normalPosition = position;
				position += 8;
			}
			if ( settings.setVertexColors ) {

				colorPosition = position;
				position += 8;
			}

			var positionLength	= p.getFloat64( positionPosition ),
				uvLength		= ( settings.setUVs )? p.getFloat64( uvPosition ) : 0,
				normalLength	= ( settings.setNormals )? p.getFloat64( normalPosition ) : 0,
				colorLength		= ( settings.setVertexColors )? p.getFloat64( colorPosition ) : 0;

			var geometry = prepareGeometryForMerge( positionLength / 36, settings );

			memcpy( geometry.attributes.position.array.buffer, 0, this.response, offset, positionLength );
			offset += positionLength;

			if ( settings.setUVs ) {

				memcpy( geometry.attributes.uv.array.buffer, 0, this.response, offset, uvLength );
				offset += uvLength;
			}
			if ( settings.setNormals ) {

				memcpy( geometry.attributes.normal.array.buffer, 0, this.response, offset, normalLength );
				offset += normalLength;
			}
			if ( settings.setVertexColors ) {

				memcpy( geometry.attributes.color.array.buffer, 0, this.response, offset, colorLength );
				offset += colorLength;
			}

			geometry.computeBoundingSphere();
			if( callback ) callback( geometry );

			basePosition = position;
		}


	} );

	xhr.open( 'get', file, true );
	xhr.responseType = 'arraybuffer';
	xhr.send();

}

// function loadGeometry( file, callback ) {

// 	//console.time( 'load 3bgeo' );

// 	var xhr = new XMLHttpRequest();
// 	xhr.addEventListener( 'load', function( e ) {

// 		//console.time( 'process 3bgeo' );

// 		//console.time( 'create dataview' );
// 		var p = new DataView( this.response );
// 		//console.timeEnd( 'create dataview' );

// 		var type = p.getUint8( 0 );
// 		var positionLength = p.getFloat64( 0 );
// 		var uvLength = p.getFloat64( 8 );
// 		var normalLength = p.getFloat64( 16 );
// 		var offset = 3 * 8;

// 		//console.time( 'create geometry' );
// 		var geometry = prepareGeometryForMerge( positionLength / 36, { setNormals: true, setUVs: true, setVertexColors: false } );
// 		//console.timeEnd( 'create geometry' );

// 		//console.time( 'copy data' );
// 		memcpy( geometry.attributes.position.array.buffer, 0, this.response, offset, positionLength );
// 		memcpy( geometry.attributes.uv.array.buffer, 0, this.response, offset + positionLength, uvLength );
// 		memcpy( geometry.attributes.normal.array.buffer, 0, this.response, offset + positionLength + uvLength, normalLength );
// 		//console.timeEnd( 'copy data' );

// 		//geometry.attributes.position.array.set( this.response, offset, positionLength )

// 		//console.time( 'create mesh' );
// 		geometry.computeBoundingSphere();

// 		if( callback ) callback( geometry );

// 		//console.timeEnd( 'create mesh' );

// 		//console.timeEnd( 'process 3bgeo' );
// 		//console.timeEnd( 'load 3bgeo' );

// 	} );
// 	xhr.open( 'get', file, true );
// 	xhr.responseType = 'arraybuffer';
// 	xhr.send();

// }





function computeBufferGeometryNormals( geometry ) {

	var faces = geometry.attributes.position.numItems / 9;

	geometry.attributes.normal = {
		itemSize: 3,
		array: new Float32Array( faces * 3 * 3 ),
		numItems: faces * 3 * 3
	};
	var normals = geometry.attributes.normal.array;
	var positions = geometry.attributes.position.array;

	var pA = new THREE.Vector3(),
		pB = new THREE.Vector3(),
		pC = new THREE.Vector3();

	var cb = new THREE.Vector3(),
		ab = new THREE.Vector3();

	for( var p = 0; p < positions.length; p += 9 ) {

		pA.set( positions[ p ], positions[ p + 1 ], positions[ p + 2 ] );
		pB.set( positions[ p + 3 ], positions[ p + 4 ], positions[ p + 5 ] );
		pC.set( positions[ p + 6 ], positions[ p + 7 ], positions[ p + 8 ] );

		cb.subVectors( pC, pB );
		ab.subVectors( pA, pB );
		cb.cross( ab );

		cb.normalize();

		var nx = cb.x;
		var ny = cb.y;
		var nz = cb.z;

		normals[ p ]     = nx;
		normals[ p + 1 ] = ny;
		normals[ p + 2 ] = nz;

		normals[ p + 3 ] = nx;
		normals[ p + 4 ] = ny;
		normals[ p + 5 ] = nz;

		normals[ p + 6 ] = nx;
		normals[ p + 7 ] = ny;
		normals[ p + 8 ] = nz;

	}

}

THREE.BufferGeometry.prototype.computeFaceNormals = function () {

	this.attributes.normal = {
		itemSize: 3,
		array: new Float32Array( this.attributes.position.array.length ),
		numItems: this.attributes.position.numItems
	};

		var cb = new THREE.Vector3(), ab = new THREE.Vector3();
		var i = this.attributes.index.array;
		var v = this.attributes.position.array;
		var n = this.attributes.normal.array;
		var vA = new THREE.Vector3(),
			vB = new THREE.Vector3(),
			vC = new THREE.Vector3();
		var cb = new THREE.Vector3(),
			ab = new THREE.Vector3();

		for ( var f = 0, fl = i.length; f < fl; f += 3 ) {

			vA.set( v[ i[ f ] ], v[ i[ f ] + 1 ], v[ i[ f ] + 2 ] );
			vB.set( v[ i[ f + 1 ] ], v[ i[ f + 1 ] + 1 ], v[ i[ f + 1 ] + 2 ] );
			vC.set( v[ i[ f + 2 ] ], v[ i[ f + 2 ] + 1 ], v[ i[ f + 2 ] + 2 ] );

			cb.subVectors( vC, vB );
			ab.subVectors( vA, vB );
			cb.cross( ab );

			cb.normalize();

			n[ f ] = 0;
			//face.normal.copy( cb );

		}

	}


// Some utils


var THREEx = THREEx || {};
	THREEx.GeometryUtils = THREEx.GeometryUtils || {};

THREEx.GeometryUtils.scale	= function (geometry, scale) {

	// change all geometry.vertices
	for(var i = 0; i < geometry.vertices.length; i++) {
		var vertex	= geometry.vertices[i];
		vertex.x *= scale;
		vertex.y *= scale;
		vertex.z *= scale;
	}

	// mark the vertices as dirty
	geometry.__dirtyVertices = true;

	// return this, to get chained API
	return this;
}

THREEx.GeometryUtils.translate	= function (geometry, delta) {

	// change all geometry.vertices
	for(var i = 0; i < geometry.vertices.length; i++) {
		var vertex	= geometry.vertices[i];
		vertex.x += delta.x;
		vertex.y += delta.y;
		vertex.z += delta.z;
	}

	// mark the vertices as dirty
	geometry.__dirtyVertices = true;
	// return this, to get chained API
	return this;
}

THREEx.GeometryUtils.rotate	= function (geometry, angles, order) {

	order	= order	|| 'XYZ';

	// compute bounding box - TODO is that needed ?
	geometry.computeBoundingBox();

	var matrix	= new THREE.Matrix4();
	matrix.makeRotationFromEuler(angles, order);
	geometry.applyMatrix( matrix );

	// mark the vertices as dirty
	geometry.__dirtyVertices = true;
	// return this, to get chained API
	return this;
}