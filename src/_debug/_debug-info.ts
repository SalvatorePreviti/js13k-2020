import './_debug.less'
import debugInfoHtmlString from './_debug.html'

function appendDebugInfoHtmlToBody() {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = debugInfoHtmlString
  for (const node of Array.from(tempDiv.childNodes)) {
    document.body.appendChild(node)
  }
}

appendDebugInfoHtmlToBody()

const debugInfoCanvas = document.getElementById('debug-info-graph') as HTMLCanvasElement

const context = debugInfoCanvas.getContext('2d')

const GRAPH_SPACING = 3
const TEXT_HEIGHT = 17
const GRAPH_PANELS_COUNT = 2

const GRAPH_X = GRAPH_SPACING

const GRAPH_Y = TEXT_HEIGHT + 1
const GRAPH_WIDTH = 95
const GRAPH_HEIGHT = 45

const GRAPHS_DRAW_BG_COLORS = ['#013', '#021']
const GRAPHS_TEXT_BG_COLORS = ['#024', '#031']
const GRAPHS_DRAW_FG_COLORS = ['#0bf', '#0d7']

const SCREEN_RESOLUTION_TEXT_Y = 15

const DEBUG_INFO_TIME_Y = (GRAPH_Y + GRAPH_HEIGHT) * GRAPH_PANELS_COUNT + GRAPH_SPACING + TEXT_HEIGHT + 5

const DEBUG_INFO_CANVAS_WIDTH = GRAPH_X + GRAPH_WIDTH + GRAPH_SPACING
const DEBUG_INFO_CANVAS_HEIGHT = DEBUG_INFO_TIME_Y + TEXT_HEIGHT * 2 + GRAPH_SPACING

debugInfoCanvas.width = DEBUG_INFO_CANVAS_WIDTH
debugInfoCanvas.height = DEBUG_INFO_CANVAS_HEIGHT
debugInfoCanvas.style.width = `${DEBUG_INFO_CANVAS_WIDTH}px`
debugInfoCanvas.style.height = `${DEBUG_INFO_CANVAS_HEIGHT}px`

function getGraphTranslation(index: number) {
  return index * (GRAPH_Y + GRAPH_HEIGHT) + SCREEN_RESOLUTION_TEXT_Y + 5
}

let GRAPH_TEXT_VALUE_X = 0

export function initGraphs() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, DEBUG_INFO_CANVAS_WIDTH, DEBUG_INFO_CANVAS_HEIGHT)
  context.textBaseline = 'top'
  context.textAlign = 'left'
  context.font = `14px courier,arial,helvetica`
  initGraph(0, 'fps')
  initGraph(1, 'ms')
  updateCanvasSize()

  context.fillStyle = '#202'
  context.fillRect(GRAPH_SPACING, DEBUG_INFO_TIME_Y, DEBUG_INFO_CANVAS_WIDTH - GRAPH_SPACING * 2, TEXT_HEIGHT * 2)
  context.fillStyle = '#aaf'
  context.textAlign = 'right'
  context.fillText('time', GRAPH_WIDTH, DEBUG_INFO_TIME_Y)
}

function initGraph(index: number, name: string) {
  const translation = getGraphTranslation(index)

  context.fillStyle = GRAPHS_DRAW_BG_COLORS[index]
  context.fillRect(GRAPH_X, GRAPH_SPACING + translation, GRAPH_WIDTH, GRAPH_Y - GRAPH_SPACING + GRAPH_HEIGHT)

  context.fillStyle = GRAPHS_TEXT_BG_COLORS[index]
  context.fillRect(GRAPH_X, GRAPH_SPACING + translation, GRAPH_WIDTH, GRAPH_Y - GRAPH_SPACING)

  context.globalAlpha = 0.7
  context.fillStyle = GRAPHS_DRAW_FG_COLORS[index]
  context.fillRect(GRAPH_X, GRAPH_Y - 2 + translation, GRAPH_WIDTH, 1)
  context.globalAlpha = 1
  context.fillText(name, GRAPH_X + 2, GRAPH_SPACING + translation)

  GRAPH_TEXT_VALUE_X = Math.max(GRAPH_TEXT_VALUE_X, 4 + context.measureText(name).width)
}

export function updateGraph(index: number, maxValue: number, value: number, text: string) {
  const translation = getGraphTranslation(index)

  context.drawImage(
    debugInfoCanvas,
    GRAPH_X + 1,
    GRAPH_Y + translation,
    GRAPH_WIDTH - 1,
    GRAPH_HEIGHT,
    GRAPH_X,
    GRAPH_Y + translation,
    GRAPH_WIDTH - 1,
    GRAPH_HEIGHT
  )

  context.fillStyle = GRAPHS_DRAW_BG_COLORS[index]
  context.fillRect(GRAPH_X + GRAPH_WIDTH - 1, GRAPH_Y + translation, 1, GRAPH_HEIGHT)

  if (value > maxValue) {
    value = maxValue
  } else if (value < 0) {
    value = 0
  }
  const d = Math.max(0, (1 - value / maxValue) * GRAPH_HEIGHT)

  context.fillStyle = GRAPHS_DRAW_FG_COLORS[index]
  context.fillRect(GRAPH_X + GRAPH_WIDTH - 1, GRAPH_Y + d + translation, 1, GRAPH_HEIGHT - d)

  context.fillStyle = GRAPHS_TEXT_BG_COLORS[index]
  context.fillRect(
    GRAPH_X + GRAPH_TEXT_VALUE_X,
    GRAPH_SPACING + translation,
    GRAPH_WIDTH - GRAPH_TEXT_VALUE_X,
    GRAPH_Y - GRAPH_SPACING - 2
  )
  context.fillStyle = GRAPHS_DRAW_FG_COLORS[index]
  context.textAlign = 'right'
  context.fillText(
    text,
    GRAPH_WIDTH + GRAPH_SPACING - 1,
    GRAPH_SPACING + translation,
    GRAPH_WIDTH - GRAPH_TEXT_VALUE_X - 2
  )
}

export function updateCanvasSize() {
  const canvas = document.getElementById('C') as HTMLCanvasElement
  context.fillStyle = '#005'
  context.fillRect(GRAPH_SPACING, GRAPH_SPACING, DEBUG_INFO_CANVAS_WIDTH - 2 * GRAPH_SPACING, TEXT_HEIGHT)
  context.fillStyle = '#aae'
  context.textAlign = 'center'
  context.fillText(`${canvas.width}⨯${canvas.height} px`, DEBUG_INFO_CANVAS_WIDTH / 2, 5, GRAPH_WIDTH)
}

export function updateGraphInfo(timeInSeconds?: number) {
  if (typeof timeInSeconds === 'number') {
    context.fillStyle = '#202'
    context.fillRect(GRAPH_SPACING, DEBUG_INFO_TIME_Y + TEXT_HEIGHT, GRAPH_WIDTH - GRAPH_SPACING, TEXT_HEIGHT)

    context.fillStyle = '#aaf'
    context.textAlign = 'right'

    context.fillText(timeInSeconds.toFixed(3), GRAPH_WIDTH, DEBUG_INFO_TIME_Y + TEXT_HEIGHT)
  }
}

initGraphs()

window.addEventListener('resize', updateCanvasSize)
