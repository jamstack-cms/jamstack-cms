const fs = require('fs')

/*
* This function will prompt the user for a webhook URL and write to webhook-config.js
*/

function configureWebhook() {
  var webhookURL = process.stdin;
  webhookURL.setEncoding('utf-8');
  console.log("Please enter your webhook url:");
  webhookURL.on('data', function (data) {
      if((!data.trim()) || data === 'exit\n'){
          process.exit();
      } else {
        let webhookConfig = `const webhookUrl = "${data.trim()}"\nmodule.exports = webhookUrl`
        webhookConfig = JSON.parse(JSON.stringify(webhookConfig))
        fs.writeFile('webhook-config.js', webhookConfig, 'utf8', function(err) {
          if (err) {
            throw err
          }
          console.log('Successfully configured webhook!')
          process.exit();
        })
      }
  });
}

configureWebhook()