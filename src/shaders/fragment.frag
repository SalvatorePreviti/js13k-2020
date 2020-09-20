#version 300 es
precision highp float;

#define MATERIAL_SKY 0
#define MATERIAL_TERRAIN 1
#define MATERIAL_BUILDINGS 2
#define MATERIAL_SCREEN 3

// Sub materials of MATERIAL_BUILDINGS
#define SUBMATERIAL_WOOD -1
#define SUBMATERIAL_CONCRETE 0  // 0 and below have concrete texture.
#define SUBMATERIAL_METAL 1  //>0 is smooth and has specular
#define SUBMATERIAL_BRIGHT_RED 2
#define SUBMATERIAL_DARK_RED 3
#define SUBMATERIAL_BLACK_PURPLE 4
#define SUBMATERIAL_YELLOW 5

const float PI = 3.14159265359;

// Size in pixels of the noise texture
const float NOISE_TEXTURE_SIZE = 512.;

const float COLLISION_TEXTURE_SIZE = 128.;

const float PRERENDERED_TEXTURE_SIZE = 256.;

const int NOISE_TEXTURE_BITMASK = 0x1ff;

// Aspect ratio is fixed to 1.5 by design
const float SCREEN_ASPECT_RATIO = 1.5;

// The field of view, in radians
const float FIELD_OF_VIEW = radians(45.0);

// Projection matrix
const float PROJECTION_LEN = 1. / tan(.5 * FIELD_OF_VIEW);

in vec2 FC;

uniform vec2 iR;
uniform vec3 iP;
uniform vec4 iD;
uniform vec4 iA;
uniform vec4 iB;
uniform vec4 iC;
uniform vec4 iS;
uniform vec4 iX;
uniform mat3 iM;
uniform lowp int iF;

///// I/O /////

// Screen position, in pixels. Bottom left is (0, 0), top right is (iResolution.x-1, iResolution.y-1).
#define fragCoord FC

// Output color
#define oColor oC
out vec4 oColor;

///// Core uniforms /////

// Screen resolution in pixels.
#define iResolution iR

// Camera position
#define iCameraPos iP

// Camera directiom
#define iCameraDir iD.xyz

// Time in seconds
#define iTime iD.w

// Sunlight direction
#define iSunDirection iS.xyz

// Current level of water
#define iWaterLevel iS.w

// Camera rotation matrix
#define iCameraMat3 iM

///// Game object uniforms /////

// Flashlight on
#define iFlashlightOn ((iF & 0x01) != 0)

// Prison Key
#define iGOKeyVisible ((iF & 0x02) != 0)

// Flashlight
#define iGOFlashlightVisible ((iF & 0x04) != 0)

// Antenna key
#define iGOAntennaKeyVisible ((iF & 0x08) != 0)

// Floppy Disk
#define iGOFloppyDiskVisible ((iF & 0x10) != 0)

///// Animation uniforms /////

// Prison Door 0 - closed, 1 - open
#define iAnimPrisonDoor iA.x

// Antenna Door 0-1
#define iAnimAntennaDoor iA.y

// Monument Descend
#define iAnimMonumentDescend iA.z

// Oil Rig Ramp (and lever in antenna room for 0-1 of it)
#define iAnimOilrigRamp iA.w

// the wheel on the rig
#define iAnimOilrigWheel iB.x

// antenna rotation
#define iAnimAntennaRotation iB.y

// elevator height
#define iAnimElevatorHeight iB.z

// submarine position
#define iSubmarineHeight iB.w

// the inner ramp
#define iAnimOilrigInnerRamp iX.x

///// Textures /////

// Noise texture
#define iNoise tN
uniform highp sampler2D iNoise;

// Heightmap texture
#define iHeightmap tH
uniform highp sampler2D iHeightmap;

// Prerendered texture
#define iPrerendered tP
uniform highp sampler2D iPrerendered;

// Screens texture
#define iScreens tS
uniform highp sampler2D iScreens;

//=== STATE ===

// Keep the current epsilon global
float epsilon;

//=== COLORS ===

const vec3 COLOR_SKY = vec3(.4, .8, 1);
const vec3 COLOR_SUN = vec3(1.065, .95, .85);

const vec3 TERRAIN_SIZE = vec3(120., 19., 78.);
const float TERRAIN_OFFSET = 3.;
const float UNDERGROUND_LEVEL = -TERRAIN_OFFSET + 0.0005;

// maximums
const int MAX_ITERATIONS = 100;
const float MIN_DIST = 0.15;
const float MAX_DIST = 150.;
const float HORIZON_DIST = 500.;

float clamp01(float v) {
  return clamp(v, 0., 1.);
}

vec2 clamp01(vec2 v) {
  return clamp(v, 0., 1.);
}

// polynomial smooth min (k = 0.1);
float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.) / k;
  return min(a, b) - h * h * k / 4.;
}

vec4 packFloat(float v) {
  vec4 enc = clamp01(v) * (vec4(1., 255., 65025., 160581375.) * .999998);
  enc = fract(enc);
  enc -= enc.yzww * vec4(1. / 255., 1. / 255., 1. / 255., 0.);
  return enc;
}

float unpackFloat(vec4 rgba) {
  return dot(rgba, vec4(1.0, 1. / 255., 1. / 65025., 1. / 160581375.));
}

