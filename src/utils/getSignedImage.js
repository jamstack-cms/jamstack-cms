import { Storage } from 'aws-amplify'
import getKeyWithPath from './getKeyWithPath'

// get a single signed image from S3 using a regular S3 URL
export default function getSignedImage(url) {
  return new Promise(async (resolve, reject) => {
    const key = getKeyWithPath(url)
    try {
     const signedImage = await Storage.get(key)
     resolve(signedImage)
    } catch (err) {
      console.log('error getting image...: ', err)
      reject(err)
    }
  })
}