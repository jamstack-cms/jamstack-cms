import React from 'react'
import format from 'date-fns/format'
import marked from 'marked';
import { css } from '@emotion/core'
import { fontFamily } from '../theme'

function getMarkdownText(markdown) {
  var rawMarkup = marked(markdown, {sanitize: true});
  return { __html: rawMarkup };
}

export default function PostPreviewComponent({
  cover_image, title, createdAt, content
}) {
  console.log('cover_image: ', cover_image)
  console.log('title: ', title)
  console.log('createdAt: ', createdAt)
  console.log('content: ', content)
  return (
    <>
      {
        cover_image && <img css={coverImage} src={cover_image} />
      }
      <div css={container} className="blog-post">
        <div>
          <h1>{title}</h1>
          {createdAt && <p css={dateStyle}>{format(new Date(createdAt), 'MMMM dd yyyy')}</p>}
      </div>
      <section dangerouslySetInnerHTML={getMarkdownText(content)} />
      </div>
    </>
  )
}

const dateStyle = css`
  font-size: 14px !important;
  color: rgba(0, 0, 0, .5);
  font-family: ${fontFamily} !important;
`

const coverImage = css`
  margin: 0px;
`

const container = css`
  padding: 20px 0px;
`