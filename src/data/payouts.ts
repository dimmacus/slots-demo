import type { SymbolType } from '../types/slot'

export const payouts: Record<SymbolType, Record<number, number>> = {
  marka: { 3: 2, 4: 5, 5: 12 },
  exc: { 3: 3, 4: 8, 5: 18 },
  zip: { 3: 4, 4: 12, 5: 28 },
  key: { 3: 6, 4: 18, 5: 42 },
  scatter: { 3: 8, 4: 24, 5: 70 },
  gash: { 3: 10, 4: 32, 5: 90 },
  diamond: { 3: 16, 4: 56, 5: 160 },
  crown: { 3: 28, 4: 110, 5: 320 },
}
