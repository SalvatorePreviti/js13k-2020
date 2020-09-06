import { GAME_OBJECTS, INVENTORY } from './state/objects'
import { ANIMATIONS } from './state/animations'
import { cameraPos, cameraEuler } from './camera'
import { setText } from './text'
import { resumeGame } from './page'
import { MINIGAME } from './state/minigame'
import { updateMinigameTexture } from './texture-screen'

const data = [GAME_OBJECTS, INVENTORY, ANIMATIONS, MINIGAME, cameraPos, cameraEuler]

function deepMerge(original: any, item: any) {
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
  updateMinigameTexture()
  resumeGame()
}

document.getElementById('S').onclick = SAVE_GAME
document.getElementById('L').onclick = LOAD_GAME
