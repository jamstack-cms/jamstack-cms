import React from 'react'
import { css } from '@emotion/core'
import {
  TitleComponent, DescriptionComponent, MarkdownEditor
} from './formComponents'

export default function FormComponent({
  cover_image, title, description, setPost, content
}) {
  return (
    <>
      {
        cover_image && <img alt="cover" css={coverImage} src={cover_image} />
      }
      <TitleComponent
        setPost={setPost}
        title={title}
      />
      <DescriptionComponent
        description={description}
        setPost={setPost}
      />
      <MarkdownEditor
        content={content}
        setPost={setPost}
      />
    </>
  )
}

const coverImage = css`
  margin-top: 20px;
  margin-bottom: 20px;
`