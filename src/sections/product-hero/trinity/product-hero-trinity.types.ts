import type { CtaGroup } from '../../../shared/content.js'
import type { BatteryModelsTrinityContent } from '../../battery-models/trinity/battery-models-trinity.types.js'

export interface ProductHeroTrinityContent extends Omit<BatteryModelsTrinityContent, 'callout'> {
  featuredLabel?: string
  ctaGroup?: CtaGroup
}

export type PayloadProductHeroTrinityDocument = Record<string, unknown> & { id?: string }
