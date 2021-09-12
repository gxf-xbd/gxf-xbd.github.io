precision highp float;

varying lowp float ang;

const vec3 c1 = vec3(0.2, 0.5, 0.8);
//const vec3 c1 = vec3(1.0, 1.0, 1.0);
const vec3 c2 = vec3(0.1, 0.1, 0.1);

void main(void) {
    float c = ang * 0.5 + 0.5;
    //c *= 0.7;
    gl_FragColor = vec4(c1 * c + c2 * (1.0 - c), 1);
}