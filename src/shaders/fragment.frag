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
const int MAX_ITERATIONS = 100;
const float MAX_DIST = 100.;

float cuboid(vec3 p, vec3 s) {
  vec3 d = abs(p) - s;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float terrain(vec3 p) {
  return p.y - texture(iHeightmap, p.xz / 100.).x * 8.;
}

float water(vec3 p) {
  return p.y - .2+sin(iTime + p.z)*.1;
}

int material = 0;

float distanceToNearestSurface(vec3 p) {
  float t = terrain(p);
  float w = water(p);
  if (w<t) {
    material = 1;
    return w;
  }
  material = 0;
  return t;
}

//s is used to vary the "accuracy" of the normal calculation
vec3 computeSurfaceNormal(vec3 p, float s) {
  vec2 S=vec2(s,0);
  float d = distanceToNearestSurface(p);
  float a = distanceToNearestSurface(p + S.xyy);
  float b = distanceToNearestSurface(p + S.yxy);
  float c = distanceToNearestSurface(p + S.yyx);
  return normalize(vec3(a, b, c) - d);
}

float computeLambert(vec3 p, vec3 n, vec3 l) {
  return dot(normalize(l - p), n);
}

float rayMarch(vec3 p, vec3 dir) {
  float dist = 0.0;
  float prevNear = MAX_DIST;
  for (int i = 0; i < MAX_ITERATIONS && dist < MAX_DIST; i++) {
    float nearest = distanceToNearestSurface(p + dir * dist);
    if (abs(nearest) < EPSILON) {
      return dist;
    }
    if (nearest < 0.) {
      dist -= prevNear;
      nearest = prevNear/3.;
    }
    prevNear = nearest;
    dist += nearest;
  }
  return dist;
}

vec3 intersectWithWorld(vec3 p, vec3 dir) {
  float dist = rayMarch(p, dir);
  if (dist >= MAX_DIST-1.) {
    return vec3(.4, .8, 1);  // sky colour
  }
  int m = material;

  vec3 hit = p + dir * dist;
  vec3 normal = m == 0 ? computeSurfaceNormal(hit, 1.) : computeSurfaceNormal(hit, 0.1);

  // calculate lighting:
  vec3 lightPosition = vec3(0,100,0);
  float lightIntensity = computeLambert(hit, normal, lightPosition);

  vec3 color = m == 0 ? vec3(.8) : vec3(vec2(sin(iTime + hit.z)*.2+.2),1);
  return color * lightIntensity;
}

void main() {
  vec2 screen = fragCoord / (iResolution * 0.5) - 1.;

  vec3 ray = normalize(iCameraMat3 * vec3(screen.x * -SCREEN_ASPECT_RATIO, screen.y, PROJECTION_LEN));

  vec3 pixelColour = intersectWithWorld(iCameraPos, ray);
  oColor = vec4(pixelColour, 1.0);

  // oColor.x = float(iterations) / (float(MAX_ITERATIONS));
}
