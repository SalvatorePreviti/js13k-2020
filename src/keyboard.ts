export const KEY_FORWARD = 1

export const KEY_BACKWARD = 2

export const KEY_LEFT = 3

export const KEY_RIGHT = 4

export const KEY_RUN = 5

export const KEY_FLY_UP = 10

export const KEY_FLY_DOWN = 11

const _pressedKeys: boolean[] = []

/** Returns true if the given gey is pressed */
export const isKeyPressed = (keyId: number) => !!_pressedKeys[keyId]

const _keyMap = {
  w: KEY_FORWARD,
  W: KEY_FORWARD,
  ArrowUp: KEY_FORWARD,

  s: KEY_BACKWARD,
  S: KEY_BACKWARD,
  ArrowDown: KEY_BACKWARD,

  a: KEY_LEFT,
  A: KEY_LEFT,
  ArrowLeft: KEY_LEFT,

  d: KEY_RIGHT,
  D: KEY_RIGHT,
  ArrowRight: KEY_RIGHT,

  Shift: KEY_RUN,

  r: KEY_FLY_UP,
  R: KEY_FLY_UP,
  '+': KEY_FLY_UP,

  f: KEY_FLY_DOWN,
  F: KEY_FLY_DOWN,
  '-': KEY_FLY_DOWN
}

const _setKeyPressed = (ev: KeyboardEvent, value: boolean) => {
  const keyId = _keyMap[ev.key]
  if (keyId) {
    _pressedKeys[keyId] = value
  }
}

addEventListener('keydown', (ev) => _setKeyPressed(ev, true))
addEventListener('keyup', (ev) => _setKeyPressed(ev, false))
