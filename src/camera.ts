import {
  PressedKeys,
  KEY_FORWARD,
  KEY_BACKWARD,
  KEY_STRAFE_LEFT,
  KEY_STRAFE_RIGHT,
  KEY_FLY_UP,
  KEY_FLY_DOWN,
  KEY_RUN
} from './keyboard'

import {
  debug_mode,
  debug_updateCameraPosition,
  debug_updateCameraDirection,
  debug_updateCameraEulerAngles
} from './debug'
import { canvasElement, mouseYInversion } from './page'
import { cos, sin, wrapAngleInRadians, clamp, DEG_TO_RAD } from './math/scalar'
import {
  vec3Temp0,
  vec3Add,
  vec3ScalarMultiply,
  vec3Normalize,
  vec3Cross,
  VEC3_UNIT_Y,
  vec3New,
  vec3NewValue,
  vec3Set,
  vec3Temp1
} from './math/vec3'
import { vec2New } from './math/vec2'
import { typedArraySet } from './core/arrays'
import { RUMBLING } from './state/animations'
import { MINIGAME, MINIGAME_LOADING, MINIGAME_ACTIVE } from './state/minigame'
import { GAME_OBJECTS } from './state/objects'

const CAMERA_SPEED_DEFAULT = 2

const CAMERA_SPEED_RUN = 40

const MOUSE_ROTATION_SENSITIVITY_X = 0.001
const MOUSE_ROTATION_SENSITIVITY_Y = MOUSE_ROTATION_SENSITIVITY_X

/** Camera position */
export const cameraPos: Vec3 = vec3New(-74, 50, 52)

/** Camera Yaw (x) and Pitch (y) angles, in radians. */
export const cameraEuler: Vec2 = vec2New(128 * DEG_TO_RAD, 31 * DEG_TO_RAD)

/** Camera direction, calculated from cameraEulerAngles */
export const cameraDir: Vec3 = vec3NewValue()

/** Camera rotation matrix */
export const cameraMat3: Mat3 = new Float32Array(9)

export const movementForward = (direction: number) =>
  vec3Add(vec3Temp0, vec3ScalarMultiply(vec3Normalize(vec3Set(vec3Temp1, cameraDir.x, 0, cameraDir.z)), direction))

export const movementStrafe = (direction: number) =>
  vec3Add(vec3Temp0, vec3ScalarMultiply(vec3Normalize(vec3Cross(vec3Temp1, cameraDir, VEC3_UNIT_Y)), direction))

export const cameraMoveDown = (amount: number) => {
  cameraPos.y += amount
}

const updateCameraDirFromEulerAngles = (time: number) => {
  //vec3FromYawAndPitch(cameraDir, cameraEulerAngles)
  let { x: yaw, y: pitch } = cameraEuler
  if (RUMBLING) {
    yaw += sin(time * 100) * 0.005
    pitch += sin(time * 200) * 0.005
  }

  // if (game is not started we should use) {
  //   yaw = -170 * DEG_TO_RAD
  //   pitch = 15 * DEG_TO_RAD
  // }

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
}

export const updateCamera = (timeDelta: number, time: number) => {
  const speed = (PressedKeys[KEY_RUN] ? CAMERA_SPEED_RUN : CAMERA_SPEED_DEFAULT) * timeDelta

  if (
    MINIGAME._state !== MINIGAME_LOADING &&
    MINIGAME._state !== MINIGAME_ACTIVE &&
    !GAME_OBJECTS._submarine._gameEnded
  ) {
    vec3Set(vec3Temp0, 0, 0, 0)
    if (PressedKeys[KEY_FORWARD]) {
      movementForward(1)
    }
    if (PressedKeys[KEY_BACKWARD]) {
      movementForward(-1)
    }
    if (PressedKeys[KEY_STRAFE_LEFT]) {
      movementStrafe(-1)
    }
    if (PressedKeys[KEY_STRAFE_RIGHT]) {
      movementStrafe(1)
    }
    if (vec3Temp0.x || vec3Temp0.z) {
      vec3Add(cameraPos, vec3ScalarMultiply(vec3Normalize(vec3Temp0), speed))
    }
    if (debug_mode) {
      if (PressedKeys[KEY_FLY_UP]) {
        cameraPos.y -= speed
      }
      if (PressedKeys[KEY_FLY_DOWN]) {
        cameraPos.y += speed
      }
    }
  }

  updateCameraDirFromEulerAngles(time)

  debug_updateCameraEulerAngles(cameraEuler)
  debug_updateCameraDirection(cameraDir)
}

updateCameraDirFromEulerAngles(0)

debug_updateCameraPosition(cameraPos)

onmousemove = (e) => {
  if (document.pointerLockElement === canvasElement && !GAME_OBJECTS._submarine._gameEnded) {
    cameraEuler.x = wrapAngleInRadians(cameraEuler.x - e.movementX * MOUSE_ROTATION_SENSITIVITY_X)

    cameraEuler.y = clamp(
      cameraEuler.y + e.movementY * mouseYInversion * MOUSE_ROTATION_SENSITIVITY_Y,
      -87 * DEG_TO_RAD,
      87 * DEG_TO_RAD
    )
  }
}
