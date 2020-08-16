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
import { canvasElement, MAIN_ELEMENT_ASPECT_RATIO } from './canvas'
import { wrapAngleInRadians, PI_OVER_TWO, cos, sin, DEG_TO_RAD, clamp } from './math/scalar'
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

const CAMERA_SPEED_DEFAULT = 10

const CAMERA_SPEED_RUN = 20

const MOUSE_ROTATION_SENSITIVITY_X = 0.001
const MOUSE_ROTATION_SENSITIVITY_Y = MOUSE_ROTATION_SENSITIVITY_X / MAIN_ELEMENT_ASPECT_RATIO

/** Camera position */
export const cameraPos: Vec3 = vec3New(0, 1, 20)

/** Camera Yaw (x) and Pitch (y) angles, in radians. */
export const cameraEulerAngles: Vec2 = vec2New(0, 0)

/** Camera direction */
export const cameraDir: Vec3 = vec3NewValue()

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
    cameraStrafe(speed)
  }
  if (isKeyPressed(KEY_STRAFE_RIGHT)) {
    cameraStrafe(-speed)
  }
  if (isKeyPressed(KEY_FLY_UP)) {
    cameraMoveDown(-speed)
  }
  if (isKeyPressed(KEY_FLY_DOWN)) {
    cameraMoveDown(speed)
  }

  debug_updateCameraPosition(cameraPos)
}

const updateCameraDirFromEulerAngles = () => {
  //vec3FromYawAndPitch(cameraDir, cameraEulerAngles)
  const { x: yaw, y: pitch } = cameraEulerAngles
  const cosPitch = cos(pitch)

  vec3Normalize(vec3Set(cameraDir, -sin(-yaw) * cosPitch, sin(pitch), -cos(-yaw) * cosPitch))

  debug_updateCameraEulerAngles(cameraEulerAngles)
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
    cameraEulerAngles.x = wrapAngleInRadians(cameraEulerAngles.x - e.movementX * MOUSE_ROTATION_SENSITIVITY_X)
    cameraEulerAngles.y = clamp(
      wrapAngleInRadians(cameraEulerAngles.y - e.movementY * MOUSE_ROTATION_SENSITIVITY_Y),
      -60 * DEG_TO_RAD,
      60 * DEG_TO_RAD
    )
    updateCameraDirFromEulerAngles()
  }
})
