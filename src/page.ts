import { min } from './math/scalar'
import { newProxyBinder, objectAssign } from './core/objects'
import { GAME_OPTIONS } from './state/options'
import { KEY_MAIN_MENU, KeyFunctions } from './keyboard'

export const { body } = document

export const { getElementById, getElementsByTagName, exitPointerLock, createElement } = newProxyBinder(document)

export const canvasElement = getElementById('C') as HTMLCanvasElement

export const gameTextElement = getElementById('T')

/** Total horizontal and vertical padding to apply to the main element */
const MAIN_ELEMENT_PADDING = 30

/** The aspext ratio of the main element. Main and canvas will be resized accordingly. */
const MAIN_ELEMENT_ASPECT_RATIO = 1.5

/** The maximum width of the main element, and the canvas. */
const MAIN_ELEMENT_MAX_WIDTH = 1200

export let mainMenuVisible = false

export let renderWidth = 0

export let renderHeight = 0

/** The main element that holds the canvas and the main menu. */
const mainElement = getElementById('M') as HTMLDivElement

/** Handle resize event to update canvas size. */
const handleResize = () => {
  let cw = min(MAIN_ELEMENT_MAX_WIDTH, innerWidth - MAIN_ELEMENT_PADDING)
  let ch = innerHeight - MAIN_ELEMENT_PADDING
  if (MAIN_ELEMENT_ASPECT_RATIO >= cw / ch) {
    ch = cw / MAIN_ELEMENT_ASPECT_RATIO
  } else {
    cw = ch * MAIN_ELEMENT_ASPECT_RATIO
  }

  const whStyles = { width: cw | 0, height: ch | 0 }
  objectAssign(mainElement.style, whStyles)
  objectAssign(canvasElement.style, whStyles)

  mainElement.style.fontSize = `${(ch / 23) | 0}px`

  let { clientWidth: w, clientHeight: h } = mainElement
  const highQuality = GAME_OPTIONS._highQuality
  if (!highQuality) {
    w = (w / 2) | 0
    h = (h / 2) | 0
  }

  renderWidth = w
  renderHeight = h
  canvasElement.width = w
  canvasElement.height = h
}

onresize = handleResize
handleResize()

const invertYCheckbox = getElementById('Y') as HTMLInputElement
invertYCheckbox.onchange = () => (GAME_OPTIONS._invertY = invertYCheckbox.checked)

const highQualityCheckbox = getElementById('Q') as HTMLInputElement
highQualityCheckbox.onchange = () => {
  const value = highQualityCheckbox.checked
  GAME_OPTIONS._highQuality = value
  handleResize()
}

export const showMainMenu = () => {
  mainMenuVisible = true
  body.className = 'N'
  exitPointerLock()
}

const canvasRequestPointerLock = (e?: MouseEvent) =>
  (!e || e.button === 0) && !mainMenuVisible && canvasElement.requestPointerLock()

export const resumeGame = () => {
  mainMenuVisible = false
  body.className = ''
}

const startOrResumeClick = () => {
  resumeGame()
  canvasRequestPointerLock()
}

getElementById('R').onclick = startOrResumeClick
KeyFunctions[KEY_MAIN_MENU] = showMainMenu
canvasElement.onmousedown = canvasRequestPointerLock
