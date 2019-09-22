import getRawPath from './getRawPath'
import fs from 'fs'
import axios from 'axios'

async function downloadImage (url) {
  return new Promise(async (resolve, reject) => {
    const path = getRawPath(url)
    const writer = fs.createWriteStream(path)
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })
    response.data.pipe(writer)
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

export default downloadImage