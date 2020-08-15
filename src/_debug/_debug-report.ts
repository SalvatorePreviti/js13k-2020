import { DebugReportInfo } from '../debug'

const MAX_ITEMS_HARD_LIMIT = 200
const MAX_ITEMS_SOFT_LIMIT = 150

class ReportItemList {
  public items: ReportItem[] = []
  public readonly containerElement: HTMLDivElement
  public readonly contentElement: HTMLDivElement

  public constructor() {
    this.containerElement = document.getElementById('debug-report') as HTMLDivElement
    this.contentElement = document.getElementById('debug-report-content') as HTMLDivElement
  }

  public get isScrolledAtBottom(): boolean {
    return this.contentElement.scrollHeight - this.contentElement.scrollTop >= this.contentElement.clientHeight
  }

  public add(item: ReportItem): ReportItem {
    const last = this.items[this.items.length - 1]
    if (last) {
      if (
        last.kind === item.kind &&
        last.context === item.context &&
        last.title === item.title &&
        last.file === item.file &&
        last.message === item.message
      ) {
        last.incrementRepeatCount()
        return last
      }
    }

    this._removeExcessElements()
    this.items.push(item)
    if (this.items.length === 1) {
      this.containerElement.style.display = 'block'
    }

    const wasScrolledAtBottom = this.isScrolledAtBottom
    this.contentElement.appendChild(item.getElement())
    if (wasScrolledAtBottom) {
      this.contentElement.scrollTo(0, this.contentElement.scrollHeight)
    }
    return item
  }

  public removeAllByContext(context: string, file?: string) {
    const filteredItems: ReportItem[] = []
    for (const item of this.items) {
      if (item.context === context && (file === undefined || item.file === file)) {
        item.removeElement()
      } else {
        filteredItems.push(item)
      }
    }
    if (this.items.length !== filteredItems.length) {
      this.items = filteredItems
      if (filteredItems.length === 0) {
        this.containerElement.style.display = 'none'
      }
    }
  }

  public clear() {
    if (this.items.length > 0) {
      this.containerElement.style.display = 'none'
      for (let i = this.items.length - 1; i >= 0; --i) {
        this.items[i].removeElement()
      }
      this.items.length = 0
    }
  }

  private _removeExcessElements() {
    if (this.items.length > MAX_ITEMS_HARD_LIMIT) {
      while (this.items.length > MAX_ITEMS_SOFT_LIMIT) {
        this.items.shift().removeElement()
      }
    }
  }
}

class ReportItem {
  public readonly kind: 'error' | 'warn' | 'info'
  public readonly context: string
  public readonly title: string
  public readonly message: string
  public readonly file: string

  public repeatCount: number = 1

  private _repeatCountElement: HTMLDivElement | null = null
  private _element: HTMLDivElement | null = null

  public constructor(
    kind: string,
    context: string | undefined,
    message: string,
    file: string | undefined,
    title: string | undefined
  ) {
    this.kind = 'error'
    switch (kind.toLowerCase()) {
      case 'warn':
      case 'warning':
        this.kind = 'warn'
        break
      case 'info':
        this.kind = 'info'
        break
    }
    this.context = context || ''
    this.message = message
    this.file = file || ''
    this.title = title || ''
  }

  public getElement(): HTMLDivElement {
    let itemElement = this._element
    if (!itemElement) {
      itemElement = document.createElement('div')
      this._element = itemElement
      itemElement.className = `debug-report-item debug-report-${this.kind}`

      if (this.title || this.context || this.file) {
        const contextRowElement = document.createElement('div')
        contextRowElement.className = 'debug-report-item-context'

        const contextElement = document.createElement('div')
        contextRowElement.appendChild(contextElement)
        contextElement.innerText = `${this.context}`
        if (this.title) {
          const contextTitleElement = document.createElement('span')
          contextTitleElement.style.paddingLeft = '15px'
          contextTitleElement.style.fontStyle = 'italic'
          contextTitleElement.innerHTML = this.title
          contextElement.appendChild(contextTitleElement)
        }

        const fileSpanElement = document.createElement('div')
        fileSpanElement.innerText = this.file

        contextRowElement.appendChild(fileSpanElement)
        itemElement.appendChild(contextRowElement)
      }

      const messagePre = document.createElement('pre')
      messagePre.innerText = this.message
      itemElement.appendChild(messagePre)
    }
    return itemElement
  }

  public removeElement(): void {
    if (this._element) {
      this._element.remove()
    }
  }

