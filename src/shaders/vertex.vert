#version 300 es
#pragma STDGL invariant(all)

#define iResolution iR
uniform vec2 iResolution;

out vec2 FC;
void main() {
  vec2 t = vec2(float((gl_VertexID & 1) << 2), float((gl_VertexID & 2) << 1));
  gl_Position = vec4(t.xy - 1., 0., 1.);
  FC = t.xy * iResolution * .5;
}
