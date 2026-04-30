import { motion } from 'framer-motion'

import { symbolImages } from '../../data/symbols'
import type { Symbol } from '../../types/slot'
import { cn } from '../../utils/cn'

type SlotSymbolProps = {
  symbol: Symbol
  isWinning?: boolean
}

export function SlotSymbol({ symbol, isWinning = false }: SlotSymbolProps) {
  return (
    <motion.div
      animate={isWinning ? { scale: [1, 1.08, 1], y: [0, -3, 0] } : { scale: 1 }}
      transition={isWinning ? { duration: 0.9, repeat: Infinity } : undefined}
      className={cn(
        'slot-symbol flex h-full min-h-20 items-center justify-center rounded-lg border p-2 sm:min-h-24',
        `slot-symbol-${symbol.rarity}`,
        isWinning && 'slot-symbol-winning border-amber-200/80',
      )}
    >
      <img
        src={symbolImages[symbol.id]}
        alt={symbol.label}
        className={cn('slot-symbol-image symbol', isWinning && 'win')}
      />
    </motion.div>
  )
}
