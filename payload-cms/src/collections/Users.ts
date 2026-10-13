import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Redaktion', value: 'editor' },
        { label: 'Kunde (Portal)', value: 'customer' },
      ],
    },
    {
      name: 'managedPages',
      label: 'Freigegebene Seiten (Kundenportal)',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      admin: {
        description:
          'Nur für die Rolle "Kunde": welche Seiten darf dieser Kunde im Kundenportal per KI-Chat bearbeiten (als Entwurf, Veröffentlichung bleibt bei euch).',
        condition: (data) => data?.role === 'customer',
      },
    },
  ],
  timestamps: true,
}
