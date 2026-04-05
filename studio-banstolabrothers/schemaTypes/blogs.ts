import {defineField, defineType} from 'sanity'
import {portableTextContent} from './portableTextContent'

export const blogs = defineType({
  name: 'blogs',
  title: 'Blogs',
  type: 'document',
  fields: [
    // Category reference
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),

    // ✅ Tags (multi-select for filtering)
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tags'}]}],
      description: 'Add tags to help readers filter and discover related blogs',
    }),

    // Blog title
    defineField({
      name: 'title',
      title: 'Blog Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    // Slug for URL
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    // Published date
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0], // 👈 "YYYY-MM-DD"
      validation: (rule) => rule.required(),
    }),

    // Author
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    // Short description
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(200),
    }),

    // Primary image (featured/main image)
    defineField({
      name: 'primaryImage',
      title: 'Primary Image',
      type: 'image',
      description: 'Main blog image displayed prominently',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),

    // Blog content
    defineField({
      name: 'content',
      title: 'Blog Content',
      type: 'array',
      of: portableTextContent,
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Leave empty to auto-use blog title',
          validation: (rule) => rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Google snippet description (120–160 chars)',
          validation: (rule) => rule.max(160),
        },
        {
          name: 'ogImage',
          title: 'Social Share Image (OG Image)',
          type: 'image',
          description: 'Leave empty to auto-use Primary Image. (1200×630px recommended)',
          options: {hotspot: true},
        },
        {
          name: 'keywords',
          title: 'Focus Keywords',
          type: 'array',
          of: [{type: 'string'}],
          options: {layout: 'tags'},
        },
        {
          name: 'noIndex',
          title: 'Hide from Search Engines',
          type: 'boolean',
          initialValue: false,
          description: 'Turn ON only for draft or private pages',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'primaryImage',
      author: 'author',
    },
    prepare({title, media, author}) {
      return {
        title,
        subtitle: author ? `by ${author}` : '',
        media,
      }
    },
  },
})
