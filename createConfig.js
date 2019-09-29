const fs = require('fs')
const stripJsonComments = require('strip-json-comments')
const config = './src/aws-exports.js'

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
  items.forEach(item => {
    if (item.includes('aws_appsync_apiKey')) {
      let text = item.replace("\\n", "")
      text = text.replace(/(\\)/gm, "")
      const fileData = `const fileData = {
        ${text}
      }
      module.exports = fileData
      `

      fs.writeFile('jamstack-api-key.js', fileData, 'utf8', function(err) {
        if (err) {
          throw err
        }
        console.log('JAMstack API key config successfully created!')
      })
    }
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