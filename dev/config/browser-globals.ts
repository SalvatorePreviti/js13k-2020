import browsersInfo from './browsers-info.json'

export const knownPureFunctionsNames = browsersInfo.knownPureFunctionsNames

export const knownBrowserGlobals = new Set(browsersInfo.knownBrowserGlobals)

export const knownBrowserGlobalsAsObject: Record<string, boolean> = {}

for (const k of knownBrowserGlobals) {
  knownBrowserGlobalsAsObject[k] = true
}
