import { motion } from 'framer-motion'
import { BadgeCheck, Sparkles } from 'lucide-react'

import { SlotMachine } from '../slot/SlotMachine'

export function AppShell() {
  return (
    <main className="casino-bg relative min-h-screen overflow-hidden text-stone-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(252,211,77,0.26),transparent_30%),radial-gradient(circle_at_18%_18%,rgba(34,197,94,0.16),transparent_28%),radial-gradient(circle_at_84%_16%,rgba(168,85,247,0.2),transparent_32%),linear-gradient(135deg,#050306_0%,#120712_48%,#050306_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/90 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 top-20 h-40 rounded-full bg-emerald-400/10 blur-3xl" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-3 py-5 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-6xl flex-col items-center gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/30 bg-black/55 px-4 py-2 text-center text-[0.68rem] font-black uppercase tracking-[0.16em] text-emerald-100 shadow-[0_0_34px_rgba(52,211,153,0.18)] backdrop-blur sm:text-xs"
          >
            <BadgeCheck
              className="h-4 w-4 shrink-0 text-emerald-300"
              aria-hidden="true"
            />
            ДЕМО-РЕЖИМ — ПОКА ПОДГОТАВЛИВАЕМ ЗАКЛАДКИ
          </motion.div>

          <div className="casino-shell w-full rounded-lg border border-amber-200/20 bg-black/60 p-3 shadow-[0_24px_110px_rgba(0,0,0,0.78)] backdrop-blur-xl sm:p-5 lg:p-7">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 text-center sm:gap-7">
              <div className="flex items-center gap-3 text-amber-200">
                <span className="h-px w-14 bg-gradient-to-r from-transparent to-amber-300/80" />
                <Sparkles
                  className="h-5 w-5 drop-shadow-[0_0_12px_rgba(252,211,77,0.8)]"
                  aria-hidden="true"
                />
                <span className="h-px w-14 bg-gradient-to-l from-transparent to-amber-300/80" />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-[0.34em] text-fuchsia-200/80 sm:text-sm">
                  слоты с приколом от creativeprostor
                </p>
                <h1 className="casino-title text-balance text-5xl font-black uppercase tracking-normal text-amber-100 sm:text-7xl lg:text-8xl">
                  ЗАКЛАДКИНГ
                </h1>
                <p className="mx-auto max-w-2xl text-pretty text-base font-semibold leading-7 text-stone-200 sm:text-lg">
                  Крути барабаны, повышай ставку и рискни выиграть клад
                </p>
              </div>

              <SlotMachine />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
