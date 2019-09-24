import config from '../../jamstack-config.js'
import getImageKey from './getImageKey'

const {
  aws_user_files_s3_bucket: bucket,
  aws_user_files_s3_bucket_region: region
} = config

/* gets image with full path path to location of image */
export default function getKeyWithFullPath(url) {
  const key = getImageKey(url)
  const fullUrl = `https://${bucket}.s3.${region}.amazonaws.com/public/images/${key}`
  return fullUrl
}