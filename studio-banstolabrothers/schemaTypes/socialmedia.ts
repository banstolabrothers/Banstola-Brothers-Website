import {defineField, defineType} from 'sanity'

export const socialmedia = defineType({
  name: 'socialmedia',
  title: 'Social Media',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Social media images',
      validation: (rule) => rule.required().min(1),
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description: 'Alt text for the image',
            },

            {
              name: 'link',
              type: 'url',
              title: 'Post Link',
              description: 'Link to the original social media post',
              validation: (rule) =>
                rule.uri({
                  scheme: ['http', 'https'],
                }),
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    }),
  ],

  preview: {
    select: {
      title: 'title',
      images: 'images',
      image: 'images.0',
    },
    prepare({title, images, image}) {
      const imageCount = images?.length || 0

      return {
        title: title || 'Untitled Social Media',
        subtitle: `${imageCount} image${imageCount !== 1 ? 's' : ''}`,
        media: image,
      }
    },
  },
})