  public incrementRepeatCount() {
    if (!this._repeatCountElement) {
      this._repeatCountElement = document.createElement('div')
      this._repeatCountElement.className = 'debug-report-item-repeat-count'
      this.getElement().appendChild(this._repeatCountElement)
    }
    this._repeatCountElement.innerText = (this.repeatCount++).toString()
  }
}

const _reportItemsList = new ReportItemList()

/** Shows an error on screen */
export function debug_report(
  kind: 'error' | 'warn' | 'warning' | 'info',
  message: string | Error,
  info?: DebugReportInfo | string
) {
  if (!message) {
    return
  }
  if (message instanceof Error) {
    message = message.stack || message.toString()
  }

  let context = ''
  let file = ''
  let title = ''
  if (info) {
    if (typeof info === 'object') {
      context = info.context
      file = info.file
      title = info.title
    } else {
      context = info
    }
  }

  _reportItemsList.add(new ReportItem(kind, context, message, file, title))
}

/** Clears the previous error report on screen */
export function debug_reportClear(context?: string, file?: string) {
  if (context !== undefined) {
    _reportItemsList.removeAllByContext(context, file)
  } else {
    _reportItemsList.clear()
  }
}

/** Executes a block in a try catch, eat the error and report it to screen. */
export function debug_trycatch<T>(fn: () => T, info?: DebugReportInfo | string): T {
  try {
    const result = fn()
    if (
      typeof result === 'object' &&
      result !== null &&
      typeof (result as any).then === 'function' &&
      typeof (result as any).catch === 'function'
    ) {
      return (result as any).catch((error: Error) => {
        debug_report('error', error, {
          context: (typeof info === 'string' ? info : info && info.context) || fn.name,
          file: typeof info === 'object' && info.file,
          title: typeof info === 'object' && info.title
        })
        if (typeof info === 'object' && info && info.rethrow !== false) {
          throw error
        }
      })
    }
    return result
  } catch (error) {
    debug_report('error', error, {
      context: (typeof info === 'string' ? info : info && info.context) || fn.name,
      file: typeof info === 'object' && info.file,
      title: typeof info === 'object' && info.title
    })
    if (typeof info === 'object' && info && info.rethrow !== false) {
      throw error
    }
    return null as any
  }
}

/** Wraps a function with a debug_trycatch. */
export function debug_trycatch_wrap<F extends Function>(fn: F, info?: DebugReportInfo | string): F {
  function wrapped(...args: any[]) {
    try {
      const result = fn(...args)
      if (
        typeof result === 'object' &&
        result !== null &&
        typeof result.then === 'function' &&
        typeof result.catch === 'function'
      ) {
        return result.catch((error: Error) => {
          debug_report('error', error, {
            context: (typeof info === 'string' ? info : info && info.context) || fn.name,
            file: typeof info === 'object' && info.file,
            title: typeof info === 'object' && info.title
          })
          if (typeof info === 'object' && info && info.rethrow !== false) {
            throw error
          }
        })
      }
      return result
    } catch (error) {
      debug_report('error', error, {
        context: (typeof info === 'string' ? info : info && info.context) || fn.name,
        file: typeof info === 'object' && info.file,
        title: typeof info === 'object' && info.title
      })
      if (typeof info === 'object' && info && info.rethrow !== false) {
        throw error
      }
      return null as any
    }
  }

  Reflect.defineProperty(wrapped, 'name', {
    get() {
      return fn.name
    },
    configurable: true,
    enumerable: false
  })

  return wrapped as any
}

document.getElementById('debug-report-close').addEventListener('click', () => {
  debug_reportClear()
})

window.addEventListener('error', (e) => {
  debug_report('error', e.error || e.message, 'Uncaught')
})

export function debug_checkShaderCompileStatus(
  gl: WebGL2RenderingContext,
  shader: WebGLShader,
  info: DebugReportInfo
): void {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    debug_report('error', gl.getShaderInfoLog(shader) || 'compilation failed', info)
  } else {
    const infoLog = gl.getShaderInfoLog(shader)
    if (infoLog) {
      if (infoLog.indexOf('WARN') >= 0) {
        debug_report('warn', gl.getShaderInfoLog(shader), info)
      }
    }
  }
}

export function debug_checkShaderProgramLinkStatus(
  gl: WebGL2RenderingContext,
  shaderProgram: WebGLProgram,
  info: DebugReportInfo
): void {
  gl.validateProgram(shaderProgram)
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    debug_report('error', gl.getProgramInfoLog(shaderProgram) || 'link failed', info)
  } else {
    const infoLog = gl.getProgramInfoLog(shaderProgram)
    if (infoLog) {
      if (infoLog.indexOf('WARN') >= 0) {
        debug_report('warn', infoLog, info)
      }
    }
  }
}
