export type CtaIcon = string
export const ctaStyles = ['primary', 'secondary', 'clear', 'clear-base'] as const
export type CtaStyle = (typeof ctaStyles)[number]
export const isCtaStyle = (value: unknown): value is CtaStyle => typeof value === 'string' && ctaStyles.includes(value as CtaStyle)
interface CtaBase { label: string; icon?: CtaIcon; style?: CtaStyle }
export interface LinkCta extends CtaBase { href: string; form?: never }
export interface FormCta extends CtaBase { form: string; href?: never }
export type Cta = LinkCta | FormCta
export interface CtaGroup { buttons?: Cta[]; primary?: Cta | null; secondary?: Cta | null }
export interface FormModalPresentation { enabled?: boolean; label?: string; style?: CtaStyle; icon?: CtaIcon }

export const isFormCta = (value: unknown): value is FormCta => {
  if (typeof value !== 'object' || value === null) return false
  const cta = value as Record<string, unknown>
  return typeof cta.label === 'string' && cta.label.trim() !== ''
    && typeof cta.form === 'string' && cta.form.trim() !== ''
}

export const isLinkCta = (value: unknown): value is LinkCta => {
  if (typeof value !== 'object' || value === null) return false
  const cta = value as Record<string, unknown>
  return typeof cta.label === 'string' && cta.label.trim() !== ''
    && typeof cta.href === 'string' && cta.href.trim() !== ''
}

export const ctaGroupActions = (group: CtaGroup | Cta[] | Record<string, unknown> | null | undefined): Cta[] => {
  if (!group) return []
  if (Array.isArray(group)) return group.filter((action): action is Cta => isLinkCta(action) || isFormCta(action))
  if (typeof group !== 'object') return []
  const legacy = group as CtaGroup & { primaryButton?: Cta; secondaryButton?: Cta }
  const actions = Array.isArray(legacy.buttons)
    ? legacy.buttons
    : [legacy.primary ?? legacy.primaryButton, legacy.secondary ?? legacy.secondaryButton].filter(Boolean)
  return actions.filter((action): action is Cta => isLinkCta(action) || isFormCta(action))
}
export interface MediaSource { url: string; width: number; height: number }
export interface Media { url: string; alt: string; width: number; height: number; sources?: MediaSource[]; sizes?: string; fallbackUrl?: string }
export interface RichText { html: string }
export interface SectionIntro { accentHeading?: string; heading: string; description?: string | RichText }
export const sectionThemes = ['light', 'semi-light', 'semi-dark', 'dark'] as const
export type SectionTheme = (typeof sectionThemes)[number]
