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

// Game object uniforms
// Key
uniform bool iGOKeyVisible;

// Animation uniforms
// Prison Door 0 - closed, 1 - open
uniform float iAnimPrisonDoor;

uniform bool iFlashlightOn;

// Output color
out vec4 oColor;

//=== COLORS ===

const vec3 COLOR_SKY = vec3(.4, .8, 1);
const vec3 COLOR_SUN = vec3(1.1, .9, .85);

// epsilon-type values
const float MIN_EPSILON = 0.001;
const float MAX_EPSILON = 0.35;

const float MIN_TERRAIN_EPSILON = 0.08;
const float MAX_TERRAIN_EPSILON = 0.8;

const vec3 TERRAIN_SIZE = vec3(500., 50., 500.);
const float TERRAIN_OFFSET = 3.;

const vec3 TERRAIN_CENTER = TERRAIN_SIZE * .5;

// maximums
const int MAX_ITERATIONS = 100;
const float MIN_DIST = 0.15;
const float MAX_DIST = 500.;

const vec3 SUNLIGHT_DIRECTION = normalize(vec3(1,1,-1));

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
  float bounds = length(p) - s * .6;
  if (bounds > 4.)
    return bounds;
  p.y += cos(p.z * 2. / s);
  p.x = abs(p.x);
  float ropes = cylinder(p - vec3(.5, 1., 0), .01, s * .55);
  pModInterval(p.z, .55, -s, s);
  ropes = min(ropes, cylinder(p.xzy - vec3(.5, 0, .5), .01, .5));
  float boards = cuboid(p, vec3(.5, .05, .2));
  return min(boards, ropes);
}

