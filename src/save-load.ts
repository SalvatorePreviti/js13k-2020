import { GAME_OBJECTS, INVENTORY } from './state/objects'
import { ANIMATIONS } from './state/animations'
import { cameraPos, cameraEuler } from './camera'
import { setText } from './text'
import { resumeGame } from './page'

const data = [GAME_OBJECTS, INVENTORY, ANIMATIONS, cameraPos, cameraEuler]

function deepMerge(original, item) {
  for (const key in item) {
    if (typeof item[key] === 'object') {
      deepMerge(original[key], item[key])
    } else {
      original[key] = item[key]
    }
  }
}

const SAVE_GAME = () => {
  localStorage.setItem('ISLAND404', JSON.stringify(data))
  setText('Saved', 2)
  resumeGame()
}
const LOAD_GAME = () => {
  deepMerge(data, JSON.parse(localStorage.getItem('ISLAND404')))
  resumeGame()
}

export { SAVE_GAME, LOAD_GAME }
