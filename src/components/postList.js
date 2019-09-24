import React from 'react'
import { css } from '@emotion/core'
import { slugify } from '../utils/helpers'
import format from 'date-fns/format'
import { Link } from "gatsby"
import { fontFamily, scriptFamily } from '../theme';

export default function PostList ({
  posts, highlight, isAdmin, deletePost, publishPost, unPublishPost
}) {
  const postStyleWithTheme = css`
    border-bottom: 3px solid ${highlight};
  `
  const dateStyleWithTheme = css`
    color: ${highlight};
  `
  
  const dynamicTitleStyle = css`
    font-size: ${isAdmin ? '20px': '32px'};
    line-height: ${isAdmin ? '30px' : '50px'};
  `

  return (
    <>
      {posts.map(post => {
        const title = post.title
        let link = slugify(post.title)
        if (isAdmin) {
          link = `/editpost/${post.id}/${link}`
        }
        return (
          <div css={[postContainer]} key={post.id}>
            {
              isAdmin && (
                <div css={[sideButtonContainer]}>
                  <p onClick={() => deletePost(post)} css={[sideButton]}>Delete</p>
                  {
                    post.published ? (
                      <p onClick={() => unPublishPost(post)} css={[sideButton]}>Unpublish</p>
                    ) : (
                      <p onClick={() => publishPost(post)} css={[publishButton]}>Publish</p>
                    )
                  }
                </div>
              )
            }
            <Link css={[linkStyle]} to={link}>
              <article >
                <div css={[postStyle, postStyleWithTheme]}>
                  <div css={postContentStyle}>
                    <header>
                      <h3 css={[titleStyle, dynamicTitleStyle]}>
                        {title}
                      </h3>
                      <p css={postDescription}>{post.description}</p>
                      {
                        isAdmin && (
                          <div>
                            {
                              post.published ? (
                                <p css={[postDate, dateStyleWithTheme]}>Published {format(new Date(post.createdAt), 'MMMM dd yyyy')}</p>
                              ) : (
                                <p css={[notPublishedStyle]}>Not Published</p>
                              )
                            }
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
    </>
  )
}

const notPublishedStyle = css`
  font-family: ${fontFamily};
  margin: 10px 0px 0px;
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, .3);
`

const sideButton = css`
  font-family: ${fontFamily};
  font-size: 14px;
  opacity: .7;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`

const publishButton = css`
  ${sideButton};
  color: green;
`

const sideButtonContainer = css`
  min-width: 100px;
`

const postContainer = css`
  display: flex;
  align-items: center;
`

const postDescription = css`
  font-weight: 300;
  margin-top: 8px;
  font-size: 20px;
  margin-bottom: 6px;
  font-family: ${scriptFamily}, serif;
`

const postDate = css`
  color: rgba(0, 0, 0, .6);
  margin-bottom: 0px;
  font-size: 14px;
  font-family: ${fontFamily} !important;
`

const postStyle = css`
  margin-bottom: 50px;
`

const postContentStyle = css`
  margin: 10px auto 0px;
  padding: 10px 0px 20px;
  font-family: ${scriptFamily}, serif;
`

const titleStyle = css`
  margin: 5px 0px;
  line-height: 50px;
  font-family: ${scriptFamily}, serif;
  font-weight: 300;
  @media(max-width: 1000px) {
    font-size: 30px;
  }
`
const linkStyle = css`
  color: black;
  box-shadow: none;
  text-decoration: none;
`