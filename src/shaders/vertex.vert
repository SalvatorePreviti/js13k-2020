#version 300 es
#pragma STDGL invariant(all)

uniform vec3 iResolution;

out vec2 vFrag;
void main() {
  gl_Position = vec4(float((gl_VertexID & 1) << 2), float((gl_VertexID & 2) << 1), 1., 2.) - 1.;
  vFrag = (.5 * gl_Position.xy * iResolution.xy) / iResolution.x;
}
