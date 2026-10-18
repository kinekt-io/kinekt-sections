import type { CtaGroup, Media, SectionIntro } from '../../../shared/content.js'
import type { BetaTheme } from '../../../shared/payload.js'
export interface ReadMoreContent { theme: BetaTheme; intro: SectionIntro; ctas: CtaGroup; media: Media }
type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }; type PayloadID = string | number
export interface PayloadReadMoreDocument extends DraftFields<Omit<ReadMoreContent, 'intro' | 'ctas' | 'media'>> { blockType?: string; intro?: { accentHeading?: string | null; heading?: string | null; description?: unknown } | null; ctas?: unknown; media?: (DraftFields<Media> & { id?: PayloadID }) | PayloadID | null }
