import { buildConfig, type Access } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import sharp from 'sharp'
import { createHeroBlock } from '@kinekt-io/sections/payload'

const authenticated: Access = ({ req }) => Boolean(req.user)

// Supply a development secret and paths outside the repository when exercising this example.
export function createExampleConfig(options: { secret: string; databaseURI: string; uploadDir: string }) {
  return buildConfig({
    secret: options.secret,
    db: sqliteAdapter({ client: { url: options.databaseURI } }),
    sharp,
    localization: { locales: ['en', 'nl'], defaultLocale: 'en' },
    typescript: { autoGenerate: false },
    admin: { user: 'users' },
    collections: [
      { slug: 'users', auth: true, access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated }, fields: [] },
      {
        slug: 'media',
        access: { read: () => true, create: authenticated, update: authenticated, delete: authenticated },
        upload: { staticDir: options.uploadDir, mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'] },
        fields: [{ name: 'alt', type: 'text', required: true, localized: true }],
      },
      {
        slug: 'pages',
        access: {
          read: ({ req }) => req.user ? true : { _status: { equals: 'published' } },
          create: authenticated, update: authenticated, delete: authenticated,
        },
        versions: { drafts: true },
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'layout', type: 'blocks', blocks: [createHeroBlock()] },
        ],
      },
    ],
  })
}
