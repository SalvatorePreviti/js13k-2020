#version 300 es
precision highp float;

uniform vec2 iResolution;

in vec2 fragUV;
out vec4 outColor;

void main() {
  outColor = vec4(fragUV.x, fragUV.y, -fragUV.y, 1.);
}
