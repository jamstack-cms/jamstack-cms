import React from 'react'
import marked from 'marked'
import { css } from '@emotion/core'
import { fontFamily } from '../theme'
import format from 'date-fns/format'
import ProgressiveImage from 'react-progressive-image'
import placeholder from '../images/placeholder.jpg'
import { BlogContext } from '../context/mainContext'


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

function PostComponent({
  content, createdAt, description, title, cover_image, context
}) {
  let date
  if (createdAt) {
    date = format(createdAt, "MMMM dd yyyy")
  }
  let { theme } = context
  const { baseFontWeight, secondaryFontColor, coverImageOpacity } = theme
  const themedTitleStyle = css`
    font-weight: ${baseFontWeight};
  `
  const themedDescription = css`
    color: ${secondaryFontColor};
  `
  return (
    <div css={postContainer}>
      { cover_image && (
        <ProgressiveImage src={cover_image} placeholder={placeholder}>
          {(src, loading) => {
            const themedCoverImageStyle = css`
              opacity: ${loading ? .6 : coverImageOpacity};
            `
            return <img css={themedCoverImageStyle} src={src} alt="an image" />
          }}
        </ProgressiveImage>
      )}
      <div css={contentContainer}>
        <h1 css={[titleStyle, themedTitleStyle]}>{title}</h1>
        <div className="blog-post">
          { description && (
            <h2 css={[descriptionStyle, themedDescription]}>{description}</h2>
          )}
          { createdAt && <Date date={date} />}
          <PostContent content={content} />
        </div>
      </div>
    </div>
  )
}

function PostComponentWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <PostComponent {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

export default PostComponentWithContext

const postContainer = css`
  margin-top: 25px;
`

const contentContainer = css`
  padding: 20px 0px;
`

const titleStyle = css`
  font-weight: 400;
  margin: 0;
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