import { vec3New, vec3Distance, vec3Direction, vec3Temp0, vec3Dot } from './math/vec3'
import { runAnimation, ANIMATIONS } from './animations'
import { cameraPos, cameraDir } from './camera'
import { setText } from './text'
import { isKeyPressed, KEY_ACTION } from './keyboard'
import { objectValues } from './core/objects'

interface GameObject {
  _location: Vec3
  _visible?: boolean
  _lookAtDistance: float
  _onInteract: () => void //perform action when ACTION key is pressed while looking at
  _onLookAt: () => string | void //return a string to display, or perform action
}

const INVENTORY = {
  _key: false,
  _flashlight: false
}

const GAME_OBJECTS = {
  _key: {
    _location: vec3New(-45.5, 2, 7.4),
    _visible: true,
    _lookAtDistance: 2.5,
    _onInteract() {
      this._visible = false
      INVENTORY._key = true
      setText('You picked up the key', 2)
    },
    _onLookAt: () => 'A key, how convenient!'
  },
  _flashlight: {
    _location: vec3New(-42, 3, 11.2),
    _visible: true,
    _lookAtDistance: 1.5,
    _onInteract() {
      this._visible = false
      INVENTORY._flashlight = true
      setText('You picked up the flashlight. Press Q to activate', 2)
    },
    _onLookAt: () => 'Pick up the flashlight'
  },
  _oilrigBridge: {
    _location: vec3New(-38.5, 2, -26),
    _visible: true,
    _lookAtDistance: 5,
    _onInteract() {},
    _onLookAt: () => 'This bridge looks broken'
  },
  _door: {
    _location: vec3New(-43, 3.6, 14.8),
    _lookAtDistance: 2,
    _visible: true,
    _checked: false,
    _onInteract() {
      if (INVENTORY._key) {
        this._visible = false
        runAnimation(ANIMATIONS._prisonDoor)
      }
      this._checked = true
    },
    _onLookAt() {
      return INVENTORY._key ? 'Open the door with the key' : this._checked ? 'A locked door' : 'A door'
    }
  }
}

const GAME_OBJECTS_LIST: GameObject[] = objectValues(GAME_OBJECTS)

const getVisibleObject = (): GameObject => {
  for (const gameObject of GAME_OBJECTS_LIST) {
    if (!gameObject._visible) {
      continue
    }
    const objectLocation = gameObject._location
    if (vec3Distance(objectLocation, cameraPos) > gameObject._lookAtDistance) {
      continue
    }
    const dotToObject = vec3Dot(cameraDir, vec3Direction(vec3Temp0, cameraPos, objectLocation))
    if (dotToObject > 0.9) {
      return gameObject
    }
  }
  return undefined
}

const updateGameObjects = () => {
  const visibleObject = getVisibleObject()
  if (visibleObject) {
    setText(visibleObject._onLookAt() || '')
    if (isKeyPressed(KEY_ACTION)) {
      visibleObject._onInteract()
    }
  } else {
    setText('')
  }
}

export { GAME_OBJECTS, INVENTORY, updateGameObjects }