/**
 Returns 3D value noise (in .x)  and its derivatives (in .yz).
 Based on https://www.iquilezles.org/www/articles/gradientnoise/gradientnoise.htm by Iq
*/
vec3 noiseDxy(vec2 x) {
  vec4 T = texelFetch(iNoise, ivec2(floor(x)) & NOISE_TEXTURE_BITMASK, 0);
  float xba = T.y - T.x, xca = T.z - T.x;
  float abcd = T.w - xba - T.z;
  vec2 ffract = fract(x), fsquared = ffract * ffract;
  vec2 u = fsquared * (3. - 2. * ffract);
  return vec3((T.x + xba * u.x + xca * u.y + abcd * u.x * u.y),
      (30. * fsquared * (ffract * (ffract - 2.) + 1.)) * (vec2(xba, xca) + abcd * u.yx));
}

int subMaterial = SUBMATERIAL_CONCRETE;
float subMaterialDistance = MAX_DIST;

// Updates the subMaterialDistance and subMaterial if the distance is lower
void updateSubMaterial(int sm, float dist) {
  if (dist < epsilon && dist != subMaterialDistance) {
    subMaterial = sm;
    subMaterialDistance = dist;
  }
}

//=== PRIMITIVES ===
float sphere(vec3 p, float s) {
  return length(p) - s;
}

float cuboid(vec3 p, vec3 s) {
  vec3 d = abs(p) - s;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float cube(vec3 p, float s) {
  vec3 d = abs(p) - s;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float cylinder(vec3 p, float r, float l) {
  float d = length(p.xy) - r;
  return max(d, abs(p.z) - l);
}

float torus(vec3 p, vec2 t) {
  return length(vec2(length(p.xz) - t.x, p.y)) - t.y;
}

//=== OPERATIONS ===
// hg_sdf: http://mercury.sexy/hg_sdf/
// splits world up with limits
float pModInterval(float value, float size, float start, float stop) {
  float halfsize = size * .5;
  float c = floor((value + halfsize) / size);
  float p = mod(value + halfsize, size) - halfsize;
  return c > stop ? p + size * (c - stop) : c < start ? p + size * (c - start) : p;
}

// Repeat around the origin a number of times
vec2 pModPolar2(vec2 xy, float repetitions) {
  float halfAngle = PI / repetitions;
  float a = mod(atan(xy.y, xy.x) + halfAngle, halfAngle * 2.) - halfAngle;
  return vec2(cos(a), sin(a)) * length(xy);
}

// Repeat around the origin a number of times, also adding a rotation
vec2 pModPolar2Rot(vec2 xy, float repetitions, float additionalRotation) {
  float halfAngle = PI / repetitions;
  float a = mod(atan(xy.y, xy.x) + halfAngle + additionalRotation, halfAngle * 2.) - halfAngle;
  return vec2(cos(a), sin(a)) * length(xy);
}

float opOnion(float sdf, float thickness) {
  return abs(sdf) - thickness;
}

#define ELONGATE(p, h) (p - clamp(p, -h, h))

// Rotation by a dynamic angle
mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, s, -s, c);
}

vec3 invZ(vec3 p) {
  return vec3(p.xy, -p.z);
}

// === GEOMETRY ===
float gameObjectFlashlight(vec3 p) {
  float bounds = length(p) - .3;
  if (bounds > .3)
    return bounds;
  p.xz *= rot(-1.2);
  p.yz *= rot(-.2);
  return min(cylinder(p, .025, .1), max(sphere(p - vec3(0, 0, .12), .05), p.z - .12));
}

float gameObjectKey(vec3 p) {
  float bounds = length(p) - .3;
  if (bounds > .3)
    return bounds;
  float r = cylinder(p, .01, .06);  // shaft
  r = min(r, cylinder(p.yzx + vec3(0, .1, 0), .04, .005));  // handle
  r = min(r, cuboid(p - vec3(0, -.01, .04), vec3(.002, .02, .02)));

  return r;
}

float gameObjectFloppy(vec3 p) {
  float clip = cuboid(p - vec3(.03, 0, 0), vec3(.03, .006, .03));
  updateSubMaterial(SUBMATERIAL_METAL, clip);
  return min(cuboid(p, vec3(.06, .005, .06)), clip);
}

// s is number of segments (*2 + 1, so 5 = 11 segments)
float bridge(vec3 p, float s, float bend) {
  float bounds = length(p) - s * .6;
  if (bounds > 4.) {
    return bounds;
  }

  p.y += cos(p.z * bend / s);
  p.x = abs(p.x);
  float boards = cuboid(p - vec3(.2, 0, 0), vec3(.1, .03, s * .55));
  float ropes = cylinder(p - vec3(.5, 1., 0), .02, s * .55);
  p.z = pModInterval(p.z, .55, -s, s);
  ropes = min(ropes, cylinder(p.xzy - vec3(.5, 0, .5), .02, .5));
  updateSubMaterial(SUBMATERIAL_METAL, ropes);
  boards = min(boards, cuboid(p, vec3(.5, .05, .2)));
  updateSubMaterial(SUBMATERIAL_WOOD, boards);
  return min(boards, ropes);
}

