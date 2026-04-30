export type SymbolType =
  | 'crown'
  | 'diamond'
  | 'key'
  | 'scatter'
  | 'gash'
  | 'marka'
  | 'exc'
  | 'zip'

export type SymbolRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export type Symbol = {
  id: SymbolType
  label: string
  rarity: SymbolRarity
}

export type Reel = {
  id: string
  symbols: Symbol[]
}

export type Payline = {
  id: string
  name: string
  positions: number[]
}

export type WinResult = {
  paylineId: string
  symbolId: SymbolType
  symbolName: string
  matchCount: number
  multiplier: number
  amount: number
  positions: Array<{
    reelIndex: number
    rowIndex: number
  }>
}
