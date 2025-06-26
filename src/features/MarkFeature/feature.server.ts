import { createServerFeature } from '@payloadcms/richtext-lexical'

export const MarkFeature = createServerFeature({
  key: 'mark',
  feature: {
    ClientFeature: './features/MarkFeature/feature.client#MarkFeatureClient',
  },
})
