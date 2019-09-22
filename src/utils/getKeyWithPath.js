import getImageKey from './getImageKey'

export default function getKeyWithPath(url) {
  const key = getImageKey(url)
  const keyWithPath = `images/${key}`
  return keyWithPath
}