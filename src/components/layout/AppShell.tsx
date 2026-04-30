import { motion } from 'framer-motion'
import { BadgeCheck, Coins, Sparkles } from 'lucide-react'

import { cn } from '../../utils/cn'

const reelPlaceholders = ['Seven', 'Bar', 'Bell']

export function AppShell() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070508] text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,154,74,0.24),transparent_34%),radial-gradient(circle_at_18%_24%,rgba(143,38,48,0.2),transparent_30%),linear-gradient(135deg,#070508_0%,#14090d_48%,#070508_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-6xl flex-col items-center gap-5 sm:gap-7">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-300/30 bg-black/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100 shadow-[0_0_32px_rgba(245,178,76,0.18)] backdrop-blur"
          >
            <BadgeCheck className="h-4 w-4 text-emerald-300" aria-hidden="true" />
            Demo Mode — No Real Money
          </motion.div>

          <div className="w-full rounded-lg border border-amber-200/15 bg-black/55 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-6 lg:p-8">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
              <div className="flex items-center gap-3 text-amber-200">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-amber-300/70" />
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-amber-300/70" />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-200/80">
                  Slots Demo
                </p>
                <h1 className="text-balance text-4xl font-black uppercase tracking-normal text-amber-50 sm:text-5xl lg:text-6xl">
                  Premium Slot Showcase
                </h1>
                <p className="mx-auto max-w-2xl text-pretty text-base leading-7 text-stone-300 sm:text-lg">
                  A responsive shell for the upcoming slot machine experience.
                  Game reels, sounds, symbols, and win logic will plug in here next.
                </p>
              </div>

              <div className="w-full max-w-4xl rounded-lg border border-amber-300/20 bg-gradient-to-b from-stone-950 to-black p-3 shadow-inner shadow-amber-950/40 sm:p-5">
                <div className="rounded-lg border border-amber-200/10 bg-[#12090b] p-3 sm:p-5">
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {reelPlaceholders.map((label, index) => (
                      <div
                        key={label}
                        className={cn(
                          'flex aspect-[3/4] min-h-32 items-center justify-center rounded-lg border bg-gradient-to-b from-[#2a1014] to-[#090506] p-3',
                          'border-amber-200/15 shadow-[inset_0_1px_24px_rgba(255,217,138,0.08)]',
                        )}
                      >
                        <div className="flex flex-col items-center gap-3 text-amber-100/75">
                          <Coins
                            className={cn(
                              'h-8 w-8 sm:h-10 sm:w-10',
                              index === 1 && 'text-amber-300',
                            )}
                            aria-hidden="true"
                          />
                          <span className="text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
                            {label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid w-full gap-3 text-left sm:grid-cols-3">
                {['Symbols', 'Audio', 'Spin Logic'].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-stone-300"
                  >
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/80">
                      Coming Soon
                    </span>
                    <span className="mt-1 block font-semibold text-stone-100">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
