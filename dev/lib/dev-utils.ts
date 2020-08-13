import chalk from 'chalk'
import _prettySize from 'prettysize'

export function prettyFileSize(sizeInBytes: number): string {
  sizeInBytes |= 0
  const sz = _prettySize(sizeInBytes).replace(' kB', 'k')
  return sz.endsWith('Bytes') ? sz : `${sz}, ${sizeInBytes} Bytes`
}

const _operationsStack: { name: string; hrTime: [number, number]; hasChildren: boolean; blockBeginInfo?: string }[] = []

export function devGetCurrentOperation(): string | undefined {
  const last = _operationsStack[_operationsStack.length - 1]
  return (last && last.name) || undefined
}

export function devBeginOperation(name: string, blockBeginInfo?: string): void {
  name = name || '...'

  const prev = _operationsStack[_operationsStack.length - 1]
  if (prev && !prev.hasChildren) {
    prev.hasChildren = true
    let s =
      chalk.rgb(80, 130, 180)(`${'▬'.repeat(_operationsStack.length - 1)}▶`) +
      chalk.rgb(120, 230, 255).italic(prev.name)
    if (prev.blockBeginInfo) {
      s += ` ${chalk.rgb(50, 160, 255)(prev.blockBeginInfo)}`
    }
    console.log(s)
  }

  const operation = { name, hrTime: process.hrtime(), hasChildren: false, blockBeginInfo }
  _operationsStack.push(operation)
}

export function devEndOperation(info?: string) {
  const popped = _operationsStack.pop()
  if (popped) {
    const timeDiffiff = process.hrtime(popped.hrTime)
    const timeDiffMs = (timeDiffiff[0] * 1e9 + timeDiffiff[1]) * 1e-6
    let s: string
    if (popped.hasChildren) {
      s =
        chalk.rgb(80, 130, 180)(`${'━'.repeat(_operationsStack.length)}╸`) +
        chalk.rgb(120, 230, 255).italic(popped.name.padEnd(23 - _operationsStack.length), ' ') +
        chalk.rgb(110, 170, 245)(`${timeDiffMs.toFixed(0).padStart(5, ' ')} ms`)
      if (info) {
        s += ` ${chalk.rgb(100, 240, 255)(info)}`
      }
    } else {
      s =
        chalk.rgb(90, 90, 190)(`${'╾'.repeat(_operationsStack.length)}╸`) +
        chalk.rgb(120, 190, 255)(popped.name.padEnd(25 - _operationsStack.length, ' ')) +
        chalk.blueBright(`${timeDiffMs.toFixed(0).padStart(5, ' ')} ms`)
      if (info) {
        s += ` ${chalk.rgb(100, 170, 245)(info)}`
      }
    }

    console.log(s)
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