float antennaConsole(vec3 p) {
  float bounds = length(p) - 2.;
  if (bounds > 1.)
    return bounds;
  vec3 q = p;
  q.xy *= rot(-.25);
  float r = cuboid(q + vec3(.2, .25, 0), vec3(.25, .5, .5)) - 0.01;
  q -= vec3(-.13, .25, 0);
  q.z = pModInterval(q.z, .04, -10., 10.);
  q.x = pModInterval(q.x, .04, -3., 3.);
  float keys = cube(q, .01) - .005;
  updateSubMaterial(SUBMATERIAL_METAL, keys);
  r = min(min(r, keys), cuboid(p - vec3(-.45, .2, 0), vec3(.2, .8, .5)) - 0.01);
  return r;
}

float antennaCable(vec3 p) {
  p.zy *= rot(.06);
  p.y += cos(p.z / 20.) * 3.;
  return cylinder(p, 0.01, 27.5);
}

float antennaDoor(vec3 p) {
  float bounds = length(p) - 3.;
  if (bounds > .5)
    return bounds;
  p.xz -= vec2(1., -.05);
  p.zx *= rot(iAnimAntennaDoor * -2.5);  // Door opening animation
  p.xz += vec2(1., -.05);
  float door = cylinder(p, .99, .05);  // the door itself
  vec3 rp = vec3(pModPolar2(p.xy, 8.), p.z);
  return max(door,
      -min(cuboid(rp - vec3(.5, 0, .1), vec3(.02, .1, .1)),  // The monument-style impression
          cylinder(rp - vec3(0, 0, .1), .02, .1)  // key-hole in the center
          ));
}

/* leverState goes from 0-1 - 0 is up, 1 is down */
float lever(vec3 p, float leverState) {
  float bounds = length(p) - 1.;
  if (bounds > 1.)
    return bounds;
  float r = cuboid(p, vec3(.2, .5, .05));
  r = max(r, -cuboid(p, vec3(.03, .2, 1)));
  p.yz *= rot(-PI / 2. * leverState + PI / 4.);
  p.z += .2;
  r = min(r, cylinder(p, .02, .2));
  p.z += .2;
  r = min(r, cylinder(p, .03, .05));
  return r;
}

// rotation.x controls elevation/altitude, rotation.y controls azimuth
float antenna(vec3 p) {
  const float size = 9.;
  float bounds = length(p) - size * 2.;
  if (bounds > 5.)
    return bounds;
  p.y -= size;

  vec3 q = p;
  q.xz *= rot(iAnimAntennaRotation);
  q.xy *= rot(0.5);
  q.y -= size;
  float dishSphere = sphere(q, size);
  float dish = max(opOnion(dishSphere, .01),
      q.y + size / 2.  // cut the sphere part-way up
  );
  dish = min(dish, cylinder(q.xzy + vec3(0, 0, size * .5), .1, size * .5));
  dish = min(dish, sphere(q, .3));
  p.y += size * .75;
  float structure = cuboid(p, size / vec3(4., 2.5, 2.));
  structure = min(structure,
      min(max(opOnion(cylinder(p.xzy - vec3(size / 4., 0, 0), size / 2. - .1, size / 2.5 - .1), .1),
              -min(cylinder(p.zyx - vec3(0, 1.8, 0), 1., 100.),  // hole for the door
                  cylinder(p - vec3(4.5, 2.3, 0), .4, 100.)  // hole for the windows
                  )),
          cylinder(p.xzy - vec3(size / 4., 0, -2.2), size / 2. - .1, size / 3. - .1)  // Floor of the internal room
          ));
  float console = antennaConsole(p - vec3(3, 1.5, 2));
  float door = antennaDoor(p.zyx - vec3(0, 1.8, 6.5));
  float oilrigLever = lever(invZ(p - vec3(3.7, 2, -4)), clamp(iAnimOilrigRamp, 0., 1.));

  p.y -= size * .25;
  structure = max(min(structure, cylinder(p.xzy, size * .05, size * .53)), -dishSphere);
  p -= vec3(7, -2.85, 0);
  p.xy *= rot(-.5);
  structure = min(structure, cuboid(p, vec3(1, 1, .8)) - .01);
  float metalThings = min(dish, door);
  updateSubMaterial(SUBMATERIAL_BRIGHT_RED, oilrigLever);
  updateSubMaterial(SUBMATERIAL_DARK_RED, console);
  updateSubMaterial(SUBMATERIAL_YELLOW, metalThings);

  return min(min(console, structure), min(metalThings, oilrigLever));
}

float monument(vec3 p) {
  float bounds = length(p.xz) - 2.;
  if (bounds > 3.) {
    return bounds;
  }

  float r = cylinder(p.xzy, .2, .5);  // the button mount

  float ph = p.y + iAnimMonumentDescend * 4.;
  if (iGOAntennaKeyVisible) {
    float key = gameObjectKey(vec3(p.x, ph, p.z) + vec3(1.05, -5.05, 1.05));
    if (key < r) {
      updateSubMaterial(SUBMATERIAL_BRIGHT_RED, key);
      r = key;
    }
  }

  float m = cuboid(vec3(pModPolar2(p.xz, 8.), ph).xzy - vec3(1.5, 0, 0), vec3(.1, 5, .2));  // the actual monument
  if (m < r) {
    updateSubMaterial(SUBMATERIAL_BLACK_PURPLE, m);
    r = m;
  }

  float b = cylinder(p.xzy + vec3(0, 0, clamp(iAnimMonumentDescend, 0., .02)), .05, .53);  // the button
  if (b < r) {
    updateSubMaterial(SUBMATERIAL_METAL, b);
    r = b;
  }

  return r;
}

