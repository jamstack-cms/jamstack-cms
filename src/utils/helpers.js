const toast = require('react-toastify').toast

function slugify(string) {
  const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
  const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

function generatePreviewLink(post, location) {
  const { id, title } = post
  const { origin } = location
  const link = `${origin}/previewpost/${id}/${slugify(title)}`
  return link
}

function copyToClipboard (text) {
  const textField = document.createElement('textarea');
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
  toast("Successfully copied to clipboard.")
}

function getTrimmedKey(key, length = 8) {
  return key.substr(0, length) + '...'
}

function getCleanedFileName (fileName) {
  const modifiedFileName = fileName.replace(/\s+/g, '-').toLowerCase();
  let fileNameArray = modifiedFileName.split('.')
  const extension = fileNameArray[fileNameArray.length - 1]
  delete fileNameArray[fileNameArray.length - 1]
  fileNameArray = fileNameArray.filter(r => r)
  const newFileName = `${fileNameArray.join('-')}.${extension}`
  return newFileName
}

function getImageSource(imageInfo) {
  const tmp = document.createElement('div')
  tmp.innerHTML = imageInfo
  const src = tmp.querySelector('img').getAttribute('src')
  return src
}

const helpers = {
  slugify,
  generatePreviewLink,
  copyToClipboard,
  getTrimmedKey,
  getCleanedFileName,
  getImageSource
}

module.exports = helpers