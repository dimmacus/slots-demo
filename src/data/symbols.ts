import crown from '../assets/symbols/crown.png'
import diamond from '../assets/symbols/diamond.png'
import key from '../assets/symbols/key.png'
import scatter from '../assets/symbols/scatter.png'
import gash from '../assets/symbols/gash.png'
import marka from '../assets/symbols/marka.png'
import exc from '../assets/symbols/exc.png'
import zip from '../assets/symbols/zip.png'

import type { Symbol, SymbolType } from '../types/slot'

export const symbolImages: Record<SymbolType, string> = {
  crown,
  diamond,
  key,
  scatter,
  gash,
  marka,
  exc,
  zip,
}

export const symbolWeights: Record<SymbolType, number> = {
  crown: 1,
  diamond: 2,
  key: 3,
  scatter: 2,
  gash: 3,
  marka: 5,
  exc: 6,
  zip: 7,
}

export const symbolConfig: Record<SymbolType, Symbol> = {
  crown: {
    id: 'crown',
    label: 'Корона',
    rarity: 'legendary',
  },
  diamond: {
    id: 'diamond',
    label: 'Алмаз',
    rarity: 'epic',
  },
  key: {
    id: 'key',
    label: 'Ключ',
    rarity: 'uncommon',
  },
  scatter: {
    id: 'scatter',
    label: 'Scatter',
    rarity: 'rare',
  },
  gash: {
    id: 'gash',
    label: 'Gash',
    rarity: 'rare',
  },
  marka: {
    id: 'marka',
    label: 'Marka',
    rarity: 'common',
  },
  exc: {
    id: 'exc',
    label: 'Exc',
    rarity: 'common',
  },
  zip: {
    id: 'zip',
    label: 'Zip',
    rarity: 'uncommon',
  },
}

export const symbols = Object.values(symbolConfig)
