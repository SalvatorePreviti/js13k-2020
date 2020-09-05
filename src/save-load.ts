import { GAME_OBJECTS, INVENTORY } from './state/objects'
import { ANIMATIONS } from './state/animations'
import { cameraPos, cameraEuler } from './camera'

const serialize = () =>
  JSON.stringify({
    _objects: GAME_OBJECTS,
    _inventory: INVENTORY,
    _animations: ANIMATIONS,
    _cameraPos: cameraPos,
    _cameraEuler: cameraEuler
  })

function deepMerge(original, item) {
  for (const key in item) {
    if (typeof item[key] === 'object') {
      deepMerge(original[key], item[key])
    } else {
      original[key] = item[key]
    }
  }
}

const deserialize = (savedState) => {
  const r = JSON.parse(savedState)
  deepMerge(GAME_OBJECTS, r._objects)
  deepMerge(INVENTORY, r._inventory)
  deepMerge(ANIMATIONS, r._animations)
  deepMerge(cameraPos, r._cameraPos)
  deepMerge(cameraEuler, r._cameraEuler)
}

const SAVE_GAME = () => {
  localStorage.setItem('ISLAND404', serialize())
}
const LOAD_GAME = () => {
  deserialize(localStorage.getItem('ISLAND404'))
}

export { SAVE_GAME, LOAD_GAME }
