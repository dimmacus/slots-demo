import { motion, useReducedMotion } from 'framer-motion'
import {
  FastForward,
  Minus,
  Plus,
  ReceiptText,
  Repeat,
  Volume2,
  VolumeX,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import { BigWinOverlay } from '../../components/effects/BigWinOverlay'
import { PaylineOverlay } from '../../components/effects/PaylineOverlay'
import { WinParticles } from '../../components/effects/WinParticles'
import { PaytableModal } from '../../components/ui/PaytableModal'
import { WinPanel } from '../../components/ui/WinPanel'
import { getSpinTiming } from '../../data/animationConfig'
import { paylines } from '../../data/paylines'
import { useAudioSettings } from '../../hooks/useAudioSettings'
import { useSlotStore } from '../../store/slotStore'
import { audioManager, playSound } from '../../utils/audioManager'
import { cn } from '../../utils/cn'
import { getWinningPositionKeys } from '../../utils/slotMath'
import { Reel } from './Reel'

export function SlotMachine() {
  const [isPaytableOpen, setIsPaytableOpen] = useState(false)
  const [isAutoLit, setIsAutoLit] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const {
    enabled: soundEnabled,
    volume,
    ambientEnabled,
    unlockAudio,
    setSoundEnabled,
    setVolume,
    setAmbientEnabled,
  } = useAudioSettings()
  const {
    balance,
    bet,
    minBet,
    maxBet,
    reels,
    isSpinning,
    spinningReels,
    lastWin,
    lastWinAmount,
    totalWin,
    spinMode,
    status,
    statusMessage,
    showBigWin,
    dismissBigWin,
    increaseBet,
    decreaseBet,
    setMaxBet,
    setSpinMode,
    spin,
  } = useSlotStore()
  const canSpin = balance >= bet && !isSpinning
  const displayStatus =
    !isSpinning && balance < bet
      ? { status: 'insufficient', message: 'Баланс пустоват' }
      : { status, message: translateStatus(statusMessage) }
  const timing = getSpinTiming(spinMode, Boolean(prefersReducedMotion))
  const winningPositions = useMemo(() => {
    return isSpinning ? new Set<string>() : getWinningPositionKeys(lastWin)
  }, [isSpinning, lastWin])

  return (
    <>
      <div
        className="slot-cabinet w-full max-w-5xl rounded-lg p-3 sm:p-5"
        onPointerDown={unlockAudio}
      >
        <div className="slot-frame relative rounded-lg p-2 sm:p-4">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
          <div className="relative rounded-lg border border-black/50 bg-[#08050b] p-2 shadow-inner shadow-black sm:p-4">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
              {reels.map((reel, reelIndex) => (
                <Reel
                  key={`reel-${reelIndex}`}
                  reel={reel}
                  reelIndex={reelIndex}
                  isSpinning={spinningReels[reelIndex]}
                  spinCycleMs={timing.reelCycleMs}
                  winningPositions={winningPositions}
                />
              ))}
            </div>
            <PaylineOverlay wins={isSpinning ? [] : lastWin} />
            <WinParticles show={!isSpinning && lastWinAmount > 0} />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1.5 text-left sm:mt-4 sm:gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="БАЛАНС" value={formatCredits(balance)} tone="gold" />
          <Stat label="СТАВКА" value={formatCredits(bet)} tone="purple" />
          <Stat label="ВЫБИТО" value={formatCredits(lastWinAmount)} tone="green" />
          <Stat label="ОБЩИЙ ВЫИГРЫШ" value={formatCredits(totalWin)} tone="gold" />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="casino-control-panel rounded-lg p-3">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <StatusPill
                status={displayStatus.status}
                message={displayStatus.message}
              />
              <IconButton
                label="Уменьшить ставку"
                disabled={isSpinning || bet <= minBet}
                onClick={decreaseBet}
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </IconButton>
              <IconButton
                label="Увеличить ставку"
                disabled={isSpinning || bet >= maxBet}
                onClick={increaseBet}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </IconButton>
              <TextButton disabled={isSpinning} onClick={setMaxBet}>
                Макс
              </TextButton>
              <TextButton
                disabled={isSpinning}
                active={spinMode === 'turbo'}
                onClick={() => setSpinMode(spinMode === 'normal' ? 'turbo' : 'normal')}
              >
                <FastForward className="h-4 w-4 text-amber-200" aria-hidden="true" />
                НА СПИДАХ
              </TextButton>
              <TextButton
                active={isAutoLit}
                onClick={() => setIsAutoLit((value) => !value)}
              >
                <Repeat className="h-4 w-4 text-fuchsia-200" aria-hidden="true" />
                ПОД ЛСД
              </TextButton>
              <TextButton
                active={soundEnabled}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                ) : (
                  <VolumeX className="h-4 w-4 text-stone-400" aria-hidden="true" />
                )}
                {soundEnabled ? 'ЗВУК ВКЛ' : 'ЗВУК ВЫКЛ'}
              </TextButton>
              <TextButton
                active={ambientEnabled}
                onClick={() => setAmbientEnabled(!ambientEnabled)}
              >
                Фон
              </TextButton>
              <TextButton onClick={() => setIsPaytableOpen(true)}>
                <ReceiptText className="h-4 w-4 text-emerald-200" aria-hidden="true" />В
                ИТОГЕ
              </TextButton>
            </div>

            <label className="mt-3 grid gap-2 text-left text-xs font-black uppercase tracking-[0.14em] text-stone-400 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <span>Громкость</span>
              <input
                className="casino-volume-slider"
                type="range"
                min="0"
                max="100"
                value={Math.round(volume * 100)}
                onChange={(event) => setVolume(Number(event.target.value) / 100)}
              />
              <span className="text-amber-100">{Math.round(volume * 100)}%</span>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-1">
            <WinPanel totalWin={lastWinAmount} winCount={lastWin.length} />
            <motion.button
              type="button"
              className="spin-button inline-flex h-full min-h-16 items-center justify-center rounded-lg px-7 text-center text-base font-black uppercase tracking-[0.14em] text-stone-950 disabled:cursor-not-allowed disabled:opacity-45 sm:text-lg"
              disabled={!canSpin}
              whileHover={
                canSpin && !prefersReducedMotion ? { y: -2, scale: 1.01 } : undefined
              }
              whileTap={canSpin && !prefersReducedMotion ? { scale: 0.96 } : undefined}
              onClick={() =>
                spin({ prefersReducedMotion: Boolean(prefersReducedMotion) })
              }
            >
              {isSpinning ? 'КРУТИМ...' : 'ЧЕКНУТЬ УДАЧУ'}
            </motion.button>
          </div>
        </div>

        <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
          {paylines.length} демо-линий. Без денег, депозитов и выводов.
        </p>
      </div>

      <PaytableModal isOpen={isPaytableOpen} onClose={() => setIsPaytableOpen(false)} />
      <BigWinOverlay
        show={showBigWin}
        amount={lastWinAmount}
        onDismiss={dismissBigWin}
      />
    </>
  )
}

