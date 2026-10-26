export type CtaIcon = 'arrow-right' | 'arrow-down' | 'arrow-up-left' | 'download' | 'paper-plane' | 'plus'
export interface Cta { label: string; href: string; icon?: CtaIcon }
export interface CtaGroup { primary?: Cta | null; secondary?: Cta | null }
export interface MediaSource { url: string; width: number; height: number }
export interface Media { url: string; alt: string; width: number; height: number; sources?: MediaSource[]; sizes?: string; fallbackUrl?: string }
export interface RichText { html: string }
export interface SectionIntro { accentHeading?: string; heading: string; description?: string | RichText }
export const sectionThemes = ['light', 'semi-light', 'semi-dark', 'dark'] as const
export type SectionTheme = (typeof sectionThemes)[number]
