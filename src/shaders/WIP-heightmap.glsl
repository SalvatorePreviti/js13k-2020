#version 300 es
precision highp float;
precision highp int;

const uint RANDOM_SEED = 4398249u;

const float PI = 3.14159265359;

// Screen position, in pixels. Bottom left is (0, 0), top right is (iResolution.x-1, iResolution.y-1).
in vec2 fragCoord;

// Screen resolution in pixels.
uniform vec2 iResolution;

// Output color
out vec4 oColor;

vec3 hash3(vec2 p) {
  vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)));
  return fract(sin(q) * 43758.5453);
}

uint n = RANDOM_SEED;
uint k = 0x4a6c93bu;

float rnd() {
  n ^= (n << 24);
  n ^= (n >> 1);
  n *= k;
  n ^= (n << 1);
  n *= k;
  return fract(float(n & 0x7fffffffu) / float(0x7fffffffu));
}

vec2 rnd2() {
  return vec2(rnd(), rnd());
}

vec4 packFloat(float v) {
  vec4 enc = clamp(v, 0., 1.) * (vec4(1., 255., 65025., 160581375.) * .999998);
  enc = fract(enc);
  enc -= enc.yzww * vec4(1. / 255., 1. / 255., 1. / 255., 0.);
  return enc;
}

/*float noise(in vec2 x, float v) {
  vec2 p = floor(x);
  vec2 f = fract(x);

  float k = 1.0 + 63.0 * pow(1.0 - v, 4.0);

  float va = 0.0;
  float wt = 0.0;
  for (float j = -2.; j <= 2.; j++)
    for (float i = -2.; i <= 2.; i++) {
      vec2 g = vec2(i, j);
      vec3 o = hash3(p + g);
      float ww = pow(1.0 - smoothstep(0.0, 1.414, length(g - f + o.xy)), k);
      va += o.z * ww;
      wt += ww;
    }

  return va / wt;
}

const mat2 m2 = mat2(0.8, -0.6, 0.6, 0.8);
float fbm(in vec2 p) {
  float f = 0.0;
  f += 0.5000 * noise(p, 1.);
  p = m2 * p * 2.02;
  f += 0.2500 * noise(p + f, 0.7);
  p = m2 * p * 2.03;
  f += 0.1250 * noise(p + f, 0.6);
  p = m2 * p * 2.01;
  f += 0.0625 * noise(p + f, 0.6);

  return f / 0.9375;
}*/

// noise
//  float r = fbm(screen * 2.5);
//  r = 0.95 - r * r;
//  oColor = vec4(r, r, r, 1.);

uniform float iTime;

///////////////////////////

float triangle(vec2 pos, vec2 a, vec2 b, vec2 c) {
  vec2 as = pos - a, bs = pos - b;
  return min((c.x - b.x) * bs.y - (c.y - b.y) * bs.x,
      min((b.x - a.x) * as.y - (b.y - a.y) * as.x, (a.x - c.x) * as.y - (a.y - c.y) * as.x));
}

float triangles(vec2 pos, float f) {
  for (int i = 0; i < 64; ++i) {
    vec2 a = rnd2(), b = rnd2(), c = rnd2(), distort = rnd2();
    float erode = rnd() * -0.001;
    f += max(erode, 1.5 * triangle(pos, a, b, c) * 2.);
  }
  for (int i = 0; i < 64; ++i) {
    vec2 a = rnd2(), b = rnd2(), c = rnd2();
    f += max(0., triangle(pos, a, b, c));
  }
  /*for (int i = -1; i < 25; ++i) {
    f += Tri(pos, vec2(.2, -.3), 0., 1.5);
    f += Tri(pos, vec2(-.2, .2), 0., 1.5);
  }*/
  return f;
}

///////////////////////////

float rand(float n) {
  return fract(cos(n * 89.42) * 343.42);
}
vec2 rand(vec2 n) {
  return vec2(rand(n.x * 23.62 - 300.0 + n.y * 34.35), rand(n.x * 45.13 + 256.0 + n.y * 38.89));
}

