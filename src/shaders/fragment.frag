#version 300 es
precision highp float;

#define MATERIAL_SKY 0
#define MATERIAL_WATER 1
#define MATERIAL_TERRAIN 2
#define MATERIAL_BUILDINGS 3

const float PI = 3.14159265359;

// Size in pixels of the noise texture
const float NOISE_TEXTURE_SIZE = 512.;

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

// Noise texture
uniform sampler2D iNoise;

// Output color
out vec4 oColor;

// epsilon-type values
const float MIN_EPSILON = 0.01;
const float MAX_EPSILON = 0.35;

const float MIN_TERRAIN_EPSILON = 0.08;
const float MAX_TERRAIN_EPSILON = 2.1;

const vec3 TERRAIN_SIZE = vec3(500., 50., 500.);
const float TERRAIN_OFFSET = 3.;

// maximums
const int MAX_ITERATIONS = 100;
const float MIN_DIST = 0.4;
const float MAX_DIST = 500.;

float unpackFloat(vec4 rgba) {
  return dot(rgba, vec4(1.0, 1. / 255., 1. / 65025., 1. / 160581375.));
}

//=== PRIMITIVES ===
float sphere(vec3 p, float s) {
  return length(p) - s;
}

float cuboid(vec3 p, vec3 s) {
  vec3 d = abs(p) - s;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float cylinder(vec3 p, float r, float l) {
  float d = length(p.xy) - r;
  d = max(d, abs(p.z) - l);
  return d;
}

//=== OPERATIONS ===
// hg_sdf: http://mercury.sexy/hg_sdf/
// splits world up with limits
float pModInterval(inout float p, float size, float start, float stop) {
  float halfsize = size * 0.5;
  float c = floor((p + halfsize) / size);
  p = mod(p + halfsize, size) - halfsize;
  if (c > stop) {
    p += size * (c - stop);
    c = stop;
  }
  if (c < start) {
    p += size * (c - start);
    c = start;
  }
  return c;
}

// Repeat around the origin a number of times
void pModPolar(inout vec2 p, float repetitions) {
  float angle = 2. * PI / repetitions;
  float a = atan(p.y, p.x) + angle / 2.;
  float r = length(p);
  a = mod(a, angle) - angle / 2.;
  p = vec2(cos(a), sin(a)) * r;
}

float opOnion(in float sdf, in float thickness) {
  return abs(sdf) - thickness;
}

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, s, -s, c);
}

// === GEOMETRY ===

// s is number of segments (*2 + 1, so 5 = 11 segments)
float bridge(vec3 p, float s) {
  p.y += cos(p.z * 2. / s);
  p.x = abs(p.x);
  float ropes = cylinder(p - vec3(.5, 1., 0), .01, s);
  pModInterval(p.z, .55, -s, s);
  ropes = min(ropes, cylinder(p.xzy - vec3(.5, 0, .5), .01, .5));
  float boards = cuboid(p, vec3(.5, .05, .2));
  return min(boards, ropes);
}

// rotation.x controls elevation/altitude, rotation.y controls azimuth
float antenna(vec3 p, vec2 rotation) {
  float size = 30.;
  p.y -= size;
  vec3 q = p;
  q.xz *= rot(rotation.y);
  q.xy *= rot(rotation.x);
  q.y -= size;
  float r = max(opOnion(sphere(q, size), size / 50.),
      q.y + size / 2.  // cut the sphere part-way up
  );
  r = min(r, cylinder(q.xzy + vec3(0, 0, size * .5), size * .02, size * .5));
  r = min(r, sphere(q, size / 20.));
  p.y += size * .75;
  r = min(r, cuboid(p, vec3(size / 4., size / 3., size / 2.)));
  p.y -= size * .25;
  r = min(r, cylinder(p.xzy, size * .05, size * .5));
  return r;
}

float iterations = 0.;

float terrain(vec3 p) {
  float height = unpackFloat(texture(iHeightmap, p.xz / TERRAIN_SIZE.xz));
  return p.y - height * TERRAIN_SIZE.y + TERRAIN_OFFSET;
}

float monument(vec3 p) {
  pModPolar(p.xz, 8.);
  p.x -= 10.;
  return cuboid(p, vec3(.5, 5, 1));
}

float prison(vec3 p) {
  p.y -= 2.;
  float r = max(opOnion(cuboid(p, vec3(5, 2, 3)), 0.23),
      -min(cylinder(p, 1., 100.), cuboid(p - vec3(5, -.77, 1.5), vec3(2, 1, .53))));
  pModInterval(p.x, .3, -10., 10.);
  p.z = abs(p.z);
  return min(r, cylinder(p.xzy - vec3(0, 3, 0), .01, 1.));
}

float nonTerrain(vec3 p) {
  float b = bridge(p - vec3(60, 6.5, 25), 10.);
  float a = antenna(p - vec3(380, 35, 80), vec2(0.5, iTime));
  float m = prison(p);
  return min(b, min(a, m));
}

int material = MATERIAL_SKY;

float distanceToNearestSurface(vec3 p) {
  float t = terrain(p);
  float n = nonTerrain(p);
  if (t < n) {
    material = MATERIAL_TERRAIN;
    return t;
  }
  material = MATERIAL_BUILDINGS;
  return n;
}

vec3 computeNonTerrainNormal(vec3 p) {
  const vec2 S = vec2(0.01, 0);
  float d = nonTerrain(p);
  float a = nonTerrain(p + S.xyy);
  float b = nonTerrain(p + S.yxy);
  float c = nonTerrain(p + S.yyx);
  return normalize(vec3(a, b, c) - d);
}

