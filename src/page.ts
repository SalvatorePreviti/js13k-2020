import { min, DEG_TO_RAD } from './math/scalar'
import { objectAssign } from './core/objects'
import { KEY_MAIN_MENU, KeyFunctions } from './keyboard'
import { vec3Set } from './math/vec3'
import { vec2Set } from './math/vec2'
import { cameraPos, cameraEuler } from './camera'
import { playMusic } from './music'

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

let started: Boolean

export const startOrResumeClick = () => {
  if (!started) {
    //set camera pos
    document.getElementById('R').innerText = 'Resume Game'
    //start positions:
    vec3Set(cameraPos, -44, 4, 11)
    vec2Set(cameraEuler, 70 * DEG_TO_RAD, 0 * DEG_TO_RAD)

    started = true
    playMusic()
  }
  mainMenuVisible = false
  body.className = ''
  canvasRequestPointerLock()
}

handleResize()
onresize = handleResize

document.getElementById('R').onclick = startOrResumeClick

KeyFunctions[KEY_MAIN_MENU] = showMainMenu

canvasElement.onmousedown = canvasRequestPointerLock
highQualityCheckbox.onchange = handleResize
invertYCheckbox.onchange = () => (mouseYInversion = invertYCheckbox.checked ? -1 : 1)

export const gl = canvasElement.getContext('webgl2', {
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

/** Main framebuffer used for pregenerating the heightmap and to render the collision shader */
export const glFrameBuffer: WebGLFramebuffer = gl.createFramebuffer()
