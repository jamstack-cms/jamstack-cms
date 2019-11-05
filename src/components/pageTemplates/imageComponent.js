import React from 'react'
import ProgressiveImage from 'react-progressive-image'
import placeholder from '../../images/placeholder.jpg'
import Input from '../input'
import Button from '../button'
import { css } from '@emotion/core'
import { getImageSource } from '../../utils/helpers'

function ImageComponent({
  onClick, updateContent, currentView, content, deleteComponent, index
}) {
  function setFile(event) {
    if (!event.target.files[0]) return
    const file = URL.createObjectURL(event.target.files[0])
    const imageHtml = `
      <img
        src="${file}" alt="page"
      />
    `
    updateContent({
      src: event.target.files[0],
      imageHtml
    })
  }
  let imageSource = ''
  if (content.imageHtml) {
    imageSource = getImageSource(content.imageHtml)
  }
  return (
    <>
    <ProgressiveImage src={imageSource} placeholder={placeholder}>
      {(src, loading) => {
        return (
          <img
            css={[imageStyle]}
            src={src} alt="page"
            onClick={onClick}
          />
        )
      }}
    </ProgressiveImage>
    <div css={buttonContainer()}>
      {
        currentView === 'editing' && <Input placeholder="Set image" onChange={setFile} />
      }
      <Button
        title="Delete image"
        onClick={() => deleteComponent(index)}
      />
    </div>
    </>
  )
}

export default ImageComponent

const buttonContainer = () => css`
  display: flex;
  margin-bottom: 20px;
`

const imageStyle = css`
  margin: 30px 10px;
  box-shadow: 0 30px 60px -10px rgba(0,0,0,0.22), 0 18px 36px -18px rgba(0,0,0,0.25);
`