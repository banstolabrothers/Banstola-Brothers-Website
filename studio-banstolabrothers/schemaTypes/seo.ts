import {defineField, defineType} from 'sanity'

// ─────────────────────────────────────────────────────────────────────────────
// FILE: schemaTypes/seo.ts
// Reusable SEO object — same shape already used inside `product` and `blog`
// documents (see productMetaQuery / blogMetaQuery in lib/metadata.ts).
// Defining it once here means product, blog, and pageMeta (next file) all
// share one editing UI in Studio and one query shape in code.
// ─────────────────────────────────────────────────────────────────────────────
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description:
        "Overrides the page's default title. Leave blank to fall back to the page's own title/heading.",
      validation: (Rule) =>
        Rule.max(70).warning('Titles over ~70 characters get truncated in Google search results.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning(
          'Descriptions over ~160 characters get truncated in Google search results.',
        ),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description:
        "No effect on Google ranking, but harmless — a couple of smaller engines/directories still read it. Include both 'chhurpi' and 'churpi' spellings where relevant, per Search Console data.",
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines (noindex)',
      type: 'boolean',
      initialValue: false,
      description:
        "Turn on for pages you don't want ranking (privacy policy, terms, shipping policy, cookies policy).",
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description:
        'Used for Open Graph / Twitter cards. Falls back to the site default (/og-image.png) if left blank.',
    }),
  ],
})