float prison(vec3 ip) {
  vec3 p = ip.zyx - vec3(11, 1.25, -44);

  float bounds = length(p) - 8.;
  if (bounds > 5.)
    return bounds;
  p.y -= 2.;
  float cornerBox = cuboid(p - vec3(-2.7, -1, -1.3), vec3(0.35, .5, .5));
  float structure = max(opOnion(cuboid(p, vec3(4, 1.6, 2)), 0.23),  // The main box
      -min(  // Cut holes for:
          cylinder(p - vec3(0, .5, 0), .8, 100.),  // the windows
          cuboid(p - vec3(4, -.37, 1), vec3(2, 1, .53))  // the door
          ));

  // The door itself & animation
  vec3 q = p - vec3(4, -.77, .5);
  q.xz *= rot(-iAnimPrisonDoor * PI / 2.);
  float door = cuboid(q - vec3(0, .4, .5), vec3(.05, .99, .52));

  // The bars on the windows:
  p.x = pModInterval(p.x, .3, -10., 10.);  // repeat along x
  p.z = abs(p.z);  // mirror on z axis
  float bars = cylinder(p.xzy - vec3(0, 2, .5), .01, 1.);  // draw a single bar
  float woodThings = min(cornerBox, door);
  updateSubMaterial(SUBMATERIAL_METAL, bars);
  updateSubMaterial(SUBMATERIAL_WOOD, woodThings);

  float nearest = min(bars, min(structure, woodThings));

  float gameObjects = MAX_DIST;

  if (iGOFlashlightVisible) {
    gameObjects = gameObjectFlashlight(ip - vec3(-42, 3, 11.2));
  }

  if (iGOKeyVisible) {
    gameObjects = min(gameObjects, gameObjectKey(ip.yzx - vec3(2., 7.4, -45.5)));
  }

  if (gameObjects < nearest) {
    updateSubMaterial(SUBMATERIAL_BRIGHT_RED, gameObjects);
    return gameObjects;
  }
  return nearest;
}

float submarine(vec3 p) {
  // clang-format off
  float bounds = length(p)-9.;
  if (bounds > 1.) {
    return bounds;
  }
  p.xz *= rot(-PI/4.);
  float dock = cuboid(p-vec3(-1.5,1,5), vec3(1,.2,3));
  p.y -= iSubmarineHeight;
  vec3 q = p.xzy - vec3(-2.,0,2.);
  float sub = smin(
    sphere(ELONGATE(p, vec3(6,0,0)), 1.7), //main body
    min(
      cylinder(ELONGATE(q, vec3(.5,0,0)), .4, .5), //the top/periscope thingy
      min(
        cuboid(p-vec3(7.5,0,0), vec3(0.3,2,.05)) - .05,
        cuboid(p-vec3(7.5,0,0), vec3(0.3,.05,2)) - .05
      )
    ),
    0.3
  );
  updateSubMaterial(SUBMATERIAL_DARK_RED, sub);
  return min(dock, sub);
  // clang-format on
}

float oilrig(vec3 p) {
  float bounds = length(p) - 13.;
  if (bounds > 3.) {
    return bounds;
  }

  vec3 absp = abs(p);  // mirror
  vec3 q = vec3(absp.x, abs(p.y - 4.58), absp.z);  // mirror in x & z and y with a translation
  float yellow = lever(invZ(p.xzy - vec3(1.9, -1.5, .2)) * .5, min(1., (6. - iAnimOilrigInnerRamp) * .2)) / .5;
  float platforms =
      max(cuboid(vec3(p.x, abs(p.y - 3.5) - 3.5, p.z), vec3(6, .2, 6)) - .05,  // platforms (mirrored around y=3.5)
          max(-cube(p - vec3(2, 7, 2), 1.5),  // hole in upper platform
              -cube(p - vec3(5.7, 0, 4), .52))  // hole in lower platform for the bridge
      );

  vec3 u = p - vec3(5, 7.6, -2);
  u.xy *= rot(.3);  // rotate the console towards player

  vec3 e = vec3(p.xy, abs(p.z + 2.));  // mirror around z=2
  yellow = min(yellow,
      min(min(cylinder(e.xzy - vec3(-6, 1.1, 8.7), 1., 1.75),  // tank
              cylinder(e.xzy - vec3(-6.5, 1.1, 0), .2, 8.)),  // pipe from tanks to sea
          cylinder(vec3(p.z, abs(p.y - 7.6), p.x) - vec3(-3, .2, 0), .1, 5.)));  // pipes from console to tank

  float metal =
      min(min(min(cylinder(vec3(absp.xz, p.y) - vec3(5, 5, 0), .5, 8.3),  // main platform cylinders
                  cylinder(q.zyx - vec3(5.3, 3.5, 0), .05, 5.3)),  // guard rails
              max(cylinder(q - vec3(5.3, 3.5, 0), .05, 5.3),  // guard rails
                  -cube(p - vec3(5, .7, 4), .8)  // cut a hole in the guard rails where the bridge will connect
                  )),
          cuboid(u, vec3(.5, .6, 1.5)) - 0.05  // console
      );

  updateSubMaterial(SUBMATERIAL_METAL, metal);

  vec3 r = p - vec3(2, 3.59, -.1);
  r.zy *= rot(-PI / 4.);
  r.y -= iAnimOilrigInnerRamp;
  yellow = min(yellow, cuboid(r, vec3(1, 5.1, .02)) - .05);  // ramp from lower platform to upper
  updateSubMaterial(SUBMATERIAL_YELLOW, yellow);
  float result = min(min(platforms, yellow), metal);

  vec3 t = u - vec3(0, .8, 0);
  if (length(t) - 1. < 2.) {  // Wheel
    float wheel =
        min(min(torus(t, vec2(.5, .02)), cylinder(t.xzy + vec3(0, 0, .5), .02, .5)),  // center-column of spokes
            cylinder(vec3(pModPolar2Rot(t.xz, 5., iAnimOilrigWheel), t.y).zyx - vec3(0, 0, .25), .01, .25));  // spokes
    if (wheel < result) {
      updateSubMaterial(SUBMATERIAL_BRIGHT_RED, wheel);
      result = wheel;
    }
  }
  return result;
}

