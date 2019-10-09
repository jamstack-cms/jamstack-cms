import webhookUrl from '../../../webhook-config.js'

export default async function amplifyDeploy() {
  return new Promise(async (resolve, reject) => {
    if (!webhookUrl) {
      console.log('please configure youre webhook url by running jamstack configure webhook')
      return
    }
    try {
      await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors'
        })
      resolve()
    } catch (err) {
      console.log('error: ', err)
      reject(err)
    }
  })
}