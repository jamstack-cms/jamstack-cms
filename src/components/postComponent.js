import React from 'react'
import marked from 'marked'
import { css } from '@emotion/core'
import format from 'date-fns/format'
import ProgressiveImage from 'react-progressive-image'
import placeholder from '../images/placeholder.jpg'
import { BlogContext } from '../context/mainContext'


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

  return (
    <div css={postContainer}>
      <h1 css={[titleStyle(theme)]}>{title}</h1>
      { cover_image && (
        <ProgressiveImage src={cover_image} placeholder={placeholder}>
          {(src, loading) => {
            const themedCoverImageStyle = css`
              opacity: ${loading ? .8 : 1};
            `
            return <img css={[imageStyle, themedCoverImageStyle]} src={src} alt="cover" />
          }}
        </ProgressiveImage>
      )}
      <div css={contentContainer}>
        { description && (
          <h2 css={[descriptionStyle(theme)]}>{description}</h2>
        )}
        <div className="blog-post">
          { createdAt && <p css={[dateStyle(theme)]}>{date}</p>}
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

const imageStyle = css`
  box-shadow: 0 30px 60px -10px rgba(0,0,0,0.22), 0 18px 36px -18px rgba(0,0,0,0.25);
`

const postContainer = css`
  margin-top: 25px;
`

const contentContainer = css`
  padding: 20px 0px;
  width: 680px;
  margin: 0 auto;
`

const titleStyle = ({ scriptFamily }) => css`
  font-weight: 500;
  font-family: ${scriptFamily};
  font-size: 46px;
  margin: 90px auto 80px;
  width: 680px;
`

const descriptionStyle = ({ primaryFontColor, scriptFamily }) =>  css`
  font-weight: 500;
  color: ${primaryFontColor};
  font-family: ${scriptFamily};
  font-size: 28px;
  line-height: 32px;
`

const dateStyle = ({ fontFamily, highlight }) => css`
  margin-top: 0px;
  font-size: 15px !important;
  font-family: ${fontFamily} !important;
  color: ${highlight};
`