float oilrigBridge(vec3 p) {
  vec3 q = p.zyx - vec3(4, -1, 17);
  q.zy *= rot(-.19);
  q.z -= 19. - iAnimOilrigRamp;  // 0: sticking out of sand slightly, 19 - connected with the oil rig
  return min(bridge(q, 21., 0.), cylinder(q.xzy + vec3(0, 10.5, 6), 0.15, 5.));
}

float guardTower(vec3 ip) {
  vec3 p = ip - vec3(8.7, 9.3, 37);

  // clang-format off
  float bounds = length(p.xz) - 5.;
  if (bounds > 4.) {
    return bounds;
  }

  vec3 q = vec3(pModPolar2(p.xz, 6.), p.y).xzy;
  vec3 z = vec3(q.x, pModInterval(p.y, 1.5, -3., 7.), q.z);

  float structure = max(
      max(
        min(
          cylinder(p.xzy,1.1,12.),  //outer cylinder
          max(
            opOnion(cylinder(p.xzy-vec3(0,0,14.),4.,2.), .2),  //top part
            -cuboid(q-vec3(4.,14,0),vec3(1., 1., 2.))  //cut out the windows
          )
        ),
        -min(
          cylinder(p.xzy,1.,13.),  //cut hole down center (not using opOnion, because want to cut out the end too)
          cuboid(z-vec3(1.,0,0),vec3(.2, .3, .13)) //cut out the slits
        )
      ),
      -cuboid(p+vec3(0,7,1), vec3(.8,1.2,.8))  //cut doorway out
  );

  vec3 l = vec3(p.x, p.y - iAnimElevatorHeight, p.z);

  float elevator = cylinder(l.xzy,1.,11.);  //elevator

  l.y = pModInterval(l.y, 1.5, -7., 7.);

  elevator = max(
    elevator,
    -torus(l,vec2(1.,.01))
  );

  vec3 k = vec3(p.x - .8, pModInterval(p.y-12.7, 20.5, -1., 0.), p.z +.9);

  float elevatorButton = sphere(k-vec3(0, .5, 0), .06);
  float buttonPost = min(
    cylinder(k.xzy, .05, .5),
    min(
      cuboid(k-vec3(0, .5, 0), vec3(.05,.1,.1)),
      elevatorButton
    )
  );
  updateSubMaterial(SUBMATERIAL_BRIGHT_RED, elevatorButton);
  updateSubMaterial(SUBMATERIAL_METAL, buttonPost);
  updateSubMaterial(SUBMATERIAL_YELLOW, elevator);

  float nearest = min(
    min(structure, min(buttonPost, elevator)),
    cuboid(p+vec3(0,10.3,3), vec3(1.1,2.,3.)) //the platform to the bottom lift section
  );

  if (iGOFloppyDiskVisible) {
    float floppyNearest = gameObjectFloppy(ip - vec3(12.15, 22.31, 38.65));
    if (floppyNearest < nearest) {
      updateSubMaterial(SUBMATERIAL_BRIGHT_RED, floppyNearest);
      return floppyNearest;
    }
  }

  return nearest;
  // clang-format on
}

vec2 screenCoords;
float screen(vec3 p, vec3 screenPosition, vec2 size) {
  p -= screenPosition;
  float bounds = length(p) - 2.;
  if (bounds > .5)
    return bounds;
  p.xz *= rot(PI / 2.);
  screenCoords = (size - p.xy) / (size * 2.);
  float screen = cuboid(p, vec3(size.xy, 0.01));
  return screen;
}

float terrain(vec3 p) {
  vec3 d = abs(vec3(p.x, p.y + TERRAIN_OFFSET, p.z)) - vec3(TERRAIN_SIZE.x * .5, 0., TERRAIN_SIZE.z * .5);
  if (d.x < 0. && d.z < 0.) {
    d.y -= unpackFloat(textureLod(iHeightmap, p.xz / TERRAIN_SIZE.xz + .5, 0.)) * TERRAIN_SIZE.y;
  }
  return min(d.y, 0.0) + length(max(d, 0.0));
}

