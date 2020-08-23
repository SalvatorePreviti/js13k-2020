import { CPlayer } from './soundbox/player'
import { song } from './soundbox/song'

const player = new CPlayer()
player.init(song)
let done
while (!done) {
  done = player.generate() >= 1
}
const musicWave = player.createWave()

const mAudio = new Audio()
mAudio.src = URL.createObjectURL(new Blob([musicWave], { type: 'audio/wav' }))

const play = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  mAudio.play()
}

export { play }
