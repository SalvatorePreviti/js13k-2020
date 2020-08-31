export const KEY_FORWARD = 1

export const KEY_BACKWARD = 2

export const KEY_STRAFE_LEFT = 3

export const KEY_STRAFE_RIGHT = 4

export const KEY_RUN = 5

export const KEY_ACTION = 6

export const KEY_FLASHLIGHT_TOGGLE = 7

export const KEY_FLY_UP = 10

export const KEY_FLY_DOWN = 11

let _pressedKeys: boolean[] = []

/** Returns true if the given gey is pressed */
export const isKeyPressed = (keyId: number) => !!_pressedKeys[keyId]

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

  f: KEY_FLY_UP,
  F: KEY_FLY_UP,
  '+': KEY_FLY_UP,

  r: KEY_FLY_DOWN,
  R: KEY_FLY_DOWN,
  '-': KEY_FLY_DOWN
}

const _setKeyPressed = (e: KeyboardEvent, value: boolean) => {
  if (!e.keyCode || e.metaKey || !document.activeElement) {
    _pressedKeys = [] // Clear pressed status to prevent key sticking when alt+tabbing
  } else {
    const keyId = _keyMap[e.key]
    if (keyId) {
      _pressedKeys[keyId] = value
    }
  }
}

addEventListener('keydown', (ev) => _setKeyPressed(ev, true))
addEventListener('keyup', (ev) => _setKeyPressed(ev, false))
