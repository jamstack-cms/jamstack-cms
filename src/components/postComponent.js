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
  content, createdAt, description, title, cover_image, context, authorAvatar, authorName
}) {
  let date
  if (createdAt) {
    date = format(createdAt, "MMMM dd yyyy")
  }
  let { theme } = context

  return (
    <div css={postContainer}>
      <h1 css={[titleStyle(theme)]}>{title}</h1>
      <div css={authorContainerStyle}>
        { authorAvatar && <img alt="author" css={authorAvatarStyle} src={authorAvatar} />}
        <p css={authorNameStyle(theme)}>{authorName}</p>
        { createdAt && <p css={[dateStyle(theme)]}>{date}</p>}
      </div>
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

const authorContainerStyle = css`
  width: 680px;
  margin: 0 auto 60px;
  display: flex;
  align-items: center;
  @media (max-width: 700px) {
    width: 100%;
    padding: 0px 25px
  }
  
`

const authorAvatarStyle = css`
  width: 34px;
  height: 34px;
  border-radius: 18px;
  margin-right: 10px;
  border: 2px solid white;
`

const authorNameStyle = ({ secondaryFontColor }) => css`
  color: ${secondaryFontColor};
  font-weight: 500;
  margin-right: 20px;
`

const imageStyle = css`
  border-radius: 5px;
  box-shadow: 0 30px 60px -10px rgba(0,0,0,0.22), 0 18px 36px -18px rgba(0,0,0,0.25);
`

const postContainer = css`
  margin-top: 25px;
`

const contentContainer = css`
  padding: 20px 0px;
  width: 680px;
  margin: 0 auto;
  @media (max-width: 700px) {
    width: 100%;
    padding: 0px 25px
  }
`

const titleStyle = ({ scriptFamily }) => css`
  font-weight: 500;
  font-family: ${scriptFamily};
  font-size: 46px;
  margin: 90px auto 30px;
  width: 680px;
  @media (max-width: 700px) {
    width: 100%;
    padding: 0px 25px;
    margin-top: 50px;
  }
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