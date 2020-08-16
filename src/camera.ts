import {
  isKeyPressed,
  KEY_FORWARD,
  KEY_BACKWARD,
  KEY_LEFT,
  KEY_RIGHT,
  KEY_FLY_UP,
  KEY_FLY_DOWN,
  KEY_RUN
} from './keyboard'

import { debug_updateCameraInfo } from './debug'

/** Camera position */
export const cameraPos: Vec3 = { x: 0, y: 0, z: 0 }

export const cameraSpeedNormal = 5

export const cameraSpeedRun = 20

debug_updateCameraInfo(cameraPos)

export const updateCamera = (timeDelta: number) => {
  let movementX = 0
  let movementY = 0
  let movementZ = 0

  const speed = isKeyPressed(KEY_RUN) ? cameraSpeedRun : cameraSpeedNormal
  console.log(speed)

  if (isKeyPressed(KEY_FORWARD)) {
    movementZ -= speed
  }
  if (isKeyPressed(KEY_BACKWARD)) {
    movementZ += speed
  }
  if (isKeyPressed(KEY_LEFT)) {
    movementX -= speed
  }
  if (isKeyPressed(KEY_RIGHT)) {
    movementX += speed
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

    debug_updateCameraInfo(cameraPos)
  }
}
