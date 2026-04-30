import { useEffect, useState } from 'react'

import { audioManager } from '../utils/audioManager'

export function useAudioSettings() {
  const [settings, setSettings] = useState(audioManager.getSettings())

  useEffect(() => {
    return audioManager.subscribe(setSettings)
  }, [])

  return {
    ...settings,
    unlockAudio: () => audioManager.unlock(),
    setSoundEnabled: (enabled: boolean) => audioManager.setEnabled(enabled),
    setVolume: (volume: number) => audioManager.setVolume(volume),
    setAmbientEnabled: (enabled: boolean) => audioManager.setAmbientEnabled(enabled),
  }
}
