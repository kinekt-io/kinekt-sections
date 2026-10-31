import type { SectionContentWidth } from '../../../shared/section-width.js'
import type { CtaGroup, Media, SectionIntro } from '../../../shared/content.js'
import type { BetaTheme } from '../../../shared/payload.js'
export interface ReadMoreContent { contentWidth?: SectionContentWidth; theme: BetaTheme; intro: SectionIntro; label?: { text: string; icon?: string }; ctas: CtaGroup; media: Media }
type DraftFields<T> = { [Field in keyof T]?: T[Field] | null }; type PayloadID = string | number
export interface PayloadReadMoreDocument extends DraftFields<Omit<ReadMoreContent, 'intro' | 'label' | 'ctas' | 'media'>> { blockType?: string; intro?: { accentHeading?: string | null; heading?: string | null; description?: unknown } | null; label?: { text?: string | null; icon?: string | null } | null; ctas?: unknown; media?: (DraftFields<Media> & { id?: PayloadID }) | PayloadID | null }
