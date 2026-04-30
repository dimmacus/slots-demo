import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type BigWinOverlayProps = {
  show: boolean
  amount: number
  onDismiss: () => void
}

export function BigWinOverlay({ show, amount, onDismiss }: BigWinOverlayProps) {
  const countedAmount = useCountUp(show ? amount : 0, show)

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          <div className="pointer-events-none absolute inset-0 casino-win-burst" />
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-lg border border-amber-200/50 bg-[#12070f] px-6 py-8 text-center shadow-[0_0_120px_rgba(252,211,77,0.35)]"
            initial={{ scale: 0.86, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
            <p className="text-sm font-black uppercase tracking-[0.28em] text-fuchsia-200">
              КРУПНЫЙ ВЫИГРЫШ
            </p>
            <p className="mt-3 text-6xl font-black text-amber-100 drop-shadow-[0_0_24px_rgba(252,211,77,0.7)]">
              {countedAmount.toLocaleString('ru-RU')}
            </p>
            <button
              type="button"
              className="mt-7 inline-flex h-12 items-center justify-center rounded-lg border border-amber-200/50 bg-amber-300 px-6 text-sm font-black uppercase tracking-[0.14em] text-stone-950 transition hover:bg-amber-200 active:scale-95"
              onClick={onDismiss}
            >
              Забрать
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) {
      return
    }

    const startedAt = performance.now()
    const duration = 1_200
    let frame = 0

    function tick(now: number) {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)

      setValue(Math.round(target * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [active, target])

  return value
}
