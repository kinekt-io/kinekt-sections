import type { CtaIcon } from './content.js'

/** Stroke icons rendered inside buttons as `<svg width="1em" height="1em" fill="none"><path stroke="currentColor" stroke-width="2" /></svg>`. */
export const ctaIconPaths: Record<CtaIcon, { viewBox: string; path: string }> = {
  'arrow-right': { viewBox: '0 0 11 18', path: 'm2 2 7 7-7 7' },
  'arrow-down': { viewBox: '0 0 18 18', path: 'm2 9 7 7 7-7M9 2v14' },
  'arrow-up-left': { viewBox: '0 0 18 18', path: 'M16 16 3 3m0 10V3h10' },
  download: { viewBox: '0 0 18 18', path: 'M9 2v10m-5-5 5 5 5-5M2 16h14' },
  'paper-plane': { viewBox: '0 0 18 18', path: 'M16.5 1.5 1.5 7.5l6 2.5 2.5 6zM7.5 10l9-8.5' },
  plus: { viewBox: '0 0 18 18', path: 'M9 2v14M2 9h14' },
}

export const ctaIconOptions: { label: string; value: CtaIcon }[] = [
  { label: 'Arrow right', value: 'arrow-right' },
  { label: 'Arrow down', value: 'arrow-down' },
  { label: 'Arrow up left', value: 'arrow-up-left' },
  { label: 'Download', value: 'download' },
  { label: 'Paper plane', value: 'paper-plane' },
  { label: 'Plus', value: 'plus' },
]

export const isCtaIcon = (value: unknown): value is CtaIcon => typeof value === 'string' && Object.hasOwn(ctaIconPaths, value)
