import urlRegex from 'url-regex'
import config from '../../jamstack-config.js'
import { Storage } from 'aws-amplify'

const {
  aws_user_files_s3_bucket: bucket
} = config

async function getSignedUrls(content) {
  const images = []
  const contentUrls = content.match(urlRegex());
  if (contentUrls) {
    contentUrls.forEach(url => {
      if(url.includes(bucket)) {
        const split = url.split('/')
        const key = split[split.length - 1]
        const keyItems = key.split('?')
        const primary = keyItems[0]
  
        const cleanedKey = primary.replace(/[{()}]/g, '');
        const keyWithPath = `images/${cleanedKey}`
        const image = Storage.get(keyWithPath)
        images.push(image)
      }
    })
  }
  if (!images.length) return content
  const signedUrls = await Promise.all(images)
  let urlIndex = 0
  let updatedContent = content.replace(urlRegex({strict: false}), (url) => {
    if(url.includes(bucket)) {
      let signedUrl = signedUrls[urlIndex]
      urlIndex = urlIndex++
      return `${signedUrl})` 
    } else {
      return url
    }
  })
  return updatedContent
}

export default getSignedUrls
