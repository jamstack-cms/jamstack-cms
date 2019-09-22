import getImageKey from './getImageKey'
import path from 'path'

function getRawPath(url, pathName = 'downloads') {
  let reqPath = path.join(__dirname, '../..')
  const key = getImageKey(url)
  const rawPath = `${reqPath}/public/${pathName}/${key}`
  return rawPath
}

export default getRawPath