vec3 computeTerrainNormal(vec3 p) {
  const vec2 S = vec2(0.45, 0);
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
  float dist = MIN_DIST;
  float prevNear = MAX_DIST;

  for (int i = 0; i < MAX_ITERATIONS; i++) {
    ++iterations;
    float nearest = distanceToNearestSurface(p + dir * dist);

    if (nearest < 0.) {
      dist -= prevNear;
      nearest = prevNear / 2.;
    }

    dist += nearest;

    float distPercent = dist / MAX_DIST;
    distPercent *= distPercent;

    float epsilon = material == MATERIAL_TERRAIN ? mix(MIN_TERRAIN_EPSILON, MAX_TERRAIN_EPSILON, distPercent)
                                                 : mix(MIN_EPSILON, MAX_EPSILON, distPercent);

    if (abs(nearest) < epsilon || distPercent > 1.) {
      break;
    }

    prevNear = nearest;
  }
  return dist;
}

float rayTraceWater(vec3 p, vec3 dir) {
  float t = (sin(iTime * 2. + 3.) * .1 - p.y) / dir.y;
  return t >= 0. ? t : MAX_DIST;
}

vec3 waterNoise(vec2 o) {
  vec2 f = fract(o);
  vec4 T = texture(iNoise, (floor(o) + .45) / NOISE_TEXTURE_SIZE);
  float a = T.x, b = T.y, c = T.z, d = T.w;
  vec2 f2 = f * f, f3 = f2 * f;
  vec2 t = 3.0 * f2 - 2.0 * f3, dt = 6.0 * f - 6.0 * f2;
  float ba = b - a;
  float e = d - c - ba;
  float w = c - a + e * t.x;
  float dx = (ba + e * t.y) * dt.x;
  return vec3((ba + e * t.y) * dt.x, w * dt.y, a + ba * t.x + w * t.y);
}

vec3 waterFBM(vec2 p) {
  float ps = 0.75;
  vec3 f = vec3(0.0);
  float tot = 0.0;
  float a = 1.0;

  float flow = 0.;

  for (int i = 0; i < 4; i++) {
    p += iTime;
    flow *= -0.75;
    vec3 v = waterNoise(p + sin(p.yx * .5 + iTime) * .5);
    f += v * a;
    p += v.xy * 0.43;
    p *= 2.0;
    tot += a;
    a *= ps;
  }
  return f / tot;
}

vec4 waterHeightAndNormal(vec2 p) {
  vec3 dxy = waterFBM(p / 10.);
  return vec4(normalize(vec3(dxy.x, dxy.y, 1.)), dxy.z);
}

vec3 applyFog(vec3 rgb,  // original color of the pixel
    float distance)  // camera to point distance
{
  float fogAmount = 1.0 - exp(-distance * 0.009);
  vec3 fogColor = vec3(.4, .8, 1);
  return mix(rgb, fogColor, fogAmount);
}

vec3 getColorAt(vec3 hit, vec3 normal, int mat) {
  // calculate lighting:
  vec3 lightPosition = vec3(0, 100, 0);
  float lightIntensity = computeLambert(hit, normal, lightPosition);

  vec3 color = vec3(.8);
  switch (mat) {
    case MATERIAL_WATER: color = vec3(.15, .52, .73); break;
    case MATERIAL_TERRAIN:
      color = mix(vec3(.93, .8, .64),
                  mix(vec3(.69 + texture(iNoise, hit.xz * 0.0001).x, .67, .65), vec3(.38, .52, .23),
                      dot(normal, vec3(0, 1, 0))),
                  clamp(hit.y * .5 - 1., 0., 1.)) +
          texture(iNoise, hit.xz * 0.05).x * 0.1;
      break;
  }
  return color * lightIntensity;
}

vec3 intersectWithWorld(vec3 p, vec3 dir) {
  float dist = rayMarch(p, dir);
  float wdist = rayTraceWater(p, dir);

  vec3 waterColor;
  float waterTransparencyMix = 0.;
  if (wdist < dist) {
    // get the water color
    vec3 waterhit = p + dir * wdist;
    vec4 whn = waterHeightAndNormal(waterhit.xz);
    vec3 waterNormal = whn.yzw;

    waterColor = getColorAt(waterhit, waterNormal, MATERIAL_WATER);
    waterTransparencyMix = clamp((dist - wdist) * .5, 0., 1.);
  }

  if (min(dist, wdist) >= MAX_DIST - 1.) {
    return vec3(.4, .8, 1);  // sky colour
  }

  vec3 hit = p + dir * dist;
  vec3 normal;
  switch (material) {
    case MATERIAL_TERRAIN: normal = computeTerrainNormal(hit); break;
    default: normal = computeNonTerrainNormal(hit); break;
  }

  vec3 colWithTransparency = mix(getColorAt(hit, normal, material), waterColor, waterTransparencyMix);

  return applyFog(colWithTransparency, min(wdist, dist));
}

void main() {
  vec2 screen = fragCoord / (iResolution * 0.5) - 1.;

  vec3 ray = normalize(iCameraMat3 * vec3(screen.x * -SCREEN_ASPECT_RATIO, screen.y, PROJECTION_LEN));
  vec3 c = iCameraPos;
  // c.y = unpackFloat(texture(iHeightmap, c.xz / TERRAIN_SIZE.xz)) * TERRAIN_SIZE.y - 1.;
  vec3 pixelColour = intersectWithWorld(c, ray);
  oColor = vec4(pixelColour, 1.0);
  oColor.x = iterations / float(MAX_ITERATIONS);
}
