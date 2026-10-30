export type CtaIcon = string
export const ctaStyles = ['primary', 'secondary', 'clear', 'clear-base'] as const
export type CtaStyle = (typeof ctaStyles)[number]
export const isCtaStyle = (value: unknown): value is CtaStyle => typeof value === 'string' && ctaStyles.includes(value as CtaStyle)
export interface Cta { label: string; href: string; icon?: CtaIcon; style?: CtaStyle }
export interface CtaGroup { buttons?: Cta[]; primary?: Cta | null; secondary?: Cta | null }

export const ctaGroupActions = (group: CtaGroup | Cta[] | Record<string, unknown> | null | undefined): Cta[] => {
  if (!group) return []
  if (Array.isArray(group)) return group.filter((action): action is Cta => typeof action === 'object' && action !== null && typeof action.label === 'string' && action.label.trim() !== '' && typeof action.href === 'string' && action.href.trim() !== '')
  if (typeof group !== 'object') return []
  const legacy = group as CtaGroup & { primaryButton?: Cta; secondaryButton?: Cta }
  const actions = Array.isArray(legacy.buttons)
    ? legacy.buttons
    : [legacy.primary ?? legacy.primaryButton, legacy.secondary ?? legacy.secondaryButton].filter(Boolean)
  return actions.filter((action): action is Cta => typeof action === 'object' && action !== null && typeof action.label === 'string' && action.label.trim() !== '' && typeof action.href === 'string' && action.href.trim() !== '')
}
export interface MediaSource { url: string; width: number; height: number }
export interface Media { url: string; alt: string; width: number; height: number; sources?: MediaSource[]; sizes?: string; fallbackUrl?: string }
export interface RichText { html: string }
export interface SectionIntro { accentHeading?: string; heading: string; description?: string | RichText }
export const sectionThemes = ['light', 'semi-light', 'semi-dark', 'dark'] as const
export type SectionTheme = (typeof sectionThemes)[number]
