import { GAME_OBJECTS, INVENTORY } from './state/objects'
import { showMainMenu, pageState } from './page'
import { objectAssign } from './core/objects'
import { debug_mode } from './debug'
import { minigameMoveBoat } from './context2D'
import { minigameState } from './state/minigame'

export const KEY_FORWARD = 1

export const KEY_BACKWARD = 2

export const KEY_STRAFE_LEFT = 3

export const KEY_STRAFE_RIGHT = 4

export const KEY_RUN = 5

export const KEY_ACTION = 6

export const KEY_FLASHLIGHT_TOGGLE = 7

export const KEY_MAIN_MENU = 8

export const KEY_FLY_UP = 10

export const KEY_FLY_DOWN = 11

const _pressedKeys: boolean[] = []

/** Returns true if the given gey is pressed */
export const isKeyPressed = (keyId: number) => !!_pressedKeys[keyId]

const _keyFunctions: Record<number, () => void> = {
  [KEY_FLASHLIGHT_TOGGLE]() {
    GAME_OBJECTS._flashlight._active = INVENTORY._flashlight && !GAME_OBJECTS._flashlight._active
  },

  [KEY_MAIN_MENU]: showMainMenu,

  [KEY_FORWARD]() {
    minigameMoveBoat(0, -1)
  },
  [KEY_BACKWARD]() {
    minigameMoveBoat(0, 1)
  },
  [KEY_STRAFE_LEFT]() {
    minigameMoveBoat(-1, 0)
  },
  [KEY_STRAFE_RIGHT]() {
    minigameMoveBoat(1, 0)
  }
}

const _keyMap: Record<string, number> = {
  w: KEY_FORWARD,
  W: KEY_FORWARD,
  ArrowUp: KEY_FORWARD,

  s: KEY_BACKWARD,
  S: KEY_BACKWARD,
  ArrowDown: KEY_BACKWARD,

  a: KEY_STRAFE_LEFT,
  A: KEY_STRAFE_LEFT,
  ArrowLeft: KEY_STRAFE_LEFT,

  d: KEY_STRAFE_RIGHT,
  D: KEY_STRAFE_RIGHT,
  ArrowRight: KEY_STRAFE_RIGHT,

  Shift: KEY_RUN,

  e: KEY_ACTION,
  E: KEY_ACTION,
  ' ': KEY_ACTION,

  //probably this should switch to F key when we remove up/down movement
  q: KEY_FLASHLIGHT_TOGGLE,
  Q: KEY_FLASHLIGHT_TOGGLE,

  Escape: KEY_MAIN_MENU,
  M: KEY_MAIN_MENU,
  m: KEY_MAIN_MENU
}

if (debug_mode) {
  objectAssign(_keyMap, {
    f: KEY_FLY_UP,
    F: KEY_FLY_UP,
    '+': KEY_FLY_UP,

    r: KEY_FLY_DOWN,
    R: KEY_FLY_DOWN,
    '-': KEY_FLY_DOWN
  })
}

const _setKeyPressed = (e: KeyboardEvent, value: boolean) => {
  if (!e.keyCode || e.metaKey || !document.activeElement || pageState._mainMenu) {
    _pressedKeys.length = 0 // Clear pressed status to prevent key sticking when alt+tabbing or showing the menu
  } else {
    const keyId = _keyMap[e.key] || 0
    if (!e.repeat) {
      _pressedKeys[keyId] = value && !minigameState._active
    }
    if (value && _keyFunctions[keyId]) {
      _keyFunctions[keyId]()
    }
  }
}

onkeydown = (ev) => _setKeyPressed(ev, true)
onkeyup = (ev) => _setKeyPressed(ev, false)
