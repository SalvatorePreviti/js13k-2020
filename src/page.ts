import { min } from './math/scalar'
import { objectAssign } from './core/objects'
import { KEY_MAIN_MENU, KeyFunctions } from './keyboard'

export const body = document.body

//export const { getElementById, getElementsByTagName, exitPointerLock, createElement } = newProxyBinder(document)

export const canvasElement = document.getElementById('C') as HTMLCanvasElement

export const gameTextElement = document.getElementById('T') as HTMLDivElement

/** Total horizontal and vertical padding to apply to the main element */
const MAIN_ELEMENT_PADDING = 30

/** The aspext ratio of the main element. Main and canvas will be resized accordingly. */
const MAIN_ELEMENT_ASPECT_RATIO = 1.5

/** The maximum width of the main element, and the canvas. */
const MAIN_ELEMENT_MAX_WIDTH = 1200

export let mainMenuVisible: boolean

export let renderWidth: number

export let renderHeight: number

export let mouseYInversion = 1

/** The main element that holds the canvas and the main menu. */
const mainElement = document.getElementById('M') as HTMLDivElement

const highQualityCheckbox = document.getElementById('Q') as HTMLInputElement
const invertYCheckbox = document.getElementById('Y') as HTMLInputElement

/** Handle resize event to update canvas size. */
const handleResize = () => {
  let cw = min(MAIN_ELEMENT_MAX_WIDTH, innerWidth - MAIN_ELEMENT_PADDING)
  let ch = innerHeight - MAIN_ELEMENT_PADDING
  if (MAIN_ELEMENT_ASPECT_RATIO >= cw / ch) {
    ch = cw / MAIN_ELEMENT_ASPECT_RATIO
  } else {
    cw = ch * MAIN_ELEMENT_ASPECT_RATIO
  }

  const whStyles = { width: cw | 0, height: ch | 0, fontSize: `${(ch / 23) | 0}px` }
  objectAssign(mainElement.style, whStyles)
  objectAssign(canvasElement.style, whStyles)

  let { clientWidth: w, clientHeight: h } = mainElement
  if (!highQualityCheckbox.checked) {
    w = (w / 2) | 0
    h = (h / 2) | 0
  }

  renderWidth = w
  renderHeight = h
  canvasElement.width = w
  canvasElement.height = h
}

export const showMainMenu = () => {
  mainMenuVisible = true
  body.className = 'N'
  document.exitPointerLock()
}

const canvasRequestPointerLock = (e?: MouseEvent) =>
  (!e || !e.button) && !mainMenuVisible && canvasElement.requestPointerLock()

export const resumeGame = () => {
  mainMenuVisible = false
  body.className = ''
}

const startOrResumeClick = () => {
  resumeGame()
  canvasRequestPointerLock()
}

document.getElementById('R').onclick = startOrResumeClick
KeyFunctions[KEY_MAIN_MENU] = showMainMenu
canvasElement.onmousedown = canvasRequestPointerLock

highQualityCheckbox.onchange = handleResize
invertYCheckbox.onchange = () => (mouseYInversion = invertYCheckbox.checked ? -1 : 1)

handleResize()
onresize = handleResize
