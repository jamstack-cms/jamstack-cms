const fs = require('fs')
const stripJsonComments = require('strip-json-comments')
const config = './src/aws-exports.js'

function createbaseConfig() {
  fs.readFile(config, 'utf8', function (err, data) {
    if (err) {
      throw err
    }
    const stripped = stripJsonComments(data)
    var content = JSON.stringify(stripped)
    const items = content.split(',')
    const withoutAPIKey = items.filter(item => {
      return !(item.includes('aws_appsync_apiKey'))
    })
    let newJson = withoutAPIKey.join(',')
    newJson = JSON.parse(newJson)
    fs.writeFile('jamstack-config.js', newJson, 'utf8', function(err, success) {
      if (err) {
        throw err
      }
      console.log('JAMstack config successfully created!')
    })
  })
}

createbaseConfig()