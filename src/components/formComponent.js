import React from 'react'
import SimpleMDE from "react-simplemde-editor"
import { css } from '@emotion/core'

export default function FormComponent({
  cover_image, title, description, setPost, content
}) {
  const dynamicTextArea = css`
    margin-top: 30px;
  `
  return (
    <>
      {
        cover_image && <img alt="cover" css={coverImage} src={cover_image} />
      }
      <input
        value={title}
        css={[titleInputStyle]}
        placeholder="Post title"
        onChange={e => setPost('title', e.target.value)}
      />
      <input
        value={description}
        css={[descriptionInputStyle]}
        placeholder="Post description"
        onChange={e => setPost('description', e.target.value)}
      />
      <SimpleMDE
        value={content}
        onChange={value => setPost('content', value)}
        css={[dynamicTextArea]}
      />
    </>
  )
}

const coverImage = css`
  margin-top: 20px;
  margin-bottom: 20px;
`

const titleInputStyle = css`
  font-size: 30px;
  border: none;
  outline: none;
  width: 100%;
  margin: 20px 0px 5px;
  font-weight: 300;
  margin-top: 0px;
`

const descriptionInputStyle = css`
  ${titleInputStyle};
  font-size: 20px;
`