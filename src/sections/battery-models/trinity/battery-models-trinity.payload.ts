import type { Block, CollectionSlug, Field } from 'payload'
import { ctaFields, sectionIntroFields } from '../../../shared/payload-fields.js'
import { ctaToProps, ctaGroupToProps, mediaToProps, optionalCtaToProps, optionalText, requireArray, requireObject, requireText, requireTheme, type PayloadAdapterOptions } from '../../../shared/payload.js'
import { richTextToHtml } from '../../../shared/rich-text.js'
import type { BatteryModelsTrinityContent, BatteryRatingTrinity, PayloadBatteryModelsTrinityDocument } from './battery-models-trinity.types.js'

export interface CreateBatteryModelsTrinityBlockOptions {
  mediaCollection?: CollectionSlug
  targetCollections?: CollectionSlug[]
}

const scoreOptions = ['1', '2', '3', '4', '5'] as const

function ctaGroupFields(targetCollections: CollectionSlug[]): Field[] {
  return [
    {
      name: 'ctaGroup',
      type: 'array',
      localized: true,
      minRows: 0,
      maxRows: 2,
      admin: {
        initCollapsed: true,
        description: 'Add zero, one or two actions. Set each action to Primary, Secondary or Clear.',
      },
      fields: [
        {
          name: 'style',
          type: 'select',
          required: true,
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Clear', value: 'clear' },
          ],
        },
        ...ctaFields(targetCollections),
      ],
    },
  ]
}

export function createBatteryModelsTrinityBlock({ mediaCollection = 'media', targetCollections = ['pages'] }: CreateBatteryModelsTrinityBlockOptions = {}): Block {
  return {
    slug: 'beta-battery-models-trinity',
    interfaceName: 'BatteryModelsTrinity',
    labels: {
      singular: 'PRERELEASE — Battery Models Trinity',
      plural: 'PRERELEASE — Battery Models Trinity blocks',
    },
    fields: [
      {
        name: 'theme',
        type: 'select',
        localized: true,
        required: true,
        defaultValue: 'light',
        options: ['light', 'semi-light', 'semi-dark', 'dark'].map((value) => ({ label: value, value })),
      },
      {
        name: 'intro',
        type: 'group',
        localized: true,
        fields: sectionIntroFields(),
      },
      {
        name: 'catalogueCta',
        type: 'group',
        localized: true,
        admin: { description: 'Optional action aligned with the section heading.' },
        fields: ctaFields(targetCollections),
      },
      {
        name: 'models',
        type: 'array',
        localized: true,
        required: true,
        minRows: 1,
        admin: { initCollapsed: true },
        fields: [
          { name: 'image', type: 'upload', relationTo: mediaCollection, localized: true, required: true },
          { name: 'title', type: 'text', localized: true, required: true },
          { name: 'bestForIcon', type: 'text', localized: true, admin: { description: 'Optional Font Awesome Free icon key, for example bolt or boxes-stacked.' } },
          { name: 'bestForText', type: 'text', localized: true },
          { name: 'description', type: 'richText', localized: true, required: true },
          {
            name: 'ratings',
            type: 'array',
            localized: true,
            required: true,
            minRows: 1,
            admin: { initCollapsed: true, description: 'Add each product characteristic and its one-to-five score.' },
            fields: [
              { name: 'label', type: 'text', localized: true, required: true, admin: { width: '50%' } },
              { name: 'score', type: 'select', localized: true, required: true, admin: { width: '50%' }, options: scoreOptions.map((value) => ({ label: `${value} / 5`, value })) },
            ],
          },
          {
            name: 'webshopCta',
            type: 'group',
            localized: true,
            required: true,
            admin: { description: 'Required webshop action.' },
            fields: ctaFields(targetCollections, true),
          },
          {
            name: 'specificationCta',
            type: 'group',
            localized: true,
            admin: { description: 'Optional specification download or detail action.' },
            fields: ctaFields(targetCollections),
          },
        ],
      },
      {
        name: 'callout',
        type: 'group',
        localized: true,
        admin: { description: 'Optional contact callout after the model list.' },
        fields: [
          { name: 'intro', type: 'group', localized: true, fields: sectionIntroFields() },
          ...ctaGroupFields(targetCollections),
        ],
      },
    ],
  }
}

function introToProps(value: unknown, field: string) {
  const intro = requireObject(value, field)
  return {
    heading: requireText(intro.heading, `${field}.heading`),
    ...(optionalText(intro.accentHeading, `${field}.accentHeading`) ? { accentHeading: optionalText(intro.accentHeading, `${field}.accentHeading`) } : {}),
    ...(intro.description ? { description: { html: richTextToHtml(intro.description, `${field}.description`) } } : {}),
  }
}

function ratingToProps(value: unknown, field: string): BatteryRatingTrinity {
  const rating = requireObject(value, field)
  const rawScore = requireText(rating.score, `${field}.score`)
  if (!scoreOptions.includes(rawScore as typeof scoreOptions[number])) throw new Error(`${field}.score must be one of ${scoreOptions.join(', ')}.`)
  return { label: requireText(rating.label, `${field}.label`), score: Number(rawScore) as BatteryRatingTrinity['score'] }
}

export function batteryModelsTrinityToProps(data: PayloadBatteryModelsTrinityDocument, options: PayloadAdapterOptions = {}): BatteryModelsTrinityContent {
  const block = requireObject(data, 'batteryModelsTrinity')
  const callout = block.callout === undefined || block.callout === null ? undefined : requireObject(block.callout, 'callout')
  const calloutIntro = callout?.intro === undefined || callout?.intro === null ? undefined : requireObject(callout.intro, 'callout.intro')
  const calloutHeading = calloutIntro ? optionalText(calloutIntro.heading, 'callout.intro.heading') : undefined

  return {
    theme: requireTheme(block.theme),
    intro: introToProps(block.intro, 'intro'),
    ...(optionalCtaToProps(block.catalogueCta, 'catalogueCta', options) ? { catalogueCta: optionalCtaToProps(block.catalogueCta, 'catalogueCta', options) } : {}),
    models: requireArray(block.models, 'models').map((item, index) => {
      const model = requireObject(item, `models[${index}]`)
      const specificationCta = optionalCtaToProps(model.specificationCta, `models[${index}].specificationCta`, options)
      return {
        image: mediaToProps(model.image, `models[${index}].image`, options),
        title: requireText(model.title, `models[${index}].title`),
        ...(optionalText(model.bestForIcon, `models[${index}].bestForIcon`) ? { bestForIcon: optionalText(model.bestForIcon, `models[${index}].bestForIcon`) } : {}),
        ...(optionalText(model.bestForText, `models[${index}].bestForText`) ? { bestForText: optionalText(model.bestForText, `models[${index}].bestForText`) } : {}),
        description: { html: richTextToHtml(model.description, `models[${index}].description`) },
        ratings: requireArray(model.ratings, `models[${index}].ratings`).map((rating, ratingIndex) => ratingToProps(rating, `models[${index}].ratings[${ratingIndex}]`)),
        webshopCta: ctaToProps(model.webshopCta, `models[${index}].webshopCta`, options),
        ...(specificationCta ? { specificationCta } : {}),
      }
    }),
    ...(calloutHeading && calloutIntro ? {
      callout: {
        intro: introToProps(calloutIntro, 'callout.intro'),
        ...(ctaGroupToProps(callout?.ctaGroup, 'callout.ctaGroup', options) ? { ctaGroup: ctaGroupToProps(callout?.ctaGroup, 'callout.ctaGroup', options) } : {}),
      },
    } : {}),
  }
}
