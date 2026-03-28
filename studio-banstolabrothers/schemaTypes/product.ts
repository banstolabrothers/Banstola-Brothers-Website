import {
  BoldIcon,
  ItalicIcon,
  CodeIcon,
  UnderlineIcon,
  StrikethroughIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

// Enhanced Product schema with nested variant configuration
export const product = defineType({
  name: 'product',
  title: 'Product',
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

    // Product title
    defineField({
      name: 'title',
      title: 'Product Title',
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
      description: 'Main product image that will be displayed prominently',
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

    // Additional Images section
    defineField({
      name: 'additionalImages',
      title: 'Additional Images',
      type: 'array',
      description: 'Upload multiple additional product images (gallery)',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description: 'Describe what is shown in this image',
              validation: (rule) => rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for this image',
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    }),

    // Nested Product Variants (Two-level structure)
    defineField({
      name: 'variantGroups',
      title: 'Variant Groups',
      type: 'array',
      description: 'Define variant groups (e.g., Weight, Color, Size) with their options',
      of: [
        {
          type: 'object',
          name: 'variantGroup',
          title: 'Variant Group',
          fields: [
            {
              name: 'groupName',
              title: 'Group Name',
              type: 'string',
              description: 'e.g., "Weight", "Color", "Size", "Material"',
              validation: (rule) => rule.required(),
            },
            {
              name: 'groupType',
              title: 'Selection Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Single Selection', value: 'single'},
                  {title: 'Multiple Selection', value: 'multiple'},
                ],
                layout: 'radio',
              },
              initialValue: 'single',
              description: 'How customers can select from this group',
            },
            {
              name: 'options',
              title: 'Variant Options',
              type: 'array',
              description: 'Add individual options for this variant group',
              of: [
                {
                  type: 'object',
                  name: 'variantOption',
                  title: 'Variant Option',
                  fields: [
                    {
                      name: 'optionName',
                      title: 'Option Name',
                      type: 'string',
                      description: 'e.g., "200g", "500g", "White", "Black", "Small", "Large"',
                      validation: (rule) => rule.required(),
                    },

                    {
                      name: 'price',
                      title: 'Price',
                      type: 'number',
                      // validation: (rule) => rule.required(),
                    },

                    {
                      name: 'currency',
                      title: 'Currency',
                      type: 'string',
                      initialValue: 'NPR',
                    },

                    {
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 2,
                      description: 'Brief description of this option',
                    },

                    {
                      name: 'optionImage',
                      title: 'Option Image',
                      type: 'image',
                      description: 'Image for this specific option',
                      options: {
                        hotspot: true,
                      },
                      fields: [
                        {
                          name: 'alt',
                          type: 'string',
                          title: 'Alt text',
                        },
                      ],
                    },
                    {
                      name: 'inStock',
                      title: 'In Stock',
                      type: 'boolean',
                      description: 'Is this option currently available?',
                      initialValue: true,
                    },
                  ],
                  preview: {
                    select: {
                      title: 'optionName',
                      subtitle: 'description',
                      media: 'optionImage',
                    },
                  },
                },
              ],
              validation: (rule) => rule.min(1).error('At least one option is required'),
            },
          ],
          preview: {
            select: {
              groupName: 'groupName',
              options: 'options',
            },
            prepare({groupName, options}) {
              const optionCount = options?.length || 0
              return {
                title: groupName,
                subtitle: `${optionCount} option${optionCount !== 1 ? 's' : ''}`,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.min(1).error('At least one variant group is required'),
    }),

    // Custom text editor for detailed content
    defineField({
      name: 'content',
      title: 'Product Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong', icon: BoldIcon},
              {title: 'Emphasis', value: 'em', icon: ItalicIcon},
              {title: 'Code', value: 'code', icon: CodeIcon},
              {title: 'Underline', value: 'underline', icon: UnderlineIcon},
              {title: 'Strike', value: 'strike-through', icon: StrikethroughIcon},
              {title: 'Left align', value: 'align-left', icon: ArrowLeftIcon},
              {title: 'Center align', value: 'align-center', icon: ArrowUpIcon},
              {title: 'Right align', value: 'align-right', icon: ArrowRightIcon},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (rule) => rule.required(),
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        // Allow images in content
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description: 'Important for SEO and accessibility',
              validation: (rule) => rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption displayed below the image',
            },
          ],
        },
        // YouTube Video Embed
        {
          type: 'object',
          name: 'youtube',
          title: 'YouTube Video',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'YouTube Video URL',
              description:
                'Paste the full YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Video Caption',
              description: 'Optional caption for the video',
            },
          ],
        },
      ],
    }),

    // Brand
    defineField({
      name: 'brand',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'Banstola Brothers',
    }),

    // SKU
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),

    // SEO fields (optional)
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      description: 'SEO meta description',
      validation: (rule) => rule.max(160),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'primaryImage',
    },
    prepare({title, media}) {
      return {
        title: title,
        media,
      }
    },
  },
})
