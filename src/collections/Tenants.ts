import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    group: 'Multi-Tenancy',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'domain'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'domain', type: 'text', required: true },
  ],
}