// rotation.x controls elevation/altitude, rotation.y controls azimuth
float antenna(vec3 p, vec2 rotation) {
  float size = 30.;
  float bounds = length(p) - size * 2.;
  if (bounds > 15.)
    return bounds;
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

float ruinedBuildings(vec3 p) {
  float bounds = length(p) - 95.;
  if (bounds > 15.)
    return bounds;
  p.y += p.x * p.x * 0.001;  // slight bend
  p.xy *= rot(PI / 3.);
  float r = cuboid(p - vec3(16, 0, 0), vec3(15, 74, 15));
  float r2 = cuboid(p - vec3(-16, 20, 0), vec3(15, 74, 15));
  vec3 q = mod(p + 2., 4.) - 2.;
  return max(min(r, r2), -cuboid(q, vec3(1.5)));
}

float monument(vec3 p) {
  float bounds = length(p) - 12.;
  if (bounds > 3.)
    return bounds;
  pModPolar(p.xz, 8.);
  p.x -= 10.;
  return cuboid(p, vec3(.5, 5, 1));
}

float prison(vec3 p) {
  float bounds = length(p) - 8.;
  if (bounds > 5.)
    return bounds;
  p.y -= 2.;
  float r = max(opOnion(cuboid(p, vec3(5, 2, 3)), 0.23),
      -min(cylinder(p, 1., 100.), cuboid(p - vec3(5, -.77, 1.5), vec3(2, 1, .53))));
  vec3 q = p - vec3(5, -.77, 1);
  q.xz *= rot(-iAnimPrisonDoor * PI / 2.);
  float door = cuboid(q - vec3(0, 0, .52), vec3(.05, .99, .52));
  pModInterval(p.x, .3, -10., 10.);
  p.z = abs(p.z);
  r = min(r, cylinder(p.xzy - vec3(0, 3, 0), .01, 1.));
  return min(r, door);
}

float gameObjectKey(vec3 p) {
  if (!iGOKeyVisible)
    return MAX_DIST;
  float bounds = length(p) - .3;
  if (bounds > .3)
    return bounds;
  float r = cylinder(p, .01, .06);  // shaft
  r = min(r, cylinder(p.yzx + vec3(0, .1, 0), .04, .005));  // handle
  r = min(r, cuboid(p - vec3(0, -.01, .04), vec3(.002, .02, .02)));

  return r;
}

float gameObjects(vec3 p) {
  return gameObjectKey(p - vec3(0, 1, 0));
}

float iterations = 0.;

float terrain(vec3 p) {
  float height = unpackFloat(texture(iHeightmap, p.xz / TERRAIN_SIZE.xz + .5)) * TERRAIN_SIZE.y;
  vec2 d = abs(vec2(length(p.xz), p.y + 3. + TERRAIN_OFFSET)) - vec2(TERRAIN_SIZE.x * .5 * sqrt(2.), height + 3.);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float nonTerrain(vec3 p) {
  float b = bridge(p - vec3(60, 20.5, 25), 10.);
  float a = antenna(p - vec3(380, 35, 80), vec2(0.5, iTime));
  float m = monument(p - vec3(20));
  float pr = prison(p);
  float r = ruinedBuildings(p - vec3(100, 10, 300));
  return min(gameObjects(p), min(min(b, r), min(a, min(m, pr))));
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
  const vec2 S = vec2(0.001, 0);
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

float computeLambert(vec3 n, vec3 ld) {
  return clamp(dot(normalize(ld), n), 0., 1.);
}

const float MAX_OMEGA = 1.2;
float iterationsR;

float rayMarch(vec3 p, vec3 dir) {
  float omega = MAX_OMEGA;

  float dist = MIN_DIST;
  float prevNear = MAX_DIST;

  float stepLen = MIN_EPSILON;
  float epsilon = MIN_EPSILON;

  float funcSign = 1.;
  iterationsR = 0.;

  float result = MAX_DIST;

  for (int i = 0; i < MAX_ITERATIONS; i++) {
    vec3 hit = p + dir * dist;

    float nearest = funcSign * distanceToNearestSurface(hit);

    if (nearest < 0.) {
      if (iterationsR == 0.) {
        funcSign = -1.;
        nearest = -nearest;
      } else {
        dist -= prevNear;
        nearest = prevNear / 2.;
      }
    }

    float radius = abs(nearest);

    // Inspired by https://erleuchtet.org/~cupe/permanent/enhanced_sphere_tracing.pdf
    bool sorFail = omega > 1. && radius + prevNear + epsilon < stepLen;
    stepLen = sorFail ? (1. - omega) * stepLen : omega * nearest;
    omega = clamp(sorFail ? omega - max(radius, epsilon) : omega + max(radius, epsilon), 1., MAX_OMEGA);

    dist += stepLen;

    float distR = dist / MAX_DIST;
    float epsAdjust = distR * max(distR + iterationsR * 8., 1.);

    epsilon = material == MATERIAL_TERRAIN ? mix(MIN_TERRAIN_EPSILON, MAX_TERRAIN_EPSILON, epsAdjust)
                                           : mix(MIN_EPSILON, MAX_EPSILON, epsAdjust);

    if ((!sorFail && radius < epsilon) || dist > MAX_DIST) {
      return dist;
    }

    prevNear = nearest;
    iterationsR += 1. / float(MAX_ITERATIONS);
  }

  return MAX_DIST;
}

#define SHADOW_ITERATIONS 50
float getShadow(vec3 p, float camDistance, vec3 n) {
  float res = 1.;
  float dist = clamp(camDistance * 0.005, 0.01, .1); //start further out from the surface if the camera is far away
  p = p + n * dist; //Jump out of the surface by the normal * that dist
  for (int i = 0; dist < 100. && i < SHADOW_ITERATIONS; i++) {
    float nearest = nonTerrain(p+SUNLIGHT_DIRECTION*dist);
    if (nearest < clamp(float(i)/float(SHADOW_ITERATIONS*8), 0.001, .1))
      return 0.;
    res = min( res, 32.*nearest/dist ); //soft shadows
    dist += nearest;
  }
  return res;
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
  vec2 t = 3. * f2 - 2. * f3, dt = 6. * (f - f2);
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

vec3 applyFog( vec3  rgb, float distance, vec3 rayDir)
{
    float fogAmount = 1.0 - exp( -distance*0.005 );
    float sunAmount = max( dot( rayDir, SUNLIGHT_DIRECTION ), 0.0 );
    vec3  fogColor  = mix( COLOR_SKY, COLOR_SUN, pow(sunAmount,10.0));
    return mix( rgb, fogColor, fogAmount );
}

vec3 getColorAt(vec3 hit, vec3 normal, int mat) {
  vec3 color = vec3(.8);
  switch (mat) {
    case MATERIAL_WATER: color = vec3(.15, .52, .73); break;
    case MATERIAL_TERRAIN:
      color = mix(vec3(.93, .8, .64),
                  mix(vec3(.69 + texture(iNoise, hit.xz * 0.0001).x, .67, .65), vec3(.38, .52, .23),
                      dot(normal, vec3(0, 1, 0))),
                  clamp(hit.y * .5 - 1., 0., 1.)) +
          texture(iNoise, hit.xz * 0.05).x * 0.1 + texture(iNoise, hit.xz * 0.005).x * 0.1;
      ;
      break;
  }
  return color;
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
    waterColor *= computeLambert(waterNormal, SUNLIGHT_DIRECTION);
    float sp=dot(SUNLIGHT_DIRECTION,reflect(dir,waterNormal));
    sp = pow(clamp(sp,0.0,1.0),50.);
    waterColor = clamp(waterColor+sp,0.,1.);
    waterTransparencyMix = clamp((dist - wdist) * .5, 0., 1.);
  }

  vec3 color;
  float mdist = min(dist, wdist);
  if (mdist >= MAX_DIST - 1.) {
    color = COLOR_SKY; //mix(COLOR_SKY, COLOR_SUN, pow(clamp(dot(dir, SUNLIGHT_DIRECTION),0.,1.),10.));
  } else {
    vec3 hit = p + dir * dist;
    vec3 normal;
    int mat = material;
    switch (mat) {
      case MATERIAL_TERRAIN: normal = computeTerrainNormal(hit); break;
      default: normal = computeNonTerrainNormal(hit); break;
    }
    color = getColorAt(hit, normal, mat);
    float shadow = getShadow(p+dir*mdist, mdist, normal);
    float lightIntensity = computeLambert(normal, SUNLIGHT_DIRECTION);
    
    if (iFlashlightOn && material != MATERIAL_TERRAIN && dist < 20.) {
      lightIntensity += computeLambert(normal, -dir) * (1.-lightIntensity);
      shadow += pow(clamp(dot(iCameraDir, dir), 0.,1.), 32.) * smoothstep(10., 0., dist) * (1.-shadow);
    }

    color = mix(color, waterColor, waterTransparencyMix) * (COLOR_SUN * lightIntensity);
    color *= (shadow * 0.9 + 0.1);
  }
  //return applyFog(colWithTransparency, min(wdist, dist));
  return applyFog(color, min(wdist, dist), dir);
}

void main_coll();

// Main shader
void main_() {
  vec2 screen = fragCoord / (iResolution * 0.5) - 1.;

  vec3 ray = normalize(iCameraMat3 * vec3(screen.x * -SCREEN_ASPECT_RATIO, screen.y, PROJECTION_LEN));
  vec3 c = iCameraPos;
  // c.y = unpackFloat(texture(iHeightmap, c.xz / TERRAIN_SIZE.xz)) * TERRAIN_SIZE.y - 1.;
  vec3 pixelColour = clamp(intersectWithWorld(c, ray), 0., 1.);


  //pixelColour = pow( pixelColour, vec3(1./2.2) );
  oColor = vec4(pixelColour, 1.0);

  // if (screen.y < 0.) { // for debugging the collision shader
  //  main_coll();
  //}

  // oColor.x = iterationsR;
  // oColor.y = iterationsR;
  // oColor.z = iterationsR;
}

// Collision shader
void main_coll() {
  vec2 screen = fragCoord / (iResolution * 0.5) - 1.;

  vec3 ray = normalize(vec3(0., screen.y, PI/2.));

  ray.xz = ray.xz * rot(screen.x * PI);

  float dist = rayMarch(iCameraPos, ray);

  oColor = vec4(dist < .5 ? 1. : 0., dist / MAX_DIST, dist / MAX_DIST, 1.0);
}