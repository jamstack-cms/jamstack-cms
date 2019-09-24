import React from 'react'
import marked from 'marked'
import { css } from '@emotion/core'
import { fontFamily } from '../theme'
import format from 'date-fns/format'

function Title({ title }) {
  return (
    <h1 css={titleStyle}>{title}</h1>
  )
}

function Description({ description }) {
  return (
    <h2 css={descriptionStyle}>{description}</h2>
  )
}

function Date({ date }) {
  return (
    <p css={dateStyle}>{date}</p>
  )
}

function PostContent({ content }) {
  return (
    <section dangerouslySetInnerHTML={getMarkdownText(content)} />
  )
}

function getMarkdownText(markdown) {
  var rawMarkup = marked(markdown, {sanitize: true});
  return { __html: rawMarkup };
}

export default function PostComponent({
  content, createdAt, description, title, cover_image
}) {
  let date
  if (createdAt) {
    const date = format(createdAt, "MMMM dd yyyy")
  }
  return (
    <div css={postContainer}>
      { cover_image && <img css={coverImageStyle} src={cover_image} />}
      <div css={contentContainer} className="blog-post">
        <Title title={title} />
        { description && <Description description={description} />}
        { createdAt && <Date date={date} />}
        <PostContent content={content} />
      </div>
    </div>
  )
}

const postContainer = css`
  margin-top: 25px;
`

const contentContainer = css`
  padding: 20px 0px;
`

const coverImageStyle = css`
  margin-bottom: -10px;
`

const titleStyle = css`
  font-weight: 400;
`

const descriptionStyle = css`
  font-weight: 500;
  font-size: 22px;
  color: rgba(0, 0, 0, .55);
`

const dateStyle = css`
  margin-top: 0px;
  font-size: 15px !important;
  font-family: ${fontFamily} !important;
`