export interface Cta { label: string; href: string }
export interface CtaGroup { primary?: Cta | null; secondary?: Cta | null }
export interface Media { url: string; alt: string; width: number; height: number; fallbackUrl?: string }
export interface RichText { html: string }
export interface SectionIntro { accentHeading?: string; heading: string; description?: string | RichText }
export const sectionThemes = ['light', 'semi-light', 'semi-dark', 'dark'] as const
export type SectionTheme = (typeof sectionThemes)[number]
