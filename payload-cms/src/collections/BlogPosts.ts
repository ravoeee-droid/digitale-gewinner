import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Blogbeitrag',
    plural: 'Blogbeiträge',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'topic', 'publishedAt', 'status'],
    group: 'Website-Inhalte',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true, index: true },
      ],
    },
    {
      name: 'topic',
      type: 'text',
      required: true,
      admin: {
        description: 'Der Ausgangsthemen-Titel aus der Themenrotation (für Duplikatsprüfung).',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'contentHtml',
      label: 'Inhalt (HTML)',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Serverseitig generiertes HTML. Nur von der Generierungs-Route oder manuell im Admin bearbeitet.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'published', required: true },
        { name: 'publishedAt', type: 'date', required: true },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', maxLength: 65 },
        { name: 'metaDescription', type: 'textarea', maxLength: 170 },
      ],
    },
  ],
}
