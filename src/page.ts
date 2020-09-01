import { min, round } from './math/scalar'
import { newProxyBinder, objectAssign } from './core/objects'

export const { body } = document

export const { getElementById, createElement, getElementsByTagName, exitPointerLock } = newProxyBinder(document)

export const canvasElement = getElementById('C') as HTMLCanvasElement

export const canvas2DElement = getElementById('D') as HTMLCanvasElement

export const gameTextElement = getElementById('T')

const bodyClassList = body.classList

export const bodyClassListSet = (name: string, value?: boolean) =>
  value ? bodyClassList.add(name) : bodyClassList.remove(name)

/** Total horizontal and vertical padding to apply to the main element */
const MAIN_ELEMENT_PADDING = 30

/** The aspext ratio of the main element. Main and canvas will be resized accordingly. */
const MAIN_ELEMENT_ASPECT_RATIO = 1.5

/** The maximum width of the main element, and the canvas. */
const MAIN_ELEMENT_MAX_WIDTH = 1200

export const pageState = {
  _mainMenu: false,
  _invertY: false,
  _highQuality: true,
  _w: 0,
  _h: 0
}

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

  let { clientWidth: w, clientHeight: h } = mainElement
  const highQuality = pageState._highQuality
  if (!highQuality) {
    w /= 2
    h /= 2
  }

  pageState._w = w
  pageState._h = h
  canvasElement.width = w
  canvasElement.height = h
}

onresize = handleResize
handleResize()

const invertYCheckbox = getElementById('Y') as HTMLInputElement
invertYCheckbox.onchange = () => (pageState._invertY = invertYCheckbox.checked)

const highQualityCheckbox = getElementById('Q') as HTMLInputElement
highQualityCheckbox.onchange = () => {
  const value = highQualityCheckbox.checked
  pageState._highQuality = value
  handleResize()
}

export const showMainMenu = () => {
  pageState._mainMenu = true
  bodyClassListSet('N', true)
  exitPointerLock()
}

const canvasRequestPointerLock = (e?: MouseEvent) =>
  (!e || e.button === 0) && !pageState._mainMenu && canvasElement.requestPointerLock()

export const resumeGame = () => {
  pageState._mainMenu = false
  bodyClassListSet('N')
}

const startOrResumeClick = () => {
  resumeGame()
  canvasRequestPointerLock()
}

getElementById('R').onclick = startOrResumeClick
getElementById('G').onclick = startOrResumeClick

for (const element of [canvasElement, gameTextElement, canvas2DElement]) {
  element.onmousedown = canvasRequestPointerLock
}

export const gl_context = canvasElement.getContext('webgl2', {
  /** Boolean that indicates if the canvas contains an alpha buffer. */
  alpha: false,
  /** Boolean that hints the user agent to reduce the latency by desynchronizing the canvas paint cycle from the event loop */
  desynchronized: true,
  /** Boolean that indicates whether or not to perform anti-aliasing. */
  antialias: false,
  /** Boolean that indicates that the drawing buffer has a depth buffer of at least 16 bits. */
  depth: false,
  /** Boolean that indicates if a context will be created if the system performance is low or if no hardware GPU is available. */
  failIfMajorPerformanceCaveat: false,
  /** A hint to the user agent indicating what configuration of GPU is suitable for the WebGL context. */
  powerPreference: 'high-performance',
  /** If the value is true the buffers will not be cleared and will preserve their values until cleared or overwritten. */
  preserveDrawingBuffer: false,
  /** Boolean that indicates that the drawing buffer has a stencil buffer of at least 8 bits. */
  stencil: false
})

export const context2D = canvas2DElement.getContext('2d')
