#version 300 es
precision highp float;

const float PI = 3.14159265359;

// Screen position, in pixels. Bottom left is (0, 0), top right is (iResolution.x-1, iResolution.y-1).
in vec2 fragCoord;

// Screen resolution in pixels.
uniform vec2 iResolution;

// Output color
out vec4 oColor;

void main() {
  vec2 screen = fragCoord / (iResolution * 0.5) - 1.;

  oColor = vec4(1.);
}
