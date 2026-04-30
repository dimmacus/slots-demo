import type { CSSProperties } from 'react'

import { symbols } from '../../data/symbols'
import type { Reel as ReelData } from '../../types/slot'
import { SlotSymbol } from './SlotSymbol'

type ReelProps = {
  reel: ReelData
  reelIndex: number
  isSpinning: boolean
  spinCycleMs: number
  winningPositions: Set<string>
}

const spinStripSymbols = [...symbols, ...symbols, ...symbols]

export function Reel({
  reel,
  reelIndex,
  isSpinning,
  spinCycleMs,
  winningPositions,
}: ReelProps) {
  const spinStyle = {
    '--slot-reel-cycle': `${spinCycleMs}ms`,
  } as CSSProperties

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        key={reel.id}
        className={
          isSpinning
            ? 'slot-reel-stopped opacity-0'
            : 'slot-reel-stopped slot-reel-landed'
        }
      >
        {reel.symbols.map((symbol, rowIndex) => (
          <SlotSymbol
            key={`${reel.id}-${rowIndex}-${symbol.id}`}
            symbol={symbol}
            isWinning={winningPositions.has(`${reelIndex}-${rowIndex}`)}
          />
        ))}
      </div>

      {isSpinning ? (
        <div className="absolute inset-0 z-10 overflow-hidden rounded-lg">
          <div className="slot-reel-spin-track" style={spinStyle}>
            {spinStripSymbols.map((symbol, index) => (
              <SlotSymbol key={`${symbol.id}-${index}`} symbol={symbol} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
