precision mediump float;

varying lowp float ang;

void main(void) {
    float c = ang * 0.25 + 0.5;
    gl_FragColor = vec4(c, c, c, 1);//vec4(1.0);
}