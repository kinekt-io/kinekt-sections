import type { Block, Field } from 'payload'
import { ctaFields, ctaStyleField } from '../../../shared/payload-fields.js'
import { ctaGroupToProps, optionalText, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { batteryModelsTrinityToProps, createBatteryModelsTrinityBlock, type CreateBatteryModelsTrinityBlockOptions } from '../../battery-models/trinity/battery-models-trinity.payload.js'
import type { PayloadProductHeroTrinityDocument, ProductHeroTrinityContent } from './product-hero-trinity.types.js'

export type CreateProductHeroTrinityBlockOptions = CreateBatteryModelsTrinityBlockOptions

export function createProductHeroTrinityBlock(options: CreateProductHeroTrinityBlockOptions = {}): Block {
  const base = createBatteryModelsTrinityBlock(options)
  return {
    ...base,
    slug: 'beta-product-hero-trinity',
    interfaceName: 'ProductHeroTrinity',
    labels: {
      singular: 'PRERELEASE — Product Hero Trinity',
      plural: 'PRERELEASE — Product Hero Trinity blocks',
    },
    fields: base.fields.flatMap((field): Field[] => {
      if ('name' in field && field.name === 'callout') {
        return [{
          name: 'ctaGroup',
          label: 'CTA group',
          type: 'array',
          localized: true,
          minRows: 0,
          maxRows: 2,
          admin: { initCollapsed: true, description: 'Optional actions below the model list. Add up to two buttons.' },
          fields: [ctaStyleField(), ...ctaFields(options.targetCollections ?? ['pages'])],
        }]
      }
      if (field.type === 'select' && field.name === 'theme') return [{ ...field, defaultValue: 'dark' }]
      if ('name' in field && field.name === 'models') {
        return [{
          name: 'featuredLabel',
          label: 'Featured label',
          type: 'text',
          localized: true,
          admin: { description: 'Leave blank to hide the label and flightpath above the model list.' },
        }, field]
      }
      return [field]
    }),
  }
}

export function productHeroTrinityToProps(data: PayloadProductHeroTrinityDocument, options: PayloadAdapterOptions = {}): ProductHeroTrinityContent {
  // Keep the shared model/media/rating/link contract identical, without accepting a callout.
  const { callout: _callout, ...content } = batteryModelsTrinityToProps({ ...data, callout: undefined }, options)
  const featuredLabel = optionalText(data.featuredLabel, 'featuredLabel')
  const ctaGroup = ctaGroupToProps(data.ctaGroup, 'ctaGroup', options)
  return {
    ...content,
    ...(featuredLabel ? { featuredLabel } : {}),
    ...(ctaGroup ? { ctaGroup } : {}),
  }
}
