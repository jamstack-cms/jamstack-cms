const toast = require('react-toastify').toast

function slugify(string) {
  const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
  const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
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

const helpers = {
  slugify,
  generatePreviewLink,
  copyToClipboard,
  getTrimmedKey
}

module.exports = helpers