#version 300 es
precision highp float;

uniform vec2 iResolution;

out vec2 fragUV;
void main() {
  gl_Position = vec4(float((gl_VertexID & 1) << 2) - 1., float((gl_VertexID & 2) << 1) - 1., 0, 1);
  fragUV = (.5 * gl_Position.xy * iResolution) / iResolution.x;
}
