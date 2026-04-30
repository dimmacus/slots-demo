export type SpinMode = 'normal' | 'turbo'

export type SpinStatus = 'ready' | 'spinning' | 'checking' | 'insufficient'

type SpinTiming = {
  reelStopBaseMs: number
  reelStopStaggerMs: number
  checkingDelayMs: number
  reelCycleMs: number
}

export const spinTimings: Record<SpinMode, SpinTiming> = {
  normal: {
    reelStopBaseMs: 950,
    reelStopStaggerMs: 380,
    checkingDelayMs: 420,
    reelCycleMs: 210,
  },
  turbo: {
    reelStopBaseMs: 260,
    reelStopStaggerMs: 110,
    checkingDelayMs: 120,
    reelCycleMs: 120,
  },
}

export const reducedMotionSpinTiming: SpinTiming = {
  reelStopBaseMs: 80,
  reelStopStaggerMs: 45,
  checkingDelayMs: 80,
  reelCycleMs: 1_000,
}

export const bigWinMultiplier = 50

export function getSpinTiming(mode: SpinMode, prefersReducedMotion: boolean) {
  return prefersReducedMotion ? reducedMotionSpinTiming : spinTimings[mode]
}

export function getReelStopDelay(
  reelIndex: number,
  mode: SpinMode,
  prefersReducedMotion: boolean,
) {
  const timing = getSpinTiming(mode, prefersReducedMotion)

  return timing.reelStopBaseMs + reelIndex * timing.reelStopStaggerMs
}