float nonTerrain(vec3 p) {
  float b = bridge(p - vec3(45, 1.7, 22.4), 10., 2.);
  float a = antenna(p - vec3(2, 10, 2));
  float m = monument(p - vec3(47.5, 3.5, 30.5));
  float pr = prison(p);
  vec3 oilrigCoords = p - vec3(26, 5, -58);
  oilrigCoords.xz *= rot(PI / 2. + 0.4);
  float o = oilrig(oilrigCoords);
  float ob = oilrigBridge(oilrigCoords);
  float aoc = antennaCable(oilrigCoords.zyx - vec3(-2, 9.7, 32.5));
  float guardTower = guardTower(p);
  float submarine = submarine(p - vec3(-46, -.5, -30));
  float structures = min(min(min(b, a), min(m, pr)), min(o, min(ob, min(guardTower, submarine))));

  if (aoc < structures) {
    updateSubMaterial(SUBMATERIAL_METAL, aoc);
    return aoc;
  }

  updateSubMaterial(SUBMATERIAL_CONCRETE, structures);
  return structures;
}

int material = MATERIAL_SKY;

float distanceToNearestSurface(vec3 p) {
  float t = terrain(p);
  if (t <= epsilon) {
    material = MATERIAL_TERRAIN;
    return t;
  }
  float n = nonTerrain(p);
  float s = screen(p, vec3(4.76, 14.42, 4), vec2(.45, .29));
  float sn = min(s, n);
  if (t < sn) {
    material = MATERIAL_TERRAIN;
    return t;
  }
  material = s <= n ? MATERIAL_SCREEN : MATERIAL_BUILDINGS;
  return sn;
}

vec3 computeNonTerrainNormal(vec3 p) {
  const vec2 S = vec2(0.001, 0);
  return normalize(vec3(nonTerrain(p + S.xyy), nonTerrain(p + S.yxy), nonTerrain(p + S.yyx)) - nonTerrain(p));
}

vec3 computeTerrainNormal(vec3 p, float dist) {
  vec2 S = vec2(mix(0.03, 0.001, min(dist / TERRAIN_SIZE.x, 1.)), 0);
  return normalize(vec3(terrain(p + S.xyy), terrain(p + S.yxy), terrain(p + S.yyx)) - terrain(p));
}

float rayTraceGround(vec3 p, vec3 dir) {
  float t = (-TERRAIN_OFFSET - p.y) / dir.y;
  return t >= 0. && t < HORIZON_DIST ? t : HORIZON_DIST;
}

float rayMarch(vec3 p, vec3 dir, float min_epsilon, float dist) {
  float result = HORIZON_DIST;
  float prevNear = min_epsilon;

  for (int i = 0;; i++) {
    vec3 hit = p + dir * dist;

    epsilon = min_epsilon * max(dist, 1.);

    if (hit.y <= UNDERGROUND_LEVEL || dist >= MAX_DIST) {
      float t = (-TERRAIN_OFFSET - p.y) / dir.y;
      if (t >= 0. && t < HORIZON_DIST) {
        material = MATERIAL_TERRAIN;
        return t;
      }
      break;  // Nothingness...
    }

    if (hit.y > 45.) {
      break;  // Too high
    }

    float nearest = distanceToNearestSurface(hit);

    if (nearest < 0.) {
      dist -= prevNear;
      nearest = prevNear / 2.;
    }

    dist += nearest;

    if (nearest <= epsilon || i >= MAX_ITERATIONS) {
      return dist;
    }

    prevNear = nearest;
  }

  material = MATERIAL_SKY;
  return HORIZON_DIST;
}

#define SHADOW_ITERATIONS 50
float getShadow(vec3 p, float camDistance, vec3 n, float res) {
  float dist = clamp(camDistance * 0.005, 0.01, .1);  // start further out from the surface if the camera is far away

  p = p + n * dist;  // Jump out of the surface by the normal * that dist

  float maxHitY = iWaterLevel - epsilon * 2.;

  for (float i = 1.; i < float(SHADOW_ITERATIONS); i++) {
    vec3 hit = p + iSunDirection * dist;

    if (dist >= 80. || hit.y > 45. || hit.y < maxHitY || length(p) >= MAX_DIST) {
      break;  // Nothing to render so far
    }

    float nearest = nonTerrain(hit);

    float shadowEpsilon = max(epsilon, 0.01 * min(1., dist) + i * (.01 / float(SHADOW_ITERATIONS)));
    if (nearest <= shadowEpsilon) {
      return 0.;  // Hit or inside something.
    }

    res = min(res, 85. * nearest / dist);
    if (res < 0.078) {
      return 0.;  // Dark enough already.
    }

    dist += nearest + epsilon;
  }
  return res;
}

float rayTraceWater(vec3 p, vec3 dir) {
  float t = (iWaterLevel - p.y) / dir.y;
  return min(t >= 0. ? t : HORIZON_DIST, HORIZON_DIST);
}