// returns (dx, dy, distance)
vec3 worley(vec2 n, float s) {
  vec3 ret = vec3(s * 10.);
  // look in 9 cells (n, plus 8 surrounding)
  for (int x = -1; x < 2; x++) {
    for (int y = -1; y < 2; y++) {
      vec2 xy = vec2(x, y);  // xy can be thought of as both # of cells distance to n, and
      vec2 cellIndex = floor(n / s) + xy;
      vec2 worleyPoint = rand(cellIndex);  // random point in this cell (0-1)
      worleyPoint += xy - fract(n / s);  // turn it into distance to n. ;
      float d = dot(worleyPoint, worleyPoint) * s;
      if (d < ret.z)
        ret = vec3(worleyPoint, d);
    }
  }
  return ret;
}

///////////////////////////

uint baseHash(uvec2 p) {
  uvec2 q = 1103515245u * ((p >> 1u) ^ (p.yx) + RANDOM_SEED);
  return 1103515245u * (q.x ^ q.y >> 3U);
}

/*vec2 hash22(vec2 p) {
  p = p * mat2(127.1, 311.7, 269.5, 183.3);
  p = -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  return sin(p * 6.283 + iTime);
}*/

vec2 hash22(vec2 x) {
  uint n = baseHash(uvec2(x * 99999.));
  uvec2 rz = uvec2(n, n * 48271U);
  return vec2(rz.xy) / float(0x7fffffff) - 1.;
}

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

/*float snoise(vec2 v) {
  const float Cx = (3. - sqrt(3.)) / 6.;
  const vec4 C = vec4(Cx, .5 * (sqrt(3.) - 1.), -1. + 2. * Cx, 1. / 41.);

  // First corner
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  // Other corners
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz - vec4(i1, 0., 0.);

  // Permutations
  i = mod289(i);  // Avoid truncation effects in permutation
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  // Gradients: 41 points uniformly over a line, mapped onto a diamond.
  // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m *= m;

  // Normalise gradients implicitly by scaling m
  m *= m * inversesqrt(a0 * a0 + h * h);  // * .4 ?

  // Compute final noise value at P
  return 130.0 * dot(m, vec3(a0.x * x0.x + h.x * x0.y, a0.yz * x12.xz + h.yz * x12.yw));
}*/

////////////////////////////////////////////////////////////////////////
////// Simplex Noise by Iq, https://www.shadertoy.com/view/Msf3WH
////// The MIT License, Copyright © 2013 Inigo Quilez
////////////////////////////////////////////////////////////////////////
float simplex(in vec2 p) {
  const float K1 = (sqrt(3.) - 1.) / 2.;
  const float K2 = (3. - sqrt(3.)) / 6.;

  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1. - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1. + 2. * K2;
  vec3 h = max(.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), .0);
  vec3 n = h * h * h * h * vec3(dot(a, hash22(i)), dot(b, hash22(i + o)), dot(c, hash22(i + 1.)));
  return dot(n, vec3(70.));
}
////////////////////////////////////////////////////////////////////////

float simplexFBM(float size, float persistence, vec2 coord) {
  float c = 1.;
  float p = 1.0;
  float n = 0.0;

  float vmin = 10.;
  float vmax = -10.;
  for (int i = 1; i <= 7; i++) {
    c += simplex(coord * size) * p;
    n += p;
    size *= 1.8;  // Scale
    p *= persistence;
  }
  c /= n;  // Normalize

  return c;
}

void main() {
  vec2 pos = fragCoord / iResolution;
  pos.y = 1. - pos.y;

  vec2 uv = fragCoord / iResolution;

  // float n = (simplex(16. * pos) + 1.) * .5;

  float n = simplexFBM(3.0, 0.5, uv);

  // create a half sphere shape
  // float f = 0.7 - 2.0 * distance(uv, vec2(0.5));

  oColor = packFloat(n);
}