type StatProps = {
  label: string
  value: string
  tone: 'gold' | 'green' | 'purple'
}

function Stat({ label, value, tone }: StatProps) {
  return (
    <div className={cn('casino-stat rounded-lg px-4 py-3', `casino-stat-${tone}`)}>
      <span className="block text-xs font-black uppercase tracking-[0.18em] text-stone-300/80">
        {label}
      </span>
      <span className="mt-1 block text-xl font-black text-stone-50">{value}</span>
    </div>
  )
}

type StatusPillProps = {
  status: string
  message: string
}

function StatusPill({ status, message }: StatusPillProps) {
  return (
    <motion.p
      key={message}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'inline-flex h-10 items-center rounded-lg border px-3 text-sm font-black uppercase tracking-[0.08em]',
        status === 'insufficient'
          ? 'border-rose-300/40 bg-rose-500/12 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.16)]'
          : 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]',
      )}
    >
      {message}
    </motion.p>
  )
}

type ButtonProps = {
  children: ReactNode
  active?: boolean
  disabled?: boolean
  label?: string
  onClick: () => void
}

function IconButton({ children, disabled, label, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className="casino-tool-button inline-flex h-10 w-10 items-center justify-center rounded-lg text-stone-200 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
      disabled={disabled}
      onClick={() => handleToolClick(onClick)}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

function TextButton({ children, active, disabled, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'casino-tool-button inline-flex h-10 items-center gap-2 rounded-lg px-3 text-xs font-black uppercase tracking-[0.12em] text-stone-200 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-45',
        active && 'casino-tool-button-active',
      )}
      disabled={disabled}
      onClick={() => handleToolClick(onClick)}
    >
      {children}
    </button>
  )
}

function handleToolClick(callback: () => void) {
  audioManager.unlock()
  playSound('buttonClick')
  callback()
}

function translateStatus(message: string) {
  if (message === 'Spinning...') {
    return 'Барабаны крутятся...'
  }

  if (message === 'Checking wins...') {
    return 'Сверяем клад...'
  }

  if (message === 'Demo balance too low') {
    return 'Баланс пустоват'
  }

  return 'Готово'
}

function formatCredits(value: number) {
  return value.toLocaleString('ru-RU')
}
