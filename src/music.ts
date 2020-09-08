import { CPlayer } from './soundbox/player'
import { song } from './soundbox/song'

const mAudio = new Audio()
const loadMusic = () => {
  const player = new CPlayer()
  player.init(song)
  while (player.generate() < 1) {
    //ignore the error
  }
  const musicWave = player.createWave()

  mAudio.loop = true
  mAudio.src = URL.createObjectURL(new Blob([musicWave], { type: 'audio/wav' }))
  mAudio.volume = 0.4
}

const playMusic = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  mAudio.play()
}

const pauseMusic = (): void => {
  mAudio.pause()
}

export { loadMusic, playMusic, pauseMusic }
