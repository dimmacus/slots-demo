export type SoundEvent =
  | 'buttonClick'
  | 'spinStart'
  | 'spinLoop'
  | 'reelStop'
  | 'smallWin'
  | 'mediumWin'
  | 'bigWin'
  | 'bonus'
  | 'error'
  | 'ambientLoop'

type AudioSettings = {
  enabled: boolean
  volume: number
  ambientEnabled: boolean
}

const settingsKey = 'zakladking-audio-settings'
const defaultSettings: AudioSettings = {
  enabled: true,
  volume: 0.5,
  ambientEnabled: false,
}

const soundFiles: Record<SoundEvent, { src: string; loop?: boolean }> = {
  buttonClick: { src: '/sounds/click.mp3' },
  spinStart: { src: '/sounds/spin-start.mp3' },
  spinLoop: { src: '/sounds/spin-loop.mp3', loop: true },
  reelStop: { src: '/sounds/reel-stop.mp3' },
  smallWin: { src: '/sounds/win-small.mp3' },
  mediumWin: { src: '/sounds/win-medium.mp3' },
  bigWin: { src: '/sounds/win-big.mp3' },
  bonus: { src: '/sounds/bonus.mp3' },
  error: { src: '/sounds/error.mp3' },
  ambientLoop: { src: '/sounds/ambient-loop.mp3', loop: true },
}

type AudioListener = (settings: AudioSettings) => void

class AudioManager {
  private elements = new Map<SoundEvent, HTMLAudioElement>()
  private unavailable = new Set<SoundEvent>()
  private listeners = new Set<AudioListener>()
  private settings = readSettings()
  private unlocked = false

  getSettings() {
    return this.settings
  }

  subscribe(listener: AudioListener) {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  unlock() {
    if (this.unlocked || typeof Audio === 'undefined') {
      return
    }

    this.unlocked = true
    this.preload()

    if (this.settings.ambientEnabled) {
      this.play('ambientLoop')
    }
  }

  setEnabled(enabled: boolean) {
    this.settings = { ...this.settings, enabled }
    this.persist()

    if (!enabled) {
      this.stopLoop('spinLoop')
      this.stopLoop('ambientLoop')
      return
    }

    if (this.settings.ambientEnabled) {
      this.play('ambientLoop')
    }
  }

  setVolume(volume: number) {
    const clampedVolume = Math.min(1, Math.max(0, volume))

    this.settings = { ...this.settings, volume: clampedVolume }
    this.elements.forEach((element) => {
      element.volume = clampedVolume
    })
    this.persist()
  }

  setAmbientEnabled(ambientEnabled: boolean) {
    this.settings = { ...this.settings, ambientEnabled }
    this.persist()

    if (ambientEnabled) {
      this.play('ambientLoop')
      return
    }

    this.stopLoop('ambientLoop')
  }

  play(event: SoundEvent) {
    if (!this.settings.enabled || !this.unlocked || this.unavailable.has(event)) {
      return
    }

    try {
      const element = this.getElement(event)

      element.currentTime = 0
      void element.play().catch(() => {
        this.unavailable.add(event)
      })
    } catch {
      this.unavailable.add(event)
    }
  }

  stopLoop(event: SoundEvent) {
    const element = this.elements.get(event)

    if (!element) {
      return
    }

    element.pause()
    element.currentTime = 0
  }

  private preload() {
    Object.keys(soundFiles).forEach((event) => {
      this.getElement(event as SoundEvent)
    })
  }

  private getElement(event: SoundEvent) {
    const existingElement = this.elements.get(event)

    if (existingElement) {
      return existingElement
    }

    const config = soundFiles[event]
    const element = new Audio(config.src)

    element.preload = 'auto'
    element.loop = Boolean(config.loop)
    element.volume = this.settings.volume
    element.addEventListener('error', () => this.unavailable.add(event), {
      once: true,
    })

    this.elements.set(event, element)

    return element
  }

  private persist() {
    writeSettings(this.settings)
    this.listeners.forEach((listener) => listener(this.settings))
  }
}

export const audioManager = new AudioManager()

export function playSound(event: SoundEvent) {
  audioManager.play(event)
}

export function stopSound(event: SoundEvent) {
  audioManager.stopLoop(event)
}

function readSettings(): AudioSettings {
  if (typeof window === 'undefined') {
    return defaultSettings
  }

  try {
    const rawSettings = window.localStorage.getItem(settingsKey)

    if (!rawSettings) {
      return defaultSettings
    }

    const parsedSettings = JSON.parse(rawSettings) as Partial<AudioSettings>

    return {
      enabled: parsedSettings.enabled ?? defaultSettings.enabled,
      volume: parsedSettings.volume ?? defaultSettings.volume,
      ambientEnabled: parsedSettings.ambientEnabled ?? defaultSettings.ambientEnabled,
    }
  } catch {
    return defaultSettings
  }
}

function writeSettings(settings: AudioSettings) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(settingsKey, JSON.stringify(settings))
}
