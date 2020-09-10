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
  mAudio.volume = 0.5 //must be the same as the default slider %
}

const playMusic = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  mAudio.play()
}

const pauseMusic = (): void => {
  mAudio.pause()
}

const setVolume = (v): void => {
  mAudio.volume = v
}

export { loadMusic, playMusic, pauseMusic, setVolume }
