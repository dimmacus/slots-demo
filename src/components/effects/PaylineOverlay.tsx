import { motion } from 'framer-motion'

import type { WinResult } from '../../types/slot'

type PaylineOverlayProps = {
  wins: WinResult[]
}

export function PaylineOverlay({ wins }: PaylineOverlayProps) {
  if (wins.length === 0) {
    return null
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {wins.map((win, index) => (
        <motion.polyline
          key={`${win.paylineId}-${win.symbolId}`}
          points={toPolylinePoints(win)}
          fill="none"
          stroke={index % 2 === 0 ? '#facc15' : '#fb7185'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.95 }}
          transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
          className="drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]"
        />
      ))}
    </svg>
  )
}

function toPolylinePoints(win: WinResult) {
  return win.positions
    .map(({ reelIndex, rowIndex }) => {
      const x = ((reelIndex + 0.5) / 5) * 100
      const y = ((rowIndex + 0.5) / 3) * 100

      return `${x},${y}`
    })
    .join(' ')
}
