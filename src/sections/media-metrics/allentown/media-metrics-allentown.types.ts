import type { Media, SectionIntro } from '../../../shared/content.js'
import type { BetaTheme } from '../../../shared/payload.js'

export interface MediaMetric {
  label: string
  value: { text: string; icon?: string }
}

export interface MediaMetricsAllentownContent {
  theme: BetaTheme
  intro: SectionIntro
  metrics: MediaMetric[]
  media?: Media | null
}

type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }
type PayloadID = string | number

export interface PayloadMediaMetricsAllentownDocument extends DraftFields<Omit<MediaMetricsAllentownContent, 'intro' | 'metrics' | 'media'>> {
  blockType?: string
  intro?: { accentHeading?: string | null; heading?: string | null; description?: unknown } | null
  metrics?: Array<{ label?: string | null; value?: { text?: string | null; icon?: string | null } | null }> | null
  media?: (DraftFields<Media> & { id?: PayloadID }) | PayloadID | null
}
