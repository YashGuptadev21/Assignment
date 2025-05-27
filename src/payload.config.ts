// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { Config } from './payload-types'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'

import { Users } from './collections/Users'
import { Tenants } from './collections/Tenants'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // multiTenantPlugin<Config>({
    //   collections: {
    //     users: {},
    //     // forms: { useTenantAccess: true },
    //     'form-submissions': { useTenantAccess: true },
    //     tenants: { useTenantAccess: false },
    //   },
    // }),
    formBuilderPlugin({
      fields: {
        text: true,
        email: true,
        textarea: true,
        message: true,
      },
      formOverrides: {
        slug: 'forms',
        admin: {
          group: 'Forms',
        },
        fields: ({ defaultFields }) => [
          ...defaultFields, // Keep all default fields...
          // {
          //   name: 'tenant',
          //   type: 'relationship', // Add a new field to relate each form to a tenant
          //   relationTo: 'tenants',
          //   required: true,
          // },
        ],
        access: {
          read: () => true,
        },
      },
      formSubmissionOverrides: {
        slug: 'form-submissions',
        admin: {
          group: 'Forms',
        },
        fields: ({ defaultFields }) => defaultFields,
        access: {
          read: () => true,
        },
      },
    }),
  ],
})