// Inspired from https://www.shadertoy.com/view/Xl2XRW
vec3 waterFBM(vec2 p) {
  vec3 f = vec3(0);
  float tot = 0.;
  float a = 1.;

  float flow = 0.;
  float distToCameraRatio = (1. - length(iCameraPos.xz - p) / HORIZON_DIST);
  float octaves = float(int(iTime * .8) % 4 + 1);  // 5. * distToCameraRatio * distToCameraRatio;
  for (float i = 0.; i < octaves; ++i) {
    p += iTime * .5;
    flow *= -.75;
    vec3 v = noiseDxy(p + sin(p.yx * .5 + iTime * .5) * .5);
    f += v * a;
    p += v.yz * .43;
    p *= 2.;
    tot += a;
    a *= .75;
  }
  return f / tot;
}

vec3 applyFog(vec3 rgb, float dist, vec3 rayDir) {
  float dRatio = min(dist / HORIZON_DIST, 1.);

  float fogAmount = clamp01(pow(dRatio, 3.5) + 1.0 - exp(-dist * 0.005));
  float sunAmount = max(dot(rayDir, iSunDirection), 0.0);
  vec3 fogColor = mix(COLOR_SKY, COLOR_SUN, pow(sunAmount, 10.0));
  return mix(rgb, fogColor, fogAmount);
}

vec3 intersectWithWorld(vec3 p, vec3 dir) {
  vec4 packed = texelFetch(iPrerendered, ivec2(fragCoord * PRERENDERED_TEXTURE_SIZE / iResolution), 0);
  float unpacked = uintBitsToFloat(
      (uint(packed.x * 255.) << 24 | uint(packed.y * 255.) << 16 | uint(packed.z * 255.) << 8 | uint(packed.z * 255.)));

  float dist = rayMarch(p, dir, 0.001, unpacked);
  float wdist = rayTraceWater(p, dir);

  vec3 color;
  vec3 normal = vec3(0, 1, 0);
  float mdist = dist;

  if (material == MATERIAL_SCREEN) {
    return iAnimAntennaRotation > 0. ? texture(iScreens, screenCoords).xyz : vec3(0);
  }

  vec3 hit = p + dir * dist;

  bool isWater = wdist < HORIZON_DIST && wdist < dist;
  vec3 waterColor;
  float waterOpacity = 0.;
  if (isWater) {
    waterOpacity = mix(0.2, 1., clamp01((dist - wdist) / TERRAIN_OFFSET));

    vec3 waterhit = p + dir * wdist;
    vec3 waterXYD = mix(vec3(0),
        waterFBM(waterhit.xz * (.7 - iWaterLevel * .02)) * (1. - length(waterhit) / (.9 * HORIZON_DIST)), waterOpacity);

    normal = normalize(vec3(waterXYD.y, 1., waterXYD.x));

    wdist -= abs(waterXYD.z) * waterOpacity * .6;
    mdist = wdist;

    waterColor = mix(vec3(.25, .52, .73), vec3(.15, .62, .83), clamp01(abs(waterXYD.z) - waterOpacity));
  }

  int mat = material;
  int submat = subMaterial;
  if (material == MATERIAL_SKY) {
    color = COLOR_SKY;
  } else {
    vec3 hitNormal;

    if (hit.y <= UNDERGROUND_LEVEL) {
      hitNormal = vec3(0, 1, 0);
      color = vec3(1, 1, 1);
    } else {
      color = vec3(.8);

      switch (mat) {
        case MATERIAL_TERRAIN:
          hitNormal = computeTerrainNormal(hit, dist);

          color = mix(vec3(.93, .8, .64),
                      mix(vec3(.69 + texture(iNoise, hit.xz * 0.0001).x, .67, .65), vec3(.38, .52, .23),
                          dot(hitNormal, vec3(0, 1, 0))),
                      clamp01(hit.y * .5 - 1.)) +
              texture(iNoise, hit.xz * 0.15).x * 0.1 + texture(iNoise, hit.xz * 0.01).y * 0.1;
          ;
          break;
        case MATERIAL_BUILDINGS:
          hitNormal = computeNonTerrainNormal(hit);

          switch (submat) {
            case SUBMATERIAL_METAL: color = vec3(1); break;  // extra bright
            case SUBMATERIAL_BRIGHT_RED: color = vec3(1, 0, 0); break;
            case SUBMATERIAL_DARK_RED: color = vec3(.5, 0, 0); break;
            case SUBMATERIAL_BLACK_PURPLE: color = vec3(.2, .1, .2); break;
            case SUBMATERIAL_YELLOW: color = vec3(1, .95, .8); break;
            case SUBMATERIAL_WOOD: color = .8 * vec3(.8, .6, .4); break;
            default:
              vec4 concrete = (texture(iNoise, hit.xy * .35) * hitNormal.z +
                  texture(iNoise, hit.yz * .35) * hitNormal.x + texture(iNoise, hit.xz * .35) * hitNormal.y - 0.5);
              color += 0.125 * (concrete.x - concrete.y + concrete.z - concrete.w);
              break;
          }
      }

      normal = normalize(mix(hitNormal, normal, waterOpacity));
    }
  }

  float specular = isWater || (mat == MATERIAL_BUILDINGS && submat > SUBMATERIAL_CONCRETE)
      ? pow(clamp01(dot(iSunDirection, reflect(dir, normal))), 50.)
      : 0.;

  float lambert1 = clamp01(dot(iSunDirection, normal));
  float lambert2 = clamp01(dot(iSunDirection * vec3(-1, 1, -1), normal));

  float lightIntensity = lambert1 + lambert2 * .15;
  if (mat == MATERIAL_TERRAIN) {
    lightIntensity = pow(lightIntensity * mix(.9, 1.02, lambert1 * lambert1), 1. + lambert1 * .6);
  }

  lightIntensity = mix(lightIntensity, lambert1, waterOpacity);

  float shadow = 1.;
  if (material != MATERIAL_SKY) {
    shadow = getShadow(p + dir * mdist, mdist, normal, 1.);
  }

  // Flashlight
  if (iFlashlightOn && dist < 20.) {
    float flashLightShadow = pow(clamp(dot(iCameraDir, dir), 0., 1.), 32.) * smoothstep(10., 0., dist);
    lightIntensity += flashLightShadow * max(dot(normal, -dir), 0.) * (1. - lightIntensity);
    shadow += flashLightShadow * (1. - shadow);
  }

  color = mix(color, waterColor, waterOpacity);
  color = (color * (COLOR_SUN * lightIntensity) + specular) * mix(0.38 + (1. - lightIntensity) * .2, 1., shadow);

  return applyFog(color, mdist, dir);
}

