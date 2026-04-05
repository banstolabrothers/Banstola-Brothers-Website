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

export const portableTextContent = [
  {
    type: 'block',
    styles: [
      {title: 'H1', value: 'h1'},
      {title: 'H2', value: 'h2'},
      {title: 'H3', value: 'h3'},
      {title: 'H4', value: 'h4'},
      {title: 'H5', value: 'h5'},
      {title: 'Paragraph', value: 'normal'},
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
              validation: (rule: any) => rule.required(),
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
  {
    type: 'image',
    options: {hotspot: true},
    fields: [
      {
        name: 'alt',
        type: 'string',
        title: 'Alt text',
        description: 'Important for SEO and accessibility',
        validation: (rule: any) => rule.required(),
      },
      {
        name: 'caption',
        type: 'string',
        title: 'Caption',
        description: 'Optional caption displayed below the image',
      },
    ],
  },
  {
    type: 'object',
    name: 'youtube',
    title: 'YouTube Video',
    fields: [
      {name: 'url', type: 'url', title: 'YouTube Video URL'},
      {name: 'caption', type: 'string', title: 'Video Caption'},
    ],
  },
]
