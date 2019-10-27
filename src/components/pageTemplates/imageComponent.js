import React, { useEffect } from 'react'
import ProgressiveImage from 'react-progressive-image'
import placeholder from '../../images/placeholder.jpg'
import Input from '../input'
import { css } from '@emotion/core'

function getFileSource(imageInfo) {
  const tmp = document.createElement('div')
  tmp.innerHTML = imageInfo
  const src = tmp.querySelector('img').getAttribute('src')
  return src
}

function ImageComponent({
  onClick, updateContent, currentView, content
}) {

  function setFile(event) {
    if (!event.target.files[0]) return
    const file = URL.createObjectURL(event.target.files[0])
    const imageHtml = `
      <img
        src="${file}" alt="page-image"
      />
    `
    updateContent(imageHtml)
  }

  console.log('content1: ', content)
  
  if (content) {
    content = getFileSource(content)
  }

  console.log('content2: ', content)

  return (
    <>
    <ProgressiveImage src={content} placeholder={placeholder}>
      {(src, loading) => {
        return (
          <img
            css={[imageStyle]}
            src={src} alt="page-image"
            onClick={onClick}
          />
        )
      }}
    </ProgressiveImage>
    {
      currentView === 'editing' && <Input placeholder="Set image" onChange={setFile} />
    }
    </>
  )
}

export default ImageComponent

const imageStyle = css`
  margin: 30px 10px;
  box-shadow: 0 30px 60px -10px rgba(0,0,0,0.22), 0 18px 36px -18px rgba(0,0,0,0.25);
`