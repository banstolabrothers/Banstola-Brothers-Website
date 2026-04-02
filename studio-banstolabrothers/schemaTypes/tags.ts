import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const tags = defineType({
  name: 'tags',
  title: 'Tags',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Tag Name',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(50),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 50,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Short description of what this tag represents',
      validation: (rule) => rule.max(120),
    }),

    defineField({
      name: 'color',
      title: 'Tag Color',
      type: 'string',
      description: 'Hex color code for the tag badge (e.g. #3B82F6)',
      validation: (rule) =>
        rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
          name: 'hex color',
          invert: false,
        }),
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
    },
  },
})
