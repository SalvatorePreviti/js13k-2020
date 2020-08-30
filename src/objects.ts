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
  _antennaKey: false,
  _flashlight: false
}

const GAME_OBJECTS = {
  _key: {
    _location: vec3New(-45.5, 2, 7.4),
    _visible: true,
    _lookAtDistance: 2,
    _onInteract() {
      this._visible = false
      INVENTORY._key = true
      setText('You picked up a key', 3)
    },
    _onLookAt: () => 'A key, how convenient! [press E or Space to collect]'
  },
  _flashlight: {
    _location: vec3New(-42, 3, 11.2),
    _visible: true,
    _lookAtDistance: 1.5,
    _onInteract() {
      this._visible = false
      INVENTORY._flashlight = true
      setText('You picked up the flashlight. [Press Q to activate/deactivate]', 3)
    },
    _onLookAt: () => 'Pick up the flashlight [press E or Space]'
  },
  _antennaInitialLookat: {
    _location: vec3New(-40.5, 4.5, 11),
    _visible: true,
    _lookAtDistance: 2.8,
    _onInteract() {},
    _onLookAt: () => 'That looks like a big antenna, maybe I can call for help if I can make it there…'
  },
  _antennaDoor: {
    _location: vec3New(8.5, 14, 2),
    _visible: true,
    _lookAtDistance: 2.5,
    _checked: false,
    _onInteract() {
      if (INVENTORY._antennaKey) {
        this._visible = false
        runAnimation(ANIMATIONS._antennaDoor)
      }
      this._checked = true
    },
    _onLookAt() {
      return this._checked ? 'A locked door… The symbol on it looks familiar' : 'A door'
    }
  },
  _antennaKey: {
    _location: vec3New(0, 1000, 0), //initial location is far away
    _visible: true,
    _lookAtDistance: 2.5,
    _onInteract() {
      INVENTORY._antennaKey = true
      this._visible = false
      GAME_OBJECTS._monumentButton._visible = true
      runAnimation(ANIMATIONS._monumentDescend, false) //play monumentDescend in reverse
    },
    _onLookAt: () => 'A key'
  },
  _antennaOilrigLever: {
    _location: vec3New(5.7, 14.2, -1.9),
    _visible: true,
    _lookAtDistance: 1,
    _onInteract() {
      this._visible = false
      runAnimation(ANIMATIONS._oilrigRamp)
      GAME_OBJECTS._oilrigBridge._visible = false
    },
    _onLookAt: () => 'A lever [press E or Space]'
  },
  _antennaConsole: {
    _location: vec3New(4.8, 14.4, 3.7),
    _visible: true,
    _lookAtDistance: 1.5,
    _onInteract: () => {},
    _onLookAt: () =>
      ANIMATIONS._antennaRotation._running
        ? 'Damn, I need to find this floppy disk'
        : 'There is no electricity, there must be a generator somewhere in this damn island'
  },
  _monumentButton: {
    _location: vec3New(47.5, 4, 30.5),
    _visible: true,
    _lookAtDistance: 1.5,
    _onInteract() {
      if (INVENTORY._antennaKey) {
        setText('I already got the key', 2)
      }
      runAnimation(ANIMATIONS._monumentDescend)
      this._visible = false
    },
    _onLookAt() {
      return 'A button [press E or Space]'
    }
  },
  _oilrigBridge: {
    _location: vec3New(11.8, 2, -34.3),
    _visible: true,
    _lookAtDistance: 5,
    _onInteract() {},
    _onLookAt: () => 'This bridge looks broken'
  },
  _oilrigWheel: {
    _location: vec3New(26, 13.5, -52.9),
    _visible: true,
    _lookAtDistance: 2,
    _onInteract() {
      runAnimation(ANIMATIONS._oilrigWheel)
      this._visible = false
    },
    _onLookAt: () => 'A big wheel, I suppose it will feed fuel to the generator…'
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
        GAME_OBJECTS._antennaInitialLookat._visible = false //no longer do the initial antenna lookat text
      }
      this._checked = true
    },
    _onLookAt() {
      return INVENTORY._key
        ? 'Open the door with the key [press E or Space]'
        : this._checked
        ? 'A locked door, I need a key'
        : 'A door [press E or Space to open]'
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
