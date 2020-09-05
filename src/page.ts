import { min, round } from './math/scalar'
import { newProxyBinder, objectAssign } from './core/objects'
import { GAME_OPTIONS } from './state/options'

export const { body } = document

export const { getElementById, getElementsByTagName, exitPointerLock } = newProxyBinder(document)

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
  const targetAspectRatio = cw / ch
  if (MAIN_ELEMENT_ASPECT_RATIO >= targetAspectRatio) {
    ch = round(cw / MAIN_ELEMENT_ASPECT_RATIO)
  } else {
    cw = round(ch * MAIN_ELEMENT_ASPECT_RATIO)
  }

  const whStyles = { width: cw, height: ch }
  objectAssign(mainElement.style, whStyles)
  objectAssign(canvasElement.style, whStyles)

  mainElement.style.fontSize = `${(ch / 23) | 0}px`

  let { clientWidth: w, clientHeight: h } = mainElement
  const highQuality = GAME_OPTIONS._highQuality
  if (!highQuality) {
    w /= 2
    h /= 2
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
  console.log('SHOW MAIN MENU')
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
getElementById('G').onclick = startOrResumeClick

canvasElement.onmousedown = canvasRequestPointerLock
