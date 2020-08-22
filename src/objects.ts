import { vec3New, vec3Distance, vec3Direction, vec3Temp0, vec3Dot } from './math/vec3'
import { runAnimation, ANIMATIONS } from './animations'
import { cameraPos, cameraDir } from './camera'
import { setText } from './text'
import { isKeyPressed, KEY_ACTION } from './keyboard'

interface GameObject {
  location: Vec3
  visible: boolean
  lookAtDistance: float
  onCollect: () => void
  lookAtMessage: string
}

const INVENTORY = {
  key: false
}

const GAME_OBJECTS: { [k: string]: GameObject } = {
  key: {
    location: vec3New(0, 1, 0),
    visible: true,
    lookAtDistance: 2,
    onCollect: () => {
      INVENTORY.key = true
      runAnimation(ANIMATIONS.prisonDoor) //Temporary until changing door to be a game object
    },
    lookAtMessage: 'A key, how convenient!'
  }
}

function collectGameObject(object: GameObject) {
  object.visible = false
  object.onCollect()
}

function getVisibleObject(): GameObject {
  for (const gameObject of Object.values(GAME_OBJECTS)) {
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
    setText(visibleObject.lookAtMessage)
    if (isKeyPressed(KEY_ACTION)) {
      collectGameObject(visibleObject)
    }
  } else {
    setText('')
  }
}

export { GAME_OBJECTS, INVENTORY, updateGameObjects }
