import React from 'react'
import { css } from '@emotion/core'
import { slugify } from '../utils/helpers'
import format from 'date-fns/format'
import { Link } from "gatsby"
import { fontFamily } from '../theme';

export default function PostList ({ posts, highlight, isAdmin, deletePost }) {
  const postStyleWithTheme = css`
    border-bottom: 3px solid ${highlight};
  `
  const dateStyleWithTheme = css`
    color: ${highlight};
  `

  const linkStyleWithTheme = css`
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
                <div css={deleteButtonContainer}>
                  <p onClick={() => deletePost(post)} css={deleteButton}>Delete</p>
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
                      <p css={[postDate, dateStyleWithTheme]}>{format(new Date(post.createdAt), 'MMMM dd yyyy')}</p>
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

const deleteButton = css`
  font-family: ${fontFamily};
  font-size: 14px;
  opacity: .7;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`

const deleteButtonContainer = css`
  padding: 0px 20px;
`

const postContainer = css`
  display: flex;
  align-items: center;
`

const postDescription = css`
  font-weight: 700;
  margin-top: 8px;
  margin-bottom: 6px;
  font-family: EB Garamond, serif;
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
  font-family: EB Garamond, serif;
`

const titleStyle = css`
  margin: 5px 0px;
  line-height: 50px;
  font-family: EB Garamond, serif;
  font-weight: 300;
  @media(max-width: 1000px) {
    font-size: 30px;
  }
`
const linkStyle = css`
  box-shadow: none;
  color: black;
  text-decoration: none;
`