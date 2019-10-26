const sharp = require('sharp')
const aws = require('aws-sdk')
const s3 = new aws.S3()

exports.handler = async function (event, context) { //eslint-disable-line
  console.log('event: ', event)
  if (event.Records[0].eventName === 'ObjectRemoved:Delete') return
  const BUCKET = event.Records[0].s3.bucket.name
  const KEY = event.Records[0].s3.object.key
  const PARTS = KEY.split('/')
  let FILE = PARTS[PARTS.length - 1]
  try {
    let image = await s3.getObject({ Bucket: BUCKET, Key: KEY }).promise()
    image = await sharp(image.Body)

    const metadata = await image.metadata()
    if (metadata.width > 1000) {
      const resizedImage = await image.resize({ width: 1000 }).toBuffer()
      await s3.putObject({ Bucket: BUCKET, Body: resizedImage, Key: `public/images/${FILE}` }).promise()
      return
    } else {
      return
    }
  }
  catch(err) {
    context.fail(`Error getting files: ${err}`);
  }
};
