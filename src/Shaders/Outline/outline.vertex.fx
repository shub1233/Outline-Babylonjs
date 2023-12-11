precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 worldViewProjection;
uniform float u_thickness;
void main(void) {
    vec3 transformed = position + normal * u_thickness;
    gl_Position = worldViewProjection * vec4(transformed, 1.0);
}
