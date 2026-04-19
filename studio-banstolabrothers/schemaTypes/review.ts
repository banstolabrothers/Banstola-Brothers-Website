import {defineField, defineType} from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Reviews',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
      validation: (rule) => rule.required(),
      description: 'The product that these reviews are for',
    }),

    defineField({
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      options: {
        sortable: true,
      },
      of: [
        {
          type: 'object',
          name: 'review',
          title: 'Review',
          fields: [
            defineField({
              name: 'username',
              title: 'Username',
              type: 'string',
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: 'rating',
              title: 'Rating',
              type: 'number',
              initialValue: 5, // 👈

              validation: (rule) =>
                rule
                  .required()
                  .min(1)
                  .max(5)
                  .integer()
                  .error('Rating must be between 1 and 5 stars'),
              options: {
                list: [
                  {title: '1 Star', value: 1},
                  {title: '2 Stars', value: 2},
                  {title: '3 Stars', value: 3},
                  {title: '4 Stars', value: 4},
                  {title: '5 Stars', value: 5},
                ],
              },
            }),

            defineField({
              name: 'reviewDate',
              title: 'Date of Review',
              type: 'date',
              initialValue: () => new Date().toISOString().split('T')[0], // 👈 "YYYY-MM-DD"
              options: {
                dateFormat: 'YYYY-MM-DD',
              },
            }),

            defineField({
              name: 'description',
              title: 'Review Description',
              type: 'text',
              rows: 4,
            }),

            defineField({
              name: 'reply',
              title: 'Your Reply',
              type: 'object',
              description: 'Your response to this review',
              fields: [
                defineField({
                  name: 'message',
                  title: 'Reply Message',
                  type: 'text',
                  rows: 4,
                  description: 'Your response to the customer review',
                }),
                defineField({
                  name: 'replyDate',
                  title: 'Reply Date',
                  type: 'datetime',
                  description: 'When you replied to this review',
                  options: {
                    dateFormat: 'YYYY-MM-DD',
                    timeFormat: 'HH:mm',
                  },
                }),
              ],
              options: {
                collapsible: true,
                collapsed: true,
              },
            }),

            defineField({
              name: 'productReviewImages',
              title: 'Product Review Images',
              type: 'array',
              description: 'Multiple images of the product posted by the reviewer',
              of: [
                {
                  type: 'image',
                  options: {hotspot: true},
                  fields: [
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Alt text',
                      description: 'Automatically generated alt text',
                      readOnly: true,
                    },
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption',
                      description: 'Optional caption for the product image',
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
              username: 'username',
              rating: 'rating',
              date: 'reviewDate',
              description: 'description',
            },
            prepare({username, date, description}) {
              return {
                title: `${username}`,
                subtitle: `${date} • ${description}`,
              }
            },
          },
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'product.title',
      media: 'product.primaryImage',
      reviews: 'reviews',
    },
    prepare({title, media, reviews}) {
      const totalReviews = reviews?.length || 0
      const averageRating =
        totalReviews > 0
          ? (
              reviews.reduce((sum: number, r: {rating: number}) => sum + (r.rating || 0), 0) /
              totalReviews
            ).toFixed(1)
          : null

      return {
        title: title || 'Untitled Product',
        subtitle: totalReviews ? `${totalReviews} reviews • ${averageRating}` : 'No reviews yet',
        media,
      }
    },
  },
})

export const reviewWithHooks = {
  ...review,
  hooks: {
    beforeCreate: (context: {document: any}) => {
      const {document} = context
      if (document.reviews) {
        document.reviews = document.reviews.map((review: any) => ({
          ...review,
          ...(review.reviewimage?.asset && {
            reviewimage: {
              ...review.reviewimage,
              alt: review.username
                ? `Review screenshot by ${review.username}`
                : 'Review screenshot',
            },
          }),
          ...(review.productReviewImages && {
            productReviewImages: review.productReviewImages.map((img: any) => ({
              ...img,
              alt: review.username
                ? `Product review image by ${review.username}`
                : 'Product review image',
            })),
          }),
        }))
      }
      return context
    },
    beforeUpdate: (context: {document: any}) => {
      const {document} = context
      if (document.reviews) {
        document.reviews = document.reviews.map((review: any) => ({
          ...review,
          ...(review.reviewimage?.asset && {
            reviewimage: {
              ...review.reviewimage,
              alt: review.username
                ? `Review screenshot by ${review.username}`
                : 'Review screenshot',
            },
          }),
          ...(review.productReviewImages && {
            productReviewImages: review.productReviewImages.map((img: any) => ({
              ...img,
              alt: review.username
                ? `Product review image by ${review.username}`
                : 'Product review image',
            })),
          }),
        }))
      }
      return context
    },
  },
}
