#version 300 es
precision highp float;

const float PI = 3.14159265359;

// Aspect ratio is fixed to 1.5 by design
const float SCREEN_ASPECT_RATIO = 1.5;

// The field of view, in radians
const float FIELD_OF_VIEW = radians(50.0);

// Projection matrix
const vec2 PROJECTION_LEN = tan(.5 * FIELD_OF_VIEW / vec2(1., SCREEN_ASPECT_RATIO));

// Screen position, in pixels. Bottom left is (0, 0), top right is (iResolution.x-1, iResolution.y-1).
in vec2 fragCoord;

// Screen resolution in pixels.
uniform vec2 iResolution;

// Time in seconds
uniform float iTime;

// Frame index, should not be used but useful for debugging
uniform int iFrame;

// Camera position
uniform vec3 iCameraPos;

// Output color
out vec4 oColor;

// epsilon-type values
const float S = 0.01;
const float EPSILON = 0.01;

// const delta vectors for normal calculation
const vec3 deltax = vec3(S, 0, 0);
const vec3 deltay = vec3(0, S, 0);
const vec3 deltaz = vec3(0, 0, S);

float distanceToNearestSurface(vec3 p) {
  vec3 q = vec3(mod(p.x, 3.0) - 1.5, p.yz);
  float s = 1.0;
  vec3 d = abs(q) - vec3(s);
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

// better normal implementation with half the sample points
// used in the blog post method
vec3 computeSurfaceNormal(vec3 p) {
  float d = distanceToNearestSurface(p);
  return normalize(vec3(distanceToNearestSurface(p + deltax) - d, distanceToNearestSurface(p + deltay) - d,
      distanceToNearestSurface(p + deltaz) - d));
}

vec3 computeLambert(vec3 p, vec3 n, vec3 l) {
  return vec3(dot(normalize(l - p), n));
}

vec3 intersectWithWorld(vec3 p, vec3 dir) {
  float dist = 0.0;
  float nearest = 0.0;
  vec3 result = vec3(0.0);
  for (int i = 0; i < 40; i++) {
    nearest = distanceToNearestSurface(p + dir * dist);
    if (nearest < EPSILON) {
      vec3 hit = p + dir * dist;
      vec3 light = vec3(100.0 * sin(iTime), 30.0, 50.0 * cos(iTime));
      result = computeLambert(hit, computeSurfaceNormal(hit), light);
      break;
    }
    dist += nearest;
  }
  return result;
}

void main() {
  vec2 uv = fragCoord / iResolution;

  float cameraDistance = 10.0;
  // vec3 cameraPosition = vec3(10.0 * sin(iTime), 2.0, 10.0 * cos(iTime));
  vec3 cameraDirection = normalize(vec3(-1.0 * sin(iTime), -0.2, -1.0 * cos(iTime)));
  vec3 cameraUp = vec3(0.0, 1.0, 0.0);

  vec2 camUV = uv * 2.0 - vec2(1.0, 1.0);
  vec3 nright = normalize(cross(cameraUp, cameraDirection));

  vec3 pixel =
      iCameraPos + cameraDirection + nright * camUV.x * PROJECTION_LEN.x + cameraUp * camUV.y * PROJECTION_LEN.y;

  vec3 rayDirection = normalize(pixel - iCameraPos);

  vec3 pixelColour = intersectWithWorld(iCameraPos, rayDirection);
  oColor = vec4(pixelColour, 1.0);
}
