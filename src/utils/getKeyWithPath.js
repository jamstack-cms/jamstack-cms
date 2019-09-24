import getImageKey from './getImageKey'

/* gets image with public/images path */
export default function getKeyWithPath(url) {
  const key = getImageKey(url)
  const keyWithPath = `images/${key}`
  return keyWithPath
}