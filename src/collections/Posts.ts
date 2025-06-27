import { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        components: {
          afterInput: {
            path: '@/app/(payload)/admin/components/LiveHTMLPreview',
            clientProps: {},
          },
        },
      },
    },
  ],
  access: {
    admin: () => true,
  },
}
