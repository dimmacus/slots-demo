import { nanoid } from 'nanoid'

import { paylines } from '../data/paylines'
import { payouts } from '../data/payouts'
import { symbolConfig, symbolWeights } from '../data/symbols'
import type { Reel, Symbol, SymbolType, WinResult } from '../types/slot'

export const REEL_COUNT = 5
export const ROW_COUNT = 3

export function getRandomSymbol(): Symbol {
  const weightedPool: SymbolType[] = []

  Object.entries(symbolWeights).forEach(([symbol, weight]) => {
    for (let i = 0; i < weight; i += 1) {
      weightedPool.push(symbol as SymbolType)
    }
  })

  const symbol = weightedPool[Math.floor(Math.random() * weightedPool.length)]

  return symbolConfig[symbol]
}

export function generateSpinResult(): Reel[] {
  return Array.from({ length: REEL_COUNT }, () => ({
    id: nanoid(),
    symbols: Array.from({ length: ROW_COUNT }, getRandomSymbol),
  }))
}

export function calculateWins(reels: Reel[], bet: number): WinResult[] {
  return paylines.flatMap((payline) => {
    const firstSymbol = getSymbolAt(reels, 0, payline.positions[0])

    if (!firstSymbol) {
      return []
    }

    let matchCount = 1

    for (let reelIndex = 1; reelIndex < reels.length; reelIndex += 1) {
      const rowIndex = payline.positions[reelIndex]
      const symbol = getSymbolAt(reels, reelIndex, rowIndex)

      if (symbol?.id !== firstSymbol.id) {
        break
      }

      matchCount += 1
    }

    const multiplier = payouts[firstSymbol.id]?.[matchCount] ?? 0

    if (matchCount < 3 || multiplier === 0) {
      return []
    }

    return [
      {
        paylineId: payline.id,
        symbolId: firstSymbol.id,
        symbolName: firstSymbol.label,
        matchCount,
        multiplier,
        amount: bet * multiplier,
        positions: Array.from({ length: matchCount }, (_, reelIndex) => ({
          reelIndex,
          rowIndex: payline.positions[reelIndex],
        })),
      },
    ]
  })
}

export function applyPayout(balance: number, bet: number, wins: WinResult[]) {
  const totalWin = wins.reduce((total, win) => total + win.amount, 0)

  return {
    balance: Math.max(0, balance - bet) + totalWin,
    totalWin,
  }
}

export function getWinningPositionKeys(wins: WinResult[]) {
  return new Set(
    wins.flatMap((win) =>
      win.positions.map((position) => {
        return `${position.reelIndex}-${position.rowIndex}`
      }),
    ),
  )
}

function getSymbolAt(
  reels: Reel[],
  reelIndex: number,
  rowIndex: number,
): Symbol | undefined {
  return reels[reelIndex]?.symbols[rowIndex]
}
