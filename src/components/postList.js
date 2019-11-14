import React from 'react'
import { css } from '@emotion/core'
import { slugify } from '../utils/helpers'
import format from 'date-fns/format'
import { Link } from "gatsby"
import { BlogContext } from '../context/mainContext'
import getImageKey from '../utils/getImageKey'

function PostList ({
  posts, isAdmin, deletePost, publishPost, unPublishPost, context, toggleViewState, fixedWidthImages, isLoading
}) {
  const { theme } = context
  const widthIndexes = posts.reduce((acc, next, index) => {
    if (!acc.length) {
      acc.push('wide')
      return acc
    }
    if (acc[index - 1] === 'wide' && acc[index - 2] === 'wide') {
      acc.push('small')
    } else if (acc[index - 1] === 'wide' && acc[index - 2] === 'small') {
      acc.push('wide') 
    } else if (acc[index - 1] === 'small' && acc[index - 2] === 'small') {
      acc.push('wide') 
    } else {
      acc.push('small') 
    }
    return acc
  }, [])
  if (isAdmin && !posts.length && !isLoading) {
    return (
      <div>
        No posts yet! Create your first post <span css={underline(theme)} onClick={() => toggleViewState('createPost')}>here</span>.
      </div>
    )
  }
  return (
    <div css={[postListContainer(isAdmin)]}>
      {posts.map((post, index) => {
        const widthType = widthIndexes[index]
        let cover_image = post.cover_image
        let signed_image = null
        if (cover_image) {
          cover_image = `./downloads/${getImageKey(post.cover_image)}`
          signed_image = post.signedImage
        }
        const title = post.title
        let link = slugify(post.title)
        if (isAdmin) {
          link = `/editpost/${post.id}/${link}`
        }

        return (
          <div css={[postContainer(widthType, fixedWidthImages)]} key={post.id}>
            {
              isAdmin && (
                <div css={[sideButtonContainer(cover_image)]}>
                  <p onClick={() => deletePost(post)} css={[sideButton(theme)]}>Delete</p>
                  {
                    post.published ? (
                      <p onClick={() => unPublishPost(post)} css={[sideButton(theme)]}>Unpublish</p>
                    ) : (
                      <p onClick={() => publishPost(post)} css={[publishButton(theme)]}>Publish</p>
                    )
                  }
                </div>
              )
            }
            <Link css={[linkStyle]} to={link}>
              <article >
                <div css={[postStyle(theme)]}>
                  <div css={postContentStyle}>
                    {
                      cover_image && (
                        <div css={(coverImageContainer(isAdmin))}>
                          <div css={coverImage(isAdmin ? signed_image : cover_image)} />
                          {/* <img src={isAdmin ? signed_image : cover_image} css={coverImage(isAdmin)} /> */}
                        </div>
                      )
                    }
                    <header>
                      <h3 css={[titleStyle(theme, isAdmin)]}>
                        {title}
                      </h3>
                      <p css={[postDescription(theme)]}>{post.description}</p>
                      {
                        isAdmin && (
                          <div>
                            {
                              post.published ? (
                                <p css={[postDate(theme)]}>Published {format(new Date(post.createdAt), 'MMMM dd yyyy')}</p>
                              ) : (
                                <p css={[notPublishedStyle(theme)]}>Not Published</p>
                              )
                            }
                          </div>
                        )
                      }
                      {
                        !isAdmin && (
                          <div>
                            <p css={dateStyle}>{format(new Date(post.createdAt), 'MMMM dd yyyy')}</p>
                          </div>
                        )
                      }
                    </header>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default function PostListWithContext(props) {
  return (
    <BlogContext.Consumer>
      {
        context => <PostList {...props} context={context} />
      }
    </BlogContext.Consumer>
  )
}

const underline = ({ highlight }) => css`
  color: ${highlight};
  cursor: pointer;
  &: hover {
    text-decoration: underline;
  }
`

const dateStyle = css`
  font-weight: 500;
  color: #d1d1d1;
  margin-top: 11px;
  margin-bottom:0px;
`

const postListContainer = isAdmin => css`
  display: ${isAdmin ? 'inline' : 'flex'};
  flex-wrap: wrap;
`

const coverImageContainer = isAdmin => css`
  height: ${isAdmin ? '250px' : '290px'};
  overflow: hidden;
  margin-bottom: 40px;
  text-align:center;
  position: relative;
  box-shadow: 0 30px 60px -10px rgba(0,0,0,0.25), 0 18px 36px -18px rgba(0,0,0,0.30);
  transition: all .45s;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 45px 60px -15px rgba(0,0,0,0.2), 0 45px 36px -25px rgba(0,0,0,0.2);
  }
`

const coverImage = (cover_image) => css`
  background-image: url("${cover_image}");
  background-size: cover;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
`

const notPublishedStyle = ({ fontFamily }) => css`
  font-family: ${fontFamily};
  margin: 10px 0px 0px;
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, .3);
`

const sideButton = ({ fontFamily }) => css`
  font-family: ${fontFamily};
  font-size: 14px;
  opacity: .7;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`

const publishButton = (theme) => css`
  ${sideButton(theme)};
  color: ${theme.highlight};
`

const sideButtonContainer = cover_image => css`
  margin-top: ${cover_image ? "100px" : "50px"};
  min-width: 100px;
`

const postContainer = (widthType, fixedWidthImages) => {
  let width
  if (fixedWidthImages) {
    width = '770px'
  } else {
    width = widthType === 'small' ? '40%' : '53%'
  }
  return css`
  display: flex;
  width: ${width};
  margin: 20px;
  @media (max-width: 1200px) {
    width: 100%;
  }
`
}

const postDescription =  ({ baseFontWeight, secondaryFontColor, fontFamily }) => css`
  font-weight: ${baseFontWeight};
  color: ${secondaryFontColor};
  font-family: ${fontFamily};
  font-weight: 300;
  margin-top: 8px;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 6px;
`

const postDate = ({ fontFamily, highlight }) => css`
  color: rgba(0, 0, 0, .6);
  margin-bottom: 0px;
  color: ${highlight};
  font-size: 14px;
  font-family: ${fontFamily} !important;
`

const postStyle = (theme) => css`
  
`

const postContentStyle = css`
  margin: 10px auto 0px;
  padding: 10px 0px 0px;
`

const titleStyle = (theme, isAdmin) => css`
  font-size: ${isAdmin ? '20px': '28px'};
  line-height: ${isAdmin ? '30px' : '32px'};
  white-space: normal;
  font-weight: ${isAdmin ? '600' : theme.baseFontWeight};
  margin: 5px 0px 10px;
  font-family: ${theme.scriptFamily};
  font-weight: 500;
  @media(max-width: 1000px) {
    font-size: 30px;
  }
`
const linkStyle = css`
  color: black;
  box-shadow: none;
  text-decoration: none;
  width: 100%;
`