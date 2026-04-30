import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

import { payouts } from '../../data/payouts'
import { symbolImages, symbols } from '../../data/symbols'
import type { SymbolType } from '../../types/slot'

type PaytableModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function PaytableModal({ isOpen, onClose }: PaytableModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-lg border border-amber-200/30 bg-[#100712] text-left shadow-[0_0_90px_rgba(168,85,247,0.22)]"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200/80">
                  В ИТОГЕ
                </p>
                <h2 className="mt-1 text-2xl font-black text-amber-50">
                  Таблица выплат
                </h2>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-stone-200 transition hover:border-amber-200/40 hover:text-amber-100 active:scale-95"
                onClick={onClose}
                aria-label="Закрыть таблицу выплат"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[64vh] overflow-auto px-5 py-4">
              <div className="grid min-w-[520px] grid-cols-[1.5fr_repeat(3,1fr)] gap-2 text-sm">
                <div className="px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-stone-400">
                  Символ
                </div>
                {[3, 4, 5].map((matchCount) => (
                  <div
                    key={matchCount}
                    className="px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-stone-400"
                  >
                    {matchCount}x
                  </div>
                ))}

                {symbols.map((symbol) => (
                  <PaytableRow key={symbol.id} symbolId={symbol.id} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

type PaytableRowProps = {
  symbolId: SymbolType
}

function PaytableRow({ symbolId }: PaytableRowProps) {
  const symbol = symbols.find((item) => item.id === symbolId)

  if (!symbol) {
    return null
  }

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 font-semibold text-stone-100">
        <img
          className="h-9 w-9 object-contain"
          src={symbolImages[symbol.id]}
          alt={symbol.label}
        />
        <span>{symbol.label}</span>
      </div>
      {[3, 4, 5].map((matchCount) => (
        <div
          key={`${symbol.id}-${matchCount}`}
          className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 font-black text-amber-100"
        >
          x{payouts[symbol.id]?.[matchCount] ?? 0}
        </div>
      ))}
    </>
  )
}
