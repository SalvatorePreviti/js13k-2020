import chalk from 'chalk'
import _prettySize from 'prettysize'

export function prettyFileSize(sizeInBytes: number): string {
  sizeInBytes |= 0
  const sz = _prettySize(sizeInBytes).replace(' kB', 'k')
  return sz.endsWith('Bytes') ? sz : `${sz}, ${sizeInBytes} Bytes`
}

interface _DevOperation {
  name: string
  hrTime: [number, number]
  hasChildren: boolean
  blockBeginInfo?: string
  level: number
}

const _operationsStack: _DevOperation[] = []
let _nonstackedOperationsStack: _DevOperation[] = []

export function devGetCurrentOperation(): string | undefined {
  const nonstackLast = _nonstackedOperationsStack[_nonstackedOperationsStack.length - 1]
  if (nonstackLast && nonstackLast.name) {
    return nonstackLast.name
  }
  const last = _operationsStack[_operationsStack.length - 1]
  return (last && last.name) || undefined
}

export function devBeginOperation(
  name: string,
  blockBeginInfo?: string,
  dontStack: boolean = false
): (info?: string) => void {
  name = name || '...'

  const prev = _operationsStack[_operationsStack.length - 1]

  const level = prev ? prev.level + 1 : 0

  if (prev && !prev.hasChildren) {
    prev.hasChildren = true
    let s = chalk.rgb(80, 130, 180)(`${'▬'.repeat(prev.level)}▶`) + chalk.rgb(120, 230, 255).italic(prev.name)
    if (prev.blockBeginInfo) {
      s += ` ${chalk.rgb(50, 160, 255)(prev.blockBeginInfo)}`
    }
    console.log(s)
  }

  const operation = {
    name,
    hrTime: process.hrtime(),
    hasChildren: false,
    blockBeginInfo,
    level
  }
  if (dontStack) {
    _nonstackedOperationsStack.push(operation)
    return (info?: string) => {
      _nonstackedOperationsStack = _nonstackedOperationsStack.filter((x) => x !== operation)
      _devEndOperation(operation, info)
    }
  }

  _operationsStack.push(operation)
  return devEndOperation
}

function _devEndOperation(popped: _DevOperation, info?: string) {
  const timeDiffiff = process.hrtime(popped.hrTime)
  const timeDiffMs = (timeDiffiff[0] * 1e9 + timeDiffiff[1]) * 1e-6
  let s: string
  if (popped.hasChildren) {
    s =
      chalk.rgb(80, 130, 180)(`${'━'.repeat(popped.level)}╸`) +
      chalk.rgb(120, 230, 255).italic(popped.name.padEnd(23 - popped.level), ' ') +
      chalk.rgb(110, 170, 245)(`${timeDiffMs.toFixed(0).padStart(5, ' ')} ms`)
    if (info) {
      s += ` ${chalk.rgb(100, 240, 255)(info)}`
    }
  } else {
    s =
      chalk.rgb(90, 90, 190)(`${'╾'.repeat(popped.level)}╸`) +
      chalk.rgb(120, 190, 255)(popped.name.padEnd(25 - popped.level, ' ')) +
      chalk.blueBright(`${timeDiffMs.toFixed(0).padStart(5, ' ')} ms`)
    if (info) {
      s += ` ${chalk.rgb(100, 170, 245)(info)}`
    }
  }

  console.log(s)
}

export function devEndOperation(info?: string) {
  const popped = _operationsStack.pop()
  if (popped) {
    _devEndOperation(popped, info)
  }
}

export function devGetError(error: any): Error {
  if (!(error instanceof Error)) {
    error = new Error()
    Error.captureStackTrace(error, devGetError)
  }
  const currentOperation = devGetCurrentOperation()
  if (currentOperation) {
    Reflect.defineProperty(error, 'operation', {
      value: currentOperation,
      configurable: true,
      enumerable: true,
      writable: true
    })
  }

  // Hide this from console logging because is not helpful and noisy
  Reflect.defineProperty(error, 'watchFiles', {
    value: error.watchFiles,
    configurable: true,
    enumerable: false,
    writable: true
  })
  return error
}

export function devLogError(context: string, error: any) {
  error = devGetError(error)
  console.error(chalk.redBright(`❌ ${context} ${error.operation || devGetCurrentOperation() || ''}`.trim()), error)
}
