import { objectValues } from './core/objects'

interface Animation {
  _value: float
  _speed: float
  _initial: float
  _max: float
  _running: boolean
}

const ANIMATIONS = {
  _prisonDoor: {
    _value: 0,
    _speed: 1,
    _initial: 0,
    _max: 1,
    _running: false
  },
  _antennaDoor: {
    _value: 0,
    _speed: 0.2,
    _initial: 0,
    _max: 1,
    _running: false
  }
}

const ANIMATIONS_LIST: Animation[] = objectValues(ANIMATIONS)

function updateAnimations(dt: float) {
  for (const anim of ANIMATIONS_LIST) {
    if (!anim._running) {
      continue
    }
    anim._value += anim._speed * dt
    if (anim._value >= anim._max) {
      anim._value = anim._max
      anim._running = false
    }
  }
}

function runAnimation(anim: Animation) {
  anim._value = anim._initial
  anim._running = true
}

export { ANIMATIONS, runAnimation, updateAnimations }
