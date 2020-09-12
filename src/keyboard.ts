import { debug_mode } from './debug'
import { mainMenuVisible } from './page'

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

/* List of pressed keys */
export const PressedKeys: boolean[] = []

export const KeyFunctions: Record<number, (repeat?: boolean) => void> = {}

const _keyMap: Record<string, number> = {
  w: KEY_FORWARD,
  W: KEY_FORWARD,
  z: KEY_FORWARD,
  Z: KEY_FORWARD,
  ArrowUp: KEY_FORWARD,

  s: KEY_BACKWARD,
  S: KEY_BACKWARD,
  ArrowDown: KEY_BACKWARD,

  a: KEY_STRAFE_LEFT,
  A: KEY_STRAFE_LEFT,
  q: KEY_STRAFE_LEFT,
  Q: KEY_STRAFE_LEFT,
  ArrowLeft: KEY_STRAFE_LEFT,

  d: KEY_STRAFE_RIGHT,
  D: KEY_STRAFE_RIGHT,
  ArrowRight: KEY_STRAFE_RIGHT,

  Shift: KEY_RUN,

  e: KEY_ACTION,
  E: KEY_ACTION,
  ' ': KEY_ACTION,

  f: KEY_FLASHLIGHT_TOGGLE,
  F: KEY_FLASHLIGHT_TOGGLE,

  Escape: KEY_MAIN_MENU,
  M: KEY_MAIN_MENU,
  m: KEY_MAIN_MENU
}

if (debug_mode) {
  Object.assign(_keyMap, {
    g: KEY_FLY_DOWN,
    G: KEY_FLY_DOWN,
    '-': KEY_FLY_DOWN,

    r: KEY_FLY_UP,
    R: KEY_FLY_UP,
    '+': KEY_FLY_UP
  })
}

const _setKeyPressed = (e: KeyboardEvent, value: boolean) => {
  if (!e.keyCode || e.metaKey || !document.activeElement || mainMenuVisible) {
    PressedKeys.length = 0 // Clear pressed status to prevent key sticking when alt+tabbing or showing the menu
  } else {
    const keyId = _keyMap[e.key] | 0
    if (value && KeyFunctions[keyId]) {
      KeyFunctions[keyId](e.repeat)
    }
    PressedKeys[keyId] = value
  }
}

onkeydown = (ev) => _setKeyPressed(ev, true)
onkeyup = (ev) => _setKeyPressed(ev, false)
