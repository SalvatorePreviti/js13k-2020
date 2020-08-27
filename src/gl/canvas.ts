import { min, round } from '../math/scalar'
import { vec2NewValue } from '../math/vec2'

export const canvasElement = document.getElementById('C') as HTMLCanvasElement

/** The main element that holds the canvas. */
export const mainElement = document.getElementById('M') as HTMLDivElement

/** Total horizontal and vertical padding to apply to the main element */
export const MAIN_ELEMENT_PADDING = 30

/** The aspext ratio of the main element. Main and canvas will be resized accordingly. */
export const MAIN_ELEMENT_ASPECT_RATIO = 1.5

/** The maximum width of the main element, and the canvas. */
export const MAIN_ELEMENT_MAX_WIDTH = 1200

/** Keeps track of the actual canvas size, updated on resize. */
export const canvasSize: Vec2 = vec2NewValue()

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

  mainElement.style.width = `${cw}px`
  mainElement.style.height = `${ch}px`

  const w = mainElement.clientWidth
  const h = mainElement.clientHeight
  if (canvasSize.x !== w || canvasSize.y !== h) {
    canvasSize.x = w
    canvasSize.y = h
    canvasElement.width = w
    canvasElement.height = h
  }
}

addEventListener('resize', handleResize)
handleResize()
