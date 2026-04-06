import {defineField, defineType} from 'sanity'
import {portableTextContent} from './portableTextContent'

export const faqs = defineType({
  name: 'faqs',
  title: 'FAQs',
  type: 'document',
  fields: [
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'reference',
      to: [{type: 'faqTopic'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: portableTextContent,
      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'question',
      subtitle: 'topic.title',
    },
  },
})
