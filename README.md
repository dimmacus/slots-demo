# Slots Demo

A React + Vite + TypeScript demo slot machine. This is a front-end-only demo:
there is no backend, no wallet, and no real-money logic.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run format
```

## Reel Animation

The spin flow is driven by the Zustand store in `src/store/slotStore.ts`.
When Spin is clicked, the store:

1. Checks the demo balance.
2. Deducts the bet immediately.
3. Generates the final reel result.
4. Marks all reels as spinning.
5. Stops reels one by one from left to right.
6. Enters a short "Checking wins..." phase.
7. Calculates wins and applies payouts.

The visual reel movement is CSS-based in `src/styles/index.css`. Each spinning
reel shows a fast vertical symbol strip with a small blur. When the reel stops,
the final generated symbols are revealed without changing the grid dimensions.

## Spin Speed

Spin timings live in `src/data/animationConfig.ts`.

- `spinTimings.normal` controls the cinematic mode.
- `spinTimings.turbo` controls the faster turbo mode.
- `reelStopBaseMs` is the first reel stop delay.
- `reelStopStaggerMs` controls the left-to-right stop spacing.
- `checkingDelayMs` controls how long "Checking wins..." is shown.
- `reelCycleMs` controls how fast the CSS reel strip loops.

The app also uses `prefers-reduced-motion` to shorten spin timing and remove
most motion for users who request reduced motion.

## Win Highlights

Winning symbol glow and reel blur styles are located in `src/styles/index.css`.
The animated payline SVG is rendered by `src/components/effects/PaylineOverlay.tsx`.
The total win display is `src/components/ui/WinPanel.tsx`, and large payouts open
`src/components/effects/BigWinOverlay.tsx`.

## Assets

Symbol data lives in `src/data/symbols.ts`. Each symbol has an `imagePath` that
points at `src/assets/symbols` plus a fallback emoji. Missing image files do not
break the app; the symbol component falls back to the emoji.
