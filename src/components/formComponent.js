import React from 'react'
import { css } from '@emotion/core'
import {
  TitleComponent, DescriptionComponent, MarkdownEditor
} from './formComponents'
import { BlogContext } from '../context/mainContext'

function FormComponent({
  cover_image, title, description, setPost, content, context: { theme }
}) {
  return (
    <>
      {
        cover_image && <img alt="cover" css={coverImage} src={cover_image} />
      }
      <TitleComponent
        setPost={setPost}
        title={title}
        theme={theme}
      />
      <DescriptionComponent
        description={description}
        setPost={setPost}
        theme={theme}
      />
      <MarkdownEditor
        content={content}
        setPost={setPost}
        theme={theme}
      />
    </>
  )
}

export default function FormComponentContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <FormComponent {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

const coverImage = css`
  margin-top: 20px;
  margin-bottom: 20px;
`