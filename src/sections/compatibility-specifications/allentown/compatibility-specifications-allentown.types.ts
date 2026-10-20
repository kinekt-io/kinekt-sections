import type { SectionIntro } from '../../../shared/content.js'
import type { BetaTheme } from '../../../shared/payload.js'

export interface CompatibilitySpecification {
  label: string
  value: string
}

export interface CompatiblePlatforms {
  heading?: string
  items: string[]
}

export interface CompatibilitySpecificationsContent {
  theme: BetaTheme
  intro: SectionIntro
  specifications: CompatibilitySpecification[]
  compatiblePlatforms?: CompatiblePlatforms
}

type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }

export interface PayloadCompatibilitySpecificationsDocument extends DraftFields<Omit<CompatibilitySpecificationsContent, 'intro' | 'specifications' | 'compatiblePlatforms'>> {
  blockType?: string
  intro?: { accentHeading?: string | null; heading?: string | null; description?: unknown } | null
  specifications?: Array<{ label?: string | null; value?: string | null }> | null
  compatiblePlatforms?: { heading?: string | null; items?: Array<{ name?: string | null }> | null } | null
}
