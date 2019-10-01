import React from 'react'
import SimpleMDE from "react-simplemde-editor"
import { css } from '@emotion/core'

function TitleComponent({
  title, setPost, theme
}) {
  return (
    <>
      <input
        value={title}
        css={[titleInputStyle(theme)]}
        placeholder="Post title"
        onChange={e => setPost('title', e.target.value)}
      />
    </>
  )
}

function DescriptionComponent({
  description, setPost, theme
}) {
  return (
    <>
      <input
        value={description}
        css={[descriptionInputStyle(theme)]}
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

const titleInputStyle = ({ primaryFontColor }) => css`
  color: ${primaryFontColor};
  background-color: transparent;
  font-size: 30px;
  border: none;
  outline: none;
  width: 100%;
  margin: 20px 0px 5px;
  font-weight: 300;
  margin-top: 0px;
`

const descriptionInputStyle = (theme) => css`
  ${titleInputStyle(theme)};
  font-size: 20px;
`

export {
  TitleComponent, DescriptionComponent, MarkdownEditor
}