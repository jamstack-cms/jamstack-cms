import getImageKey from './getImageKey'
import path from 'path'

function getRawPath(url, pathName = 'downloads') {
  let reqPath = path.join(__dirname, '../..')
  let key = getImageKey(url)
  key = key.replace(/%/g, "")
  const rawPath = `${reqPath}/public/${pathName}/${key}`
  return rawPath
}

export default getRawPath