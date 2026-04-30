import { motion } from 'framer-motion'

type WinPanelProps = {
  totalWin: number
  winCount: number
}

export function WinPanel({ totalWin, winCount }: WinPanelProps) {
  return (
    <motion.div
      key={totalWin}
      initial={{ opacity: 0.75, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="casino-panel rounded-lg border border-emerald-300/20 bg-gradient-to-b from-emerald-300/12 to-white/[0.035] px-4 py-3 text-center"
    >
      <span className="block text-xs font-black uppercase tracking-[0.2em] text-emerald-200/85">
        ВЫБИТО
      </span>
      <span className="mt-1 block text-3xl font-black text-emerald-100 drop-shadow-[0_0_16px_rgba(52,211,153,0.45)]">
        {totalWin.toLocaleString('ru-RU')}
      </span>
      <span className="mt-1 block text-xs font-semibold text-stone-400">
        {winCount > 0 ? `${winCount} выигрышн. линий` : 'Пока без совпадений'}
      </span>
    </motion.div>
  )
}
