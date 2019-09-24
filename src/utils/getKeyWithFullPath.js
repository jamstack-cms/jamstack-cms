import config from '../aws-exports'
import getImageKey from './getImageKey'

const {
  aws_user_files_s3_bucket: bucket,
  aws_user_files_s3_bucket_region: region
} = config

export default function getKeyWithFullPath(url) {
  const key = getImageKey(url)
  console.log('key:', key)
  const fullUrl = `https://${bucket}.s3.${region}.amazonaws.com/public/images/${key}`
  return fullUrl
}