import React from 'react'
import SimpleMDE from "react-simplemde-editor"
import { css } from '@emotion/core'

function TitleComponent({
  title, setPost
}) {
  return (
    <>
      <input
        value={title}
        css={[titleInputStyle]}
        placeholder="Post title"
        onChange={e => setPost('title', e.target.value)}
      />
    </>
  )
}

function DescriptionComponent({
  description, setPost
}) {
  return (
    <>
      <input
        value={description}
        css={[descriptionInputStyle]}
        placeholder="Post description"
        onChange={e => setPost('description', e.target.value)}
      />
    </>
  )
}

function MarkdownEditor({
  content, setPost
}) {
  const dynamicTextArea = css`
    margin-top: 30px;
  `
  return (
    <SimpleMDE
      value={content}
      onChange={value => setPost('content', value)}
      css={[dynamicTextArea]}
    />
  )
}

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

export {
  TitleComponent, DescriptionComponent, MarkdownEditor
}