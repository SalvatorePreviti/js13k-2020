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

float cylinder(vec3 p, float r, float l) {
	float d = length(p.xy) - r;
	d = max(d, abs(p.z) - l);
	return d;
}

//hg_sdf: http://mercury.sexy/hg_sdf/
//splits world up with limits
float pModInterval(inout float p, float size, float start, float stop) {
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p+halfsize, size) - halfsize;
	if (c > stop) {
		p += size*(c - stop);
		c = stop;
	}
	if (c <start) {
		p += size*(c - start);
		c = start;
	}
	return c;
}

//s is number of segments (*2 + 1, so 5 = 11 segments)
float bridge(vec3 p, float s) {
  p.y += cos(p.z*2./s);
  p.x = abs(p.x);
  float ropes = cylinder(p-vec3(.8,1.,0), .05, s);
  pModInterval(p.z, 1.0, -s, s);
  ropes = min(ropes, cylinder(p.xzy-vec3(.8,0,.5), .05, .5));
  float boards = cuboid(p, vec3(.8,.05,.4));
  return min(
    boards, 
    ropes
  );
}

float water(vec3 p) {
  return p.y - .2+sin(iTime + p.z)*.1;
}

float terrain(vec3 p) {
  return p.y - texture(iHeightmap, p.xz / 100.).x * 8.;
}

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}

float nonTerrain(vec3 p) {
  float w = water(p);
  p.xz *= rot(.4);
  float b = bridge(p-vec3(60,6.5,25), 10.);
  return min(w,b);
}

int material = 0;

float distanceToNearestSurface(vec3 p) {
  float t = terrain(p);
  float n = nonTerrain(p);
  if (t<n) {
    material = 0;
    return t;
  }
  material = 1;
  return n;
}

//s is used to vary the "accuracy" of the normal calculation
vec3 computeNonTerrainNormal(vec3 p) {
  vec2 S=vec2(0.1,0);
  float d = nonTerrain(p);
  float a = nonTerrain(p + S.xyy);
  float b = nonTerrain(p + S.yxy);
  float c = nonTerrain(p + S.yyx);
  return normalize(vec3(a, b, c) - d);
}

vec3 computeTerrainNormal(vec3 p) {
  vec2 S=vec2(1.0,0);
  float d = terrain(p);
  float a = terrain(p + S.xyy);
  float b = terrain(p + S.yxy);
  float c = terrain(p + S.yyx);
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
  vec3 normal = m == 0 ? computeTerrainNormal(hit) : computeNonTerrainNormal(hit);

  // calculate lighting:
  vec3 lightPosition = vec3(0,100,0);
  float lightIntensity = computeLambert(hit, normal, lightPosition);

  vec3 color = vec3(.8);
  return color * lightIntensity;
}

void main() {
  vec2 screen = fragCoord / (iResolution * 0.5) - 1.;

  vec3 ray = normalize(iCameraMat3 * vec3(screen.x * -SCREEN_ASPECT_RATIO, screen.y, PROJECTION_LEN));

  vec3 pixelColour = intersectWithWorld(iCameraPos, ray);
  oColor = vec4(pixelColour, 1.0);

  // oColor.x = float(iterations) / (float(MAX_ITERATIONS));
}
