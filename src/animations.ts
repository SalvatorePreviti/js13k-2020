interface Animation {
  value: float
  speed: float
  initial: float
  max: float
  running: boolean
}
const ANIMATIONS: { [k: string]: Animation } = {
  prisonDoor: {
    value: 0,
    speed: 1,
    initial: 0,
    max: 1,
    running: false
  }
}

function updateAnimations(dt) {
  Object.values(ANIMATIONS).forEach((anim) => {
    if (!anim.running) {
      return
    }
    anim.value += anim.speed * dt
    if (anim.value >= anim.max) {
      anim.value = anim.max
      anim.running = false
    }
  })
}

function runAnimation(anim: Animation) {
  anim.value = anim.initial
  anim.running = true
}

export { ANIMATIONS, runAnimation, updateAnimations }
