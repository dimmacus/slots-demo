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
import { playSound, stopSound } from '../utils/audioManager'

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
  status: SpinStatus
  statusMessage: string
  showBigWin: boolean
  setBet: (bet: number) => void
  increaseBet: () => void
  decreaseBet: () => void
  setMaxBet: () => void
  setSpinMode: (mode: SpinMode) => void
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
  dismissBigWin: () => {
    set({ showBigWin: false })
  },
  spin: (options) => {
    const { balance, bet, isSpinning, spinMode } = get()

    playSound('buttonClick')

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
      playSound('error')
      return
    }

    console.log('spin start')

    const prefersReducedMotion = options?.prefersReducedMotion ?? false
    const timing = getSpinTiming(spinMode, prefersReducedMotion)
    const resultReels = generateSpinResult()
    const balanceBeforeSpin = balance
    let hasLoggedReelsUpdated = false

    console.log('result generated')

    playSound('spinStart')
    playSound('spinLoop')

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
          playSound('reelStop')
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
      const hasBonusSymbol = resultReels.some((reel) =>
        reel.symbols.some((symbol) => {
          return symbol.id === 'key' || symbol.id === 'scatter'
        }),
      )

      stopSound('spinLoop')

      if (payout.totalWin > 0) {
        playSound(getWinSound(payout.totalWin, bet, isBigWin))
      }

      if (hasBonusSymbol) {
        playSound('bonus')
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

function getWinSound(totalWin: number, bet: number, isBigWin: boolean) {
  if (isBigWin) {
    return 'bigWin'
  }

  if (totalWin >= bet * 12) {
    return 'mediumWin'
  }

  return 'smallWin'
}
