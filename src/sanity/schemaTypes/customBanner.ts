import {getExtension, getImageDimensions} from '@sanity/asset-utils'
import { defineType } from 'sanity'

// export default {
export const customBanner = defineType({
  name: 'customBanner',
  title: 'Banner',
  type: 'object',
  fields: [
    {
      title: 'Banner type',
      name: 'bannerType',
      type: 'string',
      options: {
        list: ['image', 'video', 'none'],
        layout: 'radio',
        direction: 'horizontal',
      },
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image',
      description:
        'Image must be at least 800x600 pixels(4:3 ratio) and must be a JPG or PNG. Use "Crop Image" to generate thumbnail Image',
      options: {
        hotspot: true, // <-- Defaults to false
      },
      validation: (rule:any) => [
        // rule.required(),
        rule.custom((value:any, custom:any) => {
          if (custom?.parent?.bannerType === 'image') {
            if (!value) {
              return 'Image required'
            }
            const filetype = getExtension(value.asset._ref)

            if (filetype !== 'jpg' && filetype !== 'png') {
              return 'Image must be a JPG or PNG'
            }
            const {width, height} = getImageDimensions(value.asset._ref)
            if (width < 800 || height < 600) {
              return 'Image must be at least 800x600 pixels(4:3 ratio)'
            }
            return true
          } else {
            return true
          }
        }),
      ],
      hidden: ({parent}:any) => parent && parent?.bannerType !== 'image',
    },
    {
      title: 'Video',
      description: 'Please input Video URL',
      name: 'video',
      type: 'url',
      // validation: (rule) => [
      //   rule.custom((value, custom) => {
      //     if (custom?.parent?.bannerType === 'video' && !value) {
      //       return 'Video URL required'
      //     }
      //     return true
      //   }),
      // ],
      validation: (Rule:any) =>
        Rule.custom((value:any, custom:any) => {
          const videoUrlPattern =
            /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/

          if (custom?.parent?.bannerType === 'video') {
            if (!value) return 'Video URL required.'
            if (!videoUrlPattern.test(value)) {
              return 'Invalid video URL. Please provide a valid URL'
            }
          }
          return true
        }),
      hidden: ({parent}:any) => parent && parent?.bannerType !== 'video',
    },
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
      validation: (Rule:any) => [
        Rule.min(10).error('A caption of min. 10 characters is required'),
        Rule.max(60).error('Shorter caption are usually better. Max 60 Characters allowed.'),
      ],
      hidden: ({parent}:any) => parent?.bannerType != 'image' && parent?.bannerType !== 'video',
    },
  ],
})
