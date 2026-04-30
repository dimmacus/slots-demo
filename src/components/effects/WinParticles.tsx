import { AnimatePresence, motion } from 'framer-motion'

type WinParticlesProps = {
  show: boolean
}

const particles = Array.from({ length: 18 }, (_, index) => index)

export function WinParticles({ show }: WinParticlesProps) {
  return (
    <AnimatePresence>
      {show ? (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-lg">
          {particles.map((particle) => (
            <motion.span
              key={particle}
              className="absolute h-1.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_14px_rgba(252,211,77,0.9)]"
              initial={{
                opacity: 0,
                x: `${20 + (particle % 6) * 12}%`,
                y: '62%',
                scale: 0.6,
              }}
              animate={{
                opacity: [0, 1, 0],
                y: `${12 + (particle % 5) * 10}%`,
                scale: [0.6, 1.3, 0.4],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.1,
                delay: (particle % 6) * 0.05,
                repeat: 2,
                repeatDelay: 0.35,
              }}
            />
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  )
}
