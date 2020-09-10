import { GAME_OBJECTS, INVENTORY } from './state/objects'
import { ANIMATIONS } from './state/animations'
import { cameraPos, cameraEuler } from './camera'
import { setText, clearTexts } from './text'
import { startOrResumeClick, loadGameButton, saveGameButton, gameStarted } from './page'
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
  if (gameStarted) {
    localStorage.setItem('ISLAND404', JSON.stringify(data))
    setText('Saved', 2)
    startOrResumeClick(false)
    loadGameButton.className = ''
  }
}

const getDataFromLocalStorage = () => localStorage.getItem('ISLAND404')

const LOAD_GAME = () => {
  const savedGame = getDataFromLocalStorage()
  if (savedGame) {
    clearTexts()
    startOrResumeClick(false) //call this first to update the "started" state before actually setting the load game state:
    deepMerge(data, JSON.parse(savedGame))
    setText('Game loaded', 2)
    updateMinigameTexture()
  }
}

saveGameButton.onclick = SAVE_GAME
loadGameButton.onclick = LOAD_GAME

loadGameButton.className = getDataFromLocalStorage() ? '' : 'X'
