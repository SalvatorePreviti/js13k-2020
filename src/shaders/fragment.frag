#version 300 es
precision highp float;

// Aspect ratio is fixed to 1.5 by design
const float SCREEN_ASPECT_RATIO = 1.5;

// Screen resolution in pixels. z component is always 1
uniform vec3 iResolution;

// Time in seconds
uniform float iTime;

// Frame index, should not be used but useful for debugging
uniform int iFrame;

// Screen position, already normalized
in vec2 vFrag;

// Output color
out vec4 oColor;

const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPSILON = 0.0001;

float sphereSDF(vec3 samplePoint) {
  return length(samplePoint) - 1.;
}

float sceneSDF(vec3 samplePoint) {
  return sphereSDF(samplePoint);
}

float shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start, float end) {
  float depth = start;
  for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
    float dist = sceneSDF(eye + depth * marchingDirection);
    if (dist < EPSILON) {
      return depth;
    }
    depth += dist;
    if (depth >= end) {
      return end;
    }
  }
  return end;
}

vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
  vec2 xy = fragCoord - size / 2.0;
  float z = size.y / tan(radians(fieldOfView) / 2.0);
  return normalize(vec3(xy, -z));
}

void main() {
  vec3 dir = rayDirection(45.0, vec2(1, 1), vFrag);
  vec3 eye = vec3(0.0, 0.0, 5.0);
  float dist = shortestDistanceToSurface(eye, dir, MIN_DIST, MAX_DIST);

  if (dist > MAX_DIST - EPSILON) {
    // Didn't hit anything
    oColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }

  oColor = vec4(1.0, 0.0, 0.0, 1.0);
}
