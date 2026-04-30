import { Howl } from 'howler'

import buttonClick from '../assets/sounds/button-click.mp3'
import jackpot from '../assets/sounds/jackpot.mp3'
import reelStop from '../assets/sounds/reel-stop.mp3'
import spinStart from '../assets/sounds/spin-start.mp3'
import winBig from '../assets/sounds/win-big.mp3'
import winSmall from '../assets/sounds/win-small.mp3'

type SoundKey =
  | 'spinStart'
  | 'buttonClick'
  | 'reelStop'
  | 'winSmall'
  | 'winBig'
  | 'jackpot'

const soundSources: Record<SoundKey, string> = {
  spinStart,
  buttonClick,
  reelStop,
  winSmall,
  winBig,
  jackpot,
}

const sounds = new Map<SoundKey, Howl>()
const unavailableSounds = new Set<SoundKey>()

function getSound(sound: SoundKey) {
  const existingSound = sounds.get(sound)

  if (existingSound) {
    return existingSound
  }

  const howl = new Howl({
    src: [soundSources[sound]],
    html5: false,
    preload: true,
    volume: sound === 'jackpot' || sound === 'winBig' ? 0.75 : 0.55,
    onloaderror: () => unavailableSounds.add(sound),
    onplayerror: () => unavailableSounds.add(sound),
  })

  sounds.set(sound, howl)

  return howl
}

function play(sound: SoundKey, enabled: boolean) {
  if (!enabled || unavailableSounds.has(sound)) {
    return
  }

  try {
    getSound(sound).play()
  } catch {
    unavailableSounds.add(sound)
  }
}

export function playButtonClick(enabled: boolean) {
  play('buttonClick', enabled)
}

export function playSpinStart(enabled: boolean) {
  play('spinStart', enabled)
}

export function playReelStop(enabled: boolean) {
  play('reelStop', enabled)
}

export function playWinSmall(enabled: boolean) {
  play('winSmall', enabled)
}

export function playWinBig(enabled: boolean) {
  play('winBig', enabled)
}

export function playJackpot(enabled: boolean) {
  play('jackpot', enabled)
}
