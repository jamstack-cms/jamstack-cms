const fs = require('fs')
const stripJsonComments = require('strip-json-comments')
const config = './src/aws-exports.js'

/*
* This function will take the base Amplify config, remove the API key reference, write the base
* config to jamstack-config.js, create a local reference to the API key for local development, 
* and write that configuration to jamstack-api-key.js
*/

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
  newJson = newJson.replace('export default awsmobile', 'module.exports = awsmobile')
  newJson = JSON.parse(newJson)
  fs.writeFile('jamstack-config.js', newJson, 'utf8', function(err, success) {
    if (err) {
      throw err
    }
    console.log('JAMstack config successfully created!')
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
})