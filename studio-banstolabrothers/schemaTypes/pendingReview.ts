import {defineField, defineType} from 'sanity'

// Schema for collecting customer reviews (before approval)
export const pendingReview = defineType({
  name: 'pendingReview',
  title: 'Pending Reviews',
  type: 'document',
  fields: [
    // Automatically set via QR code
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
      readOnly: true,
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      readOnly: true,
      validation: (rule) => rule.required(),
    }),

    // Customer-provided fields
    defineField({
      name: 'username',
      title: 'Customer Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (rule) => rule.required().min(1).max(5),
    }),

    defineField({
      name: 'description',
      title: 'Review Message',
      type: 'text',
      validation: (rule) => rule.required(),
    }),

    // Optional: Customer can upload product images
    defineField({
      name: 'productReviewImages',
      title: 'Product Images (Optional)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
        },
      ],
    }),

    // Metadata
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Approved', value: 'approved'},
          {title: 'Rejected', value: 'rejected'},
        ],
      },
      initialValue: 'pending',
    }),

    defineField({
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
      description: 'Internal notes (not visible to customers)',
    }),

    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],

  preview: {
    select: {
      username: 'username',
      rating: 'rating',
      product: 'product.name',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({username, rating, product, status, date}) {
      const statusEmoji = {
        pending: '⏳',
        approved: '✅',
        rejected: '❌',
      }
      return {
        title: `${statusEmoji[status as keyof typeof statusEmoji] || ''} ${username} - ${product}`,
        subtitle: `${rating}/5 stars • ${new Date(date).toLocaleDateString()}`,
      }
    },
  },

  orderings: [
    {
      title: 'Submission Date, New',
      name: 'submittedAtDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
    {
      title: 'Status',
      name: 'status',
      by: [{field: 'status', direction: 'asc'}],
    },
  ],
})