/**********************************************************************/
/* collision shader
/**********************************************************************/

void main_c() {
  vec3 ray = vec3(0, 0, 1);
  ray.xz *= rot(fragCoord.x * (2. * PI / COLLISION_TEXTURE_SIZE) + PI);
  oColor = packFloat(.2 -
      distanceToNearestSurface(
          vec3(iCameraPos.x, iCameraPos.y + (fragCoord.y / (COLLISION_TEXTURE_SIZE * .5) - 1.) - .8, iCameraPos.z) +
          normalize(ray) * MIN_DIST));
}

/**********************************************************************/
/* prerender shader
/**********************************************************************/

void main_p() {
  vec2 screen = fragCoord / (PRERENDERED_TEXTURE_SIZE * .5) - 1. + .5 / PRERENDERED_TEXTURE_SIZE;

  vec3 ray = normalize(iCameraMat3 * vec3(screen.x * -SCREEN_ASPECT_RATIO, screen.y, PROJECTION_LEN));

  float dist = rayMarch(iCameraPos, ray, 1.2 / PRERENDERED_TEXTURE_SIZE, MIN_DIST);

  uint packed = floatBitsToUint(dist >= MAX_DIST ? MAX_DIST : dist - epsilon);
  oColor = vec4(float((packed >> 24) & 0xffu) / 255., float((packed >> 16) & 0xffu) / 255.,
      float((packed >> 8) & 0xffu) / 255., float(packed & 0xffu) / 255.);
}

/**********************************************************************/
/* main shader
/**********************************************************************/

// Main shader
void main_m() {
  vec2 screen = fragCoord / (iResolution * .5) - 1.;

  vec3 ray = normalize(iCameraMat3 * vec3(screen.x * -SCREEN_ASPECT_RATIO, screen.y, PROJECTION_LEN));

  oColor = vec4(intersectWithWorld(iCameraPos, ray), 1);
}

/**********************************************************************/
/* heightmap shader
/**********************************************************************/

float heightmapCircle(vec2 coord, float centerX, float centerY, float radius, float smoothness) {
  vec2 dist = coord - vec2(centerX, centerY);
  return clamp01(1. - smoothstep(radius - (radius * smoothness), radius, dot(dist, dist) * 4.));
}

void main_h() {
  vec2 coord = fragCoord / (iResolution * 0.5) - 1., size = vec2(1.3, 1.), derivative = vec2(0.);
  float heightA = 0., heightB = 1., persistence = 1., normalization = 0., octave = 1.;
  for (; octave < 11.;) {
    vec3 noisedxy = noiseDxy(21.1 + (coord * size) * rot(octave++ * 2.4));
    derivative += noisedxy.yz;
    heightA += persistence * (1. - noisedxy.x) / (1. + dot(derivative, derivative));
    heightB += persistence * (.5 - noisedxy.x);
    normalization += persistence;
    persistence *= 0.5;
    size *= 1.8;
  }
  heightA /= normalization;
  heightB *= .5;
  float tmask = (length((coord * (1.2 - heightB + heightA))) *
            clamp01(heightB + .55 - .5 * heightA * coord.x * (1. - coord.y * .5))),
        circles = heightmapCircle(coord, -.45, -.52, 1., 2.3) + heightmapCircle(coord, -.6, -.1, 1., 3.3) +
      heightmapCircle(coord, .6, -.7, 1., 5.) + heightmapCircle(coord, .84, .84, heightA, heightB * 5.);
  tmask = clamp01(1. - smin(tmask, 1. - mix(0., heightA * 2., circles), .05 + heightB * .5));
  vec2 distHV = 1. - abs(coord) + heightA * .04;
  tmask = smin(tmask, smin(distHV.x, distHV.y, 0.3) * 2., .1);
  oColor = packFloat(smin(heightA, tmask, 0.01) * 1.33 - .045);
}