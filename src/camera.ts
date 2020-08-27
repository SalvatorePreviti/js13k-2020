import {
  isKeyPressed,
  KEY_FORWARD,
  KEY_BACKWARD,
  KEY_STRAFE_LEFT,
  KEY_STRAFE_RIGHT,
  KEY_FLY_UP,
  KEY_FLY_DOWN,
  KEY_RUN
} from './keyboard'

import { debug_updateCameraPosition, debug_updateCameraDirection, debug_updateCameraEulerAngles } from './debug'
import { canvasElement } from './gl/canvas'
import { cos, sin, wrapAngleInRadians, clamp, DEG_TO_RAD, PI, pow } from './math/scalar'
import {
  vec3Temp0,
  vec3Add,
  vec3ScalarMultiply,
  vec3Normalize,
  vec3Cross,
  VEC3_UNIT_Y,
  vec3New,
  vec3NewValue,
  vec3Set
} from './math/vec3'
import { vec2New } from './math/vec2'
import { typedArraySet } from './core/arrays'
import { COLLISIONS } from './collider'

const CAMERA_SPEED_DEFAULT = 1.5

const CAMERA_SPEED_RUN = 40

const MOUSE_ROTATION_SENSITIVITY_X = 0.001
const MOUSE_ROTATION_SENSITIVITY_Y = MOUSE_ROTATION_SENSITIVITY_X

/** Camera position */
export const cameraPos: Vec3 = vec3New(-62, 2, 0)

/** Camera Yaw (x) and Pitch (y) angles, in radians. */
export const cameraEuler: Vec2 = vec2New(70 * DEG_TO_RAD, 0 * DEG_TO_RAD)

/** Camera direction, calculated from cameraEulerAngles */
export const cameraDir: Vec3 = vec3NewValue()

/** Camera rotation matrix */
export const cameraMat3: Mat3 = new Float32Array(9)

export const cameraMoveForward = (amount: number) => {
  cameraPos.x += amount * cameraDir.x
  cameraPos.z += amount * cameraDir.z
}

export const cameraStrafe = (amount: number) => {
  vec3Add(cameraPos, vec3ScalarMultiply(vec3Normalize(vec3Cross(vec3Temp0, cameraDir, VEC3_UNIT_Y)), amount))
}

export const cameraMoveDown = (amount: number) => {
  cameraPos.y += amount
}

export const updateCamera = (timeDelta: number) => {
  const speed = (isKeyPressed(KEY_RUN) ? CAMERA_SPEED_RUN : CAMERA_SPEED_DEFAULT) * timeDelta

  if (isKeyPressed(KEY_FORWARD)) {
    cameraMoveForward(speed)
  }
  if (isKeyPressed(KEY_BACKWARD)) {
    cameraMoveForward(-speed)
  }
  if (isKeyPressed(KEY_STRAFE_LEFT)) {
    cameraStrafe(-speed)
  }
  if (isKeyPressed(KEY_STRAFE_RIGHT)) {
    cameraStrafe(speed)
  }
  if (isKeyPressed(KEY_FLY_UP)) {
    cameraMoveDown(-speed)
  }
  if (isKeyPressed(KEY_FLY_DOWN)) {
    cameraMoveDown(speed)
  }
  //dodgy collision resolution
  for (const c of COLLISIONS) {
    const resolutionDirection = vec3New(cos(-c.angle - PI / 2), 0, sin(-c.angle - PI / 2))
    const resolutionPower = c.size / 1000
    console.log(
      `Collision: ${(c.angle * 57.2958).toPrecision(2)} Resolution: ${resolutionDirection.x.toPrecision(
        2
      )} ${resolutionDirection.z.toPrecision(2)}`
    )
    vec3Add(cameraPos, vec3ScalarMultiply(resolutionDirection, resolutionPower))
  }
  debug_updateCameraPosition(cameraPos)
}

const updateCameraDirFromEulerAngles = () => {
  //vec3FromYawAndPitch(cameraDir, cameraEulerAngles)
  const { x: yaw, y: pitch } = cameraEuler

  const sinYaw = sin(yaw)
  const cosYaw = cos(yaw)
  const sinPitch = sin(pitch)
  const cosPitch = cos(pitch)

  vec3Normalize(vec3Set(cameraDir, sinYaw * cosPitch, -sinPitch, cosYaw * cosPitch))

  // Update rotation matrix

  typedArraySet(
    cameraMat3,
    cosYaw,
    0,
    -sinYaw,
    sinYaw * sinPitch,
    cosPitch,
    cosYaw * sinPitch,
    sinYaw * cosPitch,
    -sinPitch,
    cosYaw * cosPitch
  )

  debug_updateCameraEulerAngles(cameraEuler)
  debug_updateCameraDirection(cameraDir)
}

updateCameraDirFromEulerAngles()

debug_updateCameraPosition(cameraPos)

canvasElement.addEventListener('mousedown', (e) => {
  if (e.button === 0) {
    canvasElement.requestPointerLock()
  }
})

document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement === canvasElement) {
    cameraEuler.x = wrapAngleInRadians(cameraEuler.x - e.movementX * MOUSE_ROTATION_SENSITIVITY_X)
    cameraEuler.y = clamp(cameraEuler.y + e.movementY * MOUSE_ROTATION_SENSITIVITY_Y, -87 * DEG_TO_RAD, 87 * DEG_TO_RAD)
    updateCameraDirFromEulerAngles()
  }
})
