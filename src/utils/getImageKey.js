/* Gets base key of image */
function getImageKey(url) {
  const split = url.split('/')
  const key = split[split.length - 1]
  const keyItems = key.split('?')
  const imageKey = keyItems[0]
  return imageKey
}

export default getImageKey