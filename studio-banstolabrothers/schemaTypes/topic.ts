import {defineField, defineType} from 'sanity'

export const faqTopic = defineType({
  name: 'faqTopic',
  title: 'FAQ Topic',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Topic',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {title: 'title'},
  },
})
