import {defineField, defineType} from 'sanity'

// ─────────────────────────────────────────────────────────────────────────────
// FILE: schemaTypes/pageMeta.ts
// One document per static page (home, products, story, ...). Content editors
// pick which page a document is for, then fill in the shared seo{} object
// imported from ./seo.ts. This lets you update titles/descriptions/keywords
// for these pages from Studio without touching or redeploying code.
// ─────────────────────────────────────────────────────────────────────────────

// Mirrors the keys of `pageMeta` in lib/metadata.ts. Add a new entry here
// whenever you add a new static page, then create its document in Studio.
const STATIC_PAGES = [
  {title: 'Home', value: 'home'},
  {title: 'All Products', value: 'products'},
  {title: 'Our Story', value: 'story'},
  {title: 'Find Our Store', value: 'store'},
  {title: 'Customer Reviews (All Reviews)', value: 'allReviews'},
  {title: 'Write a Review', value: 'submitReview'},
  {title: 'Blog Listing', value: 'blogs'},
  {title: 'FAQs', value: 'faqs'},
  {title: 'Privacy Policy', value: 'privacyPolicy'},
  {title: 'Terms & Conditions', value: 'termsAndConditions'},
  {title: 'Shipping Policy', value: 'shippingPolicy'},
  {title: 'Cookies Policy', value: 'cookiesPolicy'},
] as const

export const pageMeta = defineType({
  name: 'pageMeta',
  title: 'Page SEO',
  type: 'document',
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      options: {list: [...STATIC_PAGES], layout: 'dropdown'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo', // comes from schemaTypes/seo.ts — must be registered too
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {page: 'page', title: 'seo.metaTitle'},
    prepare({page, title}) {
      const label = STATIC_PAGES.find((p) => p.value === page)?.title ?? page
      return {title: label, subtitle: title || 'No meta title set'}
    },
  },
})
