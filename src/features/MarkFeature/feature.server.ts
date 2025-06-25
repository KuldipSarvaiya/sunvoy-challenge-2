import { createNode, createServerFeature } from '@payloadcms/richtext-lexical'
import { MarkNode } from './MarkNode'

export const MarkFeature = createServerFeature({
  key: 'mark',
  feature: {
    ClientFeature: './features/MarkFeature/feature.client#MarkFeatureClient',
    nodes: [
      createNode({
        node: MarkNode,
        converters: {
          html: {
            converter: (data) => {
              return `<mark>${data}</mark>`
            },
            nodeTypes: [MarkNode.getType()],
          },
        },
      }),
    ],
  },
})
