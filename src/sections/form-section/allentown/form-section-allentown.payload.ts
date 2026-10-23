import type { Block, CollectionSlug } from 'payload'
import { richTextToHtml } from '../../../shared/rich-text.js'
import {
  mediaToProps,
  optionalText,
  requireObject,
  requireText,
  requireTheme,
  type PayloadAdapterOptions,
} from '../../../shared/payload.js'
import {
  contactMethodFields,
  hasText,
  isActionableHref,
  requiredTextMessage,
  sectionIntroFields,
} from '../../../shared/payload-fields.js'
import type {
  BetaFormSectionAllentownContent,
  ContactMethod,
  PayloadBetaFormSectionAllentownDocument,
} from './form-section-allentown.contract.js'


export interface CreateBetaFormSectionAllentownBlockOptions {
  mediaCollection?: CollectionSlug
}

export function createBetaFormSectionAllentownBlock({
  mediaCollection = 'media',
}: CreateBetaFormSectionAllentownBlockOptions = {}): Block {
  return {
    slug: 'beta-form-section-allentown',
    interfaceName: 'BetaFormSectionAllentown',
    labels: {
      singular: 'PRERELEASE — Form Section Allentown',
      plural: 'PRERELEASE — Form Section Allentown blocks',
    },
    fields: [
      {
        name: 'theme',
        type: 'select',
        label: 'Theme',
        localized: true,
        required: true,
        defaultValue: 'semi-dark',
        options: ['light', 'semi-light', 'semi-dark', 'dark'].map((value) => ({ label: value, value })),
      },
      {
        name: 'intro',
        type: 'group',
        label: 'Intro block',
        localized: true,
        required: true,
        fields: sectionIntroFields(),
      },
      {
        name: 'image',
        type: 'upload',
        label: 'Image',
        relationTo: mediaCollection,
        localized: true,
      },
      {
        name: 'imagePosition',
        type: 'select',
        label: 'Image position',
        localized: true,
        required: true,
        defaultValue: 'left',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
        ],
        admin: {
          description: 'Desktop only. Mobile always presents the content before the image.',
        },
      },
      {
        name: 'form',
        type: 'textarea',
        label: 'HubSpot embed code',
        localized: true,
        required: true,
        validate: (value: unknown) => hasText(value) || requiredTextMessage,
        admin: {
          rows: 8,
          description: 'Paste the HubSpot form embed code. The component preview keeps using a non-submitting placeholder form.',
        },
      },
      {
        name: 'contactHeading',
        type: 'text',
        label: 'Contact heading',
        localized: true,
      },
      {
        name: 'contactMethods',
        type: 'array',
        label: 'Contact methods',
        localized: true,
        minRows: 1,
        fields: contactMethodFields(),
      },
    ],
  }
}

export function betaFormSectionAllentownToProps(
  data: PayloadBetaFormSectionAllentownDocument,
  options: PayloadAdapterOptions = {},
): BetaFormSectionAllentownContent {
  const intro = requireObject(data.intro, 'intro')
  const imagePosition = data.imagePosition

  if (imagePosition !== 'left' && imagePosition !== 'right') {
    throw new Error('imagePosition must be left or right.')
  }

  const contactMethods = contactMethodsToProps(data.contactMethods)

  return {
    theme: requireTheme(data.theme),
    intro: {
      accentHeading: optionalText(intro.accentHeading, 'intro.accentHeading'),
      heading: requireText(intro.heading, 'intro.heading'),
      ...(intro.description ? { description: { html: richTextToHtml(intro.description, 'intro.description') } } : {}),
    },
    ...(data.image ? { image: mediaToProps(data.image, 'image', options) } : {}),
    imagePosition,
    form: requireText(data.form, 'form'),
    ...(optionalText(data.contactHeading, 'contactHeading') ? { contactHeading: optionalText(data.contactHeading, 'contactHeading') } : {}),
    ...(contactMethods ? { contactMethods } : {}),
  }
}


function contactMethodsToProps(value: unknown): ContactMethod[] | undefined {
  if (value === undefined || value === null) return undefined
  if (!Array.isArray(value)) throw new Error('contactMethods must be a list.')

  const methods = value.map((entry, index) => {
    const method = requireObject(entry, `contactMethods[${index}]`)
    const icon = method.icon
    if (icon !== 'whatsapp' && icon !== 'phone' && icon !== 'email') {
      throw new Error(`contactMethods[${index}].icon must be whatsapp, phone, or email.`)
    }

    const href = requireText(method.href, `contactMethods[${index}].href`)
    if (!isActionableHref(href)) throw new Error(`contactMethods[${index}].href is not an actionable link.`)

    return {
      icon: icon as ContactMethod['icon'],
      label: requireText(method.label, `contactMethods[${index}].label`),
      href,
    }
  })

  return methods.length ? methods : undefined
}

