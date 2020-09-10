import { musicInit, musicGenerate, musicCreateWave } from './soundbox/player'

const mAudio = new Audio()
const loadMusic = () => {
  musicInit()
  while (musicGenerate() < 1) {
    // continue
  }
  const musicWave = musicCreateWave()

  mAudio.loop = true
  mAudio.src = URL.createObjectURL(new Blob([musicWave], { type: 'audio/wav' }))
  mAudio.volume = 0.5 //must be the same as the default slider %
}

const playMusic = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  mAudio.play()
}

const pauseMusic = () => mAudio.pause()

const setVolume = (v: number) => (mAudio.volume = v)

export { loadMusic, playMusic, pauseMusic, setVolume }
