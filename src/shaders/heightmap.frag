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

vec4 packFloat(float v) {
  vec4 enc = clamp(v, 0., 1.) * (vec4(1., 255., 65025., 160581375.) * .999998);
  enc = fract(enc);
  enc -= enc.yzww * vec4(1. / 255., 1. / 255., 1. / 255., 0.);
  return enc;
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

////////////////////////////////////////////////////////////////////////
////// Integer hash by Iq, https://www.shadertoy.com/view/4tXyWN
////// The MIT License, Copyright © 2017 Inigo Quilez
////////////////////////////////////////////////////////////////////////
uint baseHash(uvec2 p) {
  uvec2 q = 1103515245U * ((p >> 1U) ^ p.yx + RANDOM_SEED);
  return 1103515245U * (q.x ^ (q.y >> 3U));
}

vec2 hash22(vec2 x) {
  uint n = baseHash(uvec2(x * 99999.));
  uvec2 rz = uvec2(n, n * 48271U);
  return vec2(rz.xy) / float(0x7fffffff) - 1.;
}

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

float squareGradient(vec2 pos) {
  // square gradient
  vec2 distV = pos * 2.0 - 1.0;
  float maxDist = max(abs(distV.x), abs(distV.y));
  float circular = length(distV);
  float square = maxDist;
  return (1. - mix(circular, square, maxDist));
}

void main() {
  vec2 pos = fragCoord / iResolution;
  pos.y = 1. - pos.y;

  float n = simplexFBM(3.0, 0.5, pos);

  oColor = packFloat(n * squareGradient(pos));
}
