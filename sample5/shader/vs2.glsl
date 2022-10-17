precision highp float;

attribute vec4 vertex;
attribute vec4 normal;
uniform mat4 mat_mod;
uniform mat4 mat_view;
uniform mat4 mat_proj;

varying lowp float ang;

const vec3 up = vec3(0.0, 1.0, 0.0);

void main(void) {
    gl_Position = mat_proj * (mat_view * mat_mod) * vertex;
    ang = dot(up, (mat_mod * vec4(normal.xyz, 0)).xyz);
}