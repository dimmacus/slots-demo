import type { Payline } from '../types/slot'

export const paylines: Payline[] = [
  { id: 'line-1', name: 'Top Row', positions: [0, 0, 0, 0, 0] },
  { id: 'line-2', name: 'Middle Row', positions: [1, 1, 1, 1, 1] },
  { id: 'line-3', name: 'Bottom Row', positions: [2, 2, 2, 2, 2] },
  { id: 'line-4', name: 'V Shape', positions: [0, 1, 2, 1, 0] },
  { id: 'line-5', name: 'Inverted V', positions: [2, 1, 0, 1, 2] },
  { id: 'line-6', name: 'Top Zigzag', positions: [0, 0, 1, 2, 2] },
  { id: 'line-7', name: 'Bottom Zigzag', positions: [2, 2, 1, 0, 0] },
  { id: 'line-8', name: 'Rising Steps', positions: [2, 1, 1, 1, 0] },
  { id: 'line-9', name: 'Falling Steps', positions: [0, 1, 1, 1, 2] },
  { id: 'line-10', name: 'Center Wave', positions: [1, 0, 1, 2, 1] },
]
