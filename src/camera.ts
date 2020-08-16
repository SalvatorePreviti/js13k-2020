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
import { cos, sin, wrapAngleInRadians, PI, PI_OVER_TWO } from './math/scalar'

const CAMERA_SPEED_DEFAULT = 5

const CAMERA_SPEED_RUN = 20

const MOUSE_ROTATION_SENSITIVITY_X = 0.001
const MOUSE_ROTATION_SENSITIVITY_Y = MOUSE_ROTATION_SENSITIVITY_X / MAIN_ELEMENT_ASPECT_RATIO

/** Camera position */
export const cameraPos: Vec3 = { x: 0, y: 1, z: 20 }

/** Camera Yaw (x) and Pitch (y) angles, in radians. */
export const cameraEulerAngles: Vec2 = { x: -PI_OVER_TWO, y: 0 }

/** Camera direction */
export const cameraDir: Vec3 = { x: 0, y: 0, z: 0 }

const updateCameraDirFromEulerAngles = () => {
  const { x: yaw, y: pitch } = cameraEulerAngles
  cameraDir.x = cos(yaw * cos(pitch))
  cameraDir.y = sin(pitch)
  cameraDir.z = sin(yaw * cos(pitch))

  debug_updateCameraEulerAngles(cameraEulerAngles)
  debug_updateCameraDirection(cameraDir)
}

export const updateCamera = (timeDelta: number) => {
  let movementX = 0
  let movementY = 0
  let movementZ = 0

  const speed = isKeyPressed(KEY_RUN) ? CAMERA_SPEED_RUN : CAMERA_SPEED_DEFAULT

  if (isKeyPressed(KEY_FORWARD)) {
    movementZ -= speed
  }
  if (isKeyPressed(KEY_BACKWARD)) {
    movementZ += speed
  }
  if (isKeyPressed(KEY_STRAFE_LEFT)) {
    movementX += speed
  }
  if (isKeyPressed(KEY_STRAFE_RIGHT)) {
    movementX -= speed
  }
  if (isKeyPressed(KEY_FLY_UP)) {
    movementY -= speed
  }
  if (isKeyPressed(KEY_FLY_DOWN)) {
    movementY += speed
  }

  if (movementX || movementY || movementZ) {
    cameraPos.x += movementX * timeDelta
    cameraPos.y += movementY * timeDelta
    cameraPos.z += movementZ * timeDelta

    debug_updateCameraPosition(cameraPos)
  }
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
    cameraEulerAngles.y = wrapAngleInRadians(cameraEulerAngles.y - e.movementY * MOUSE_ROTATION_SENSITIVITY_Y)
    updateCameraDirFromEulerAngles()
  }
})
