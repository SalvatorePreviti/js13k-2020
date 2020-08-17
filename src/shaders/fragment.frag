#version 300 es
precision highp float;

const float PI = 3.14159265359;

// Aspect ratio is fixed to 1.5 by design
const float SCREEN_ASPECT_RATIO = 1.5;

// The field of view, in radians
const float FIELD_OF_VIEW = radians(50.0);

// Projection matrix
const float PROJECTION_LEN = 1. / tan(.5 * FIELD_OF_VIEW);

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

// Camera directiom
uniform vec3 iCameraDir;

// Camera rotation x is yaw, y is pitch.
uniform vec2 iCameraEuler;

// Camera rotation matrix
uniform mat3 iCameraMat3;

// Heightmap texture
uniform sampler2D iHeightmap;

// Output color
out vec4 oColor;

// epsilon-type values
const float EPSILON = 0.01;

// maximums
const int MAX_ITERATIONS = 55;
const float MAX_DIST = 200.;

// const delta vectors for normal calculation
const float S = 0.01;
const vec3 deltax = vec3(S, 0, 0);
const vec3 deltay = vec3(0, S, 0);
const vec3 deltaz = vec3(0, 0, S);

float cuboid(vec3 p, vec3 s) {
  vec3 d = abs(p) - s;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float terrain(vec3 p) {
  return p.y - texture(iHeightmap, p.xz / 100.).x * 10.;
}

float distanceToNearestSurface(vec3 p) {
  return terrain(p);
  return cuboid(p, vec3(1));
}

// better normal implementation with half the sample points
// used in the blog post method
vec3 computeSurfaceNormal(vec3 p) {
  float d = distanceToNearestSurface(p);
  float a = distanceToNearestSurface(p + deltax);
  float b = distanceToNearestSurface(p + deltay);
  float c = distanceToNearestSurface(p + deltaz);
  return normalize(vec3(a, b, c) - d);
}

float computeLambert(vec3 p, vec3 n, vec3 l) {
  return dot(normalize(l - p), n);
}

int iterations = 0;

float rayMarch(vec3 p, vec3 dir) {
  float dist = 0.0;
  for (int i = 0; i < MAX_ITERATIONS && dist < MAX_DIST; i++) {
    float nearest = distanceToNearestSurface(p + dir * dist);
    if (abs(nearest) < EPSILON) {
      return dist;
    }
    ++iterations;
    dist += nearest;
  }
  return dist;
}

vec3 intersectWithWorld(vec3 p, vec3 dir) {
  float dist = rayMarch(p, dir);
  if (dist >= MAX_DIST) {
    return vec3(.4, .8, 1);  // sky colour
  }

  vec3 hit = p + dir * dist;
  vec3 normal = computeSurfaceNormal(hit);

  // calculate lighting:
  vec3 lightPosition = vec3(100.0 * sin(iTime), 30.0, 50.0 * cos(iTime));
  float lightIntensity = computeLambert(hit, normal, lightPosition);

  // vec3 color = normal.y > 0.9999 ? vec3(.2, .2, 1) : vec3(.5, .8, .5);
  return vec3(.8) * lightIntensity;
}

void main() {
  vec2 screen = fragCoord / (iResolution * 0.5) - 1.;

  vec3 ray = normalize(iCameraMat3 * vec3(screen.x * -SCREEN_ASPECT_RATIO, screen.y, PROJECTION_LEN));

  vec3 pixelColour = intersectWithWorld(iCameraPos, ray);
  oColor = vec4(pixelColour, 1.0);

  // oColor.x = float(iterations) / (float(MAX_ITERATIONS));
}
