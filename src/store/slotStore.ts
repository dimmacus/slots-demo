import { create } from 'zustand'

import {
  bigWinMultiplier,
  getReelStopDelay,
  getSpinTiming,
  type SpinMode,
  type SpinStatus,
} from '../data/animationConfig'
import type { Reel, WinResult } from '../types/slot'
import {
  applyPayout,
  calculateWins,
  generateSpinResult,
  REEL_COUNT,
} from '../utils/slotMath'
import {
  playButtonClick,
  playJackpot,
  playReelStop,
  playSpinStart,
  playWinBig,
  playWinSmall,
} from '../utils/soundManager'

type SpinOptions = {
  prefersReducedMotion?: boolean
}

type SlotState = {
  balance: number
  bet: number
  minBet: number
  maxBet: number
  reels: Reel[]
  isSpinning: boolean
  spinningReels: boolean[]
  lastWin: WinResult[]
  lastWinAmount: number
  totalWin: number
  spinMode: SpinMode
  soundEnabled: boolean
  status: SpinStatus
  statusMessage: string
  showBigWin: boolean
  setBet: (bet: number) => void
  increaseBet: () => void
  decreaseBet: () => void
  setMaxBet: () => void
  setSpinMode: (mode: SpinMode) => void
  toggleSound: () => void
  dismissBigWin: () => void
  spin: (options?: SpinOptions) => void
}

const initialBet = 10
const initialBalance = 1_000
const minBet = 5
const maxBet = 100
const betStep = 5
const initialSpinningReels = Array.from({ length: REEL_COUNT }, () => false)

function clampBet(bet: number) {
  return Math.min(maxBet, Math.max(minBet, Math.floor(bet)))
}

export const useSlotStore = create<SlotState>((set, get) => ({
  balance: initialBalance,
  bet: initialBet,
  minBet,
  maxBet,
  reels: generateSpinResult(),
  isSpinning: false,
  spinningReels: initialSpinningReels,
  lastWin: [],
  lastWinAmount: 0,
  totalWin: 0,
  spinMode: 'normal',
  soundEnabled: true,
  status: 'ready',
  statusMessage: 'Ready',
  showBigWin: false,
  setBet: (bet) => {
    set({ bet: clampBet(bet) })
  },
  increaseBet: () => {
    const { bet } = get()

    set({ bet: clampBet(bet + betStep) })
  },
  decreaseBet: () => {
    const { bet } = get()

    set({ bet: clampBet(bet - betStep) })
  },
  setMaxBet: () => {
    set({ bet: maxBet })
  },
  setSpinMode: (mode) => {
    set({ spinMode: mode })
  },
  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }))
  },
  dismissBigWin: () => {
    set({ showBigWin: false })
  },
  spin: (options) => {
    const { balance, bet, isSpinning, spinMode, soundEnabled } = get()

    playButtonClick(soundEnabled)

    if (isSpinning) {
      return
    }

    if (balance < bet) {
      set({
        status: 'insufficient',
        statusMessage: 'Demo balance too low',
        lastWinAmount: 0,
        lastWin: [],
        showBigWin: false,
      })
      return
    }

    console.log('spin start')

    const prefersReducedMotion = options?.prefersReducedMotion ?? false
    const timing = getSpinTiming(spinMode, prefersReducedMotion)
    const resultReels = generateSpinResult()
    const balanceBeforeSpin = balance
    let hasLoggedReelsUpdated = false

    console.log('result generated')

    playSpinStart(soundEnabled)

    set({
      balance: Math.max(0, balance - bet),
      isSpinning: true,
      spinningReels: Array.from({ length: REEL_COUNT }, () => true),
      lastWin: [],
      lastWinAmount: 0,
      status: 'spinning',
      statusMessage: 'Spinning...',
      showBigWin: false,
    })

    const reelUpdateInterval = window.setInterval(() => {
      set((state) => ({
        reels: state.reels.map((reel, reelIndex) => {
          if (!state.spinningReels[reelIndex]) {
            return reel
          }

          return generateSpinResult()[reelIndex]
        }),
      }))

      if (!hasLoggedReelsUpdated) {
        console.log('reels updated')
        hasLoggedReelsUpdated = true
      }
    }, timing.reelCycleMs)

    resultReels.forEach((resultReel, reelIndex) => {
      window.setTimeout(
        () => {
          set((state) => {
            const reels = [...state.reels]
            const spinningReels = [...state.spinningReels]

            reels[reelIndex] = resultReel
            spinningReels[reelIndex] = false

            return { reels, spinningReels }
          })
          playReelStop(get().soundEnabled)
        },
        getReelStopDelay(reelIndex, spinMode, prefersReducedMotion),
      )
    })

    const finalStopDelay = getReelStopDelay(
      REEL_COUNT - 1,
      spinMode,
      prefersReducedMotion,
    )

    window.setTimeout(() => {
      set({
        status: 'checking',
        statusMessage: 'Checking wins...',
      })
    }, finalStopDelay)

    window.setTimeout(() => {
      window.clearInterval(reelUpdateInterval)

      const wins = calculateWins(resultReels, bet)
      const payout = applyPayout(balanceBeforeSpin, bet, wins)
      const isBigWin = payout.totalWin >= bet * bigWinMultiplier
      if (payout.totalWin > 0) {
        playWinSound(payout.totalWin, bet, isBigWin, get().soundEnabled)
      }

      set((state) => ({
        reels: resultReels,
        isSpinning: false,
        spinningReels: Array.from({ length: REEL_COUNT }, () => false),
        lastWin: wins,
        lastWinAmount: payout.totalWin,
        totalWin: state.totalWin + payout.totalWin,
        balance: payout.balance,
        status: 'ready',
        statusMessage: 'Ready',
        showBigWin: isBigWin,
      }))

      console.log('spin end')
    }, finalStopDelay + timing.checkingDelayMs)
  },
}))

function playWinSound(
  totalWin: number,
  bet: number,
  isBigWin: boolean,
  soundEnabled: boolean,
) {
  if (isBigWin) {
    playJackpot(soundEnabled)
    return
  }

  if (totalWin >= bet * 12) {
    playWinBig(soundEnabled)
    return
  }

  playWinSmall(soundEnabled)
}
