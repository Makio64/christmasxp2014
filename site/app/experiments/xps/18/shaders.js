
var ADD_VERTEX_SHADER_SOURCE = [
    'precision highp float;',

    'attribute vec2 a_position;',

    'void main () {',
        'gl_PointSize = 15.0;',
        'gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);',
    '}'
].join('\n');

var ADD_FRAGMENT_SHADER_SOURCE = [
    'precision highp float;',

    'void main () {',
        'vec2 coordinates = (gl_PointCoord.xy - 0.5) * 15.0 / 1024.0;',
        'float distanceToDrop = length(coordinates);',
        'float drop = max(0.0, 1.0 - distanceToDrop / 0.003);',
        'drop = 1.0 - cos(drop * 3.141592);',
        'gl_FragColor = vec4(-drop * 0.1, 0.0, 0.0, 0.0);',
    '}'
].join('\n');

var SIMULATION_VERTEX_SHADER_SOURCE = [
    'precision highp float;',

    'attribute vec2 a_position;',

    'varying vec2 v_coordinates;',

    'void main () {',
        'v_coordinates = a_position * 0.5 + 0.5;',

        'gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
].join('\n');

var SIMULATION_FRAGMENT_SHADER_SOURCE = [
    'precision highp float;',

    'varying vec2 v_coordinates;',

    'uniform sampler2D u_heightfieldTexture;',
    'uniform float u_heightfieldResolution;',

    'uniform float u_gridLength;',

    'void main () {',
        'float delta = 1.0 / u_heightfieldResolution;',

        'vec4 center = texture2D(u_heightfieldTexture, v_coordinates + vec2(0.0, 0.0));',
        'vec4 left = texture2D(u_heightfieldTexture, v_coordinates + vec2(-delta, 0.0));',
        'vec4 right = texture2D(u_heightfieldTexture, v_coordinates + vec2(delta, 0.0));',
        'vec4 up = texture2D(u_heightfieldTexture, v_coordinates + vec2(0.0, delta));',
        'vec4 down = texture2D(u_heightfieldTexture, v_coordinates + vec2(0.0, -delta));',

        'float f = (left[0] + right[0] + down[0] + up[0]) / 4.0 - center[0];',

        'vec4 new = vec4(0.0);',

        'new[1] = center[1] + f;',
        'new[1] *= 0.97;',
        'new[0] = center[0] + new[1];',

        'gl_FragColor = vec4(new.rgb, 1.0);',
    '}'
].join('\n');

var NORMALS_VERTEX_SHADER_SOURCE = [
    'precision highp float;',

    'attribute vec2 a_position;',

    'varying vec2 v_coordinates;',

    'void main () {',
        'v_coordinates = a_position * 0.5 + 0.5;',

        'gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
].join('\n');

var NORMALS_FRAGMENT_SHADER_SOURCE = [
    'precision highp float;',

    'varying vec2 v_coordinates;',

    'uniform sampler2D u_heightfieldTexture;',
    'uniform float u_heightfieldResolution;',
    'uniform float u_gridLength;',

    'void main () {',
        'float delta = 1.0 / u_heightfieldResolution;',

        'float left = texture2D(u_heightfieldTexture, v_coordinates + vec2(-delta, 0.0)).r;',
        'float right = texture2D(u_heightfieldTexture, v_coordinates + vec2(delta, 0.0)).r;',
        'float up = texture2D(u_heightfieldTexture, v_coordinates + vec2(0.0, delta)).r;',
        'float down = texture2D(u_heightfieldTexture, v_coordinates + vec2(0.0, -delta)).r;',

        'vec3 tangent = vec3(u_gridLength / (u_heightfieldResolution * 0.5), right - left, 0.0);',
        'vec3 bitangent = vec3(0.0, up - down, u_gridLength / (u_heightfieldResolution * 0.5));',

        'vec3 normal = -normalize(cross(tangent, bitangent));',

        'gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);',
    '}'
].join('\n');

var RENDER_VERTEX_SHADER_SOURCE = [
    'precision highp float;',

    'attribute vec2 a_coordinates;',

    'varying vec2 v_coordinates;',
    'varying vec3 v_position;',

    'uniform float u_gridLength;',

    'uniform mat4 u_viewMatrix;',
    'uniform mat4 u_projectionMatrix;',

    'void main () {',
        'v_coordinates = a_coordinates * 0.5 + 0.5;',

        'vec3 position = vec3(a_coordinates.x * 0.5 + 0.5, 0.0, a_coordinates.y * 0.5 + 0.5) * u_gridLength;',
        'v_position = position;',

        'gl_Position = u_projectionMatrix * u_viewMatrix * vec4(position, 1.0);',
    '}'
].join('\n');

var RENDER_FRAGMENT_SHADER_SOURCE = [
    'precision highp float;',

    'varying vec2 v_coordinates;',
    'varying vec3 v_position;',

    'uniform sampler2D u_normalsTexture;',

    'uniform sampler2D u_skyTexture;',
    
    'uniform vec3 u_cameraPosition;',

    'void main () {',
        'vec3 normal = normalize(texture2D(u_normalsTexture, v_coordinates).rgb * 2.0 - 1.0);',

        'vec3 view = normalize(u_cameraPosition - v_position);',
        'float fresnel = 0.02 + 0.98 * pow(1.0 - dot(normal, view), 8.0);',

        'vec3 reflectDirection = normalize(reflect(view, normal));',
        'vec3 sky = texture2D(u_skyTexture, reflectDirection.xz * 0.5 + 0.5).rgb;',

        'gl_FragColor = vec4(30.0 * fresnel * sky + 0.5 * vec3(40.0, 70.0, 100.0) / 255.0, 1.0);',

    '}'
].join('\n');

var SNOW_VERTEX_SHADER_SOURCE = [
    'precision highp float;',

    'attribute vec3 a_position;',

    'uniform mat4 u_viewMatrix;',
    'uniform mat4 u_projectionMatrix;',

    'void main () {',
        
        'vec3 viewSpacePosition = vec3(u_viewMatrix * vec4(a_position, 1.0));',
        'float dist = length(viewSpacePosition);',

        'gl_PointSize = 500.0 / dist;',

        'gl_Position = u_projectionMatrix * vec4(viewSpacePosition, 1.0);',
    '}'
].join('\n');

var SNOW_FRAGMENT_SHADER_SOURCE = [
    'precision highp float;',

    'uniform sampler2D u_texture;',

    'void main () {',
        'gl_FragColor = texture2D(u_texture, gl_PointCoord) * vec4(vec3(1.0), 0.2);',
    '}'
].join('\n');