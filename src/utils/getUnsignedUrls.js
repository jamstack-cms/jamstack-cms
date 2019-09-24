import urlRegex from 'url-regex'
import config from '../../jamstack-config.js'

const {
  aws_user_files_s3_bucket: bucket,
  aws_user_files_s3_bucket_region: region
} = config

async function getUnsignedUrls(content) {
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
        const basicUrl = `https://${bucket}.s3.${region}.amazonaws.com/public/${keyWithPath}`
        images.push(basicUrl)
      }
    })
  }
  if (!images.length) return content
  let urlIndex = 0
  let updatedContent = content.replace(urlRegex({strict: false}), (url) => {
    if(url.includes(bucket)) {
      let newUrl = images[urlIndex]
      urlIndex = urlIndex++
      return `${newUrl})` 
    } else {
      return url
    }
  })
  return updatedContent
}

export default getUnsignedUrls