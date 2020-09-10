import { min } from './math/scalar'

const MAX_GAME_TIME_DELTA_PER_FRAME = 0.33

/** Game time, paused while game is paused */
export let time: number = 0

/** Game time elapsed since last frame */
export let timeDelta: number = MAX_GAME_TIME_DELTA_PER_FRAME

/** Global time, increases also when games is paused */
export let globalTime = 0

let renderDuringPausedGameTime = 0

export const updateTime = (browserTimeInMilliseconds: number, paused: boolean) => {
  const newGlobalTime = browserTimeInMilliseconds / 1000
  if (paused) {
    timeDelta = 0
    if (newGlobalTime - renderDuringPausedGameTime < 0.5) {
      return false
    }
    renderDuringPausedGameTime = newGlobalTime
    return true
  }
  timeDelta = min(newGlobalTime - globalTime, MAX_GAME_TIME_DELTA_PER_FRAME) //if we go below 30fps then game slows down
  time += timeDelta

  globalTime = newGlobalTime
  return timeDelta > 0
}
