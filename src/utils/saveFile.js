import { Storage } from 'aws-amplify'
import config from '../../jamstack-config.js'
import uuid from 'uuid/v4'
import { getCleanedFileName } from './helpers'

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config

function saveFile(file) {
  return new Promise(async(resolve) => {
    const { name: fileName, type: mimeType } = file
    const cleanedFileName = getCleanedFileName(fileName)
    const key = `images/${uuid()}_${cleanedFileName}`
    try {
      const imageInfo = await Storage.put(key, file, {
        contentType: mimeType
      })
      const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${imageInfo.key}`
      resolve({ key: imageInfo.key, url }) 
    } catch (err) {
      console.log('error: ', err)
    }
  })
}

export default saveFile