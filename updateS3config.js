const fs = require('fs')
const config = './amplify/backend/storage/jamstackcms/parameters.json'
const uuid = require('uuid/v4')

function configureBucket() {
  fs.readFile(config, 'utf8', function (err, data) {
    if (err) {
      throw err
    }
    const fileInfo = JSON.stringify(data)
    const id = uuid()
    const bucketName = `jamstack-cms-${id}`
    const updatedInfo = fileInfo.replace("jamstack-cms", bucketName)
    const newJson = JSON.parse(updatedInfo)

    fs.writeFile('./amplify/backend/storage/jamstackcms/parameters.json', newJson, 'utf8', function(err) {
      if (err) {
        throw err
      }
      console.log('Unique S3 bucket successfully configured. You\'re ready to store some images!')
    })
  })
}

configureBucket()