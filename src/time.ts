import { min } from './math/scalar'

const MAX_GAME_TIME_DELTA_PER_FRAME = 0.033

/** Game time, paused while game is paused */
export let gameTime: number = 0

/** Game time elapsed since last frame */
export let gameTimeDelta: number = MAX_GAME_TIME_DELTA_PER_FRAME

/** Global time, increases also when games is paused */
let globalTime = 0

let renderDuringPausedGameTime = 0

export const updateTime = (browserTimeInMilliseconds: number, paused: boolean) => {
  const newGlobalTime = browserTimeInMilliseconds / 1000
  const globalTimeDiff = newGlobalTime - globalTime
  globalTime = newGlobalTime
  if (paused) {
    gameTimeDelta = 0
    if (newGlobalTime - renderDuringPausedGameTime >= 0.2) {
      renderDuringPausedGameTime = newGlobalTime
      return true
    }
    return false
  }
  gameTimeDelta = min(globalTimeDiff, MAX_GAME_TIME_DELTA_PER_FRAME) //if we go below 30fps then game slows down
  gameTime += gameTimeDelta

  return gameTimeDelta > 0
}
