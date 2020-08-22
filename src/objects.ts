import { vec3New, vec3Distance, vec3Direction, vec3Temp0, vec3Dot } from './math/vec3'
import { runAnimation, ANIMATIONS } from './animations'
import { cameraPos, cameraDir } from './camera'
import { setText } from './text'
import { isKeyPressed, KEY_ACTION } from './keyboard'

interface GameObject {
  location: Vec3
  visible: boolean
  lookAtDistance: float
  onInteract: () => void //perform action when ACTION key is pressed while looking at
  onLookAt: () => string | void //return a string to display, or perform action
  [additional: string]: any //Any additional properties that you might want to keep
}

const INVENTORY = {
  key: false
}

const GAME_OBJECTS: { [k: string]: GameObject } = {
  key: {
    location: vec3New(0, 1, 0),
    visible: true,
    lookAtDistance: 2,
    onInteract() {
      this.visible = false
      INVENTORY.key = true
      setText('You picked up the key', 2)
    },
    onLookAt: () => 'A key, how convenient!'
  },
  door: {
    location: vec3New(5, 1.5, 1.5),
    lookAtDistance: 2,
    visible: true,
    onInteract() {
      if (INVENTORY.key) {
        this.visible = false
        runAnimation(ANIMATIONS.prisonDoor)
      }
      this.checked = true
    },
    checked: false,
    onLookAt() {
      return INVENTORY.key ? 'Open the door with the key' : this.checked ? 'A locked door' : 'A door'
    }
  }
}

function getVisibleObject(): GameObject {
  for (const gameObject of Object.values(GAME_OBJECTS)) {
    if (!gameObject.visible) {
      continue
    }
    const objectLocation = gameObject.location
    if (vec3Distance(objectLocation, cameraPos) > gameObject.lookAtDistance) {
      continue
    }
    const dotToObject = vec3Dot(cameraDir, vec3Direction(vec3Temp0, cameraPos, objectLocation))
    if (dotToObject > 0.9) {
      return gameObject
    }
  }
  return undefined
}

function updateGameObjects() {
  const visibleObject = getVisibleObject()
  if (visibleObject) {
    setText(visibleObject.onLookAt() || '')
    if (isKeyPressed(KEY_ACTION)) {
      visibleObject.onInteract()
    }
  } else {
    setText('')
  }
}

export { GAME_OBJECTS, INVENTORY, updateGameObjects }
